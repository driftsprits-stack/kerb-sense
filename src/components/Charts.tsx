import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { gsap } from 'gsap';
import { BUDGET, PROBLEM } from '../content';

// The two charts, drawn as HTML in the site's fonts (they were images with
// the words baked in). Each plays once, the first time it scrolls into view:
// the bars move into place and the numbers count up. Transform only. With
// reduced motion, or before the script runs, everything shows its final
// state. The numbers on screen are decoration for sighted readers; each
// chart has one text alternative.

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** True once the element has been 30% in view. Never goes back to false. */
function useSeenOnce(ref: RefObject<HTMLElement | null>): boolean {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, seen]);
  return seen;
}

/**
 * Hides the bars (moved out of their clip) and zeroes the numbers before the
 * first paint, then plays them in when `seen` turns true.
 */
function usePlayOnce(ref: RefObject<HTMLElement | null>, seen: boolean, axis: 'x' | 'y') {
  const played = useRef(false);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || played.current) return;
    const bars = el.querySelectorAll<HTMLElement>('[data-bar]');
    const numbers = el.querySelectorAll<HTMLElement>('[data-count]');
    if (!seen) {
      gsap.set(bars, axis === 'y' ? { yPercent: 100 } : { xPercent: -100 });
      numbers.forEach((n) => (n.textContent = format(n, 0)));
      return;
    }
    played.current = true;
    const tl = gsap.timeline();
    tl.to(bars, {
      ...(axis === 'y' ? { yPercent: 0 } : { xPercent: 0 }),
      duration: 0.6,
      ease: 'power2.out',
      stagger: { amount: 0.12 },
      force3D: true,
    });
    numbers.forEach((n) => {
      const counter = { v: 0 };
      tl.to(
        counter,
        {
          v: Number(n.dataset.count),
          duration: 0.6,
          ease: 'power2.out',
          onUpdate: () => (n.textContent = format(n, counter.v)),
        },
        0,
      );
    });
    return () => {
      tl.progress(1).kill();
    };
  }, [ref, seen, axis]);
}

function format(el: HTMLElement, v: number): string {
  const n = Math.round(v).toLocaleString('en-SG');
  return `${el.dataset.prefix ?? ''}${n}${el.dataset.suffix ?? ''}`;
}

const percentRise = (from: number, to: number) => Math.round(((to - from) / from) * 100);

export function DeathsChart() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useSeenOnce(ref);
  usePlayOnce(ref, seen, 'y');
  const [y1, y2] = PROBLEM.chart.years;
  return (
    <div
      ref={ref}
      className="grid gap-10 md:grid-cols-2"
      role="img"
      aria-label={PROBLEM.chart.alt}
      data-testid="problem-chart"
    >
      {PROBLEM.chart.series.map((s) => {
        const rise = percentRise(s.from, s.to);
        return (
          <div key={s.label} aria-hidden="true">
            <p className="text-20 font-bold md:text-28">{s.title}</p>
            {/* The plot clips the bars, so they rise out of the baseline. */}
            <div className="mt-4 flex h-[240px] items-end gap-6 overflow-hidden border-b-[4px] border-black px-3 md:h-[300px]">
              {[
                { year: y1, value: s.from, fill: 'bg-white' },
                { year: y2, value: s.to, fill: 'bg-green' },
              ].map((b) => (
                <div
                  key={b.year}
                  className="flex w-[34%] max-w-[150px] flex-col items-center"
                  style={{ height: `${Math.max(14, (b.value / s.to) * 82)}%` }}
                  data-bar
                >
                  <span className="text-28 font-bold leading-none md:text-40" data-count={b.value}>
                    {b.value}
                  </span>
                  <span className={`mt-2 w-full flex-1 border-[4px] border-b-0 border-black ${b.fill}`} />
                </div>
              ))}
            </div>
            <div className="flex gap-6 px-3 pt-2">
              {[y1, y2].map((y) => (
                <span key={y} className="w-[34%] max-w-[150px] text-center text-20">
                  {y}
                </span>
              ))}
            </div>
            <p
              className="mt-3 text-48 font-bold leading-none text-green md:text-64"
              data-count={rise}
              data-prefix="+"
              data-suffix="%"
            >
              +{rise}%
            </p>
          </div>
        );
      })}
    </div>
  );
}

export function BudgetBars() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useSeenOnce(ref);
  usePlayOnce(ref, seen, 'x');
  const shown = BUDGET.lines.filter((l) => l.amount > 0);
  const max = Math.max(...shown.map((l) => l.amount));
  const total = BUDGET.lines.reduce((sum, l) => sum + l.amount, 0);
  return (
    <div ref={ref} role="img" aria-label={BUDGET.chartAlt} data-testid="budget-chart">
      <ul aria-hidden="true" className="grid gap-3">
        {shown.map((l) => (
          <li
            key={l.category}
            className="grid gap-1 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-center md:gap-4"
          >
            <span className="text-16 font-bold md:text-20">{l.label}</span>
            {/* Only the bar is clipped, so it slides out of the axis; the amount never is. */}
            <span className="flex items-center gap-3">
              <span
                className="block h-8 shrink-0 overflow-hidden"
                style={{ width: `${(l.amount / max) * 64}%` }}
              >
                <span className="block h-full w-full bg-green" data-bar />
              </span>
              <span className="whitespace-nowrap text-20 font-bold" data-count={l.amount} data-prefix="S$">
                S${l.amount.toLocaleString('en-SG')}
              </span>
            </span>
          </li>
        ))}
      </ul>
      <p
        aria-hidden="true"
        className="mt-4 grid border-t-[3px] border-black pt-3 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-4"
      >
        <span className="text-20 font-bold">{BUDGET.totalRow}</span>
        <span className="text-20 font-bold" data-count={total} data-prefix="S$">
          S${total.toLocaleString('en-SG')}
        </span>
      </p>
      <p aria-hidden="true" className="mt-1 text-14">
        {BUDGET.venueNote}
      </p>
    </div>
  );
}
