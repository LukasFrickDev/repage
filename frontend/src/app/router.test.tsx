import { act, render, screen, waitFor, within } from '@testing-library/react';
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
