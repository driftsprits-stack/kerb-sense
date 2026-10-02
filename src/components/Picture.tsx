// A responsive picture from the generated WebP and AVIF sets in
// src/assets/booth/. Vite resolves the files at build time.
const renders = import.meta.glob<string>('../assets/booth/renders/*.{webp,avif}', {
  eager: true,
  import: 'default',
  query: '?url',
});
const parts = import.meta.glob<string>('../assets/booth/parts/*.{webp,avif}', {
  eager: true,
  import: 'default',
  query: '?url',
});

const WIDTHS = [480, 960, 1600];

function sources(folder: 'renders' | 'parts', name: string, ext: 'webp' | 'avif'): string {
  const table = folder === 'renders' ? renders : parts;
  return WIDTHS.map((w) => {
    const url = table[`../assets/booth/${folder}/${name}-${w}.${ext}`];
    return url ? `${url} ${w}w` : '';
  })
    .filter(Boolean)
    .join(', ');
}

interface PictureProps {
  folder: 'renders' | 'parts';
  name: string;
  alt: string;
  sizes: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  width?: number;
  height?: number;
}

export default function Picture({
  folder,
  name,
  alt,
  sizes,
  className = '',
  loading = 'lazy',
  width = 800,
  height = 800,
}: PictureProps) {
  const table = folder === 'renders' ? renders : parts;
  const fallback =
    table[`../assets/booth/${folder}/${name}-960.webp`] ??
    table[`../assets/booth/${folder}/${name}-480.webp`] ??
    '';
  return (
    <picture>
      <source type="image/avif" srcSet={sources(folder, name, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={sources(folder, name, 'webp')} sizes={sizes} />
      <img
        src={fallback}
        alt={alt}
        className={className}
        loading={loading}
        decoding="async"
        width={width}
        height={height}
      />
    </picture>
  );
}
