import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect } from 'react';

gsap.registerPlugin(ScrollTrigger);

let hashRestored = false;

/**
 * Pins add space to the page after the browser has already jumped to a
 * deep link such as #booth. After the first refresh the page scrolls to the
 * target again, once, so the link lands where it should.
 */
function restoreHash() {
  if (hashRestored) return;
  hashRestored = true;
  const id = window.location.hash.slice(1);
  if (!id) return;
  const target = document.getElementById(id);
  if (target) target.scrollIntoView();
}

/** True when scroll-driven motion is allowed on this device. */
export function motionAllowed(): boolean {
  return typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Runs a GSAP scroll scene inside a layout effect. The builder receives a
 * context and returns nothing; everything it creates is reverted on
 * unmount. With reduced motion nothing runs, so the page shows its final
 * state. Every tween must use transforms only (WEBSITE-STANDARDS section 4).
 */
export function useUnfold(
  build: (ctx: { gsap: typeof gsap; ScrollTrigger: typeof ScrollTrigger; phone: boolean }) => void,
  deps: unknown[] = [],
) {
  useLayoutEffect(() => {
    if (!motionAllowed()) return;
    const phone = window.innerWidth < 768;
    const ctx = gsap.context(() => build({ gsap, ScrollTrigger, phone }));
    // Images and fonts change the page height after the first layout.
    const refresh = () => {
      ScrollTrigger.refresh();
      restoreHash();
    };
    window.addEventListener('load', refresh);
    const timer = window.setTimeout(refresh, 800);
    return () => {
      window.removeEventListener('load', refresh);
      window.clearTimeout(timer);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
