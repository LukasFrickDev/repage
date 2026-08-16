import { describe, expect, it } from 'vitest';
import { applyRouteMetadata, fallbackMetadata, routeMetadata } from './routeMetadata';
import { isSiteIndexingEnabled } from '../config/site';

describe('route metadata', () => {
  it('creates and updates title, description and robots independently', () => {
    const isolatedDocument = document.implementation.createHTMLDocument();

    applyRouteMetadata(routeMetadata.portfolio, isolatedDocument, true);

    expect(isolatedDocument.title).toBe(routeMetadata.portfolio.title);
    expect(isolatedDocument.querySelector('meta[name="description"]')?.getAttribute('content'))
      .toBe(routeMetadata.portfolio.description);
    expect(isolatedDocument.querySelector('meta[name="robots"]')?.getAttribute('content'))
      .toBe('index, follow');

    expect(isolatedDocument.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://repage.com.br/portfolio');
    expect(isolatedDocument.querySelector('meta[property="og:locale"]')?.getAttribute('content')).toBe('pt_BR');
    expect(isolatedDocument.querySelector('meta[name="twitter:card"]')?.getAttribute('content')).toBe('summary_large_image');

    applyRouteMetadata(routeMetadata.home, isolatedDocument, true);

    expect(isolatedDocument.title).toBe(routeMetadata.home.title);
    expect(isolatedDocument.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('index, follow');
  });

  it('provides a safe noindex fallback', () => {
    expect(fallbackMetadata.indexing).toBe('noindex');
  });

  it('denies indexing when the public flag is disabled', () => {
    const isolatedDocument = document.implementation.createHTMLDocument();
    applyRouteMetadata(routeMetadata.portfolio, isolatedDocument, false);
    expect(isolatedDocument.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex, nofollow');
  });

  it('enables indexing only for the literal true value', () => {
    expect(isSiteIndexingEnabled('true')).toBe(true);
    expect(isSiteIndexingEnabled('TRUE')).toBe(false);
    expect(isSiteIndexingEnabled('1')).toBe(false);
    expect(isSiteIndexingEnabled('')).toBe(false);
    expect(isSiteIndexingEnabled(undefined)).toBe(false);
  });

  it('removes canonical and social metadata for the 404 route', () => {
    const isolatedDocument = document.implementation.createHTMLDocument();
    applyRouteMetadata(routeMetadata.home, isolatedDocument, true);
    applyRouteMetadata(routeMetadata.notFound, isolatedDocument, true);
    applyRouteMetadata(routeMetadata.notFound, isolatedDocument, true);
    expect(isolatedDocument.querySelector('link[rel="canonical"]')).toBeNull();
    expect(isolatedDocument.querySelector('meta[property="og:title"]')).toBeNull();
    expect(isolatedDocument.querySelector('meta[name="twitter:title"]')).toBeNull();
    expect(isolatedDocument.querySelectorAll('meta[name="description"]')).toHaveLength(1);
  });
});
