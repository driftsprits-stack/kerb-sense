import { BOOTH } from '../content';
import { PARTS } from '../lib/parts';
import { VIEW_LABELS, VIEW_ORDER, type ViewName } from '../lib/views';

// The static renders. Shown when WebGL is missing, motion is reduced, the
// model does not load, or while it loads. An accordion gallery (website
// shortlist pick 6): the current view fills the stage and the other three
// fold into narrow labelled strips: a row above the picture on phones, a
// column on the right elsewhere, so the part label on the stage never covers
// them. A strip is a button that opens its view, like the view buttons above.
// No dimming, tilt or parallax; the panels change at once. The part names and purposes stay in
// a list for screen readers.
const renders = import.meta.glob<string>('../assets/v2/renders/booth-light-*.svg', {
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
  return renders[`../assets/v2/renders/booth-light-${view}.svg`] ?? '';
}

export default function BoothFallback({
  view,
  message,
  selected,
  onChoose,
}: {
  view: ViewName;
  message: string;
  selected?: string | null;
  onChoose?: ((view: ViewName) => void) | undefined;
}) {
  return (
    <figure
      className="grid h-full w-full grid-cols-3 grid-rows-[auto_minmax(0,1fr)] gap-[3px] bg-black sm:flex sm:gap-0 sm:bg-paper"
      data-testid="booth-fallback"
    >
      {VIEW_ORDER.map((v) =>
        v === view ? (
          <div
            key={v}
            className="relative col-span-3 row-start-2 flex min-h-0 min-w-0 flex-1 items-center justify-center bg-paper p-2"
          >
            <img
              src={renderUrl(v)}
              alt={ALT[v]}
              width={1177}
              height={1200}
              className="h-full max-h-full w-auto max-w-full object-contain"
              loading="lazy"
              decoding="async"
            />
            <figcaption className="absolute left-4 top-4 bg-black px-2 py-1 text-14 font-bold text-white">
              {message}
            </figcaption>
          </div>
        ) : (
          <button
            key={v}
            type="button"
            className="ks-block row-start-1 flex h-7 shrink-0 items-center justify-center bg-white text-14 hover:bg-black hover:text-white sm:order-last sm:h-auto sm:w-7 sm:border-l-[3px] sm:border-black sm:[writing-mode:vertical-rl]"
            onClick={() => onChoose?.(v)}
            aria-label={`Show the ${v} view`}
            data-testid={`fallback-${v}`}
          >
            {VIEW_LABELS[v]}
          </button>
        ),
      )}
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
