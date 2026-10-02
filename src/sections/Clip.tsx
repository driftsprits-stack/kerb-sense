import { useEffect, useRef, useState } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import LabelBlock from '../components/LabelBlock';
import { HERO } from '../content';
import poster from '../assets/clip/gameplay-poster.webp';
import webm from '../assets/clip/gameplay.webm';
import mp4 from '../assets/clip/gameplay.mp4';

const base = import.meta.env.BASE_URL;

// The gameplay glimpse: a real clip of the game, muted and looping, shown as
// a big Ahoy-style thumbnail. Activating it goes to /play/.
function ClipInner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduced || failed) return;
    // The browser decides whether a muted autoplay is allowed. A refusal
    // leaves the poster, which is a real frame of the game.
    video.play().catch(() => undefined);
  }, [reduced, failed]);

  return (
    <a
      href={`${base}play/`}
      className="group relative block border-[3px] border-black bg-black"
      data-testid="clip-link"
      aria-label="Play the game. A real gameplay clip of Kerb Sense."
    >
      {reduced || failed ? (
        <img
          src={poster}
          alt=""
          width={960}
          height={540}
          className="w-full"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <video
          ref={videoRef}
          className="w-full"
          width={960}
          height={540}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          poster={poster}
          aria-hidden="true"
          tabIndex={-1}
          onError={() => setFailed(true)}
        >
          <source src={webm} type="video/webm" />
          <source src={mp4} type="video/mp4" />
        </video>
      )}
      <span className="absolute left-4 top-4 md:left-6 md:top-6">
        <LabelBlock colour="black" size="large" className="group-hover:bg-red">
          {HERO.clipLabel}
        </LabelBlock>
      </span>
      <span className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6">
        <span className="inline-block bg-white px-2 py-1 text-14 font-bold text-black">
          {HERO.clipCaption}
        </span>
      </span>
    </a>
  );
}

export default function Clip() {
  return (
    <section className="field-paper" aria-label="Gameplay">
      <div className="ks-container py-8 md:py-12">
        <div className="ks-grid">
          <div className="col-span-4 md:col-span-10 md:col-start-2">
            <ErrorBoundary
              name="clip"
              fallback={
                <a href={`${base}play/`} className="ks-button ks-button--black">
                  {HERO.play}
                </a>
              }
            >
              <ClipInner />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </section>
  );
}
