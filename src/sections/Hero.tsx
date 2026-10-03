import SplitText from '../bits/SplitText';
import { HERO, JA, SITE } from '../content';
import { COPY, SLOT, longest } from '../copy';
import { BOOTH_HERO } from '../lib/artwork';
import ledWave from '../assets/textures/led-wave.svg';

const base = import.meta.env.BASE_URL;

// The hero, product first: a black field, the headline in Kerb Block, one
// sentence, PLAY and BOOTH, and the booth drawn from the front left. Text
// sits on solid black only. The LED texture sits behind the booth, where
// there is no text. At 375 by 812 and 1440 by 900 the headline, the booth
// and PLAY fit the first screen.
export default function Hero() {
  const headline = COPY[SLOT.hero] ?? SITE.tagline;
  return (
    <section
      id="top"
      className="field-black relative overflow-clip"
      aria-labelledby="hero-title"
      data-testid="hero"
    >
      <div className="ks-container grid grid-cols-1 gap-4 py-5 md:min-h-[calc(100svh-67px)] md:grid-cols-12 md:items-center md:py-8">
        {/* The words, on solid black. */}
        <div className="relative md:col-span-6 md:pr-8" data-hero="copy">
          <div className="grid">
            <span
              className="ks-display invisible col-start-1 row-start-1 text-28 md:text-48 xl:text-64"
              aria-hidden="true"
            >
              {longest(SLOT.hero)}
            </span>
            <SplitText
              id="hero-title"
              text={headline}
              tag="h1"
              className="ks-display col-start-1 row-start-1 text-28 text-white md:text-48 xl:text-64"
            />
          </div>
          <p className="mt-3 max-w-[36ch] text-16 text-white md:mt-5 md:text-20" data-testid="hero-body">
            {HERO.body}
          </p>
          <div className="mt-4 flex gap-2 md:mt-6">
            <a
              href={`${base}play/`}
              className="ks-button ks-button--green min-w-[128px]"
              data-testid="hero-play"
            >
              {HERO.play}
            </a>
            <a
              href="#booth"
              className="ks-button ks-button--outline-white min-w-[128px]"
              data-testid="hero-booth-link"
            >
              {HERO.booth}
            </a>
          </div>
          <p className="mt-3 text-12 text-white md:text-14">{SITE.safeLine}</p>
          <p
            className="ks-block ks-vertical absolute right-0 top-0 hidden text-green md:block"
            lang="ja"
            aria-label={`${JA.name.text} (${JA.name.meaning})`}
            style={{ fontSize: 'clamp(24px, 2.4vw, 40px)', textOrientation: 'mixed' }}
          >
            {JA.name.text}
          </p>
        </div>

        {/* The booth, over the LED texture. No text here. */}
        <div className="relative md:col-span-6" data-testid="hero-booth">
          <img
            src={ledWave}
            alt=""
            width={2400}
            height={1400}
            aria-hidden="true"
            data-hero="led"
            data-texture
            className="pointer-events-none absolute inset-x-0 bottom-0 h-full w-full object-cover"
            decoding="async"
          />
          <img
            src={BOOTH_HERO}
            alt={HERO.boothAlt}
            width={1200}
            height={1200}
            fetchPriority="high"
            decoding="async"
            className="relative mx-auto h-[200px] w-auto md:h-[min(60vh,560px)]"
          />
        </div>
      </div>
    </section>
  );
}
