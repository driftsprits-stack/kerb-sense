import { Suspense, lazy, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import ErrorBoundary from '../components/ErrorBoundary';
import Section from '../components/Section';
import LabelBlock, { StatusLabel } from '../components/LabelBlock';
import PixelSwap from '../components/PixelSwap';
import { DimensionDrawing, ExplodedDrawing, partImage } from '../components/Drawings';
import { BOOTH } from '../content';
import { SLOT } from '../copy';
import { BOOTH_ASSEMBLED, BOOTH_DIMENSIONS, BOOTH_EXPLODED } from '../lib/artwork';
import { cataloguePartsOf, partById_ } from '../lib/parts';
import { THREE_QUARTER, VIEW_LABELS, VIEW_ORDER, isViewName, type ViewName } from '../lib/views';
import BoothFallback from '../booth/BoothFallback';
import { useBoothLoad } from '../booth/useBoothLoad';
import type { CameraReport } from '../booth/BoothViewer';

const BoothViewer = lazy(() => import('../booth/BoothViewer'));

// The booth: a sticky 3D viewer beside three short explanations, the view
// buttons, the ASSEMBLED / EXPLODED drawing, the six-part catalogue with a
// detail panel, the dimension drawing and one row of specs.
//
// One source of truth for the highlighted part: the visitor's own choice
// (manual) wins. Scrolling to a new explanation hands control back to the
// tour, so the two never fight.
const TOUR_MEDIA = '(min-width: 1024px) and (min-height: 700px)';

export default function Booth() {
  const stageRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const { mode, message, reduced } = useBoothLoad(stageRef);
  const [view, setView] = useState<ViewName>('front');
  const [pendingView, setPendingView] = useState<ViewName | null>(null);
  const [manual, setManual] = useState<string | null>(null);
  const [manualOn, setManualOn] = useState(false);
  const [tour, setTour] = useState(0);
  const tourRef = useRef(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const [drawing, setDrawing] = useState<'a' | 'b'>('a');
  const [camera, setCamera] = useState<CameraReport>({ azimuth: THREE_QUARTER, polar: Math.PI / 2 });
  const tourStep = BOOTH.tour[tour] ?? BOOTH.tour[0];
  const selected = manualOn ? manual : tourStep.id;

  // The tour: the explanation nearest the middle of the screen is current.
  // Only on wide, tall screens; elsewhere the explanations are a plain list.
  useEffect(() => {
    const mq = window.matchMedia(TOUR_MEDIA);
    let io: IntersectionObserver | null = null;
    const start = () => {
      io?.disconnect();
      io = null;
      if (!mq.matches) return;
      io = new IntersectionObserver(
        (entries) => {
          const hit = entries.find((e) => e.isIntersecting);
          if (!hit) return;
          const i = Number((hit.target as HTMLElement).dataset.tour);
          if (i === tourRef.current) return;
          // A new explanation hands control back to the tour and turns the booth.
          tourRef.current = i;
          setTour(i);
          setManualOn(false);
          const v = BOOTH.tour[i]?.view;
          if (v && isViewName(v)) {
            setView(v);
            setPendingView(v);
          }
        },
        { rootMargin: '-45% 0px -45% 0px' },
      );
      document.querySelectorAll('[data-tour]').forEach((el) => io?.observe(el));
    };
    start();
    mq.addEventListener('change', start);
    return () => {
      mq.removeEventListener('change', start);
      io?.disconnect();
    };
  }, []);

  const chooseView = useCallback((name: ViewName) => {
    setManualOn(true);
    setView(name);
    setPendingView(name);
  }, []);
  const onViewReached = useCallback(() => setPendingView(null), []);
  const onSelect = useCallback((part: string | null) => {
    setManualOn(true);
    setManual(part);
  }, []);

  // The detail panel slides in when the selected part changes. Transform only.
  const detailPart = manualOn ? partById_(manual ?? '') : undefined;
  useLayoutEffect(() => {
    const el = detailRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tween = gsap.fromTo(el, { x: 24 }, { x: 0, duration: 0.25, ease: 'power2.out', force3D: true });
    return () => {
      tween.kill();
    };
  }, [detailPart?.id]);

  const current = partById_(hovered ?? selected ?? '');
  const fallback = <BoothFallback view={view} message={message} selected={selected} />;
  const parts = cataloguePartsOf();
  const detail = parts.find((p) => p.id === detailPart?.id);

  return (
    <Section
      id="booth"
      slot={SLOT.booth}
      body={BOOTH.body}
      status={<StatusLabel>{BOOTH.statusLabel}</StatusLabel>}
    >
      {/* The tour: the booth stays in view while three short explanations scroll past. */}
      <div className="grid gap-4 lg:grid-cols-12" data-testid="booth-scene">
        <div className="lg:col-span-7">
          <div className="flex flex-col gap-2 [@media(min-width:1024px)_and_(min-height:700px)]:sticky [@media(min-width:1024px)_and_(min-height:700px)]:top-[88px]">
            <div className="flex flex-wrap gap-1" role="group" aria-label="Views" data-testid="view-group">
              {VIEW_ORDER.map((name) => {
                const on = view === name;
                return (
                  <button
                    key={name}
                    type="button"
                    className={`ks-button ks-button--small ${on ? 'ks-button--black' : 'ks-button--outline-black'}`}
                    aria-pressed={on}
                    onClick={() => chooseView(name)}
                    data-testid={`view-${name}`}
                  >
                    {VIEW_LABELS[name]}
                  </button>
                );
              })}
            </div>
            <div
              ref={stageRef}
              className="relative aspect-[4/3] w-full border-[3px] border-black bg-paper"
              data-testid="booth-stage"
              data-azimuth={camera.azimuth}
              data-polar={camera.polar}
            >
              {mode === 'ready' ? (
                <ErrorBoundary
                  name="booth viewer"
                  fallback={<BoothFallback view={view} message={BOOTH.error} selected={selected} />}
                >
                  <Suspense
                    fallback={<BoothFallback view={view} message={BOOTH.loading} selected={selected} />}
                  >
                    <BoothViewer
                      view={pendingView}
                      onViewReached={onViewReached}
                      selected={selected}
                      onSelect={onSelect}
                      onHover={setHovered}
                      reduced={reduced}
                      interactive
                      onCamera={setCamera}
                      canvasLabel={BOOTH.canvasLabel}
                    />
                  </Suspense>
                </ErrorBoundary>
              ) : (
                fallback
              )}
              {current && (
                <p
                  className="absolute bottom-2 left-2 flex flex-wrap items-center gap-2"
                  aria-live="polite"
                  data-testid="part-readout"
                >
                  <LabelBlock colour="green" className="text-16">
                    {current.name}
                  </LabelBlock>
                  <LabelBlock className="text-14">{current.purpose}</LabelBlock>
                </p>
              )}
            </div>
          </div>
        </div>
        <ol
          className="lg:col-span-5 [@media(min-width:1024px)_and_(min-height:700px)]:pb-[7vh]"
          aria-label="The booth in three parts"
          data-testid="booth-tour"
        >
          {BOOTH.tour.map((t, i) => {
            const on = !manualOn && tour === i;
            return (
              <li
                key={t.id}
                data-tour={i}
                className="flex flex-col justify-center border-t-[3px] border-black py-4 [@media(min-width:1024px)_and_(min-height:700px)]:min-h-[38vh]"
                aria-current={on ? 'step' : undefined}
              >
                <LabelBlock colour={on ? 'green' : 'black'}>{String(i + 1)}</LabelBlock>
                <p className="ks-block mt-2 text-28 md:text-40">{t.label}</p>
                <p className="mt-1 max-w-[36ch] text-16 md:text-20">{t.line}</p>
              </li>
            );
          })}
        </ol>
      </div>

      {/* ASSEMBLED / EXPLODED: one button, one pixel swap. */}
      <div className="mt-8 grid gap-2 md:grid-cols-12 md:gap-4">
        <div className="md:col-span-8">
          <PixelSwap
            state={drawing}
            label={drawing === 'a' ? BOOTH.assembledAlt : BOOTH.explodedAlt}
            className="border-[3px] border-black bg-white"
            a={
              <img
                src={BOOTH_ASSEMBLED}
                alt={BOOTH.assembledAlt}
                width={1200}
                height={1200}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full object-contain p-4"
              />
            }
            b={
              BOOTH_EXPLODED ? (
                <img
                  src={BOOTH_EXPLODED}
                  alt={BOOTH.explodedAlt}
                  width={1200}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-contain"
                />
              ) : (
                <ExplodedDrawing title={BOOTH.explodedAlt} />
              )
            }
          />
        </div>
        <div className="md:col-span-4">
          <button
            type="button"
            className="ks-button ks-button--black w-full"
            aria-pressed={drawing === 'b'}
            onClick={() => setDrawing(drawing === 'a' ? 'b' : 'a')}
            data-testid="explode-toggle"
          >
            {drawing === 'a' ? BOOTH.exploded : BOOTH.assembled}
          </button>
        </div>
      </div>

      {/* The parts catalogue and its detail panel. Selecting a cell highlights the part on the model
          and opens its detail beside the grid (below it on phones). */}
      <div className="mt-8 grid gap-4 lg:grid-cols-12 lg:items-start">
        <ul
          className="grid grid-cols-2 border-l border-t border-black md:grid-cols-3 lg:col-span-8"
          data-testid="parts-catalogue"
          aria-label={BOOTH.catalogueLabel}
        >
          {parts.map((part) => {
            const on = manualOn && manual === part.id;
            return (
              <li key={part.id} className="relative border-b border-r border-black bg-white">
                <button
                  type="button"
                  className={`block w-full p-3 text-left hover:outline hover:outline-[3px] hover:-outline-offset-[3px] hover:outline-black ${on ? 'outline outline-[4px] -outline-offset-[4px] outline-green' : ''}`}
                  aria-pressed={on}
                  onClick={() => onSelect(on ? null : part.id)}
                  onMouseEnter={() => setHovered(part.id)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(part.id)}
                  onBlur={() => setHovered(null)}
                  data-testid={`part-${part.id}`}
                >
                  <span className="flex items-start justify-between">
                    <LabelBlock colour={on ? 'green' : 'black'}>{part.number}</LabelBlock>
                  </span>
                  <img
                    src={partImage(part.image)}
                    alt=""
                    width={800}
                    height={800}
                    loading="lazy"
                    decoding="async"
                    className="mx-auto mt-2 aspect-square w-3/4 object-contain"
                  />
                  <span className="ks-block mt-2 block text-16">{part.name}</span>
                  <span className="ks-block mt-1 block text-12">{part.purpose}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <div
          className="border-[3px] border-black bg-white p-4 lg:sticky lg:top-[88px] lg:col-span-4"
          aria-live="polite"
          data-testid="part-detail"
        >
          <div ref={detailRef}>
            {detail ? (
              <>
                <LabelBlock colour="green">{detail.number}</LabelBlock>
                <img
                  src={partImage(detail.image)}
                  alt=""
                  width={800}
                  height={800}
                  className="mx-auto my-4 aspect-square w-2/3 object-contain"
                />
                <p className="ks-block text-28">{detail.name}</p>
                <p className="ks-block mt-1 text-16">{detail.purpose}</p>
              </>
            ) : (
              <p className="ks-block flex aspect-square items-center justify-center text-20">
                {BOOTH.detailEmpty}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* The dimensions and one row of specs. */}
      <div className="mt-8 grid gap-4 md:grid-cols-12 md:items-start">
        <div className="border-[3px] border-black bg-white md:col-span-7">
          {BOOTH_DIMENSIONS ? (
            <img
              src={BOOTH_DIMENSIONS}
              alt={BOOTH.dimensionsAlt}
              width={3040}
              height={1760}
              loading="lazy"
              decoding="async"
              className="w-full"
            />
          ) : (
            <DimensionDrawing title={BOOTH.dimensionsAlt} />
          )}
        </div>
        <dl
          className="ks-block grid grid-cols-2 gap-px border-[3px] border-black bg-black md:col-span-5 md:grid-cols-1"
          data-testid="spec-row"
        >
          {BOOTH.specs.map(([k, v]) => (
            <div key={k} className="bg-paper p-3">
              <dt className="text-12">{k}</dt>
              <dd className="mt-1 text-16">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
