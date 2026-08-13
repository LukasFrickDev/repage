export const PROJECT_NATURES = ['paid', 'owned', 'technical-challenge'] as const;

export type ProjectNature = (typeof PROJECT_NATURES)[number];

export const projectNatureLabels: Record<ProjectNature, string> = {
  paid: 'Projeto pago',
  owned: 'Projeto próprio',
  'technical-challenge': 'Desafio técnico',
};

export type ProjectPublicationStatus = 'draft' | 'published';

export const PROJECT_TYPES = [
  'Site institucional · E-commerce',
  'Site institucional',
  'Aplicação web · Full stack',
  'Landing page',
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];

export type ProjectMediaSelection = {
  cover: string;
  gallery: readonly string[];
  videos?: readonly string[];
};

export type ProjectRouteMetadata = {
  title: string;
  description: string;
};

type ProjectBase = {
  title: string;
  slug: string;
  nature: ProjectNature;
  projectType: ProjectType;
  publicationStatus: ProjectPublicationStatus;
  portfolioOrder: 1 | 2 | 3 | 4 | 5 | 6;
  featuredOrder?: 1 | 2 | 3;
  summary: string;
  overview: string;
  context: string;
  challenge: string;
  solution: string;
  participation: string;
  services: readonly string[];
  capabilities: readonly string[];
  decisions?: readonly string[];
  technologies: readonly string[];
  publicUrl?: string;
  media: ProjectMediaSelection;
  routeMetadata: ProjectRouteMetadata;
  predatesRepage?: true;
};

export type DraftProject = ProjectBase & { publicationStatus: 'draft' };
export type PublishedProject = ProjectBase & { publicationStatus: 'published' };
export type Project = DraftProject | PublishedProject;

const sharedParticipation = 'Lukas Frick conduziu estratégia inicial, estrutura, direção visual/design e desenvolvimento.';

