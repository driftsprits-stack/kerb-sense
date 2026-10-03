import { useEffect, useRef, useState } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import Section from '../components/Section';
import Stepper from '../components/Stepper';
import { StepIcon } from '../components/Drawings';
import { CROSS, JA } from '../content';
import { SLOT } from '../copy';
import { STEP_ICONS } from '../lib/artwork';
import poster from '../assets/clip/gameplay-poster.webp';
import webm from '../assets/clip/gameplay.webm';
import mp4 from '../assets/clip/gameplay.mp4';

const base = import.meta.env.BASE_URL;
const playUrl = `${base}play/`;

// The gameplay glimpse: a real clip, muted and looping, as the thumbnail
// of a big PLAY. Activating it opens /play/. There is no iframe here.
function Clip() {
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
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          video.play().catch(() => undefined);
          io.disconnect();
        }
      },
      { rootMargin: '200px 0px' },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [reduced, failed]);

  return (
    <a
      href={playUrl}
      className="group relative block border-[3px] border-black bg-black"
      data-testid="clip-link"
      aria-label={CROSS.clipAria}
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
          preload="none"
          poster={poster}
          aria-hidden="true"
          tabIndex={-1}
          onError={() => setFailed(true)}
        >
          <source src={webm} type="video/webm" />
          <source src={mp4} type="video/mp4" />
        </video>
      )}
      <span className="ks-block absolute left-3 top-3 bg-green px-4 py-3 text-28 text-white group-hover:bg-white group-hover:text-black md:text-40">
        {CROSS.play}
      </span>
    </a>
  );
}

export default function Cross() {
  return (
    <Section id="cross" slot={SLOT.cross} body={CROSS.body}>
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-6">
          <p
            className="inline-block bg-green px-2 py-1 text-14 font-bold text-white"
            lang="ja"
            aria-label={`${JA.howToCross.text} (${JA.howToCross.meaning})`}
          >
            {JA.howToCross.text}
          </p>
          <div className="mt-2">
            <Stepper
              steps={CROSS.steps}
              icon={(id, i) =>
                STEP_ICONS ? (
                  <img
                    src={STEP_ICONS[i] ?? ''}
                    alt=""
                    width={200}
                    height={200}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full"
                  />
                ) : (
                  <StepIcon id={id} />
                )
              }
              next={CROSS.next}
              back={CROSS.back}
              stepLabel={CROSS.stepLabel}
              listLabel={JA.howToCross.meaning}
            />
          </div>
        </div>
        <div className="md:col-span-6">
          <ErrorBoundary
            name="clip"
            fallback={
              <a href={playUrl} className="ks-button ks-button--green">
                {CROSS.play}
              </a>
            }
          >
            <Clip />
          </ErrorBoundary>
          <ul className="mt-3 border-t-[3px] border-black" data-testid="rules">
            {CROSS.rules.map((rule) => (
              <li key={rule} className="border-b border-black py-2 text-16 md:text-20">
                {rule}
              </li>
            ))}
          </ul>
          <a
            href={playUrl}
            className="ks-button ks-button--green mt-4 w-full md:w-auto md:min-w-[200px]"
            data-testid="cross-play"
          >
            {CROSS.play}
          </a>
        </div>
      </div>
    </Section>
  );
}
