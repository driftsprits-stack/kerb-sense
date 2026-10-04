import { useSyncExternalStore } from 'react';

// The visitor's "Pause motion" choice (WCAG 2.2.2), shared by everything that
// moves on its own: the hero's drifting bars and the gameplay clip. It also
// marks <html data-motion="paused"> so CSS animations stop. It lasts for the
// visit only (no storage).
let paused = false;
const listeners = new Set<() => void>();

export function setMotionPaused(next: boolean): void {
  paused = next;
  document.documentElement.dataset.motion = next ? 'paused' : 'on';
  listeners.forEach((l) => l());
}

export function useMotionPaused(): boolean {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => paused,
    () => false,
  );
}

/** The reduce-motion preference, live: it follows changes made while the page is open. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (l) => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      mq.addEventListener('change', l);
      return () => mq.removeEventListener('change', l);
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  );
}
