import { describe, expect, it } from 'vitest';
import {
  PARTS,
  SCENE_PARTS,
  cataloguePartsOf,
  explodeOffset,
  nodeMoves,
  partById_,
  partForNode,
} from './explode';

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
    expect(nodeMoves('cabinet')).toBe(false);
    expect(nodeMoves('hook_left')).toBe(true);
  });

  it('moves hardware away from the back on opposite sides', () => {
    const left = explodeOffset('hinge_left', 1);
    const right = explodeOffset('hinge_right', 1);
    expect(left[2]).toBeLessThan(0);
    expect(Math.sign(left[0])).toBe(-Math.sign(right[0]));
  });

  it('maps every node to a part, and unnamed meshes to the cabinet', () => {
    expect(partForNode('joystick_shaft').id).toBe('joystick');
    expect(partForNode('latch_pin_right').id).toBe('latch');
    expect(partForNode('').id).toBe('cabinet');
    expect(partById_('screen')?.name).toBe('Screen glass');
    expect(partById_('none')).toBeUndefined();
  });

  it('gives every part a name without a decorative full stop and a purpose', () => {
    for (const part of PARTS) {
      expect(part.name.endsWith('.')).toBe(false);
      expect(part.purpose.length).toBeGreaterThan(10);
      expect(part.purpose.endsWith('.')).toBe(false);
    }
  });

  it('lists nine catalogue parts, one per image', () => {
    const catalogue = cataloguePartsOf();
    expect(catalogue).toHaveLength(9);
    expect(new Set(catalogue.map((p) => p.image)).size).toBe(9);
    expect(cataloguePartsOf([])).toEqual([]);
  });

  it('names real parts in the scroll scene', () => {
    for (const id of SCENE_PARTS) expect(partById_(id)).toBeDefined();
  });
});

describe('nodePart', () => {
  it('names the part of a named node and nothing for an unnamed mesh', async () => {
    const { nodePart } = await import('./explode');
    expect(nodePart('joystick')).toBe('joystick');
    expect(nodePart('joystick_shaft')).toBe('joystick');
    expect(nodePart('cabinet')).toBe('cabinet');
    expect(nodePart('')).toBeUndefined();
    expect(nodePart('unknown_node')).toBeUndefined();
  });
});
