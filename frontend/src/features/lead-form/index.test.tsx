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
  await user.type(screen.getByLabelText('Telefone'), '11999999999');
  await user.click(screen.getByRole('combobox', { name: 'Tipo de projeto' }));
  await user.click(screen.getByRole('option', { name: 'Landing page' }));
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

  it('explains a policy version mismatch without clearing the form', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({
      error: { code: 'privacy_policy_version_mismatch', message: 'Atualize a página.' },
      request_id: 'request-id',
    }), { status: 400 })));
    renderForm();
    await fillRequiredFields(user);
    await user.click(screen.getByRole('button', { name: 'Solicitar orçamento' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('A Política de Privacidade foi atualizada.');
    expect(screen.getByLabelText('Nome')).toHaveValue('Ana Souza');
  });

  it('masks fixed and mobile phone values and removes letters', async () => {
    const user = userEvent.setup();
    renderForm();
    const phone = screen.getByLabelText('Telefone');

    await user.type(phone, '11abc34567890');
    expect(phone).toHaveValue('(11) 3456-7890');
    await user.clear(phone);
    await user.paste('+55 11 95824-4081');
    expect(phone).toHaveValue('(11) 95824-4081');
  });

  it('supports mouse and keyboard interaction in the project type combobox', async () => {
    const user = userEvent.setup();
    renderForm();
    const combobox = screen.getByRole('combobox', { name: 'Tipo de projeto' });

    await user.click(combobox);
    expect(screen.getByRole('listbox', { name: 'Opções de tipo de projeto' })).toBeVisible();
    await user.click(screen.getByRole('option', { name: 'Site institucional' }));
    expect(combobox).toHaveTextContent('Site institucional');
    await user.click(combobox);
    await user.keyboard('{Escape}');
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
    await user.click(combobox);
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(combobox).toHaveTextContent('Suporte ou evolução');
  });

  it('keeps the privacy link accessible and unchecked initially', () => {
    renderForm();

    expect(screen.getByRole('checkbox', { name: /Li e estou ciente/ })).not.toBeChecked();
    expect(screen.getByRole('link', { name: 'Política de Privacidade' })).toHaveAttribute('href', '/privacidade');
    const whatsappLink = screen.getByRole('link', { name: 'Falar pelo WhatsApp' });
    expect(whatsappLink).toHaveAttribute('href', 'https://wa.me/5511958244081?text=Ol%C3%A1!%20Conheci%20a%20Repage%20pelo%20site%20e%20gostaria%20de%20conversar%20sobre%20um%20projeto.');
    expect(whatsappLink).toHaveAttribute('target', '_blank');
  });
});
