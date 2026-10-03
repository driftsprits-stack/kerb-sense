import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber';
import { Html, OrbitControls, Outlines, useGLTF } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState, type JSX, type RefObject } from 'react';
import { Color, Mesh, MeshBasicMaterial, Vector3, type Material, type Object3D } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { nodePart, partById_ } from '../lib/parts';
import { VIEWS, shortestAngle, type ViewName } from '../lib/views';

// The booth, drawn flat. An orthographic camera, unlit MeshBasicMaterial in
// black, white and green, a solid black outline, no lights, no environment,
// no shadows. Everything moves with transforms only.

const PALETTE: Record<string, string> = {
  kerb_white: '#FFFFFF',
  kerb_black: '#000000',
  kerb_green: '#178048',
};
const WHITE = new Color('#FFFFFF');
const GREEN = new Color('#178048');

// drei's useGLTF sets the meshopt decoder by default.
const MODEL_URL = `${import.meta.env.BASE_URL}models/booth-flat.glb`;
const TARGET = new Vector3(0, 0.33, 0);
const VISIBLE_HEIGHT_M = 0.92;
// With an orthographic camera drei's Outlines thickness is in pixels.
const OUTLINE_PX = 2;
const OUTLINE_HIT_PX = 4;

/** The scroll scene writes here every frame. The viewer reads it when active. */
export interface SceneDrive {
  active: boolean;
  /** Azimuth in radians. */
  azimuth: number;
  /** The part to highlight, or null. */
  part: string | null;
}

/** The camera angles the viewer reports after each frame, for tests and labels. */
export interface CameraReport {
  azimuth: number;
  polar: number;
}

function flatMaterial(source: Material | Material[]): MeshBasicMaterial[] {
  return (Array.isArray(source) ? source : [source]).map(
    (m) => new MeshBasicMaterial({ color: new Color(PALETTE[m.name] ?? '#FFFFFF'), toneMapped: false }),
  );
}

interface NodeProps {
  object: Object3D;
  registerMesh: (part: string, mesh: Mesh, base: MeshBasicMaterial[]) => void;
  onOver: (part: string, e: ThreeEvent<PointerEvent>) => void;
  onOut: () => void;
  onClick: (part: string, e: ThreeEvent<MouseEvent>) => void;
  highlighted: string | null;
  /** The part of the nearest named ancestor. An unnamed mesh belongs to it. */
  inherited: string;
}

// Rebuilds the GLB hierarchy as JSX, so drei's Outlines can sit inside each
// mesh and every mesh knows which part it belongs to.
function Node({ object, registerMesh, onOver, onOut, onClick, highlighted, inherited }: NodeProps) {
  const part = nodePart(object.name) ?? inherited;
  const base = useMemo(
    () => ((object as Mesh).isMesh ? flatMaterial((object as Mesh).material) : null),
    [object],
  );
  const children: JSX.Element[] = object.children.map((child) => (
    <Node
      key={child.uuid}
      object={child}
      registerMesh={registerMesh}
      onOver={onOver}
      onOut={onOut}
      onClick={onClick}
      highlighted={highlighted}
      inherited={part}
    />
  ));
  const transform = { position: object.position, quaternion: object.quaternion, scale: object.scale };
  const isHit = highlighted === part;
  if ((object as Mesh).isMesh && base) {
    const mesh = object as Mesh;
    const material: MeshBasicMaterial | MeshBasicMaterial[] =
      base.length === 1 ? (base[0] as MeshBasicMaterial) : base;
    return (
      <group {...transform}>
        <mesh
          geometry={mesh.geometry}
          material={material}
          ref={(m) => m && registerMesh(part, m, base)}
          onPointerOver={(e) => onOver(part, e)}
          onPointerOut={onOut}
          onClick={(e) => onClick(part, e)}
        >
          <Outlines thickness={isHit ? OUTLINE_HIT_PX : OUTLINE_PX} color={isHit ? '#178048' : '#000000'} />
        </mesh>
        {children}
      </group>
    );
  }
  return (
    <group {...transform} name={object.name}>
      {children}
    </group>
  );
}

export interface BoothProps {
  view: ViewName | null;
  onViewReached: () => void;
  selected: string | null;
  onSelect: (part: string | null) => void;
  onHover: (part: string | null) => void;
  reduced: boolean;
  interactive: boolean;
  drive?: RefObject<SceneDrive> | undefined;
  onCamera?: ((report: CameraReport) => void) | undefined;
}

