import * as Dialog from '@radix-ui/react-dialog';
import * as Toggle from '@radix-ui/react-toggle';
import Logo from './Logo';
import { NAV } from '../content';

interface NavProps {
  gridOn: boolean;
  onGridChange: (on: boolean) => void;
}

const base = import.meta.env.BASE_URL;

function GridToggle({ gridOn, onGridChange, className = '' }: NavProps & { className?: string }) {
  return (
    <Toggle.Root
      pressed={gridOn}
      onPressedChange={onGridChange}
      aria-label="Show the grid."
      data-testid="grid-toggle"
      className={`border-[3px] border-current px-3 py-1 text-14 font-bold data-[state=on]:bg-black data-[state=on]:text-white hover:bg-black hover:text-white ${className}`}
    >
      {gridOn ? 'Hide the grid.' : 'Show the grid.'}
    </Toggle.Root>
  );
}

export default function Nav({ gridOn, onGridChange }: NavProps) {
  return (
    <header className="field-paper sticky top-0 z-50 border-b-[3px] border-black">
      <nav className="ks-container flex h-16 items-center justify-between gap-4" aria-label="Main">
        <a href={`${base}#top`} className="shrink-0" aria-label="Kerb Sense. Go to the top of the page.">
          <Logo height={22} />
        </a>

        <ul className="hidden items-center gap-5 lg:flex" role="list">
          {NAV.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className="ks-link text-14 font-bold lowercase">
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <GridToggle gridOn={gridOn} onGridChange={onGridChange} />
          <a href={`${base}play/`} className="bg-black px-4 py-1 text-14 font-bold text-white hover:bg-red">
            Play the game.
          </a>
        </div>

        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button
              type="button"
              className="border-[3px] border-black px-3 py-1 text-14 font-bold lg:hidden hover:bg-black hover:text-white"
              aria-label="Open the menu."
              data-testid="menu-open"
            >
              Menu.
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-[60] bg-black" />
            <Dialog.Content
              className="field-black fixed inset-0 z-[70] flex flex-col p-6"
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
                    aria-label="Close the menu."
                    data-testid="menu-close"
                  >
                    Close.
                  </button>
                </Dialog.Close>
              </div>
              <ul className="mt-10 flex flex-col gap-4" role="list">
                {NAV.map((item) => (
                  <li key={item.id}>
                    <Dialog.Close asChild>
                      <a
                        href={`#${item.id}`}
                        className="ks-display block text-40 lowercase hover:text-yellow"
                      >
                        {item.label}.
                      </a>
                    </Dialog.Close>
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-col gap-3">
                <GridToggle gridOn={gridOn} onGridChange={onGridChange} className="self-start" />
                <a href={`${base}play/`} className="ks-button ks-button--white">
                  Play the game.
                </a>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </nav>
    </header>
  );
}

/** Sticky "Play." for phones. It sits above the safe area and under no content. */
export function StickyPlay() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      data-testid="sticky-play"
    >
      <a
        href={`${base}play/`}
        className="flex h-14 items-center justify-between border-t-[3px] border-black bg-yellow px-6 text-20 font-bold text-black hover:bg-black hover:text-white"
      >
        <span>Play the game.</span>
        <span aria-hidden="true">&rarr;</span>
      </a>
    </div>
  );
}
