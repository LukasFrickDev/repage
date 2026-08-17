import { expect, test, type Page } from '@playwright/test';

const CONSENT_STORAGE_KEY = 'repage:consent:v1';
const MEASUREMENT_ID = 'G-REPAGE-TEST';

type BrowserIssue = { kind: string; message: string };

function collectBrowserIssues(page: Page): BrowserIssue[] {
  const issues: BrowserIssue[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      issues.push({ kind: `console.${message.type()}`, message: message.text() });
    }
  });
  page.on('pageerror', (error) => issues.push({ kind: 'pageerror', message: error.message }));
  return issues;
}

function installAnalyticsGuards(page: Page) {
  let gtagScriptRequests = 0;

  page.route('https://www.googletagmanager.com/gtag/js**', async (route) => {
    gtagScriptRequests += 1;
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: 'window.dataLayer = window.dataLayer || [];',
    });
  });

  page.route('https://www.google-analytics.com/**', (route) => route.fulfill({ status: 204, body: '' }));

  return { getGtagScriptRequests: () => gtagScriptRequests };
}

async function analyticsState(page: Page) {
  return page.evaluate((storageKey) => ({
    consent: window.localStorage.getItem(storageKey),
    scriptCount: document.querySelectorAll('script[data-repage-ga4]').length,
    dataLayer: window.dataLayer ?? [],
  }), CONSENT_STORAGE_KEY);
}

async function pageViewPaths(page: Page): Promise<string[]> {
  return page.evaluate(() => (window.dataLayer ?? [])
    .filter((entry): entry is [string, { page_path?: string }] => (
      Array.isArray(entry) && entry[0] === 'page_view'
    ))
    .map((entry) => entry[1]?.page_path)
    .filter((path): path is string => typeof path === 'string'));
}

function storedConsent(analytics: boolean, advertising: boolean) {
  return JSON.stringify({
    version: 1,
    necessary: true,
    analytics,
    advertising,
    updatedAt: '2026-01-01T00:00:00.000Z',
  });
}

async function expectStoredConsent(
  page: Page,
  expected: { analytics: boolean; advertising: boolean },
) {
  await expect.poll(async () => {
    const raw = (await analyticsState(page)).consent;
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return null;
    }
  }).toMatchObject({
    version: 1,
    necessary: true,
    ...expected,
  });

  const raw = (await analyticsState(page)).consent;
  const preference = JSON.parse(raw ?? 'null') as { updatedAt?: unknown };
  expect(typeof preference.updatedAt).toBe('string');
  expect(Number.isFinite(Date.parse(preference.updatedAt as string))).toBe(true);
}

async function expectNoAnalytics(page: Page, getGtagScriptRequests: () => number) {
  const state = await analyticsState(page);
  expect(state.scriptCount).toBe(0);
  expect(state.dataLayer).toEqual([]);
  expect(getGtagScriptRequests()).toBe(0);
  expect(await pageViewPaths(page)).toEqual([]);
}

test('keeps analytics denied on a clean first visit until optional consent', async ({ page }) => {
  const issues = collectBrowserIssues(page);
  const { getGtagScriptRequests } = installAnalyticsGuards(page);

  await page.goto('/', { waitUntil: 'networkidle' });
  const banner = page.getByRole('region', { name: 'Sua privacidade importa' });
  await expect(banner).toBeVisible();
  await expectNoAnalytics(page, getGtagScriptRequests);

  await banner.getByRole('button', { name: 'Recusar opcionais' }).click();
  await expect(page.getByRole('region', { name: 'Sua privacidade importa' })).toHaveCount(0);
  await expectStoredConsent(page, { analytics: false, advertising: false });
  await expectNoAnalytics(page, getGtagScriptRequests);
  expect(issues).toEqual([]);
});

