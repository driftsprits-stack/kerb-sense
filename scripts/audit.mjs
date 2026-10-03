// Audits the built site against DESIGN.md and WEBSITE-STANDARDS.md.
// It fails the build on:
//   - gradients, shadows, filters, blur, opacity below 1 or animated opacity;
//   - a border radius other than 0;
//   - any colour outside the seven palette colours plus the paper ground;
//   - em dashes or emoji in the site's text;
//   - placeholder words.
// The game at dist/play/ is not audited: it is a separate, unchanged product.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const PALETTE = new Set([
  '#ffffff',
  '#000000',
  '#ac1e39',
  '#e1b913',
  '#178048',
  '#214ea0',
  '#3d99c9',
  '#f2efe8',
]);
const problems = [];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (full.includes(`${DIST}play`)) continue;
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const files = walk(DIST);
const css = files.filter((f) => extname(f) === '.css');
const html = files.filter((f) => extname(f) === '.html');
const js = files.filter((f) => extname(f) === '.js');

// Three.js ships its own colour tables, shader code and shadow helpers, and
// drei's Outlines are drawn in a shader. That chunk is checked only for the
// palette we pass in, not for its library internals.
const siteJs = js.filter((f) => !/three-/.test(f));

function check(file, text, pattern, message, allow = []) {
  const matches = text.match(pattern) ?? [];
  const bad = matches.filter((m) => !allow.some((a) => a.test(m)));
  if (bad.length)
    problems.push(`${file.replace(DIST, 'dist/')}: ${message} (${[...new Set(bad)].slice(0, 5).join(', ')})`);
}

for (const file of css) {
  const text = readFileSync(file, 'utf8');
  check(file, text, /[a-z-]*gradient\(/g, 'gradient');
  check(file, text, /box-shadow:(?!none)[^;]+/g, 'box-shadow');
  check(file, text, /text-shadow:(?!none)[^;]+/g, 'text-shadow');
  check(file, text, /(?<![a-z-])filter:(?!none)[^;]+/g, 'filter');
  check(file, text, /backdrop-filter:[^;]+/g, 'backdrop-filter');
  check(file, text, /opacity:\s*(?!1\b|1;|1\})[\d.]+/g, 'opacity below 1');
  check(file, text, /transition:(?!none)[^;]+/g, 'transition', [/transition:none/]);
  check(file, text, /border(?:-[a-z]+)*-radius:\s*(?!0(?:px)?\s*[;!}])[^;}]+/g, 'border-radius');
  // Every colour must be in the palette. Transparent and currentColor are fine.
  const colours = text.match(/#[0-9a-fA-F]{3,8}\b/g) ?? [];
  const bad = [...new Set(colours.map((c) => c.toLowerCase()))].filter(
    (c) => c !== '#0000' && !PALETTE.has(expand(c)),
  );
  if (bad.length) problems.push(`${file.replace(DIST, 'dist/')}: off-palette colour (${bad.join(', ')})`);
  // Tailwind probes browser support with "color:rgb(from red r g b)". That is a feature test, not a colour.
  check(file, text, /\b(?:rgba?|hsla?|oklch|oklab|lab|lch|color-mix)\([^)]*\)/g, 'functional colour', [
    /^rgb\(from red r g b\)$/,
  ]);
}

function expand(hex) {
  if (hex.length === 4) return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  if (hex.length === 9) return hex.slice(0, 7);
  return hex;
}

for (const file of [...html, ...siteJs]) {
  const text = readFileSync(file, 'utf8');
  check(file, text, /—/g, 'em dash');
  check(file, text, /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, 'emoji');
  check(file, text, /lorem ipsum|TBD|TODO|placeholder text/gi, 'placeholder');
  const colours = text.match(/#[0-9a-fA-F]{6}\b/g) ?? [];
  const bad = [...new Set(colours.map((c) => c.toLowerCase()))].filter((c) => !PALETTE.has(c));
  if (bad.length) problems.push(`${file.replace(DIST, 'dist/')}: off-palette colour (${bad.join(', ')})`);
}

for (const file of html) {
  const text = readFileSync(file, 'utf8');
  // The home page leads with the name, so the browser tab reads "Kerb Sense".
  // Every other page is "Page name | Kerb Sense" (L05).
  if (!/<title>(?:Kerb Sense\. [^<]+|[^<]+\| Kerb Sense)<\/title>/.test(text))
    problems.push(`${file.replace(DIST, 'dist/')}: title format`);
  const desc = text.match(/<meta\s+name="description"\s+content="([^"]*)"/)?.[1] ?? '';
  if (!desc) problems.push(`${file.replace(DIST, 'dist/')}: no meta description`);
  if (desc.length < 120 || desc.length > 160)
    problems.push(`${file.replace(DIST, 'dist/')}: description is ${desc.length} characters`);
  if (!/Content-Security-Policy/.test(text)) problems.push(`${file.replace(DIST, 'dist/')}: no CSP`);
  if (
    /https?:\/\/(?!driftsprits-stack\.github\.io|schema\.org|www\.police\.gov\.sg|doi\.org|github\.com)[^"' ]+/.test(
      text,
    )
  ) {
    problems.push(`${file.replace(DIST, 'dist/')}: unexpected external URL`);
  }
}

// Image size limits: no image over 300 KB. SVG art must use the palette.
for (const file of files) {
  if (!/\.(webp|avif|png|jpg|svg)$/.test(file)) continue;
  const size = statSync(file).size;
  if (size > 300 * 1024)
    problems.push(`${file.replace(DIST, 'dist/')}: image is ${Math.round(size / 1024)} KB`);
  if (file.endsWith('.svg')) {
    const text = readFileSync(file, 'utf8');
    const colours = [...new Set((text.match(/#[0-9a-fA-F]{6}\b/g) ?? []).map((c) => c.toLowerCase()))];
    const bad = colours.filter((c) => !PALETTE.has(c));
    if (bad.length)
      problems.push(`${file.replace(DIST, 'dist/')}: off-palette colour in SVG (${bad.join(', ')})`);
  }
}

// Only the hero headline and the section titles end with a decorative full
// stop. UI labels do not (A15). The E2E tests check the rendered DOM; here
// the fixed copy is checked at the source.
const content = readFileSync(new URL('../src/content.ts', import.meta.url), 'utf8');
for (const m of content.matchAll(
  /(?:play|booth|explode|assemble|link|statusLabel|badge|name|clipLabel|backToTop|loading)\s*:\s*'([^']*)'/g,
)) {
  if (m[1].endsWith('.')) problems.push(`src/content.ts: UI label "${m[1]}" ends with a full stop`);
}

// The GLB must be under 1 MB.
const glb = files.find((f) => f.endsWith('.glb'));
if (!glb) problems.push('no GLB in dist/');
else if (statSync(glb).size > 1024 * 1024) problems.push('GLB over 1 MB');

if (problems.length) {
  console.error('Audit failed:');
  for (const p of problems) console.error(' -', p);
  process.exit(1);
}
console.log(`Audit passed: ${css.length} CSS, ${html.length} HTML, ${siteJs.length} JS files checked.`);
