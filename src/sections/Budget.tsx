import SectionTab from '../components/SectionTab';
import { BUDGET } from '../content';
import { BUDGET_TOTAL, barPercent, formatSgd, sumBudget } from '../lib/budget';

const COLOURS: Record<string, string> = {
  black: 'bg-black',
  blue: 'bg-blue',
  yellow: 'bg-yellow',
  red: 'bg-red',
  lblue: 'bg-lblue',
  green: 'bg-green',
};

// Flat palette bars in a real table, on a 0 to S$3,000 scale.
export default function Budget() {
  const total = sumBudget(BUDGET.lines);
  return (
    <section id="budget" className="field-paper border-t-[3px] border-black" aria-labelledby="budget-title">
      <div className="ks-container py-12 md:py-20">
        <SectionTab number={9} title={BUDGET.headline} field="green" point="left" id="budget-title" />
        <div className="ks-grid mt-10 gap-y-10">
          <div className="col-span-4 md:col-span-8">
            <p className="ks-display text-64">{BUDGET.lead}</p>
            <table className="ks-table mt-6" data-testid="budget-table">
              <caption className="sr-only">Budget by category, in Singapore dollars.</caption>
              <thead>
                <tr>
                  <th scope="col" className="w-[40%]">
                    Category
                  </th>
                  <th scope="col">Share of {formatSgd(BUDGET_TOTAL)}</th>
                  <th scope="col" className="w-20 text-right">
                    S$
                  </th>
                </tr>
              </thead>
              <tbody>
                {BUDGET.lines.map((line) => (
                  <tr key={line.category}>
                    <td className="text-16 font-bold">{line.category}</td>
                    <td>
                      <div className="h-8 w-full border border-black">
                        <div
                          className={`h-full ${COLOURS[line.colour]}`}
                          style={{ width: `${barPercent(line.amount, total)}%` }}
                          role="img"
                          aria-label={`${Math.round(barPercent(line.amount, total))} percent`}
                        />
                      </div>
                    </td>
                    <td className="text-right text-16 font-bold">{line.amount.toLocaleString('en-SG')}</td>
                  </tr>
                ))}
                <tr>
                  <td className="text-16 font-bold">Total</td>
                  <td />
                  <td className="text-right text-16 font-bold">{total.toLocaleString('en-SG')}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-span-4 md:col-span-4">
            <h3 className="ks-h3">{BUDGET.topTitle}</h3>
            <ul className="list mt-3 text-16" role="list">
              {BUDGET.top.map((t) => (
                <li key={t} className="border-b border-black py-2">
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-6 inline-block bg-black px-2 py-1 text-14 font-bold text-white">{BUDGET.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
