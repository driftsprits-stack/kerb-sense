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

describe('atView', () => {
  it('reports when the camera sits at a view', async () => {
    const { atView, THREE_QUARTER } = await import('./views');
    expect(atView('front', 0.01, Math.PI / 2)).toBe(true);
    expect(atView('side', Math.PI / 2, Math.PI / 2)).toBe(true);
    expect(atView('top', 0, 0.01)).toBe(true);
    expect(atView('front', THREE_QUARTER, Math.PI / 2)).toBe(false);
    expect(atView('back', Math.PI / 2, Math.PI / 2)).toBe(false);
  });
});
