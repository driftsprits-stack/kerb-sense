// Converts the booth renders and parts to WebP and AVIF at three widths,
// and makes the og:image, the PNG favicons and the apple-touch-icon.
// Run: npm run assets
import sharp from 'sharp';
import { mkdir, readdir, stat } from 'node:fs/promises';
import { join, basename, extname } from 'node:path';

const SRC = new URL('../website-handoff/assets/booth/', import.meta.url).pathname;
const OUT = new URL('../src/assets/booth/', import.meta.url).pathname;
const PUB = new URL('../public/', import.meta.url).pathname;
const WIDTHS = [480, 960, 1600];

async function convert(dir, outDir) {
  await mkdir(outDir, { recursive: true });
  for (const file of await readdir(dir)) {
    if (!['.webp', '.png'].includes(extname(file))) continue;
    const name = basename(file, extname(file));
    const input = sharp(join(dir, file));
    const meta = await input.metadata();
    for (const w of WIDTHS) {
      if (w > (meta.width ?? 0) && w !== WIDTHS[0]) continue;
      const base = input.clone().resize({ width: Math.min(w, meta.width ?? w) });
      await base
        .clone()
        .webp({ quality: 82, alphaQuality: 90 })
        .toFile(join(outDir, `${name}-${w}.webp`));
      await base
        .clone()
        .avif({ quality: 55 })
        .toFile(join(outDir, `${name}-${w}.avif`));
    }
    console.log('converted', name);
  }
}

await convert(join(SRC, 'renders'), join(OUT, 'renders'));
await convert(join(SRC, 'parts'), join(OUT, 'parts'));

// og:image 1200x630: the green field, zebra bars and the side silhouette.
const green = '#178048';
const bars = Array.from({ length: 9 }, (_, i) => {
  const x = 60 + i * 72;
  return `<rect x="${x}" y="0" width="36" height="630" fill="#FFFFFF"/>`;
}).join('');
const svg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="${green}"/>${bars}</svg>`,
);
// The booth is cropped by the frame, as in the Ahoy thumbnail rules.
const silhouette = await sharp(join(SRC, 'renders', 'booth-silhouette-side.webp'))
  .resize({ width: 900 })
  .extract({ left: 0, top: 80, width: 780, height: 590 })
  .toBuffer();
await sharp(svg)
  .composite([{ input: silhouette, left: 420, top: 40 }])
  .png()
  .toFile(join(PUB, 'og-image.png'));
await sharp(join(PUB, 'og-image.png')).webp({ quality: 85 }).toFile(join(PUB, 'og-image.webp'));

// Favicons from the mark.
const mark = new URL('../website-handoff/assets/logo/kerbsense-mark-white-on-red.svg', import.meta.url)
  .pathname;
for (const [size, name] of [
  [32, 'favicon-32.png'],
  [192, 'icon-192.png'],
  [512, 'icon-512.png'],
  [180, 'apple-touch-icon.png'],
]) {
  await sharp(mark, { density: 300 }).resize(size, size).png().toFile(join(PUB, name));
}

const og = await stat(join(PUB, 'og-image.png'));
console.log('og-image.png', Math.round(og.size / 1024), 'KB');
