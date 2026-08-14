import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { getCaseMetadata, routeMetadata } from './routeMetadata';
import { AppRoutes } from './router';

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="location">{location.pathname}{location.hash}</output>;
}

function HistoryControls() {
  const navigate = useNavigate();

  return (
    <div>
      <button type="button" onClick={() => navigate(-1)}>Voltar no histórico de teste</button>
      <button type="button" onClick={() => navigate(1)}>Avançar no histórico de teste</button>
      <button type="button" onClick={() => navigate('/portfolio')}>Navegar ao portfólio de teste</button>
    </div>
  );
}

function renderAt(entry: string) {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <LocationProbe />
      <AppRoutes />
      <HistoryControls />
    </MemoryRouter>,
  );
}

describe('public routes', () => {
  it.each([
    ['/', 'Uma nova página para o seu negócio começa aqui.'],
    ['/portfolio', 'Projetos reais para contextos diferentes.'],
    ['/portfolio/axium', 'Axium'],
    ['/privacidade', 'Política de Privacidade em preparação.'],
    ['/cookies', 'Política de Cookies em preparação.'],
    ['/rota-inexistente', 'Página não encontrada.'],
  ])('renders %s with a main heading', (route, heading) => {
    renderAt(route);

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
  });

  it('renders the public 404 for an unknown project slug', () => {
    renderAt('/portfolio/slug-inexistente');

    expect(screen.getByRole('heading', { level: 1, name: 'Projeto não encontrado.' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver portfólio' })).toHaveAttribute('href', '/portfolio');
  });

  it('renders the shared Echo case shell with factual content and next navigation', () => {
    renderAt('/portfolio/echo-cosmic-energia');

    const caseMain = within(screen.getByRole('main'));
    expect(screen.getByRole('heading', { level: 1, name: 'EchoCosmicEnergia' })).toBeInTheDocument();
    expect(caseMain.queryByText('Projeto pago')).not.toBeInTheDocument();
    expect(caseMain.queryByText(/Lukas Frick/)).not.toBeInTheDocument();
    expect(screen.getByText('Experiência full stack com catálogo, loja, conteúdo editorial e diferentes pontos de contato em uma presença digital integrada.')).toBeInTheDocument();
    expect(screen.getByText('Uma presença digital integrada para reunir catálogo, loja, conteúdo editorial e diferentes pontos de contato.')).toBeInTheDocument();
    expect(screen.getByText('O projeto combina comércio digital, conteúdo e serviços em uma mesma experiência pública.')).toBeInTheDocument();
    expect(screen.getByText('Organizar diferentes frentes da experiência em uma estrutura clara e navegável.')).toBeInTheDocument();
    expect(screen.getByText('Uma experiência full stack com catálogo, carrinho, checkout, pagamentos, loja virtual, blog, página de links e painel administrativo.')).toBeInTheDocument();
    expect(screen.getAllByText('Estratégia inicial, estrutura, direção visual/design e desenvolvimento. O trabalho foi refinado e validado com o cliente.')).not.toHaveLength(0);
    expect(screen.getByText('Catálogo')).toBeInTheDocument();
    expect(screen.getByText('Checkout')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Página inicial da Echo Cosmic Energia para compartilhamento social.' })).toHaveAttribute('src', '/projects/echo-cosmic-energia/echo-social.png');
    expect(screen.getByRole('link', { name: 'Solicitar orçamento' })).toHaveAttribute('href', '/#contato');
    expect(screen.getAllByRole('link', { name: 'Voltar ao portfólio' })).toHaveLength(2);
    expect(screen.getAllByRole('link', { name: 'Voltar ao portfólio' })[0]).toHaveAttribute('href', '/portfolio');
    expect(screen.getByRole('link', { name: /Axium/ })).toHaveAttribute('href', '/portfolio/axium');
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  it('renders Echo inline gallery groups with screenshots before typed inline videos', () => {
    renderAt('/portfolio/echo-cosmic-energia');

    const gallery = within(screen.getByRole('main')).getByRole('region', { name: 'O trabalho em uso.' });
    expect(within(gallery).getByText('DESKTOP')).toBeInTheDocument();
    expect(within(gallery).getByText('MOBILE')).toBeInTheDocument();
    expect(within(gallery).getAllByRole('img')).toHaveLength(6);
    expect(within(gallery).getAllByRole('img').map((image) => image.getAttribute('src'))).toEqual([
      '/projects/echo-cosmic-energia/echo-social.png',
      '/projects/echo-cosmic-energia/echo-store-desktop.png',
      '/projects/echo-cosmic-energia/echo-articles-desktop.png',
      '/projects/echo-cosmic-energia/echo-business-services-desktop.png',
      '/projects/echo-cosmic-energia/echo-home-mobile.png',
      '/projects/echo-cosmic-energia/echo-links-mobile.png',
    ]);
    expect(within(gallery).getAllByRole('img').every((image) => image.getAttribute('alt'))).toBe(true);
    gallery.querySelectorAll('figure').forEach((figure) => {
      const visual = figure.querySelector(':scope > button, :scope > span, :scope > img');
      const caption = figure.querySelector(':scope > figcaption');
      expect(visual).toBeInTheDocument();
      expect(caption).toBeInTheDocument();
      expect(visual?.contains(caption)).toBe(false);
      expect(caption?.textContent?.trim()).not.toBe('');
    });
    expect(gallery.querySelectorAll('[data-project-browser-frame]')).toHaveLength(5);
    expect(gallery.querySelectorAll('[data-project-phone-frame]')).toHaveLength(3);
    expect(gallery.querySelector('[data-gallery-group="GERAL"]')).not.toBeInTheDocument();
    expect(gallery.querySelector('[data-gallery-group="DESKTOP"] img[src$="echo-social.png"]')).toBeInTheDocument();
    expect(gallery.querySelector('[data-gallery-group="MOBILE"] img[src$="echo-social.png"]')).not.toBeInTheDocument();
    expect(gallery.querySelectorAll('figure p')).toHaveLength(0);
    expect(screen.getByRole('img', { name: 'Página inicial da Echo Cosmic Energia para compartilhamento social.' })).toHaveAttribute('src', '/projects/echo-cosmic-energia/echo-social.png');
    expect(screen.queryByRole('link', { name: 'Mídia principal de EchoCosmicEnergia' })).not.toBeInTheDocument();
    const videos = gallery.querySelectorAll('video');
    expect(videos).toHaveLength(2);
    expect([...videos].map((video) => video.getAttribute('src'))).toEqual([
      '/projects/echo-cosmic-energia/videos/echo-tour-desktop.webm',
      '/projects/echo-cosmic-energia/videos/echo-tour-mobile.webm',
    ]);
    [...videos].forEach((video) => {
      expect(video).toHaveAttribute('controls');
      expect(video).toHaveAttribute('playsinline');
      expect(video).toHaveAttribute('preload', 'none');
      expect(video).toHaveAttribute('poster');
      expect(video).toHaveAttribute('data-project-video', 'true');
    });
  });

  it('opens only screenshots in the accessible case viewer', async () => {
    const user = userEvent.setup();
    renderAt('/portfolio/echo-cosmic-energia');

    const gallery = within(screen.getByRole('main')).getByRole('region', { name: 'O trabalho em uso.' });
    const screenshotTriggers = within(gallery).getAllByRole('button', { name: /^Ampliar:/ });
    expect(screenshotTriggers).toHaveLength(6);

    await user.click(screenshotTriggers[0]);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mídia anterior' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Próxima mídia' })).toBeEnabled();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('dialog')).toHaveTextContent('2 de 8');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(document.activeElement).toBe(screenshotTriggers[0]));
  });

  it('opens an inline video in the shared viewer without autoplay', async () => {
    const user = userEvent.setup();
    const pauseSpy = vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
    renderAt('/portfolio/echo-cosmic-energia');

    const gallery = within(screen.getByRole('main')).getByRole('region', { name: 'O trabalho em uso.' });
    const expandButtons = within(gallery).getAllByRole('button', { name: 'Abrir vídeo no viewer' });
    expect(expandButtons).toHaveLength(2);

    await user.click(expandButtons[0]);
    const viewer = screen.getByRole('dialog');
    const viewerVideo = viewer.querySelector('video');
    expect(viewerVideo).toBeInTheDocument();
    expect(viewerVideo).toHaveAttribute('src', '/projects/echo-cosmic-energia/videos/echo-tour-desktop.webm');
    expect(viewerVideo).toHaveAttribute('poster', '/projects/echo-cosmic-energia/echo-social.png');
    expect(viewerVideo).toHaveAttribute('preload', 'none');
    expect(viewerVideo).toHaveAttribute('controls');
    expect(viewerVideo).toHaveAttribute('playsinline');
    expect(viewerVideo).not.toHaveAttribute('autoplay');
    expect(viewer).toHaveTextContent('5 de 8');

    await user.click(screen.getByRole('button', { name: 'Próxima mídia' }));
    expect(within(screen.getByRole('dialog')).queryByRole('video', { name: 'Tour desktop da Echo Cosmic Energia.' })).not.toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveTextContent('6 de 8');
    expect(pauseSpy).toHaveBeenCalled();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const pauseCallsBeforeClose = pauseSpy.mock.calls.length;
    await user.click(expandButtons[0]);
    await user.keyboard('{Escape}');
    expect(pauseSpy.mock.calls.length).toBeGreaterThan(pauseCallsBeforeClose);
    await waitFor(() => expect(document.activeElement).toBe(expandButtons[0]));
    pauseSpy.mockRestore();
  });

  it('uses the registered video fallback without opening the screenshot viewer', () => {
    renderAt('/portfolio/echo-cosmic-energia');

    const gallery = within(screen.getByRole('main')).getByRole('region', { name: 'O trabalho em uso.' });
    const video = gallery.querySelector('video');
    expect(video).toBeInTheDocument();
    fireEvent.error(video as HTMLVideoElement);

    expect(gallery.querySelectorAll('video')).toHaveLength(1);
    expect(within(gallery).getByRole('img', { name: 'Tour desktop da Echo Cosmic Energia.' })).toHaveAttribute(
      'src',
      '/projects/echo-cosmic-energia/echo-social.png',
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders the shared case gallery for all public project routes', () => {
    ['axium', 'dev-schedule', 'green-tweet', 'a-alma-no-comando', 'alicerce-da-alma'].forEach((slug) => {
      const { unmount } = renderAt(`/portfolio/${slug}`);
      const gallery = within(screen.getByRole('main')).getByRole('region', { name: 'O trabalho em uso.' });
      expect(within(gallery).getByText('DESKTOP')).toBeInTheDocument();
      expect(within(gallery).getByText('MOBILE')).toBeInTheDocument();
      expect(within(gallery).getAllByRole('img').length).toBeGreaterThan(0);
      unmount();
    });
  });

  it('resets immediately when navigating to a new route without a hash', async () => {
    const user = userEvent.setup();
    renderAt('/');

    await user.click(screen.getByRole('link', { name: 'Ver projetos' }));

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'auto' });
  });

  it('renders the six editorial portfolio projects with their covers and solution types', () => {
    renderAt('/portfolio');

    const portfolio = screen.getByRole('region', { name: 'Projetos do portfólio' });
    expect(within(portfolio).getAllByRole('listitem')).toHaveLength(6);
    expect(within(portfolio).getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)).toEqual([
      'EchoCosmicEnergia',
      'Axium',
      'DevSchedule',
      'GreenTweet',
      'A Alma no Comando',
      'Alicerce da Alma',
    ]);
    expect(within(portfolio).getAllByRole('img')).toHaveLength(6);
    expect(within(portfolio).getAllByRole('img').map((image) => image.getAttribute('src'))).toEqual([
      '/projects/echo-cosmic-energia/echo-social.png',
      '/projects/axium/axium-social.png',
      '/projects/dev-schedule/devschedule-social.png',
      '/projects/green-tweet/greentweet-social.png',
      '/projects/a-alma-no-comando/alma-social.png',
      '/projects/alicerce-da-alma/alicerce-social.png',
    ]);
    expect(within(portfolio).getAllByRole('img').every((image) => !image.getAttribute('src')?.includes('mobile'))).toBe(true);
    expect(within(portfolio).getAllByRole('link').filter((link) => link.getAttribute('href')?.startsWith('/portfolio/'))).toHaveLength(12);
    expect(within(portfolio).queryByText('Projeto pago')).not.toBeInTheDocument();
    expect(within(portfolio).queryByText('Projeto próprio')).not.toBeInTheDocument();
    expect(within(portfolio).queryByText('Desafio técnico')).not.toBeInTheDocument();
    expect(portfolio.querySelector('video')).not.toBeInTheDocument();
    expect(within(portfolio).getByText('Site institucional · E-commerce')).toBeInTheDocument();
    expect(within(portfolio).getAllByText('Aplicação web · Full stack')).toHaveLength(2);
    expect(within(portfolio).getAllByText('Landing page')).toHaveLength(2);
    expect(screen.getByRole('heading', { level: 1 }).querySelectorAll(':scope > span')).toHaveLength(3);
  });

  it('routes project and budget CTAs to real destinations without #briefing', () => {
    renderAt('/');

    expect(screen.getByRole('link', { name: 'Ver projetos' })).toHaveAttribute('href', '/portfolio');
    const budgetCtas = screen.getAllByRole('link', { name: 'Solicitar orçamento' });
    expect(budgetCtas).not.toHaveLength(0);
    budgetCtas.forEach((link) => {
      expect(link).toHaveAttribute('href', '/#contato');
    });
    expect(document.querySelector('[href*="#briefing"]')).not.toBeInTheDocument();

    const contact = document.getElementById('contato');
    expect(within(contact as HTMLElement).queryByRole('link', { name: 'Solicitar orçamento' })).not.toBeInTheDocument();
    expect(within(contact as HTMLElement).queryByRole('button', { name: 'Solicitar orçamento' })).not.toBeInTheDocument();
  });

  it('renders the definitive homepage structure from the typed project and media sources', () => {
    renderAt('/');

    const sections = [...document.querySelectorAll('main [data-home-section]')]
      .map((section) => section.getAttribute('data-home-section'));
    expect(sections).toEqual(['hero', 'projects', 'services', 'value', 'process', 'about', 'contact']);

    const projectsSection = document.querySelector('[data-home-section="projects"]') as HTMLElement;
    const projectHeadings = [...projectsSection.querySelectorAll('h3')];
    expect(projectHeadings.map((heading) => heading.textContent)).toEqual([
      'EchoCosmicEnergia',
      'Axium',
      'DevSchedule',
    ]);
    expect(within(projectsSection).queryByText('Projeto pago')).not.toBeInTheDocument();
    expect(within(projectsSection).queryByText('Projeto próprio')).not.toBeInTheDocument();
    expect(within(projectsSection).queryByText('Desafio técnico')).not.toBeInTheDocument();
    expect(within(projectsSection).queryByText('GreenTweet')).not.toBeInTheDocument();
    [
      ['echo-cosmic-energia', 'EchoCosmicEnergia'],
      ['axium', 'Axium'],
      ['dev-schedule', 'DevSchedule'],
    ].forEach(([slug]) => {
      const links = [...projectsSection.querySelectorAll(`a[href="/portfolio/${slug}"]`)];
      expect(links).toHaveLength(2);
      links.forEach((link) => expect(link).toHaveAttribute('href', `/portfolio/${slug}`));
    });
    expect(projectsSection.querySelector('a[href="/portfolio"]')).toHaveTextContent('Ver todos os projetos');

    const projectImages = [...projectsSection.querySelectorAll('img')];
    expect(projectImages).toHaveLength(6);
    projectImages.forEach((image) => {
      expect(image).toHaveAttribute('src', expect.stringMatching(/^\/projects\/.+\.png$/));
      expect(Number(image.getAttribute('width'))).toBeGreaterThan(0);
      expect(Number(image.getAttribute('height'))).toBeGreaterThan(0);
      expect(image).toHaveAccessibleName();
    });
    expect(document.querySelector('video')).not.toBeInTheDocument();

    const heroSection = document.querySelector('[data-home-section="hero"]') as HTMLElement;
    expect(heroSection.querySelector('img[src^="/projects/"]')).not.toBeInTheDocument();
    expect(within(heroSection).getByText('Ideia')).toBeInTheDocument();
    expect(within(heroSection).getByText('Estrutura')).toBeInTheDocument();
    expect(within(heroSection).getByText('03')).toBeInTheDocument();
    expect(within(heroSection).getByText('Experiência digital')).toBeInTheDocument();

    const servicesSection = document.querySelector('[data-home-section="services"]') as HTMLElement;
    expect(within(servicesSection).getAllByRole('heading', { level: 3 }).slice(0, 3).map((heading) => heading.textContent)).toEqual([
      'Landing pages',
      'Sites institucionais',
      'Soluções personalizadas',
    ]);
    expect(within(servicesSection).getByText(/Para campanhas, lançamentos/)).toBeInTheDocument();
    expect(within(servicesSection).getByText(/Para apresentar sua marca/)).toBeInTheDocument();
    expect(within(servicesSection).getByText(/Para necessidades que vão além de uma página/)).toBeInTheDocument();
    expect(within(servicesSection).getByRole('heading', { level: 3, name: 'O projeto pode continuar evoluindo.' })).toBeInTheDocument();

    const valueSection = document.querySelector('[data-home-section="value"]') as HTMLElement;
    expect(within(valueSection).getAllByRole('listitem')).toHaveLength(4);

    const processSection = document.querySelector('[data-home-section="process"]') as HTMLElement;
    expect(within(processSection).getAllByRole('listitem')).toHaveLength(6);
    expect(within(processSection).getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)).toEqual([
      'Conversa',
      'Planejamento',
      'Criação',
      'Ajustes',
      'Publicação',
      'Evolução',
    ]);

    const contactSection = document.querySelector('[data-home-section="contact"]') as HTMLElement;
    expect(within(contactSection).queryByText(/em preparação|em breve/i)).not.toBeInTheDocument();
    expect(within(contactSection).queryByRole('button')).not.toBeInTheDocument();
  });

  it('moves focus to the destination heading after a route change', async () => {
    const user = userEvent.setup();
    renderAt('/');

    await user.click(screen.getByRole('link', { name: 'Ver projetos' }));

    const heading = screen.getByRole('heading', { level: 1, name: 'Projetos reais para contextos diferentes.' });
    expect(screen.getByTestId('location')).toHaveTextContent('/portfolio');
    expect(heading).toHaveFocus();
  });

  it('keeps the skip link first and moves focus to the main content', async () => {
    const user = userEvent.setup();
    renderAt('/');

    await user.tab();
    const skipLink = screen.getByRole('link', { name: 'Pular para o conteúdo principal' });
    expect(skipLink).toHaveFocus();

    await user.click(skipLink);

    expect(screen.getByRole('main')).toHaveFocus();
    expect(screen.getByTestId('location')).toHaveTextContent('/#main-content');
  });

  it('mounts, scrolls and focuses a homepage anchor from another route', async () => {
    const user = userEvent.setup();
    renderAt('/portfolio');

    await user.click(screen.getByRole('link', { name: 'Solicitar orçamento' }));

    const contact = document.getElementById('contato');
    expect(screen.getByTestId('location')).toHaveTextContent('/#contato');
    expect(contact).toHaveFocus();
    expect(contact?.scrollIntoView).toHaveBeenCalledWith({ block: 'start', behavior: 'smooth' });
  });

  it('handles a direct reload-like entry with a hash', () => {
    renderAt('/#processo');

    expect(document.getElementById('processo')).toHaveFocus();
  });

  it('keeps focus and hash coherent with back and forward navigation', async () => {
    const user = userEvent.setup();
    renderAt('/portfolio');

    await user.click(screen.getByRole('link', { name: 'Solicitar orçamento' }));
    expect(document.getElementById('contato')).toHaveFocus();

    await user.click(screen.getByRole('button', { name: 'Voltar no histórico de teste' }));
    expect(screen.getByTestId('location')).toHaveTextContent('/portfolio');
    expect(screen.getByRole('heading', { level: 1, name: 'Projetos reais para contextos diferentes.' })).toHaveFocus();

    await user.click(screen.getByRole('button', { name: 'Avançar no histórico de teste' }));
    expect(screen.getByTestId('location')).toHaveTextContent('/#contato');
    expect(document.getElementById('contato')).toHaveFocus();
  });

  it('focuses an anchor selected within the homepage', async () => {
    const user = userEvent.setup();
    renderAt('/');

    await user.click(screen.getAllByRole('link', { name: 'Serviços' })[0]);

    expect(screen.getByTestId('location')).toHaveTextContent('/#servicos');
    expect(document.getElementById('servicos')).toHaveFocus();
  });

  it('uses non-animated anchor positioning with reduced motion', () => {
    vi.mocked(window.matchMedia).mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    renderAt('/#sobre');

    expect(document.getElementById('sobre')?.scrollIntoView).toHaveBeenCalledWith({ block: 'start', behavior: 'auto' });
  });

  it('restores route metadata after navigation', async () => {
    const user = userEvent.setup();
    renderAt('/');

    await waitFor(() => expect(document.title).toBe('Repage | Sites e soluções digitais'));
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      'Estratégia, design e desenvolvimento para transformar ideias e serviços em experiências digitais profissionais.',
    );
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');

    await user.click(screen.getByRole('link', { name: 'Ver projetos' }));

    await waitFor(() => expect(document.title).toBe(routeMetadata.portfolio.title));
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      'Uma seleção de sites institucionais, e-commerce, landing pages e aplicações web que reúne estrutura, design e desenvolvimento.',
    );
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
  });

  it.each([
    ['/portfolio', routeMetadata.portfolio],
    ['/portfolio/axium', getCaseMetadata({ title: 'Axium — case | Repage', description: 'Case da Axium, com experiência institucional, serviços e conteúdo editorial responsivo.' })],
    ['/privacidade', routeMetadata.privacy],
    ['/cookies', routeMetadata.cookies],
    ['/rota-inexistente', routeMetadata.notFound],
  ])('applies route metadata to %s', async (route, metadata) => {
    renderAt(route);

    await waitFor(() => expect(document.title).toBe(metadata.title));
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute('content', metadata.description);
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      'content',
      metadata.indexing === 'index' ? 'index, follow' : 'noindex, nofollow',
    );
  });
});

