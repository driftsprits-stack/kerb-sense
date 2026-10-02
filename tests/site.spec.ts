import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// E2E tests for every route, the embed, the viewer controls, the nav, the
// 404 page, the grid toggle, keyboard navigation and axe-core (standards
// E13, E23). Screenshots for the PR are made by tests/screenshots.spec.ts.

// Below 1024px the nav is the menu dialog.
const VIEWPORT_IS_PHONE = (page: Page) => (page.viewportSize()?.width ?? 1440) < 1024;

async function expectNoSeriousViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
}

test.describe('home page', () => {
  test('loads with the right title, one h1 and no horizontal scroll', async ({ page }) => {
    await page.goto('./');
    await expect(page).toHaveTitle(/\| Kerb Sense$/);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toContainText('Wait, and you get there first.');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('has no serious accessibility violations', async ({ page }) => {
    await page.goto('./');
    await page.waitForTimeout(500);
    await expectNoSeriousViolations(page);
  });

  test('nav links go to sections that exist', async ({ page }) => {
    await page.goto('./');
    const ids = ['problem', 'game', 'booth', 'programme', 'targets', 'safety', 'team', 'budget'];
    for (const id of ids) await expect(page.locator(`#${id}`)).toHaveCount(1);
    if (VIEWPORT_IS_PHONE(page)) {
      await page.getByTestId('menu-open').click();
      await expect(page.getByTestId('menu')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByTestId('menu')).toBeHidden();
      await page.getByTestId('menu-open').click();
      await page.getByTestId('menu').getByRole('link', { name: 'booth.' }).click();
    } else {
      await page
        .getByRole('navigation', { name: 'Main' })
        .getByRole('link', { name: 'booth', exact: true })
        .click();
    }
    await expect(page).toHaveURL(/#booth$/);
  });

  test('the logo goes to the top and every footer link works', async ({ page }) => {
    await page.goto('./#team');
    await page.getByRole('link', { name: 'Kerb Sense. Go to the top of the page.' }).first().click();
    await expect(page).toHaveURL(/#top$/);
    const links = await page
      .locator('footer a[href]')
      .evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).href));
    expect(links.length).toBeGreaterThan(5);
    for (const href of links.filter((h) => h.startsWith('http://127.0.0.1'))) {
      const res = await page.request.get(href);
      expect(res.status(), href).toBe(200);
    }
  });

  test('the grid toggle shows the overlay, the G key toggles it, and it is remembered', async ({ page }) => {
    await page.goto('./');
    if (VIEWPORT_IS_PHONE(page)) await page.getByTestId('menu-open').click();
    await page.getByTestId('grid-toggle').locator('visible=true').click();
    await expect(page.getByTestId('grid-overlay')).toBeVisible();
    if (VIEWPORT_IS_PHONE(page)) await page.getByTestId('menu-close').click();
    await page.locator('body').press('g');
    await expect(page.getByTestId('grid-overlay')).toHaveCount(0);
    await page.locator('body').press('g');
    await page.reload();
    await expect(page.getByTestId('grid-overlay')).toBeVisible();
  });

  test('the gameplay clip links to the game', async ({ page }) => {
    await page.goto('./');
    const link = page.getByTestId('clip-link');
    await expect(link).toHaveAttribute('href', /\/kerb-sense\/play\/$/);
    await link.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/kerb-sense\/play\/$/);
    await expect(page.locator('#pledge-btn')).toBeVisible();
  });

  test('the embed loads the game on demand and focus works inside it', async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 1440) < 640, 'Phones open the game in its own page.');
    await page.goto('./#game');
    await page.getByTestId('embed-load').click();
    const frame = page.frameLocator('[data-testid="game-frame"]');
    await expect(frame.locator('#pledge-btn')).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.activeElement?.tagName)).toBe('IFRAME');
    await frame.locator('#pledge-btn').click();
    await expect(frame.locator('#start-screen')).toBeVisible();
    await expect(page.getByTestId('embed-fullscreen')).toBeVisible();
    await expect(page.getByTestId('embed-new-page')).toHaveAttribute('href', /\/play\/$/);
  });

  test('the booth controls work, with the viewer or the fallback', async ({ page }) => {
    await page.goto('./#booth');
    await page.locator('#booth').scrollIntoViewIfNeeded();
    const stage = page.getByTestId('booth-stage');
    await expect(stage).toBeVisible();
    await page.getByTestId('view-side').click();
    await expect(page.getByTestId('view-side')).toHaveAttribute('data-state', 'on');
    await page.getByTestId('view-top').click();
    await expect(page.getByTestId('view-top')).toHaveAttribute('data-state', 'on');
    const hasCanvas = (await page.getByTestId('booth-canvas').count()) > 0;
    const hasFallback = (await page.getByTestId('booth-fallback').count()) > 0;
    expect(hasCanvas || hasFallback).toBe(true);
    if (hasCanvas) {
      await page.getByTestId('explode-toggle').click();
      await expect(page.getByTestId('explode-toggle')).toHaveAttribute('data-state', 'on');
      await expect(page.getByTestId('explode-toggle')).toHaveText('Assemble.');
    }
    await expect(page.getByTestId('parts-catalogue').locator('li')).toHaveCount(9);
    await expect(page.getByTestId('spec-table')).toContainText('61.7 cm');
  });

  test('the booth falls back to the renders when the model fails', async ({ page }) => {
    await page.route('**/models/booth-flat.glb', (route) => route.fulfill({ status: 500, body: 'no' }));
    await page.goto('./#booth');
    await page.locator('#booth').scrollIntoViewIfNeeded();
    const fallback = page.getByTestId('booth-fallback');
    await expect(fallback).toBeVisible({ timeout: 30000 });
    await expect(fallback.locator('figcaption')).toContainText(
      /did not load|Motion is reduced|cannot show 3D/,
    );
  });

  test('reduced motion shows the renders and the poster', async ({ browser }) => {
    const context = await browser.newContext({
      reducedMotion: 'reduce',
      viewport: { width: 1200, height: 800 },
    });
    const page = await context.newPage();
    await page.goto('./#booth');
    await page.locator('#booth').scrollIntoViewIfNeeded();
    await expect(page.getByTestId('booth-fallback')).toBeVisible();
    await expect(page.getByTestId('booth-fallback').locator('figcaption')).toContainText('Motion is reduced');
    await expect(page.getByTestId('clip-link').locator('img')).toHaveCount(1);
    await context.close();
  });

  test('the keyboard reaches the main controls in order', async ({ page }) => {
    test.skip(VIEWPORT_IS_PHONE(page), 'The phone menu is tested above.');
    await page.goto('./');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to the content.' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(
      page.getByRole('link', { name: 'Kerb Sense. Go to the top of the page.' }).first(),
    ).toBeFocused();
    // The eight section links come next, then the grid toggle.
    for (let i = 0; i < 12; i += 1) {
      await page.keyboard.press('Tab');
      if (await page.getByTestId('grid-toggle').evaluate((el) => el === document.activeElement)) break;
    }
    await expect(page.getByTestId('grid-toggle')).toBeFocused();
    await page.keyboard.press('Space');
    await expect(page.getByTestId('grid-overlay')).toBeVisible();
  });

  test('back and forward work after visiting the game', async ({ page }) => {
    await page.goto('./');
    await page.getByTestId('hero-play').click();
    await expect(page).toHaveURL(/\/play\/$/);
    await page.goBack();
    await expect(page.locator('h1')).toContainText('Wait, and you get there first.');
    await page.goForward();
    await expect(page.locator('#pledge-btn')).toBeVisible();
  });
});

