import {
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  type ConsentPreference,
} from './types';

const isRecord = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object' && value !== null && !Array.isArray(value)
);

export function isValidConsentPreference(value: unknown): value is ConsentPreference {
  if (!isRecord(value)) return false;

  const keys = Object.keys(value).sort();
  const expectedKeys = ['advertising', 'analytics', 'necessary', 'updatedAt', 'version'];

  return keys.length === expectedKeys.length
    && keys.every((key, index) => key === expectedKeys[index])
    && value.version === CONSENT_VERSION
    && value.necessary === true
    && typeof value.analytics === 'boolean'
    && typeof value.advertising === 'boolean'
    && typeof value.updatedAt === 'string'
    && Number.isFinite(Date.parse(value.updatedAt));
}

export function readConsentPreference(): ConsentPreference | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    return isValidConsentPreference(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeConsentPreference(preference: ConsentPreference): boolean {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(preference));
    return true;
  } catch {
    return false;
  }
}
