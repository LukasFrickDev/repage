import { useEffect } from 'react';
import { isSiteIndexingEnabled, siteConfig } from '../config/site';
import { findPublicProjectBySlug } from '../data/projects/publication';
import { findReadinessBySlug } from '../data/projects/projectReadiness';

export type IndexingState = 'index' | 'noindex';
export type RobotsPolicy = 'index, follow' | 'noindex, follow' | 'noindex, nofollow';
export type SocialImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

export type RouteMetadata = {
  path?: string;
  title: string;
  description: string;
  indexing: IndexingState;
  robots: RobotsPolicy;
  canonical?: string;
  socialImage: SocialImage;
  openGraph: { type: 'website' };
};

export type StructuredDataObject = Record<string, unknown>;
export type StructuredData = readonly StructuredDataObject[];

export type EffectiveRouteMetadata = Omit<RouteMetadata, 'openGraph'> & {
  openGraph: Record<string, string>;
  twitter: Record<string, string>;
  structuredData: StructuredData;
};

export type RouteMetadataKey = 'home' | 'portfolio' | 'privacy' | 'cookies' | 'notFound';

const defaultSocialImage: SocialImage = {
  url: `${siteConfig.canonicalOrigin}${siteConfig.socialImage.path}`,
  width: siteConfig.socialImage.width,
  height: siteConfig.socialImage.height,
  alt: siteConfig.socialImage.alt,
};

function makeMetadata(
  path: string | undefined,
  title: string,
  description: string,
  indexing: IndexingState,
  robots: RobotsPolicy,
  socialImage: SocialImage = defaultSocialImage,
): RouteMetadata {
  return {
    path,
    title,
    description,
    indexing,
    robots,
    canonical: path === undefined ? undefined : `${siteConfig.canonicalOrigin}${path}`,
    socialImage,
    openGraph: { type: 'website' },
  };
}

export const fallbackMetadata: RouteMetadata = makeMetadata(
  undefined,
  'Repage',
  'Sites e soluções digitais para profissionais, especialistas e negócios.',
  'noindex',
  'noindex, nofollow',
);

export const routeMetadata = {
  home: makeMetadata(
    '/',
    'Repage | Sites e soluções digitais',
    'Estratégia, design e desenvolvimento para transformar ideias e serviços em experiências digitais profissionais.',
    'index',
    'index, follow',
  ),
  portfolio: makeMetadata(
    '/portfolio',
    'Portfólio | Repage',
    'Uma seleção de sites institucionais, e-commerce, landing pages e aplicações web que reúne estrutura, design e desenvolvimento.',
    'index',
    'index, follow',
  ),
  privacy: makeMetadata(
    '/privacidade',
    'Política de Privacidade | Repage',
    'Como a Repage trata dados pessoais relacionados ao site e às solicitações de orçamento.',
    'noindex',
    'noindex, follow',
  ),
  cookies: makeMetadata(
    '/cookies',
    'Política de Cookies | Repage',
    'Como a Repage usa tecnologias necessárias, analíticas e publicitárias no site.',
    'noindex',
    'noindex, follow',
  ),
  notFound: makeMetadata(
    undefined,
    'Página não encontrada | Repage',
    'A página solicitada não foi encontrada no site da Repage.',
    'noindex',
    'noindex, nofollow',
  ),
} as const satisfies Record<RouteMetadataKey, RouteMetadata>;

type CaseMetadataOptions = {
  path?: string;
  socialImage?: SocialImage;
};

export function getCaseMetadata(
  projectMetadata: { title: string; description: string },
  options: CaseMetadataOptions = {},
): RouteMetadata {
  return makeMetadata(
    options.path,
    projectMetadata.title,
    projectMetadata.description,
    'index',
    'index, follow',
    options.socialImage,
  );
}

export function getRouteMetadata(pathname: string): RouteMetadata {
  const path = pathname.split('?')[0].split('#')[0] || '/';
  if (path === '/') return routeMetadata.home;
  if (path === '/portfolio') return routeMetadata.portfolio;
  if (path === '/privacidade') return routeMetadata.privacy;
  if (path === '/cookies') return routeMetadata.cookies;

  const caseMatch = path.match(/^\/portfolio\/([^/]+)$/);
  if (!caseMatch) return routeMetadata.notFound;

  const project = findPublicProjectBySlug(caseMatch[1]);
  if (!project) return routeMetadata.notFound;
  const cover = findReadinessBySlug(project.slug)?.assets.find((asset) => asset.path === project.media.cover);
  return getCaseMetadata(project.routeMetadata, {
    path,
    ...(cover?.kind === 'screenshot' ? {
      socialImage: {
        url: `${siteConfig.canonicalOrigin}${cover.path}`,
        width: cover.width,
        height: cover.height,
        alt: cover.alt,
      },
    } : {}),
  });
}

function normalizePathname(pathname: string): string {
  return pathname.split('?')[0].split('#')[0] || '/';
}

