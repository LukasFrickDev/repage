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

export function generateSitemapXml(): string {
  const urls = [...new Set(listSitemapUrls())];
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n');
}

export function generateRobotsTxt(indexingEnabled = isSiteIndexingEnabled()): string {
  if (!indexingEnabled) return 'User-agent: *\nDisallow: /\n';
  return `User-agent: *\nAllow: /\n\nSitemap: ${siteConfig.canonicalOrigin}/sitemap.xml\n`;
}
