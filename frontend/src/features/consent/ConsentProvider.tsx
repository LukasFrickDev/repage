import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ConsentBanner } from './ConsentBanner';
import { ConsentPreferencesDialog } from './ConsentPreferencesDialog';
import { ConsentContext, type ConsentContextValue } from './context';
import { ANALYTICS_EVENT_NAMES, AnalyticsBridge, setAnalyticsConsent, trackEvent } from '../../services/analytics';
import { readConsentPreference, writeConsentPreference } from './storage';
import {
  defaultConsentPreference,
  type ConsentPreference,
} from './types';

export function ConsentProvider({ children }: PropsWithChildren) {
  const [preference, setPreference] = useState<ConsentPreference>(defaultConsentPreference);
  const [hasValidChoice, setHasValidChoice] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    const stored = readConsentPreference();
    if (!stored) return;
    setPreference(stored);
    setHasValidChoice(true);
  }, []);

  const save = useCallback((next: Pick<ConsentPreference, 'analytics' | 'advertising'>) => {
    const nextPreference: ConsentPreference = {
      version: 1,
      necessary: true,
      analytics: next.analytics,
      advertising: next.advertising,
      updatedAt: new Date().toISOString(),
    };

    writeConsentPreference(nextPreference);
    setAnalyticsConsent(nextPreference.analytics, nextPreference.advertising);
    if (nextPreference.analytics) {
      trackEvent(ANALYTICS_EVENT_NAMES.consentUpdate, {
        analytics: true,
        advertising: nextPreference.advertising,
      });
    }
    setPreference(nextPreference);
    setHasValidChoice(true);
    setPreferencesOpen(false);
  }, []);

  const value = useMemo<ConsentContextValue>(() => ({
    preference,
    hasValidChoice,
    acceptAll: () => save({ analytics: true, advertising: true }),
    rejectNonEssential: () => save({ analytics: false, advertising: false }),
    savePreferences: save,
    openPreferences: () => setPreferencesOpen(true),
    closePreferences: () => setPreferencesOpen(false),
  }), [hasValidChoice, preference, save]);

  return (
    <ConsentContext.Provider value={value}>
      {children}
      <AnalyticsBridge />
      {!hasValidChoice && <ConsentBanner />}
      {preferencesOpen && <ConsentPreferencesDialog />}
    </ConsentContext.Provider>
  );
}
