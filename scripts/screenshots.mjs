// Writes the review screenshots to docs/screenshots/ at 375, 768 and 1440px.
// Run `npm run preview` first. Uses the preinstalled Chromium when
// PW_CHROMIUM_PATH is set.
// Full-page captures use reduced motion, so the booth shows its static
// renders: a live WebGL canvas breaks Chromium's full-page capture. The live
// viewer is captured on its own (booth-viewer and booth-exploded).
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdir, rm } from 'node:fs/promises';

const BASE = 'http://127.0.0.1:4173/kerb-sense/';
const OUT = new URL('../docs/screenshots/', import.meta.url).pathname;
const WIDTHS = [
  ['phone', 375, 812],
  ['tablet', 768, 1024],
  ['desktop', 1440, 900],
];
const ROUTES = [
  ['home', ''],
  ['play', 'play/'],
  ['privacy', 'privacy/'],
  ['terms', 'terms/'],
  ['cookies', 'cookies/'],
  ['404', '404.html'],
];

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

// WebP allows 16383 px per side. A long page is saved in numbered parts.
const MAX = 16000;
async function savePng(png, name) {
  const image = sharp(png);
  const { width = 0, height = 0 } = await image.metadata();
  if (height <= MAX) {
    await image.webp({ quality: 80 }).toFile(`${OUT}${name}.webp`);
    console.log(`${name}.webp`);
    return;
  }
  const parts = Math.ceil(height / MAX);
  for (let i = 0; i < parts; i += 1) {
    const top = i * MAX;
    await sharp(png)
      .extract({ left: 0, top, width, height: Math.min(MAX, height - top) })
      .webp({ quality: 80 })
      .toFile(`${OUT}${name}-part${i + 1}.webp`);
    console.log(`${name}-part${i + 1}.webp`);
  }
}

// Full pages need a plain browser: the software GL flags below break
// Chromium's full-page capture. The live viewer needs those flags on a
// machine without a GPU.
const GL = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'];
const exe = process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {};
const browser = await chromium.launch(exe);
const glBrowser = await chromium.launch({ ...exe, args: GL });

for (const [device, width, height] of WIDTHS) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  for (const [name, route] of ROUTES) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    const full = name !== 'play';
    if (full) {
      const total = await page.evaluate(() => document.body.scrollHeight);
      for (let y = 0; y < total; y += height) {
        await page.evaluate((top) => window.scrollTo(0, top), y);
        await page.waitForTimeout(120);
      }
      // Let the booth viewer and the counters settle.
      await page.waitForTimeout(name === 'home' ? 6000 : 500);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(400);
    }
    const png = await page.screenshot({ fullPage: full });
    await savePng(png, `${name}-${device}-${width}`);
  }
  await context.close();

  // The live booth viewer, the exploded booth and the grid overlay, with
  // motion allowed.
  if (device === 'desktop') {
    const live = await glBrowser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
    const page = await live.newPage();
    await page.goto(`${BASE}#booth`, { waitUntil: 'networkidle' });
    await page.locator('#booth').scrollIntoViewIfNeeded();
    await page.waitForSelector('[data-testid="booth-canvas"]', { timeout: 20000 }).catch(() => null);
    await page.waitForTimeout(3000);
    await page.locator('#booth').scrollIntoViewIfNeeded();
    await savePng(await page.screenshot(), 'booth-viewer-desktop-1440');
    await page.click('[data-testid="view-side"]').catch(() => null);
    await page.waitForTimeout(1500);
    await savePng(await page.locator('[data-testid="booth-stage"]').screenshot(), 'booth-side-desktop-1440');
    await page.click('[data-testid="view-front"]').catch(() => null);
    await page.click('[data-testid="explode-toggle"]').catch(() => null);
    await page.waitForTimeout(1800);
    await savePng(
      await page.locator('[data-testid="booth-stage"]').screenshot(),
      'booth-exploded-desktop-1440',
    );
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await page.locator('body').press('g');
    await page.waitForTimeout(800);
    await savePng(await page.screenshot(), 'grid-desktop-1440');
    await live.close();
  }
}
await browser.close();
await glBrowser.close();
