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
    ['/portfolio', 'Projetos em preparação.'],
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

  it('routes project and budget CTAs to real destinations without #briefing', () => {
    renderAt('/');

    expect(screen.getByRole('link', { name: 'Conhecer projetos' })).toHaveAttribute('href', '/portfolio');
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

  it('moves focus to the destination heading after a route change', async () => {
    const user = userEvent.setup();
    renderAt('/');

    await user.click(screen.getByRole('link', { name: 'Conhecer projetos' }));

    const heading = screen.getByRole('heading', { level: 1, name: 'Projetos em preparação.' });
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
    expect(screen.getByRole('heading', { level: 1, name: 'Projetos em preparação.' })).toHaveFocus();

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

  it('restores route metadata including noindex after navigation', async () => {
    const user = userEvent.setup();
    renderAt('/');

    await waitFor(() => expect(document.title).toBe('Repage | Sites e soluções digitais'));
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      'Estratégia, design e desenvolvimento para transformar ideias e serviços em experiências digitais profissionais.',
    );
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');

    await user.click(screen.getByRole('link', { name: 'Conhecer projetos' }));

    await waitFor(() => expect(document.title).toBe('Portfólio em preparação | Repage'));
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  });

  it.each([
    ['/portfolio', routeMetadata.portfolio],
    ['/portfolio/axium', getCaseMetadata('Axium')],
    ['/privacidade', routeMetadata.privacy],
    ['/cookies', routeMetadata.cookies],
    ['/rota-inexistente', routeMetadata.notFound],
  ])('applies temporary noindex metadata to %s', async (route, metadata) => {
    renderAt(route);

    await waitFor(() => expect(document.title).toBe(metadata.title));
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute('content', metadata.description);
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
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
    expect(links[0]).toHaveFocus();
    expect(document.body.style.overflow).toBe('hidden');

    await user.tab({ shift: true });
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
