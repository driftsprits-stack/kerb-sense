import * as Dialog from '@radix-ui/react-dialog';
import * as Toggle from '@radix-ui/react-toggle';
import Logo from './Logo';
import { SECTIONS, type SectionId } from '../content';

interface NavProps {
  gridOn: boolean;
  onGridChange: (on: boolean) => void;
  current: SectionId | null;
}

const base = import.meta.env.BASE_URL;

function GridToggle({
  gridOn,
  onGridChange,
  className = '',
}: Omit<NavProps, 'current'> & { className?: string }) {
  return (
    <Toggle.Root
      pressed={gridOn}
      onPressedChange={onGridChange}
      aria-label="Show the grid"
      data-testid="grid-toggle"
      className={`border-[3px] border-current px-3 py-1 text-14 font-bold hover:bg-black hover:text-white data-[state=on]:bg-black data-[state=on]:text-white ${className}`}
    >
      {gridOn ? 'Hide the grid' : 'Show the grid'}
    </Toggle.Root>
  );
}

// The header: the logo, the current section name, "Play" and the menu.
// The section list lives in the sticky index on wide screens and in the
// menu everywhere, so the header never overflows at any width.
export default function Nav({ gridOn, onGridChange, current }: NavProps) {
  const currentName = SECTIONS.find((s) => s.id === current)?.name;
  return (
    <header className="field-paper sticky top-0 z-50 border-b-[3px] border-black">
      <nav className="ks-container flex h-8 items-center justify-between gap-3" aria-label="Main">
        <a href={`${base}#top`} className="shrink-0" aria-label="Kerb Sense, go to the top of the page">
          <Logo height={22} />
        </a>

        <p
          className="min-w-0 flex-1 truncate text-14 font-bold xl:hidden"
          aria-live="polite"
          data-testid="current-section"
        >
          {currentName ?? ''}
        </p>

        <div className="flex shrink-0 items-center gap-3">
          <GridToggle gridOn={gridOn} onGridChange={onGridChange} className="hidden md:inline-flex" />
          <a href={`${base}play/`} className="bg-green px-4 py-1 text-14 font-bold text-white hover:bg-black">
            Play
          </a>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button
                type="button"
                className="border-[3px] border-black px-3 py-1 text-14 font-bold hover:bg-black hover:text-white"
                aria-label="Open the menu"
                data-testid="menu-open"
              >
                Menu
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-[60] bg-black" />
              <Dialog.Content
                className="field-black fixed inset-0 z-[70] flex flex-col overflow-y-auto p-6"
                aria-describedby={undefined}
                data-testid="menu"
              >
                <div className="flex items-center justify-between">
                  <Dialog.Title asChild>
                    <span>
                      <Logo variant="white" height={22} />
                    </span>
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="border-[3px] border-white px-3 py-1 text-14 font-bold hover:bg-white hover:text-black"
                      aria-label="Close the menu"
                      data-testid="menu-close"
                    >
                      Close
                    </button>
                  </Dialog.Close>
                </div>
                <ol className="mt-10 flex flex-col">
                  {SECTIONS.map((s) => (
                    <li key={s.id} className="border-b border-white">
                      <Dialog.Close asChild>
                        <a
                          href={`#${s.id}`}
                          className="flex items-baseline gap-4 py-3 text-28 font-bold hover:text-green"
                        >
                          <span className="w-8 text-16">{s.number}</span>
                          {s.name}
                        </a>
                      </Dialog.Close>
                    </li>
                  ))}
                </ol>
                <div className="mt-auto flex flex-col gap-3 pt-8">
                  <GridToggle gridOn={gridOn} onGridChange={onGridChange} className="self-start" />
                  <a href={`${base}play/`} className="ks-button ks-button--green">
                    Play the game
                  </a>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </nav>
    </header>
  );
}

/** Sticky "Play" for phones. It sits above the safe area and under no content. */
export function StickyPlay() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      data-testid="sticky-play"
    >
      <a
        href={`${base}play/`}
        className="flex h-7 items-center justify-between border-t-[3px] border-black bg-green px-3 text-20 font-bold text-white hover:bg-black"
      >
        <span>Play the game</span>
        <span className="ks-block text-16" aria-hidden="true">
          PLAY
        </span>
      </a>
    </div>
  );
}
