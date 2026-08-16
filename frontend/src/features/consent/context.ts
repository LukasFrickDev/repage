import { createContext } from 'react';
import type { ConsentPreference, ConsentState } from './types';

export type ConsentContextValue = ConsentState & {
  acceptAll: () => void;
  rejectNonEssential: () => void;
  savePreferences: (preference: Pick<ConsentPreference, 'analytics' | 'advertising'>) => void;
  openPreferences: () => void;
  closePreferences: () => void;
};

export const ConsentContext = createContext<ConsentContextValue | null>(null);
