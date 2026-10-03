import { BOOTH } from '../content';
import { PARTS } from '../lib/parts';
import type { ViewName } from '../lib/views';

// The static renders. Shown when WebGL is missing, motion is reduced, or
// the model does not load. The view buttons still work: they swap renders.
// The part names and purposes stay readable in the list below the render.
const renders = import.meta.glob<string>('../assets/renders/booth-light-*.svg', {
  eager: true,
  import: 'default',
  query: '?url',
});

const ALT: Record<ViewName, string> = {
  front:
    'The booth design from the front: a black marquee, a black screen, four green buttons and a joystick on a white cabinet',
  side: 'The booth design from the side: the white cabinet profile with the joystick on the control deck',
  back: 'The booth design from the back: the white rear panel with ventilation slots, two hinges and two latches',
  top: 'The booth design from above: the control deck with the four green buttons and the joystick',
};

export function renderUrl(view: ViewName): string {
  return renders[`../assets/renders/booth-light-${view}.svg`] ?? '';
}

export default function BoothFallback({
  view,
  message,
  selected,
}: {
  view: ViewName;
  message: string;
  selected?: string | null;
}) {
  return (
    <figure className="relative flex h-full w-full flex-col bg-white" data-testid="booth-fallback">
      <img
        src={renderUrl(view)}
        alt={ALT[view]}
        width={1107}
        height={1200}
        className="mx-auto h-auto max-h-full w-auto flex-1 object-contain"
        loading="lazy"
        decoding="async"
      />
      <figcaption className="absolute left-4 top-4 bg-black px-2 py-1 text-14 font-bold text-white">
        {message}
      </figcaption>
      <ul className="sr-only" aria-label="The parts of the booth">
        {PARTS.map((p) => (
          <li key={p.id}>
            {p.name}: {p.purpose}
            {selected === p.id ? ' (selected)' : ''}
          </li>
        ))}
      </ul>
      <span className="sr-only">{BOOTH.specs.map(([k, v]) => `${k}: ${v}`).join('. ')}</span>
    </figure>
  );
}
