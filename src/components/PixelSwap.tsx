import { useEffect, useRef, useState, type ReactNode } from 'react';
import { gsap } from 'gsap';

// Swaps between two drawings behind a grid of black blocks (the React Bits
// Pixel Transition idea, without opacity). The blocks grow from the centre to
// cover the figure (180 ms + 60 ms stagger), the drawing changes, the blocks
// shrink away the same way: 480 ms in all. Blocks are about 24 px square,
// measured to the box. The animation depends only on the requested drawing,
// so its own swap halfway never cancels it; a new request mid-swap shows the
// latest choice. Under reduced motion the drawing changes at once.
const BLOCK = 24;

interface PixelSwapProps {
  /** Which drawing is requested. */
  state: 'a' | 'b';
  a: ReactNode;
  b: ReactNode;
  className?: string;
  label: string;
}

export default function PixelSwap({ state, a, b, className = '', label }: PixelSwapProps) {
  const [shown, setShown] = useState(state);
  const shownRef = useRef(state);
  const boxRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [grid, setGrid] = useState({ cols: 12, rows: 8 });

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const ro = new ResizeObserver(() => {
      const cols = Math.max(1, Math.ceil(box.clientWidth / BLOCK));
      const rows = Math.max(1, Math.ceil(box.clientHeight / BLOCK));
      setGrid((g) => (g.cols === cols && g.rows === rows ? g : { cols, rows }));
    });
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (shownRef.current === state) return;
    const show = () => {
      shownRef.current = state;
      setShown(state);
    };
    const blocks = gridRef.current?.querySelectorAll<HTMLElement>('[data-block]');
    if (!blocks || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      show();
      return;
    }
    const stagger = {
      amount: 0.06,
      from: 'center' as const,
      grid: [grid.rows, grid.cols] as [number, number],
    };
    const tl = gsap
      .timeline()
      .to(blocks, { scale: 1, duration: 0.18, ease: 'power2.inOut', stagger })
      .call(show)
      .to(blocks, { scale: 0, duration: 0.18, ease: 'power2.inOut', stagger });
    return () => {
      tl.kill();
      gsap.set(blocks, { scale: 0 });
      // Interrupted: show the drawing that was asked for, then the next request animates.
      if (shownRef.current !== state) show();
    };
    // The grid size is read when a swap starts; resizing must not restart it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div
      ref={boxRef}
      className={`relative overflow-clip ${className}`}
      role="group"
      aria-label={label}
      data-testid="pixel-swap"
    >
      <div data-swap-shown={shown}>{shown === 'a' ? a : b}</div>
      <div
        ref={gridRef}
        className="pointer-events-none absolute inset-0 grid"
        style={{
          gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
          gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
        }}
        aria-hidden="true"
      >
        {Array.from({ length: grid.cols * grid.rows }, (_, i) => (
          <span key={i} data-block className="block bg-black" style={{ transform: 'scale(0)' }} />
        ))}
      </div>
    </div>
  );
}
