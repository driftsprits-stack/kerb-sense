import { useEffect, useRef } from 'react';
import { ROAD_BAND } from '../content';

// The road band. Ported from React Bits ScrollVelocity, without
// motion/react and without its drop-shadow filter. Solid black type moves
// across a yellow field. The scroll velocity changes the speed. Under
// prefers-reduced-motion it does not move.
export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let x = 0;
    let lastScroll = window.scrollY;
    let velocity = 0;
    let last = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const delta = Math.min(50, now - last);
      last = now;
      const scroll = window.scrollY;
      velocity = velocity * 0.9 + (scroll - lastScroll) * 0.1;
      lastScroll = scroll;
      const base = 60; // px per second
      x -= (base + Math.min(600, Math.abs(velocity) * 20)) * (delta / 1000);
      const copy = track.firstElementChild as HTMLElement | null;
      const width = copy?.offsetWidth ?? 0;
      if (width > 0 && x <= -width) x += width;
      track.style.transform = `translate3d(${x}px, 0, 0)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const text = ROAD_BAND.join(' ');
  return (
    <div
      className="field-yellow overflow-clip border-y-[3px] border-black py-3"
      aria-label={text}
      role="marquee"
    >
      <div ref={trackRef} className="flex w-max whitespace-nowrap">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} className="ks-display pr-10 text-64 text-black" aria-hidden={i > 0}>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
