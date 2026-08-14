import { useEffect } from 'react';

export type IndexingState = 'index' | 'noindex';

export type RouteMetadata = {
  title: string;
  description: string;
  indexing: IndexingState;
};

export type RouteMetadataKey = 'home' | 'portfolio' | 'privacy' | 'cookies' | 'notFound';

export const fallbackMetadata: RouteMetadata = {
  title: 'Repage',
  description: 'Sites e soluções digitais para profissionais, especialistas e negócios.',
  indexing: 'noindex',
};

export const routeMetadata = {
  home: {
    title: 'Repage | Sites e soluções digitais',
    description: 'Estratégia, design e desenvolvimento para transformar ideias e serviços em experiências digitais profissionais.',
    indexing: 'index',
  },
  portfolio: {
    title: 'Portfólio | Repage',
    description: 'Uma seleção de sites institucionais, e-commerce, landing pages e aplicações web que reúne estrutura, design e desenvolvimento.',
    indexing: 'index',
  },
  privacy: {
    title: 'Política de Privacidade em preparação | Repage',
    description: 'Página estrutural da Política de Privacidade da Repage, ainda em preparação.',
    indexing: 'noindex',
  },
  cookies: {
    title: 'Política de Cookies em preparação | Repage',
    description: 'Página estrutural da Política de Cookies da Repage, ainda em preparação.',
    indexing: 'noindex',
  },
  notFound: {
    title: 'Página não encontrada | Repage',
    description: 'A página solicitada não foi encontrada no site da Repage.',
    indexing: 'noindex',
  },
} as const satisfies Record<RouteMetadataKey, RouteMetadata>;

export function getCaseMetadata(projectMetadata: { title: string; description: string }): RouteMetadata {
  return {
    title: projectMetadata.title,
    description: projectMetadata.description,
    indexing: 'index',
  };
}

function upsertMeta(documentRef: Document, name: string, content: string) {
  let element = documentRef.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);

  if (!element) {
    element = documentRef.createElement('meta');
    element.name = name;
    documentRef.head.append(element);
  }

  element.content = content;
}

export function applyRouteMetadata(metadata: RouteMetadata, documentRef: Document = document) {
  documentRef.title = metadata.title;
  upsertMeta(documentRef, 'description', metadata.description);
  upsertMeta(documentRef, 'robots', metadata.indexing === 'index' ? 'index, follow' : 'noindex, nofollow');
}

export function useRouteMetadata(metadata: RouteMetadata = fallbackMetadata) {
  useEffect(() => {
    applyRouteMetadata(metadata);
  }, [metadata]);
}
