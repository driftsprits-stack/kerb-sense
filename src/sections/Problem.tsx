import SectionTab from '../components/SectionTab';
import { PROBLEM } from '../content';

// Big type left, three small columns right, as on the Neue Grafik cover.
export default function Problem() {
  return (
    <section id="problem" className="field-paper border-t-[3px] border-black" aria-labelledby="problem-title">
      <div className="ks-container py-12 md:py-20">
        <SectionTab number={2} title={PROBLEM.headline} field="blue" id="problem-title" />
        <div className="ks-grid mt-10 gap-y-10">
          <div className="col-span-4 md:col-span-6">
            <p className="ks-display text-40 md:text-64">{PROBLEM.lead}</p>
          </div>
          <div className="col-span-4 md:col-span-6 md:col-start-7">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {PROBLEM.columns.map((c) => (
                <div key={c.title} className="ks-rule-3 pt-3">
                  <h3 className="text-16 font-bold">{c.title}</h3>
                  <p className="mt-2 text-14">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-4 md:col-span-12">
            <div className="ks-grid border-t-[3px] border-black pt-6">
              {PROBLEM.stats.map((s) => (
                <div key={s.label} className="col-span-4 md:col-span-4">
                  <p className="ks-display text-64">{s.value}</p>
                  <p className="mt-2 text-14 font-bold">{s.label}</p>
                </div>
              ))}
              <div className="col-span-4 md:col-span-4">
                <p className="text-14">{PROBLEM.statsSource}</p>
                <p className="mt-3 inline-block bg-black px-2 py-1 text-14 font-bold text-white">
                  {PROBLEM.caveat}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
