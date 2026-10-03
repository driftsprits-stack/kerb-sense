import Counter from '../bits/Counter';
import Section from '../components/Section';
import LabelBlock from '../components/LabelBlock';
import { MEASURE } from '../content';
import { SLOT } from '../copy';

// The black section: six targets, each labelled "Target", and one short
// paragraph on how they will be measured.
export default function Measure() {
  return (
    <Section id="measure" slot={SLOT.measure} summary={MEASURE.summary} field="black">
      <ul className="ks-grid gap-y-10 border-t-[3px] border-white pt-8">
        {MEASURE.items.map((t) => (
          <li key={t.label} className="col-span-4 border-t border-white pt-4 md:col-span-4">
            <LabelBlock colour="green">{MEASURE.badge}</LabelBlock>
            <p className="mt-3 flex flex-wrap items-end gap-2 text-white">
              {t.prefix && <span className="text-20 font-bold">{t.prefix}</span>}
              <Counter value={t.value} fontSize={80} />
              {t.suffix && <span className="ks-display text-40">{t.suffix}</span>}
            </p>
            <p className="mt-2 text-16 font-bold text-white">{t.label}</p>
          </li>
        ))}
      </ul>
      <p className="ks-body mt-10 text-16 text-white md:text-20">{MEASURE.how}</p>
      <p className="mt-4 text-14 text-white">{MEASURE.source}</p>
    </Section>
  );
}
