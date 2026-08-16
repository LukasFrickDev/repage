export const ANALYTICS_EVENT_NAMES = {
  pageView: 'page_view',
  quoteCtaClick: 'quote_cta_click',
  portfolioView: 'portfolio_view',
  caseView: 'case_view',
  externalProjectClick: 'external_project_click',
  leadFormStart: 'lead_form_start',
  leadFormSuccess: 'lead_form_success',
  leadFormError: 'lead_form_error',
  whatsappClick: 'whatsapp_click',
  consentUpdate: 'consent_update',
} as const;

export type QuoteCtaContext = 'header' | 'hero' | 'case' | 'portfolio';
export type LeadFormErrorCategory =
  | 'validation'
  | 'network'
  | 'rate_limited'
  | 'idempotency_conflict'
  | 'service_unavailable'
  | 'server';

type AnalyticsEventPayloads = {
  page_view: { page_path: string };
  quote_cta_click: { context: QuoteCtaContext };
  portfolio_view: undefined;
  case_view: { project_slug: string };
  external_project_click: { project_slug: string };
  lead_form_start: undefined;
  lead_form_success: undefined;
  lead_form_error: { category: LeadFormErrorCategory };
  whatsapp_click: undefined;
  consent_update: { analytics: true; advertising: boolean };
};

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: Gtag;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

const measurementIdFromEnv = (import.meta.env.VITE_GA_MEASUREMENT_ID ?? '').trim();
let measurementId = measurementIdFromEnv;
let analyticsEnabled = false;
let scriptRequested = false;
let scriptFailed = false;
let initialized = false;
let lastPagePath: string | null = null;

function getGtag(): Gtag | undefined {
  return typeof window !== 'undefined' ? window.gtag : undefined;
}

function removeAnalyticsCookies() {
  if (typeof document === 'undefined') return;

  document.cookie.split(';').forEach((entry) => {
    const name = entry.trim().split('=')[0];
    if (name === '_ga' || name.startsWith('_ga_')) {
      document.cookie = `${name}=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
  });
}

function requestScript() {
  if (typeof document === 'undefined' || scriptRequested || scriptFailed || !measurementId) return;
  scriptRequested = true;

  const existing = document.querySelector<HTMLScriptElement>('script[data-repage-ga4]');
  const script = existing ?? document.createElement('script');
  if (!existing) {
    script.async = true;
    script.dataset.repageGa4 = 'true';
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);
  }
  script.addEventListener('error', () => { scriptFailed = true; }, { once: true });
}

function initialize() {
  if (typeof window === 'undefined' || !measurementId) return;

  window[`ga-disable-${measurementId}`] = false;
  if (!window.dataLayer) window.dataLayer = [];
  if (!window.gtag) window.gtag = (...args: unknown[]) => { window.dataLayer?.push(args); };

  if (!initialized) {
    initialized = true;
    window.gtag('js', new Date());
    window.gtag('config', measurementId, { send_page_view: false });
  } else {
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
  }

  requestScript();
}

export function configureAnalytics(options: { measurementId?: string }) {
  measurementId = (options.measurementId ?? '').trim();
}

export function getAnalyticsMeasurementId() {
  return measurementId;
}

export function setAnalyticsConsent(allowed: boolean) {
  analyticsEnabled = allowed && Boolean(measurementId);

  if (!allowed) {
    lastPagePath = null;
    if (initialized && getGtag()) {
      getGtag()?.('consent', 'update', { analytics_storage: 'denied' });
    }
    if (measurementId && typeof window !== 'undefined') window[`ga-disable-${measurementId}`] = true;
    removeAnalyticsCookies();
    return;
  }

  initialize();
}

function safePath(pathname: string) {
  const path = pathname.split('?')[0].split('#')[0];
  return path.startsWith('/') ? path : `/${path}`;
}

export function trackPageView(pathname: string) {
  const pagePath = safePath(pathname);
  if (!analyticsEnabled || pagePath === lastPagePath) return;
  lastPagePath = pagePath;
  getGtag()?.(ANALYTICS_EVENT_NAMES.pageView, { page_path: pagePath });
}

export function trackEvent<Name extends keyof AnalyticsEventPayloads>(
  name: Name,
  ...payload: AnalyticsEventPayloads[Name] extends undefined
    ? []
    : [AnalyticsEventPayloads[Name]]
) {
  if (!analyticsEnabled) return;
  getGtag()?.(name, ...(payload as [AnalyticsEventPayloads[Name]]));
}

export function resetAnalyticsForTests() {
  if (typeof document !== 'undefined') document.querySelector('script[data-repage-ga4]')?.remove();
  if (typeof window !== 'undefined') {
    delete window.gtag;
    delete window.dataLayer;
  }
  measurementId = measurementIdFromEnv;
  analyticsEnabled = false;
  scriptRequested = false;
  scriptFailed = false;
  initialized = false;
  lastPagePath = null;
}
