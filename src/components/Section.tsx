import type { ReactNode } from 'react';
import SectionTab from './SectionTab';
import { SECTIONS, type SectionId } from '../content';
import { COPY } from '../copy';

// One section of the reading journey: the green tab, one large summary
// sentence, the detail, then a "Next" signpost to the next section.
interface SectionProps {
  id: SectionId;
  slot: string;
  summary: string;
  field?: 'paper' | 'black';
  children: ReactNode;
  status?: ReactNode;
}

export default function Section({ id, slot, summary, field = 'paper', children, status }: SectionProps) {
  const meta = SECTIONS.find((s) => s.id === id);
  if (!meta) throw new Error(`Unknown section ${id}`);
  const index = SECTIONS.indexOf(meta);
  const next = SECTIONS[index + 1];
  const title = COPY[slot] ?? '';
  const ground = field === 'black' ? 'field-black' : 'field-paper';
  const rule = field === 'black' ? 'border-white' : 'border-black';
  return (
    <section
      id={id}
      className={`${ground} border-t-[3px] border-black scroll-mt-16`}
      aria-labelledby={`${id}-title`}
      data-section={id}
    >
      <div className="ks-container py-12 md:py-20">
        <div className="flex flex-wrap items-center gap-4">
          <SectionTab number={meta.number} title={title} slot={slot} id={`${id}-title`} />
          {status}
        </div>
        <p className="ks-summary mt-10">{summary}</p>
        <div className="mt-10">{children}</div>
        <p className={`mt-12 border-t ${rule} pt-4 text-16 font-bold`}>
          <a href={next ? `#${next.id}` : '#top'} className="ks-link" data-testid={`next-${id}`}>
            {meta.next}
          </a>
        </p>
      </div>
    </section>
  );
}
