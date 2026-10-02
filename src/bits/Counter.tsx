import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

// Ported from React Bits Counter. Changes: no motion/react, no gradient
// fades, no border radius. Digits roll once behind a hard mask when the
// counter enters the viewport. Under prefers-reduced-motion the final
// value is shown at once.
interface CounterProps {
  value: number;
  fontSize?: number;
  className?: string;
}

function digitsOf(value: number): number[] {
  return [...String(value)].map((c) => Number(c));
}

export default function Counter({ value, fontSize = 96, className = '' }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [reduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  // With reduced motion the final value is shown at once.
  const [started, setStarted] = useState(reduced);
  const height = fontSize;
  const digits = digitsOf(value);
  const formatted = value.toLocaleString('en-SG');

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
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const columns = el.querySelectorAll<HTMLElement>('[data-digit]');
    const tween = gsap.fromTo(
      columns,
      { y: 0 },
      {
        y: (i: number) => -Number(columns[i]?.dataset.digit ?? 0) * height,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.05,
        force3D: true,
      },
    );
    return () => {
      tween.kill();
    };
  }, [started, height]);

  // Before the animation starts, every column shows 0. After it ends, each
  // column has rolled to its digit. The accessible value is always the
  // final number.
  return (
    <span
      ref={ref}
      className={`inline-flex ks-mask align-bottom ${className}`}
      style={{ height }}
      aria-label={formatted}
      role="img"
    >
      {digits.map((digit, i) => (
        <span
          key={i}
          className="inline-flex flex-col"
          aria-hidden="true"
          style={{ fontSize, lineHeight: `${height}px`, fontWeight: 700, letterSpacing: '-0.04em' }}
        >
          <span
            data-digit={digit}
            className="flex flex-col"
            style={reduced ? { transform: `translateY(${-digit * height}px)` } : undefined}
          >
            {Array.from({ length: 10 }, (_, n) => (
              <span key={n} style={{ height, display: 'block' }}>
                {n}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}
