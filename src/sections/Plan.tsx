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
      <div className="grid gap-6 md:grid-cols-12 md:gap-x-3">
        <table className="ks-table md:col-span-5" data-testid="plan-table">
          <tbody>
            {PLAN.months.map((m) => (
              <tr key={m.month}>
                <td className="ks-block w-12 text-28">{m.month}</td>
                <td className="text-16">{m.what}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="md:col-span-7">
          {/* One status label for the whole grid; each number still says "Target" to screen readers. */}
          <LabelBlock colour="green">{PLAN.targetsLabel}</LabelBlock>
          <ul
            className="mt-3 grid grid-cols-2 gap-x-3 gap-y-4 border-t-[3px] border-black pt-3 lg:grid-cols-3"
            data-testid="targets"
          >
            {PLAN.targets.map((t) => (
              <li key={t.label} className="border-b border-black pb-3">
                <span className="sr-only">{PLAN.targetLabel}: </span>
                {t.atLeast && <p className="ks-block text-18">{PLAN.atLeast}</p>}
                <p className="ks-block mt-1 flex items-end gap-1 text-black">
                  <Counter value={t.value} fontSize="clamp(32px, 4.2vw, 56px)" />
                  {t.unit && (
                    <span className="mb-[0.3em] text-[clamp(18px,2.2vw,28px)] leading-none">{t.unit}</span>
                  )}
                </p>
                <p className="ks-block mt-2 text-18">{t.label}</p>
                <p className="mt-1 text-14">{t.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-4 text-14">{PLAN.source}</p>
    </Section>
  );
}
