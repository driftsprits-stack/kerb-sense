import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber';
import { Html, OrbitControls, Outlines, useGLTF } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState, type JSX, type RefObject } from 'react';
import { Color, Group, Mesh, MeshBasicMaterial, Vector3, type Material, type Object3D } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { explodeOffset, nodeMoves, nodePart, partById_ } from '../lib/parts';
import { VIEWS, power2InOut, shortestAngle, type ViewName } from '../lib/views';

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
// The booth's height, and the diagonal of its 70 x 65 cm footprint, in metres.
// From a raised, turned camera the footprint can show along its diagonal.
const BOOTH_H = 0.75;
const BOOTH_D = 0.95;
// With an orthographic camera drei's Outlines thickness is in pixels.
const OUTLINE_PX = 2;
const OUTLINE_HIT_PX = 4;

/** The scroll tour writes here as the page scrolls. The viewer reads it when active. */
export interface SceneDrive {
  active: boolean;
  /** Azimuth in radians. */
  azimuth: number;
  /** Polar angle in radians. */
  polar: number;
  /** 0 is assembled, 1 is fully exploded. */
  explode: number;
  /** The part to highlight, or null. */
  part: string | null;
}

/** The camera angles the viewer reports after each frame, for tests and labels. */
export interface CameraReport {
  azimuth: number;
  polar: number;
}

/** The centre of a mesh's geometry, in its own space. */
function centreOf(mesh: Mesh): Vector3 {
  const geo = mesh.geometry;
  if (!geo.boundingBox) geo.computeBoundingBox();
  return geo.boundingBox?.getCenter(new Vector3()) ?? new Vector3();
}

function flatMaterial(source: Material | Material[]): MeshBasicMaterial[] {
  return (Array.isArray(source) ? source : [source]).map(
    (m) => new MeshBasicMaterial({ color: new Color(PALETTE[m.name] ?? '#FFFFFF'), toneMapped: false }),
  );
}

// Hotspots, after Apple's "closer look": a "+" on three parts that opens the
// part's detail. Each faces one way; it hides (and leaves the tab order) when
// the camera is behind it, so a "+" never shows through the cabinet.
const HOTSPOTS: { node: string; part: string; facing: [number, number, number] }[] = [
  { node: 'screen_glass', part: 'screen', facing: [0, 0.3, 1] },
  // The joystick group has no mesh of its own; its shaft carries the "+".
  { node: 'joystick_shaft', part: 'joystick', facing: [0.2, 1, 0.5] },
  { node: 'latch_left', part: 'latches', facing: [0, 0.2, -1] },
];
const HOTSPOT_NODES = new Set(HOTSPOTS.map((h) => h.node));

interface NodeProps {
  object: Object3D;
  registerGroup: (name: string, group: Group, base: Vector3) => void;
  registerHotspot: (name: string, mesh: Mesh) => void;
  registerMesh: (part: string, mesh: Mesh, base: MeshBasicMaterial[]) => void;
  onOver: (part: string, e: ThreeEvent<PointerEvent>) => void;
  onOut: () => void;
  onClick: (part: string, e: ThreeEvent<MouseEvent>) => void;
  highlighted: string | null;
  /** The part of the nearest named ancestor. An unnamed mesh belongs to it. */
  inherited: string;
}

