import { describe, expect, it } from 'vitest';
import { renderPathname } from './entry-server';
import { applyRouteMetadata, getRouteMetadata, resolveRouteMetadata } from './app/routeMetadata';

describe('static entry', () => {
  it('renders real portfolio HTML and SSR styles without a Suspense fallback', async () => {
    const rendered = await renderPathname('/portfolio');
    expect(rendered.markup).toContain('Projetos reais');
    expect(rendered.markup).not.toContain('Carregando página');
    expect(rendered.styles).toContain('<style');
    expect(rendered.metadata.canonical).toBe('https://repage.com.br/portfolio');
  });

  it('renders the 404 content without a canonical', async () => {
    const rendered = await renderPathname('/__404__');
    expect(rendered.markup).toContain('Página não encontrada.');
    expect(rendered.metadata.robots).toBe('noindex, nofollow');
    expect(rendered.metadata.canonical).toBeUndefined();
    expect(rendered.metadata.openGraph).toEqual({});
    expect(rendered.metadata.twitter).toEqual({});
    expect(rendered.metadata.structuredData).toEqual([]);
  });

  it.each(['/', '/privacidade', '/portfolio/axium'])('shares metadata between SPA and prerender for %s', async (pathname) => {
    const expected = resolveRouteMetadata(getRouteMetadata(pathname), false);
    const rendered = await renderPathname(pathname);
    const isolatedDocument = document.implementation.createHTMLDocument();

    applyRouteMetadata(getRouteMetadata(pathname), isolatedDocument, false);

    expect(rendered.metadata).toEqual(expected);
    expect(rendered.metadata.structuredData).toEqual(expected.structuredData);
    expect(isolatedDocument.title).toBe(expected.title);
    expect(isolatedDocument.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe(expected.robots);
    expect(isolatedDocument.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(expected.canonical);
    expect(isolatedDocument.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe(expected.openGraph['og:image']);
    expect(isolatedDocument.querySelector('meta[name="twitter:image"]')?.getAttribute('content')).toBe(expected.twitter['twitter:image']);
  });
});
