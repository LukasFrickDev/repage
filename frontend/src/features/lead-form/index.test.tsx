import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { LeadForm } from './index';

function renderForm() {
  return render(
    <MemoryRouter>
      <LeadForm />
    </MemoryRouter>,
  );
}

async function fillRequiredFields(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Nome'), 'Ana Souza');
  await user.type(screen.getByLabelText('E-mail'), 'ana@example.com');
  await user.type(screen.getByLabelText('WhatsApp'), '(11) 99999-9999');
  await user.selectOptions(screen.getByLabelText('Tipo de projeto'), 'landing_page');
  await user.click(screen.getByLabelText(/Li e estou ciente/));
}

describe('LeadForm', () => {
  it('focuses the first invalid field and exposes accessible errors', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole('button', { name: 'Solicitar orçamento' }));

    expect(screen.getAllByRole('alert')[0]).toHaveTextContent('Revise os campos destacados');
    expect(screen.getByLabelText('Nome')).toHaveFocus();
    expect(screen.getByLabelText('Nome')).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows loading, then success, and clears only after a valid 201', async () => {
    const user = userEvent.setup();
    let resolveRequest!: (response: Response) => void;
    vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>((resolve) => { resolveRequest = resolve; })));
    renderForm();
    await fillRequiredFields(user);
    await user.type(screen.getByLabelText('Marca, negócio ou projeto'), 'Negócio fictício');

    await user.click(screen.getByRole('button', { name: 'Solicitar orçamento' }));
    expect(screen.getByRole('button', { name: 'Enviando…' })).toBeDisabled();
    expect(screen.getByLabelText('Nome')).toHaveValue('Ana Souza');

    resolveRequest(new Response(JSON.stringify({ status: 'received', message: 'Recebemos sua solicitação.', request_id: 'request-id' }), { status: 201 }));
    expect(await screen.findByRole('status')).toHaveTextContent('Solicitação recebida.');
    expect(screen.getByLabelText('Nome')).toHaveValue('');
  });

  it('maps API field errors and preserves entered values without retry', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      error: { code: 'validation_error', message: 'Revise os campos informados.', fields: { email: ['Informe um e-mail válido.'] } },
      request_id: 'request-id',
    }), { status: 400 }));
    vi.stubGlobal('fetch', fetchMock);
    renderForm();
    await fillRequiredFields(user);
    await user.click(screen.getByRole('button', { name: 'Solicitar orçamento' }));

    await waitFor(() => expect(screen.getByText('Informe um e-mail válido.')).toBeInTheDocument());
    expect(screen.getByLabelText('Nome')).toHaveValue('Ana Souza');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('preserves values and shows an ambiguous network error', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('network unavailable')));
    renderForm();
    await fillRequiredFields(user);
    await user.click(screen.getByRole('button', { name: 'Solicitar orçamento' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível confirmar o envio.');
    expect(screen.getByLabelText('Nome')).toHaveValue('Ana Souza');
  });

  it('keeps the privacy link accessible and unchecked initially', () => {
    renderForm();

    expect(screen.getByRole('checkbox', { name: /Li e estou ciente/ })).not.toBeChecked();
    expect(screen.getByRole('link', { name: 'Política de Privacidade' })).toHaveAttribute('href', '/privacidade');
  });
});
