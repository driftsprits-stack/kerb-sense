import { useEffect, useRef, useState, type ReactNode } from 'react';
import { gsap } from 'gsap';

// Swaps between two drawings behind a grid of black blocks (the React
// Bits Pixel Transition idea, without opacity). The blocks scale up to
// cover the figure, the drawing changes, the blocks scale away. Under
// reduced motion the drawing changes at once.
const COLUMNS = 12;
const ROWS = 8;

interface PixelSwapProps {
  /** Which drawing shows. */
  state: 'a' | 'b';
  a: ReactNode;
  b: ReactNode;
  className?: string;
  label: string;
}

export default function PixelSwap({ state, a, b, className = '', label }: PixelSwapProps) {
  const [shown, setShown] = useState(state);
  const gridRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (shown === state) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const grid = gridRef.current;
    if (reduced || !grid) {
      setShown(state);
      return;
    }
    const blocks = grid.querySelectorAll<HTMLElement>('[data-block]');
    const tl = gsap.timeline();
    tl.to(blocks, {
      scale: 1,
      duration: 0.25,
      ease: 'none',
      stagger: { each: 0.004, from: 'random' },
    })
      .call(() => setShown(state))
      .to(blocks, { scale: 0, duration: 0.25, ease: 'none', stagger: { each: 0.004, from: 'random' } });
    return () => {
      tl.kill();
      gsap.set(blocks, { scale: 0 });
    };
  }, [state, shown]);

  return (
    <div
      className={`relative overflow-clip ${className}`}
      role="group"
      aria-label={label}
      data-testid="pixel-swap"
    >
      <div data-swap-shown={shown}>{shown === 'a' ? a : b}</div>
      <div
        ref={gridRef}
        className="pointer-events-none absolute inset-0 grid"
        style={{ gridTemplateColumns: `repeat(${COLUMNS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
        aria-hidden="true"
      >
        {Array.from({ length: COLUMNS * ROWS }, (_, i) => (
          <span key={i} data-block className="block bg-black" style={{ transform: 'scale(0)' }} />
        ))}
      </div>
    </div>
  );
}
