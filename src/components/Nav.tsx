import * as Dialog from '@radix-ui/react-dialog';
import Logo from './Logo';
import { SECTIONS, type SectionId } from '../content';

const base = import.meta.env.BASE_URL;

// The header: the logo, the PLAY button and, below 1280 px, the MENU
// button. The menu is a full-screen numbered list (the React Bits
// Staggered Menu layout on the existing Radix dialog). It opens at once:
// no motion, no opacity.
export default function Nav({ current }: { current: SectionId | null }) {
  const currentName = SECTIONS.find((s) => s.id === current)?.name;
  return (
    <header className="field-paper sticky top-0 z-50 border-b-[3px] border-black">
      <nav className="ks-container flex h-8 items-center justify-between gap-3" aria-label="Main">
        <a
          href={`${base}#top`}
          className="flex min-h-[44px] shrink-0 items-center"
          aria-label="Kerb Sense, go to the top of the page"
        >
          <Logo height={22} />
        </a>
        <p
          className="ks-block min-w-0 flex-1 truncate text-14 xl:hidden"
          aria-live="polite"
          data-testid="current-section"
        >
          {currentName ?? ''}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          {/* Phones use the sticky PLAY bar at the bottom instead. */}
          <a
            href={`${base}play/`}
            className="ks-button ks-button--green ks-button--small max-md:hidden"
            data-testid="nav-play"
          >
            PLAY
          </a>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button
                type="button"
                className="ks-button ks-button--outline-black ks-button--small xl:hidden"
                aria-label="Open the menu"
                data-testid="menu-open"
              >
                MENU
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-[60] bg-black" />
              <Dialog.Content
                className="field-black fixed inset-0 z-[70] flex flex-col overflow-y-auto p-3"
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
                      className="ks-button ks-button--outline-white ks-button--small"
                      aria-label="Close the menu"
                      data-testid="menu-close"
                    >
                      CLOSE
                    </button>
                  </Dialog.Close>
                </div>
                <ol className="ks-block mt-6 flex flex-col">
                  {SECTIONS.map((s) => (
                    <li key={s.id} className="border-b border-white">
                      <Dialog.Close asChild>
                        <a href={`#${s.id}`} className="ks-cell flex items-baseline gap-4 py-3 text-28">
                          <span className="w-6 text-16">{s.number}</span>
                          {s.name}
                        </a>
                      </Dialog.Close>
                    </li>
                  ))}
                </ol>
                <a href={`${base}play/`} className="ks-button ks-button--green mt-auto">
                  PLAY
                </a>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </nav>
    </header>
  );
}

/** Sticky PLAY for phones. It sits above the safe area and under no content. */
export function StickyPlay() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      data-testid="sticky-play"
    >
      <a
        href={`${base}play/`}
        className="ks-block flex h-7 items-center justify-center border-t-[3px] border-black bg-green text-20 text-white hover:bg-black"
      >
        PLAY
      </a>
    </div>
  );
}
