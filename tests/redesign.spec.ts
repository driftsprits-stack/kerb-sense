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

  test('the hero text sits on solid black and the dots span the field', async ({ page }) => {
    await page.goto(HOME);
    const panel = page.locator('[data-hero="copy"]');
    await expect(panel).toHaveCSS('background-color', 'rgb(0, 0, 0)');
    const [led, hero] = await Promise.all([
      page.locator('[data-hero="led"]').boundingBox(),
      page.getByTestId('hero').boundingBox(),
    ]);
    expect(led?.width ?? 0).toBeGreaterThanOrEqual((hero?.width ?? 0) * 0.98);
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
    await scrollToSelector(page, '[data-tour="1"]', 300);
    await expect(page.getByTestId('view-top')).toHaveAttribute('aria-pressed', 'true');
    await scrollToSelector(page, '[data-tour="2"]', 300);
    await expect(page.getByTestId('view-back')).toHaveAttribute('aria-pressed', 'true');
    await page.getByTestId('view-side').click();
    await page.mouse.wheel(0, 40);
    await page.waitForTimeout(400);
    await expect(page.getByTestId('view-side')).toHaveAttribute('aria-pressed', 'true');
  });

  test('selecting a part opens its detail and selecting it again closes it (A7)', async ({ page }) => {
    await page.goto(HOME);
    await scrollToSelector(page, '[data-testid="parts-catalogue"]', 100);
    const joystick = page.getByTestId('part-joystick');
    await joystick.click();
    await expect(joystick).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByTestId('part-detail')).toContainText('JOYSTICK');
    await expect(page.getByTestId('part-detail')).toContainText('MOVES THE PLAYER');
    await joystick.click();
    await expect(joystick).toHaveAttribute('aria-pressed', 'false');
    await expect(page.getByTestId('part-detail')).toContainText('SELECT A PART');
    await expect(page.getByTestId('parts-catalogue').locator('li')).toHaveCount(6);
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
      ['#problem img', '[data-testid="problem-caveat"]', '[data-testid="problem-source"]'].map(
        async (s) => (await page.locator(s).first().boundingBox())?.y ?? 0,
      ),
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

  test('reduced motion shows still dots and a readable booth and stepper (A4, A14)', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(HOME);
    await expect(page.locator('[data-hero="led"]')).toHaveCSS('animation-name', 'none');
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
});
