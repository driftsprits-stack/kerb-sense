import Counter from '../bits/Counter';
import SectionTab from '../components/SectionTab';
import LabelBlock from '../components/LabelBlock';
import { TARGETS } from '../content';

export default function Targets() {
  return (
    <section id="targets" className="field-black border-t-[3px] border-black" aria-labelledby="targets-title">
      <div className="ks-container py-12 md:py-20">
        <SectionTab number={6} title={TARGETS.headline} field="black" id="targets-title" />
        <p className="ks-display mt-10 text-40 text-white md:text-64">{TARGETS.lead}</p>
        <ul className="ks-grid mt-10 gap-y-10 border-t-[3px] border-white pt-8" role="list">
          {TARGETS.items.map((t) => (
            <li key={t.label} className="col-span-4 border-t border-white pt-4 md:col-span-4">
              <LabelBlock colour="red">{TARGETS.badge}</LabelBlock>
              <p className="mt-3 flex flex-wrap items-end gap-2 text-white">
                {t.prefix && <span className="text-20 font-bold">{t.prefix}</span>}
                <Counter value={t.value} fontSize={80} />
                {t.suffix && <span className="ks-display text-40">{t.suffix}</span>}
              </p>
              <p className="mt-2 text-16 font-bold text-white">{t.label}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap items-center gap-6 text-white">
          <p className="text-14">{TARGETS.source}</p>
          <a href="#programme" className="ks-link text-14 font-bold">
            {TARGETS.link}
          </a>
        </div>
      </div>
    </section>
  );
}
