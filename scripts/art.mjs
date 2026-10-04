// Design-time art, after the Playgrnd tools in the website shortlist
// (picks 19 to 24). Each tool's idea is rebuilt here as a small static SVG
// in the brand palette, sampled from the real booth renders, so the output
// is a repo asset and not a live editor. Run `npm run art`; the files land in
// src/assets/art/. The share images (picks 18 and 25) are made by
// scripts/share-images.mjs from these files.
import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const OUT = new URL('../src/assets/art/', import.meta.url).pathname;
const RENDERS = new URL('../src/assets/v2/renders/', import.meta.url).pathname;
const BLACK = '#000000';
const WHITE = '#FFFFFF';
const GREEN = '#178048';
const PAPER = '#F2EFE8';

await mkdir(`${OUT}tokens`, { recursive: true });

/** Samples a render into a cols x rows grid of { r, g, b, a } (0 to 255). */
async function sample(file, cols) {
  const src = sharp(`${RENDERS}${file}.svg`, { density: 144 });
  const { width = 1, height = 1 } = await src.metadata();
  const rows = Math.round((cols * height) / width);
  const { data } = await src
    .resize(cols, rows, { fit: 'fill', kernel: 'lanczos3' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const cells = [];
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const i = (y * cols + x) * 4;
      cells.push({ x, y, r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] });
    }
  }
  return { cells, cols, rows };
}

/** The palette colour a sampled cell is closest to: body white, screen black or button green. */
function kind({ r, g, b, a }) {
  if (a < 110) return 'none';
  if (g > r + 40 && g > b + 20) return 'green';
  return (r + g + b) / 3 > 140 ? 'white' : 'black';
}

const svg = (w, h, body, label) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"${label ? ` role="img" aria-label="${label}"` : ''}>${body}</svg>\n`;
const round = (n) => Math.round(n * 10) / 10;

// Pick 19, Stipple: a regular lattice of solid green dots on black. The
// booth body is the big dots, the buttons are white, the screen stays a
// field of small dots. Two sizes only, no noise.
{
  const { cells, cols, rows } = await sample('booth-light-three-quarter', 60);
  const s = 16;
  const dots = [];
  for (const c of cells) {
    const k = kind(c);
    const cx = c.x * s + s / 2;
    const cy = c.y * s + s / 2;
    if (k === 'white') dots.push(`<circle cx="${cx}" cy="${cy}" r="6" fill="${GREEN}"/>`);
    else if (k === 'green') dots.push(`<circle cx="${cx}" cy="${cy}" r="6" fill="${WHITE}"/>`);
    else if (k === 'black') dots.push(`<circle cx="${cx}" cy="${cy}" r="2.5" fill="${GREEN}"/>`);
  }
  await writeFile(
    `${OUT}stipple-booth.svg`,
    svg(
      cols * s,
      rows * s,
      `<rect width="100%" height="100%" fill="${BLACK}"/>${dots.join('')}`,
      'The Kerb Sense booth drawn as a lattice of green LED dots on black',
    ),
  );
}

// Pick 21, Oddgrid: the booth as a coarse two-colour pixel grid with low
// fill (each pixel is a smaller square inside its cell), on paper.
{
  const { cells, cols, rows } = await sample('booth-green-three-quarter', 26);
  const s = 30;
  const fill = 22;
  const off = (s - fill) / 2;
  const px = [];
  for (const c of cells) {
    const k = kind(c);
    if (k === 'none' || k === 'white') continue;
    px.push(
      `<rect x="${c.x * s + off}" y="${c.y * s + off}" width="${fill}" height="${fill}" fill="${k === 'green' ? GREEN : BLACK}"/>`,
    );
  }
  await writeFile(
    `${OUT}oddgrid-booth.svg`,
    svg(
      cols * s,
      rows * s,
      px.join(''),
      'The Kerb Sense booth drawn as a coarse grid of green and black squares',
    ),
  );
}

// Pick 20, Optic: broad black and white crossing stripes with one walking
// figure. Inside the figure the stripes swap colour (counterchange).
const FIGURE =
  // A blocky walker, 200 units tall, built from rectangles and two legs mid-stride.
  'M84 0h32v32h-32z M76 40h48v72h-48z M60 44h14v58h-14z M126 44h14v58h-14z ' +
  'M78 112h20l-14 88h-22z M102 112h20l22 88h-22z';
