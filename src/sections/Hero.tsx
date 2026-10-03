import { Suspense, lazy, useCallback, useRef, useState } from 'react';
import SplitText from '../bits/SplitText';
import ErrorBoundary from '../components/ErrorBoundary';
import { useUnfold } from '../components/unfold';
import { HERO, JA, SITE } from '../content';
import { COPY, SLOT, longest } from '../copy';
import { useBoothLoad } from '../booth/useBoothLoad';
import product from '../assets/poster/booth-product.webp';
import ledWave from '../assets/textures/led-wave.svg';
import zebra from '../assets/textures/zebra-perspective.svg';

const base = import.meta.env.BASE_URL;
const BoothViewer = lazy(() => import('../booth/BoothViewer'));

// Poster mode (DESIGN.md section 7): a black field, the LED dot wave and
// the perspective zebra, the huge Kerb Block title behind the booth, the
// booth in the centre, the vertical katakana and the vertical tagline. The
// product render is the poster; the live 3D booth swaps in when it loads.
// At 375x812 and 1440x900 the booth, the one-liner and "Play" fit the first
// screen. On phones the title sits above the booth.
export default function Hero() {
  const stageRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { mode, reduced } = useBoothLoad(stageRef, '0px');
  const [live, setLive] = useState(false);
  const onReady = useCallback(() => setLive(true), []);
  const headline = COPY[SLOT.hero] ?? SITE.tagline;

  // The hero pins for part of a screen. The title slides up behind the
  // booth, the zebra walks sideways and the LED wave drifts. Scrolling back
  // reverses it. The copy stays in place, so it is readable throughout.
  useUnfold(({ gsap, phone }) => {
    const section = sectionRef.current;
    if (!section) return;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: phone ? '+=50%' : '+=80%',
        pin: true,
        scrub: true,
      },
    });
    tl.to('[data-hero="title"]', { yPercent: -30, ease: 'none' }, 0)
      .to('[data-hero="zebra"]', { xPercent: 24, ease: 'none' }, 0)
      .to('[data-hero="led"]', { yPercent: 8, ease: 'none' }, 0)
      .to('[data-hero="booth"]', { yPercent: -8, scale: 1.05, ease: 'none' }, 0);
  });

  return (
    <section
      id="top"
      ref={sectionRef}
      className="field-black relative overflow-clip"
      aria-labelledby="hero-title"
      data-testid="hero"
    >
      {/* Textures: dots and bars only, on black. */}
      <img
        src={ledWave}
        alt=""
        width={2400}
        height={1400}
        aria-hidden="true"
        data-hero="led"
        className="pointer-events-none absolute bottom-0 left-0 w-[160%] max-w-none md:w-full"
        decoding="async"
      />
      <img
        src={zebra}
        alt=""
        width={1300}
        height={1500}
        aria-hidden="true"
        data-hero="zebra"
        className="pointer-events-none absolute bottom-0 left-[52%] w-[36%] max-w-none md:left-[56%] md:w-[22%]"
        decoding="async"
      />

      <div className="ks-container relative flex flex-col pb-5 md:h-[calc(100svh-64px)] md:max-h-[960px] md:min-h-[600px] md:pb-0">
        {/* The title, in Kerb Block, behind the booth. */}
        <p
          className="ks-block ks-hero-title pointer-events-none mt-4 pr-14 text-white md:absolute md:left-[var(--grid-margin)] md:top-6 md:mt-0 md:pr-0"
          data-hero="title"
          aria-hidden="true"
        >
          KERB
          <br />
          SENSE
        </p>

        {/* The booth, in the centre, overlapping the title. */}
        <div
          ref={stageRef}
          data-hero="booth"
          className="relative mx-auto mt-2 aspect-square w-[180px] md:absolute md:left-[60%] md:top-[1%] md:mt-0 md:w-[min(34vw,52vh)] md:max-w-[560px] md:-translate-x-1/2 xl:left-[55%]"
          data-testid="hero-booth"
        >
          <img
            src={product}
            alt={HERO.boothAlt}
            width={1600}
            height={1600}
            fetchPriority="high"
            decoding="async"
            className={live ? 'invisible' : ''}
          />
          {mode === 'ready' && !reduced && (
            <div className="absolute inset-0" aria-hidden={!live}>
              <ErrorBoundary name="hero booth" fallback={<span className="sr-only">{SITE.name}</span>}>
                <Suspense fallback={null}>
                  <BoothViewer
                    exploded={false}
                    view="front"
                    onViewReached={() => undefined}
                    selected={null}
                    onSelect={() => undefined}
                    onHover={() => undefined}
                    reduced={false}
                    interactive
                    canvasLabel={HERO.boothAlt}
                    onReady={onReady}
                  />
                </Suspense>
              </ErrorBoundary>
            </div>
          )}
        </div>

        {/* The katakana column and the vertical tagline, at the right edge. */}
        <div className="pointer-events-none absolute right-[var(--grid-margin)] top-4 flex flex-col items-end gap-4 md:top-6 md:gap-8">
          <p
            className="ks-block ks-vertical text-green"
            lang="ja"
            aria-label={`${JA.name.text} (${JA.name.meaning})`}
            style={{ fontSize: 'clamp(24px, 4vw, 64px)', textOrientation: 'mixed' }}
          >
            {JA.name.text}
          </p>
          <p
            className="ks-vertical text-16 font-bold text-white md:text-28"
            lang="ja"
            aria-label={`${JA.tagline.text} (${JA.tagline.meaning})`}
          >
            {JA.tagline.text}
          </p>
        </div>

        {/* The visible text on one solid black panel: the headline from the
            pool, the one-liner, the actions. */}
        <div
          className="relative mt-3 bg-black md:absolute md:bottom-3 md:left-[calc(var(--grid-margin)-8px)] md:mt-0 md:w-[44%] md:max-w-[560px] md:p-1 xl:left-[calc(var(--grid-margin)-16px)] xl:w-[36%] xl:p-2"
          data-hero="copy"
        >
          <p className="max-w-[60ch] text-12 font-bold text-white md:text-14">{HERO.kicker}</p>
          <div className="relative mt-2 grid">
            <span
              className="ks-display invisible col-start-1 row-start-1 text-28 md:text-40 xl:text-48"
              aria-hidden="true"
            >
              {longest(SLOT.hero)}
            </span>
            <SplitText
              id="hero-title"
              text={headline}
              tag="h1"
              className="ks-display col-start-1 row-start-1 text-28 text-white md:text-40 xl:text-48"
            />
          </div>
          <p className="mt-2 max-w-[48ch] text-14 text-white md:mt-3 md:text-18">{HERO.body}</p>
          <p className="mt-1 text-12 font-bold text-white md:text-14">{HERO.who}</p>
          <div className="mt-3 flex flex-wrap gap-3 md:mt-4">
            <a
              href={`${base}play/`}
              className="ks-button ks-button--green md:px-2 md:py-1 xl:px-3 xl:py-2"
              data-testid="hero-play"
            >
              {HERO.play}
              <span className="ks-block text-14" aria-hidden="true">
                PLAY
              </span>
              <span lang="ja" className="text-14" aria-label={`${JA.play.text} (${JA.play.meaning})`}>
                {JA.play.text}
              </span>
            </a>
            <a
              href="#booth"
              className="ks-button ks-button--outline-white md:px-2 md:py-1 xl:px-3 xl:py-2"
              data-testid="hero-booth-link"
            >
              {HERO.booth}
            </a>
          </div>
          <p className="mt-3 inline-block bg-white px-2 py-1 text-12 font-bold text-black md:text-14">
            {SITE.safeLine}
          </p>
        </div>
      </div>
    </section>
  );
}
