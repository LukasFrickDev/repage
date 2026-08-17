import { isSiteIndexingEnabled, siteConfig } from '../config/site';
import { listPublicProjects } from '../data/projects/publication';

const sitemapPaths = ['/', '/portfolio'] as const;

function escapeXml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}

export function listSitemapUrls(): string[] {
  return [...sitemapPaths, ...listPublicProjects().map((project) => `/portfolio/${project.slug}`)]
    .map((path) => new URL(path, siteConfig.canonicalOrigin).toString());
}

export function validateSitemapUrls(urls: readonly string[], expectedUrls: readonly string[] = listSitemapUrls()): void {
  if (new Set(urls).size !== urls.length) throw new Error('Sitemap contém URL duplicada.');

  urls.forEach((value) => {
    let parsed: URL;
    try {
      parsed = new URL(value);
    } catch {
      throw new Error(`Sitemap contém URL inválida: ${value}`);
    }
    if (parsed.origin !== siteConfig.canonicalOrigin || parsed.search || parsed.hash) {
      throw new Error(`Sitemap contém URL fora do canonical permitido: ${value}`);
    }
    if (['/privacidade', '/cookies', '/404', '/404.html', '/__404__'].includes(parsed.pathname)) {
      throw new Error(`Sitemap contém rota excluída: ${value}`);
    }
  });

  if (urls.length !== expectedUrls.length || urls.some((url, index) => url !== expectedUrls[index])) {
    throw new Error('Sitemap não corresponde às rotas públicas esperadas.');
  }
}

export function generateSitemapXml(urls: readonly string[] = listSitemapUrls()): string {
  validateSitemapUrls(urls);
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n');
}

export function validateRobotsTxt(content: string, indexingEnabled: boolean): void {
  const expected = indexingEnabled
    ? `User-agent: *\nAllow: /\n\nSitemap: ${siteConfig.canonicalOrigin}/sitemap.xml\n`
    : 'User-agent: *\nDisallow: /\n';
  if (content !== expected) throw new Error('robots.txt não corresponde à política global.');
}

export function generateRobotsTxt(indexingEnabled = isSiteIndexingEnabled()): string {
  const content = indexingEnabled
    ? `User-agent: *\nAllow: /\n\nSitemap: ${siteConfig.canonicalOrigin}/sitemap.xml\n`
    : 'User-agent: *\nDisallow: /\n';
  validateRobotsTxt(content, indexingEnabled);
  return content;
}
