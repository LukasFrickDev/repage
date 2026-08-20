import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  configureAnalytics,
  resetAnalyticsForTests,
  setAnalyticsConsent,
  trackEvent,
  trackPageView,
} from './analytics';

describe('analytics service', () => {
  beforeEach(() => {
    resetAnalyticsForTests();
    configureAnalytics({ measurementId: 'G-TEST123' });
  });

  afterEach(() => resetAnalyticsForTests());

  it('does not create a script or queue before analytics consent', () => {
    trackPageView('/portfolio');
    trackEvent('whatsapp_click');
    trackEvent('consent_update', { analytics: true, advertising: false });
    setAnalyticsConsent(false);

    expect(document.querySelector('script[data-repage-ga4]')).not.toBeInTheDocument();
    expect(window.dataLayer).toBeUndefined();
  });

  it("does not initialize Google when only advertising is granted", () => {
    setAnalyticsConsent(false, true);

    expect(document.querySelector("script[data-repage-ga4]")).not.toBeInTheDocument();
    expect(window.dataLayer).toBeUndefined();
  });

  it("maps advertising to Consent Mode and updates it while analytics is active", () => {
    setAnalyticsConsent(true, false);

    expect(window.dataLayer).toEqual(expect.arrayContaining([
      ["consent", "default", {
        analytics_storage: "granted",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      }],
    ]));

    setAnalyticsConsent(true, true);
    expect(window.dataLayer).toContainEqual(["consent", "update", {
      analytics_storage: "granted",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    }]);

    setAnalyticsConsent(true, false);
    expect(window.dataLayer).toContainEqual(["consent", "update", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    }]);
  });

  it("loads the configured script once and sends only central events", () => {
    setAnalyticsConsent(true);
    setAnalyticsConsent(true);
    trackPageView('/portfolio?email=private#contact');
    trackPageView('/portfolio');
    trackEvent('case_view', { project_slug: 'public-project' });

    expect(document.querySelectorAll('script[data-repage-ga4]')).toHaveLength(1);
    expect(document.querySelector<HTMLScriptElement>('script[data-repage-ga4]')?.src)
      .toBe('https://www.googletagmanager.com/gtag/js?id=G-TEST123');
    expect(window.dataLayer).toEqual(expect.arrayContaining([
      ['config', 'G-TEST123', { send_page_view: false }],
      ['page_view', { page_path: '/portfolio' }],
      ['case_view', { project_slug: 'public-project' }],
    ]));
    expect(window.dataLayer?.some((entry) => JSON.stringify(entry).includes('email=private'))).toBe(false);
  });

  it('blocks after revocation, disables GA, and removes only known cookies', () => {
    document.cookie = '_ga=abc; path=/';
    document.cookie = '_ga_G_TEST123=def; path=/';
    document.cookie = 'repage:consent:v1=keep; path=/';
    setAnalyticsConsent(true);
    setAnalyticsConsent(false);
    trackEvent('whatsapp_click');

    expect(window["ga-disable-G-TEST123"]).toBe(true);
    expect(window.dataLayer).toContainEqual(["consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    }]);
    expect(document.cookie).toContain('repage:consent:v1=keep');
    expect(document.cookie).not.toContain('_ga=abc');
  });

  it('fails closed when the external script errors and does not retry', () => {
    setAnalyticsConsent(true);
    const script = document.querySelector<HTMLScriptElement>('script[data-repage-ga4]');
    script?.dispatchEvent(new Event('error'));
    setAnalyticsConsent(true);

    expect(document.querySelectorAll('script[data-repage-ga4]')).toHaveLength(1);
  });

  it('is a no-op without a measurement id', () => {
    resetAnalyticsForTests();
    configureAnalytics({ measurementId: '' });
    setAnalyticsConsent(true);

    expect(document.querySelector('script[data-repage-ga4]')).not.toBeInTheDocument();
    expect(window.dataLayer).toBeUndefined();
  });
});
