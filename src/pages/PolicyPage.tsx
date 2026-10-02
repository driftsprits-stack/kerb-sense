import type { ReactNode } from 'react';
import Logo from '../components/Logo';
import { FOOTER, SITE } from '../content';

const base = import.meta.env.BASE_URL;

// A simple page for the policies and the 404. Paper ground, black rules,
// a small single-colour nav, as on Cocricot.
interface PolicyPageProps {
  title: string;
  lead: string;
  children: ReactNode;
}

export default function PolicyPage({ title, lead, children }: PolicyPageProps) {
  return (
    <>
      <header className="field-paper border-b-[3px] border-black">
        <nav className="ks-container flex h-16 items-center justify-between" aria-label="Main">
          <a href={`${base}`} aria-label="Kerb Sense. Go to the home page.">
            <Logo height={22} />
          </a>
          <ul className="flex items-center gap-5 text-14 font-bold lowercase" role="list">
            <li>
              <a href={`${base}`} className="ks-link">
                home
              </a>
            </li>
            <li>
              <a href={`${base}play/`} className="bg-black px-3 py-1 text-white hover:bg-red">
                play.
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <main id="main" className="field-paper">
        <div className="ks-container py-12 md:py-20">
          <div className="ks-grid gap-y-10">
            <div className="col-span-4 md:col-span-5">
              <h1 className="ks-display text-64 md:text-96">{title}</h1>
              <p className="mt-6 text-20">{lead}</p>
            </div>
            <div className="col-span-4 md:col-span-6 md:col-start-7">
              <div className="policy border-t-[3px] border-black pt-6 text-16">{children}</div>
            </div>
          </div>
        </div>
      </main>
      <footer className="field-yellow border-t-[3px] border-black">
        <div className="ks-container flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-14 font-bold" role="list">
            {FOOTER.links.map((l) => (
              <li key={l.href}>
                <a href={`${base}${l.href}`} className="ks-link">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-14">{FOOTER.copyright}</p>
          <p className="inline-block bg-black px-2 py-1 text-14 font-bold text-white">{SITE.safeLine}</p>
        </div>
      </footer>
    </>
  );
}

export function PolicyHeading({ children }: { children: ReactNode }) {
  return <h2 className="ks-h3 mt-8 first:mt-0">{children}</h2>;
}

export function PolicyText({ children }: { children: ReactNode }) {
  return <p className="mt-3">{children}</p>;
}

export function PolicyList({ items }: { items: string[] }) {
  return (
    <ul className="list mt-3" role="list">
      {items.map((item) => (
        <li key={item} className="border-b border-black py-2">
          {item}
        </li>
      ))}
    </ul>
  );
}
