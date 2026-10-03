import * as Tabs from '@radix-ui/react-tabs';
import { useEffect, useRef, useState } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import Section from '../components/Section';
import LabelBlock, { StatusLabel } from '../components/LabelBlock';
import { GAME, JA } from '../content';
import { SLOT } from '../copy';
import poster from '../assets/clip/gameplay-poster.webp';
import webm from '../assets/clip/gameplay.webm';
import mp4 from '../assets/clip/gameplay.mp4';

const base = import.meta.env.BASE_URL;
const playUrl = `${base}play/`;

// The gameplay glimpse: a real clip, muted and looping, as a big Ahoy
// thumbnail. Activating it opens /play/. There is no iframe on this page.
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

  // preload="none" keeps the clip off the critical path. It starts when the
  // thumbnail scrolls near the viewport.
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
      aria-label={GAME.clipAria}
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
      <span className="absolute left-4 top-4 flex items-center gap-3 md:left-6 md:top-6">
        <span className="ks-block bg-green px-3 py-2 text-28 text-white group-hover:bg-white group-hover:text-black md:text-40">
          {GAME.clipLabel}
        </span>
        <span
          lang="ja"
          className="bg-black px-2 py-1 text-16 font-bold text-white"
          aria-label={`${JA.play.text} (${JA.play.meaning})`}
        >
          {JA.play.text}
        </span>
      </span>
      <span className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6">
        <span className="inline-block bg-white px-2 py-1 text-14 font-bold text-black">
          {GAME.clipCaption}
        </span>
      </span>
    </a>
  );
}

export default function Game() {
  return (
    <Section
      id="game"
      slot={SLOT.game}
      summary={GAME.summary}
      status={<StatusLabel>{GAME.statusLabel}</StatusLabel>}
    >
      <div className="ks-grid gap-y-10">
        <div className="col-span-4 md:col-span-12">
          <ErrorBoundary
            name="clip"
            fallback={
              <a href={playUrl} className="ks-button ks-button--green">
                {GAME.play}
              </a>
            }
          >
            <Clip />
          </ErrorBoundary>
          <p className="mt-3 text-14">{GAME.controls}</p>
        </div>

        {/* The WIRE-style running order, in Kerb Block, on black. */}
        <div className="col-span-4 field-black p-6 md:col-span-5 md:p-8" data-testid="running-order">
          <p
            className="inline-block bg-green px-2 py-1 text-14 font-bold text-white"
            lang="ja"
            aria-label={`${JA.howToCross.text} (${JA.howToCross.meaning})`}
          >
            {JA.howToCross.text}
          </p>
          <p className="sr-only">{JA.howToCross.meaning}</p>
          <ol className="mt-3 flex flex-col gap-2">
            {GAME.runningOrder.map((step) => (
              <li
                key={step.word}
                className="ks-block whitespace-nowrap text-28 leading-none text-white md:text-40"
              >
                {step.word} <span className="text-green">{step.bracket}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="col-span-4 md:col-span-6 md:col-start-7">
          <h3 className="ks-h3">{GAME.rulesTitle}</h3>
          <ol className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2" aria-label="The rules of the game">
            {GAME.rules.map((rule, i) => (
              <li key={rule.title} className="border-t-[3px] border-black pt-3">
                <LabelBlock>{String(i + 1).padStart(2, '0')}</LabelBlock>
                <p className="mt-2 text-16 font-bold">{rule.title}</p>
                <p className="mt-1 text-14">{rule.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="col-span-4 md:col-span-5">
          <div className="border-t-[3px] border-black pt-4">
            <p className="ks-h3">&ldquo;{GAME.pledge}&rdquo;</p>
            <p className="mt-3 inline-block bg-green px-3 py-2 text-20 font-bold text-white">
              {GAME.pledgeButton}
            </p>
            <p className="mt-2 text-14">{GAME.pledgeNote}</p>
          </div>
        </div>

        <div className="col-span-4 md:col-span-6 md:col-start-7">
          <h3 className="ks-h3">{GAME.profilesTitle}</h3>
          <Tabs.Root defaultValue={GAME.profiles[0].id} className="mt-4 border-t-[3px] border-black">
            <Tabs.List className="flex flex-wrap" aria-label="Profiles">
              {GAME.profiles.map((p) => (
                <Tabs.Trigger
                  key={p.id}
                  value={p.id}
                  className="px-4 py-3 text-16 font-bold hover:bg-black hover:text-white data-[state=active]:bg-black data-[state=active]:text-white"
                >
                  {p.name}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
            {GAME.profiles.map((p) => (
              <Tabs.Content key={p.id} value={p.id} className="border-t border-black p-4">
                <p className="text-20 font-bold">{p.body}</p>
              </Tabs.Content>
            ))}
          </Tabs.Root>
          <a href={playUrl} className="ks-button ks-button--green mt-6">
            {GAME.play}
          </a>
        </div>
      </div>
    </Section>
  );
}
