// Camera views for the booth viewer. The angles match the orthographic
// renders in website-handoff/assets/booth/renders/.
export type ViewName = 'front' | 'side' | 'back' | 'top';

export interface ViewAngles {
  /** Rotation around the vertical axis, in radians. */
  azimuth: number;
  /** Angle from the vertical axis, in radians: pi/2 is level, near 0 is overhead. */
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

export interface TourPose extends ViewAngles {
  /** 0 is assembled, 1 is fully exploded. */
  explode: number;
}

// The scroll tour, as keyframes over its progress p in [0, 1] (Astra's review,
// 4 October 2026): the three-quarter angle turns to the front and holds
// (screen), lifts to the top and holds (controls), turns to a raised back
// three-quarter and holds (rear access), then the parts move apart and stay
// apart. The rear parts move along the depth axis, so a straight back view
// would hide the explode. Polar is from the vertical: pi/2 is level.
export const BACK_THREE_QUARTER = { azimuth: Math.PI * 0.75, polar: 1.15 };
const LEVEL = Math.PI / 2;
const TOP = 0.35;
const TOUR_KEYS: readonly (TourPose & { p: number })[] = [
  { p: 0, azimuth: THREE_QUARTER, polar: LEVEL, explode: 0 },
  { p: 0.12, azimuth: 0, polar: LEVEL, explode: 0 },
  { p: 0.28, azimuth: 0, polar: LEVEL, explode: 0 },
  { p: 0.42, azimuth: 0, polar: TOP, explode: 0 },
  { p: 0.59, azimuth: 0, polar: TOP, explode: 0 },
  { p: 0.72, ...BACK_THREE_QUARTER, explode: 0 },
  { p: 0.78, ...BACK_THREE_QUARTER, explode: 0 },
  { p: 0.92, ...BACK_THREE_QUARTER, explode: 1 },
  { p: 1, ...BACK_THREE_QUARTER, explode: 1 },
];

/** GSAP's power2.inOut, written out so this file stays free of libraries. */
export function power2InOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

/**
 * The camera and explode state for a point in the scroll tour. Each moving
 * segment eases (power2.inOut) on its own fraction; holds stay still. The
 * same p always gives the same pose, in either scroll direction.
 */
export function tourPose(p: number): TourPose {
  const t = Math.min(1, Math.max(0, p));
  let i = 1;
  while (i < TOUR_KEYS.length - 1 && (TOUR_KEYS[i] as { p: number }).p < t) i += 1;
  const a = TOUR_KEYS[i - 1] as TourPose & { p: number };
  const b = TOUR_KEYS[i] as TourPose & { p: number };
  const k = b.p === a.p ? 1 : power2InOut((t - a.p) / (b.p - a.p));
  const mix = (x: number, y: number) => x + (y - x) * k;
  return {
    azimuth: mix(a.azimuth, b.azimuth),
    polar: mix(a.polar, b.polar),
    explode: mix(a.explode, b.explode),
  };
}

/** The camera's turn for the readout: whole degrees from 0 to 359. */
export function turnDegrees(azimuth: number): number {
  return ((Math.round((azimuth * 180) / Math.PI) % 360) + 360) % 360;
}

/** The camera's tilt above the horizon for the readout: 0 is level, 90 is straight down. */
export function tiltDegrees(polar: number): number {
  return Math.round(90 - (polar * 180) / Math.PI);
}
