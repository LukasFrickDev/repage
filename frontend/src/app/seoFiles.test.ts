import { describe, expect, it } from 'vitest';
import { generateRobotsTxt, generateSitemapXml, listSitemapUrls } from './seoFiles';

describe('SEO files', () => {
  it('derives a deterministic sitemap from public routes only', () => {
    const urls = listSitemapUrls();
    const xml = generateSitemapXml();

    expect(urls).toEqual([...new Set(urls)]);
    expect(urls.every((url) => new URL(url).origin === 'https://repage.com.br')).toBe(true);
    expect(urls.every((url) => !/[?#]/.test(url))).toBe(true);
    expect(urls).toContain('https://repage.com.br/');
    expect(urls).toContain('https://repage.com.br/portfolio');
    expect(urls).not.toContain('https://repage.com.br/privacidade');
    expect(urls).not.toContain('https://repage.com.br/cookies');
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml).not.toMatch(/lastmod|changefreq|priority/);
  });

  it('generates robots according to the global indexing policy', () => {
    expect(generateRobotsTxt(true)).toBe('User-agent: *\nAllow: /\n\nSitemap: https://repage.com.br/sitemap.xml\n');
    expect(generateRobotsTxt(false)).toBe('User-agent: *\nDisallow: /\n');
  });
});
