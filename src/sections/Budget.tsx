import Section from '../components/Section';
import { BudgetChart } from '../components/Drawings';
import { StatusLabel } from '../components/LabelBlock';
import { BUDGET } from '../content';
import { SLOT } from '../copy';
import { CHART_BUDGET } from '../lib/artwork';

export default function Budget() {
  return (
    <Section
      id="budget"
      slot={SLOT.budget}
      body={BUDGET.body}
      status={<StatusLabel>{BUDGET.statusLabel}</StatusLabel>}
      tight
    >
      <div className="grid gap-4 md:grid-cols-12">
        <div className="md:col-span-8">
          {CHART_BUDGET ? (
            <img
              src={CHART_BUDGET}
              alt={BUDGET.chartAlt}
              width={640}
              height={260}
              loading="lazy"
              decoding="async"
              className="w-full"
            />
          ) : (
            <BudgetChart lines={BUDGET.lines} title={BUDGET.chartAlt} />
          )}
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
