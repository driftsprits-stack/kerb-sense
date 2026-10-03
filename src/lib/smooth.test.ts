import { describe, expect, it } from 'vitest';
import { wantsSmoothScroll } from './smooth';

describe('smooth scroll opt-in', () => {
  it('runs only with ?smooth=1 and never under reduced motion', () => {
    expect(wantsSmoothScroll('', false)).toBe(false);
    expect(wantsSmoothScroll('?copy=default', false)).toBe(false);
    expect(wantsSmoothScroll('?smooth=1', false)).toBe(true);
    expect(wantsSmoothScroll('?copy=default&smooth=1', false)).toBe(true);
    expect(wantsSmoothScroll('?smooth=1', true)).toBe(false);
    expect(wantsSmoothScroll('?smooth=0', false)).toBe(false);
  });
});
