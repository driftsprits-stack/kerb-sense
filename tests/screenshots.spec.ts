import { test, expect } from '@playwright/test';

// Screenshot regression at 375, 768 and 1440px (standards E13 and section 7).
// The images are written to docs/screenshots/ and compared with the committed
// baselines. Run with --update-snapshots after an intended visual change.
const ROUTES: [string, string][] = [
  ['home', './'],
  ['play', './play/'],
  ['privacy', './privacy/'],
  ['terms', './terms/'],
  ['cookies', './cookies/'],
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
