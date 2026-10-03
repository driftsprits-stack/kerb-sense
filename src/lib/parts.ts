// The booth parts: the catalogue, the GLB node names behind each part and
// the order the scroll scene highlights them in. Names and purposes are
// display text in Kerb Block (capitals, digits, a few marks). Purposes
// come from CONTENT.md and the proposal.

/** A part of the booth. Several GLB nodes can belong to one part. */
export interface PartInfo {
  /** The part id, shared by the model, the catalogue and the labels. */
  id: string;
  /** The GLB node names that belong to this part. */
  nodes: readonly string[];
  /** The display name, without a full stop. */
  name: string;
  /** Two to four words on what the part does. */
  purpose: string;
  /** The catalogue image key, relative to src/assets. */
  image?: string;
}

export const PARTS: readonly PartInfo[] = [
  {
    id: 'screen',
    nodes: ['screen_glass'],
    name: 'SCREEN GLASS',
    purpose: 'COVERS THE MONITOR',
    image: 'v2/parts/01-screen-glass.svg',
  },
  {
    id: 'joystick',
    nodes: ['joystick', 'joystick_button', 'joystick_shaft', 'joystick_dust_washer'],
    name: 'JOYSTICK',
    purpose: 'MOVES THE PLAYER',
    image: 'v2/parts/02-joystick.svg',
  },
  {
    id: 'buttons',
    nodes: ['button_up', 'button_down', 'button_left', 'button_right'],
    name: 'MOVEMENT BUTTONS X4',
    purpose: 'UP, DOWN, LEFT, RIGHT',
    image: 'v2/parts/03-movement-buttons.svg',
  },
  {
    id: 'hinges',
    nodes: ['hinge_left', 'hinge_right'],
    name: 'HINGES',
    purpose: 'LET THE PANEL OPEN',
    image: 'v2/parts/04-hinges.svg',
  },
  {
    id: 'latches',
    nodes: ['latch_left', 'latch_right', 'latch_pin_left', 'latch_pin_right'],
    name: 'LATCHES',
    purpose: 'HOLD THE PANEL SHUT',
    image: 'v2/parts/05-latches.svg',
  },
  {
    id: 'hooks',
    nodes: ['hook_left', 'hook_right'],
    name: 'HOOKS',
    purpose: 'CATCH THE LATCHES',
    image: 'v2/parts/06-hooks.svg',
  },
  { id: 'cabinet', nodes: ['cabinet', 'interior'], name: 'CABINET', purpose: '12 MM MDF, CUT TO SIZE' },
];

const partById = new Map(PARTS.map((p) => [p.id, p]));
const partByNode = new Map<string, PartInfo>();
for (const part of PARTS) for (const node of part.nodes) partByNode.set(node, part);

/** The part a GLB node belongs to. Unnamed meshes belong to the cabinet. */
export function partForNode(node: string): PartInfo {
  return partByNode.get(node) ?? (partById.get('cabinet') as PartInfo);
}

/** The part id of a named node, or undefined when the node is not a part itself. */
export function nodePart(node: string): string | undefined {
  return partByNode.get(node)?.id;
}

export function partById_(id: string): PartInfo | undefined {
  return partById.get(id);
}

export type CataloguePart = PartInfo & { image: string; number: number };

/** The six catalogue parts, numbered 1 to 6. The exploded drawing uses the same numbers. */
export function cataloguePartsOf(parts: readonly PartInfo[] = PARTS): CataloguePart[] {
  return parts
    .filter((p): p is PartInfo & { image: string } => typeof p.image === 'string')
    .map((p, i) => ({ ...p, number: i + 1 }));
}

/** The number of a part in the catalogue, or undefined for the cabinet. */
export function partNumber(id: string): number | undefined {
  return cataloguePartsOf().find((p) => p.id === id)?.number;
}

/** The order the scroll scene highlights parts in. */
export const SCENE_PARTS = ['screen', 'joystick', 'buttons', 'hinges', 'latches'] as const;

export type Vec3 = readonly [number, number, number];

/** How far each node moves in the exploded model, in metres along one clean axis. */
const EXPLODE: Readonly<Record<string, Vec3>> = {
  screen_glass: [0, 0, 0.32],
  joystick: [0, 0.28, 0],
  joystick_button: [0, 0.28, 0],
  joystick_shaft: [0, 0.28, 0],
  joystick_dust_washer: [0, 0.28, 0],
  button_up: [0, 0.2, 0.14],
  button_down: [0, 0.2, -0.04],
  button_left: [-0.12, 0.2, 0.05],
  button_right: [0.12, 0.2, 0.05],
  hinge_left: [0.18, 0, -0.28],
  hinge_right: [-0.18, 0, -0.28],
  latch_left: [0.2, 0.08, -0.3],
  latch_right: [-0.2, 0.08, -0.3],
  latch_pin_left: [0.2, 0.08, -0.3],
  latch_pin_right: [-0.2, 0.08, -0.3],
  hook_left: [0.18, 0.12, -0.34],
  hook_right: [-0.18, 0.12, -0.34],
};

/** True when a node moves in the exploded model. */
export function nodeMoves(node: string): boolean {
  return node in EXPLODE;
}

/** A node's explode offset, scaled by t in [0, 1]. Other nodes do not move. */
export function explodeOffset(node: string, t: number): Vec3 {
  const o = EXPLODE[node];
  const k = Math.min(1, Math.max(0, t));
  return o ? [o[0] * k, o[1] * k, o[2] * k] : [0, 0, 0];
}
