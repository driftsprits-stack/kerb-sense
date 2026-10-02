import { describe, expect, it } from 'vitest';
import { GRID_KEY, gridColumnsFor, isGridShortcut, readGridPreference, writeGridPreference } from './grid';

function memoryStorage() {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => {
      map.set(k, v);
    },
  };
}

describe('grid preference', () => {
  it('defaults to off and round-trips', () => {
    const storage = memoryStorage();
    expect(readGridPreference(storage)).toBe(false);
    writeGridPreference(storage, true);
    expect(storage.getItem(GRID_KEY)).toBe('1');
    expect(readGridPreference(storage)).toBe(true);
    writeGridPreference(storage, false);
    expect(readGridPreference(storage)).toBe(false);
  });

  it('survives missing or throwing storage', () => {
    expect(readGridPreference(null)).toBe(false);
    expect(() => writeGridPreference(undefined, true)).not.toThrow();
    const broken = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
    };
    expect(readGridPreference(broken)).toBe(false);
    expect(() => writeGridPreference(broken, true)).not.toThrow();
  });
});

describe('grid shortcut', () => {
  it('fires on G without modifiers outside controls', () => {
    expect(isGridShortcut('g', 'BODY', false)).toBe(true);
    expect(isGridShortcut('G', undefined, false)).toBe(true);
    expect(isGridShortcut('g', 'INPUT', false)).toBe(false);
    expect(isGridShortcut('g', 'IFRAME', false)).toBe(false);
    expect(isGridShortcut('g', 'BODY', true)).toBe(false);
    expect(isGridShortcut('h', 'BODY', false)).toBe(false);
  });

  it('uses 4 columns on phones and 12 above', () => {
    expect(gridColumnsFor(375)).toBe(4);
    expect(gridColumnsFor(767)).toBe(4);
    expect(gridColumnsFor(768)).toBe(12);
    expect(gridColumnsFor(1440)).toBe(12);
  });
});
