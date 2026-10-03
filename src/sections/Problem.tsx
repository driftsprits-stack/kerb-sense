import Section from '../components/Section';
import { SlopeChart } from '../components/Drawings';
import { PROBLEM } from '../content';
import { SLOT } from '../copy';
import { CHART_FATALITIES } from '../lib/artwork';

export default function Problem() {
  return (
    <Section id="problem" slot={SLOT.problem} body={PROBLEM.body} tight>
      {/* One column: the chart, then the caveat under the bars, then the source. */}
      <div className="max-w-[720px]">
        {CHART_FATALITIES ? (
          <img
            src={CHART_FATALITIES}
            alt={PROBLEM.chart.alt}
            width={1000}
            height={720}
            loading="lazy"
            decoding="async"
            className="w-full"
          />
        ) : (
          <SlopeChart series={PROBLEM.chart.series} years={PROBLEM.chart.years} title={PROBLEM.chart.alt} />
        )}
        <p className="ks-label mt-4 inline-block" data-testid="problem-caveat">
          {PROBLEM.caveat}
        </p>
        <p className="mt-2 text-14" data-testid="problem-source">
          {PROBLEM.source}
        </p>
      </div>
    </Section>
  );
}
