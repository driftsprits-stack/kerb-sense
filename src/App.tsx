import { useEffect } from 'react';
import Nav, { StickyPlay } from './components/Nav';
import Rail, { useCurrentSection } from './components/Rail';
import Hero from './sections/Hero';
import Problem from './sections/Problem';
import Booth from './sections/Booth';
import Cross from './sections/Cross';
import Plan from './sections/Plan';
import Safety from './sections/Safety';
import Budget from './sections/Budget';
import Team from './sections/Team';
import Footer from './sections/Footer';

// The reading order: hero, the problem, the booth, how to cross and the
// game, the plan and the targets, safety, the budget, the team, the footer.
// One nav: the numbered rail on wide screens, the full-screen menu below.
export default function App() {
  const current = useCurrentSection();
  // A deep link such as #plan: the browser jumps before React has drawn the
  // sections, so jump again once they exist.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id) document.getElementById(id)?.scrollIntoView();
  }, []);
  return (
    <>
      <a
        href="#main"
        className="ks-block sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-black focus:px-4 focus:py-2 focus:text-white"
      >
        SKIP TO THE CONTENT
      </a>
      <Nav current={current} />
      <Rail current={current} />
      <main id="main" className="pb-7 md:pb-0">
        <Hero />
        <Problem />
        <Booth />
        <Cross />
        <Plan />
        <Safety />
        <Budget />
        <Team />
      </main>
      <Footer />
      <StickyPlay />
    </>
  );
}
