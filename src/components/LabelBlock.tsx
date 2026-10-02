import type { ReactNode } from 'react';

// Ahoy label block: a small black block with white bold text.
interface LabelBlockProps {
  children: ReactNode;
  colour?: 'black' | 'red' | 'blue' | 'green';
  size?: 'small' | 'large';
  className?: string;
}

const COLOURS = {
  black: 'bg-black text-white',
  red: 'bg-red text-white',
  blue: 'bg-blue text-white',
  green: 'bg-green text-white',
};

export default function LabelBlock({
  children,
  colour = 'black',
  size = 'small',
  className = '',
}: LabelBlockProps) {
  const sizing = size === 'large' ? 'text-28 px-4 py-2' : 'text-14 px-2 py-1';
  return (
    <span className={`inline-block font-bold leading-tight ${COLOURS[colour]} ${sizing} ${className}`}>
      {children}
    </span>
  );
}
