import { useEffect, useState } from 'react';
import { gridColumnsFor } from '../lib/grid';

// The "Show the grid." overlay. Columns are drawn as dashed lane markings
// on the same 12-column grid the page uses. It never animates.
export default function GridOverlay({ visible }: { visible: boolean }) {
  const [columns, setColumns] = useState(() =>
    gridColumnsFor(typeof window === 'undefined' ? 1440 : window.innerWidth),
  );

  useEffect(() => {
    const update = () => setColumns(gridColumnsFor(window.innerWidth));
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40" aria-hidden="true" data-testid="grid-overlay">
      <div className="ks-container h-full">
        <div className="ks-grid h-full" style={{ ['--grid-columns' as string]: columns }}>
          {Array.from({ length: columns }, (_, i) => (
            <div
              key={i}
              className="relative h-full border-l border-r border-dashed border-black"
              style={{ mixBlendMode: 'difference', borderColor: 'var(--ks-white)' }}
            >
              <span className="absolute top-20 left-0 bg-black px-1 text-12 font-bold text-white">
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
