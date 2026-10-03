// Rotating display copy. The pool in src/copy-pool.json is the single
// source. One entry per slot is picked when the page loads. The first entry
// is the default: it is used with ?copy=default, in tests and in the static
// HTML. Nothing is stored between visits.

export interface CopyPool {
  version: number;
  slots: Record<string, string[]>;
}

export const HERO_SLOT = 'hero.headline';
export const HERO_MAX = 34;
export const TITLE_MAX = 24;

/** Words from WEBSITE-STANDARDS.md V35 that never appear in display copy. */
export const BANNED_WORDS = [
  'revolutionary',
  'seamless',
  'unlock',
  'empower',
  'elevate',
  'cutting-edge',
  'game-changer',
];

export type Random = () => number;

/** Picks one entry per slot. `useDefault` forces the first entry everywhere. */
export function pickCopy(pool: CopyPool, random: Random, useDefault = false): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [slot, entries] of Object.entries(pool.slots)) {
    const first = entries[0] ?? '';
    if (useDefault || entries.length < 2) {
      out[slot] = first;
      continue;
    }
    const index = Math.min(entries.length - 1, Math.floor(random() * entries.length));
    out[slot] = entries[index] ?? first;
  }
  return out;
}

/** True when the URL asks for the default copy (?copy=default). */
export function wantsDefaultCopy(search: string): boolean {
  return new URLSearchParams(search).get('copy') === 'default';
}

/** The longest entry of a slot, for reserving layout space. */
export function longestEntry(pool: CopyPool, slot: string): string {
  return (pool.slots[slot] ?? []).reduce((a, b) => (b.length > a.length ? b : a), '');
}

const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;

/** Returns every rule an entry breaks. An empty list means it passes. */
export function validateEntry(slot: string, text: string): string[] {
  const problems: string[] = [];
  const max = slot === HERO_SLOT ? HERO_MAX : TITLE_MAX;
  if (text.length > max) problems.push(`longer than ${max} characters`);
  if (!text.endsWith('.')) problems.push('does not end with a full stop');
  if (text.endsWith('..')) problems.push('ends with more than one full stop');
  if ((text.match(/\./g) ?? []).length !== 1) problems.push('has more than one full stop');
  if (text.includes('—')) problems.push('has an em dash');
  if (EMOJI.test(text)) problems.push('has an emoji');
  if (/[!?]/.test(text)) problems.push('has an exclamation or question mark');
  const lower = text.toLowerCase();
  for (const word of BANNED_WORDS) if (lower.includes(word)) problems.push(`uses the banned word "${word}"`);
  if (text.trim() !== text) problems.push('has leading or trailing space');
  return problems;
}

/** Validates the whole pool. Returns "slot[i]: problem" lines. */
export function validatePool(pool: CopyPool): string[] {
  const lines: string[] = [];
  for (const [slot, entries] of Object.entries(pool.slots)) {
    if (entries.length === 0) lines.push(`${slot}: has no entries`);
    entries.forEach((text, i) => {
      for (const p of validateEntry(slot, text)) lines.push(`${slot}[${i}] "${text}": ${p}`);
    });
    if (new Set(entries).size !== entries.length) lines.push(`${slot}: has duplicate entries`);
  }
  return lines;
}
