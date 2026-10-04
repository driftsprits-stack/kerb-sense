import { useEffect, useRef, useState } from 'react';
import { useMotionPaused, useReducedMotion } from '../lib/motion';
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
  const reduced = useReducedMotion();
  const paused = useMotionPaused();

  // Play only while the clip is on screen and motion is allowed; pause when
  // it scrolls away, the tab is hidden, or the visitor pauses motion.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || failed) return;
    if (reduced || paused) {
      video.pause();
      return;
    }
    let visible = false;
    const sync = () => {
      if (visible && !document.hidden) video.play().catch(() => undefined);
      else video.pause();
    };
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries.some((e) => e.isIntersecting);
        sync();
      },
      { threshold: 0.01 },
    );
    io.observe(video);
    document.addEventListener('visibilitychange', sync);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, [reduced, paused, failed]);

  return (
    <a
      href={playUrl}
      className="block border-[3px] border-black bg-black"
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
    </a>
  );
}

export default function Cross() {
  return (
    <Section id="cross" slot={SLOT.cross} body={CROSS.body}>
      <div className="grid gap-6 md:grid-cols-12 md:gap-x-3">
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
              stepLabel={CROSS.stepLabel}
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
          <div className="mt-4">
            <a
              href={playUrl}
              className="ks-button ks-button--green w-full md:w-auto md:min-w-[200px]"
              data-testid="cross-play"
            >
              {CROSS.play}
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
