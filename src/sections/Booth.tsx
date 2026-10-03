import * as Toggle from '@radix-ui/react-toggle';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { Suspense, lazy, useCallback, useRef, useState } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import Section from '../components/Section';
import LabelBlock, { StatusLabel } from '../components/LabelBlock';
import { useUnfold } from '../components/unfold';
import { BOOTH } from '../content';
import { SLOT } from '../copy';
import { PARTS, SCENE_PARTS, cataloguePartsOf, partById_ } from '../lib/explode';
import { VIEW_LABELS, VIEW_ORDER, isViewName, type ViewName } from '../lib/views';
import BoothFallback from '../booth/BoothFallback';
import { useBoothLoad } from '../booth/useBoothLoad';
import type { SceneDrive } from '../booth/BoothViewer';

const base = import.meta.env.BASE_URL;
const BoothViewer = lazy(() => import('../booth/BoothViewer'));

const partImages = import.meta.glob<string>('../assets/parts/*.svg', {
  eager: true,
  import: 'default',
  query: '?url',
});

// The signature section. The 3D viewer, the scroll scene that turns and
// explodes it, the linked parts catalogue and the design specification.
export default function Booth() {
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const drive = useRef<SceneDrive>({ active: false, azimuth: 0, explode: 0, part: null });
  const { mode, message, reduced } = useBoothLoad(stageRef);
  const [view, setView] = useState<ViewName>('front');
  const [pendingView, setPendingView] = useState<ViewName | null>('front');
  const [exploded, setExploded] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [sceneDone, setSceneDone] = useState(false);

  // The scroll scene: pin the booth, turn it to the side, explode it, then
  // slide each key part's label in beside it. Scroll progress drives the
  // model through `drive`. When the pin releases the viewer is interactive
  // and stays exploded until the visitor presses "Assemble".
  useUnfold(({ gsap, phone }) => {
    const scene = sceneRef.current;
    if (!scene) return;
    // The scene ends on the exploded side view. The controls show that state.
    const finishScene = () => {
      setSceneDone(true);
      setExploded(true);
      setView('side');
      setPendingView('side');
    };
    const labels = scene.querySelectorAll('[data-scene-label]');
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scene,
        start: 'top 64px',
        end: phone ? '+=150%' : '+=220%',
        pin: true,
        scrub: true,
        onLeave: () => {
          drive.current.active = false;
          finishScene();
        },
        onEnterBack: () => {
          drive.current.active = true;
        },
        onUpdate: (self) => {
          const p = self.progress;
          const d = drive.current;
          d.active = p < 0.999;
          d.azimuth = (Math.min(p, 0.3) / 0.3) * (Math.PI / 2);
          d.explode = p < 0.3 ? 0 : Math.min(1, (p - 0.3) / 0.2);
          const stage =
            p < 0.5
              ? -1
              : Math.min(SCENE_PARTS.length - 1, Math.floor(((p - 0.5) / 0.5) * SCENE_PARTS.length));
          d.part = stage < 0 ? null : (SCENE_PARTS[stage] ?? null);
          if (p >= 0.999) finishScene();
        },
      },
    });
    tl.from(labels, { xPercent: 120, ease: 'none', stagger: { each: 0.1 }, duration: 0.5 }, 0.5);
  });

  const onViewChange = useCallback((value: string) => {
    if (!isViewName(value)) return;
    setView(value);
    setPendingView(value);
  }, []);
  const onViewReached = useCallback(() => setPendingView(null), []);
  const onSelect = useCallback((part: string | null) => setSelected(part), []);

  const current = partById_(hovered ?? selected ?? '');
  const fallback = <BoothFallback view={view} message={message} selected={selected} />;

  return (
    <Section
      id="booth"
      slot={SLOT.booth}
      summary={BOOTH.summary}
      status={<StatusLabel>{BOOTH.statusLabel}</StatusLabel>}
    >
      <p className="inline-block bg-black px-2 py-1 text-14 font-bold text-white">{BOOTH.where}</p>

      {/* The scroll scene and the viewer. */}
      <h3 className="ks-h3 mt-10">{BOOTH.viewerTitle}</h3>
      <p className="mt-2 text-14">{BOOTH.viewerHint}</p>
      <div ref={sceneRef} className="mt-2 bg-paper md:mt-4" data-testid="booth-scene">
        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          <ToggleGroup.Root
            type="single"
            value={view}
            onValueChange={onViewChange}
            aria-label="Choose a view"
            className="flex flex-wrap border-[3px] border-black"
            data-testid="view-group"
          >
            {VIEW_ORDER.map((name) => (
              <ToggleGroup.Item
                key={name}
                value={name}
                className="border-r-[3px] border-black px-2 py-1 text-14 font-bold last:border-r-0 hover:bg-black hover:text-white data-[state=on]:bg-black data-[state=on]:text-white md:px-4 md:py-2 md:text-16"
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
            aria-label="Explode the booth into its parts"
            className="border-[3px] border-black px-2 py-1 text-14 font-bold hover:bg-black hover:text-white data-[state=on]:border-green md:px-4 md:py-2 md:text-16 data-[state=on]:bg-green data-[state=on]:text-white disabled:cursor-default disabled:hover:bg-transparent disabled:hover:text-black"
            data-testid="explode-toggle"
          >
            {exploded ? BOOTH.assemble : BOOTH.explode}
          </Toggle.Root>
          {current && (
            <p className="flex flex-wrap items-center gap-2" aria-live="polite" data-testid="part-readout">
              <LabelBlock colour="green" className="text-16">
                {current.name}
              </LabelBlock>
              <span className="text-14 font-bold">{current.purpose}</span>
            </p>
          )}
        </div>

        <div className="mt-2 grid gap-2 md:mt-4 md:grid-cols-12 md:gap-4">
          <div
            ref={stageRef}
            className="relative aspect-[4/3] w-full border-[3px] border-black bg-paper md:col-span-8 md:aspect-[16/11]"
            data-testid="booth-stage"
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
                    exploded={exploded}
                    view={pendingView}
                    onViewReached={onViewReached}
                    selected={selected}
                    onSelect={onSelect}
                    onHover={setHovered}
                    reduced={reduced}
                    interactive
                    drive={drive}
                    canvasLabel={BOOTH.canvasLabel}
                  />
                </Suspense>
              </ErrorBoundary>
            ) : (
              fallback
            )}
          </div>
          {/* The scene labels. They slide in beside the booth during the scene.
              Without motion they are simply listed here. */}
          <ol
            className="flex flex-col gap-1 overflow-clip md:col-span-4 md:gap-2"
            aria-label="Key parts"
            data-testid="scene-labels"
          >
            {SCENE_PARTS.map((id) => {
              const part = partById_(id);
              if (!part) return null;
              return (
                <li
                  key={id}
                  data-scene-label={id}
                  className="border-t-[3px] border-black bg-paper pt-1 md:pt-2"
                >
                  <LabelBlock colour={sceneDone || selected === id ? 'green' : 'black'}>
                    {part.name}
                  </LabelBlock>
                  <p className="mt-1 text-12 md:text-14">{part.purpose}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* The parts catalogue. Selecting a part here highlights it on the model. */}
      <div className="mt-12">
        <h3 className="ks-h3">{BOOTH.catalogueTitle}</h3>
        <p className="mt-2 text-14">{BOOTH.catalogueHint}</p>
        <ul
          className="mt-4 grid grid-cols-2 border-l border-t border-black sm:grid-cols-3 md:grid-cols-5"
          data-testid="parts-catalogue"
          aria-label="The parts"
        >
          {cataloguePartsOf().map((part) => {
            const on = selected === part.id;
            return (
              <li key={part.id} className="relative border-b border-r border-black bg-white">
                <button
                  type="button"
                  className={`block w-full p-4 text-left ${on ? 'outline outline-[2px] -outline-offset-[2px] outline-green' : ''}`}
                  aria-pressed={on}
                  onClick={() => setSelected(on ? null : part.id)}
                  onMouseEnter={() => setHovered(part.id)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(part.id)}
                  onBlur={() => setHovered(null)}
                  data-testid={`part-${part.id}`}
                >
                  <img
                    src={partImages[`../assets/parts/${part.image}.svg`] ?? ''}
                    alt=""
                    width={800}
                    height={800}
                    loading="lazy"
                    decoding="async"
                    className="aspect-square w-full object-contain"
                  />
                  <span className={`mt-3 block text-16 font-bold ${on ? 'text-green' : ''}`}>
                    {part.name}
                  </span>
                  <span className="mt-1 block text-14">{part.purpose}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* The specification. */}
      <div className="ks-grid mt-12 gap-y-8">
        <div className="col-span-4 md:col-span-7">
          <h3 className="ks-h3">{BOOTH.specTitle}</h3>
          <table className="ks-table mt-4" data-testid="spec-table">
            <tbody>
              {BOOTH.specs.map(([k, v]) => (
                <tr key={k}>
                  <th scope="row" className="w-28">
                    {k}
                  </th>
                  <td className="text-16">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-span-4 md:col-span-4 md:col-start-9">
          <h3 className="text-16 font-bold">All parts</h3>
          <ul className="mt-2 border-t-[3px] border-black text-14">
            {PARTS.map((p) => (
              <li key={p.id} className="border-b border-black py-2">
                <span className="font-bold">{p.name}</span>: {p.purpose}
              </li>
            ))}
          </ul>
          <a href={`${base}play/`} className="ks-link mt-6 inline-block text-16 font-bold">
            Play the game the booth will run
          </a>
        </div>
      </div>
    </Section>
  );
}
