import Picture from '../components/Picture';
import { BOOTH } from '../content';
import type { ViewName } from '../lib/views';

// The static renders. Shown when WebGL is missing, motion is reduced, or
// the model does not load. The view buttons still work: they swap renders.
const ALT: Record<ViewName, string> = {
  front:
    'The booth from the front: a black marquee, a light-blue screen, four coloured buttons and a joystick on a white cabinet.',
  side: 'The booth from the side: the white cabinet profile with the joystick on the control deck.',
  back: 'The booth from the back: the white rear panel with ventilation slots, two hinges and two latches.',
  top: 'The booth from above: the control deck with the four coloured buttons and the joystick.',
};

export default function BoothFallback({ view, message }: { view: ViewName; message: string }) {
  return (
    <figure className="relative h-full w-full bg-white" data-testid="booth-fallback">
      <Picture
        folder="renders"
        name={`booth-flat-${view}`}
        alt={ALT[view]}
        sizes="(min-width: 768px) 60vw, 100vw"
        className="mx-auto h-full w-auto max-h-full object-contain"
        width={1600}
        height={1600}
      />
      <figcaption className="absolute left-4 top-4 bg-black px-2 py-1 text-14 font-bold text-white">
        {message}
      </figcaption>
      <span className="sr-only">{BOOTH.specs.map(([k, v]) => `${k}: ${v}.`).join(' ')}</span>
    </figure>
  );
}
