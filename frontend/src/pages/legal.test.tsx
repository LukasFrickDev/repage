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
  it('renders the factual pre-launch privacy policy', () => {
    renderPage('privacy');

    expect(screen.getByRole('heading', { level: 1, name: 'Política de Privacidade' })).toBeInTheDocument();
    expect(screen.getByText(/A Repage é uma marca conduzida por Lukas Frick/)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'contato@repage.com.br' })).toHaveLength(2);
    expect(screen.getAllByRole('link', { name: 'contato@repage.com.br' })[0]).toHaveAttribute('href', 'mailto:contato@repage.com.br');
    expect(screen.getByText('versão da Política registrada no envio.')).toBeInTheDocument();
    expect(screen.getByText(/Os dados de solicitação são mantidos pelo período necessário/)).toBeInTheDocument();
    expect(screen.getByText(/O Google Analytics 4 é uma tecnologia não essencial/)).toBeInTheDocument();
    expect(screen.getByText(/Versão: pré-lançamento v1/)).toBeInTheDocument();
    expect(screen.queryByText(/Política de Privacidade em preparação/)).not.toBeInTheDocument();
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
    expect(screen.getByText(/Google Ads, Meta Pixel, remarketing/)).toBeInTheDocument();
    expect(screen.getByText(/não são carregados atualmente/)).toBeInTheDocument();
    expect(screen.getByText(/pré-lançamento · pre-launch-v1/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Revisar preferências' }));
    expect(screen.getByRole('dialog', { name: 'Preferências de cookies' })).toBeInTheDocument();
  });
});
