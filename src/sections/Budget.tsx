import Section from '../components/Section';
import { BudgetBars } from '../components/Charts';
import { StatusLabel } from '../components/LabelBlock';
import { BUDGET } from '../content';
import { SLOT } from '../copy';

export default function Budget() {
  return (
    <Section
      id="budget"
      slot={SLOT.budget}
      body={BUDGET.body}
      status={<StatusLabel>{BUDGET.statusLabel}</StatusLabel>}
      tight
    >
      <div className="grid gap-4 md:grid-cols-12 md:gap-x-3">
        <div className="md:col-span-8">
          <BudgetBars />
        </div>
        <div className="md:col-span-4">
          <div className="inline-block bg-green px-4 py-3 text-white" data-testid="budget-total">
            <p className="text-64 font-bold tracking-[-0.04em]">{BUDGET.totalValue}</p>
            <p className="ks-block mt-2 text-20">{BUDGET.totalLabel}</p>
          </div>
          <p className="mt-3 text-14">{BUDGET.source}</p>
        </div>
      </div>
    </Section>
  );
}
