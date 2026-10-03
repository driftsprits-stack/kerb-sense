import Section from '../components/Section';
import { TEAM } from '../content';
import { SLOT } from '../copy';

export default function Team() {
  return (
    <Section id="team" slot={SLOT.team} body={TEAM.body} tight>
      <ul className="ks-block border-t-[3px] border-black" data-testid="team-list">
        {TEAM.members.map((m) => (
          <li key={m.name} className="flex items-baseline justify-between gap-4 border-b border-black py-2">
            <span className="text-20">{m.name}</span>
            <span className="text-12 text-right">{m.role}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
