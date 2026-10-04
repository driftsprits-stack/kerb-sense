import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

// Ported from React Bits Counter. Changes: no motion/react, no gradient
// fades, no border radius. Digits roll once behind a hard mask when the
// counter enters the viewport. Under prefers-reduced-motion the final
// value is shown at once.
interface CounterProps {
  value: number;
  /** A px number or any CSS size, such as a clamp(), so the number fits its column. */
  fontSize?: number | string;
  className?: string;
}

// Each digit row is taller than 1em, because Kerb Block's digits reach past a
// 1em line box and would be clipped by the mask.
const ROW = '1.2em';

export default function Counter({ value, fontSize = 96, className = '' }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [reduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  // With reduced motion the final value is shown at once.
  const [started, setStarted] = useState(reduced);
  const formatted = value.toLocaleString('en-SG');
  // Digits roll; the thousands comma stays still.
  const tokens = [...formatted].map((c) =>
    /\d/.test(c) ? { digit: Number(c), sep: null } : { digit: 0, sep: c },
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || started) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [started]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !started) return;
    const columns = el.querySelectorAll<HTMLElement>('[data-digit]');
    const final = (i: number) => -Number(columns[i]?.dataset.digit ?? 0) * 10;
    // Reduced motion, even if switched on after load: show the final digits.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(columns, { yPercent: final });
      return;
    }
    const tween = gsap.fromTo(
      columns,
      { yPercent: 0 },
      {
        yPercent: final,
        duration: 0.6,
        ease: 'power2.out',
        stagger: { amount: 0.12 },
        force3D: true,
      },
    );
    return () => {
      tween.kill();
    };
  }, [started]);

  // Before the animation starts, every column shows 0. After it ends, each
  // column has rolled to its digit. The accessible value is always the
  // final number.
  return (
    <span
      ref={ref}
      className={`inline-flex ks-mask align-bottom ${className}`}
      style={{ fontSize, height: ROW, lineHeight: ROW }}
      aria-label={formatted}
      role="img"
    >
      {tokens.map((token, i) =>
        token.sep ? (
          <span key={i} aria-hidden="true">
            {token.sep}
          </span>
        ) : (
          <span
            key={i}
            className="inline-flex flex-col items-center"
            aria-hidden="true"
            style={{ fontWeight: 700, width: '0.78em' }}
          >
            <span
              data-digit={token.digit}
              className="flex flex-col"
              style={reduced ? { transform: `translateY(${-token.digit * 10}%)` } : undefined}
            >
              {Array.from({ length: 10 }, (_, n) => (
                <span key={n} style={{ height: ROW, display: 'block' }}>
                  {n}
                </span>
              ))}
            </span>
          </span>
        ),
      )}
    </span>
  );
}
