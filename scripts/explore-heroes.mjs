// Renders the hero layout explorations (website shortlist pick 26) at 375
// and 1440 px into docs/explorations/hero-variants/. A is the live site's
// hero (run `npm run preview` first, or set SHOTS_BASE); B and C are the
// static mockups in that folder. Uses PW_CHROMIUM_PATH when set.
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const DIR = new URL('../docs/explorations/hero-variants/', import.meta.url).pathname;
const BASE = process.env.SHOTS_BASE ?? 'http://127.0.0.1:4173/kerb-sense/';
const exe = process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {};
const browser = await chromium.launch(exe);
const variants = [
  ['a-poster', `${BASE}?copy=default`],
  ['b-catalogue', `file://${DIR}b-catalogue.html`],
  ['c-guide', `file://${DIR}c-guide.html`],
];
for (const [w, h] of [
  [375, 812],
  [1440, 900],
]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
  for (const [name, url] of variants) {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);
    await sharp(await page.screenshot())
      .webp({ quality: 82 })
      .toFile(`${DIR}${name}-${w}.webp`);
    console.log(`${name}-${w}.webp`);
  }
  await page.close();
}
await browser.close();
