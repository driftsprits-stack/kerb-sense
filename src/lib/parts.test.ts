import { describe, expect, it } from 'vitest';
import { PARTS, SCENE_PARTS, cataloguePartsOf, nodePart, partById_, partForNode, partNumber } from './parts';

describe('parts', () => {
  it('has six catalogue parts numbered 1 to 6, plus the cabinet', () => {
    const catalogue = cataloguePartsOf();
    expect(catalogue.map((p) => p.number)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(catalogue.map((p) => p.id)).toEqual([
      'joystick',
      'buttons',
      'screen',
      'panel',
      'hinges',
      'latches',
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
    expect(partForNode('hook_left').id).toBe('latches');
    expect(partForNode('interior').id).toBe('panel');
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
    expect(partNumber('joystick')).toBe(1);
    expect(partNumber('latches')).toBe(6);
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
});
