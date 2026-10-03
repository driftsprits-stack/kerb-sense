import { useRef } from 'react';
import Section from '../components/Section';
import { StatusLabel } from '../components/LabelBlock';
import { useUnfold } from '../components/unfold';
import { ANSWER } from '../content';
import { SLOT } from '../copy';

const base = import.meta.env.BASE_URL;

// One orientation screen: three equal columns, each with one sentence and
// a link down the page. They slide in from below, one after another, tied
// to the scroll position. Without motion they are simply there.
export default function Answer() {
  const ref = useRef<HTMLDivElement>(null);

  useUnfold(({ gsap }) => {
    const root = ref.current;
    if (!root) return;
    const columns = root.querySelectorAll('[data-answer]');
    gsap.from(columns, {
      yPercent: 40,
      ease: 'none',
      stagger: 0.2,
      scrollTrigger: { trigger: root, start: 'top 90%', end: 'top 35%', scrub: true },
    });
  });

  return (
    <Section id="answer" slot={SLOT.answer} summary={ANSWER.summary}>
      <div ref={ref} className="grid grid-cols-1 gap-6 border-t-[3px] border-black pt-6 md:grid-cols-3">
        {ANSWER.columns.map((c) => (
          <div
            key={c.id}
            data-answer={c.id}
            className="border-b border-black pb-6 md:border-b-0 md:border-r md:pr-6 md:last:border-r-0"
          >
            <StatusLabel>{c.status}</StatusLabel>
            <h3 className="ks-h3 mt-3">{c.title}</h3>
            <p className="mt-2 text-16">{c.body}</p>
            <a
              href={c.href.startsWith('#') ? c.href : `${base}${c.href}`}
              className="ks-link mt-4 inline-block text-16 font-bold"
              data-testid={`answer-${c.id}`}
            >
              {c.link}
            </a>
          </div>
        ))}
      </div>
    </Section>
  );
}
