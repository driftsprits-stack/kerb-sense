import Section from '../components/Section';
import { TEAM } from '../content';
import { SLOT } from '../copy';

export default function Team() {
  return (
    <Section id="team" slot={SLOT.team} summary={TEAM.summary}>
      <table className="ks-table">
        <thead>
          <tr>
            <th scope="col">Role</th>
            <th scope="col">Member</th>
            <th scope="col">Institution</th>
          </tr>
        </thead>
        <tbody>
          {TEAM.members.map((m) => (
            <tr key={m.role}>
              <td className="text-16 font-bold">{m.role}</td>
              <td className="text-16">{m.name}</td>
              <td className="text-14">{m.institution}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
}
