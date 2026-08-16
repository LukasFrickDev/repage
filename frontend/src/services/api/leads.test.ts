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
  company_website: '',
};
const metadata = {
  idempotencyKey: '00000000-0000-4000-8000-000000000001',
  formStartedAt: '2026-08-15T12:00:00.000Z',
};

describe('lead API client', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('posts the typed public payload with Idempotency-Key and technical fields', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      status: 'received',
      message: 'Recebemos sua solicitação.',
      request_id: 'request-id',
    }), { status: 201, headers: { 'Content-Type': 'application/json' } }));
    vi.stubGlobal('fetch', fetchMock);

    await createLead(values, metadata);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(options.headers).toEqual({
      'Content-Type': 'application/json',
      'Idempotency-Key': metadata.idempotencyKey,
    });
    expect(options.body).toContain('"source":"website"');
    expect(options.body).toContain('"form_started_at":"2026-08-15T12:00:00.000Z"');
  });

  it('maps safe API field errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({
      error: { code: 'validation_error', message: 'Revise os campos informados.', fields: { email: ['Informe um e-mail válido.'] } },
      request_id: 'request-id',
    }), { status: 400, headers: { 'Content-Type': 'application/json' } })));

    await expect(createLead(values, metadata)).rejects.toMatchObject({
      status: 400,
      code: 'validation_error',
      fields: { email: ['Informe um e-mail válido.'] },
    });
  });

  it('surfaces network failures without retry', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError('network unavailable'));
    vi.stubGlobal('fetch', fetchMock);

    await expect(createLead(values, metadata)).rejects.toThrow('network unavailable');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
