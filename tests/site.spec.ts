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

const width = (page: Page) => page.viewportSize()?.width ?? 1440;

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

async function scrollTo(page: Page, y: number) {
  await page.evaluate((top) => window.scrollTo(0, top), y);
  await page.waitForTimeout(400);
}

/** Scrolls past the booth scene, so the viewer is interactive. Returns that scroll offset. */
async function openBoothViewer(page: Page): Promise<number> {
  await page.goto('./#booth');
  await page.waitForTimeout(1200);
  const { top, span } = await sceneRange(page);
  const pinned = (await page.locator('.pin-spacer').count()) > 0;
  const end = pinned ? top + span + 10 : top;
  await scrollTo(page, end);
  await page.waitForTimeout(400);
  return end;
}

/** The page offset of the booth scene and the length of its pin. */
async function sceneRange(page: Page) {
  return page.evaluate(() => {
    const scene = document.querySelector('[data-testid="booth-scene"]') as HTMLElement;
    const top = scene.getBoundingClientRect().top + window.scrollY - 64;
    const span = (window.innerWidth < 768 ? 1.5 : 2.2) * window.innerHeight;
    return { top, span };
  });
}

test.describe('home page', () => {
  test('loads with the title, one h1, the default headline and no horizontal scroll', async ({ page }) => {
    await page.goto(HOME);
    await expect(page).toHaveTitle('Kerb Sense. Wait, and you get there first.');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText(DEFAULT_HEADLINE);
    await noHorizontalScroll(page);
  });

  test('the first screen shows the booth, the one-liner and Play without scrolling (A1, A6, A18)', async ({
    page,
  }) => {
    await page.goto(HOME);
    const h = page.viewportSize()?.height ?? 900;
    for (const id of ['hero-booth', 'hero-play']) {
      const box = await page.getByTestId(id).boundingBox();
      expect(box, id).not.toBeNull();
      expect(box!.y + box!.height, `${id} bottom`).toBeLessThanOrEqual(h);
    }
    const oneLiner = page
      .getByTestId('hero')
      .getByText('A free browser game and six-month schools programme', {
        exact: false,
      });
    const box = await oneLiner.boundingBox();
    expect(box!.y + box!.height).toBeLessThanOrEqual(h);
    // The poster parts: the Kerb Block title, the LED texture and the katakana.
    await expect(page.locator('[data-hero="title"]')).toHaveText(/KERB\s*SENSE/);
    await expect(page.locator('[data-hero="led"]')).toHaveCount(1);
    await expect(page.locator('[lang="ja"]').first()).toBeVisible();
  });

  test('has no serious accessibility violations', async ({ page }) => {
    await page.goto(HOME);
    await page.waitForTimeout(500);
    await expectNoSeriousViolations(page);
  });

  test('the sections follow the reading order with the index or the current name (A12)', async ({ page }) => {
    await page.goto(HOME);
    const order = ['problem', 'answer', 'booth', 'game', 'plan', 'measure', 'safety', 'team', 'budget'];
    const ids = await page.locator('main section[id]').evaluateAll((els) => els.map((el) => el.id));
    expect(ids.filter((id) => order.includes(id))).toEqual(order);
    for (const id of order) await expect(page.getByTestId(`next-${id}`)).toHaveCount(1);
    if (width(page) >= 1280) {
      await expect(page.getByTestId('section-index')).toBeVisible();
      const y = await page.evaluate(
        () => document.querySelector('#game')!.getBoundingClientRect().top + window.scrollY + 10,
      );
      await scrollTo(page, y);
      await expect(page.getByTestId('section-index').locator('[aria-current="location"]')).toHaveText(
        /The game/,
      );
    } else {
      await scrollTo(page, (await sceneRange(page)).top - 200);
      await expect(page.getByTestId('current-section')).toHaveText('The booth');
    }
  });

  test('the menu opens, traps focus, closes on Escape and goes to a section (L03)', async ({ page }) => {
    await page.goto(HOME);
    const open = page.getByTestId('menu-open');
    await expect(open).toHaveAttribute('aria-expanded', 'false');
    await open.click();
    await expect(page.getByTestId('menu')).toBeVisible();
    await expect(open).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('menu')).toBeHidden();
    await open.click();
    await page.getByTestId('menu').getByRole('link', { name: 'The booth' }).click();
    await expect(page).toHaveURL(/#booth$/);
    await expect(page.getByTestId('menu')).toBeHidden();
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

  test('the grid toggle shows the overlay, the G key toggles it, and it is remembered', async ({ page }) => {
    await page.goto(HOME);
    if (width(page) < 768) await page.getByTestId('menu-open').click();
    await page.getByTestId('grid-toggle').locator('visible=true').click();
    await expect(page.getByTestId('grid-overlay')).toBeVisible();
    if (width(page) < 768) await page.getByTestId('menu-close').click();
    await page.locator('body').press('g');
    await expect(page.getByTestId('grid-overlay')).toHaveCount(0);
    await page.locator('body').press('g');
    await page.reload();
    await expect(page.getByTestId('grid-overlay')).toBeVisible();
  });

  test('the gameplay clip links to the game and there is no iframe (L27)', async ({ page }) => {
    await page.goto(HOME);
    await expect(page.locator('iframe')).toHaveCount(0);
    const link = page.getByTestId('clip-link');
    await expect(link).toHaveAttribute('href', /\/kerb-sense\/play\/$/);
    await expect(page.getByTestId('running-order')).toContainText('WAIT [KERB]:');
    await link.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/kerb-sense\/play\/$/);
    await expect(page.locator('#pledge-btn')).toBeVisible();
  });

  test('the booth controls work, with the viewer or the fallback (A5, L11)', async ({ page }) => {
    await openBoothViewer(page);
    const stage = page.getByTestId('booth-stage');
    await expect(stage).toBeVisible();
    // After the scene the booth is on the side view. Touch, then the keyboard.
    const front = page.getByTestId('view-front');
    if (await page.evaluate(() => 'ontouchstart' in window)) await front.tap();
    else await front.click();
    await expect(front).toHaveAttribute('data-state', 'on');
    await page.getByTestId('view-top').focus();
    await page.keyboard.press('Space');
    await expect(page.getByTestId('view-top')).toHaveAttribute('data-state', 'on');
    await expect
      .poll(
        async () =>
          (await page.getByTestId('booth-canvas').count()) +
          (await page.getByTestId('booth-fallback').count()),
        { timeout: 30000 },
      )
      .toBeGreaterThan(0);
    const hasCanvas = (await page.getByTestId('booth-canvas').count()) > 0;
    if (hasCanvas) {
      // The scene leaves the booth exploded. "Assemble" puts it back.
      const toggle = page.getByTestId('explode-toggle');
      const was = await toggle.getAttribute('data-state');
      await toggle.click();
      await expect(toggle).toHaveAttribute('data-state', was === 'on' ? 'off' : 'on');
      await expect(toggle).toHaveText(was === 'on' ? 'Explode' : 'Assemble');
    }
    await expect(page.getByTestId('parts-catalogue').locator('li')).toHaveCount(9);
    await expect(page.getByTestId('spec-table')).toContainText('61.7 cm');
  });

  test('the catalogue and the model select the same part (A7)', async ({ page }) => {
    const end = await openBoothViewer(page);
    const joystick = page.getByTestId('part-joystick');
    await joystick.scrollIntoViewIfNeeded();
    await joystick.click();
    await expect(joystick).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByTestId('part-readout')).toContainText('Joystick');
    await expect(page.getByTestId('part-readout')).toContainText('Moves the player');
    await page.getByTestId('part-screen').click();
    await expect(page.getByTestId('part-joystick')).toHaveAttribute('aria-pressed', 'false');
    await expect(page.getByTestId('part-screen')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByTestId('part-readout')).toContainText('Screen glass');
    // The reverse: a click on the model's screen selects the catalogue cell.
    await page.getByTestId('part-screen').click();
    await expect(page.getByTestId('part-screen')).toHaveAttribute('aria-pressed', 'false');
    const canvas = page.getByTestId('booth-stage').getByTestId('booth-canvas');
    if ((await canvas.count()) > 0) {
      // Back past the scene end, so the scene does not drive the booth.
      await scrollTo(page, end);
      await page.getByTestId('view-front').click();
      const toggle = page.getByTestId('explode-toggle');
      if ((await toggle.getAttribute('data-state')) === 'on') await toggle.click();
      await page.waitForTimeout(1500);
      const box = (await canvas.boundingBox())!;
      // The screen glass fills the middle of the stage in the front view.
      await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.55);
      await expect(page.getByTestId('part-readout')).toContainText('Screen glass');
      await expect(page.getByTestId('part-screen')).toHaveAttribute('aria-pressed', 'true');
    }
  });

  test('the booth falls back to the renders when the model fails (A4, E15)', async ({ page }) => {
    await page.route('**/models/booth-flat.glb', (route) => route.fulfill({ status: 500, body: 'no' }));
    await openBoothViewer(page);
    const fallback = page.getByTestId('booth-fallback');
    await expect(fallback).toBeVisible({ timeout: 40000 });
    await expect(fallback.locator('figcaption')).toContainText(
      /did not load|Motion is reduced|cannot show 3D/,
    );
    await page.getByTestId('view-front').click();
    await expect(fallback.locator('img')).toHaveAttribute('src', /booth-light-front/);
    await expect(fallback).toContainText('Joystick: Moves the player, with a built-in button');
    await page.getByTestId('view-back').click();
    await expect(fallback.locator('img')).toHaveAttribute('src', /booth-light-back/);
  });

  test('reduced motion shows the final state of every scene (A4, A14)', async ({ browser }) => {
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
    await expect(page.locator('.pin-spacer')).toHaveCount(0);
    for (const id of ['answer-game', 'answer-booth', 'answer-programme']) {
      await page.getByTestId(id).scrollIntoViewIfNeeded();
      await expect(page.getByTestId(id)).toBeInViewport();
    }
    const labels = page.getByTestId('scene-labels').locator('li');
    await expect(labels).toHaveCount(5);
    await labels.first().scrollIntoViewIfNeeded();
    for (let i = 0; i < 5; i += 1) await expect(labels.nth(i)).toBeInViewport();
    await context.close();
  });

  test('the scroll unfold is scrubbed to the scroll, reverses and keeps native scrolling (A14)', async ({
    page,
  }) => {
    await page.goto(HOME);
    await page.waitForTimeout(1200);
    // The hero and the booth scene are pinned.
    await expect(page.locator('.pin-spacer')).toHaveCount(2);
    const { top, span } = await sceneRange(page);
    const labelTransform = () =>
      page.locator('[data-scene-label="joystick"]').evaluate((el) => getComputedStyle(el).transform);
    await scrollTo(page, top + span * 0.2);
    const early = await labelTransform();
    await scrollTo(page, top + span * 0.6);
    const mid = await labelTransform();
    expect(mid).not.toEqual(early);
    expect(await page.evaluate(() => window.scrollY)).toBeCloseTo(top + span * 0.6, -1);
    await scrollTo(page, top + span * 1.1);
    const end = await labelTransform();
    expect(end === 'none' || end === 'matrix(1, 0, 0, 1, 0, 0)').toBe(true);
    // Scrolling back reverses the scene exactly.
    await scrollTo(page, top + span * 0.6);
    expect(await labelTransform()).toEqual(mid);
    await scrollTo(page, top + span * 0.2);
    expect(await labelTransform()).toEqual(early);
    // The booth stage stays in view while the scene is pinned.
    const stage = await page.getByTestId('booth-stage').boundingBox();
    expect(stage!.y).toBeGreaterThanOrEqual(0);
    expect(stage!.y + stage!.height).toBeLessThanOrEqual((page.viewportSize()?.height ?? 900) + 1);
  });

  test('only the headline and the section titles end with a full stop (A15)', async ({ page }) => {
    await page.goto(HOME);
    await expect(page.locator('h1')).toHaveText(/\.$/);
    const titles = await page.locator('h2[data-slot]').allTextContents();
    expect(titles.length).toBe(9);
    for (const t of titles) expect(t.trim()).toMatch(/\.$/);
    const labels = await page
      .locator(
        'button, nav a, [role="tab"], th, .ks-label, [data-testid^="part-"], [data-testid^="next-"], figcaption, [data-testid="hero-play"], [data-testid="sticky-play"] a',
      )
      .evaluateAll((els) => els.map((el) => (el.textContent ?? '').trim()).filter(Boolean));
    expect(labels.length).toBeGreaterThan(20);
    expect(labels.filter((t) => t.endsWith('.'))).toEqual([]);
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
      await expect(page).toHaveTitle('Kerb Sense. Wait, and you get there first.');
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

  test('the status words are correct and nothing claims a result (A2, A8)', async ({ page }) => {
    await page.goto(HOME);
    const text = (await page.locator('main').textContent()) ?? '';
    expect(text).toContain('Designed, to be built');
    expect(text).toContain('Requested');
    expect(text).toContain('Planned');
    expect(text).toContain('Live now');
    expect(text.match(/Target/g)?.length ?? 0).toBeGreaterThanOrEqual(6);
    expect(text).toContain('Source: Singapore Police Force');
    expect(text).not.toMatch(/booth (?:is|was|has been) built/i);
    expect(text).not.toMatch(/grant (?:is|was|has been) awarded/i);
    expect(text).not.toMatch(/schools? (?:are|is|has been|have been) confirmed/i);
    expect(text).not.toMatch(/reduced phone use/i);
  });

  test('the keyboard reaches the main controls in order (A5)', async ({ page }) => {
    await page.goto(HOME);
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to the content' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(
      page.getByRole('link', { name: 'Kerb Sense, go to the top of the page' }).first(),
    ).toBeFocused();
    const target = width(page) >= 768 ? 'grid-toggle' : 'menu-open';
    for (let i = 0; i < 4; i += 1) {
      await page.keyboard.press('Tab');
      if (await page.getByTestId(target).evaluate((el) => el === document.activeElement)) break;
    }
    await expect(page.getByTestId(target)).toBeFocused();
    await page.keyboard.press('Space');
    if (target === 'grid-toggle') await expect(page.getByTestId('grid-overlay')).toBeVisible();
    else await expect(page.getByTestId('menu')).toBeVisible();
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
    await expect(page.locator('header img')).toHaveAttribute('src', /kerbsense-wordmark-on-green/);
    await noHorizontalScroll(page);
    await expectNoSeriousViolations(page);
  });

  test('the game file, robots, sitemap, manifest and icons exist (A3)', async ({ page }) => {
    for (const file of [
      'robots.txt',
      'sitemap.xml',
      'site.webmanifest',
      'og-image.png',
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
