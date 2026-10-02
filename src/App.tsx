import { useCallback, useEffect, useState } from 'react';
import GridOverlay from './components/GridOverlay';
import Nav, { StickyPlay } from './components/Nav';
import Marquee from './components/Marquee';
import Hero from './sections/Hero';
import Clip from './sections/Clip';
import Problem from './sections/Problem';
import Game from './sections/Game';
import Booth from './sections/Booth';
import Programme from './sections/Programme';
import Targets from './sections/Targets';
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

export default function App() {
  const [gridOn, setGridOn] = useState(() => readGridPreference(storage()));

  const setGrid = useCallback((on: boolean) => {
    setGridOn(on);
    writeGridPreference(storage(), on);
  }, []);

  // The G key toggles the grid.
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
        Skip to the content.
      </a>
      <Nav gridOn={gridOn} onGridChange={setGrid} />
      <main id="main" className="pb-14 lg:pb-0">
        <Hero />
        <Clip />
        <Problem />
        <Game />
        <Marquee />
        <Booth />
        <Programme />
        <Targets />
        <Safety />
        <Team />
        <Budget />
      </main>
      <Footer />
      <StickyPlay />
      <GridOverlay visible={gridOn} />
    </>
  );
}