describe('primary navigation', () => {
  it('keeps Início in the header only and preserves both logo destinations', async () => {
    const user = userEvent.setup();
    renderAt('/');

    const desktopNavigation = document.querySelector('nav[aria-label="Navegação principal"]') as HTMLElement;
    expect(desktopNavigation).toBeInTheDocument();
    expect(within(desktopNavigation).getAllByRole('link', { hidden: true }).map((link) => link.textContent)).toEqual([
      'Início',
      'Serviços',
      'Projetos',
      'Como funciona',
      'Sobre',
    ]);
    expect(within(desktopNavigation).getByRole('link', { name: 'Início', hidden: true })).toHaveAttribute('href', '/');

    const footer = screen.getByRole('contentinfo');
    expect(within(footer).queryByRole('link', { name: 'Início' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Repage, ir para o início' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Repage, ir para a página inicial' })).toHaveAttribute('href', '/');

    await user.click(screen.getByRole('button', { name: 'Abrir menu' }));
    const mobileNavigation = screen.getByRole('navigation', { name: 'Navegação móvel' });
    expect(within(mobileNavigation).getAllByRole('link').slice(0, 5).map((link) => link.textContent)).toEqual([
      'Início',
      'Serviços',
      'Projetos',
      'Como funciona',
      'Sobre',
    ]);
  });

  it('marks Início active only on the hashless homepage', async () => {
    const user = userEvent.setup();
    renderAt('/');

    await user.click(screen.getByRole('button', { name: 'Abrir menu' }));
    expect(within(screen.getByRole('navigation', { name: 'Navegação móvel' })).getByRole('link', { name: 'Início' })).toHaveAttribute('aria-current', 'location');
  });

  it('does not mark Início active when the homepage has a hash', async () => {
    const user = userEvent.setup();
    renderAt('/#servicos');

    await user.click(screen.getByRole('button', { name: 'Abrir menu' }));
    expect(within(screen.getByRole('navigation', { name: 'Navegação móvel' })).getByRole('link', { name: 'Início' })).not.toHaveAttribute('aria-current', 'location');
  });

  it('keeps programmatic route focus without showing a ring on the route heading', async () => {
    const user = userEvent.setup();
    renderAt('/portfolio');

    await user.click(screen.getByRole('link', { name: 'Repage, ir para o início' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveFocus();
    expect(getComputedStyle(screen.getByRole('heading', { level: 1 })).outlineStyle).toBe('none');
  });
});

describe('mobile menu', () => {
  it('does not render focusable descendants while closed', () => {
    renderAt('/');

    expect(screen.queryByRole('navigation', { name: 'Navegação móvel' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Abrir menu' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('cycles focus between the close button and every mobile navigation link', async () => {
    const user = userEvent.setup();
    renderAt('/');
    const trigger = screen.getByRole('button', { name: 'Abrir menu' });

    await user.click(trigger);

    const navigation = screen.getByRole('navigation', { name: 'Navegação móvel' });
    const links = within(navigation).getAllByRole('link');
    const closeButton = screen.getByRole('button', { name: 'Fechar menu' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(closeButton).toHaveFocus();
    expect(document.body.style.overflow).toBe('hidden');

    await user.tab({ shift: true });
    expect(links.at(-1)).toHaveFocus();

    await user.tab();
    expect(closeButton).toHaveFocus();

    await user.tab();
    expect(links[0]).toHaveFocus();

    links.at(-1)?.focus();
    await user.tab();
    expect(closeButton).toHaveFocus();

    await user.tab({ shift: true });
    expect(links.at(-1)).toHaveFocus();
  });

  it('closes with Escape from a link or the close button and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    renderAt('/');
    const trigger = screen.getByRole('button', { name: 'Abrir menu' });

    await user.click(trigger);
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('navigation', { name: 'Navegação móvel' })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(document.body.style.overflow).toBe('');

    await user.click(trigger);
    screen.getByRole('button', { name: 'Fechar menu' }).focus();
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('navigation', { name: 'Navegação móvel' })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('closes after selecting a link', async () => {
    const user = userEvent.setup();
    renderAt('/');

    await user.click(screen.getByRole('button', { name: 'Abrir menu' }));
    const navigation = screen.getByRole('navigation', { name: 'Navegação móvel' });
    await user.click(within(navigation).getByRole('link', { name: 'Projetos' }));

    expect(screen.queryByRole('navigation', { name: 'Navegação móvel' })).not.toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent('/portfolio');
  });

  it('closes and restores scroll when the desktop breakpoint is reached', async () => {
    const user = userEvent.setup();
    let onChange: ((event: MediaQueryListEvent) => void) | undefined;
    const desktopQuery = {
      matches: false,
      media: '(min-width: 900px)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((type: string, listener: EventListener) => {
        if (type === 'change') onChange = listener as (event: MediaQueryListEvent) => void;
      }),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
    vi.mocked(window.matchMedia).mockImplementation((query) => (
      query === desktopQuery.media
        ? desktopQuery
        : { ...desktopQuery, media: query, matches: false }
    ));

    renderAt('/');
    await user.click(screen.getByRole('button', { name: 'Abrir menu' }));
    expect(document.body.style.overflow).toBe('hidden');

    await waitFor(() => expect(onChange).toBeTypeOf('function'));
    desktopQuery.matches = true;
    act(() => onChange?.({ matches: true, media: desktopQuery.media } as MediaQueryListEvent));

    expect(screen.queryByRole('navigation', { name: 'Navegação móvel' })).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe('');
  });

  it('closes after a programmatic route change', async () => {
    const user = userEvent.setup();
    renderAt('/');

    await user.click(screen.getByRole('button', { name: 'Abrir menu' }));
    await user.click(screen.getByRole('button', { name: 'Navegar ao portfólio de teste' }));

    expect(screen.getByTestId('location')).toHaveTextContent('/portfolio');
    expect(screen.queryByRole('navigation', { name: 'Navegação móvel' })).not.toBeInTheDocument();
  });
});