// Rebuilds the GLB hierarchy as JSX, so drei's Outlines can sit inside each
// mesh, every mesh knows which part it belongs to, and the explode offsets
// can move each named group.
function Node({
  object,
  registerGroup,
  registerHotspot,
  registerMesh,
  onOver,
  onOut,
  onClick,
  highlighted,
  inherited,
}: NodeProps) {
  const part = nodePart(object.name) ?? inherited;
  const base = useMemo(
    () => ((object as Mesh).isMesh ? flatMaterial((object as Mesh).material) : null),
    [object],
  );
  const children: JSX.Element[] = object.children.map((child) => (
    <Node
      key={child.uuid}
      object={child}
      registerGroup={registerGroup}
      registerHotspot={registerHotspot}
      registerMesh={registerMesh}
      onOver={onOver}
      onOut={onOut}
      onClick={onClick}
      highlighted={highlighted}
      inherited={part}
    />
  ));
  const transform = {
    position: object.position.clone(),
    quaternion: object.quaternion,
    scale: object.scale,
    ref: nodeMoves(object.name)
      ? (g: Group | null) => {
          if (g) registerGroup(object.name, g, object.position);
        }
      : null,
  };
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
          ref={(m) => {
            if (!m) return;
            registerMesh(part, m, base);
            if (HOTSPOT_NODES.has(object.name)) registerHotspot(object.name, m);
          }}
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
  /** The hotspot buttons, by node name, drawn over the canvas. */
  hotspotEls?: RefObject<Map<string, HTMLElement>> | undefined;
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
  hotspotEls,
}: BoothProps) {
  const { scene } = useGLTF(MODEL_URL);
  const controls = useRef<OrbitControlsImpl>(null);
  const meshes = useRef(new Map<string, { mesh: Mesh; base: MeshBasicMaterial[] }[]>());
  const groups = useRef(new Map<string, { group: Group; base: Vector3 }>());
  const explodeT = useRef(0);
  const move = useRef<{ view: ViewName; start: number; az: number; po: number; dAz: number } | null>(null);
  const [hovered, setHovered] = useState<{ part: string; point: Vector3 } | null>(null);
  const [scenePart, setScenePart] = useState<string | null>(null);
  const lastReport = useRef<CameraReport>({ azimuth: NaN, polar: NaN });
  const lastReportAt = useRef(-1);
  const highlighted = scenePart ?? selected;

  // The mesh each hotspot follows. The buttons live in a DOM overlay
  // (BoothViewer); the frame loop moves them.
  const hotspotMesh = useRef(new Map<string, Mesh>());
  const registerHotspot = (name: string, mesh: Mesh) => {
    hotspotMesh.current.set(name, mesh);
  };
  const registerGroup = (name: string, group: Group, base: Vector3) => {
    if (!groups.current.has(name)) groups.current.set(name, { group, base: base.clone() });
  };
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
    // Fit the booth to the stage height, whatever its size. From a raised
    // camera the booth's depth shows too, so frame its projected height; and
    // zoom out as the parts move apart, so they stay inside the frame.
    const polar = controls.current?.getPolarAngle() ?? Math.PI / 2;
    const projected = (BOOTH_H * Math.sin(polar) + BOOTH_D * Math.abs(Math.cos(polar))) / BOOTH_H;
    const wantedZoom = state.size.height / (VISIBLE_HEIGHT_M * projected * (1 + 0.6 * explodeT.current));
    if (Math.abs(state.camera.zoom - wantedZoom) > 0.5) {
      state.camera.zoom = wantedZoom;
      state.camera.updateProjectionMatrix();
    }

    const sceneDrive = drive?.current;
    const driving = Boolean(sceneDrive?.active);
    const wanted = driving ? (sceneDrive?.part ?? null) : null;
    if (wanted !== scenePart) setScenePart(wanted);

    // The parts move apart only while the tour drives the booth.
    const target = driving ? (sceneDrive?.explode ?? 0) : 0;
    const speed = reduced || driving ? 1000 : 4;
    explodeT.current +=
      Math.sign(target - explodeT.current) * Math.min(Math.abs(target - explodeT.current), delta * speed);
    for (const [name, { group, base }] of groups.current) {
      const [x, y, z] = explodeOffset(name, explodeT.current);
      group.position.set(base.x + x, base.y + y, base.z + z);
    }

    const ctrl = controls.current;
    if (!ctrl) return;
    let next: { azimuth: number; polar: number } | null = null;
    if (driving) {
      // The scroll owns the camera: follow it exactly, no lag.
      move.current = null;
      next = { azimuth: sceneDrive?.azimuth ?? 0, polar: sceneDrive?.polar ?? Math.PI / 2 };
    } else if (view) {
      // A preset: one 300 ms power2.inOut move from wherever the camera is.
      // A new choice starts a new move from the current angles.
      const goal = VIEWS[view];
      const now = state.clock.elapsedTime;
      if (!move.current || move.current.view !== view) {
        const az = ctrl.getAzimuthalAngle();
        move.current = {
          view,
          start: now,
          az,
          po: ctrl.getPolarAngle(),
          dAz: shortestAngle(az, goal.azimuth),
        };
      }
      const m = move.current;
      const t = reduced ? 1 : Math.min(1, (now - m.start) / 0.3);
      const k = power2InOut(t);
      next = { azimuth: m.az + m.dAz * k, polar: m.po + (goal.polar - m.po) * k };
      if (t >= 1) {
        move.current = null;
        onViewReached();
      }
    }
    if (next) {
      ctrl.minAzimuthAngle = next.azimuth;
      ctrl.maxAzimuthAngle = next.azimuth;
      ctrl.minPolarAngle = next.polar;
      ctrl.maxPolarAngle = next.polar;
      ctrl.update();
      ctrl.minAzimuthAngle = -Infinity;
      ctrl.maxAzimuthAngle = Infinity;
      ctrl.minPolarAngle = 0;
      ctrl.maxPolarAngle = Math.PI;
    }
    // Each "+" follows its part on screen (also while exploded) and shows
    // only when the part faces the camera.
    const toCamera = state.camera.position.clone().sub(TARGET).normalize();
    for (const h of HOTSPOTS) {
      const mesh = hotspotMesh.current.get(h.node);
      const el = hotspotEls?.current.get(h.node);
      if (!mesh || !el) continue;
      const facing = new Vector3(...h.facing).normalize().dot(toCamera) > 0.2;
      if (el.hidden === facing) el.hidden = !facing;
      if (!facing) continue;
      const p = mesh.localToWorld(centreOf(mesh)).project(state.camera);
      const x = ((p.x + 1) / 2) * state.size.width;
      const y = ((1 - p.y) / 2) * state.size.height;
      el.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px) translate(-50%, -50%)`;
    }
    // Report the camera to the page at most every 100 ms, and only when the
    // whole-degree readout would change, so the page does not re-render on
    // every frame. The camera itself never waits for this.
    const deg = (r: number) => Math.round((r * 180) / Math.PI);
    const az = ctrl.getAzimuthalAngle();
    const po = ctrl.getPolarAngle();
    const now = state.clock.elapsedTime;
    if (
      now - lastReportAt.current >= 0.1 &&
      (deg(az) !== deg(lastReport.current.azimuth) || deg(po) !== deg(lastReport.current.polar))
    ) {
      lastReportAt.current = now;
      lastReport.current = { azimuth: az, polar: po };
      onCamera?.({ azimuth: Math.round(az * 100) / 100, polar: Math.round(po * 100) / 100 });
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
            registerGroup={registerGroup}
            registerHotspot={registerHotspot}
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
  const hotspotEls = useRef(new Map<string, HTMLElement>());
  const overlay = useRef<HTMLDivElement>(null);
  const { selected, onSelect, interactive } = props;
  // Draw frames only while the stage is on screen; the loop stops otherwise.
  const [onScreen, setOnScreen] = useState(true);
  useEffect(() => {
    const el = overlay.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => setOnScreen(entries.some((e) => e.isIntersecting)), {
      rootMargin: '100px 0px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <>
      <Canvas
        orthographic
        camera={{ position: [0, 0.33, 3], zoom: 600, near: 0.01, far: 20 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        frameloop={onScreen ? 'always' : 'never'}
        style={{ touchAction: 'pan-y', width: '100%', height: '100%' }}
        aria-label={canvasLabel}
        role="img"
        data-testid="booth-canvas"
      >
        <BoothModel {...props} hotspotEls={hotspotEls} />
        <Ready onReady={onReady} />
      </Canvas>
      {/* Hotspots, after Apple's "closer look". Hidden until the frame loop places them. */}
      <div ref={overlay} className="pointer-events-none absolute inset-0 overflow-hidden">
        {HOTSPOTS.map((h) => {
          const on = selected === h.part;
          return (
            <button
              key={h.node}
              ref={(el) => {
                if (el) hotspotEls.current.set(h.node, el);
              }}
              type="button"
              hidden
              className={`ks-block pointer-events-auto absolute left-0 top-0 flex h-5 w-5 items-center justify-center border-2 border-white text-20 text-white ${on ? 'bg-green' : 'bg-black hover:bg-green'}`}
              aria-label={`Show the ${(partById_(h.part)?.name ?? h.part).toLowerCase()}`}
              aria-pressed={on}
              onClick={() => interactive && onSelect(on ? null : h.part)}
              data-testid={`hotspot-${h.part}`}
            >
              +
            </button>
          );
        })}
      </div>
    </>
  );
}

useGLTF.preload(MODEL_URL);
