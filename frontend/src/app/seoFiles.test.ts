import { describe, expect, it } from 'vitest';
import {
  generateRobotsTxt,
  generateSitemapXml,
  listSitemapUrls,
  validateRobotsTxt,
  validateSitemapUrls,
} from './seoFiles';

describe('SEO files', () => {
  it('derives a deterministic sitemap from public routes only', () => {
    const urls = listSitemapUrls();
    const xml = generateSitemapXml();

    expect(() => validateSitemapUrls(urls)).not.toThrow();
    expect(urls.every((url) => new URL(url).origin === 'https://repage.com.br')).toBe(true);
    expect(urls.every((url) => !/[?#]/.test(url))).toBe(true);
    expect(urls).toContain('https://repage.com.br/');
    expect(urls).toContain('https://repage.com.br/portfolio');
    expect(urls).not.toContain('https://repage.com.br/privacidade');
    expect(urls).not.toContain('https://repage.com.br/cookies');
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml).not.toMatch(/lastmod|changefreq|priority/);
  });

  it('fails on duplicate, invalid, excluded or divergent sitemap URLs', () => {
    const urls = listSitemapUrls();
    expect(() => validateSitemapUrls([...urls, urls[0]])).toThrow('duplicada');
    expect(() => validateSitemapUrls(urls.map((url, index) => index === 0 ? 'https://external.example/page' : url))).toThrow();
    expect(() => validateSitemapUrls(urls.map((url, index) => index === 0 ? 'https://repage.com.br/?source=test' : url))).toThrow();
    expect(() => validateSitemapUrls([...urls.slice(0, -1), 'https://repage.com.br/privacidade'])).toThrow('excluída');
    expect(() => validateSitemapUrls([...urls.slice(0, -1), 'https://repage.com.br/__404__'])).toThrow('excluída');
    expect(() => validateSitemapUrls(urls.slice(0, -1))).toThrow('rotas públicas');
  });

  it('generates robots according to the global indexing policy', () => {
    const indexable = 'User-agent: *\nAllow: /\n\nSitemap: https://repage.com.br/sitemap.xml\n';
    const blocked = 'User-agent: *\nDisallow: /\n';
    expect(generateRobotsTxt(true)).toBe(indexable);
    expect(generateRobotsTxt(false)).toBe(blocked);
    expect(() => validateRobotsTxt('User-agent: *\nAllow: /\n', true)).toThrow();
    expect(() => validateRobotsTxt(indexable, false)).toThrow();
    expect(() => validateRobotsTxt(blocked, true)).toThrow();
  });
});
