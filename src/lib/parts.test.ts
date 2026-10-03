import { describe, expect, it } from 'vitest';
import {
  PARTS,
  SCENE_PARTS,
  cataloguePartsOf,
  explodeOffset,
  nodeMoves,
  nodePart,
  partById_,
  partForNode,
  partNumber,
} from './parts';

describe('parts', () => {
  it('has six catalogue parts numbered 1 to 6, plus the cabinet', () => {
    const catalogue = cataloguePartsOf();
    expect(catalogue.map((p) => p.number)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(catalogue.map((p) => p.id)).toEqual([
      'screen',
      'joystick',
      'buttons',
      'hinges',
      'latches',
      'hooks',
    ]);
    expect(PARTS.length).toBe(7);
    expect(partById_('cabinet')?.image).toBeUndefined();
  });

  it('treats the four movement buttons as one part', () => {
    for (const node of ['button_up', 'button_down', 'button_left', 'button_right']) {
      expect(partForNode(node).id).toBe('buttons');
    }
    expect(partById_('buttons')?.name).toBe('MOVEMENT BUTTONS X4');
  });

  it('maps every node to a part and unknown nodes to the cabinet', () => {
    expect(partForNode('joystick_shaft').id).toBe('joystick');
    expect(partForNode('hook_left').id).toBe('hooks');
    expect(partForNode('interior').id).toBe('cabinet');
    expect(partForNode('something_else').id).toBe('cabinet');
    expect(partForNode('').id).toBe('cabinet');
  });

  it('names the part of a named node and nothing for an unnamed mesh', () => {
    expect(nodePart('joystick')).toBe('joystick');
    expect(nodePart('latch_pin_right')).toBe('latches');
    expect(nodePart('cabinet')).toBe('cabinet');
    expect(nodePart('')).toBeUndefined();
  });

  it('numbers parts the same way in the catalogue and the drawing', () => {
    expect(partNumber('screen')).toBe(1);
    expect(partNumber('joystick')).toBe(2);
    expect(partNumber('hooks')).toBe(6);
    expect(partNumber('cabinet')).toBeUndefined();
  });

  it('uses display text only: capitals, digits and a few marks', () => {
    for (const p of PARTS) {
      expect(p.name).toMatch(/^[A-Z0-9 ,.$&+\-/:[\]]+$/);
      expect(p.purpose).toMatch(/^[A-Z0-9 ,.$&+\-/:[\]]+$/);
      expect(p.name.endsWith('.')).toBe(false);
    }
  });

  it('highlights only catalogue parts in the scene', () => {
    for (const id of SCENE_PARTS) expect(partNumber(id)).toBeDefined();
  });

  it('moves only real part nodes when exploded, and scales the offset by t', () => {
    for (const node of [
      'screen_glass',
      'joystick',
      'button_up',
      'hinge_left',
      'latch_pin_right',
      'hook_left',
    ]) {
      expect(nodeMoves(node)).toBe(true);
      expect(nodePart(node)).toBeDefined();
    }
    expect(nodeMoves('cabinet')).toBe(false);
    expect(explodeOffset('screen_glass', 0.5)).toEqual([0, 0, 0.16]);
    expect(explodeOffset('screen_glass', 3)).toEqual([0, 0, 0.32]);
    expect(explodeOffset('cabinet', 1)).toEqual([0, 0, 0]);
  });
});
