import { z } from 'zod';

export const PRIVACY_POLICY_VERSION = import.meta.env.VITE_PRIVACY_POLICY_VERSION?.trim() || 'pre-launch-v1';

export const projectTypeOptions = [
  { value: 'landing_page', label: 'Landing page' },
  { value: 'institutional_site', label: 'Site institucional' },
  { value: 'custom_solution', label: 'Solução personalizada' },
  { value: 'support_or_evolution', label: 'Suporte ou evolução' },
  { value: 'not_sure', label: 'Ainda não sei' },
] as const;

const projectTypeValues = projectTypeOptions.map(({ value }) => value) as [string, ...string[]];

export const leadFormSchema = z.object({
  name: z.string().trim().min(1, 'Informe seu nome.').max(120, 'O nome deve ter no máximo 120 caracteres.'),
  email: z.string().trim().min(1, 'Informe seu e-mail.').email('Informe um e-mail válido.').max(254, 'O e-mail deve ter no máximo 254 caracteres.'),
  whatsapp: z.string().trim().min(1, 'Informe seu telefone.').max(32, 'O telefone informado é muito longo.').refine(
    (value) => normalizeWhatsApp(value) !== null,
    'Informe um telefone brasileiro válido.',
  ),
  project_type: z.enum(projectTypeValues, { error: 'Selecione um tipo de projeto.' }),
  business_name: z.string().trim().max(160, 'O nome deve ter no máximo 160 caracteres.').default(''),
  message: z.string().trim().max(4000, 'A mensagem deve ter no máximo 4000 caracteres.').default(''),
  privacy_policy_acknowledged: z.boolean().refine(
    (value) => value,
    'É necessário declarar ciência da Política de Privacidade.',
  ),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;
export type LeadFormInput = z.input<typeof leadFormSchema>;

export type LeadFieldName = keyof LeadFormValues;

export function normalizeWhatsApp(value: string): string | null {
  const digits = value.replace(/\D/g, '');
  let nationalNumber = digits;

  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
    nationalNumber = digits.slice(2);
  } else if (digits.length !== 10 && digits.length !== 11) {
    return null;
  }

  if (nationalNumber[0] === '0') return null;
  if (nationalNumber.length === 10 && !'2345'.includes(nationalNumber[2] ?? '')) return null;
  if (nationalNumber.length === 11 && nationalNumber[2] !== '9') return null;

  return `+55${nationalNumber}`;
}

export function formatPhoneInput(value: string): string {
  const hasCountryCode = value.trim().startsWith('+55');
  const digits = value.replace(/\D/g, '');
  const nationalDigits = (hasCountryCode && digits.startsWith('55') ? digits.slice(2) : digits).slice(0, 11);

  if (nationalDigits.length === 0) return '';
  if (nationalDigits.length <= 2) return `(${nationalDigits}`;

  const areaCode = nationalDigits.slice(0, 2);
  const localNumber = nationalDigits.slice(2);
  const localLength = nationalDigits.length === 11 ? 5 : 4;
  const formattedLocal = localNumber.length > localLength
    ? `${localNumber.slice(0, localLength)}-${localNumber.slice(localLength)}`
    : localNumber;

  return `(${areaCode}) ${formattedLocal}`;
}

export function toLeadCreatePayload(values: LeadFormValues) {
  const whatsapp = normalizeWhatsApp(values.whatsapp);
  if (!whatsapp) throw new Error('WhatsApp inválido.');

  return {
    name: values.name.trim(),
    email: values.email.trim().toLowerCase(),
    whatsapp,
    project_type: values.project_type,
    business_name: values.business_name.trim(),
    message: values.message.trim(),
    privacy_policy_acknowledged: true as const,
    privacy_policy_version: PRIVACY_POLICY_VERSION,
    source: 'website' as const,
  };
}
