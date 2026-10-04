// Checks for the minimal redesign (owner review, October 2026): the first
// screen, one navigation per screen size, the booth tour and its manual
// controls, the part detail, the crossing dial, the problem layout, the
// target numbers, the page length and the text rules.
import { test, expect, type Page } from '@playwright/test';

const HOME = './?copy=default';
const wide = (page: Page) => (page.viewportSize()?.width ?? 1440) >= 1280;
const tourOn = (page: Page) => {
  const v = page.viewportSize();
  return (v?.width ?? 0) >= 1024 && (v?.height ?? 0) >= 700;
};

/** Scrolls so the booth tour is at progress p (0 to 1; above 1 is past the end). */
async function scrollToTourProgress(page: Page, p: number) {
  await page.evaluate((progress) => {
    const list = document.querySelector('[data-testid="booth-tour"]') as HTMLElement;
    const last = list.querySelector('[data-tour="2"]') as HTMLElement;
    const mid = window.innerHeight / 2;
    const start = list.getBoundingClientRect().top + window.scrollY - mid;
    const end = last.getBoundingClientRect().bottom + window.scrollY - mid;
    window.scrollTo(0, start + (end - start) * progress);
  }, p);
  await page.waitForTimeout(600);
}

async function scrollToSelector(page: Page, selector: string, offset = 0) {
  await page.evaluate(
    ([sel, off]) => {
      const el = document.querySelector(sel as string) as HTMLElement;
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - (off as number));
    },
    [selector, offset] as const,
  );
  await page.waitForTimeout(500);
}

