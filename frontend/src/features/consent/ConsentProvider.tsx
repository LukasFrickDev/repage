import {
  type PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { ConsentBanner } from './ConsentBanner';
import { ConsentPreferencesDialog } from './ConsentPreferencesDialog';
import { ConsentContext, type ConsentContextValue } from './context';
import { readConsentPreference, writeConsentPreference } from './storage';
import {
  defaultConsentPreference,
  type ConsentPreference,
} from './types';

export function ConsentProvider({ children }: PropsWithChildren) {
  const [initialConsent] = useState(() => {
    const stored = readConsentPreference();
    return { preference: stored ?? defaultConsentPreference(), hasValidChoice: stored !== null };
  });
  const [preference, setPreference] = useState<ConsentPreference>(initialConsent.preference);
  const [hasValidChoice, setHasValidChoice] = useState(initialConsent.hasValidChoice);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  const save = useCallback((next: Pick<ConsentPreference, 'analytics' | 'advertising'>) => {
    const nextPreference: ConsentPreference = {
      version: 1,
      necessary: true,
      analytics: next.analytics,
      advertising: next.advertising,
      updatedAt: new Date().toISOString(),
    };

    writeConsentPreference(nextPreference);
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
      {!hasValidChoice && <ConsentBanner />}
      {preferencesOpen && <ConsentPreferencesDialog />}
    </ConsentContext.Provider>
  );
}
