import { describe, expect, it } from 'vitest';
import pool from '../copy-pool.json';
import {
  HERO_SLOT,
  longestEntry,
  pickCopy,
  validateEntry,
  validatePool,
  wantsDefaultCopy,
  type CopyPool,
} from './copy-pool';

const POOL = pool as CopyPool;

describe('the copy pool file', () => {
  it('passes every rule in PROMPT.md 5b (CI check)', () => {
    expect(validatePool(POOL)).toEqual([]);
  });

  it('has the ten slots the page uses', () => {
    expect(Object.keys(POOL.slots)).toEqual([
      'hero.headline',
      'section.problem.title',
      'section.answer.title',
      'section.booth.title',
      'section.game.title',
      'section.plan.title',
      'section.measure.title',
      'section.safety.title',
      'section.team.title',
      'section.budget.title',
    ]);
  });

  it('starts every slot with the default the tests and screenshots use', () => {
    expect(POOL.slots[HERO_SLOT]?.[0]).toBe('Wait, and you get there first.');
    expect(POOL.slots['section.booth.title']?.[0]).toBe('The booth.');
  });
});

describe('pickCopy', () => {
  it('returns the first entry for every slot with useDefault', () => {
    const picked = pickCopy(POOL, () => 0.99, true);
    for (const [slot, entries] of Object.entries(POOL.slots)) expect(picked[slot]).toBe(entries[0]);
  });

  it('picks by the random value and never goes out of range', () => {
    const last = pickCopy(POOL, () => 0.999999);
    const first = pickCopy(POOL, () => 0);
    for (const [slot, entries] of Object.entries(POOL.slots)) {
      expect(last[slot]).toBe(entries[entries.length - 1]);
      expect(first[slot]).toBe(entries[0]);
    }
  });

  it('does not rotate a slot with one entry', () => {
    const single: CopyPool = { version: 1, slots: { a: ['Only one.'] } };
    expect(pickCopy(single, () => 0.9)).toEqual({ a: 'Only one.' });
  });

  it('reads the copy=default parameter', () => {
    expect(wantsDefaultCopy('?copy=default')).toBe(true);
    expect(wantsDefaultCopy('?copy=random')).toBe(false);
    expect(wantsDefaultCopy('')).toBe(false);
  });

  it('finds the longest entry for layout reservation', () => {
    expect(longestEntry(POOL, HERO_SLOT).length).toBeLessThanOrEqual(34);
    expect(longestEntry(POOL, 'missing')).toBe('');
  });
});

describe('validateEntry', () => {
  it('rejects the rules one by one', () => {
    expect(validateEntry(HERO_SLOT, 'A very long hero headline that runs past the limit.')).toContain(
      'longer than 34 characters',
    );
    expect(validateEntry('section.x.title', 'No full stop')).toContain('does not end with a full stop');
    expect(validateEntry('section.x.title', 'Two. Stops.')).toContain('has more than one full stop');
    expect(validateEntry('section.x.title', 'Em — dash.')).toContain('has an em dash');
    expect(validateEntry('section.x.title', 'Really?')).toContain('has an exclamation or question mark');
    expect(validateEntry('section.x.title', 'Seamless play.')).toContain('uses the banned word "seamless"');
    expect(validateEntry('section.x.title', ' Spaced.')).toContain('has leading or trailing space');
    expect(validateEntry('section.x.title', 'The booth.')).toEqual([]);
  });
});
