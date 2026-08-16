import { beforeEach, describe, expect, it } from 'vitest';
import { CONSENT_STORAGE_KEY } from './types';
import { isValidConsentPreference, readConsentPreference } from './storage';

describe('consent storage', () => {
  beforeEach(() => window.localStorage.clear());

  it('accepts only a complete compatible preference', () => {
    const preference = {
      version: 1,
      necessary: true,
      analytics: false,
      advertising: false,
      updatedAt: '2026-08-16T12:00:00.000Z',
    };

    expect(isValidConsentPreference(preference)).toBe(true);
    expect(readConsentPreference()).toBeNull();
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(preference));
    expect(readConsentPreference()).toEqual(preference);
  });

  it.each([
    null,
    '{not-json',
    { version: 2, necessary: true, analytics: false, advertising: false, updatedAt: '2026-08-16T12:00:00.000Z' },
    { version: 1, necessary: false, analytics: false, advertising: false, updatedAt: '2026-08-16T12:00:00.000Z' },
    { version: 1, necessary: true, analytics: 'no', advertising: false, updatedAt: '2026-08-16T12:00:00.000Z' },
    { version: 1, necessary: true, analytics: false, advertising: false, updatedAt: 'not-a-date' },
  ])('treats %s as having no valid choice', (value) => {
    if (value === null) {
      window.localStorage.removeItem(CONSENT_STORAGE_KEY);
    } else {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, typeof value === 'string' ? value : JSON.stringify(value));
    }

    expect(readConsentPreference()).toBeNull();
  });
});
