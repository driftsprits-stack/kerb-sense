import type { ReactNode } from 'react';
import SectionTab from './SectionTab';
import { SECTIONS, type SectionId } from '../content';
import { COPY } from '../copy';

// One section: the green tab with the title from the pool, an optional
// status word, one sentence of at most 25 words, then the detail.
interface SectionProps {
  id: SectionId;
  slot: string;
  body: string;
  field?: 'paper' | 'black';
  children: ReactNode;
  status?: ReactNode;
  tight?: boolean;
}

export default function Section({ id, slot, body, field = 'paper', children, status, tight }: SectionProps) {
  const meta = SECTIONS.find((s) => s.id === id);
  if (!meta) throw new Error(`Unknown section ${id}`);
  const title = COPY[slot] ?? '';
  const ground = field === 'black' ? 'field-black' : 'field-paper';
  return (
    <section
      id={id}
      className={`${ground} scroll-mt-8 border-t-[3px] border-black`}
      aria-labelledby={`${id}-title`}
      data-section={id}
    >
      <div className={`ks-container ${tight ? 'py-6 md:py-8' : 'py-8 md:py-10'}`}>
        <div className="flex flex-wrap items-center gap-3">
          <SectionTab number={meta.number} title={title} slot={slot} id={`${id}-title`} token={id} />
          {status}
        </div>
        <p className="ks-summary mt-5" data-testid={`${id}-body`}>
          {body}
        </p>
        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}
