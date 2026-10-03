import Counter from '../bits/Counter';
import Section from '../components/Section';
import LabelBlock, { StatusLabel } from '../components/LabelBlock';
import { PLAN } from '../content';
import { SLOT } from '../copy';

// The six-month plan as a ruled table, and the six targets: one big value,
// a short label and one line of context. Every number carries "TARGET".
// Each counter rolls once.
export default function Plan() {
  return (
    <Section
      id="plan"
      slot={SLOT.plan}
      body={PLAN.body}
      status={<StatusLabel>{PLAN.statusLabel}</StatusLabel>}
    >
      <div className="grid gap-6 md:grid-cols-12">
        <table className="ks-table ks-block md:col-span-5" data-testid="plan-table">
          <tbody>
            {PLAN.months.map((m) => (
              <tr key={m.month}>
                <td className="w-12 text-28">{m.month}</td>
                <td className="text-14">{m.what}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ul
          className="grid grid-cols-2 gap-x-3 gap-y-4 border-t-[3px] border-black pt-3 md:col-span-7 lg:grid-cols-3"
          data-testid="targets"
        >
          {PLAN.targets.map((t) => (
            <li key={t.label} className="border-b border-black pb-3">
              <p className="flex flex-wrap items-center gap-2">
                <LabelBlock colour="green">{PLAN.targetLabel}</LabelBlock>
                {t.atLeast && <span className="ks-block text-12">{PLAN.atLeast}</span>}
              </p>
              <p className="ks-block mt-2 flex items-end gap-1 text-black">
                <Counter value={t.value} fontSize="clamp(32px, 4.2vw, 56px)" />
                {t.unit && (
                  <span className="mb-[0.3em] text-[clamp(18px,2.2vw,28px)] leading-none">{t.unit}</span>
                )}
              </p>
              <p className="ks-block mt-2 text-14">{t.label}</p>
              <p className="mt-1 text-14">{t.detail}</p>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-4 text-14">{PLAN.source}</p>
    </Section>
  );
}
