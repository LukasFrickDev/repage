import { describe, expect, it } from 'vitest';
import {
  leadFormSchema,
  PRIVACY_POLICY_VERSION,
  formatPhoneInput,
  normalizeWhatsApp,
  projectTypeOptions,
  toLeadCreatePayload,
} from './schema';

const validValues = {
  name: 'Ana Souza',
  email: 'ANA@EXEMPLO.COM',
  whatsapp: '(11) 99999-9999',
  project_type: 'institutional_site' as const,
  business_name: '',
  message: '',
  privacy_policy_acknowledged: true,
};

describe('lead form schema', () => {
  it('exposes only the public project types', () => {
    expect(projectTypeOptions.map(({ value }) => value)).toEqual([
      'landing_page',
      'institutional_site',
      'custom_solution',
      'support_or_evolution',
      'not_sure',
    ]);
  });

  it('requires public fields and privacy acknowledgement', () => {
    const result = leadFormSchema.safeParse({ ...validValues, name: '', privacy_policy_acknowledged: false });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.path[0])).toEqual(expect.arrayContaining(['name', 'privacy_policy_acknowledged']));
    }
  });

  it('accepts optional fields as empty strings', () => {
    expect(leadFormSchema.safeParse(validValues).success).toBe(true);
  });

  it.each([
    ['(11) 99999-9999', '+5511999999999'],
    ['11999999999', '+5511999999999'],
    ['+55 11 99999-9999', '+5511999999999'],
  ])('normalizes WhatsApp %s to %s', (value, expected) => {
    expect(normalizeWhatsApp(value)).toBe(expected);
  });

  it('rejects invalid WhatsApp values', () => {
    expect(normalizeWhatsApp('123')).toBeNull();
    expect(leadFormSchema.safeParse({ ...validValues, whatsapp: '123' }).success).toBe(false);
  });

  it.each([
    ['1134567890', '(11) 3456-7890'],
    ['11958244081', '(11) 95824-4081'],
    ['+55 11 95824-4081', '(11) 95824-4081'],
    ['11abc95824-4081', '(11) 95824-4081'],
  ])('formats phone input %s as %s', (value, expected) => {
    expect(formatPhoneInput(value)).toBe(expected);
  });

  it('builds a public payload with website as the fixed source', () => {
    const parsed = leadFormSchema.parse(validValues);
    const payload = toLeadCreatePayload(parsed);

    expect(payload).toMatchObject({
      email: 'ana@exemplo.com',
      whatsapp: '+5511999999999',
      source: 'website',
      privacy_policy_acknowledged: true,
      privacy_policy_version: PRIVACY_POLICY_VERSION,
    });
    expect(payload).not.toHaveProperty('manual');
  });
});