test('does not reactivate analytics for a persisted rejected preference', async ({ page }) => {
  const issues = collectBrowserIssues(page);
  const { getGtagScriptRequests } = installAnalyticsGuards(page);
  await page.addInitScript(({ key, value }) => window.localStorage.setItem(key, value), {
    key: CONSENT_STORAGE_KEY,
    value: storedConsent(false, false),
  });

  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { level: 1, name: 'Uma nova página para o seu negócio começa aqui.' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Sua privacidade importa' })).toHaveCount(0);
  await expectNoAnalytics(page, getGtagScriptRequests);
  expect(issues).toEqual([]);
});

test('loads analytics only after accepting all optional consent', async ({ page }) => {
  const issues = collectBrowserIssues(page);
  const { getGtagScriptRequests } = installAnalyticsGuards(page);

  await page.goto('/', { waitUntil: 'networkidle' });
  const banner = page.getByRole('region', { name: 'Sua privacidade importa' });
  await expect(banner).toBeVisible();
  await expectNoAnalytics(page, getGtagScriptRequests);

  await banner.getByRole('button', { name: 'Aceitar todos' }).click();
  await expect(page.locator('script[data-repage-ga4]')).toHaveCount(1);
  await expect.poll(() => getGtagScriptRequests()).toBe(1);
  await expect.poll(() => pageViewPaths(page)).toEqual(['/']);

  const state = await analyticsState(page);
  expect(JSON.parse(state.consent ?? '{}')).toMatchObject({
    version: 1,
    necessary: true,
    analytics: true,
    advertising: true,
  });
  expect(state.dataLayer).toEqual(expect.arrayContaining([
    ['config', MEASUREMENT_ID, { send_page_view: false }],
    ['page_view', { page_path: '/' }],
  ]));
  expect(issues).toEqual([]);
});

test('tracks authorized SPA page views without document reloads or duplicates', async ({ page }) => {
  const issues = collectBrowserIssues(page);
  const { getGtagScriptRequests } = installAnalyticsGuards(page);
  const documentRequests: string[] = [];
  page.on('request', (request) => {
    if (request.resourceType() === 'document') documentRequests.push(request.url());
  });

  await page.goto('/', { waitUntil: 'networkidle' });
  await page.getByRole('region', { name: 'Sua privacidade importa' }).getByRole('button', { name: 'Aceitar todos' }).click();
  await expect.poll(() => pageViewPaths(page)).toEqual(['/']);
  const initialDocumentRequests = documentRequests.length;

  await page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name: 'Projetos' }).click();
  await expect(page).toHaveURL(/\/portfolio$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Projetos reais para contextos diferentes.' })).toBeVisible();
  await expect.poll(() => pageViewPaths(page)).toEqual(['/', '/portfolio']);

  await page.getByRole('link', { name: 'Ver case Axium' }).first().click();
  await expect(page).toHaveURL(/\/portfolio\/axium$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Axium' })).toBeVisible();
  await expect.poll(() => pageViewPaths(page)).toEqual(['/', '/portfolio', '/portfolio/axium']);

  expect(documentRequests).toHaveLength(initialDocumentRequests);
  expect(getGtagScriptRequests()).toBe(1);
  expect(issues).toEqual([]);
});

test('activates analytics once for a persisted positive preference', async ({ page }) => {
  const issues = collectBrowserIssues(page);
  const { getGtagScriptRequests } = installAnalyticsGuards(page);
  await page.addInitScript(({ key, value }) => window.localStorage.setItem(key, value), {
    key: CONSENT_STORAGE_KEY,
    value: storedConsent(true, true),
  });

  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { level: 1, name: 'Uma nova página para o seu negócio começa aqui.' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Sua privacidade importa' })).toHaveCount(0);
  await expect(page.locator('script[data-repage-ga4]')).toHaveCount(1);
  await expect.poll(() => getGtagScriptRequests()).toBe(1);
  await expect.poll(() => pageViewPaths(page)).toEqual(['/']);
  expect(await pageViewPaths(page)).toEqual(['/']);
  expect(issues).toEqual([]);
});

test('keeps consent accessible and analytics denied with reduced motion', async ({ page }) => {
  const issues = collectBrowserIssues(page);
  const { getGtagScriptRequests } = installAnalyticsGuards(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });

  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { level: 1, name: 'Uma nova página para o seu negócio começa aqui.' })).toBeVisible();
  const banner = page.getByRole('region', { name: 'Sua privacidade importa' });
  await expect(banner).toBeVisible();
  await expect(banner.getByRole('button', { name: 'Recusar opcionais' })).toBeEnabled();
  await banner.getByRole('button', { name: 'Recusar opcionais' }).click();
  await expect(page.getByRole('region', { name: 'Sua privacidade importa' })).toHaveCount(0);
  await expectNoAnalytics(page, getGtagScriptRequests);
  expect(issues).toEqual([]);
});
