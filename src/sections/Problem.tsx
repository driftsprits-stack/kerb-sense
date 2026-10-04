import Section from '../components/Section';
import { DeathsChart } from '../components/Charts';
import { PROBLEM } from '../content';
import { SLOT } from '../copy';

export default function Problem() {
  return (
    <Section id="problem" slot={SLOT.problem} body={PROBLEM.body} tight>
      {/* One centred column: the chart, then the caveat under the bars, then the source. */}
      <div className="mx-auto max-w-[800px]">
        <DeathsChart />
        <p className="mt-6 max-w-[60ch] text-16 font-bold" data-testid="problem-caveat">
          {PROBLEM.caveat}
        </p>
        <p className="mt-2 text-14" data-testid="problem-source">
          {PROBLEM.source}
        </p>
      </div>
    </Section>
  );
}
