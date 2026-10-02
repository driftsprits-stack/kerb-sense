import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/tokens.css';
import Logo from '../components/Logo';
import { silhouetteUrl } from '../components/renders';

const base = import.meta.env.BASE_URL;

// The 404 page. An Ahoy thumbnail on red, with a link home and to the game.
function NotFound() {
  return (
    <main className="field-red relative flex min-h-screen flex-col overflow-clip">
      <img
        src={silhouetteUrl('booth-silhouette-front')}
        alt=""
        width={1600}
        height={1600}
        className="pointer-events-none absolute -bottom-[25%] -right-[15%] w-[80%] max-w-none md:w-[50%]"
      />
      <header className="ks-container relative flex h-16 items-center">
        <a href={base} aria-label="Kerb Sense. Go to the home page.">
          <Logo variant="on-red" height={22} />
        </a>
      </header>
      <div className="ks-container relative flex flex-1 flex-col justify-center py-16">
        <p className="ks-label">404.</p>
        <h1 className="ks-display mt-4 text-96 text-white md:text-160">Wrong crossing.</h1>
        <p className="mt-6 max-w-[40ch] text-20 text-white md:text-28">
          This page does not exist. Go back to the pavement.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a href={base} className="ks-button ks-button--white">
            Go to the home page.
          </a>
          <a href={`${base}play/`} className="ks-button ks-button--outline-white">
            Play the game.
          </a>
        </div>
      </div>
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
