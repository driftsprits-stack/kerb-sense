// Explode offsets for the booth parts. Each part moves along one clean axis.
// Values are in metres, the unit of the GLB.
export type Vec3 = readonly [number, number, number];

export interface PartInfo {
  /** The node name in the GLB. */
  node: string;
  /** The Ahoy label with a full stop. */
  label: string;
  /** Where the part moves when the booth is exploded. */
  offset: Vec3;
  /** The parts catalogue image name, if the part has one. */
  image?: string;
  /** One line of specification for the catalogue. */
  spec?: string;
}

export const PARTS: readonly PartInfo[] = [
  {
    node: 'screen_glass',
    label: 'Screen glass.',
    offset: [0, 0, 0.32],
    image: 'part-screen-glass',
    spec: '24 inch monitor opening.',
  },
  {
    node: 'joystick',
    label: 'Joystick.',
    offset: [0, 0.28, 0],
    image: 'part-joystick',
    spec: 'Joystick with a built-in button.',
  },
  {
    node: 'button_up',
    label: 'Up.',
    offset: [0, 0.2, 0.14],
    image: 'part-button-up',
    spec: 'Green. Move up.',
  },
  {
    node: 'button_down',
    label: 'Down.',
    offset: [0, 0.2, -0.04],
    image: 'part-button-down',
    spec: 'Red. Move down.',
  },
  {
    node: 'button_left',
    label: 'Left.',
    offset: [-0.12, 0.2, 0.05],
    image: 'part-button-left',
    spec: 'Yellow. Move left.',
  },
  {
    node: 'button_right',
    label: 'Right.',
    offset: [0.12, 0.2, 0.05],
    image: 'part-button-right',
    spec: 'Blue. Move right.',
  },
  {
    node: 'hinge_left',
    label: 'Hinge.',
    offset: [0.18, 0, -0.28],
    image: 'part-hinge',
    spec: 'Rear access panel hinge.',
  },
  { node: 'hinge_right', label: 'Hinge.', offset: [-0.18, 0, -0.28] },
  {
    node: 'latch_left',
    label: 'Latch.',
    offset: [0.2, 0.08, -0.3],
    image: 'part-latch',
    spec: 'One of two panel latches.',
  },
  { node: 'latch_right', label: 'Latch.', offset: [-0.2, 0.08, -0.3] },
  { node: 'latch_pin_left', label: 'Latch.', offset: [0.2, 0.08, -0.3] },
  { node: 'latch_pin_right', label: 'Latch.', offset: [-0.2, 0.08, -0.3] },
  {
    node: 'hook_left',
    label: 'Hook.',
    offset: [0.18, 0.12, -0.34],
    image: 'part-hook',
    spec: 'Latch hook on the panel.',
  },
  { node: 'hook_right', label: 'Hook.', offset: [-0.18, 0.12, -0.34] },
  { node: 'interior', label: 'Rear panel.', offset: [0, 0, -0.4] },
  { node: 'cabinet', label: 'Cabinet. 12 mm MDF.', offset: [0, 0, 0] },
];

const byNode = new Map(PARTS.map((p) => [p.node, p]));

export function partForNode(node: string): PartInfo | undefined {
  return byNode.get(node);
}

/** The explode offset for a node, scaled by t in [0, 1]. Unknown nodes do not move. */
export function explodeOffset(node: string, t: number): Vec3 {
  const part = byNode.get(node);
  const k = Math.min(1, Math.max(0, t));
  if (!part) return [0, 0, 0];
  return [part.offset[0] * k, part.offset[1] * k, part.offset[2] * k];
}

/** The parts that appear in the catalogue grid, in order. */
export type CataloguePart = PartInfo & { image: string };

export function cataloguePartsOf(parts: readonly PartInfo[] = PARTS): CataloguePart[] {
  return parts.filter((p): p is CataloguePart => typeof p.image === 'string');
}

/** The Ahoy label for any node, with a fallback for unnamed meshes. */
export function labelForNode(node: string): string {
  return byNode.get(node)?.label ?? 'Cabinet. 12 mm MDF.';
}
