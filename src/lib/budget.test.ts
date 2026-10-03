import { describe, expect, it } from 'vitest';
import { BUDGET_TOTAL, barPercent, formatSgd, sumBudget } from './budget';

describe('budget', () => {
  it('turns an amount into a bar percentage of the total', () => {
    expect(barPercent(1500)).toBe(50);
    expect(barPercent(0)).toBe(0);
    expect(barPercent(4000)).toBe(100);
    expect(barPercent(-5)).toBe(0);
    expect(barPercent(10, 0)).toBe(0);
  });

  it('sums the lines to the requested total', () => {
    const lines = [{ amount: 0 }, { amount: 450 }, { amount: 400 }, { amount: 1300 }, { amount: 850 }];
    expect(sumBudget(lines)).toBe(BUDGET_TOTAL);
  });

  it('formats Singapore dollars', () => {
    expect(formatSgd(3000)).toBe('S$3,000');
    expect(formatSgd(0)).toBe('S$0');
  });
});