function breadcrumbItem(position: number, name: string, item: string): StructuredDataObject {
  return { '@type': 'ListItem', position, name, item };
}

export function getRouteStructuredData(pathname: string): StructuredData {
  const path = normalizePathname(pathname);
  if (path === '/') {
    return [
      { '@context': 'https://schema.org', '@type': 'Organization', name: siteConfig.brand.name, url: siteConfig.canonicalOrigin, slogan: siteConfig.slogan },
      { '@context': 'https://schema.org', '@type': 'WebSite', name: siteConfig.brand.name, url: siteConfig.canonicalOrigin, slogan: siteConfig.slogan },
    ];
  }
  if (path === '/portfolio') {
    return [{
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        breadcrumbItem(1, 'Início', `${siteConfig.canonicalOrigin}/`),
        breadcrumbItem(2, 'Portfólio', `${siteConfig.canonicalOrigin}/portfolio`),
      ],
    }];
  }

  const caseMatch = path.match(/^\/portfolio\/([^/]+)$/);
  if (!caseMatch) return [];
  const project = findPublicProjectBySlug(caseMatch[1]);
  if (!project) return [];
  return [{
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      breadcrumbItem(1, 'Início', `${siteConfig.canonicalOrigin}/`),
      breadcrumbItem(2, 'Portfólio', `${siteConfig.canonicalOrigin}/portfolio`),
      breadcrumbItem(3, project.title, `${siteConfig.canonicalOrigin}${path}`),
    ],
  }];
}

function assertCanonicalUrl(value: unknown, label: string): asserts value is string {
  if (typeof value !== 'string') throw new Error(`JSON-LD ${label} deve ser uma URL.`);
  const url = new URL(value);
  if (url.origin !== siteConfig.canonicalOrigin || url.search || url.hash) {
    throw new Error(`JSON-LD ${label} deve usar URL canônica absoluta.`);
  }
}

function assertAllowedKeys(value: StructuredDataObject, keys: readonly string[], label: string): void {
  if (Object.keys(value).some((key) => !keys.includes(key))) throw new Error(`JSON-LD ${label} contém campo não permitido.`);
}

export function validateRouteStructuredData(pathname: string, data: StructuredData): void {
  const path = pathname ? normalizePathname(pathname) : '';
  const isHome = path === '/';
  const isPortfolio = path === '/portfolio';
  const caseMatch = path.match(/^\/portfolio\/([^/]+)$/);
  const project = caseMatch ? findPublicProjectBySlug(caseMatch[1]) : undefined;
  const expectedTypes = isHome ? ['Organization', 'WebSite'] : (isPortfolio || project ? ['BreadcrumbList'] : []);

  if (data.some((entry) => entry['@context'] !== 'https://schema.org')) throw new Error('JSON-LD deve usar @context schema.org.');
  if (data.some((entry) => !expectedTypes.includes(String(entry['@type'])))) throw new Error('JSON-LD contém tipo não permitido para a rota.');
  if (data.length !== expectedTypes.length) throw new Error('JSON-LD possui quantidade inesperada de schemas.');

  if (isHome) {
    data.forEach((entry) => {
      assertAllowedKeys(entry, ['@context', '@type', 'name', 'url', 'slogan'], String(entry['@type']));
      if (entry.name !== siteConfig.brand.name || entry.slogan !== siteConfig.slogan) throw new Error('JSON-LD home contém dados factuais divergentes.');
      assertCanonicalUrl(entry.url, `${String(entry['@type'])}.url`);
    });
    return;
  }

  if (!expectedTypes.length) {
    if (data.length) throw new Error('JSON-LD não é permitido nesta rota.');
    return;
  }

  const breadcrumb = data[0];
  assertAllowedKeys(breadcrumb, ['@context', '@type', 'itemListElement'], 'BreadcrumbList');
  if (!Array.isArray(breadcrumb.itemListElement) || breadcrumb.itemListElement.length !== expectedTypes.length + (project ? 2 : 1)) {
    throw new Error('BreadcrumbList possui itens inválidos.');
  }
  breadcrumb.itemListElement.forEach((item, index) => {
    if (!item || typeof item !== 'object') throw new Error('BreadcrumbList possui item inválido.');
    const breadcrumbItemValue = item as StructuredDataObject;
    assertAllowedKeys(breadcrumbItemValue, ['@type', 'position', 'name', 'item'], 'ListItem');
    if (breadcrumbItemValue['@type'] !== 'ListItem' || breadcrumbItemValue.position !== index + 1) {
      throw new Error('BreadcrumbList possui posições não sequenciais.');
    }
    assertCanonicalUrl(breadcrumbItemValue.item, `ListItem[${index}].item`);
  });
  const items = breadcrumb.itemListElement as StructuredDataObject[];
  if (items[0].name !== 'Início' || items[1].name !== 'Portfólio') throw new Error('BreadcrumbList possui nomes inválidos.');
  if (project && (items[2].name !== project.title || items[2].item !== `${siteConfig.canonicalOrigin}${path}`)) {
    throw new Error('BreadcrumbList do case não corresponde ao projeto público.');
  }
}

