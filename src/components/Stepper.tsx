import * as Tabs from '@radix-ui/react-tabs';
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { gsap } from 'gsap';

// The crossing stepper (the React Bits Stepper pattern on Radix Tabs and
// GSAP). Square numbered markers, NEXT and BACK, one step panel with a
// pictogram, and the full list below so every step is readable without
// pressing anything. The panel slides in with a transform only.
export interface Step {
  id: string;
  label: string;
  line: string;
}

interface StepperProps {
  steps: readonly Step[];
  icon: (id: string, index: number) => ReactNode;
  next: string;
  back: string;
  stepLabel: string;
  listLabel: string;
}

export default function Stepper({ steps, icon, next, back, stepLabel, listLabel }: StepperProps) {
  const [index, setIndex] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const direction = useRef(1);
  const step = steps[index] as Step;

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tween = gsap.fromTo(
      panel,
      { xPercent: 12 * direction.current },
      { xPercent: 0, duration: 0.3, ease: 'power2.out', force3D: true },
    );
    return () => {
      tween.kill();
    };
  }, [index]);

  const go = (to: number) => {
    const clamped = Math.max(0, Math.min(steps.length - 1, to));
    direction.current = clamped >= index ? 1 : -1;
    setIndex(clamped);
  };

  return (
    <Tabs.Root
      value={step.id}
      onValueChange={(v) => go(steps.findIndex((s) => s.id === v))}
      className="border-t-[3px] border-black"
      data-testid="stepper"
    >
      <Tabs.List className="flex" aria-label={stepLabel}>
        {steps.map((s, i) => (
          <Tabs.Trigger
            key={s.id}
            value={s.id}
            className="ks-block flex h-6 flex-1 items-center justify-center border-r border-black text-14 last:border-r-0 hover:bg-black hover:text-white data-[state=active]:bg-green data-[state=active]:text-white"
            aria-label={`${stepLabel} ${i + 1}, ${s.label}`}
          >
            {i + 1}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      <div className="overflow-clip border-t border-black">
        <div
          ref={panelRef}
          className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-3 py-3 md:grid-cols-[160px_minmax(0,1fr)]"
        >
          <div className="aspect-square w-full border-[3px] border-black bg-white" data-testid="step-icon">
            {icon(step.id, index)}
          </div>
          <div>
            <p className="ks-label">{`${stepLabel} ${index + 1}`}</p>
            <Tabs.Content value={step.id} forceMount className="mt-2" data-testid="step-panel">
              <p className="ks-block text-28 md:text-40">{step.label}</p>
              <p className="mt-1 text-16">{step.line}</p>
            </Tabs.Content>
          </div>
        </div>
      </div>
      <div className="flex gap-2 border-t border-black pt-3">
        <button
          type="button"
          className="ks-button ks-button--outline-black ks-button--small"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          data-testid="step-back"
        >
          {back}
        </button>
        <button
          type="button"
          className="ks-button ks-button--black ks-button--small"
          onClick={() => go(index + 1)}
          disabled={index === steps.length - 1}
          data-testid="step-next"
        >
          {next}
        </button>
      </div>
      <ol
        className="ks-block mt-4 grid grid-cols-2 gap-x-3 border-t border-black pt-3 text-14 md:grid-cols-3"
        aria-label={listLabel}
        data-testid="step-list"
      >
        {steps.map((s, i) => (
          <li key={s.id} className="py-1">
            <span className="mr-2">{i + 1}</span>
            {s.label}
          </li>
        ))}
      </ol>
    </Tabs.Root>
  );
}
