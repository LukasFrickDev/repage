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

test('homepage renders its definitive structure without horizontal overflow', async ({ page }) => {
  const issues = collectBrowserIssues(page);

  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 }).first()).toHaveText(
    'Uma nova página para o seu negócio começa aqui.',
  );

  expect(await page.locator('main [data-home-section]').evaluateAll((sections) => (
    sections.map((section) => section.getAttribute('data-home-section'))
  ))).toEqual([
    'hero',
    'projects',
    'services',
    'value',
    'process',
    'about',
    'contact',
  ]);

  const featuredProjects = page.locator('[data-home-section="projects"]');
  await expect(featuredProjects.locator('h3')).toHaveText([
    'EchoCosmicEnergia',
    'Axium',
    'DevSchedule',
  ]);
  await expect(featuredProjects.getByText('Projeto pago')).toHaveCount(0);
  await expect(featuredProjects.getByText('Projeto próprio')).toHaveCount(0);
  await expect(featuredProjects.getByText('Desafio técnico')).toHaveCount(0);
  await expect(featuredProjects.getByText('GreenTweet')).toHaveCount(0);
  const projectImages = featuredProjects.locator('img');
  await expect(projectImages).toHaveCount(2);
  await featuredProjects.scrollIntoViewIfNeeded();
  await expect.poll(() => projectImages.count()).toBeGreaterThanOrEqual(2);
  await page.evaluate(() => window.scrollBy(0, window.innerHeight * 1.8));
  await expect.poll(() => projectImages.count()).toBeGreaterThan(2);
  for (let index = 0; index < await projectImages.count(); index += 1) {
    const image = projectImages.nth(index);
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((media) => (
      (media as HTMLImageElement).complete
      && (media as HTMLImageElement).naturalWidth > 0
      && (media as HTMLImageElement).naturalHeight > 0
    ))).toBe(true);
  }
  await expect(page.locator('video')).toHaveCount(0);

  await expect(page.locator('[data-home-section="hero"] img[src^="/projects/"]')).toHaveCount(0);

  const services = page.locator('[data-home-section="services"]');
  const serviceOffers = services.locator('article');
  await expect(serviceOffers.locator('h3')).toHaveText([
    'Landing pages',
    'Sites institucionais',
    'Soluções personalizadas',
  ]);
  await expect(serviceOffers.getByText(/Para necessidades que vão além de uma página/)).toBeVisible();
  await expect(page.locator('[data-home-section="value"] li')).toHaveCount(4);
  await expect(page.locator('[data-home-section="process"] li')).toHaveCount(6);

  const heroBudgetLink = page.locator('[data-home-section="hero"]').getByRole('link', { name: 'Solicitar orçamento' });
  await heroBudgetLink.click();
  await expect(page).toHaveURL(/\/#contato$/);
  await expect(page.locator('#contato')).toBeFocused();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
  const footer = page.getByRole("contentinfo");
  await expect(footer.getByText("contato@repage.com.br")).toBeVisible();
  await expect(footer.getByRole("link", { name: "contato@repage.com.br" })).toHaveCount(0);
  const emailIcon = footer.getByRole("link", { name: "Enviar e-mail para a Repage" });
  await expect(emailIcon).toHaveAttribute("href", "mailto:contato@repage.com.br");
  const instagram = footer.getByRole("link", { name: "Abrir Instagram da Repage" });
  await expect(instagram).toHaveAttribute("href", "https://instagram.com/repagebr");
  await expect(instagram).toHaveAttribute("target", "_blank");
  await expect(instagram).toHaveAttribute("rel", "noreferrer");
  const whatsapp = footer.getByRole("link", { name: "Falar com a Repage pelo WhatsApp" });
  await expect(whatsapp).toHaveAttribute("href", "https://wa.me/5511958244081?text=Ol%C3%A1!%20Conheci%20a%20Repage%20pelo%20site%20e%20gostaria%20de%20conversar%20sobre%20um%20projeto.");
  await expect(whatsapp).toHaveAttribute("target", "_blank");
  await expect(whatsapp).toHaveAttribute("rel", "noreferrer");
  expect(issues).toEqual([]);
});

test('homepage remains usable with reduced motion and the mobile menu', async ({ page }) => {
  const issues = collectBrowserIssues(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  const viewport = page.viewportSize();
  if (viewport && viewport.width < 900) {
    await page.getByRole('button', { name: 'Abrir menu' }).click();
    const mobileNavigation = page.getByRole('navigation', { name: 'Navegação móvel' });
    await expect(mobileNavigation).toBeVisible();
    await mobileNavigation.getByRole('link', { name: 'Como funciona' }).click();
    await expect(page).toHaveURL(/\/#processo$/);
    await expect(page.locator('#processo')).toBeFocused();
  }

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
  expect(issues).toEqual([]);
});

test('aligns homepage anchors directly below the fixed header', async ({ page }) => {
  await page.goto('/');

  const mobileMenuButton = page.getByRole('button', { name: 'Abrir menu' });
  if (await mobileMenuButton.isVisible()) {
    await mobileMenuButton.click();
    const mobileNavigation = page.getByRole('navigation', { name: 'Navegação móvel' });
    await expect(mobileNavigation).toBeVisible();
    await mobileNavigation.getByRole('link', { name: 'Serviços' }).click();
  } else {
    const desktopNavigation = page.getByRole('navigation', { name: 'Navegação principal' });
    await expect(desktopNavigation).toBeVisible();
    await desktopNavigation.getByRole('link', { name: 'Serviços' }).click();
  }

  await expect(page).toHaveURL(/\/#servicos$/);

  const anchorGap = () => page.evaluate(() => {
    const header = document.querySelector('header')?.getBoundingClientRect();
    const section = document.getElementById('servicos')?.getBoundingClientRect();
    if (!header || !section) return Number.POSITIVE_INFINITY;
    return Math.abs(section.top - header.bottom);
  });

  await expect.poll(anchorGap, { timeout: 3000 }).toBeLessThanOrEqual(2);
});

test('public routes stay non-indexable without explicit indexing opt-in', async ({ page }) => {
  test.setTimeout(60_000);
  const issues = collectBrowserIssues(page);

  for (const route of [
    { path: '/', heading: 'Uma nova página para o seu negócio começa aqui.', robots: 'noindex, nofollow' },
    { path: '/portfolio', heading: 'Projetos reais para contextos diferentes.', robots: 'noindex, nofollow' },
    { path: '/portfolio/axium', heading: 'Axium', robots: 'noindex, nofollow' },
    { path: '/portfolio/echo-cosmic-energia', heading: 'EchoCosmicEnergia', robots: 'noindex, nofollow' },
    { path: '/portfolio/dev-schedule', heading: 'DevSchedule', robots: 'noindex, nofollow' },
    { path: '/portfolio/green-tweet', heading: 'GreenTweet', robots: 'noindex, nofollow' },
    { path: '/portfolio/a-alma-no-comando', heading: 'A Alma no Comando', robots: 'noindex, nofollow' },
    { path: '/portfolio/alicerce-da-alma', heading: 'Alicerce da Alma', robots: 'noindex, nofollow' },
    { path: '/privacidade', heading: 'Política de Privacidade', robots: 'noindex, nofollow' },
    { path: '/cookies', heading: 'Política de Cookies', robots: 'noindex, nofollow' },
    { path: '/rota-inexistente', heading: 'Página não encontrada.', robots: 'noindex, nofollow' },
  ]) {
    await page.goto(route.path);

    await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(route.heading);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', route.robots);
  }

  expect(issues).toEqual([]);
});
