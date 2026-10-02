// Ahoy section tab: a solid colour bar with a chevron end. The point
// alternates left and right, like the infographic.
export type Field = 'red' | 'blue' | 'green' | 'yellow' | 'lblue' | 'black';

interface SectionTabProps {
  number: number;
  title: string;
  field: Field;
  point?: 'right' | 'left';
  id?: string;
}

const FIELD_BG: Record<Field, string> = {
  red: 'bg-red text-white',
  blue: 'bg-blue text-white',
  green: 'bg-green text-white',
  yellow: 'bg-yellow text-black',
  lblue: 'bg-lblue text-black',
  black: 'bg-black text-white',
};

export default function SectionTab({ number, title, field, point = 'right', id }: SectionTabProps) {
  const colour = FIELD_BG[field];
  return (
    <div className={point === 'left' ? 'flex justify-end' : 'flex'}>
      <h2 id={id} className={`ks-tab ${point === 'left' ? 'ks-tab--left' : ''} ${colour}`}>
        <span className="mr-3 text-[0.6em] align-top">{number}</span>
        {title}
      </h2>
    </div>
  );
}
