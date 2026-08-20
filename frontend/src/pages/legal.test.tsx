import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { ConsentProvider } from '../features/consent/ConsentProvider';
import { CookiesPage } from './Cookies';
import { PrivacyPage } from './Privacy';

function renderPage(page: 'privacy' | 'cookies') {
  return render(
    <MemoryRouter initialEntries={[`/${page === 'privacy' ? 'privacidade' : 'cookies'}`]}>
      <ConsentProvider>
        <Routes>
          <Route path="privacidade" element={<PrivacyPage />} />
          <Route path="cookies" element={<CookiesPage />} />
        </Routes>
      </ConsentProvider>
    </MemoryRouter>,
  );
}

describe('legal pages', () => {
  it('renders the final privacy policy', () => {
    renderPage('privacy');

    expect(screen.getByRole('heading', { level: 1, name: 'Política de Privacidade' })).toBeInTheDocument();
    expect(screen.getByText(/A Repage é uma marca conduzida por Lukas Frick/)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'contato@repage.com.br' })).toHaveLength(2);
    expect(screen.getAllByRole('link', { name: 'contato@repage.com.br' })[0]).toHaveAttribute('href', 'mailto:contato@repage.com.br');
    expect(screen.getByText('versão da Política registrada no envio.')).toBeInTheDocument();
    expect(screen.getByText(/Os dados de solicitação são mantidos pelo período necessário/)).toBeInTheDocument();
    expect(screen.getByText(/O Google Analytics 4 é uma tecnologia não essencial/)).toBeInTheDocument();
    expect(screen.getByText(/Versão: 2026-08-20-v1/)).toBeInTheDocument();
    expect(screen.getByText(/Última atualização: 20 de agosto de 2026/)).toBeInTheDocument();
    expect(screen.queryByText(/pré-lançamento|rascunho técnico|revisão jurídica definitiva/i)).not.toBeInTheDocument();
  });

  it('renders the cookie policy and opens the real preference center', async () => {
    const user = userEvent.setup();
    renderPage('cookies');

    expect(screen.getByRole('heading', { level: 1, name: 'Política de Cookies' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Necessários' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Analíticos' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Publicitários' })).toBeInTheDocument();
    expect(screen.getByText('repage:consent:v1')).toBeInTheDocument();
    expect(screen.getByText('_ga')).toBeInTheDocument();
    const advertising = screen.getByRole('heading', { name: 'Publicitários' }).closest('section');
    expect(advertising).toHaveTextContent(/advertising=true.*tag Google/);
    expect(advertising).toHaveTextContent(/ad_storage.*ad_user_data.*ad_personalization/);
    expect(advertising).toHaveTextContent(/Google Ads.*remarketing.*Enhanced Conversions.*Meta Pixel/);
    expect(advertising).toHaveTextContent(/campanha publicitária ativa/);
    expect(screen.getByText(/Versão: 2026-08-20-v1/)).toBeInTheDocument();
    expect(screen.queryByText(/pré-lançamento|pre-launch-v1/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Revisar preferências' }));
    expect(screen.getByRole('dialog', { name: 'Preferências de cookies' })).toBeInTheDocument();
  });
});