export function serializeStructuredData(data: StructuredData): string {
  return JSON.stringify(data).replaceAll('<', '\\u003c').replaceAll('>', '\\u003e').replaceAll('&', '\\u0026').replaceAll('\u2028', '\\u2028').replaceAll('\u2029', '\\u2029');
}

export function resolveRouteMetadata(
  metadata: RouteMetadata,
  indexingEnabled = isSiteIndexingEnabled(),
): EffectiveRouteMetadata {
  const social = metadata.socialImage;
  const openGraph: Record<string, string> = metadata.path ? {
    'og:title': metadata.title,
    'og:description': metadata.description,
    'og:url': metadata.canonical ?? '',
    'og:type': metadata.openGraph.type,
    'og:site_name': siteConfig.brand.name,
    'og:locale': siteConfig.socialLocale,
    'og:image': social.url,
    'og:image:width': String(social.width),
    'og:image:height': String(social.height),
    'og:image:alt': social.alt,
  } : {};
  const twitter: Record<string, string> = metadata.path ? {
    'twitter:card': 'summary_large_image',
    'twitter:title': metadata.title,
    'twitter:description': metadata.description,
    'twitter:image': social.url,
    'twitter:image:alt': social.alt,
  } : {};
  const structuredData = metadata.path ? getRouteStructuredData(metadata.path) : [];
  validateRouteStructuredData(metadata.path ?? '', structuredData);

  return {
    ...metadata,
    robots: indexingEnabled ? metadata.robots : 'noindex, nofollow',
    openGraph,
    twitter,
    structuredData,
  };
}

function upsertMeta(documentRef: Document, attribute: 'name' | 'property', value: string, content: string) {
  const elements = [...documentRef.head.querySelectorAll<HTMLMetaElement>(`meta[${attribute}="${value}"]`)];
  const element = elements[0] ?? documentRef.createElement('meta');
  elements.slice(1).forEach((duplicate) => duplicate.remove());
  element.setAttribute(attribute, value);
  element.content = content;
  if (!element.isConnected) documentRef.head.append(element);
}

function removeMeta(documentRef: Document, attribute: 'name' | 'property', value: string) {
  documentRef.head.querySelectorAll(`meta[${attribute}="${value}"]`).forEach((element) => element.remove());
}

function setCanonical(documentRef: Document, canonical: string | undefined) {
  documentRef.head.querySelectorAll('link[rel="canonical"]').forEach((element, index) => {
    if (index > 0 || !canonical) element.remove();
  });
  if (!canonical) return;

  const link = documentRef.head.querySelector<HTMLLinkElement>('link[rel="canonical"]') ?? documentRef.createElement('link');
  link.rel = 'canonical';
  link.href = canonical;
  if (!link.isConnected) documentRef.head.append(link);
}

function applyStructuredData(documentRef: Document, data: StructuredData): void {
  documentRef.head.querySelectorAll('script[data-repage-structured-data="true"]').forEach((script) => script.remove());
  if (!data.length) return;
  const script = documentRef.createElement('script');
  script.type = 'application/ld+json';
  script.dataset.repageStructuredData = 'true';
  script.textContent = serializeStructuredData(data);
  documentRef.head.append(script);
}

export function applyRouteMetadata(
  metadata: RouteMetadata,
  documentRef: Document = document,
  indexingEnabled = isSiteIndexingEnabled(),
) {
  const effective = resolveRouteMetadata(metadata, indexingEnabled);
  documentRef.title = effective.title;
  upsertMeta(documentRef, 'name', 'description', effective.description);
  upsertMeta(documentRef, 'name', 'robots', effective.robots);
  setCanonical(documentRef, effective.canonical);

  if (!effective.path) {
    ['og:title', 'og:description', 'og:url', 'og:type', 'og:site_name', 'og:locale', 'og:image', 'og:image:width', 'og:image:height', 'og:image:alt']
      .forEach((name) => removeMeta(documentRef, 'property', name));
    ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image', 'twitter:image:alt']
      .forEach((name) => removeMeta(documentRef, 'name', name));
    applyStructuredData(documentRef, effective.structuredData);
    return;
  }

  Object.entries(effective.openGraph).forEach(([name, content]) => upsertMeta(documentRef, 'property', name, content));
  Object.entries(effective.twitter).forEach(([name, content]) => upsertMeta(documentRef, 'name', name, content));
  applyStructuredData(documentRef, effective.structuredData);
}

export function useRouteMetadata(metadata: RouteMetadata = fallbackMetadata) {
  useEffect(() => {
    applyRouteMetadata(metadata);
  }, [metadata]);
}
