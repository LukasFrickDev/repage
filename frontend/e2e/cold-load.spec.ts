import { expect, test } from '@playwright/test';
import type { Page, Route } from '@playwright/test';

const fontPath = '/fonts/instrument-sans/InstrumentSans-Variable.woff2';
const firstProjectMedia = [
  '/projects/echo-cosmic-energia/echo-social.png',
  '/projects/echo-cosmic-energia/echo-home-mobile.png',
];
const deferredProjectMedia = [
  '/projects/axium/axium-social.png',
  '/projects/axium/axium-home-mobile.png',
  '/projects/dev-schedule/devschedule-social.png',
  '/projects/dev-schedule/devschedule-client-services-mobile.png',
];
const firstServiceMedia = '/projects/a-alma-no-comando/alma-social.png';

function deferred(): { promise: Promise<void>; resolve: () => void } {
  let resolve!: () => void;
  const promise = new Promise<void>((resolvePromise) => { resolve = resolvePromise; });
  return { promise, resolve };
}

async function holdApplicationScript(
  page: Page,
  release: { promise: Promise<void>; resolve: () => void },
  requested: { promise: Promise<void>; resolve: () => void },
) {
  const hold = async (route: Route) => {
    requested.resolve();
    await release.promise;
    await route.continue();
  };

  await page.route('**/assets/*.js', hold);
  await page.route('**/src/main.tsx', hold);
}

test.describe('homepage cold load', () => {
  test('keeps the textual intro gated while the critical font is delayed', async ({ page }) => {
    const fontRelease = deferred();
    const fontRequested = deferred();

    await page.route(`**${fontPath}`, async (route) => {
      fontRequested.resolve();
      await fontRelease.promise;
      await route.continue();
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await fontRequested.promise;
    await page.waitForTimeout(1_300);

    const state = await page.evaluate(() => ({
      fontReady: document.fonts.check('620 1em "Instrument Sans"'),
      introStatus: document.querySelector('[data-intro-status]')?.getAttribute('data-intro-status'),
      wordmarkCount: document.querySelectorAll('[data-intro-wordmark]').length,
      visualIntroVisible: Boolean(document.querySelector('[data-intro-symbol]')),
      heroOpacity: getComputedStyle(document.querySelector('[data-home-section="hero"] h1')!).opacity,
      projectImageCount: document.querySelectorAll('[data-home-section="projects"] img').length,
    }));

    expect(state.fontReady).toBe(false);
    expect(state.introStatus).toBe('waiting');
    expect(state.wordmarkCount).toBe(0);
    expect(state.visualIntroVisible).toBe(true);
    expect(Number(state.heroOpacity)).toBe(0);
    expect(state.projectImageCount).toBe(2);

    fontRelease.resolve();
    await expect.poll(() => page.locator('[data-intro-status]').getAttribute('data-intro-status')).toBe('ready');
    await expect(page.locator('[data-intro-wordmark]')).toHaveCount(1);
  });

  test('releases safely on a failed font without revealing the fallback wordmark', async ({ page }) => {
    await page.route(`**${fontPath}`, (route) => route.abort('failed'));

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await expect.poll(() => page.locator('[data-intro-status]').getAttribute('data-intro-status')).toBe('degraded');
    await expect(page.locator('[data-intro-wordmark]')).toHaveCount(0);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('does not reopen the intro when the font resolves after the safety timeout', async ({ page }) => {
    test.setTimeout(10_000);
    const fontRelease = deferred();
    const fontRequested = deferred();

    await page.route(`**${fontPath}`, async (route) => {
      fontRequested.resolve();
      await fontRelease.promise;
      await route.continue();
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await fontRequested.promise;
    await expect.poll(() => page.locator('[data-intro-status]').getAttribute('data-intro-status'), { timeout: 6_000 }).toBe('degraded');
    await expect(page.locator('[data-intro-wordmark]')).toHaveCount(0);

    fontRelease.resolve();
    await page.waitForTimeout(300);
    await expect(page.locator('[data-intro-status]')).toHaveAttribute('data-intro-status', 'degraded');
    await expect(page.locator('[data-intro-wordmark]')).toHaveCount(0);
  });

  test('starts only the first project composition and first service media early', async ({ page }) => {
    const requests: string[] = [];
    const delayedPaths = [...firstProjectMedia, firstServiceMedia];

    page.on('request', (request) => {
      const pathname = new URL(request.url()).pathname;
      if (pathname.startsWith('/projects/')) requests.push(pathname);
    });

    for (const path of delayedPaths) {
      await page.route(`**${path}`, async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 1_200));
        await route.continue();
      });
    }

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect.poll(() => requests.length).toBe(3);

    expect(requests).toEqual(expect.arrayContaining([...firstProjectMedia, firstServiceMedia]));
    expect(requests).not.toEqual(expect.arrayContaining(deferredProjectMedia));
    expect(await page.locator('[data-home-section="projects"] img').count()).toBe(2);
    await expect.poll(() => page.locator('[data-home-section="services"] article').first().getAttribute('data-service-media-ready')).toBe('true');

    await page.locator('[data-home-section="projects"]').scrollIntoViewIfNeeded();
    await expect.poll(() => page.locator('[data-home-section="projects"] img').count()).toBeGreaterThanOrEqual(2);
    await expect.poll(() => page.locator('[data-project-media-ready="true"]').count()).toBeGreaterThan(0);

    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 1.8));
    await expect.poll(() => page.locator('[data-home-section="projects"] img').count()).toBeGreaterThan(2);
    await expect.poll(() => requests.filter((path) => deferredProjectMedia.includes(path)).length).toBeGreaterThan(0);
  });

  test('reconciles featured media completed before hydration', async ({ page }, testInfo) => {
    test.skip(testInfo.project.use.baseURL !== 'http://127.0.0.1:4173', 'Hydration race requires the prerendered production preview.');
    const hydrationRelease = deferred();
    const scriptRequested = deferred();

    await holdApplicationScript(page, hydrationRelease, scriptRequested);

    await page.goto('/', { waitUntil: 'commit' });
    await scriptRequested.promise;

    await expect.poll(() => page.locator(`img[src$="${firstProjectMedia[0]}"]`).evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);
    await expect.poll(() => page.locator(`img[src$="${firstProjectMedia[1]}"]`).evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);
    await expect(page.locator('[data-home-section="projects"] [data-project-media-ready]').first()).toHaveAttribute('data-project-media-ready', 'false');

    hydrationRelease.resolve();

    await expect.poll(() => page.locator('[data-home-section="projects"] [data-project-media-ready]').first().getAttribute('data-project-media-ready')).toBe('true');
  });

  test('reconciles the first service media completed before hydration', async ({ page }, testInfo) => {
    test.skip(testInfo.project.use.baseURL !== 'http://127.0.0.1:4173', 'Hydration race requires the prerendered production preview.');
    const hydrationRelease = deferred();
    const scriptRequested = deferred();

    await holdApplicationScript(page, hydrationRelease, scriptRequested);

    await page.goto('/', { waitUntil: 'commit' });
    await scriptRequested.promise;

    await expect.poll(() => page.locator(`img[src$="${firstServiceMedia}"]`).evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);
    await expect(page.locator('[data-home-section="services"] article').first()).toHaveAttribute('data-service-media-ready', 'false');

    hydrationRelease.resolve();

    await expect.poll(() => page.locator('[data-home-section="services"] article').first().getAttribute('data-service-media-ready')).toBe('true');
  });
});
