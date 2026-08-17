import { describe, expect, it } from 'vitest';
import { renderPathname } from './entry-server';

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
  });
});
