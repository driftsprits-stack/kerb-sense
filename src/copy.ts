// The display copy for this page view. It is chosen once, when this module
// loads, which is before the first render. The nav, the title tag and the
// meta tags never use it.
import pool from './copy-pool.json';
import { longestEntry, pickCopy, wantsDefaultCopy, type CopyPool } from './lib/copy-pool';

const POOL = pool as CopyPool;
const useDefault = typeof window !== 'undefined' && wantsDefaultCopy(window.location.search);

export const COPY = pickCopy(POOL, Math.random, useDefault);

/** The longest entry of a slot, for reserving space so the text never shifts layout. */
export function longest(slot: string): string {
  return longestEntry(POOL, slot);
}

export const SLOT = {
  hero: 'hero.headline',
  problem: 'section.problem.title',
  answer: 'section.answer.title',
  booth: 'section.booth.title',
  game: 'section.game.title',
  plan: 'section.plan.title',
  measure: 'section.measure.title',
  safety: 'section.safety.title',
  team: 'section.team.title',
  budget: 'section.budget.title',
} as const;
