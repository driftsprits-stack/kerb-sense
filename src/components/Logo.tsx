// The wordmark: lowercase "kerb sense" with the roundel as the full stop.
// Drawn inline so it takes the colour of its context. The roundel stays red
// on white and black, and white on red, as DESIGN.md says.
interface LogoProps {
  variant?: 'black' | 'white' | 'on-red';
  height?: number;
  className?: string;
}

export function Roundel({ colour, size = 24 }: { colour: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" aria-hidden="true" focusable="false">
      <circle cx="160" cy="256" r="100" fill={colour} />
      <path d="M263.5 148.8 A149 149 0 0 1 263.5 363.2" fill="none" stroke={colour} strokeWidth="30" />
      <path d="M308 102.8 A213 213 0 0 1 308 409.2" fill="none" stroke={colour} strokeWidth="30" />
      <path d="M352.4 56.7 A277 277 0 0 1 352.4 455.3" fill="none" stroke={colour} strokeWidth="30" />
    </svg>
  );
}

export default function Logo({ variant = 'black', height = 24, className = '' }: LogoProps) {
  const text = variant === 'black' ? 'var(--ks-black)' : 'var(--ks-white)';
  const roundel = variant === 'on-red' ? 'var(--ks-white)' : 'var(--ks-red)';
  return (
    <span
      className={`inline-flex items-center gap-[0.15em] font-bold ${className}`}
      style={{ fontSize: height, lineHeight: 1, letterSpacing: '-0.04em', color: text }}
    >
      <span>kerb sense</span>
      <Roundel colour={roundel} size={height * 0.9} />
    </span>
  );
}
