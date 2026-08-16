import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ConsentProvider } from './ConsentProvider';
import { CONSENT_STORAGE_KEY } from './types';

function renderConsent() {
  return render(
    <MemoryRouter>
      <ConsentProvider>
        <main><button type="button">Abrir página</button></main>
      </ConsentProvider>
    </MemoryRouter>,
  );
}

describe('ConsentProvider', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    window.localStorage.clear();
  });

  afterEach(() => vi.useRealTimers());

  it('keeps the banner mounted but inactive until its entry delay', () => {
    vi.useFakeTimers();
    renderConsent();

    const banner = screen.getByRole('region', { hidden: true });
    expect(banner).toHaveAttribute('aria-hidden', 'true');
    expect(banner).toHaveAttribute('inert');
    expect(within(banner).getByRole('button', { name: 'Recusar opcionais', hidden: true })).toHaveAttribute('tabindex', '-1');
    expect(within(banner).getByRole('link', { name: 'Política de Cookies', hidden: true })).toHaveAttribute('tabindex', '-1');
    act(() => vi.advanceTimersByTime(1599));
    expect(banner).toHaveAttribute('aria-hidden', 'true');
    act(() => vi.advanceTimersByTime(1));
    expect(banner).toHaveAttribute('aria-hidden', 'false');
    expect(within(banner).getByRole('button', { name: 'Recusar opcionais' })).toHaveAttribute('tabindex', '0');
    expect(document.activeElement).toBe(document.body);
    vi.useRealTimers();
  });

  it('persists rejection after the delayed banner appears', async () => {
    vi.useFakeTimers();
    renderConsent();
    act(() => vi.advanceTimersByTime(1600));
    vi.useRealTimers();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Recusar opcionais' }));

    expect(screen.queryByRole('region', { name: 'Sua privacidade importa' })).not.toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem(CONSENT_STORAGE_KEY) ?? '{}')).toMatchObject({
      version: 1,
      necessary: true,
      analytics: false,
      advertising: false,
    });
  });

  it('reveals the banner immediately when reduced motion is preferred', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    renderConsent();
    expect(screen.getByRole('region', { name: 'Sua privacidade importa' })).toBeInTheDocument();
  });

  it('opens an accessible preferences dialog and restores focus after Escape', async () => {
    vi.useFakeTimers();
    renderConsent();
    act(() => vi.advanceTimersByTime(1600));
    vi.useRealTimers();
    const user = userEvent.setup();
    const personalize = screen.getByRole('button', { name: 'Personalizar' });

    await user.click(personalize);
    const dialog = screen.getByRole('dialog', { name: 'Preferências de cookies' });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: 'Recusar opcionais' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Permitir Analíticos' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Permitir Publicitários' })).not.toBeChecked();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Fechar preferências' }));

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(document.activeElement).toBe(personalize));
  });

  it('saves customized categories and keeps the choice after remount', async () => {
    vi.useFakeTimers();
    const rendered = renderConsent();
    act(() => vi.advanceTimersByTime(1600));
    vi.useRealTimers();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Personalizar' }));
    await user.click(screen.getByRole('checkbox', { name: 'Permitir Analíticos' }));
    await user.click(screen.getByRole('button', { name: 'Salvar preferências' }));
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem(CONSENT_STORAGE_KEY) ?? '{}')).toMatchObject({ analytics: true, advertising: false });

    rendered.unmount();
    renderConsent();
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });
});
