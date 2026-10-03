import { longest } from '../copy';
import Token, { type TokenName } from './Token';

// Section tab: a green bar with a static chevron, Kerb Block in white, and
// the section's marker (Token) between the number and the title.
// The title comes from the copy pool. The tab reserves the width of the
// longest entry, so a different title never shifts the layout.
interface SectionTabProps {
  number: number;
  title: string;
  slot: string;
  id: string;
  token: TokenName;
}

export default function SectionTab({ number, title, slot, id, token }: SectionTabProps) {
  const reserve = longest(slot);
  return (
    <h2 id={id} className="ks-tab relative" data-slot={slot}>
      <span className="mr-2 align-top text-[0.6em]">{number}</span>
      <Token name={token} className="mr-3 inline-block align-[-0.1em] text-[0.8em]" />
      <span className="relative inline-grid">
        <span className="invisible col-start-1 row-start-1 whitespace-nowrap" aria-hidden="true">
          {reserve}
        </span>
        <span className="col-start-1 row-start-1 whitespace-nowrap">{title}</span>
      </span>
    </h2>
  );
}
