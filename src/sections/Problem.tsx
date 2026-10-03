import Section from '../components/Section';
import { SlopeChart } from '../components/Drawings';
import { PROBLEM } from '../content';
import { SLOT } from '../copy';
import { CHART_FATALITIES } from '../lib/artwork';

export default function Problem() {
  return (
    <Section id="problem" slot={SLOT.problem} body={PROBLEM.body} tight>
      <div className="ks-grid gap-y-4">
        <div className="col-span-4 md:col-span-7">
          {CHART_FATALITIES ? (
            <img
              src={CHART_FATALITIES}
              alt={PROBLEM.chart.alt}
              width={640}
              height={360}
              loading="lazy"
              decoding="async"
              className="w-full"
            />
          ) : (
            <SlopeChart series={PROBLEM.chart.series} years={PROBLEM.chart.years} title={PROBLEM.chart.alt} />
          )}
        </div>
        <div className="col-span-4 md:col-span-4 md:col-start-9">
          <p className="text-14">{PROBLEM.source}</p>
          <p className="ks-label mt-3">{PROBLEM.caveat}</p>
        </div>
      </div>
    </Section>
  );
}
