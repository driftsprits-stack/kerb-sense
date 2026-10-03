import { Suspense, lazy, useCallback, useRef, useState } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import Section from '../components/Section';
import LabelBlock, { StatusLabel } from '../components/LabelBlock';
import PixelSwap from '../components/PixelSwap';
import { DimensionDrawing, ExplodedDrawing, partImage } from '../components/Drawings';
import { useUnfold } from '../components/unfold';
import { BOOTH } from '../content';
import { SLOT } from '../copy';
import { BOOTH_ASSEMBLED, BOOTH_DIMENSIONS, BOOTH_EXPLODED } from '../lib/artwork';
import { SCENE_PARTS, cataloguePartsOf, partById_ } from '../lib/parts';
import { THREE_QUARTER, VIEW_LABELS, VIEW_ORDER, type ViewName } from '../lib/views';
import BoothFallback from '../booth/BoothFallback';
import { useBoothLoad } from '../booth/useBoothLoad';
import type { CameraReport, SceneDrive } from '../booth/BoothViewer';

const BoothViewer = lazy(() => import('../booth/BoothViewer'));

// The booth: the 3D viewer with the scroll scene, the view buttons, the
// ASSEMBLED / EXPLODED drawing, the six-part catalogue, the dimension
// drawing and one row of specs.
export default function Booth() {
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const drive = useRef<SceneDrive>({ active: false, azimuth: THREE_QUARTER, part: null });
  const takenOver = useRef(false);
  const { mode, message, reduced } = useBoothLoad(stageRef);
  const [view, setView] = useState<ViewName>('front');
  const [pendingView, setPendingView] = useState<ViewName | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [sceneDone, setSceneDone] = useState(false);
  const [drawing, setDrawing] = useState<'a' | 'b'>('a');
  const [camera, setCamera] = useState<CameraReport>({ azimuth: THREE_QUARTER, polar: Math.PI / 2 });

  // The scroll scene: pin the booth, turn it from the front left to the
  // side, then slide each key part's label in beside it. A press on a view
  // button takes over: the scene stops driving until the visitor scrolls
  // back above it.
  useUnfold(({ gsap, phone }) => {
    const scene = sceneRef.current;
    if (!scene) return;
    const labels = scene.querySelectorAll('[data-scene-label]');
    const finish = () => {
      drive.current.active = false;
      setSceneDone(true);
      setView('side');
      setPendingView('side');
    };
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scene,
        start: 'top 72px',
        end: phone ? '+=90%' : '+=120%',
        pin: true,
        scrub: true,
        onLeave: finish,
        onLeaveBack: () => {
          takenOver.current = false;
          drive.current.active = false;
        },
        onEnterBack: () => {
          if (!takenOver.current) drive.current.active = true;
        },
        onUpdate: (self) => {
          if (takenOver.current) return;
          const p = self.progress;
          const d = drive.current;
          d.active = p < 0.999;
          const turn = Math.min(p, 0.5) / 0.5;
          d.azimuth = THREE_QUARTER + turn * (Math.PI / 2 - THREE_QUARTER);
          const stage =
            p < 0.5
              ? -1
              : Math.min(SCENE_PARTS.length - 1, Math.floor(((p - 0.5) / 0.5) * SCENE_PARTS.length));
          d.part = stage < 0 ? null : (SCENE_PARTS[stage] ?? null);
          if (p >= 0.999) finish();
        },
      },
    });
    tl.from(labels, { xPercent: 120, ease: 'none', stagger: { each: 0.1 }, duration: 0.5 }, 0.5);
  });

  const chooseView = useCallback((name: ViewName) => {
    takenOver.current = true;
    drive.current.active = false;
    setView(name);
    setPendingView(name);
  }, []);
  const onViewReached = useCallback(() => setPendingView(null), []);
  const onSelect = useCallback((part: string | null) => setSelected(part), []);

  const current = partById_(hovered ?? selected ?? '');
  const fallback = <BoothFallback view={view} message={message} selected={selected} />;
  const parts = cataloguePartsOf();

  return (
    <Section
      id="booth"
      slot={SLOT.booth}
      body={BOOTH.body}
      status={<StatusLabel>{BOOTH.statusLabel}</StatusLabel>}
    >
      {/* The scroll scene and the viewer. */}
      <div ref={sceneRef} className="bg-paper" data-testid="booth-scene">
        <div className="grid gap-2 md:grid-cols-12 md:gap-4">
          <div
            ref={stageRef}
            className="relative aspect-[4/3] w-full border-[3px] border-black bg-paper md:col-span-8 md:aspect-[16/10]"
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
                    drive={drive}
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
          <div className="flex flex-col gap-2 md:col-span-4">
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
            {/* The scene labels. They slide in beside the booth during the scene.
                Without motion they are simply listed here. */}
            <ol
              className="ks-block flex flex-col gap-1 overflow-clip"
              aria-label="Key parts"
              data-testid="scene-labels"
            >
              {SCENE_PARTS.map((id) => {
                const part = parts.find((p) => p.id === id);
                if (!part) return null;
                return (
                  <li
                    key={id}
                    data-scene-label={id}
                    className="flex items-baseline gap-2 border-t border-black pt-1"
                  >
                    <LabelBlock colour={sceneDone || selected === id ? 'green' : 'black'}>
                      {part.number}
                    </LabelBlock>
                    <span className="text-14">{part.name}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
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

      {/* The parts catalogue: six equal cells. Selecting a cell highlights the part on the model. */}
      <ul
        className="mt-8 grid grid-cols-2 border-l border-t border-black md:grid-cols-3"
        data-testid="parts-catalogue"
        aria-label={BOOTH.catalogueLabel}
      >
        {parts.map((part) => {
          const on = selected === part.id;
          return (
            <li key={part.id} className="relative border-b border-r border-black bg-white">
              <button
                type="button"
                className={`block w-full p-3 text-left hover:bg-black hover:text-white ${on ? 'outline outline-[2px] -outline-offset-[2px] outline-green' : ''}`}
                aria-pressed={on}
                onClick={() => setSelected(on ? null : part.id)}
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

      {/* The dimensions and one row of specs. */}
      <div className="mt-8 grid gap-4 md:grid-cols-12">
        <div className="border-[3px] border-black bg-white md:col-span-7">
          {BOOTH_DIMENSIONS ? (
            <img
              src={BOOTH_DIMENSIONS}
              alt={BOOTH.dimensionsAlt}
              width={640}
              height={420}
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
