export const CONSENT_STORAGE_KEY = 'repage:consent:v1';
export const CONSENT_VERSION = 1 as const;

export type ConsentPreference = {
  version: typeof CONSENT_VERSION;
  necessary: true;
  analytics: boolean;
  advertising: boolean;
  updatedAt: string;
};

export type ConsentState = {
  preference: ConsentPreference;
  hasValidChoice: boolean;
};

export const defaultConsentPreference = (): ConsentPreference => ({
  version: CONSENT_VERSION,
  necessary: true,
  analytics: false,
  advertising: false,
  updatedAt: new Date(0).toISOString(),
});