export const projects = [
  {
    title: 'EchoCosmicEnergia',
    slug: 'echo-cosmic-energia',
    nature: 'paid',
    projectType: 'Site institucional · E-commerce',
    publicationStatus: 'published',
    portfolioOrder: 1,
    featuredOrder: 1,
    summary: 'Experiência full stack com catálogo, loja, conteúdo editorial e diferentes pontos de contato em uma presença digital integrada.',
    overview: 'Uma presença digital integrada para reunir catálogo, loja, conteúdo editorial e diferentes pontos de contato.',
    context: 'O projeto combina comércio digital, conteúdo e serviços em uma mesma experiência pública.',
    challenge: 'Organizar diferentes frentes da experiência em uma estrutura clara e navegável.',
    solution: 'Uma experiência full stack com catálogo, carrinho, checkout, pagamentos, loja virtual, blog, página de links e painel administrativo.',
    participation: `${sharedParticipation} O trabalho foi refinado e validado com o cliente.`,
    services: ['Estratégia', 'Estrutura', 'Direção visual/design', 'Desenvolvimento full stack'],
    capabilities: ['Catálogo', 'Carrinho', 'Checkout', 'Pagamentos', 'Loja virtual', 'Blog', 'Página de links', 'Painel administrativo', 'Analytics', 'Preparação/uso de Ads conforme evidência'],
    technologies: ['React', 'TypeScript', 'Vite', 'Styled Components', 'Django', 'Django REST Framework'],
    publicUrl: 'https://echocosmicenergia.com.br/',
    media: {
      cover: '/projects/echo-cosmic-energia/echo-social.png',
      gallery: ['/projects/echo-cosmic-energia/echo-store-desktop.png', '/projects/echo-cosmic-energia/echo-articles-desktop.png', '/projects/echo-cosmic-energia/echo-business-services-desktop.png', '/projects/echo-cosmic-energia/echo-home-mobile.png', '/projects/echo-cosmic-energia/echo-links-mobile.png'],
    },
    routeMetadata: { title: 'EchoCosmicEnergia — case | Repage', description: 'Case da EchoCosmicEnergia, com comércio digital, conteúdo e diferentes pontos de contato.' },
  },
  {
    title: 'Axium',
    slug: 'axium',
    nature: 'paid',
    projectType: 'Site institucional',
    publicationStatus: 'published',
    portfolioOrder: 2,
    featuredOrder: 2,
    summary: 'Experiência institucional para uma empresa de serviços, com páginas especializadas e conteúdo editorial responsivo.',
    overview: 'Uma experiência institucional para apresentar uma empresa de serviços e suas páginas especializadas.',
    context: 'O projeto organiza presença institucional, serviços, conteúdo e contato em uma experiência responsiva.',
    challenge: 'Estruturar páginas especializadas e conteúdo editorial sem perder clareza na navegação.',
    solution: 'Uma experiência institucional com páginas de serviços, formulário, registro de lead e integração com RD Station.',
    participation: `${sharedParticipation} O trabalho foi refinado e validado com o cliente.`,
    services: ['Estratégia', 'Estrutura', 'Direção visual/design', 'Desenvolvimento frontend'],
    capabilities: ['Experiência institucional', 'Páginas de serviços', 'Conteúdo editorial', 'Formulário', 'Registro de lead', 'Integração com RD Station', 'Analytics', 'Preparação/uso de Ads conforme evidência'],
    technologies: [],
    publicUrl: 'https://projeto-lukasfrick-axiumdh.vercel.app/',
    media: {
      cover: '/projects/axium/axium-social.png',
      gallery: ['/projects/axium/axium-nr01-desktop.png', '/projects/axium/axium-nr01-mobile.png', '/projects/axium/axium-blog-desktop.png', '/projects/axium/axium-blog-mobile.png', '/projects/axium/axium-home-mobile.png'],
    },
    routeMetadata: { title: 'Axium — case | Repage', description: 'Case da Axium, com experiência institucional, serviços e conteúdo editorial responsivo.' },
  },
  {
    title: 'DevSchedule',
    slug: 'dev-schedule',
    nature: 'technical-challenge',
    projectType: 'Aplicação web · Full stack',
    publicationStatus: 'published',
    portfolioOrder: 3,
    featuredOrder: 3,
    summary: 'Aplicação de agendamento com fluxo público por etapas e uma área administrativa demonstrativa.',
    overview: 'Uma aplicação de agendamento com experiência pública e administração demonstrativa.',
    context: 'O projeto explora um fluxo de serviço, calendário, disponibilidade, dados para agendamento e gestão visual do estado administrativo.',
    challenge: 'Construir uma jornada pública por etapas que também demonstrasse a visão administrativa do sistema.',
    solution: 'Um fluxo público de seleção de serviço, calendário, disponibilidade e dados, acompanhado por uma área administrativa demonstrativa.',
    participation: 'Lukas Frick conduziu estratégia inicial, estrutura, direção visual/design e desenvolvimento no desafio técnico.',
    services: ['Estratégia', 'Estrutura', 'Direção visual/design', 'Desenvolvimento'],
    capabilities: ['Seleção de serviço', 'Calendário', 'Disponibilidade', 'Dados para agendamento', 'Fluxo público', 'Área administrativa demonstrativa', 'Gestão visual do estado administrativo'],
    technologies: ['React', 'TypeScript', 'Vite', 'Styled Components', 'Django REST Framework', 'PostgreSQL', 'Docker'],
    publicUrl: 'https://projetolukasfrick-devschedule.vercel.app/',
    media: {
      cover: '/projects/dev-schedule/devschedule-social.png',
      gallery: ['/projects/dev-schedule/devschedule-client-services-mobile.png', '/projects/dev-schedule/devschedule-client-calendar-desktop.png', '/projects/dev-schedule/devschedule-client-calendar-mobile.png', '/projects/dev-schedule/devschedule-client-availability-desktop.png', '/projects/dev-schedule/devschedule-client-availability-mobile.png', '/projects/dev-schedule/devschedule-client-data-desktop.png', '/projects/dev-schedule/devschedule-client-data-mobile.png', '/projects/dev-schedule/devschedule-admin-dashboard-desktop.png', '/projects/dev-schedule/devschedule-admin-dashboard-mobile.png'],
      videos: ['/projects/dev-schedule/videos/devschedule-client-desktop.webm', '/projects/dev-schedule/videos/devschedule-admin-desktop.webm'],
    },
    routeMetadata: { title: 'DevSchedule — case | Repage', description: 'Case do DevSchedule, desafio técnico de agendamento com fluxo público e administração demonstrativa.' },
  },
  {
    title: 'GreenTweet',
    slug: 'green-tweet',
    nature: 'owned',
    projectType: 'Aplicação web · Full stack',
    publicationStatus: 'published',
    portfolioOrder: 4,
    summary: 'Aplicação full stack inspirada em uma rede social, construída para explorar fluxos de publicação, perfil e interação entre usuários.',
    overview: 'Uma aplicação full stack própria inspirada em uma rede social.',
    context: 'O projeto explora publicação, perfil e interação entre usuários em uma experiência autenticada demonstrativa.',
    challenge: 'Organizar diferentes estados de uma aplicação social em fluxos compreensíveis e demonstráveis.',
    solution: 'Uma aplicação com cadastro, autenticação JWT, perfis, publicações, curtidas, comentários, seguidores, notificações e busca.',
    participation: 'Lukas Frick conduziu estratégia inicial, estrutura, direção visual/design e desenvolvimento no projeto próprio.',
    services: ['Estratégia', 'Estrutura', 'Direção visual/design', 'Desenvolvimento'],
    capabilities: ['Cadastro', 'Autenticação JWT', 'Perfis', 'Publicações', 'Curtidas', 'Comentários', 'Seguidores', 'Notificações', 'Busca'],
    technologies: ['React', 'TypeScript', 'Vite', 'Django REST Framework', 'PostgreSQL'],
    publicUrl: 'https://greentweet.vercel.app/',
    media: {
      cover: '/projects/green-tweet/greentweet-social.png',
      gallery: ['/projects/green-tweet/greentweet-feed-posts-mobile.png', '/projects/green-tweet/greentweet-profile-desktop.png', '/projects/green-tweet/greentweet-profile-mobile.png', '/projects/green-tweet/greentweet-notifications-desktop.png', '/projects/green-tweet/greentweet-notifications-mobile.png', '/projects/green-tweet/greentweet-demo-profile-desktop.png', '/projects/green-tweet/greentweet-demo-profile-mobile.png', '/projects/green-tweet/greentweet-comments-desktop.png', '/projects/green-tweet/greentweet-comments-mobile.png'],
      videos: ['/projects/green-tweet/videos/greentweet-tour-desktop.webm'],
    },
    routeMetadata: { title: 'GreenTweet — case | Repage', description: 'Case do GreenTweet, projeto próprio full stack inspirado em uma rede social.' },
  },
  {
    title: 'A Alma no Comando',
    slug: 'a-alma-no-comando',
    nature: 'paid',
    projectType: 'Landing page',
    publicationStatus: 'published',
    portfolioOrder: 5,
    summary: 'Landing page responsiva organizada em seções editoriais.',
    overview: 'Uma landing page responsiva organizada em seções editoriais.',
    context: 'A experiência apresenta método, obra/livro, manifesto e CTAs da própria página.',
    challenge: 'Organizar uma narrativa editorial única com abertura, método, obra, manifesto e chamadas para ação.',
    solution: 'Uma landing page com apresentação de método, apresentação de obra/livro, manifesto e CTAs da própria página.',
    participation: `${sharedParticipation} O trabalho foi refinado e validado com o cliente.`,
    services: ['Estratégia', 'Estrutura', 'Direção visual/design', 'Desenvolvimento'],
    capabilities: ['Abertura', 'Apresentação de método', 'Apresentação de obra/livro', 'Manifesto', 'CTAs da própria página'],
    technologies: ['React', 'TypeScript', 'Vite', 'Styled Components'],
    publicUrl: 'https://www.aalmanocomando.com.br/',
    media: {
      cover: '/projects/a-alma-no-comando/alma-social.png',
      gallery: ['/projects/a-alma-no-comando/alma-home-mobile.png', '/projects/a-alma-no-comando/alma-method-desktop.png', '/projects/a-alma-no-comando/alma-book-desktop.png', '/projects/a-alma-no-comando/alma-manifesto-desktop.png', '/projects/a-alma-no-comando/alma-manifesto-mobile.png'],
    },
    routeMetadata: { title: 'A Alma no Comando — case | Repage', description: 'Case de A Alma no Comando, landing page responsiva organizada em seções editoriais.' },
  },
  {
    title: 'Alicerce da Alma',
    slug: 'alicerce-da-alma',
    nature: 'paid',
    projectType: 'Landing page',
    publicationStatus: 'published',
    portfolioOrder: 6,
    summary: 'Experiência institucional responsiva organizada para apresentar conteúdo, serviços e diferenciais.',
    overview: 'Uma experiência institucional responsiva para apresentar conteúdo, serviços e diferenciais.',
    context: 'A experiência organiza abertura, serviços, diferenciais e conteúdo institucional.',
    challenge: 'Apresentar conteúdo institucional, serviços e diferenciais com uma estrutura clara e responsiva.',
    solution: 'Uma experiência institucional com abertura, serviços, diferenciais e conteúdo institucional.',
    participation: `${sharedParticipation} O trabalho foi refinado e validado com o cliente.`,
    services: ['Estratégia', 'Estrutura', 'Direção visual/design', 'Desenvolvimento'],
    capabilities: ['Abertura', 'Serviços', 'Diferenciais', 'Conteúdo institucional'],
    technologies: [],
    publicUrl: 'https://www.alicercedaalma.com.br/',
    media: {
      cover: '/projects/alicerce-da-alma/alicerce-social.png',
      gallery: ['/projects/alicerce-da-alma/alicerce-home-mobile.png', '/projects/alicerce-da-alma/alicerce-services-desktop.png', '/projects/alicerce-da-alma/alicerce-services-mobile.png', '/projects/alicerce-da-alma/alicerce-differentials-desktop.png', '/projects/alicerce-da-alma/alicerce-differentials-mobile.png'],
    },
    routeMetadata: { title: 'Alicerce da Alma — case | Repage', description: 'Case do Alicerce da Alma, experiência institucional responsiva com serviços e diferenciais.' },
  },
] as const satisfies readonly Project[];

export function isProjectNature(value: string): value is ProjectNature {
  return PROJECT_NATURES.some((nature) => nature === value);
}

export function listProjects(records: readonly Project[] = projects): readonly Project[] {
  return records;
}

export function findProjectBySlug(slug: string, records: readonly Project[] = projects): Project | undefined {
  return records.find((project) => project.slug === slug);
}

export function listDraftProjects(records: readonly Project[] = projects): DraftProject[] {
  return records.filter((project): project is DraftProject => project.publicationStatus === 'draft');
}

export function listPublishedProjectRecords(records: readonly Project[] = projects): PublishedProject[] {
  return records.filter((project): project is PublishedProject => project.publicationStatus === 'published');
}

export function listFeaturedProjectRecords(records: readonly Project[] = projects): Project[] {
  return records
    .filter((project) => project.featuredOrder !== undefined)
    .sort((first, second) => (first.featuredOrder ?? 0) - (second.featuredOrder ?? 0));
}

export function findDuplicateProjectSlugs(records: readonly Project[] = projects): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  records.forEach((project) => {
    if (seen.has(project.slug)) duplicates.add(project.slug);
    seen.add(project.slug);
  });

  return [...duplicates];
}
