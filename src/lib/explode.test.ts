import { describe, expect, it } from 'vitest';
import { PARTS, cataloguePartsOf, explodeOffset, labelForNode, partForNode } from './explode';

describe('explode', () => {
  it('moves the screen glass forward and the joystick up', () => {
    expect(explodeOffset('screen_glass', 1)[2]).toBeGreaterThan(0);
    expect(explodeOffset('joystick', 1)[1]).toBeGreaterThan(0);
  });

  it('scales by t and clamps t to [0, 1]', () => {
    const full = explodeOffset('screen_glass', 1);
    const half = explodeOffset('screen_glass', 0.5);
    expect(half[2]).toBeCloseTo(full[2] / 2);
    expect(explodeOffset('screen_glass', 2)).toEqual(full);
    expect(explodeOffset('screen_glass', -1)).toEqual([0, 0, 0]);
  });

  it('does not move the cabinet or unknown nodes', () => {
    expect(explodeOffset('cabinet', 1)).toEqual([0, 0, 0]);
    expect(explodeOffset('nothing', 1)).toEqual([0, 0, 0]);
  });

  it('moves hardware away from the back on opposite sides', () => {
    const left = explodeOffset('hinge_left', 1);
    const right = explodeOffset('hinge_right', 1);
    expect(left[2]).toBeLessThan(0);
    expect(Math.sign(left[0])).toBe(-Math.sign(right[0]));
  });

  it('gives every part a label with a full stop', () => {
    for (const part of PARTS) expect(part.label.endsWith('.')).toBe(true);
    expect(labelForNode('joystick')).toBe('Joystick.');
    expect(labelForNode('unnamed')).toBe('Cabinet. 12 mm MDF.');
    expect(partForNode('button_up')?.spec).toContain('Green');
  });

  it('lists nine catalogue parts, one per image', () => {
    const catalogue = cataloguePartsOf();
    expect(catalogue).toHaveLength(9);
    expect(new Set(catalogue.map((p) => p.image)).size).toBe(9);
    expect(cataloguePartsOf([])).toEqual([]);
  });
});
