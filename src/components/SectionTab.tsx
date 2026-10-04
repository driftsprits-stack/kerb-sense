import { longest } from '../copy';

// Section tab: a green bar with a static chevron, Kerb Block in white.
// The title comes from the copy pool. The tab reserves the width of the
// longest entry, so a different title never shifts the layout. Phones skip
// the reserve and let the title wrap, so it never runs past the screen.
interface SectionTabProps {
  number: number;
  title: string;
  slot: string;
  id: string;
}

export default function SectionTab({ number, title, slot, id }: SectionTabProps) {
  const reserve = longest(slot);
  return (
    <h2 id={id} className="ks-tab relative max-w-full" data-slot={slot}>
      <span className="mr-3 align-top text-[0.6em]">{number}</span>
      <span className="relative inline-grid min-w-0">
        <span
          className="invisible col-start-1 row-start-1 whitespace-nowrap max-md:hidden"
          aria-hidden="true"
        >
          {reserve}
        </span>
        <span className="col-start-1 row-start-1 [text-wrap:balance] md:whitespace-nowrap">{title}</span>
      </span>
    </h2>
  );
}
