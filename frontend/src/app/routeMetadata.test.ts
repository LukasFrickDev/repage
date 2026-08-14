import { describe, expect, it } from 'vitest';
import { applyRouteMetadata, fallbackMetadata, routeMetadata } from './routeMetadata';

describe('route metadata', () => {
  it('creates and updates title, description and robots independently', () => {
    const isolatedDocument = document.implementation.createHTMLDocument();

    applyRouteMetadata(routeMetadata.portfolio, isolatedDocument);

    expect(isolatedDocument.title).toBe(routeMetadata.portfolio.title);
    expect(isolatedDocument.querySelector('meta[name="description"]')?.getAttribute('content'))
      .toBe(routeMetadata.portfolio.description);
    expect(isolatedDocument.querySelector('meta[name="robots"]')?.getAttribute('content'))
      .toBe('index, follow');

    applyRouteMetadata(routeMetadata.home, isolatedDocument);

    expect(isolatedDocument.title).toBe(routeMetadata.home.title);
    expect(isolatedDocument.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('index, follow');
  });

  it('provides a safe noindex fallback', () => {
    expect(fallbackMetadata.indexing).toBe('noindex');
  });
});
