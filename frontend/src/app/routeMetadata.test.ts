import { describe, expect, it } from 'vitest';
import {
  applyRouteMetadata,
  fallbackMetadata,
  getRouteStructuredData,
  routeMetadata,
  serializeStructuredData,
  validateRouteStructuredData,
} from './routeMetadata';
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

  it('resolves only factual JSON-LD for the allowed routes', () => {
    const home = getRouteStructuredData('/');
    expect(home.map((entry) => entry['@type'])).toEqual(['Organization', 'WebSite']);
    expect(home).toEqual([
      { '@context': 'https://schema.org', '@type': 'Organization', name: 'Repage', url: 'https://repage.com.br', slogan: 'Uma nova página para o seu negócio começa aqui.' },
      { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Repage', url: 'https://repage.com.br', slogan: 'Uma nova página para o seu negócio começa aqui.' },
    ]);
    expect(getRouteStructuredData('/portfolio')[0].itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://repage.com.br/' },
      { '@type': 'ListItem', position: 2, name: 'Portfólio', item: 'https://repage.com.br/portfolio' },
    ]);
    const caseData = getRouteStructuredData('/portfolio/axium')[0].itemListElement as Array<Record<string, unknown>>;
    expect(caseData[2]).toMatchObject({ position: 3, name: 'Axium', item: 'https://repage.com.br/portfolio/axium' });
    expect(getRouteStructuredData('/privacidade')).toEqual([]);
    expect(getRouteStructuredData('/cookies')).toEqual([]);
    expect(getRouteStructuredData('/__404__')).toEqual([]);
    expect(() => validateRouteStructuredData('/portfolio/axium', getRouteStructuredData('/portfolio/axium'))).not.toThrow();
  });

  it('replaces SPA JSON-LD without duplicates and serializes safely', () => {
    const isolatedDocument = document.implementation.createHTMLDocument();
    applyRouteMetadata(routeMetadata.home, isolatedDocument, true);
    expect(isolatedDocument.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(1);
    expect(isolatedDocument.querySelector('script[type="application/ld+json"]')?.textContent).toContain('Organization');

    applyRouteMetadata(routeMetadata.portfolio, isolatedDocument, true);
    expect(isolatedDocument.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(1);
    expect(isolatedDocument.querySelector('script[type="application/ld+json"]')?.textContent).toContain('BreadcrumbList');

    applyRouteMetadata(routeMetadata.privacy, isolatedDocument, true);
    expect(isolatedDocument.querySelector('script[type="application/ld+json"]')).toBeNull();
    const serialized = serializeStructuredData([{ '@context': 'https://schema.org', '@type': 'Thing', name: '</script><script>unsafe' }]);
    expect(serialized).not.toContain('</script>');
    expect(serialized).toContain('\\u003c/script\\u003e');
  });
});
