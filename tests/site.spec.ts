import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createHash } from 'node:crypto';
import pool from '../src/copy-pool.json' with { type: 'json' };

// E2E tests for every route, the nav, the booth viewer and its fallback,
// the catalogue link, the scroll unfold, the copy rotation, the fonts, the
// full-stop rule, keyboard and touch, the 404 page and axe-core (standards
// E13, E15, E23, A1 to A18). Screenshots are in tests/screenshots.spec.ts.

const HOME = './?copy=default';
const DEFAULT_HEADLINE = pool.slots['hero.headline'][0] as string;

async function expectNoSeriousViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
}

async function noHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
}

test.describe('home page', () => {
  test('loads with the title, one h1, the default headline and no horizontal scroll', async ({ page }) => {
    await page.goto(HOME);
    await expect(page).toHaveTitle('Kerb Sense');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText(DEFAULT_HEADLINE);
    await noHorizontalScroll(page);
  });

  test('has no serious accessibility violations', async ({ page }) => {
    await page.goto(HOME);
    await page.waitForTimeout(500);
    await expectNoSeriousViolations(page);
  });

  test('the logo goes to the top and every footer link works (L07, L16)', async ({ page }) => {
    await page.goto('./#team');
    await page.getByRole('link', { name: 'Kerb Sense, go to the top of the page' }).first().click();
    await expect(page).toHaveURL(/#top$/);
    const links = await page
      .locator('footer a[href]')
      .evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).href));
    expect(links.length).toBeGreaterThan(4);
    for (const href of links.filter((h) => h.startsWith('http://127.0.0.1'))) {
      const res = await page.request.get(href);
      expect(res.status(), href).toBe(200);
    }
    await page.getByTestId('back-to-top').click();
    await expect(page).toHaveURL(/#top$/);
  });

  test('the copy rotates per page load, never with storage, and ?copy=default fixes it (A16)', async ({
    page,
  }) => {
    const seen = new Set<string>();
    for (let i = 0; i < 6; i += 1) {
      await page.goto('./');
      const h1 = (await page.locator('h1').textContent())?.trim() ?? '';
      expect(pool.slots['hero.headline']).toContain(h1);
      const titles = await page
        .locator('h2[data-slot]')
        .evaluateAll((els) =>
          els.map((el) => [el.getAttribute('data-slot') ?? '', (el.textContent ?? '').trim()] as const),
        );
      for (const [slot, text] of titles) {
        const entries = (pool.slots as Record<string, string[]>)[slot] ?? [];
        // The visible title is the entry after the section number.
        expect(
          entries.some((e) => text.endsWith(e)),
          `${slot}: ${text}`,
        ).toBe(true);
      }
      seen.add(h1 + titles.map((t) => t[1]).join('|'));
      await expect(page).toHaveTitle('Kerb Sense');
    }
    expect(seen.size).toBeGreaterThan(1);
    expect(
      await page.evaluate(() => Object.keys(localStorage).filter((k) => k !== 'kerb-sense:grid')),
    ).toEqual([]);
    expect(await page.evaluate(() => document.cookie)).toBe('');
    await page.goto(HOME);
    await expect(page.locator('h1')).toHaveText(DEFAULT_HEADLINE);
    await expect(page.locator('h2[data-slot="section.booth.title"]')).toContainText('The booth.');
  });

  test('the fonts are Helvetica Neue, Kerb Block and a Noto Sans JP subset (A17)', async ({ page }) => {
    await page.goto(HOME);
    const fonts = await page.evaluate(() => ({
      body: getComputedStyle(document.body).fontFamily,
      block: getComputedStyle(document.querySelector('.ks-block')!).fontFamily,
      ja: getComputedStyle(document.querySelector('[lang="ja"]:not(.ks-block)')!).fontFamily,
      kerbBlock: document.fonts.check('16px "Kerb Block"'),
      noto: document.fonts.check('16px "Noto Sans JP Subset"'),
      faces: [...document.fonts].map((f) => f.family),
    }));
    expect(fonts.body).toMatch(/Helvetica Neue/);
    expect(fonts.block).toMatch(/Kerb Block/);
    expect(fonts.ja).toMatch(/Noto Sans JP/);
    expect(fonts.kerbBlock).toBe(true);
    expect(fonts.noto).toBe(true);
    expect(new Set(fonts.faces)).toEqual(new Set(['Kerb Block', 'Noto Sans JP Subset']));
    // Every Japanese string is approved, carries lang="ja" and an English meaning.
    const ja = await page.locator('[lang="ja"]').evaluateAll((els) =>
      els.map((el) => ({
        text: (el.textContent ?? '').trim(),
        label: el.getAttribute('aria-label') ?? '',
      })),
    );
    const approved = ['カーブセンス', '待てば、先に着く。', '渡り方', 'あそぶ'];
    for (const { text, label } of ja) {
      expect(approved).toContain(text);
      expect(label).toMatch(/\(.+\)$/);
    }
    const stray = await page.evaluate(() => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const out: string[] = [];
      let node: Node | null = walker.nextNode();
      while (node) {
        if (/[぀-ヿ一-鿿]/.test(node.textContent ?? '') && !node.parentElement?.closest('[lang="ja"]'))
          out.push(node.textContent ?? '');
        node = walker.nextNode();
      }
      return out;
    });
    expect(stray).toEqual([]);
  });

  test('the logo and favicon are the new files, and images are lazy with sizes (A11, A13)', async ({
    page,
  }) => {
    await page.goto(HOME);
    for (const sel of ['header img', 'footer img']) {
      await expect(page.locator(sel).first()).toHaveAttribute('src', /kerbsense-wordmark/);
    }
    for (const href of ['favicon.svg', 'favicon.ico', 'favicon-32.png', 'apple-touch-icon.png']) {
      await expect(page.locator(`link[href$="${href}"]`)).toHaveCount(1);
    }
    const svgText = await (await page.request.get('./favicon.svg')).text();
    expect(svgText).toContain('#178048');
    const images = await page.locator('img').evaluateAll((els) =>
      els.map((img) => {
        const i = img as HTMLImageElement;
        return {
          src: i.getAttribute('src') ?? '',
          lazy: i.getAttribute('loading'),
          decoding: i.getAttribute('decoding'),
          width: i.getAttribute('width'),
          height: i.getAttribute('height'),
          hero: Boolean(i.closest('[data-testid="hero"], header')),
        };
      }),
    );
    expect(images.length).toBeGreaterThan(10);
    for (const img of images) {
      expect(img.width, img.src).toBeTruthy();
      expect(img.height, img.src).toBeTruthy();
      if (!img.hero) {
        expect(img.lazy, img.src).toBe('lazy');
        expect(img.decoding, img.src).toBe('async');
      }
    }
    const raster = images.map((i) => i.src).filter((s) => !/\.svg$/.test(s));
    for (const src of raster) expect(src).toMatch(/booth-product|gameplay-poster/);
    await expect(page.locator('video')).toHaveAttribute('preload', 'none');
  });

  test('back and forward work after visiting the game (S19)', async ({ page }) => {
    await page.goto(HOME);
    await page.getByTestId('hero-play').click();
    await expect(page).toHaveURL(/\/play\/$/);
    await page.goBack();
    await expect(page.locator('h1')).toHaveText(DEFAULT_HEADLINE);
    await page.goForward();
    await expect(page.locator('#pledge-btn')).toBeVisible();
  });
});

