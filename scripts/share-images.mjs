// The two share images (1200 x 630 PNG), after the website shortlist:
//   - public/og-image.png, pick 18 (Kiosk): a typographic poster. The Kerb
//     Block title is real text and is never covered; a limited stripe field
//     (the Optic crossing, pick 20) carries the booth.
//   - public/og-specimen.png, pick 25 (Specimen): a ruled grid of the booth
//     diagram, the logo and the graphic modules, for the other pages.
// Run `npm run art` (it runs scripts/art.mjs first). Uses the preinstalled
// Chromium when PW_CHROMIUM_PATH is set.
import { chromium } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { optic, TOKENS } from './art.mjs';

const ROOT = new URL('../', import.meta.url).pathname;
const asset = async (path) => readFile(`${ROOT}${path}`, 'utf8');
const dataUrl = (svg) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
const font = (await readFile(`${ROOT}src/assets/fonts/KerbBlock-Regular.woff2`)).toString('base64');

const BASE_CSS = `
@font-face { font-family: 'Kerb Block'; src: url(data:font/woff2;base64,${font}) format('woff2'); }
* { margin: 0; box-sizing: border-box; }
html, body { width: 1200px; height: 630px; overflow: hidden; }
body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
.kb { font-family: 'Kerb Block'; font-weight: 400; line-height: 0.9; }
`;

const booth = dataUrl(await asset('src/assets/v2/renders/booth-light-three-quarter.svg'));
const boothGreen = dataUrl(await asset('src/assets/v2/renders/booth-green-three-quarter.svg'));
const stripes = dataUrl(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 150" width="1200" height="150">${optic(1200, 150, 16, 150, 0.62, 'w1')}</svg>`,
);

const kiosk = `<!doctype html><html><head><style>${BASE_CSS}
body { background: #000000; color: #FFFFFF; position: relative; }
.title { position: absolute; left: 56px; top: 48px; font-size: 128px; letter-spacing: 0.02em; }
.line { position: absolute; left: 60px; top: 290px; width: 520px; font-size: 40px; font-weight: 700; line-height: 1.05; letter-spacing: -0.02em; }
.sub { position: absolute; left: 60px; top: 352px; width: 470px; font-size: 22px; line-height: 1.3; }
.play { position: absolute; left: 60px; top: 238px; background: #178048; padding: 10px 16px 8px; font-size: 26px; }
.kana { position: absolute; right: 36px; top: 210px; writing-mode: vertical-rl; font-size: 34px; color: #178048; letter-spacing: 0.1em; }
.band { position: absolute; left: 0; bottom: 0; width: 1200px; height: 150px; }
.booth { position: absolute; right: 110px; bottom: 166px; height: 300px; }
</style></head><body>
<p class="kb title">KERB SENSE</p>
<p class="kb play">PLAY FREE</p>
<p class="line">Wait, and you get there first.</p>
<p class="sub">A road-safety game and arcade booth for Singapore students.</p>
<img class="band" src="${stripes}" alt="">
<img class="booth" src="${booth}" alt="">
<p class="kb kana" lang="ja">カーブセンス</p>
</body></html>`;

const token = (name) =>
  `<svg viewBox="0 0 24 24" width="28" height="28"><path d="${TOKENS[name]}" fill="#000000" fill-rule="evenodd"/></svg>`;
const specimen = `<!doctype html><html><head><style>${BASE_CSS}
body { background: #F2EFE8; padding: 32px; }
.grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; grid-template-rows: 1fr 1fr; width: 1136px; height: 566px; border: 3px solid #000000; }
.cell { border: 1px solid #000000; overflow: hidden; position: relative; background: #FFFFFF; }
.logo { grid-column: 1 / 3; padding: 28px; background: #F2EFE8; }
.logo img { height: 52px; }
.logo p { margin-top: 18px; font-size: 26px; font-weight: 700; letter-spacing: -0.02em; }
.boothcell { grid-row: 1 / 3; grid-column: 3; display: flex; align-items: center; justify-content: center; }
.boothcell img { width: 86%; }
.fill img { width: 100%; height: 100%; object-fit: cover; display: block; }
.tokens { padding: 16px 18px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 12px; align-content: center; background: #F2EFE8; }
.tokens span { display: flex; align-items: center; gap: 8px; font-size: 13px; }
.tag { position: absolute; left: 12px; top: 12px; background: #000000; color: #FFFFFF; padding: 5px 8px 3px; font-size: 13px; }
.vee { display: flex; flex-direction: column; justify-content: center; gap: 22px; padding: 22px; background: #F2EFE8; }
.vee img { width: 100%; }
</style></head><body><div class="grid">
<div class="cell logo"><img src="${dataUrl(await asset('src/assets/logo/kerbsense-wordmark-black.svg'))}" alt=""><p>Wait, and you get there first.</p></div>
<div class="cell boothcell"><img src="${boothGreen}" alt=""><span class="kb tag">DESIGNED, TO BE BUILT</span></div>
<div class="cell fill"><img src="${dataUrl(await asset('src/assets/art/stipple-booth.svg'))}" alt=""></div>
<div class="cell fill"><img src="${dataUrl(await asset('src/assets/art/optic-crossing.svg'))}" alt=""></div>
<div class="cell tokens">${['problem', 'booth', 'cross', 'plan', 'safety', 'budget', 'team']
  .map((n) => `<span class="kb">${token(n)}${n.toUpperCase()}</span>`)
  .join('')}</div>
<div class="cell vee"><img src="${dataUrl(await asset('src/assets/art/vee-chevrons.svg'))}" alt=""><img src="${dataUrl(await asset('src/assets/art/cipher-patch.svg'))}" alt=""></div>
</div></body></html>`;

const exe = process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {};
const browser = await chromium.launch(exe);
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
for (const [html, out] of [
  [kiosk, 'public/og-image.png'],
  [specimen, 'public/og-specimen.png'],
]) {
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${ROOT}${out}`, type: 'png' });
  console.log(out);
}
await browser.close();
