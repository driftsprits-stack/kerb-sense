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
            className="flex items-center gap-3 border-[3px] border-black bg-white p-3 md:flex-col md:items-start"
          >
            <div className="h-20 w-20 shrink-0 border border-black">
              <SafetyIcon id={item.id} />
            </div>
            <div>
              <p className="ks-block text-16">{item.label}</p>
              <p className="mt-1 text-14">{item.line}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
