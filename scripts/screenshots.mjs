// Writes the review screenshots to docs/screenshots/ at 375, 768, 1024 and
// 1440 px. Run `npm run preview` first. Uses the preinstalled Chromium when
// PW_CHROMIUM_PATH is set.
//
// Full-page captures use reduced motion and the default copy, so the booth
// shows its static renders: a live WebGL canvas breaks Chromium's full-page
// capture. The scroll scenes (the hero pin, "Our answer" and the booth
// scene) are captured as viewport shots at several scroll positions, with
// motion on and software WebGL.
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdir, rm } from 'node:fs/promises';

const BASE = 'http://127.0.0.1:4173/kerb-sense/';
const OUT = new URL('../docs/screenshots/', import.meta.url).pathname;
const WIDTHS = [
  ['phone', 375, 812],
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

  // The scroll scenes, motion on, live WebGL.
  const live = await glBrowser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const scene = await live.newPage();
  await scene.goto(`${BASE}?copy=default`, { waitUntil: 'networkidle' });
  await scene.waitForTimeout(3000);
  const shot = async (tag) => savePng(await scene.screenshot(), `${tag}-${device}-${width}`);
  const go = async (y) => {
    await scene.evaluate((top) => window.scrollTo(0, top), y);
    await scene.waitForTimeout(700);
  };
  await shot('hero');
  const heroSpan = (width < 768 ? 0.5 : 0.8) * height;
  await go(heroSpan * 0.5);
  await shot('hero-mid');
  const answerTop = await scene.evaluate(
    () => document.querySelector('#answer').getBoundingClientRect().top + window.scrollY,
  );
  await go(answerTop - height * 0.55);
  await shot('answer-mid');
  const { top, span } = await scene.evaluate(() => {
    const el = document.querySelector('[data-testid="booth-scene"]');
    const t = el.getBoundingClientRect().top + window.scrollY - 64;
    return { top: t, span: (window.innerWidth < 768 ? 1.5 : 2.2) * window.innerHeight };
  });
  for (const [tag, frac] of [
    ['booth-scene-start', 0.02],
    ['booth-scene-turn', 0.2],
    ['booth-scene-explode', 0.45],
    ['booth-scene-labels', 0.75],
    ['booth-scene-end', 1.05],
  ]) {
    await go(top + span * frac);
    await shot(tag);
  }
  // The interactive viewer after the scene: a selected part, then the grid.
  await scene.click('[data-testid="part-joystick"]').catch(() => null);
  await scene.waitForTimeout(800);
  await savePng(
    await scene.locator('[data-testid="booth-stage"]').screenshot(),
    `booth-selected-${device}-${width}`,
  );
  if (device === 'desktop') {
    await scene.evaluate(() => window.scrollTo(0, 0));
    await scene.locator('body').press('g');
    await scene.waitForTimeout(800);
    await shot('grid');
  }
  await live.close();
}
await browser.close();
await glBrowser.close();
