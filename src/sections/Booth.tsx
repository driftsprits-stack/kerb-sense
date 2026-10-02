import * as Toggle from '@radix-ui/react-toggle';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import Picture from '../components/Picture';
import SectionTab from '../components/SectionTab';
import LabelBlock from '../components/LabelBlock';
import { BOOTH } from '../content';
import { cataloguePartsOf } from '../lib/explode';
import { breaker, withRetry } from '../lib/retry';
import { VIEW_LABELS, VIEW_ORDER, isViewName, type ViewName } from '../lib/views';
import BoothFallback from '../booth/BoothFallback';
import elevations from '../assets/plate-elevations.webp';

const base = import.meta.env.BASE_URL;
const MODEL_URL = `${base}models/booth-flat.glb`;
const BoothViewer = lazy(() => import('../booth/BoothViewer'));

type Mode = 'waiting' | 'loading' | 'ready' | 'fallback';

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export default function Booth() {
  const [mode, setMode] = useState<Mode>('waiting');
  const [message, setMessage] = useState<string>(BOOTH.loading);
  const [view, setView] = useState<ViewName>('front');
  const [pendingView, setPendingView] = useState<ViewName | null>('front');
  const [exploded, setExploded] = useState(false);
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);
  const [reduced, setReduced] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Load only when the section is near the viewport. Skip 3D entirely for
  // reduced motion or no WebGL. Fetch the GLB with retries and a circuit
  // breaker, then hand it to the viewer (the browser cache serves it).
  useEffect(() => {
    const el = sectionRef.current;
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
      { rootMargin: '600px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

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

  const onViewChange = useCallback((value: string) => {
    if (!isViewName(value)) return;
    setView(value);
    setPendingView(value);
  }, []);

  const onViewReached = useCallback(() => setPendingView(null), []);

  const fallback = <BoothFallback view={view} message={message} />;

  return (
    <section
      id="booth"
      ref={sectionRef}
      className="field-paper border-t-[3px] border-black"
      aria-labelledby="booth-title"
    >
      <div className="ks-container py-12 md:py-20">
        <SectionTab number={4} title={BOOTH.headline} field="yellow" id="booth-title" />
        <div className="ks-grid mt-10 gap-y-10">
          <div className="col-span-4 md:col-span-5">
            <p className="ks-display text-40 md:text-64">{BOOTH.lead}</p>
            <p className="mt-6 inline-block bg-black px-2 py-1 text-14 font-bold text-white">{BOOTH.where}</p>
          </div>

          {/* The viewer. */}
          <div className="col-span-4 md:col-span-12">
            <h3 className="ks-h3">{BOOTH.viewerTitle}</h3>
            <p className="mt-2 text-14">{BOOTH.viewerHint}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <ToggleGroup.Root
                type="single"
                value={view}
                onValueChange={onViewChange}
                aria-label="Choose a view."
                className="flex flex-wrap border-[3px] border-black"
                data-testid="view-group"
              >
                {VIEW_ORDER.map((name) => (
                  <ToggleGroup.Item
                    key={name}
                    value={name}
                    className="border-r-[3px] border-black px-4 py-2 text-16 font-bold last:border-r-0 hover:bg-black hover:text-white data-[state=on]:bg-black data-[state=on]:text-white"
                    data-testid={`view-${name}`}
                  >
                    {VIEW_LABELS[name]}
                  </ToggleGroup.Item>
                ))}
              </ToggleGroup.Root>
              <Toggle.Root
                pressed={exploded}
                onPressedChange={setExploded}
                disabled={mode !== 'ready'}
                aria-label="Explode the booth into its parts."
                className="border-[3px] border-black px-4 py-2 text-16 font-bold hover:bg-black hover:text-white data-[state=on]:bg-red data-[state=on]:border-red data-[state=on]:text-white disabled:cursor-default disabled:hover:bg-transparent disabled:hover:text-black"
                data-testid="explode-toggle"
              >
                {exploded ? BOOTH.assemble : BOOTH.explode}
              </Toggle.Root>
              {hoverLabel && (
                <LabelBlock className="text-16" aria-live="polite">
                  {hoverLabel}
                </LabelBlock>
              )}
            </div>

            <div
              className="relative mt-4 aspect-square w-full border-[3px] border-black bg-white md:aspect-[16/10]"
              data-testid="booth-stage"
            >
              {mode === 'ready' ? (
                <ErrorBoundary
                  name="booth viewer"
                  fallback={<BoothFallback view={view} message={BOOTH.error} />}
                >
                  <Suspense fallback={<BoothFallback view={view} message={BOOTH.loading} />}>
                    <BoothViewer
                      exploded={exploded}
                      view={pendingView}
                      onViewReached={onViewReached}
                      onHover={setHoverLabel}
                      reduced={reduced}
                      canvasLabel={BOOTH.canvasLabel}
                    />
                  </Suspense>
                </ErrorBoundary>
              ) : (
                fallback
              )}
            </div>
          </div>

          {/* The parts catalogue. */}
          <div className="col-span-4 md:col-span-12">
            <h3 className="ks-h3">{BOOTH.catalogueTitle}</h3>
            <ul
              className="mt-4 grid grid-cols-2 border-l border-t border-black sm:grid-cols-3 md:grid-cols-5"
              role="list"
              data-testid="parts-catalogue"
            >
              {cataloguePartsOf().map((part) => (
                <li
                  key={part.node}
                  className="border-b border-r border-black bg-white p-4"
                  onMouseEnter={() => setHoverLabel(part.label)}
                  onMouseLeave={() => setHoverLabel(null)}
                >
                  <button
                    type="button"
                    className="block w-full text-left"
                    onFocus={() => setHoverLabel(part.label)}
                    onBlur={() => setHoverLabel(null)}
                    onClick={() => setHoverLabel(part.label)}
                    aria-label={`${part.label} ${part.spec ?? ''}`.trim()}
                  >
                    <Picture
                      folder="parts"
                      name={part.image}
                      alt=""
                      sizes="(min-width: 768px) 18vw, 45vw"
                      className="aspect-square w-full object-contain"
                    />
                    <span className="mt-3 block text-16 font-bold">{part.label}</span>
                    {part.spec && <span className="mt-1 block text-14">{part.spec}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* The specification. */}
          <div className="col-span-4 md:col-span-6">
            <h3 className="ks-h3">{BOOTH.specTitle}</h3>
            <table className="ks-table mt-4" data-testid="spec-table">
              <tbody>
                {BOOTH.specs.map(([k, v]) => (
                  <tr key={k}>
                    <th scope="row" className="w-32">
                      {k}
                    </th>
                    <td className="text-16">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <a href={`${base}play/`} className="ks-link mt-6 inline-block text-16 font-bold">
              Play the game the booth runs.
            </a>
          </div>
          <div className="col-span-4 md:col-span-6">
            <figure className="border-[3px] border-black bg-white p-4">
              <img
                src={elevations}
                alt={BOOTH.elevationsAlt}
                width={2400}
                height={871}
                loading="lazy"
                decoding="async"
              />
              <figcaption className="mt-3 text-14 font-bold">Front. Side. Back.</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
