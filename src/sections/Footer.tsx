import Logo from '../components/Logo';
import { FOOTER, SITE } from '../content';

const base = import.meta.env.BASE_URL;

export default function Footer() {
  return (
    <footer className="field-black border-t-[3px] border-black" aria-label="Footer">
      <div className="ks-container py-12 md:py-16">
        <div className="ks-grid gap-y-10">
          <div className="col-span-4 md:col-span-5">
            <p className="ks-display text-40">Delta Challenge 2026, Track B</p>
            <p className="mt-4 max-w-[48ch] text-16">{FOOTER.context}</p>
            <p className="mt-4 text-16 font-bold">{SITE.team}</p>
            <p className="mt-6 inline-block bg-white px-2 py-1 text-14 font-bold text-black">
              {SITE.safeLine}
            </p>
          </div>
          <div className="col-span-4 md:col-span-6 md:col-start-7">
            <h2 className="text-16 font-bold">{FOOTER.referencesTitle}</h2>
            <ol className="mt-2 border-t-[3px] border-white text-14" aria-label="References">
              {FOOTER.references.map((ref, i) => (
                <li key={ref} className="border-b border-white py-2">
                  <span className="mr-2 font-bold">{i + 1}</span>
                  {ref}
                  {i === 2 && (
                    <>
                      {' '}
                      <a href={FOOTER.referenceLinks.spf} className="ks-link font-bold" rel="noopener">
                        PDF
                      </a>
                    </>
                  )}
                  {i === 4 && (
                    <>
                      {' '}
                      <a href={FOOTER.referenceLinks.riaz} className="ks-link font-bold" rel="noopener">
                        DOI
                      </a>
                    </>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-6 border-t-[3px] border-white pt-6 md:flex-row md:items-center md:justify-between">
          <a href={`${base}#top`} aria-label="Kerb Sense, go to the top of the page">
            <Logo variant="white" height={28} lazy />
          </a>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-14 font-bold">
            {FOOTER.links.map((l) => (
              <li key={l.href}>
                <a href={`${base}${l.href}`} className="ks-link">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href={SITE.repo} className="ks-link" rel="noopener">
                {FOOTER.source}
              </a>
            </li>
            <li>
              <a href="#top" className="ks-link" data-testid="back-to-top">
                {FOOTER.backToTop}
              </a>
            </li>
          </ul>
          <p className="text-14">{FOOTER.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
