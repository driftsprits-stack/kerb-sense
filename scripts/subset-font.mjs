// Subsets Noto Sans JP to the approved Japanese strings in CONTENT.md.
// Kerb Block carries the katakana, so only the tagline, the running-order
// label and "play" need Noto Sans JP. Needs fonttools (pip install
// fonttools brotli).
// Run: npm run assets
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const TEXT = '待てば、先に着く。渡り方あそぶ';
const src = new URL(
  '../node_modules/@fontsource/noto-sans-jp/files/noto-sans-jp-japanese-700-normal.woff2',
  import.meta.url,
).pathname;
const outDir = new URL('../src/assets/fonts/', import.meta.url).pathname;
mkdirSync(outDir, { recursive: true });
execFileSync('pyftsubset', [
  src,
  `--text=${TEXT}`,
  '--flavor=woff2',
  '--no-hinting',
  '--layout-features=*',
  `--output-file=${outDir}NotoSansJP-700-subset.woff2`,
]);
console.log('NotoSansJP-700-subset.woff2 written for:', TEXT);
