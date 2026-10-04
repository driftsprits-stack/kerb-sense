import Section from '../components/Section';
import { SafetyIcon } from '../components/Drawings';
import { SAFETY } from '../content';
import { SLOT } from '../copy';

export default function Safety() {
  return (
    <Section id="safety" slot={SLOT.safety} body={SAFETY.body} tight>
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-3" data-testid="safety-list">
        {SAFETY.items.map((item) => (
          <li
            key={item.id}
            className="grid grid-cols-[72px_minmax(0,1fr)] items-center gap-2 border-[3px] border-black bg-white p-2 md:flex md:flex-col md:items-start md:gap-3 md:p-3"
          >
            <div className="h-9 w-9 shrink-0 border border-black md:h-12 md:w-12">
              <SafetyIcon id={item.id} />
            </div>
            <div className="min-w-0">
              <p className="ks-block text-18">{item.label}</p>
              <p className="mt-1 text-14">{item.line}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
