// The booth parts: their explode offsets, their names and their purposes.
// Each part moves along one clean axis. Values are in metres, the unit of
// the GLB. Purposes come from CONTENT.md and the proposal.
export type Vec3 = readonly [number, number, number];

/** A selectable part. Several GLB nodes can belong to one part. */
export interface PartInfo {
  /** The part id, shared by the model, the catalogue and the labels. */
  id: string;
  /** The GLB node names that belong to this part. */
  nodes: readonly string[];
  /** The name, without a decorative full stop. */
  name: string;
  /** One line on what the part does, from CONTENT.md and the proposal. */
  purpose: string;
  /** The catalogue image, if the part has one. */
  image?: string;
}

interface NodeOffset {
  node: string;
  part: string;
  offset: Vec3;
}

export const PARTS: readonly PartInfo[] = [
  {
    id: 'screen',
    nodes: ['screen_glass'],
    name: 'Screen glass',
    purpose: 'Covers the 24 inch monitor opening where the game is shown',
    image: 'part-screen-glass',
  },
  {
    id: 'joystick',
    nodes: ['joystick', 'joystick_button', 'joystick_shaft', 'joystick_dust_washer'],
    name: 'Joystick',
    purpose: 'Moves the player, with a built-in button',
    image: 'part-joystick',
  },
  {
    id: 'button-up',
    nodes: ['button_up'],
    name: 'Up button',
    purpose: 'Moves the player up the board',
    image: 'part-button-up',
  },
  {
    id: 'button-down',
    nodes: ['button_down'],
    name: 'Down button',
    purpose: 'Moves the player down the board',
    image: 'part-button-down',
  },
  {
    id: 'button-left',
    nodes: ['button_left'],
    name: 'Left button',
    purpose: 'Moves the player left',
    image: 'part-button-left',
  },
  {
    id: 'button-right',
    nodes: ['button_right'],
    name: 'Right button',
    purpose: 'Moves the player right',
    image: 'part-button-right',
  },
  {
    id: 'hinge',
    nodes: ['hinge_left', 'hinge_right'],
    name: 'Hinges',
    purpose: 'Let the rear access panel open for the computer and cables',
    image: 'part-hinge',
  },
  {
    id: 'latch',
    nodes: ['latch_left', 'latch_right', 'latch_pin_left', 'latch_pin_right'],
    name: 'Latches',
    purpose: 'Two latches hold the rear panel closed during play',
    image: 'part-latch',
  },
  {
    id: 'hook',
    nodes: ['hook_left', 'hook_right'],
    name: 'Hooks',
    purpose: 'Catch the latches on the panel',
    image: 'part-hook',
  },
  {
    id: 'panel',
    nodes: ['interior'],
    name: 'Rear panel',
    purpose: 'Closes the back of the cabinet, with ventilation slots',
  },
  {
    id: 'cabinet',
    nodes: ['cabinet'],
    name: 'Cabinet',
    purpose: '12 mm MDF or plywood, cut to size, with rounded edges',
  },
];

const OFFSETS: readonly NodeOffset[] = [
  { node: 'screen_glass', part: 'screen', offset: [0, 0, 0.32] },
  { node: 'joystick', part: 'joystick', offset: [0, 0.28, 0] },
  { node: 'button_up', part: 'button-up', offset: [0, 0.2, 0.14] },
  { node: 'button_down', part: 'button-down', offset: [0, 0.2, -0.04] },
  { node: 'button_left', part: 'button-left', offset: [-0.12, 0.2, 0.05] },
  { node: 'button_right', part: 'button-right', offset: [0.12, 0.2, 0.05] },
  { node: 'hinge_left', part: 'hinge', offset: [0.18, 0, -0.28] },
  { node: 'hinge_right', part: 'hinge', offset: [-0.18, 0, -0.28] },
  { node: 'latch_left', part: 'latch', offset: [0.2, 0.08, -0.3] },
  { node: 'latch_right', part: 'latch', offset: [-0.2, 0.08, -0.3] },
  { node: 'latch_pin_left', part: 'latch', offset: [0.2, 0.08, -0.3] },
  { node: 'latch_pin_right', part: 'latch', offset: [-0.2, 0.08, -0.3] },
  { node: 'hook_left', part: 'hook', offset: [0.18, 0.12, -0.34] },
  { node: 'hook_right', part: 'hook', offset: [-0.18, 0.12, -0.34] },
  { node: 'interior', part: 'panel', offset: [0, 0, -0.4] },
];

const byNode = new Map(OFFSETS.map((o) => [o.node, o]));
const partById = new Map(PARTS.map((p) => [p.id, p]));
const partByNode = new Map<string, PartInfo>();
for (const part of PARTS) for (const node of part.nodes) partByNode.set(node, part);

/** True when a node moves in the exploded view. */
export function nodeMoves(node: string): boolean {
  return byNode.has(node);
}

/** The explode offset for a node, scaled by t in [0, 1]. Unknown nodes do not move. */
export function explodeOffset(node: string, t: number): Vec3 {
  const entry = byNode.get(node);
  const k = Math.min(1, Math.max(0, t));
  if (!entry) return [0, 0, 0];
  return [entry.offset[0] * k, entry.offset[1] * k, entry.offset[2] * k];
}

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

export type CataloguePart = PartInfo & { image: string };

/** The parts that appear in the catalogue grid, in order. */
export function cataloguePartsOf(parts: readonly PartInfo[] = PARTS): CataloguePart[] {
  return parts.filter((p): p is CataloguePart => typeof p.image === 'string');
}

/** The order the scroll scene highlights parts in: joystick, buttons, screen, rear panel, latches. */
export const SCENE_PARTS = ['joystick', 'button-up', 'screen', 'panel', 'latch'] as const;
