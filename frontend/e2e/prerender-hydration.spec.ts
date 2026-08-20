import { expect, test, type Page } from '@playwright/test';

const CONSENT_STORAGE_KEY = 'repage:consent:v1';
const REJECTED_CONSENT = JSON.stringify({
  version: 1,
  necessary: true,
  analytics: false,
  advertising: false,
  updatedAt: '2026-01-01T00:00:00.000Z',
});

type BrowserIssue = { kind: string; message: string };

function collectBrowserIssues(page: Page): BrowserIssue[] {
  const issues: BrowserIssue[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') issues.push({ kind: `console.${message.type()}`, message: message.text() });
  });
  page.on('pageerror', (error) => issues.push({ kind: 'pageerror', message: error.message }));
  return issues;
}

async function routeState(page: Page) {
  return page.evaluate(() => ({
    title: document.title,
    robots: document.querySelector('meta[name="robots"]')?.getAttribute('content'),
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null,
    canonicalCount: document.querySelectorAll('link[rel="canonical"]').length,
    descriptionCount: document.querySelectorAll('meta[name="description"]').length,
    robotsCount: document.querySelectorAll('meta[name="robots"]').length,
    openGraphCount: document.querySelectorAll('meta[property^="og:"]').length,
    twitterCount: document.querySelectorAll('meta[name^="twitter:"]').length,
    structuredData: [...document.querySelectorAll('script[type="application/ld+json"][data-repage-structured-data="true"]')].map((script) => JSON.parse(script.textContent ?? 'null')),
    rootText: document.querySelector('#root')?.textContent?.trim() ?? '',
  }));
}

async function expectRoute(page: Page, path: string, heading: string, structuredTypes: string[]) {
  await page.goto(path, { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
  const state = await routeState(page);
  expect(state.rootText.length).toBeGreaterThan(40);
  expect(state.robots).toBe('noindex, nofollow');
  expect(state.structuredData.flat().map((entry: { '@type': string }) => entry['@type'])).toEqual(structuredTypes);
  return state;
}

test('hydrates all required prerendered routes without browser issues', async ({ page }) => {
  const issues = collectBrowserIssues(page);
  await expectRoute(page, '/', 'Uma nova página para o seu negócio começa aqui.', ['Organization', 'WebSite']);
  await expectRoute(page, '/portfolio/', 'Projetos reais para contextos diferentes.', ['BreadcrumbList']);
  await expectRoute(page, '/portfolio/axium/', 'Axium', ['BreadcrumbList']);
  await expectRoute(page, '/privacidade/', 'Política de Privacidade', []);
  await expectRoute(page, '/cookies/', 'Política de Cookies', []);
  const notFound = await expectRoute(page, '/404.html', 'Página não encontrada.', []);
  expect(notFound.canonical).toBeNull();
  expect(notFound.openGraphCount).toBe(0);
  expect(notFound.twitterCount).toBe(0);
  expect(notFound.canonicalCount).toBe(0);
  expect(issues).toEqual([]);
});

test('navigates from the top case back link to the portfolio', async ({ page }) => {
  const issues = collectBrowserIssues(page);
  await page.goto('/portfolio/axium/', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { level: 1, name: 'Axium' })).toBeVisible();

  const topBackLink = page.locator('main header').getByRole('link', { name: 'Voltar ao portfólio' });
  await expect(topBackLink).toHaveAttribute('href', '/portfolio');
  await topBackLink.click();

  await expect(page).toHaveURL(/\/portfolio$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Projetos reais para contextos diferentes.' })).toBeVisible();
  expect(issues).toEqual([]);
});

test('keeps SPA navigation, metadata, back/forward and anchor focus after hydration', async ({ page }) => {
  const issues = collectBrowserIssues(page);
  const documentRequests: string[] = [];
  page.on('request', (request) => {
    if (request.resourceType() === 'document') documentRequests.push(request.url());
  });

  await page.addInitScript(({ key, value }) => window.localStorage.setItem(key, value), {
    key: CONSENT_STORAGE_KEY,
    value: REJECTED_CONSENT,
  });
  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.getByRole('region', { name: 'Sua privacidade importa' })).toHaveCount(0);
  const initialDocumentRequests = documentRequests.length;
  await page.locator('[data-home-section="hero"]').getByRole('link', { name: 'Solicitar orçamento' }).click();
  await expect(page).toHaveURL(/\/#contato$/);
  await expect(page.locator('#contato')).toBeFocused();

  await page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name: 'Projetos' }).click();
  await expect(page).toHaveURL(/\/portfolio$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Projetos reais para contextos diferentes.' })).toBeVisible();
  const portfolio = await routeState(page);
  expect(portfolio.structuredData.flat().map((entry: { '@type': string }) => entry['@type'])).toEqual(['BreadcrumbList']);
  expect(portfolio.canonical).toBe('https://repage.com.br/portfolio');

  await page.getByRole('link', { name: 'Ver case Axium' }).first().click();
  await expect(page).toHaveURL(/\/portfolio\/axium$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Axium' })).toBeVisible();
  const axium = await routeState(page);
  expect(axium.structuredData[0][0].itemListElement[2]).toMatchObject({ name: 'Axium', item: 'https://repage.com.br/portfolio/axium' });
  expect(axium.canonical).toBe('https://repage.com.br/portfolio/axium');

  await page.goBack();
  await expect(page).toHaveURL(/\/portfolio$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Projetos reais para contextos diferentes.' })).toBeVisible();
  expect((await routeState(page)).structuredData.flat().map((entry: { '@type': string }) => entry['@type'])).toEqual(['BreadcrumbList']);

  await page.goForward();
  await expect(page).toHaveURL(/\/portfolio\/axium$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Axium' })).toBeVisible();
  expect((await routeState(page)).canonical).toBe('https://repage.com.br/portfolio/axium');

  const footer = page.locator('[data-home-section="footer"]');
  await footer.getByRole('link', { name: 'Privacidade' }).click();
  await expect(page).toHaveURL(/\/privacidade$/);
  await expect(page.locator('script[type="application/ld+json"][data-repage-structured-data="true"]')).toHaveCount(0);
  const privacy = await routeState(page);
  expect(privacy.structuredData).toEqual([]);
  expect(privacy.canonicalCount).toBe(1);
  expect(privacy.descriptionCount).toBe(1);
  expect(privacy.robotsCount).toBe(1);
  expect(privacy.openGraphCount).toBeGreaterThan(0);
  expect(privacy.twitterCount).toBeGreaterThan(0);
  expect(documentRequests).toHaveLength(initialDocumentRequests);
  expect(issues).toEqual([]);
});
