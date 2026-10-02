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

export const VIEW_ORDER: ViewName[] = ['front', 'side', 'back', 'top'];

export const VIEW_LABELS: Record<ViewName, string> = {
  front: 'Front.',
  side: 'Side.',
  back: 'Back.',
  top: 'Top.',
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
