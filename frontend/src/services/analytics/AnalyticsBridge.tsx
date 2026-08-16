import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useConsent } from '../../features/consent/useConsent';
import { setAnalyticsConsent, trackPageView } from './analytics';

export function AnalyticsBridge() {
  const { preference } = useConsent();
  const location = useLocation();

  useEffect(() => {
    setAnalyticsConsent(preference.analytics);
    if (preference.analytics) trackPageView(location.pathname);
  }, [location.pathname, preference.analytics]);

  return null;
}
