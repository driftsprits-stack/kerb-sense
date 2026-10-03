// State for the "Show the grid." toggle. The choice is remembered per
// visitor in localStorage. Storage can be missing or blocked, so every
// access is wrapped.
export const GRID_KEY = 'kerb-sense:grid';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function readGridPreference(storage: StorageLike | null | undefined): boolean {
  try {
    return storage?.getItem(GRID_KEY) === '1';
  } catch {
    return false;
  }
}

export function writeGridPreference(storage: StorageLike | null | undefined, on: boolean): void {
  try {
    storage?.setItem(GRID_KEY, on ? '1' : '0');
  } catch {
    // Storage is a convenience only.
  }
}

/** The "G" key toggles the grid, but not while the visitor types or uses a control. */
export function isGridShortcut(key: string, targetTag: string | undefined, hasModifier: boolean): boolean {
  if (hasModifier) return false;
  if (key !== 'g' && key !== 'G') return false;
  const tag = (targetTag ?? '').toLowerCase();
  return !['input', 'textarea', 'select', 'iframe'].includes(tag);
}

/** Column count for the overlay at a given viewport width. */
export function gridColumnsFor(width: number): number {
  return width < 768 ? 4 : 12;
}
