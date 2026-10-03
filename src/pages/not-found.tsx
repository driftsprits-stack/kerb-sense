import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/tokens.css';
import Logo from '../components/Logo';
import silhouette from '../assets/renders/booth-silhouette-side.svg';
import wordmarkOnGreen from '../assets/logo/kerbsense-wordmark-on-green.svg';

const base = import.meta.env.BASE_URL;

// The 404 page: the Ahoy thumbnail composition (DESIGN.md section 3). The
// green field, white zebra bars across the full width, the black side
// silhouette cropped by the frame, and a link home and to the game.
function NotFound() {
  return (
    <main className="field-green relative flex min-h-screen flex-col overflow-clip">
      <div className="pointer-events-none absolute inset-0 flex" aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-white' : ''}`} />
        ))}
      </div>
      <img
        src={silhouette}
        alt=""
        width={1107}
        height={1200}
        decoding="async"
        className="pointer-events-none absolute -bottom-[10%] -right-[6%] w-[85%] max-w-none md:w-[42%]"
      />
      <header className="ks-container relative flex h-8 items-center">
        <a href={base} aria-label="Kerb Sense, go to the home page">
          <img
            src={wordmarkOnGreen}
            alt="Kerb Sense"
            width={125}
            height={22}
            style={{ height: 22, width: 'auto' }}
          />
        </a>
      </header>
      <div className="ks-container relative flex flex-1 flex-col justify-center py-16">
        {/* One solid green panel behind the text covers the bars (never per-line boxes). */}
        <div className="inline-block max-w-[640px] bg-green p-6 md:p-8">
          <p className="ks-label ks-label--paper">404</p>
          <h1 className="ks-display mt-4 text-64 text-white md:text-96">Wrong crossing.</h1>
          <p className="mt-6 max-w-[40ch] text-20 text-white md:text-28">
            This page does not exist. Go back to the pavement.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a href={base} className="ks-button ks-button--white">
              Go to the home page
            </a>
            <a href={`${base}play/`} className="ks-button ks-button--outline-white">
              Play the game
            </a>
          </div>
        </div>
      </div>
      <p className="sr-only">
        <Logo variant="on-green" height={22} />
      </p>
    </main>
  );
}

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <NotFound />
    </StrictMode>,
  );
}
