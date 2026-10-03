import { test, expect } from '@playwright/test';

// Full-page screenshots of every route at 375, 768, 1024 and 1440 px, with
// reduced motion and the default copy (standards E13). They are attached to
// the Playwright report. The review images in docs/screenshots/ are made by
// scripts/screenshots.mjs, which also captures the scroll scenes.
const ROUTES: [string, string][] = [
  ['home', './?copy=default'],
  ['play', './play/'],
  ['privacy', './privacy/'],
  ['terms', './terms/'],
  ['not-found', './404.html'],
];

test.use({ reducedMotion: 'reduce' });

for (const [name, route] of ROUTES) {
  test(`screenshot ${name}`, async ({ page }, testInfo) => {
    await page.goto(route, { waitUntil: 'networkidle' });
    const height = await page.evaluate(() => document.body.scrollHeight);
    const step = page.viewportSize()?.height ?? 800;
    for (let y = 0; y < height; y += step) {
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await page.waitForTimeout(100);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    const file = testInfo.outputPath(`${name}-${testInfo.project.name}.png`);
    await page.screenshot({ path: file, fullPage: name !== 'play' });
    await expect(page.locator('body')).toBeVisible();
    await testInfo.attach(`${name}-${testInfo.project.name}`, { path: file, contentType: 'image/png' });
  });
}
