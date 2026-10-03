import Section from '../components/Section';
import { PROBLEM } from '../content';
import { SLOT } from '../copy';

export default function Problem() {
  return (
    <Section id="problem" slot={SLOT.problem} summary={PROBLEM.summary}>
      <div className="ks-grid gap-y-10">
        <div className="col-span-4 md:col-span-6">
          {PROBLEM.body.map((p) => (
            <p key={p} className="ks-body mt-4 text-16 first:mt-0 md:text-20">
              {p}
            </p>
          ))}
        </div>
        <div className="col-span-4 md:col-span-5 md:col-start-8">
          <div className="border-t-[3px] border-black pt-4">
            <p className="ks-display text-64">{PROBLEM.stat.value}</p>
            <p className="mt-2 text-14 font-bold">{PROBLEM.stat.label}</p>
          </div>
          <div className="mt-6 border-t border-black pt-4">
            <p className="ks-display text-40">{PROBLEM.stat2.value}</p>
            <p className="mt-2 text-14 font-bold">{PROBLEM.stat2.label}</p>
          </div>
          <p className="mt-4 text-14">{PROBLEM.source}</p>
          <p className="mt-3 inline-block bg-black px-2 py-1 text-14 font-bold text-white">
            {PROBLEM.caveat}
          </p>
        </div>
      </div>
    </Section>
  );
}