export function optic(w, h, stripes, figureX, figureScale, id = 'walker') {
  const sw = w / stripes;
  const bars = (inverse) =>
    Array.from({ length: stripes }, (_, i) =>
      (i % 2 === 0) !== inverse
        ? `<rect x="${round(i * sw)}" y="0" width="${round(sw)}" height="${h}" fill="${BLACK}"/>`
        : '',
    ).join('');
  const fy = (h - 200 * figureScale) / 2;
  return (
    `<defs><clipPath id="${id}"><path transform="translate(${figureX} ${round(fy)}) scale(${figureScale})" d="${FIGURE}"/></clipPath></defs>` +
    `<rect width="${w}" height="${h}" fill="${WHITE}"/>${bars(false)}` +
    `<g clip-path="url(#${id})"><rect width="${w}" height="${h}" fill="${WHITE}"/>${bars(true)}</g>`
  );
}
await writeFile(
  `${OUT}optic-crossing.svg`,
  svg(
    1200,
    300,
    optic(1200, 300, 12, 470, 1.25),
    'Zebra-crossing stripes with one walking figure whose colours swap',
  ),
);

// Pick 24, Vee: one direction, two static chevrons. The alternative to
// Optic for a separator; the site uses neither in its body (shortlist step 5).
await writeFile(
  `${OUT}vee-chevrons.svg`,
  svg(
    240,
    120,
    `<path d="M0 0h40l60 60-60 60h-40l60-60z" fill="${BLACK}"/><path d="M90 0h40l60 60-60 60h-40l60-60z" fill="${GREEN}"/>`,
    'Two chevrons pointing right',
  ),
);

// Pick 22, Cipher: a clipped field of abstract square marks for one small
// patch near the game preview. The marks are not letters and carry no meaning.
{
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const marks = [
    (x, y) => `<rect x="${x}" y="${y}" width="12" height="12"/>`,
    (x, y) => `<rect x="${x + 4}" y="${y + 4}" width="4" height="4"/>`,
    (x, y) =>
      `<rect x="${x}" y="${y}" width="12" height="12"/><rect x="${x + 4}" y="${y + 4}" width="4" height="4" fill="${PAPER}"/>`,
    (x, y) =>
      `<rect x="${x}" y="${y}" width="4" height="12"/><rect x="${x + 8}" y="${y}" width="4" height="12"/>`,
    () => '',
  ];
  const cells = [];
  for (let y = 0; y < 4; y += 1) {
    for (let x = 0; x < 20; x += 1) {
      const mark = marks[Math.floor(rand() * marks.length)];
      cells.push(mark(x * 16 + 2, y * 16 + 2));
    }
  }
  await writeFile(
    `${OUT}cipher-patch.svg`,
    svg(
      320,
      64,
      `<rect width="320" height="64" fill="${PAPER}"/><g fill="${BLACK}">${cells.join('')}</g>`,
      '',
    ),
  );
}

// Pick 23, Tokens: one small marker per section, drawn on a 24 unit grid from
// squares, bars and outlines, and always shown next to the section's word.
// The paths live in src/lib/tokens.json, shared with the site (Token.tsx).
export const TOKENS = JSON.parse(await readFile(new URL('../src/lib/tokens.json', import.meta.url), 'utf8'));
for (const [name, d] of Object.entries(TOKENS)) {
  await writeFile(
    `${OUT}tokens/${name}.svg`,
    svg(24, 24, `<path d="${d}" fill="${BLACK}" fill-rule="evenodd"/>`, `${name} marker`),
  );
}

// Pick 8, Shape Grid: a square grid for the dimension drawing's ground. Paper
// lines on white, so the drawing stays the strongest thing in the frame.
await writeFile(
  `${OUT}grid-40.svg`,
  svg(40, 40, `<path d="M0 0.5H40M0.5 0V40" stroke="${PAPER}" stroke-width="1" fill="none"/>`, ''),
);

console.log('art: stipple, oddgrid, optic, vee, cipher, tokens, grid');
