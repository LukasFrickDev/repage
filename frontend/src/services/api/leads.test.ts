import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createLead } from './leads';

const values = {
  name: 'Ana Souza',
  email: 'ana@example.com',
  whatsapp: '(11) 99999-9999',
  project_type: 'landing_page' as const,
  business_name: '',
  message: '',
  privacy_policy_acknowledged: true,
};

describe('lead API client', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('posts the typed public payload without retry or Idempotency-Key', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      status: 'received',
      message: 'Recebemos sua solicitação.',
      request_id: 'request-id',
    }), { status: 201, headers: { 'Content-Type': 'application/json' } }));
    vi.stubGlobal('fetch', fetchMock);

    await createLead(values);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(options.headers).toEqual({ 'Content-Type': 'application/json' });
    expect(options.body).toContain('"source":"website"');
    expect(options.body).not.toContain('Idempotency-Key');
  });

  it('maps safe API field errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({
      error: { code: 'validation_error', message: 'Revise os campos informados.', fields: { email: ['Informe um e-mail válido.'] } },
      request_id: 'request-id',
    }), { status: 400, headers: { 'Content-Type': 'application/json' } })));

    await expect(createLead(values)).rejects.toMatchObject({
      status: 400,
      code: 'validation_error',
      fields: { email: ['Informe um e-mail válido.'] },
    });
  });

  it('surfaces network failures without retry', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError('network unavailable'));
    vi.stubGlobal('fetch', fetchMock);

    await expect(createLead(values)).rejects.toThrow('network unavailable');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
