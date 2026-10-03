import { useCallback, useEffect, useState } from 'react';
import GridOverlay from './components/GridOverlay';
import Nav, { StickyPlay } from './components/Nav';
import Marquee from './components/Marquee';
import SectionIndex, { useCurrentSection } from './components/SectionIndex';
import Hero from './sections/Hero';
import Problem from './sections/Problem';
import Answer from './sections/Answer';
import Booth from './sections/Booth';
import Game from './sections/Game';
import Plan from './sections/Plan';
import Measure from './sections/Measure';
import Safety from './sections/Safety';
import Team from './sections/Team';
import Budget from './sections/Budget';
import Footer from './sections/Footer';
import { isGridShortcut, readGridPreference, writeGridPreference } from './lib/grid';

function storage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

// The reading order: hero, the problem, our answer, the booth, the game,
// the plan, how we will measure it, safety, the team, the budget, the
// footer. A sticky index sits in a narrow left column on wide screens.
export default function App() {
  const [gridOn, setGridOn] = useState(() => readGridPreference(storage()));
  const current = useCurrentSection();

  const setGrid = useCallback((on: boolean) => {
    setGridOn(on);
    writeGridPreference(storage(), on);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (isGridShortcut(e.key, tag, e.ctrlKey || e.metaKey || e.altKey)) setGrid(!gridOn);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [gridOn, setGrid]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-black focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to the content
      </a>
      <Nav gridOn={gridOn} onGridChange={setGrid} current={current} />
      <main id="main" className="pb-14 md:pb-0">
        <Hero />
        <div className="xl:grid xl:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="field-paper hidden border-t-[3px] border-black px-6 pt-12 xl:block">
            <SectionIndex current={current} />
          </aside>
          <div className="min-w-0">
            <Problem />
            <Answer />
            <Booth />
            <Game />
            <Marquee />
            <Plan />
            <Measure />
            <Safety />
            <Team />
            <Budget />
          </div>
        </div>
      </main>
      <Footer />
      <StickyPlay />
      <GridOverlay visible={gridOn} />
    </>
  );
}
