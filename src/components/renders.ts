// Direct URLs for the largest render files, for the hero and the 404 page.
const renders = import.meta.glob<string>('../assets/booth/renders/*-1600.webp', {
  eager: true,
  import: 'default',
  query: '?url',
});

export function silhouetteUrl(name: string): string {
  return renders[`../assets/booth/renders/${name}-1600.webp`] ?? '';
}
