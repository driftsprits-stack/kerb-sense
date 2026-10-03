import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';

gsap.registerPlugin(GSAPSplitText);

// Ported from React Bits SplitText. Changes: no opacity, no ScrollTrigger,
// no boxes behind lines. Lines slide up from behind a hard mask once at
// page load. Under prefers-reduced-motion the text is simply shown.
interface SplitTextProps {
  text: string;
  tag?: 'h1' | 'h2' | 'p';
  className?: string;
  id?: string;
}

export default function SplitText({ text, tag = 'h1', className = '', id }: SplitTextProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  // The tag is one of a few text elements; the h1 type covers their refs.
  const Tag = tag as 'h1';

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const split = new GSAPSplitText(el, { type: 'lines', linesClass: 'ks-mask-line' });
    for (const line of split.lines) {
      const wrapper = document.createElement('span');
      wrapper.className = 'ks-mask block';
      line.parentNode?.insertBefore(wrapper, line);
      wrapper.appendChild(line);
      (line as HTMLElement).style.display = 'block';
    }
    const tween = gsap.fromTo(
      split.lines,
      { yPercent: 110 },
      { yPercent: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08, force3D: true },
    );
    return () => {
      tween.kill();
      split.revert();
    };
  }, [text]);

  return (
    <Tag ref={ref} id={id} className={className}>
      {text}
    </Tag>
  );
}
