import { describe, expect, it } from 'vitest';
import { VIEWS, VIEW_ORDER, VIEW_LABELS, isViewName, shortestAngle } from './views';

describe('views', () => {
  it('has the four snap views in order', () => {
    expect(VIEW_ORDER).toEqual(['front', 'side', 'back', 'top']);
    for (const name of VIEW_ORDER) {
      expect(VIEWS[name]).toBeDefined();
      expect(VIEW_LABELS[name].endsWith('.')).toBe(false);
    }
  });

  it('puts the side view at a quarter turn and the back at a half turn', () => {
    expect(VIEWS.side.azimuth).toBeCloseTo(Math.PI / 2);
    expect(VIEWS.back.azimuth).toBeCloseTo(Math.PI);
    expect(VIEWS.top.polar).toBeLessThan(0.01);
  });

  it('checks view names', () => {
    expect(isViewName('front')).toBe(true);
    expect(isViewName('bottom')).toBe(false);
  });

  it('finds the shortest turn between angles', () => {
    expect(shortestAngle(0, Math.PI / 2)).toBeCloseTo(Math.PI / 2);
    expect(shortestAngle(0, (3 * Math.PI) / 2)).toBeCloseTo(-Math.PI / 2);
    expect(shortestAngle(Math.PI, -Math.PI)).toBeCloseTo(0);
    expect(shortestAngle(0.1, 0.1 + 4 * Math.PI)).toBeCloseTo(0);
  });
});
