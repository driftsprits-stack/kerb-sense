// Writes the review screenshots to docs/screenshots/ at 320, 375, 768, 1024
// and 1440 px, plus a short landscape phone. Run `npm run preview` first.
// Uses the preinstalled Chromium when PW_CHROMIUM_PATH is set.
//
// Full-page captures use reduced motion and the default copy, so the booth
// shows its static renders: a live WebGL canvas breaks Chromium's full-page
// capture. The live views (the hero, each booth tour block, a selected part
// and the crossing dial) are viewport shots with motion on and software WebGL.
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdir, rm } from 'node:fs/promises';

const BASE = process.env.SHOTS_BASE ?? 'http://127.0.0.1:4173/kerb-sense/';
const OUT = new URL('../docs/screenshots/', import.meta.url).pathname;
const WIDTHS = [
  ['small', 320, 640],
  ['phone', 375, 812],
  ['landscape', 812, 375],
  ['tablet', 768, 1024],
  ['laptop', 1024, 768],
  ['desktop', 1440, 900],
];
const ROUTES = [
  ['home', '?copy=default'],
  ['play', 'play/'],
  ['privacy', 'privacy/'],
  ['terms', 'terms/'],
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

const GL = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'];
const exe = process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {};
const browser = await chromium.launch(exe);
const glBrowser = await chromium.launch({ ...exe, args: GL });

async function settle(page, height, name) {
  const total = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < total; y += height) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(name === 'home' ? 2500 : 400);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
}

for (const [device, width, height] of WIDTHS) {
  // Full pages, reduced motion.
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  for (const [name, route] of ROUTES) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    const full = name !== 'play';
    if (full) await settle(page, height, name);
    const png = await page.screenshot({ fullPage: full });
    await savePng(png, `${name}-${device}-${width}`);
  }
  await context.close();

  // The live views, motion on, live WebGL.
  const live = await glBrowser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const scene = await live.newPage();
  await scene.goto(`${BASE}?copy=default`, { waitUntil: 'networkidle' });
  await scene.waitForTimeout(3000);
  const shot = async (tag) => savePng(await scene.screenshot(), `${tag}-${device}-${width}`);
  await shot('hero');
  const go = async (selector, offset) => {
    await scene.evaluate(
      ([sel, off]) => {
        const el = document.querySelector(sel);
        window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - off);
      },
      [selector, offset],
    );
    await scene.waitForTimeout(900);
  };
  for (const i of [0, 1, 2]) {
    await go(`[data-tour="${i}"]`, height * 0.45);
    await shot(`booth-tour-${i + 1}`);
  }
  // The end of the tour: the back view with the parts moved apart.
  await go('[data-testid="booth-tour"] [data-tour="2"]', height * 0.5 - 300);
  await shot('booth-tour-exploded');
  await go('[data-testid="parts-catalogue"]', 100);
  await scene.click('[data-testid="part-joystick"]').catch(() => null);
  await scene.waitForTimeout(800);
  await shot('booth-selected');
  await go('[data-testid="stepper"]', 100);
  await shot('cross-dial');
  await live.close();
}
await browser.close();
await glBrowser.close();
