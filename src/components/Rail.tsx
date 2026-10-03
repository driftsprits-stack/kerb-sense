import { useEffect, useState } from 'react';
import { SECTIONS, type SectionId } from '../content';

/** Tracks which section is in view. Shared by the rail and the header. */
export function useCurrentSection(): SectionId | null {
  const [current, setCurrent] = useState<SectionId | null>(null);
  useEffect(() => {
    const targets = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => !!el,
    );
    if (targets.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
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

// The numbered rail on wide screens (the React Bits Line Sidebar layout,
// without its pointer motion). Plain hash links, aria-current on the
// section in view. Hidden below 1280 px, where the menu takes over.
export default function Rail({ current }: { current: SectionId | null }) {
  return (
    <nav className="ks-rail ks-block hidden xl:block" aria-label="Sections" data-testid="rail">
      <ol>
        {SECTIONS.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              aria-current={s.id === current ? 'location' : undefined}
              aria-label={`${s.number} ${s.name}`}
              className="group"
            >
              <span className="w-3 text-right">{s.number}</span>
              <span className="hidden group-hover:inline group-focus-visible:inline">{s.name}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
