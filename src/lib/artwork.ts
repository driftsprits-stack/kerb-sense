// The artwork the redesign uses, all from src/assets/v2/ (the redesign/assets branch).
// To change a drawing, change only the imports in this file.
import boothHero from '../assets/v2/booth-hero.svg';
import boothAssembled from '../assets/v2/booth-assembled.svg';
import boothExploded from '../assets/v2/booth-exploded.svg';
import boothDimensions from '../assets/v2/booth-dimensions.svg';
import chartFatalities from '../assets/v2/charts/fatalities.svg';
import chartBudget from '../assets/v2/charts/budget.svg';
import step1 from '../assets/v2/steps/step-1-wait.svg';
import step2 from '../assets/v2/steps/step-2-look-right.svg';
import step3 from '../assets/v2/steps/step-3-look-left.svg';
import step4 from '../assets/v2/steps/step-4-look-right-again.svg';
import step5 from '../assets/v2/steps/step-5-cross.svg';
import step6 from '../assets/v2/steps/step-6-phone.svg';

/** The hero booth, seen from the front left. White body, for a black ground. */
export const BOOTH_HERO: string = boothHero;

/** The assembled booth for the ASSEMBLED / EXPLODED swap. */
export const BOOTH_ASSEMBLED: string = boothAssembled;

/** The exploded drawing with the six catalogue numbers. Same frame as the assembled one. */
export const BOOTH_EXPLODED: string | null = boothExploded;

/** The dimension drawing, 70 x 65 x 75 cm. */
export const BOOTH_DIMENSIONS: string | null = boothDimensions;

/** The fatalities chart (SPF Annual Road Traffic Situation 2025). */
export const CHART_FATALITIES: string | null = chartFatalities;

/** The budget chart. */
export const CHART_BUDGET: string | null = chartBudget;

/** The six crossing-step pictograms, in step order. */
export const STEP_ICONS: readonly string[] | null = [step1, step2, step3, step4, step5, step6];
