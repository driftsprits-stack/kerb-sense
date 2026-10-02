// Budget bars. Each bar is a share of the S$3,000 total.
export interface BudgetLine {
  category: string;
  amount: number;
  colour: 'red' | 'blue' | 'green' | 'yellow' | 'lblue' | 'black';
}

export const BUDGET_TOTAL = 3000;

export function barPercent(amount: number, total: number = BUDGET_TOTAL): number {
  if (total <= 0) return 0;
  return Math.max(0, Math.min(100, (amount / total) * 100));
}

export function sumBudget(lines: readonly { amount: number }[]): number {
  return lines.reduce((sum, line) => sum + line.amount, 0);
}

export function formatSgd(amount: number): string {
  return `S$${amount.toLocaleString('en-SG')}`;
}
