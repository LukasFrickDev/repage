import { describe, expect, it } from 'vitest';
// @ts-expect-error The Node-only validation helper is intentionally kept in the build script.
import { assertOutput } from '../scripts/prerender.mjs';

const metadata = {
  title: 'Portfólio | Repage',
  description: 'Descrição',
  robots: 'index, follow',
  canonical: 'https://repage.com.br/portfolio',
  path: '/portfolio',
  openGraph: { type: 'website' },
  socialImage: { url: '/social.png', width: 1200, height: 630, alt: 'Imagem' },
};

const validHtml = '<html><head><title>Portfólio | Repage</title><meta name="description" content="Descrição" /><meta name="robots" content="noindex, nofollow" /><link rel="canonical" href="https://repage.com.br/portfolio" /></head><body><div id="root"><main><h1>Portfólio</h1></main></div></body></html>';

describe('prerender output validation', () => {
  it('rejects an empty root and unresolved Suspense fallback', () => {
    expect(() => assertOutput(validHtml.replace('<main><h1>Portfólio</h1></main>', ''), '/portfolio', metadata, false)).toThrow('Root vazio');
    expect(() => assertOutput(validHtml.replace('<h1>Portfólio</h1>', '<h1>Carregando página…</h1>'), '/portfolio', metadata, false)).toThrow('Fallback');
  });

  it('rejects a 404 with a canonical', () => {
    expect(() => assertOutput(validHtml.replace('Portfólio | Repage', 'Página não encontrada | Repage'), '/__404__', { ...metadata, canonical: undefined }, false)).toThrow('404');
  });
});
