import SectionTab from '../components/SectionTab';
import { TEAM } from '../content';

export default function Team() {
  return (
    <section id="team" className="field-paper border-t-[3px] border-black" aria-labelledby="team-title">
      <div className="ks-container py-12 md:py-20">
        <SectionTab number={8} title={TEAM.headline} field="blue" id="team-title" />
        <p className="mt-10 max-w-[48ch] text-20 md:text-28">{TEAM.lead}</p>
        <table className="ks-table mt-8">
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
      </div>
    </section>
  );
}