test.describe('redesign', () => {
  test('the first screen shows the headline, the booth and PLAY without scrolling (A1, A6)', async ({
    page,
  }) => {
    await page.goto(HOME);
    const vh = page.viewportSize()?.height ?? 900;
    for (const id of ['hero-play', 'hero-body']) {
      const box = await page.getByTestId(id).boundingBox();
      expect(box, id).not.toBeNull();
      expect((box?.y ?? 0) + (box?.height ?? 0), id).toBeLessThanOrEqual(vh);
    }
    const booth = await page.locator('[data-testid="hero-booth"] img').last().boundingBox();
    expect((booth?.y ?? vh) + 40).toBeLessThanOrEqual(vh);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page).toHaveTitle('Kerb Sense');
  });

  test('the hero is an Ahoy thumbnail: text on one solid green panel, drifting bars, the side silhouette', async ({
    page,
  }) => {
    await page.goto(HOME);
    const panel = page.locator('[data-hero="copy"]');
    await expect(panel).toHaveCSS('background-color', 'rgb(23, 128, 72)');
    // The katakana sits inside the panel, not off its edge.
    if ((page.viewportSize()?.width ?? 0) >= 768) {
      const [kana, box] = await Promise.all([
        panel.locator('[lang="ja"]').boundingBox(),
        panel.boundingBox(),
      ]);
      expect((kana?.x ?? 0) + (kana?.width ?? 0)).toBeLessThanOrEqual((box?.x ?? 0) + (box?.width ?? 0));
    }
    const [bars, hero] = await Promise.all([
      page.locator('[data-hero="stripes"]').boundingBox(),
      page.getByTestId('hero').boundingBox(),
    ]);
    expect(bars?.width ?? 0).toBeGreaterThanOrEqual(hero?.width ?? 0);
    await expect(page.locator('[data-hero="stripes"]')).toHaveCSS('animation-name', 'ks-zebra-drift');
    await expect(page.locator('[data-hero="booth"]')).toHaveAttribute('src', /booth-silhouette-side/);
    // The panel is above the silhouette, so the headline is never covered.
    await expect(panel).toHaveCSS('z-index', '10');
  });

  test('there is one navigation per screen size (rail from 1280 px, menu below)', async ({ page }) => {
    await page.goto(HOME);
    const menu = page.getByRole('button', { name: /menu/i });
    if (wide(page)) {
      await expect(page.getByTestId('rail')).toBeVisible();
      await expect(menu).toBeHidden();
    } else {
      await expect(page.getByTestId('rail')).toBeHidden();
      await menu.click();
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
      await expect(menu).toBeFocused();
    }
  });

  test('the removed parts are gone: grid toggle, underlined links, rules, step list, safety line', async ({
    page,
  }) => {
    await page.goto(HOME);
    await expect(page.getByText(/show the grid/i)).toHaveCount(0);
    await expect(page.getByText('Stop somewhere safe before you play.')).toHaveCount(0);
    for (const id of ['grid-toggle', 'rules', 'step-list', 'step-next', 'step-back']) {
      await expect(page.getByTestId(id)).toHaveCount(0);
    }
    const underlined = await page.evaluate(
      () =>
        [...document.querySelectorAll('main a')].filter((a) =>
          getComputedStyle(a).textDecorationLine.includes('underline'),
        ).length,
    );
    expect(underlined).toBe(0);
  });

  test('a button or link never mixes two fonts', async ({ page }) => {
    await page.goto(HOME);
    const mixed = await page.evaluate(() =>
      [...document.querySelectorAll('main a, main button, header a, header button')]
        .map((el) => {
          const fonts = new Set<string>();
          const walk = (n: Node) => {
            if (n.nodeType === 3 && n.textContent?.trim())
              fonts.add(getComputedStyle(n.parentElement as Element).fontFamily);
            n.childNodes.forEach(walk);
          };
          walk(el);
          return fonts.size > 1 ? (el.textContent ?? '').trim() : null;
        })
        .filter(Boolean),
    );
    expect(mixed).toEqual([]);
  });

  test('the view buttons turn the booth and show which view is on (A5, L11)', async ({ page }) => {
    await page.goto(HOME);
    await scrollToSelector(page, '[data-testid="booth-scene"]', 100);
    await page.waitForTimeout(1500);
    const back = page.getByTestId('view-back');
    await back.click();
    await expect(back).toHaveAttribute('aria-pressed', 'true');
    if ((await page.getByTestId('booth-canvas').count()) > 0) {
      await expect
        .poll(
          async () => Math.abs(Number(await page.getByTestId('booth-stage').getAttribute('data-azimuth'))),
          {
            timeout: 4000,
          },
        )
        .toBeGreaterThan(2.8);
    }
    await page.getByTestId('view-front').click();
    await expect(page.getByTestId('view-front')).toHaveAttribute('aria-pressed', 'true');
    await expect(back).toHaveAttribute('aria-pressed', 'false');
  });

  test('the tour turns the booth as each explanation scrolls past, and a manual choice wins', async ({
    page,
  }) => {
    test.skip(!tourOn(page), 'The tour runs on screens at least 1024 by 700 px.');
    await page.goto(HOME);
    // A view button reads as pressed only while the camera is at that preset:
    // FRONT in the front hold; none while turning, or at the raised top and rear holds.
    await scrollToTourProgress(page, 0.2);
    await expect(page.getByTestId('view-front')).toHaveAttribute('aria-pressed', 'true');
    for (const p of [0.35, 0.5, 0.75]) {
      await scrollToTourProgress(page, p);
      await expect(page.locator('[data-testid^="view-"][aria-pressed="true"]')).toHaveCount(0);
    }
    // A manual choice wins, says so, and holds while the visitor stays in the block.
    await scrollToTourProgress(page, 0.5);
    await page.getByTestId('view-side').click();
    await expect(page.getByTestId('manual-note')).toBeVisible();
    await page.mouse.wheel(0, 40);
    await page.waitForTimeout(400);
    await expect(page.getByTestId('view-side')).toHaveAttribute('aria-pressed', 'true');
    // The next explanation hands control back to the tour.
    await scrollToTourProgress(page, 0.2);
    await expect(page.getByTestId('manual-note')).toHaveCount(0);
  });

  test('the booth keeps its final tour pose after the tour ends (review finding 5)', async ({ page }) => {
    test.skip(!tourOn(page), 'The tour runs on screens at least 1024 by 700 px.');
    await page.goto(HOME);
    if ((await page.getByTestId('booth-canvas').count()) === 0) return;
    const stage = page.getByTestId('booth-stage');
    await scrollToTourProgress(page, 0.98);
    await expect
      .poll(async () => Number(await stage.getAttribute('data-azimuth')), { timeout: 5000 })
      .toBeCloseTo(2.36, 1);
    // Scroll a little past the end: the raised rear view stays.
    await scrollToTourProgress(page, 1.15);
    await page.waitForTimeout(800);
    expect(Number(await stage.getAttribute('data-azimuth'))).toBeCloseTo(2.36, 1);
    expect(Number(await stage.getAttribute('data-polar'))).toBeCloseTo(1.15, 1);
    // Back into the tour, the pose follows the scroll again.
    await scrollToTourProgress(page, 0.5);
    await expect
      .poll(async () => Number(await stage.getAttribute('data-polar')), { timeout: 5000 })
      .toBeCloseTo(0.35, 1);
  });

  test('selecting a part opens its detail and selecting it again closes it (A7)', async ({ page }) => {
    await page.goto(HOME);
    await scrollToSelector(page, '[data-testid="parts-catalogue"]', 100);
    const joystick = page.getByTestId('part-joystick');
    await joystick.click();
    await expect(joystick).toHaveAttribute('aria-pressed', 'true');
    const detail = page.getByTestId('detail-joystick');
    await expect(detail).toBeVisible();
    await expect(detail).toContainText('JOYSTICK');
    await expect(detail).toContainText('MOVES THE PLAYER');
    const wide = (page.viewportSize()?.width ?? 0) >= 1024;
    if (!wide) {
      // Below 1024 px the detail opens right below the chosen part, in view.
      const [cell, box] = await Promise.all([joystick.boundingBox(), detail.boundingBox()]);
      expect((box?.y ?? 0) >= (cell?.y ?? 0) + (cell?.height ?? 0) - 1).toBe(true);
    }
    await joystick.click();
    await expect(joystick).toHaveAttribute('aria-pressed', 'false');
    if (wide) await expect(page.getByTestId('part-detail')).toContainText('SELECT A PART');
    else await expect(detail).toHaveCount(0);
    await expect(page.getByTestId('parts-catalogue').locator('button')).toHaveCount(6);
  });

  test('the crossing dial sits below the step and follows the Singapore order', async ({ page }) => {
    await page.goto(HOME);
    await scrollToSelector(page, '[data-testid="stepper"]', 100);
    const tabs = page.getByTestId('stepper').getByRole('tab');
    await expect(tabs).toHaveCount(6);
    const [panel, dial] = await Promise.all([
      page.getByTestId('step-panel').boundingBox(),
      page.getByTestId('stepper').getByRole('tablist').boundingBox(),
    ]);
    expect(dial?.y ?? 0).toBeGreaterThan(panel?.y ?? 0);
    await tabs.nth(3).click();
    await expect(page.getByTestId('step-panel')).toContainText('LOOK RIGHT AGAIN');
    await page.keyboard.press('ArrowRight');
    await expect(page.getByTestId('step-panel')).toContainText('CROSS');
    await expect(page.getByText(/both ways/i)).toHaveCount(0);
  });

  test('the problem reads top to bottom: chart, caveat, source', async ({ page }) => {
    await page.goto(HOME);
    const ys = await Promise.all(
      [
        '[data-testid="problem-chart"]',
        '[data-testid="problem-caveat"]',
        '[data-testid="problem-source"]',
      ].map(async (s) => (await page.locator(s).first().boundingBox())?.y ?? 0),
    );
    expect(ys[1]).toBeGreaterThan(ys[0] as number);
    expect(ys[2]).toBeGreaterThan(ys[1] as number);
  });

  test('the targets read as numbers, with 1,500 written with a comma (A2)', async ({ page }) => {
    await page.goto(HOME);
    await expect(page.getByRole('img', { name: '1,500' })).toHaveCount(1);
    const overflow = await page.evaluate(
      () =>
        [...document.querySelectorAll('[data-testid="targets"] [role="img"]')].filter(
          (c) =>
            c.getBoundingClientRect().width >
            (c.parentElement as HTMLElement).getBoundingClientRect().width + 1,
        ).length,
    );
    expect(overflow, 'a target number is wider than its cell').toBe(0);
    await expect(page.locator('#plan')).toContainText('TARGET');
    await expect(page.locator('main')).not.toContainText(/built by the team/i);
  });

  test('the page is short: the game within 6 screens and the page within 12 on wide screens', async ({
    page,
  }) => {
    test.skip(!wide(page), 'The length rule is for wide screens.');
    await page.goto(HOME);
    const { cross, total } = await page.evaluate(() => {
      const vh = window.innerHeight;
      const el = document.getElementById('cross') as HTMLElement;
      return {
        cross: (el.getBoundingClientRect().top + window.scrollY) / vh,
        total: document.documentElement.scrollHeight / vh,
      };
    });
    expect(cross).toBeLessThanOrEqual(6);
    expect(total).toBeLessThanOrEqual(12);
  });

  test('only the headline and the section titles end with a full stop (A15)', async ({ page }) => {
    await page.goto(HOME);
    const stops = await page.evaluate(() =>
      [...document.querySelectorAll('button, nav a, .ks-label, .ks-button, [data-testid^="part-"] span')]
        .map((el) => (el.textContent ?? '').trim())
        .filter((t) => /[^.]\.$/.test(t)),
    );
    expect(stops).toEqual([]);
  });

  test('reduced motion shows still bars and a readable booth and stepper (A4, A14)', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(HOME);
    await expect(page.locator('[data-hero="stripes"]')).toHaveCSS('animation-name', 'none');
    await scrollToSelector(page, '[data-testid="booth-scene"]', 100);
    await expect(page.getByTestId('booth-tour').locator('li')).toHaveCount(3);
    await expect(page.getByTestId('step-panel')).toContainText('WAIT');
    await context.close();
  });
  test('the booth falls back to the flat renders when the model fails (A4, E15)', async ({ page }) => {
    await page.route('**/models/booth-flat.glb', (route) => route.fulfill({ status: 500, body: '' }));
    await page.goto(HOME);
    await scrollToSelector(page, '[data-testid="booth-scene"]', 100);
    await expect(page.getByTestId('booth-fallback')).toBeVisible({ timeout: 8000 });
    await page.getByTestId('view-back').click();
    await expect(page.getByTestId('booth-fallback').locator('img').first()).toHaveAttribute('src', /back/);
  });
  test('the status words are correct and nothing claims a result (A2, A8)', async ({ page }) => {
    await page.goto(HOME);
    const main = page.locator('main');
    await expect(main).toContainText('DESIGNED, TO BE BUILT');
    await expect(main).toContainText('PLANNED');
    await expect(page.getByTestId('budget-total')).toContainText('S$3,000');
    await expect(page.getByTestId('budget-total')).toContainText('REQUESTED');
    await expect(page.locator('#plan')).toContainText('TARGET');
    const text = (await main.innerText()).toLowerCase();
    for (const claim of [
      /booth (is|was) built/,
      /grant (was )?awarded/,
      /schools? (are |is )?confirmed/,
      /reduced phone use/,
    ]) {
      expect(text, String(claim)).not.toMatch(claim);
    }
  });

  test('the keyboard reaches PLAY from the top of the page (A5)', async ({ page }) => {
    await page.goto(HOME);
    for (let i = 0; i < 12; i += 1) {
      await page.keyboard.press('Tab');
      if (await page.getByTestId('hero-play').evaluate((el) => el === document.activeElement)) return;
    }
    throw new Error('Twelve Tab presses did not reach the hero PLAY link.');
  });
  test('the gameplay clip links to the game and there is no iframe', async ({ page }) => {
    await page.goto(HOME);
    await expect(page.getByTestId('clip-link')).toHaveAttribute('href', /play\/$/);
    await expect(page.locator('iframe')).toHaveCount(0);
  });

  test('the shortlist art is in place (picks 8, 27, 28), without markers or the mark strip', async ({
    page,
  }) => {
    await page.goto(HOME);
    // The owner removed the section markers (pick 23) and the mark strip (pick 22).
    await expect(page.locator('main h2 svg')).toHaveCount(0);
    await expect(page.getByTestId('cipher-patch')).toHaveCount(0);
    // Pick 27: the view control has a readout on screens from 640 px.
    const wideEnough = (page.viewportSize()?.width ?? 0) >= 640;
    await expect(page.getByTestId('view-readout')).toBeVisible({ visible: wideEnough });
    if (wideEnough) await expect(page.getByTestId('view-readout')).toContainText('TURN');
    // Pick 28: each target has a label and one line of context.
    await expect(page.locator('[data-testid="targets"] li')).toHaveCount(6);
    await expect(page.locator('[data-testid="targets"]')).toContainText(
      'At least 16 run a booth on their own.',
    );
    // Pick 8: the grid sits behind the dimension drawing.
    await expect(page.locator('.ks-grid-ground img')).toHaveCount(1);
  });

  test('the share images: Kiosk for the home page, Specimen for the other pages (picks 18, 25)', async ({
    page,
  }) => {
    await page.goto(HOME);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /og-image\.png$/);
    for (const route of ['./privacy/', './terms/', './404.html']) {
      await page.goto(route);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /og-specimen\.png$/);
    }
  });

  test('the static views fold into an accordion, and a strip opens its view (pick 6)', async ({
    browser,
  }) => {
    const context = await browser.newContext({
      reducedMotion: 'reduce',
      viewport: { width: 1024, height: 768 },
    });
    const page = await context.newPage();
    await page.goto(HOME);
    await scrollToSelector(page, '[data-testid="booth-scene"]', 100);
    const fallback = page.getByTestId('booth-fallback');
    await expect(fallback).toBeVisible();
    // The current view is open; the other three are strips.
    await expect(fallback.getByRole('button')).toHaveCount(3);
    const open = await page
      .locator('[data-testid^="view-"][aria-pressed="true"]')
      .getAttribute('data-testid');
    const current = (open ?? 'view-front').replace('view-', '');
    await expect(page.getByTestId(`fallback-${current}`)).toHaveCount(0);
    const next = current === 'side' ? 'back' : 'side';
    await page.getByTestId(`fallback-${next}`).click();
    await expect(page.getByTestId(`view-${next}`)).toHaveAttribute('aria-pressed', 'true');
    await expect(fallback.locator('img')).toHaveAttribute('src', new RegExp(next));
    await expect(page.getByTestId(`fallback-${current}`)).toBeVisible();
    await context.close();
  });

  test('page transitions are declared for the site pages and off under reduced motion (pick 29)', async ({
    page,
  }) => {
    await page.goto(HOME);
    const declared = await page.evaluate(() =>
      [...document.styleSheets].some((sheet) =>
        [...sheet.cssRules].some((rule) => rule.cssText.startsWith('@view-transition')),
      ),
    );
    expect(declared).toBe(true);
    // A normal navigation still happens: the title and the address change.
    await page.goto('./privacy/');
    await expect(page).toHaveTitle('Privacy and cookies | Kerb Sense');
  });

  test('smooth scrolling is opt-in only (?smooth=1) and never loads otherwise (pick 30)', async ({
    page,
  }) => {
    const lenis: string[] = [];
    page.on('request', (r) => {
      if (/lenis-/.test(r.url())) lenis.push(r.url());
    });
    await page.goto(HOME);
    await page.waitForTimeout(500);
    expect(lenis).toEqual([]);
    await expect(page.locator('html')).not.toHaveAttribute('data-smooth', 'on');
    await page.goto('./?copy=default&smooth=1');
    await expect(page.locator('html')).toHaveAttribute('data-smooth', 'on');
    expect(lenis.length).toBeGreaterThan(0);
    // A fresh load of a deep link still reaches its section.
    const fresh = await page.context().newPage();
    await fresh.goto('./?copy=default&smooth=1#plan');
    await expect(fresh.locator('#plan')).toBeInViewport();
    await fresh.close();
  });

  test('a deep link lands on its section on a fresh load (S19)', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(`${HOME}#plan`);
    await expect(page.locator('#plan')).toBeInViewport();
    await page.goto('./?copy=default#team');
    await expect(page.locator('#team')).toBeInViewport();
    await context.close();
  });

  test('the charts play once when they scroll into view, and show final values under reduced motion', async ({
    browser,
  }) => {
    const moving = await browser.newContext();
    const page = await moving.newPage();
    await page.goto(HOME);
    const chart = page.getByTestId('problem-chart');
    // Before it is seen, the numbers wait at zero.
    await expect(chart.locator('[data-count="149"]')).toHaveText('0');
    await chart.scrollIntoViewIfNeeded();
    await expect(chart.locator('[data-count="149"]')).toHaveText('149', { timeout: 4000 });
    await expect(chart.locator('[data-count="145"]')).toHaveText('+145%');
    await page.getByTestId('budget-chart').scrollIntoViewIfNeeded();
    await expect(page.getByTestId('budget-chart').locator('[data-count="1300"]')).toHaveText('S$1,300', {
      timeout: 4000,
    });
    await moving.close();
    const still = await browser.newContext({ reducedMotion: 'reduce' });
    const p2 = await still.newPage();
    await p2.goto(HOME);
    await expect(p2.getByTestId('problem-chart').locator('[data-count="27"]')).toHaveText('27');
    await still.close();
  });

  test('the booth is shown like a product: hotspots open a part, and the specs read as big numbers', async ({
    page,
  }) => {
    await page.goto(HOME);
    await scrollToSelector(page, '[data-testid="booth-scene"]', 100);
    await expect(page.getByTestId('spec-row').locator('dd')).toHaveCount(6);
    await expect(page.getByTestId('spec-row')).toContainText('75');
    if ((await page.getByTestId('booth-canvas').count()) === 0) return;
    await page.getByTestId('view-front').click();
    const screen = page.getByTestId('hotspot-screen');
    await expect(screen).toBeVisible({ timeout: 6000 });
    // A part that faces away has no hotspot, and it leaves the tab order.
    await expect(page.getByTestId('hotspot-latches')).toBeHidden();
    await screen.click();
    await expect(screen).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByTestId('detail-screen')).toContainText('SCREEN GLASS');
    await page.getByTestId('view-back').click();
    await expect(page.getByTestId('hotspot-latches')).toBeVisible({ timeout: 6000 });
    await expect(screen).toBeHidden();
  });

  for (const width of [320, 375, 1024]) {
    test(`nothing spills out of its box at ${width} px (review findings 1 to 4)`, async ({ browser }) => {
      const context = await browser.newContext({ viewport: { width, height: 812 } });
      const page = await context.newPage();
      await page.goto(HOME);
      const problems = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const out: string[] = [];
        const check = (el: Element, box: DOMRect, name: string) => {
          const r = el.getBoundingClientRect();
          if (r.width === 0) return;
          if (r.left < box.left - 1 || r.right > box.right + 1)
            out.push(`${name}: ${Math.round(r.left)}-${Math.round(r.right)}`);
        };
        const screen = new DOMRect(0, 0, vw, 1);
        document
          .querySelectorAll('[data-hero="copy"] a')
          .forEach((a) => check(a, screen, `hero ${a.textContent}`));
        document.querySelectorAll('main h2').forEach((h) => check(h, screen, `title ${h.textContent}`));
        document.querySelectorAll('[data-testid="safety-list"] li').forEach((li) => {
          const box = li.getBoundingClientRect();
          li.querySelectorAll('p').forEach((p) => check(p, box, `safety ${p.textContent?.slice(0, 20)}`));
        });
        const bar = document.querySelector('[data-testid="view-group"]')?.parentElement;
        if (bar) {
          const box = bar.getBoundingClientRect();
          bar.querySelectorAll('button').forEach((b) => check(b, box, `view ${b.textContent}`));
          const readout = document.querySelector('[data-testid="view-readout"]')?.getBoundingClientRect();
          if (readout && readout.width > 0) {
            bar.querySelectorAll('button').forEach((b) => {
              const r = b.getBoundingClientRect();
              const overlap =
                r.right > readout.left + 1 &&
                r.left < readout.right - 1 &&
                r.bottom > readout.top + 1 &&
                r.top < readout.bottom - 1;
              if (overlap) out.push(`readout covers ${b.textContent}`);
            });
          }
        }
        return out;
      });
      expect(problems).toEqual([]);
      await context.close();
    });
  }
});
