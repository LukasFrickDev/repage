import type { LeadFormValues } from '../../features/lead-form/schema';
import { toLeadCreatePayload } from '../../features/lead-form/schema';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');

export type LeadApiFields = Record<string, string[]>;

export class LeadApiError extends Error {
  readonly code: string;
  readonly fields?: LeadApiFields;
  readonly status: number;

  constructor(status: number, code: string, message: string, fields?: LeadApiFields) {
    super(message);
    this.name = 'LeadApiError';
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

type LeadCreatedResponse = {
  status: 'received';
  message: string;
  request_id: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseFields(value: unknown): LeadApiFields | undefined {
  if (!isRecord(value)) return undefined;
  const fields: LeadApiFields = {};
  Object.entries(value).forEach(([name, messages]) => {
    if (Array.isArray(messages) && messages.every((message) => typeof message === 'string')) {
      fields[name] = messages;
    }
  });
  return Object.keys(fields).length > 0 ? fields : undefined;
}

async function parseJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

function parseError(status: number, body: unknown): LeadApiError {
  const error = isRecord(body) && isRecord(body.error) ? body.error : undefined;
  const code = error && typeof error.code === 'string' ? error.code : 'server_error';
  const message = error && typeof error.message === 'string'
    ? error.message
    : 'Não foi possível processar sua solicitação agora.';
  const fields = error ? parseFields(error.fields) : undefined;
  return new LeadApiError(status, code, message, fields);
}

function isCreatedResponse(body: unknown): body is LeadCreatedResponse {
  return isRecord(body)
    && body.status === 'received'
    && typeof body.message === 'string'
    && typeof body.request_id === 'string';
}

export async function createLead(values: LeadFormValues): Promise<LeadCreatedResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/leads/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toLeadCreatePayload(values)),
  });
  const body = await parseJson(response);

  if (!response.ok) throw parseError(response.status, body);
  if (response.status !== 201 || !isCreatedResponse(body)) {
    throw new LeadApiError(500, 'server_error', 'Não foi possível confirmar o envio.');
  }
  return body;
}
