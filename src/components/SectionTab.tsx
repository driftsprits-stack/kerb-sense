import { longest } from '../copy';

// Section tab: a green bar with a static chevron, white Helvetica Bold.
// The title comes from the copy pool. The tab reserves the width of the
// longest entry, so a different title never shifts the layout.
interface SectionTabProps {
  number: number;
  title: string;
  slot: string;
  id: string;
}

export default function SectionTab({ number, title, slot, id }: SectionTabProps) {
  const reserve = longest(slot);
  return (
    <h2 id={id} className="ks-tab relative" data-slot={slot}>
      <span className="mr-3 align-top text-[0.6em]">{number}</span>
      <span className="relative inline-grid">
        <span className="invisible col-start-1 row-start-1 whitespace-nowrap" aria-hidden="true">
          {reserve}
        </span>
        <span className="col-start-1 row-start-1 whitespace-nowrap">{title}</span>
      </span>
    </h2>
  );
}
