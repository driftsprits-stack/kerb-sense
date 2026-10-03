import * as Tabs from '@radix-ui/react-tabs';
import Section from '../components/Section';
import { StatusLabel } from '../components/LabelBlock';
import { PLAN } from '../content';
import { SLOT } from '../copy';

// The six-month programme, in future tense. Desktop: a Swiss table.
// Phone: a stepper on Radix Tabs (the React Bits Stepper pattern without
// its opacity transitions and shadow).
export default function Plan() {
  return (
    <Section
      id="plan"
      slot={SLOT.plan}
      summary={PLAN.summary}
      status={<StatusLabel>{PLAN.statusLabel}</StatusLabel>}
    >
      <p className="inline-block bg-black px-2 py-1 text-14 font-bold text-white">{PLAN.note}</p>

      <table className="ks-table mt-8 hidden md:table">
        <thead>
          <tr>
            <th scope="col" className="w-24">
              Month
            </th>
            <th scope="col">What we will do</th>
            <th scope="col" className="w-[30%]">
              What it produces
            </th>
          </tr>
        </thead>
        <tbody>
          {PLAN.months.map((m) => (
            <tr key={m.month}>
              <td className="ks-display text-40">{m.month}</td>
              <td className="text-16">{m.activities}</td>
              <td className="text-14">{m.outputs}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Tabs.Root
        defaultValue="1"
        className="mt-8 border-t-[3px] border-black md:hidden"
        data-testid="stepper"
      >
        <Tabs.List className="flex" aria-label="Months">
          {PLAN.months.map((m) => (
            <Tabs.Trigger
              key={m.month}
              value={String(m.month)}
              className="flex h-12 flex-1 items-center justify-center border-r border-black text-20 font-bold last:border-r-0 data-[state=active]:bg-green data-[state=active]:text-white"
              aria-label={`Month ${m.month}`}
            >
              {m.month}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {PLAN.months.map((m) => (
          <Tabs.Content key={m.month} value={String(m.month)} className="border-t border-black pt-4">
            <p className="ks-label">Month {m.month}</p>
            <p className="mt-3 text-16 font-bold">{m.activities}</p>
            <p className="mt-2 text-14">{m.outputs}</p>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </Section>
  );
}