test.describe('other routes', () => {
  for (const route of ['play/', 'privacy/', 'terms/', 'cookies/']) {
    test(`${route} loads`, async ({ page }) => {
      const res = await page.goto(`./${route}`);
      expect(res?.status()).toBe(200);
      // The game has its own screens, each with a heading. It is not changed.
      if (route !== 'play/') await expect(page.locator('h1')).toHaveCount(1);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
      if (route !== 'play/') {
        await expect(page).toHaveTitle(/\| Kerb Sense$/);
        await expectNoSeriousViolations(page);
      }
    });
  }

  test('the 404 page is on brand and links home and to the game', async ({ page }) => {
    await page.goto('./404.html');
    await expect(page).toHaveTitle('Page not found | Kerb Sense');
    await expect(page.locator('h1')).toHaveText('Wrong crossing.');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
    await expect(page.getByRole('link', { name: 'Go to the home page.', exact: true })).toHaveAttribute(
      'href',
      '/kerb-sense/',
    );
    await expect(page.getByRole('link', { name: 'Play the game.', exact: true })).toHaveAttribute(
      'href',
      '/kerb-sense/play/',
    );
    await expectNoSeriousViolations(page);
  });

  test('robots, sitemap and manifest exist', async ({ page }) => {
    for (const file of ['robots.txt', 'sitemap.xml', 'site.webmanifest', 'og-image.png', 'favicon.svg']) {
      const res = await page.request.get(`./${file}`);
      expect(res.status(), file).toBe(200);
    }
  });
});
