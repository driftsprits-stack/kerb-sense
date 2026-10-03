// Camera views for the booth viewer. The angles match the orthographic
// renders in website-handoff/assets/booth/renders/.
export type ViewName = 'front' | 'side' | 'back' | 'top';

export interface ViewAngles {
  /** Rotation around the vertical axis, in radians. */
  azimuth: number;
  /** Angle above the ground plane, in radians. */
  polar: number;
}

export const VIEWS: Record<ViewName, ViewAngles> = {
  front: { azimuth: 0, polar: Math.PI / 2 },
  side: { azimuth: Math.PI / 2, polar: Math.PI / 2 },
  back: { azimuth: Math.PI, polar: Math.PI / 2 },
  top: { azimuth: 0, polar: 0.001 },
};

/** The three-quarter angle the scroll scene starts from. */
export const THREE_QUARTER = Math.PI / 4;

export const VIEW_ORDER: ViewName[] = ['front', 'side', 'back', 'top'];

/** View names in Kerb Block, without a full stop. */
export const VIEW_LABELS: Record<ViewName, string> = {
  front: 'FRONT',
  side: 'SIDE',
  back: 'BACK',
  top: 'TOP',
};

export function isViewName(value: string): value is ViewName {
  return (VIEW_ORDER as string[]).includes(value);
}

/** The shortest signed difference between two angles, in radians. */
export function shortestAngle(from: number, to: number): number {
  const twoPi = Math.PI * 2;
  let diff = (to - from) % twoPi;
  if (diff > Math.PI) diff -= twoPi;
  if (diff < -Math.PI) diff += twoPi;
  return diff;
}

/** True when the camera is within tolerance of a view, for tests and labels. */
export function atView(view: ViewName, azimuth: number, polar: number, tolerance = 0.05): boolean {
  const goal = VIEWS[view];
  return (
    Math.abs(shortestAngle(azimuth, goal.azimuth)) < tolerance && Math.abs(polar - goal.polar) < tolerance
  );
}
