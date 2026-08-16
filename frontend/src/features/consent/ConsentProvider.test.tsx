import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
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
  beforeEach(() => window.localStorage.clear());

  it('shows the initial banner without moving focus and persists rejection', async () => {
    const user = userEvent.setup();
    renderConsent();

    expect(screen.getByRole('region', { name: 'Sua privacidade importa' })).toBeInTheDocument();
    expect(document.activeElement).toBe(document.body);
    await user.click(screen.getByRole('button', { name: 'Rejeitar não essenciais' }));

    expect(screen.queryByRole('region', { name: 'Sua privacidade importa' })).not.toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem(CONSENT_STORAGE_KEY) ?? '{}')).toMatchObject({
      version: 1,
      necessary: true,
      analytics: false,
      advertising: false,
    });
  });

  it('opens an accessible preferences dialog and restores focus after Escape', async () => {
    const user = userEvent.setup();
    renderConsent();
    const personalize = screen.getByRole('button', { name: 'Personalizar' });

    await user.click(personalize);
    expect(screen.getByRole('dialog', { name: 'Preferências de cookies' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Permitir Analíticos' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Permitir Publicitários' })).not.toBeChecked();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Fechar preferências' }));

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(document.activeElement).toBe(personalize));
  });

  it('saves customized categories and keeps the choice after remount', async () => {
    const user = userEvent.setup();
    const rendered = renderConsent();

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
