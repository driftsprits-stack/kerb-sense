// The artwork the redesign uses. The new images are made on the
// redesign/assets branch in src/assets/v2/. Until that branch is merged,
// each entry falls back to the current renders or to an inline drawing.
// To swap in the v2 files, change only the imports in this file.
import boothHero from '../assets/renders/booth-light-three-quarter.svg';
import boothAssembled from '../assets/renders/booth-light-three-quarter.svg';

/** The hero booth, seen from the front left. */
export const BOOTH_HERO: string = boothHero;

/** The assembled booth for the ASSEMBLED / EXPLODED swap. */
export const BOOTH_ASSEMBLED: string = boothAssembled;

/** The exploded drawing with the six catalogue numbers. Null draws it inline. */
export const BOOTH_EXPLODED: string | null = null;

/** The dimension drawing. Null draws it inline. */
export const BOOTH_DIMENSIONS: string | null = null;

/** The fatalities slope chart. Null draws it inline. */
export const CHART_FATALITIES: string | null = null;

/** The budget bar chart. Null draws it inline. */
export const CHART_BUDGET: string | null = null;

/** The six crossing-step pictograms, in step order. Null draws them inline. */
export const STEP_ICONS: readonly string[] | null = null;
