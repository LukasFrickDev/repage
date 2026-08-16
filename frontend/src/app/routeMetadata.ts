import { useEffect } from 'react';
import { isSiteIndexingEnabled, siteConfig } from '../config/site';

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

export function applyRouteMetadata(
  metadata: RouteMetadata,
  documentRef: Document = document,
  indexingEnabled = isSiteIndexingEnabled(),
) {
  documentRef.title = metadata.title;
  upsertMeta(documentRef, 'name', 'description', metadata.description);
  upsertMeta(documentRef, 'name', 'robots', indexingEnabled ? metadata.robots : 'noindex, nofollow');
  setCanonical(documentRef, metadata.canonical);

  const openGraph: Record<string, string> = {
    'og:title': metadata.title,
    'og:description': metadata.description,
    'og:url': metadata.canonical ?? '',
    'og:type': metadata.openGraph.type,
    'og:site_name': siteConfig.brand.name,
    'og:locale': siteConfig.socialLocale,
    'og:image': metadata.socialImage.url,
    'og:image:width': String(metadata.socialImage.width),
    'og:image:height': String(metadata.socialImage.height),
    'og:image:alt': metadata.socialImage.alt,
  };
  const twitter: Record<string, string> = {
    'twitter:card': 'summary_large_image',
    'twitter:title': metadata.title,
    'twitter:description': metadata.description,
    'twitter:image': metadata.socialImage.url,
    'twitter:image:alt': metadata.socialImage.alt,
  };

  if (!metadata.path) {
    Object.keys(openGraph).forEach((name) => removeMeta(documentRef, 'property', name));
    Object.keys(twitter).forEach((name) => removeMeta(documentRef, 'name', name));
    return;
  }

  Object.entries(openGraph).forEach(([name, content]) => upsertMeta(documentRef, 'property', name, content));
  Object.entries(twitter).forEach(([name, content]) => upsertMeta(documentRef, 'name', name, content));
}

export function useRouteMetadata(metadata: RouteMetadata = fallbackMetadata) {
  useEffect(() => {
    applyRouteMetadata(metadata);
  }, [metadata]);
}
