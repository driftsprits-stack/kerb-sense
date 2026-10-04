// Smooth scrolling with Lenis (website shortlist pick 30), as an opt-in
// experiment only: the standards require native scroll speed, so it runs
// only with ?smooth=1 in the address, and never under reduced motion. The
// owner can compare the two before deciding. Normal visits do not download
// Lenis at all (dynamic import).
//
// One animation loop: GSAP's ticker drives Lenis, and Lenis tells
// ScrollTrigger about every scroll, so the booth tour stays in step. Hash
// links still work (anchors), and the menu dialog and anything marked
// data-lenis-prevent keep their own scrolling.
export function wantsSmoothScroll(search: string, reducedMotion: boolean): boolean {
  return new URLSearchParams(search).get('smooth') === '1' && !reducedMotion;
}

export async function startSmoothScroll(): Promise<void> {
  if (!wantsSmoothScroll(location.search, matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
  const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
    import('lenis'),
    import('gsap'),
    import('gsap/ScrollTrigger'),
  ]);
  gsap.registerPlugin(ScrollTrigger);
  const lenis = new Lenis({
    autoRaf: false,
    anchors: { offset: -64 },
    prevent: (node) => node.closest('[data-lenis-prevent], [role="dialog"]') !== null,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  document.documentElement.dataset.smooth = 'on';
}
