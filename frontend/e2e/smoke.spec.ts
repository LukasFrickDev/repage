import { expect, test, type Page } from '@playwright/test';

function collectBrowserIssues(page: Page): string[] {
  const issues: string[] = [];

  page.on('console', (message) => {
    if (message.type() === 'error') issues.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => issues.push(`pageerror: ${error.message}`));
  page.on('requestfailed', (request) => issues.push(`requestfailed: ${request.url()}`));

  return issues;
}

test('homepage renders its main heading without horizontal overflow', async ({ page }) => {
  const issues = collectBrowserIssues(page);

  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 }).first()).toHaveText(
    'Uma nova página para o seu negócio começa aqui.',
  );

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
  expect(issues).toEqual([]);
});

test('temporary portfolio routes remain noindex without publishing a final case', async ({ page }) => {
  const issues = collectBrowserIssues(page);

  for (const route of [
    { path: '/portfolio', heading: 'Projetos em preparação.' },
    { path: '/portfolio/axium', heading: 'Axium' },
    { path: '/rota-inexistente', heading: 'Página não encontrada.' },
  ]) {
    await page.goto(route.path);

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(route.heading);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  }

  expect(issues).toEqual([]);
});
