// Inline drawings used until the v2 artwork lands: the slope chart, the
// budget chart, the dimension drawing, the exploded booth and the step
// pictograms. Flat shapes in the four colours. Text in them is Kerb Block.
import { cataloguePartsOf } from '../lib/parts';
import { barPercent } from '../lib/budget';

const partImages = import.meta.glob<string>('../assets/{parts,renders}/*.svg', {
  eager: true,
  import: 'default',
  query: '?url',
});

export function partImage(key: string): string {
  return partImages[`../assets/${key}`] ?? '';
}

const BLOCK = "'Kerb Block', 'Helvetica Neue', Helvetica, Arial, sans-serif";

interface Series {
  label: string;
  from: number;
  to: number;
}

/** A slope chart: one line per series from the first year to the second. */
export function SlopeChart({
  series,
  years,
  title,
}: {
  series: readonly Series[];
  years: readonly string[];
  title: string;
}) {
  const w = 640;
  const h = 300;
  const left = 110;
  const right = 400;
  const top = 40;
  const bottom = 250;
  const max = Math.max(...series.flatMap((s) => [s.from, s.to]));
  const y = (v: number) => bottom - (v / max) * (bottom - top);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={title} className="w-full" data-testid="slope-chart">
      <line x1={left} y1={top - 10} x2={left} y2={bottom} stroke="#000000" strokeWidth={3} />
      <line x1={right} y1={top - 10} x2={right} y2={bottom} stroke="#000000" strokeWidth={3} />
      <text x={left} y={bottom + 30} fontFamily={BLOCK} fontSize={20} textAnchor="middle" fill="#000000">
        {years[0]}
      </text>
      <text x={right} y={bottom + 30} fontFamily={BLOCK} fontSize={20} textAnchor="middle" fill="#000000">
        {years[1]}
      </text>
      {series.map((s, i) => {
        const colour = i === 0 ? '#000000' : '#178048';
        return (
          <g key={s.label}>
            <line x1={left} y1={y(s.from)} x2={right} y2={y(s.to)} stroke={colour} strokeWidth={6} />
            <rect x={left - 8} y={y(s.from) - 8} width={16} height={16} fill={colour} />
            <rect x={right - 8} y={y(s.to) - 8} width={16} height={16} fill={colour} />
            <text
              x={left - 16}
              y={y(s.from) + 7}
              fontFamily={BLOCK}
              fontSize={22}
              textAnchor="end"
              fill={colour}
            >
              {s.from}
            </text>
            <text x={right + 16} y={y(s.to) + 7} fontFamily={BLOCK} fontSize={22} fill={colour}>
              {s.to}
            </text>
            <text x={right + 64} y={y(s.to) + 7} fontFamily={BLOCK} fontSize={11} fill={colour}>
              {s.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** A horizontal bar chart of the budget on a 0 to S$3,000 scale. */
export function BudgetChart({
  lines,
  title,
}: {
  lines: readonly { category: string; amount: number }[];
  title: string;
}) {
  const w = 640;
  const rowH = 44;
  const h = lines.length * rowH + 40;
  const labelW = 170;
  const barW = w - labelW - 90;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={title}
      className="w-full"
      data-testid="budget-chart"
    >
      <line x1={labelW} y1={10} x2={labelW} y2={h - 30} stroke="#000000" strokeWidth={3} />
      {lines.map((line, i) => {
        const yy = 16 + i * rowH;
        const bw = (barPercent(line.amount) / 100) * barW;
        return (
          <g key={line.category}>
            <text
              x={labelW - 12}
              y={yy + 20}
              fontFamily={BLOCK}
              fontSize={14}
              textAnchor="end"
              fill="#000000"
            >
              {line.category}
            </text>
            <rect
              x={labelW}
              y={yy}
              width={Math.max(bw, line.amount > 0 ? 4 : 0)}
              height={28}
              fill="#178048"
            />
            <text x={labelW + bw + 12} y={yy + 20} fontFamily={BLOCK} fontSize={16} fill="#000000">
              {`S$${line.amount.toLocaleString('en-SG')}`}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** The dimension drawing: the side profile with three measurements. */
export function DimensionDrawing({ title }: { title: string }) {
  return (
    <svg
      viewBox="0 0 640 420"
      role="img"
      aria-label={title}
      className="w-full"
      data-testid="dimension-drawing"
    >
      {/* The side profile: a sloped control deck over a box. */}
      <path d="M160 340 V120 H420 L470 200 V340 Z" fill="#FFFFFF" stroke="#000000" strokeWidth={4} />
      <rect x={160} y={120} width={260} height={40} fill="#000000" />
      {/* Height, 65 cm. */}
      <line x1={110} y1={120} x2={110} y2={340} stroke="#000000" strokeWidth={3} />
      <line x1={100} y1={120} x2={120} y2={120} stroke="#000000" strokeWidth={3} />
      <line x1={100} y1={340} x2={120} y2={340} stroke="#000000" strokeWidth={3} />
      <text x={60} y={236} fontFamily={BLOCK} fontSize={20} textAnchor="middle" fill="#000000">
        65 CM
      </text>
      {/* Depth, 75 cm. */}
      <line x1={160} y1={380} x2={470} y2={380} stroke="#000000" strokeWidth={3} />
      <line x1={160} y1={370} x2={160} y2={390} stroke="#000000" strokeWidth={3} />
      <line x1={470} y1={370} x2={470} y2={390} stroke="#000000" strokeWidth={3} />
      <text x={315} y={410} fontFamily={BLOCK} fontSize={20} textAnchor="middle" fill="#000000">
        75 CM
      </text>
      {/* Width, 70 cm, as a plan view at the right. */}
      <rect x={520} y={160} width={90} height={180} fill="#FFFFFF" stroke="#000000" strokeWidth={4} />
      <line x1={520} y1={120} x2={610} y2={120} stroke="#000000" strokeWidth={3} />
      <line x1={520} y1={110} x2={520} y2={130} stroke="#000000" strokeWidth={3} />
      <line x1={610} y1={110} x2={610} y2={130} stroke="#000000" strokeWidth={3} />
      <text x={565} y={100} fontFamily={BLOCK} fontSize={20} textAnchor="middle" fill="#000000">
        70 CM
      </text>
    </svg>
  );
}

/** The exploded booth: the six catalogue parts drawn apart, each with its number. */
export function ExplodedDrawing({ title }: { title: string }) {
  const parts = cataloguePartsOf();
  return (
    <div
      className="grid aspect-[4/3] grid-cols-3 grid-rows-2 gap-2 bg-white p-2"
      role="img"
      aria-label={title}
      data-testid="exploded-drawing"
    >
      {parts.map((p) => (
        <figure key={p.id} className="relative flex items-center justify-center border border-black">
          <img
            src={partImage(p.image)}
            alt=""
            width={400}
            height={400}
            loading="lazy"
            decoding="async"
            className="h-3/4 w-3/4 object-contain"
          />
          <figcaption className="ks-label absolute left-1 top-1">{p.number}</figcaption>
        </figure>
      ))}
    </div>
  );
}

/** A square pictogram for each crossing step: a figure at a kerb, drawn flat. */
export function StepIcon({ id }: { id: string }) {
  const common = { fill: 'none', stroke: '#000000', strokeWidth: 8, strokeLinecap: 'square' as const };
  const figure = (
    <g>
      <rect x={88} y={40} width={24} height={24} fill="#000000" />
      <path d="M100 72 V120 M100 120 L80 160 M100 120 L120 160 M74 92 H126" {...common} />
    </g>
  );
  const kerb = <rect x={0} y={168} width={200} height={12} fill="#000000" />;
  let extra = null;
  if (id === 'look-right' || id === 'look-right-again') {
    extra = <path d="M130 52 H176 M160 36 L176 52 L160 68" {...common} stroke="#178048" />;
  } else if (id === 'look-left') {
    extra = <path d="M70 52 H24 M40 36 L24 52 L40 68" {...common} stroke="#178048" />;
  } else if (id === 'cross') {
    extra = (
      <g>
        <rect x={20} y={168} width={30} height={12} fill="#FFFFFF" />
        <rect x={80} y={168} width={30} height={12} fill="#FFFFFF" />
        <rect x={140} y={168} width={30} height={12} fill="#FFFFFF" />
        <rect x={150} y={80} width={24} height={24} fill="#178048" />
      </g>
    );
  } else if (id === 'phone-after') {
    extra = <rect x={140} y={96} width={28} height={48} fill="#178048" />;
  } else if (id === 'wait') {
    extra = <rect x={150} y={80} width={24} height={24} fill="#000000" />;
  }
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <rect width={200} height={200} fill="#FFFFFF" />
      {figure}
      {kerb}
      {extra}
    </svg>
  );
}

/** The three safety pictograms. */
export function SafetyIcon({ id }: { id: string }) {
  const common = { fill: 'none', stroke: '#000000', strokeWidth: 8, strokeLinecap: 'square' as const };
  let shape;
  if (id === 'accounts') {
    shape = (
      <g>
        <rect x={70} y={40} width={60} height={60} {...common} />
        <path d="M40 160 V130 H160 V160" {...common} />
        <path d="M40 40 L160 160" stroke="#178048" strokeWidth={8} />
      </g>
    );
  } else if (id === 'storage') {
    shape = (
      <g>
        <rect x={40} y={50} width={120} height={100} {...common} />
        <path d="M40 90 H160" {...common} />
        <path d="M40 50 L160 150" stroke="#178048" strokeWidth={8} />
      </g>
    );
  } else {
    shape = (
      <g>
        <rect x={60} y={40} width={80} height={110} {...common} />
        <rect x={80} y={60} width={40} height={40} fill="#000000" />
        <rect x={0} y={160} width={200} height={12} fill="#000000" />
        <rect x={92} y={110} width={16} height={16} fill="#178048" />
      </g>
    );
  }
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <rect width={200} height={200} fill="#FFFFFF" />
      {shape}
    </svg>
  );
}
