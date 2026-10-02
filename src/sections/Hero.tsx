import SplitText from '../bits/SplitText';
import { Roundel } from '../components/Logo';
import { silhouetteUrl } from '../components/renders';
import { HERO, SITE } from '../content';

const base = import.meta.env.BASE_URL;

// The Ahoy thumbnail, rebuilt in HTML and SVG. A green field, white zebra
// bars on the grid columns, the booth side silhouette cropped by the frame,
// and the wordmark knocked out in green on the black.
export default function Hero() {
  const silhouette = silhouetteUrl('booth-silhouette-side');
  return (
    <section id="top" className="field-green relative overflow-clip" aria-labelledby="hero-title">
      {/* Zebra bars, aligned to the grid. Decorative. */}
      <div className="ks-container absolute inset-0" aria-hidden="true">
        <div className="ks-grid h-full">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className={`h-full ${i % 2 === 0 ? 'bg-white' : ''} ${i >= 4 ? 'hidden md:block' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* The booth silhouette. It is cropped on the right and the bottom. */}
      <img
        src={silhouette}
        alt="The black side silhouette of the Kerb Sense arcade booth, cropped by the edge of the frame."
        width={1600}
        height={1600}
        fetchPriority="high"
        decoding="async"
        className="pointer-events-none absolute -right-[20%] -bottom-[18%] w-[95%] max-w-none md:-right-[10%] md:-bottom-[32%] md:w-[70%]"
        style={{ mixBlendMode: 'normal' }}
      />

      {/* The knocked-out wordmark on the black silhouette. */}
      <div
        className="pointer-events-none absolute right-[4%] bottom-[5%] hidden items-center gap-2 text-green lg:flex"
        aria-hidden="true"
        style={{
          fontSize: 'clamp(32px, 4vw, 56px)',
          fontWeight: 700,
          letterSpacing: '-0.04em',
          lineHeight: 1,
        }}
      >
        <span>kerb sense</span>
        <Roundel colour="var(--ks-green)" size={44} />
      </div>

      <div className="ks-container relative py-16 md:py-24">
        <div className="ks-grid">
          <div className="col-span-4 md:col-span-7">
            <p className="ks-label mb-6">{HERO.kicker}</p>
            {/* The title is knocked out in the field colour on black, as in the Ahoy plate. */}
            <SplitText
              id="hero-title"
              text={HERO.headline}
              tag="h1"
              className="ks-display text-96 text-green md:text-160"
              lineClassName="bg-black px-[0.08em] pb-[0.06em]"
            />
            <p className="mt-8 max-w-[34ch] bg-black px-3 py-2 text-20 font-bold text-white md:text-28">
              {HERO.body}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a href={`${base}play/`} className="ks-button ks-button--black" data-testid="hero-play">
                {HERO.play}
              </a>
              <a href="#booth" className="ks-button ks-button--white" data-testid="hero-booth">
                {HERO.booth}
              </a>
            </div>
            <p className="mt-8 inline-block bg-white px-2 py-1 text-14 font-bold text-black">
              {SITE.safeLine}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