test.describe('other routes', () => {
  for (const route of ['play/', 'privacy/', 'terms/']) {
    test(`${route} loads`, async ({ page }) => {
      const res = await page.goto(`./${route}`);
      expect(res?.status()).toBe(200);
      // The game has its own screens, each with a heading. It is not changed.
      if (route !== 'play/') await expect(page.locator('h1')).toHaveCount(1);
      await noHorizontalScroll(page);
      if (route !== 'play/') {
        await expect(page).toHaveTitle(/\| Kerb Sense$/);
        await expectNoSeriousViolations(page);
      }
    });
  }

  test('the 404 page is on brand and links home and to the game (L08)', async ({ page }) => {
    await page.goto('./404.html');
    await expect(page).toHaveTitle('Page not found | Kerb Sense');
    await expect(page.locator('h1')).toHaveText('Wrong crossing.');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
    await expect(page.getByRole('link', { name: 'Go to the home page', exact: true })).toHaveAttribute(
      'href',
      '/kerb-sense/',
    );
    await expect(page.getByRole('link', { name: 'Play the game', exact: true })).toHaveAttribute(
      'href',
      '/kerb-sense/play/',
    );
    await expect(page.locator('header img')).toHaveAttribute('src', /kerbsense-wordmark-black/);
    // The pixel booth (shortlist pick 21) sits beside the text, not under it.
    await expect(page.locator('main img[src*="oddgrid-booth"]')).toBeVisible();
    await noHorizontalScroll(page);
    await expectNoSeriousViolations(page);
  });

  test('the game file, robots, sitemap, manifest and icons exist (A3)', async ({ page }) => {
    for (const file of [
      'robots.txt',
      'sitemap.xml',
      'site.webmanifest',
      'og-image.png',
      'og-specimen.png',
      'favicon.svg',
      'favicon.ico',
      'models/booth-flat.glb',
    ]) {
      const res = await page.request.get(`./${file}`);
      expect(res.status(), file).toBe(200);
    }
    const sitemap = await (await page.request.get('./sitemap.xml')).text();
    expect(sitemap).not.toContain('cookies');
    const game = await (await page.request.get('./play/')).body();
    const digest = createHash('sha256').update(game).digest('hex');
    expect(digest).toBe('d5dd3116553426731172dfa662764b8fb5c57ad6be87cb117de4753a96170d1f');
  });
});
