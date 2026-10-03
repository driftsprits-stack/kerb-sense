import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/tokens.css';
import Logo from '../components/Logo';
import oddgrid from '../assets/art/oddgrid-booth.svg';
import wordmark from '../assets/logo/kerbsense-wordmark-black.svg';

const base = import.meta.env.BASE_URL;

// The 404 page: the booth as a coarse pixel grid (website shortlist pick 21,
// Oddgrid), as if the page did not load. The text sits on plain paper beside
// it, never on top of it.
function NotFound() {
  return (
    <main className="field-paper flex min-h-screen flex-col">
      <header className="ks-container flex h-8 items-center">
        <a href={base} aria-label="Kerb Sense, go to the home page">
          <img
            src={wordmark}
            alt="Kerb Sense"
            width={125}
            height={22}
            style={{ height: 22, width: 'auto' }}
          />
        </a>
      </header>
      <div className="ks-container grid flex-1 items-center gap-8 py-10 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="ks-label">404</p>
          <h1 className="ks-display mt-4 text-64 md:text-96">Wrong crossing.</h1>
          <p className="mt-6 max-w-[40ch] text-20 md:text-28">
            This page does not exist. Go back to the pavement.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a href={base} className="ks-button ks-button--black">
              Go to the home page
            </a>
            <a href={`${base}play/`} className="ks-button ks-button--green">
              Play the game
            </a>
          </div>
        </div>
        <img
          src={oddgrid}
          alt=""
          width={780}
          height={810}
          decoding="async"
          className="w-full max-w-[520px] justify-self-center md:col-span-6"
        />
      </div>
      <p className="sr-only">
        <Logo variant="black" height={22} />
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
