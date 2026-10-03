import Logo from '../components/Logo';
import { FOOTER, SITE } from '../content';

const base = import.meta.env.BASE_URL;

// The footer: the context line, the logo, cell links to the policies, the
// game and the source, TOP, and the copyright line. No underlined text.
export default function Footer() {
  return (
    <footer className="field-black border-t-[3px] border-black" aria-label="Footer">
      <div className="ks-container py-8 md:py-10">
        <p className="text-16">{SITE.context}</p>
        <div className="mt-6 flex flex-col gap-4 border-t-[3px] border-white pt-4 md:flex-row md:items-center md:justify-between">
          <a href={`${base}#top`} aria-label="Kerb Sense, go to the top of the page">
            <Logo variant="white" height={28} lazy />
          </a>
          <ul className="ks-block flex flex-wrap gap-1 text-14">
            {FOOTER.links.map((l) => (
              <li key={l.href}>
                <a href={`${base}${l.href}`} className="ks-cell border border-white px-3 py-2">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href={SITE.repo} className="ks-cell border border-white px-3 py-2" rel="noopener">
                {FOOTER.source}
              </a>
            </li>
            <li>
              <a href="#top" className="ks-cell border border-white px-3 py-2" data-testid="back-to-top">
                {FOOTER.backToTop}
              </a>
            </li>
          </ul>
        </div>
        <p className="mt-4 text-14">{FOOTER.copyright}</p>
      </div>
    </footer>
  );
}
