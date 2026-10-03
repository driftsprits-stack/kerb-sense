import type { ReactNode } from 'react';

// Ahoy label block: a small solid block with Kerb Block text.
interface LabelBlockProps {
  children: ReactNode;
  colour?: 'black' | 'green' | 'paper' | 'white';
  size?: 'small' | 'large';
  className?: string;
}

const COLOURS = {
  black: 'bg-black text-white',
  green: 'bg-green text-white',
  paper: 'bg-paper text-black',
  white: 'bg-white text-black',
};

export default function LabelBlock({
  children,
  colour = 'black',
  size = 'small',
  className = '',
}: LabelBlockProps) {
  const sizing = size === 'large' ? 'text-28 px-4 py-2' : 'text-14 px-2 py-1';
  return (
    <span className={`ks-block inline-block leading-tight ${COLOURS[colour]} ${sizing} ${className}`}>
      {children}
    </span>
  );
}

/** The status word a section carries: DESIGNED, PLANNED, REQUESTED, TARGET. */
export function StatusLabel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`ks-block inline-block bg-green px-2 py-1 text-14 text-white ${className}`}>
      {children}
    </span>
  );
}
