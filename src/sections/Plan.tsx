import Counter from '../bits/Counter';
import Section from '../components/Section';
import LabelBlock, { StatusLabel } from '../components/LabelBlock';
import { PLAN } from '../content';
import { SLOT } from '../copy';

// The six-month plan as a ruled table, and the six targets as big numbers
// with small labels. Every number carries "TARGET". Each counter rolls once.
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
            <li key={t.label} className="border-b border-black pb-2">
              <LabelBlock colour="green">{PLAN.targetLabel}</LabelBlock>
              <p className="ks-block mt-2 text-white">
                <Counter value={t.value} fontSize="clamp(32px, 4.2vw, 56px)" className="text-black" />
              </p>
              <p className="ks-block mt-1 text-12">{t.label}</p>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-4 text-14">{PLAN.source}</p>
    </Section>
  );
}
