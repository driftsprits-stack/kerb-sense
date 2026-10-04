import SplitText from '../bits/SplitText';
import { HERO, JA, SITE } from '../content';
import { COPY, SLOT, longest } from '../copy';
import silhouette from '../assets/v2/renders/booth-silhouette-side.svg';

const base = import.meta.env.BASE_URL;

// The hero, as an Ahoy thumbnail: a green field with white crossing bars
// across the full width, drifting slowly sideways (transform only, still
// under reduced motion), and the booth's black side silhouette, big and
// cropped by the frame, facing the words. The headline, the sentence, the
// buttons and the katakana all sit inside one solid green panel, so no text
// sits on the bars and nothing hangs off the panel's edge.
export default function Hero() {
  const headline = COPY[SLOT.hero] ?? SITE.tagline;
  return (
    <section
      id="top"
      className="field-green relative overflow-clip"
      aria-labelledby="hero-title"
      data-testid="hero"
    >
      <div
        className="ks-zebra pointer-events-none absolute inset-y-0 left-0"
        aria-hidden="true"
        data-hero="stripes"
      />
      <div className="pointer-events-none absolute inset-0" data-testid="hero-booth">
        <img
          src={silhouette}
          alt={HERO.boothAlt}
          width={1040}
          height={1200}
          fetchPriority="high"
          decoding="async"
          className="pointer-events-none absolute -bottom-[40px] -right-[48px] h-[400px] w-auto max-w-none md:-bottom-[10vh] md:-right-[14vw] md:h-[max(78svh,520px)] xl:-right-[4vw] xl:h-[max(88svh,560px)]"
          data-hero="booth"
        />
      </div>
      <div className="ks-container relative grid min-h-[calc(100svh-67px)] grid-cols-1 content-start py-5 md:grid-cols-12 md:content-center md:py-8">
        <div
          className="relative z-10 flex gap-4 bg-green p-4 md:col-span-6 md:p-6 xl:col-span-5"
          data-hero="copy"
        >
          <div className="min-w-0 flex-1">
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
                className="ks-button ks-button--white min-w-[128px]"
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
          </div>
          <p
            className="ks-block ks-vertical hidden shrink-0 text-white md:block"
            lang="ja"
            aria-label={`${JA.name.text} (${JA.name.meaning})`}
            style={{ fontSize: 'clamp(22px, 2vw, 32px)', textOrientation: 'mixed' }}
          >
            {JA.name.text}
          </p>
        </div>
      </div>
    </section>
  );
}