function BoothModel({
  view,
  onViewReached,
  selected,
  onSelect,
  onHover,
  reduced,
  interactive,
  drive,
  onCamera,
}: BoothProps) {
  const { scene } = useGLTF(MODEL_URL);
  const controls = useRef<OrbitControlsImpl>(null);
  const meshes = useRef(new Map<string, { mesh: Mesh; base: MeshBasicMaterial[] }[]>());
  const [hovered, setHovered] = useState<{ part: string; point: Vector3 } | null>(null);
  const [scenePart, setScenePart] = useState<string | null>(null);
  const lastReport = useRef<CameraReport>({ azimuth: NaN, polar: NaN });
  const highlighted = scenePart ?? selected;

  const registerMesh = (part: string, mesh: Mesh, base: MeshBasicMaterial[]) => {
    const list = meshes.current.get(part) ?? [];
    if (!list.some((m) => m.mesh === mesh)) meshes.current.set(part, [...list, { mesh, base }]);
  };

  // A highlighted part turns green. White parts take the green fill; black
  // and green parts keep their fill and show the thick green outline.
  useEffect(() => {
    for (const [part, list] of meshes.current) {
      for (const { mesh, base } of list) {
        const on = part === highlighted;
        const mats = base.map((b) => {
          if (!on || !b.color.equals(WHITE)) return b;
          const m = b.clone();
          m.color.copy(GREEN);
          return m;
        });
        mesh.material = mats.length === 1 ? (mats[0] as MeshBasicMaterial) : mats;
      }
    }
  }, [highlighted]);

  // The camera snaps run in the frame loop. The last input wins: a new view
  // changes the target and the loop moves toward it. When the scroll scene
  // drives the booth, its azimuth is the target.
  useFrame((state, delta) => {
    // Fit the booth to the stage height, whatever its size.
    const wantedZoom = state.size.height / VISIBLE_HEIGHT_M;
    if (Math.abs(state.camera.zoom - wantedZoom) > 0.5) {
      state.camera.zoom = wantedZoom;
      state.camera.updateProjectionMatrix();
    }

    const sceneDrive = drive?.current;
    const driving = Boolean(sceneDrive?.active);
    const wanted = driving ? (sceneDrive?.part ?? null) : null;
    if (wanted !== scenePart) setScenePart(wanted);

    const ctrl = controls.current;
    if (!ctrl) return;
    let goal: { azimuth: number; polar: number } | null = null;
    if (driving) goal = { azimuth: sceneDrive?.azimuth ?? 0, polar: Math.PI / 2 };
    else if (view) goal = VIEWS[view];
    if (goal) {
      const az = ctrl.getAzimuthalAngle();
      const po = ctrl.getPolarAngle();
      const dAz = shortestAngle(az, goal.azimuth);
      const dPo = goal.polar - po;
      const k = reduced || driving ? 1 : Math.min(1, delta * 8);
      const nextAz = az + dAz * k;
      const nextPo = po + dPo * k;
      ctrl.minAzimuthAngle = nextAz;
      ctrl.maxAzimuthAngle = nextAz;
      ctrl.minPolarAngle = nextPo;
      ctrl.maxPolarAngle = nextPo;
      ctrl.update();
      ctrl.minAzimuthAngle = -Infinity;
      ctrl.maxAzimuthAngle = Infinity;
      ctrl.minPolarAngle = 0;
      ctrl.maxPolarAngle = Math.PI;
      if (!driving && Math.abs(dAz) < 0.002 && Math.abs(dPo) < 0.002) onViewReached();
    }
    // Report the camera when it moves, rounded so the report is quiet.
    const report = {
      azimuth: Math.round(ctrl.getAzimuthalAngle() * 100) / 100,
      polar: Math.round(ctrl.getPolarAngle() * 100) / 100,
    };
    if (report.azimuth !== lastReport.current.azimuth || report.polar !== lastReport.current.polar) {
      lastReport.current = report;
      onCamera?.(report);
    }
  });

  const onOver = (part: string, e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!interactive) return;
    setHovered({ part, point: e.point.clone() });
    onHover(part);
  };
  const onOut = () => {
    setHovered(null);
    onHover(null);
  };
  const onClick = (part: string, e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!interactive) return;
    onSelect(selected === part ? null : part);
  };

  return (
    <>
      <OrbitControls
        ref={controls}
        enableZoom={false}
        enablePan={false}
        enableRotate={interactive}
        enableDamping={!reduced}
        dampingFactor={0.12}
        target={TARGET}
        makeDefault
      />
      <group position={[0, -0.02, 0]} onPointerMissed={() => interactive && onSelect(null)}>
        {scene.children.map((child) => (
          <Node
            key={child.uuid}
            object={child}
            registerMesh={registerMesh}
            onOver={onOver}
            onOut={onOut}
            onClick={onClick}
            highlighted={highlighted}
            inherited="cabinet"
          />
        ))}
      </group>
      {hovered && (
        <Html position={hovered.point} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
          <span className="ks-label whitespace-nowrap text-16" data-testid="booth-label">
            {partById_(hovered.part)?.name ?? 'CABINET'}
          </span>
        </Html>
      )}
    </>
  );
}

export interface BoothViewerProps extends BoothProps {
  canvasLabel: string;
  onReady?: (() => void) | undefined;
}

function Ready({ onReady }: { onReady?: (() => void) | undefined }) {
  useEffect(() => {
    onReady?.();
  }, [onReady]);
  return null;
}

export default function BoothViewer({ canvasLabel, onReady, ...props }: BoothViewerProps) {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0.33, 3], zoom: 600, near: 0.01, far: 20 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      frameloop="always"
      style={{ touchAction: 'pan-y', width: '100%', height: '100%' }}
      aria-label={canvasLabel}
      role="img"
      data-testid="booth-canvas"
    >
      <BoothModel {...props} />
      <Ready onReady={onReady} />
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
