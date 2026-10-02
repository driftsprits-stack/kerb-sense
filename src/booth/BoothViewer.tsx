import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Html, OrbitControls, OrthographicCamera, Outlines, useGLTF } from '@react-three/drei';
import { useMemo, useRef, useState, type JSX } from 'react';
import { Color, Group, Mesh, MeshBasicMaterial, Vector3, type Material, type Object3D } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { explodeOffset, labelForNode } from '../lib/explode';
import { VIEWS, shortestAngle, type ViewName } from '../lib/views';

// The booth, drawn flat. An orthographic camera, unlit MeshBasicMaterial in
// the seven palette colours, a solid black outline, no lights, no
// environment, no shadows. Everything moves with transforms only.

const PALETTE: Record<string, string> = {
  kerb_white: '#FFFFFF',
  kerb_black: '#000000',
  kerb_red: '#AC1E39',
  kerb_yellow: '#E1B913',
  kerb_green: '#178048',
  kerb_blue: '#214EA0',
  kerb_lblue: '#3D99C9',
};

// drei's useGLTF sets the meshopt decoder by default.
const MODEL_URL = `${import.meta.env.BASE_URL}models/booth-flat.glb`;
const TARGET = new Vector3(0, 0.33, 0);
const VISIBLE_HEIGHT_M = 0.92;

function hasOffset(name: string): boolean {
  const [x, y, z] = explodeOffset(name, 1);
  return x !== 0 || y !== 0 || z !== 0;
}

function flatMaterial(source: Material | Material[]): MeshBasicMaterial | MeshBasicMaterial[] {
  const list = (Array.isArray(source) ? source : [source]).map(
    (m) => new MeshBasicMaterial({ color: new Color(PALETTE[m.name] ?? '#FFFFFF'), toneMapped: false }),
  );
  return list.length === 1 ? (list[0] as MeshBasicMaterial) : list;
}

interface NodeProps {
  object: Object3D;
  register: (name: string, group: Group) => void;
  onOver: (name: string, e: ThreeEvent<PointerEvent>) => void;
  onOut: () => void;
  partName: string;
}

// Rebuilds the GLB hierarchy as JSX, so drei's Outlines can sit inside each
// mesh and the explode offsets can move each named group.
function Node({ object, register, onOver, onOut, partName }: NodeProps) {
  const name = object.name && hasOffset(object.name) ? object.name : partName;
  const material = useMemo(
    () => ((object as Mesh).isMesh ? flatMaterial((object as Mesh).material) : null),
    [object],
  );
  const children: JSX.Element[] = object.children.map((child) => (
    <Node key={child.uuid} object={child} register={register} onOver={onOver} onOut={onOut} partName={name} />
  ));
  const transform = {
    position: object.position,
    quaternion: object.quaternion,
    scale: object.scale,
  };
  if ((object as Mesh).isMesh && material) {
    const mesh = object as Mesh;
    return (
      <group {...transform} ref={(g) => g && register(object.name, g)}>
        <mesh
          geometry={mesh.geometry}
          material={material}
          onPointerOver={(e) => onOver(name, e)}
          onPointerOut={onOut}
        >
          <Outlines thickness={0.005} color="#000000" />
        </mesh>
        {children}
      </group>
    );
  }
  return (
    <group {...transform} name={object.name} ref={(g) => g && register(object.name, g)}>
      {children}
    </group>
  );
}

interface BoothProps {
  exploded: boolean;
  view: ViewName | null;
  onViewReached: () => void;
  onHover: (label: string | null) => void;
  reduced: boolean;
}

function BoothModel({ exploded, view, onViewReached, onHover, reduced }: BoothProps) {
  const { scene } = useGLTF(MODEL_URL);
  const controls = useRef<OrbitControlsImpl>(null);
  const explodeT = useRef(0);
  const groups = useRef(new Map<string, { group: Group; base: Vector3 }>());
  const [hovered, setHovered] = useState<{ name: string; point: Vector3 } | null>(null);
  const { size } = useThree();

  const register = (name: string, group: Group) => {
    if (!name || !hasOffset(name)) return;
    if (!groups.current.has(name)) groups.current.set(name, { group, base: group.position.clone() });
  };

  // Explode and snap run in the frame loop. The last input wins: a new view
  // or toggle changes the target, and the loop moves toward it.
  useFrame((_, delta) => {
    const target = exploded ? 1 : 0;
    const speed = reduced ? 1000 : 4;
    explodeT.current +=
      Math.sign(target - explodeT.current) * Math.min(Math.abs(target - explodeT.current), delta * speed);
    for (const [name, { group, base }] of groups.current) {
      const [x, y, z] = explodeOffset(name, explodeT.current);
      group.position.set(base.x + x, base.y + y, base.z + z);
    }

    const ctrl = controls.current;
    if (view && ctrl) {
      const goal = VIEWS[view];
      const az = ctrl.getAzimuthalAngle();
      const po = ctrl.getPolarAngle();
      const dAz = shortestAngle(az, goal.azimuth);
      const dPo = goal.polar - po;
      const k = reduced ? 1 : Math.min(1, delta * 8);
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
      if (Math.abs(dAz) < 0.002 && Math.abs(dPo) < 0.002) onViewReached();
    }
  });

  const onOver = (name: string, e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered({ name, point: e.point.clone() });
    onHover(labelForNode(name));
  };
  const onOut = () => {
    setHovered(null);
    onHover(null);
  };

  return (
    <>
      {/* Fit the booth to the stage height, whatever its size. */}
      <OrthographicCamera
        makeDefault
        position={[0, 0.33, 3]}
        zoom={size.height / VISIBLE_HEIGHT_M}
        near={0.01}
        far={20}
      />
      <OrbitControls
        ref={controls}
        enableZoom={false}
        enablePan={false}
        enableDamping={!reduced}
        dampingFactor={0.12}
        target={TARGET}
        makeDefault
      />
      <group position={[0, -0.02, 0]}>
        {scene.children.map((child) => (
          <Node
            key={child.uuid}
            object={child}
            register={register}
            onOver={onOver}
            onOut={onOut}
            partName="cabinet"
          />
        ))}
      </group>
      {hovered && (
        <Html position={hovered.point} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
          <span className="ks-label whitespace-nowrap text-16" data-testid="booth-label">
            {labelForNode(hovered.name)}
          </span>
        </Html>
      )}
    </>
  );
}

export interface BoothViewerProps {
  exploded: boolean;
  view: ViewName | null;
  onViewReached: () => void;
  onHover: (label: string | null) => void;
  reduced: boolean;
  canvasLabel: string;
}

export default function BoothViewer(props: BoothViewerProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      frameloop="always"
      style={{ touchAction: 'pan-y', width: '100%', height: '100%' }}
      aria-label={props.canvasLabel}
      role="img"
      data-testid="booth-canvas"
    >
      <BoothModel {...props} />
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
