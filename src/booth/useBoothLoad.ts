import { useEffect, useState, type RefObject } from 'react';
import { BOOTH } from '../content';
import { breaker, withRetry } from '../lib/retry';

export type BoothMode = 'waiting' | 'loading' | 'ready' | 'fallback';
const MODEL_URL = `${import.meta.env.BASE_URL}models/booth-flat.glb`;

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * Loads the booth when `ref` comes near the viewport. Skips 3D for reduced
 * motion or no WebGL. Fetches the GLB with retries and a circuit breaker so
 * the browser cache serves it to the viewer (E15, E19, E20, S7).
 */
export function useBoothLoad(ref: RefObject<HTMLElement | null>, rootMargin = '600px 0px') {
  const [mode, setMode] = useState<BoothMode>('waiting');
  const [message, setMessage] = useState<string>(BOOTH.loading);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        setReduced(prefersReduced);
        if (prefersReduced) {
          setMessage(BOOTH.reducedMotion);
          setMode('fallback');
        } else if (!hasWebGL()) {
          setMessage(BOOTH.noWebgl);
          setMode('fallback');
        } else {
          setMode('loading');
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);

  useEffect(() => {
    if (mode !== 'loading') return;
    let cancelled = false;
    breaker
      .run('booth-glb', () =>
        withRetry(async (signal) => {
          const res = await fetch(MODEL_URL, { signal });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          await res.arrayBuffer();
        }),
      )
      .then(() => {
        if (!cancelled) setMode('ready');
      })
      .catch((error: unknown) => {
        console.error(
          '[kerb-sense] The booth model did not load.',
          error instanceof Error ? error.message : error,
        );
        if (!cancelled) {
          setMessage(BOOTH.error);
          setMode('fallback');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [mode]);

  return { mode, message, reduced, setMode, setMessage };
}
