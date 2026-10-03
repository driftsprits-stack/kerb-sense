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
          <p className="ks-block text-28 md:text-40" data-testid="budget-total">
            {BUDGET.total}
          </p>
          <p className="mt-3 text-14">{BUDGET.source}</p>
        </div>
      </div>
    </Section>
  );
}
