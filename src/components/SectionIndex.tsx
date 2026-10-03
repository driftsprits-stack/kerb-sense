import { useEffect, useState } from 'react';
import { SECTIONS, type SectionId } from '../content';

/** Tracks which section is in view. Shared by the index and the header. */
export function useCurrentSection(): SectionId | null {
  const [current, setCurrent] = useState<SectionId | null>(null);
  useEffect(() => {
    const targets = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => !!el,
    );
    if (targets.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        // The section nearest the top third of the viewport wins.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const first = visible[0];
        if (first) setCurrent(first.target.id as SectionId);
        else if (window.scrollY < 200) setCurrent(null);
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);
  return current;
}

// The sticky left index on desktop (DESIGN.md section 6). The current
// section is marked in green.
export default function SectionIndex({ current }: { current: SectionId | null }) {
  return (
    <nav className="sticky top-20 hidden xl:block" aria-label="Sections" data-testid="section-index">
      <ol className="border-t-[3px] border-black">
        {SECTIONS.map((s) => {
          const active = s.id === current;
          return (
            <li key={s.id} className="border-b border-black">
              <a
                href={`#${s.id}`}
                className={`flex gap-3 py-2 text-14 font-bold hover:bg-black hover:text-white ${active ? 'bg-green text-white' : ''}`}
                aria-current={active ? 'location' : undefined}
              >
                <span className="w-5 shrink-0 text-right">{s.number}</span>
                <span>{s.name}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
