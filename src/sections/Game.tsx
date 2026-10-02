import * as Tabs from '@radix-ui/react-tabs';
import { useCallback, useEffect, useRef, useState } from 'react';
import SectionTab from '../components/SectionTab';
import LabelBlock from '../components/LabelBlock';
import { GAME } from '../content';

const base = import.meta.env.BASE_URL;
const playUrl = `${base}play/`;

type EmbedState = 'idle' | 'loading' | 'ready' | 'failed';

// The embed loads only when asked. Esc inside the game pauses it and never
// reaches this page, so full screen uses the browser's Fullscreen API,
// where the browser's own Esc always exits.
function Embed() {
  const [state, setState] = useState<EmbedState>('idle');
  const [canFullscreen] = useState(
    () => typeof document !== 'undefined' && 'requestFullscreen' in document.documentElement,
  );
  const frameRef = useRef<HTMLIFrameElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);

  const load = useCallback(() => {
    if (state !== 'idle') return;
    setState('loading');
    timer.current = window.setTimeout(() => setState((s) => (s === 'loading' ? 'failed' : s)), 15000);
  }, [state]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onLoad = () => {
    window.clearTimeout(timer.current);
    setState('ready');
    frameRef.current?.focus();
  };

  const fullscreen = () => {
    const box = boxRef.current;
    if (!box) return;
    box
      .requestFullscreen()
      .then(() => frameRef.current?.focus())
      .catch(() => window.open(playUrl, '_self'));
  };

  return (
    <div>
      <div
        ref={boxRef}
        className="relative aspect-video w-full border-[3px] border-black bg-black"
        data-testid="embed"
      >
        {state === 'idle' && (
          <button
            type="button"
            onClick={load}
            className="flex h-full w-full flex-col items-start justify-end p-6 text-left hover:bg-green"
            data-testid="embed-load"
          >
            <span className="ks-display text-96 text-white">Play.</span>
            <span className="mt-4 inline-block bg-white px-2 py-1 text-14 font-bold text-black">
              {GAME.embedLoad}
            </span>
          </button>
        )}
        {state === 'failed' && (
          <div className="flex h-full flex-col items-start justify-end p-6" role="alert">
            <p className="bg-white px-2 py-1 text-16 font-bold text-black">{GAME.embedError}</p>
            <a href={playUrl} className="ks-button ks-button--white mt-4">
              {GAME.embedNewPage}
            </a>
          </div>
        )}
        {(state === 'loading' || state === 'ready') && (
          <>
            {state === 'loading' && (
              <p
                className="absolute left-6 top-6 bg-white px-2 py-1 text-14 font-bold text-black"
                aria-live="polite"
              >
                {GAME.embedLoading}
              </p>
            )}
            <iframe
              ref={frameRef}
              src={playUrl}
              title={GAME.iframeTitle}
              className="h-full w-full"
              allow="fullscreen"
              onLoad={onLoad}
              onError={() => setState('failed')}
              data-testid="game-frame"
            />
          </>
        )}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {canFullscreen && state === 'ready' && (
          <button
            type="button"
            onClick={fullscreen}
            className="ks-button ks-button--black"
            data-testid="embed-fullscreen"
          >
            {GAME.embedFull}
          </button>
        )}
        <a href={playUrl} className="ks-button ks-button--white" data-testid="embed-new-page">
          {GAME.embedNewPage}
        </a>
        <p className="text-14">{GAME.embedHint}</p>
      </div>
    </div>
  );
}

export default function Game() {
  return (
    <section id="game" className="field-paper border-t-[3px] border-black" aria-labelledby="game-title">
      <div className="ks-container py-12 md:py-20">
        <SectionTab number={3} title={GAME.headline} field="green" point="left" id="game-title" />
        <div className="ks-grid mt-10 gap-y-10">
          <div className="col-span-4 md:col-span-5">
            <p className="text-20 md:text-28">{GAME.lead}</p>
            <div className="mt-8 border-t-[3px] border-black pt-4">
              <p className="ks-h3">&ldquo;{GAME.pledge}&rdquo;</p>
              <p className="mt-3 inline-block bg-green px-3 py-2 text-20 font-bold text-white">
                {GAME.pledgeButton}
              </p>
              <p className="mt-2 text-14">{GAME.pledgeNote}</p>
            </div>
          </div>

          <div className="col-span-4 md:col-span-6 md:col-start-7">
            <h3 className="sr-only">The rules.</h3>
            <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2" aria-label="The rules of the game">
              {GAME.rules.map((rule, i) => (
                <li key={rule.title} className="border-t-[3px] border-black pt-3">
                  <LabelBlock>{String(i + 1).padStart(2, '0')}</LabelBlock>
                  <p className="mt-2 text-16 font-bold">{rule.title}</p>
                  <p className="mt-1 text-14">{rule.body}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="col-span-4 md:col-span-12">
            <h3 className="ks-h3">{GAME.profilesTitle}</h3>
            <Tabs.Root defaultValue={GAME.profiles[0].id} className="mt-4 border-t-[3px] border-black">
              <Tabs.List className="flex flex-wrap" aria-label="Profiles">
                {GAME.profiles.map((p) => (
                  <Tabs.Trigger
                    key={p.id}
                    value={p.id}
                    className="border-b-[3px] border-transparent px-4 py-3 text-16 font-bold hover:bg-black hover:text-white data-[state=active]:bg-black data-[state=active]:text-white"
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
          </div>

          <div className="col-span-4 md:col-span-12">
            <h3 className="ks-h3">{GAME.embedTitle}</h3>
            <div className="mt-4 hidden sm:block">
              <Embed />
            </div>
            <div className="mt-4 sm:hidden">
              <p className="text-14">{GAME.embedPhone}</p>
              <a href={playUrl} className="ks-button ks-button--black mt-3">
                Play the game.
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
