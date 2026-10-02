import * as Tabs from '@radix-ui/react-tabs';
import SectionTab from '../components/SectionTab';
import { PROGRAMME } from '../content';

// Desktop: a Swiss table. Phone: a stepper on Radix Tabs. The stepper is the
// React Bits Stepper pattern without its opacity transitions and shadow.
export default function Programme() {
  return (
    <section
      id="programme"
      className="field-paper border-t-[3px] border-black"
      aria-labelledby="programme-title"
    >
      <div className="ks-container py-12 md:py-20">
        <SectionTab number={5} title={PROGRAMME.headline} field="lblue" point="left" id="programme-title" />
        <p className="ks-display mt-10 text-40 md:text-64">{PROGRAMME.lead}</p>

        <table className="ks-table mt-8 hidden md:table">
          <thead>
            <tr>
              <th scope="col" className="w-24">
                Month
              </th>
              <th scope="col">Activities</th>
              <th scope="col" className="w-[30%]">
                Outputs
              </th>
            </tr>
          </thead>
          <tbody>
            {PROGRAMME.months.map((m) => (
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
            {PROGRAMME.months.map((m) => (
              <Tabs.Trigger
                key={m.month}
                value={String(m.month)}
                className="flex h-12 flex-1 items-center justify-center border-r border-black text-20 font-bold last:border-r-0 data-[state=active]:bg-black data-[state=active]:text-white"
                aria-label={`Month ${m.month}.`}
              >
                {m.month}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          {PROGRAMME.months.map((m) => (
            <Tabs.Content key={m.month} value={String(m.month)} className="border-t border-black pt-4">
              <p className="ks-label">Month {m.month}.</p>
              <p className="mt-3 text-16 font-bold">{m.activities}</p>
              <p className="mt-2 text-14">{m.outputs}</p>
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </div>
    </section>
  );
}
