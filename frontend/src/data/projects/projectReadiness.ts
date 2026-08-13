import { projects } from '.';
import type { ProjectNature } from '.';

export const EVIDENCE_STATUSES = ['confirmed', 'partial', 'blocked'] as const;
export const CONTENT_STATUSES = ['ready', 'partial', 'blocked'] as const;
export const AUTHORIZATION_STATUSES = ['confirmed', 'pending', 'restricted', 'not-required'] as const;
export const LINK_STATUSES = ['verified', 'unavailable', 'not-applicable', 'blocked'] as const;
export const MEDIA_STATUSES = ['ready', 'partial', 'blocked'] as const;
export const MEDIA_FORMATS = ['png', 'webm'] as const;
export const MEDIA_ROLES = ['cover', 'desktop', 'mobile', 'gallery', 'social', 'poster', 'fallback', 'demo'] as const;
export const MEDIA_ORIGINS = ['public-site', 'authenticated-demo'] as const;

export type EvidenceStatus = (typeof EVIDENCE_STATUSES)[number];
export type ContentStatus = (typeof CONTENT_STATUSES)[number];
export type AuthorizationStatus = (typeof AUTHORIZATION_STATUSES)[number];
export type LinkStatus = (typeof LINK_STATUSES)[number];
export type MediaStatus = (typeof MEDIA_STATUSES)[number];
export type MediaFormat = (typeof MEDIA_FORMATS)[number];
export type ProjectMediaRole = (typeof MEDIA_ROLES)[number];
export type ProjectMediaOrigin = (typeof MEDIA_ORIGINS)[number];

export type CaptureViewport = {
  width: number;
  height: number;
};

export type ProjectMediaAsset = {
  roles: readonly ProjectMediaRole[];
  kind: 'screenshot' | 'video';
  path: string;
  format: MediaFormat;
  sourceUrl: string;
  origin: ProjectMediaOrigin;
  capturedAt: string;
  viewport: CaptureViewport;
  width: number;
  height: number;
  aspectRatio: string;
  bytes: number;
  alt: string;
  description: string;
  compression: string;
  privacyReview: 'approved' | 'pending';
  authorizationStatus: AuthorizationStatus;
  state: 'ready';
  durationSeconds?: number;
  codec?: string;
  hasAudio?: boolean;
  posterPath?: string;
  fallbackPath?: string;
};

export type ProjectReadiness = {
  slug: string;
  evidenceStatus: EvidenceStatus;
  contentStatus: ContentStatus;
  authorizationStatus: AuthorizationStatus;
  authorizationSource: string | null;
  linkStatus: LinkStatus;
  mediaStatus: MediaStatus;
  blockers: readonly string[];
  nextSteps: readonly string[];
  assets: readonly ProjectMediaAsset[];
};

const captureDate = '2026-08-05';
const paidAuthorizationSource =
  'Autorização de uso de mídia confirmada diretamente por Lukas Frick em 2026-08-05 para preparação e publicação no portfólio da Repage.';
const pngCompression = 'PNG de screenshot viewport fornecida no handoff; preservado sem reencode nesta execução.';
const webmCompression = 'WebM fornecido no handoff; preservado sem recorte, transcodificação ou reencode nesta execução.';
const desktopViewport = { width: 1440, height: 900 } as const;
const mobileViewport = { width: 390, height: 844 } as const;
const socialViewport = { width: 1200, height: 630 } as const;
const desktopAspectRatio = '8:5';
const mobileAspectRatio = '195:422';
const socialAspectRatio = '40:21';

const projectNaturesBySlug = new Map<string, ProjectNature>(
  projects.map((project) => [project.slug, project.nature]),
);

type ImageInput = {
  slug: string;
  filename: string;
  roles: readonly ProjectMediaRole[];
  sourceUrl: string;
  origin: ProjectMediaOrigin;
  viewport: CaptureViewport;
  bytes: number;
  alt: string;
  description: string;
  authorizationStatus: AuthorizationStatus;
  privacyReview?: ProjectMediaAsset['privacyReview'];
};

type VideoInput = ImageInput & {
  durationSeconds: number;
  posterPath: string;
  fallbackPath: string;
};

function image(input: ImageInput): ProjectMediaAsset {
  return {
    ...input,
    kind: 'screenshot',
    path: `/projects/${input.slug}/${input.filename}`,
    format: 'png',
    capturedAt: captureDate,
    width: input.viewport.width,
    height: input.viewport.height,
    aspectRatio: getAspectRatio(input.viewport),
    compression: pngCompression,
    privacyReview: input.privacyReview ?? 'approved',
    state: 'ready',
  };
}

function video(input: VideoInput): ProjectMediaAsset {
  return {
    ...input,
    kind: 'video',
    path: `/projects/${input.slug}/videos/${input.filename}`,
    format: 'webm',
    capturedAt: captureDate,
    width: input.viewport.width,
    height: input.viewport.height,
    aspectRatio: getAspectRatio(input.viewport),
    compression: webmCompression,
    privacyReview: input.privacyReview ?? 'approved',
    state: 'ready',
    codec: 'V_VP8',
    hasAudio: false,
  };
}

function getAspectRatio(viewport: CaptureViewport): string {
  if (viewport.width === socialViewport.width) return socialAspectRatio;
  return viewport.width === desktopViewport.width ? desktopAspectRatio : mobileAspectRatio;
}

const echoSlug = 'echo-cosmic-energia';
const echoRoot = 'https://echocosmicenergia.com.br/';
const echoCover = `/projects/${echoSlug}/echo-social.png`;
const echoMobileCover = `/projects/${echoSlug}/echo-home-mobile.png`;

const axiumSlug = 'axium';
const axiumRoot = 'https://projeto-lukasfrick-axiumdh.vercel.app/';
const axiumCover = `/projects/${axiumSlug}/axium-social.png`;
const axiumMobileCover = `/projects/${axiumSlug}/axium-home-mobile.png`;

const devScheduleSlug = 'dev-schedule';
const devScheduleRoot = 'https://projetolukasfrick-devschedule.vercel.app/';
const devScheduleCover = `/projects/${devScheduleSlug}/devschedule-social.png`;
const devScheduleMobileCover = `/projects/${devScheduleSlug}/devschedule-client-services-mobile.png`;
const devScheduleAdmin = `/projects/${devScheduleSlug}/devschedule-admin-dashboard-desktop.png`;
const devScheduleAdminMobile = `/projects/${devScheduleSlug}/devschedule-admin-dashboard-mobile.png`;

const greenTweetSlug = 'green-tweet';
const greenTweetRoot = 'https://greentweet.vercel.app/';
const greenTweetCover = `/projects/${greenTweetSlug}/greentweet-social.png`;
const greenTweetMobileCover = `/projects/${greenTweetSlug}/greentweet-feed-mobile.png`;

const almaSlug = 'a-alma-no-comando';
const almaRoot = 'https://www.aalmanocomando.com.br/';
const almaCover = `/projects/${almaSlug}/alma-social.png`;
const almaMobileCover = `/projects/${almaSlug}/alma-home-mobile.png`;

const alicerceSlug = 'alicerce-da-alma';
const alicerceRoot = 'https://www.alicercedaalma.com.br/';
const alicerceCover = `/projects/${alicerceSlug}/alicerce-social.png`;
const alicerceMobileCover = `/projects/${alicerceSlug}/alicerce-home-mobile.png`;

export const projectReadinessManifest = [
  {
    slug: echoSlug,
    evidenceStatus: 'confirmed',
    contentStatus: 'ready',
    authorizationStatus: 'confirmed',
    authorizationSource: paidAuthorizationSource,
    linkStatus: 'verified',
    mediaStatus: 'ready',
    blockers: [],
    nextSteps: [],
    assets: [
      image({ slug: echoSlug, filename: 'echo-social.png', roles: ['cover', 'social', 'gallery', 'desktop'], sourceUrl: echoRoot, origin: 'public-site', viewport: socialViewport, bytes: 635807, alt: 'Página inicial da Echo Cosmic Energia para compartilhamento social.', description: 'Captura principal preparada para uso social.', authorizationStatus: 'confirmed' }),
      image({ slug: echoSlug, filename: 'echo-home-mobile.png', roles: ['mobile'], sourceUrl: echoRoot, origin: 'public-site', viewport: mobileViewport, bytes: 251381, alt: 'Página inicial da Echo Cosmic Energia em mobile.', description: 'Referência responsiva da homepage pública.', authorizationStatus: 'confirmed' }),
      image({ slug: echoSlug, filename: 'echo-store-desktop.png', roles: ['gallery', 'desktop'], sourceUrl: `${echoRoot}loja`, origin: 'public-site', viewport: desktopViewport, bytes: 423060, alt: 'Loja da Echo Cosmic Energia em desktop.', description: 'Vitrine pública de produtos.', authorizationStatus: 'confirmed' }),
      image({ slug: echoSlug, filename: 'echo-articles-desktop.png', roles: ['gallery', 'desktop'], sourceUrl: `${echoRoot}artigos`, origin: 'public-site', viewport: desktopViewport, bytes: 557501, alt: 'Página de artigos da Echo Cosmic Energia em desktop.', description: 'Organização editorial pública.', authorizationStatus: 'confirmed' }),
      image({ slug: echoSlug, filename: 'echo-business-services-desktop.png', roles: ['gallery', 'desktop'], sourceUrl: `${echoRoot}blog/prestacao-servico`, origin: 'public-site', viewport: desktopViewport, bytes: 746412, alt: 'Página de serviços empresariais da Echo Cosmic Energia.', description: 'Apresentação pública de serviços para empresas.', authorizationStatus: 'confirmed' }),
      image({ slug: echoSlug, filename: 'echo-links-mobile.png', roles: ['gallery', 'mobile'], sourceUrl: `${echoRoot}links`, origin: 'public-site', viewport: mobileViewport, bytes: 203081, alt: 'Página de links da Echo Cosmic Energia em mobile.', description: 'Acesso rápido público para redes sociais.', authorizationStatus: 'confirmed' }),
      video({ slug: echoSlug, filename: 'echo-tour-desktop.webm', roles: ['demo', 'desktop'], sourceUrl: echoRoot, origin: 'public-site', viewport: desktopViewport, bytes: 7033479, alt: 'Tour desktop da Echo Cosmic Energia.', description: 'Navegação por homepage, loja, artigos e serviços empresariais.', authorizationStatus: 'confirmed', durationSeconds: 61.08, posterPath: echoCover, fallbackPath: echoCover }),
      video({ slug: echoSlug, filename: 'echo-tour-mobile.webm', roles: ['demo', 'mobile'], sourceUrl: echoRoot, origin: 'public-site', viewport: mobileViewport, bytes: 9636260, alt: 'Tour mobile da Echo Cosmic Energia.', description: 'Navegação móvel por homepage, loja, artigos e serviços empresariais.', authorizationStatus: 'confirmed', durationSeconds: 83.72, posterPath: echoMobileCover, fallbackPath: echoMobileCover }),
    ],
  },
  {
    slug: axiumSlug,
    evidenceStatus: 'confirmed',
    contentStatus: 'ready',
    authorizationStatus: 'confirmed',
    authorizationSource: paidAuthorizationSource,
    linkStatus: 'verified',
    mediaStatus: 'ready',
    blockers: [],
    nextSteps: [],
    assets: [
      image({ slug: axiumSlug, filename: 'axium-social.png', roles: ['cover', 'social', 'gallery', 'desktop'], sourceUrl: axiumRoot, origin: 'public-site', viewport: socialViewport, bytes: 686612, alt: 'Abertura institucional da Axium para compartilhamento social.', description: 'Captura principal preparada para uso social.', authorizationStatus: 'confirmed' }),
      image({ slug: axiumSlug, filename: 'axium-home-mobile.png', roles: ['mobile'], sourceUrl: axiumRoot, origin: 'public-site', viewport: mobileViewport, bytes: 251481, alt: 'Abertura institucional da Axium em mobile.', description: 'Referência responsiva da homepage pública.', authorizationStatus: 'confirmed' }),
      image({ slug: axiumSlug, filename: 'axium-nr01-desktop.png', roles: ['gallery', 'desktop'], sourceUrl: `${axiumRoot}nr-01`, origin: 'public-site', viewport: desktopViewport, bytes: 366669, alt: 'Página NR-01 da Axium em desktop.', description: 'Página pública de serviço especializado.', authorizationStatus: 'confirmed' }),
      image({ slug: axiumSlug, filename: 'axium-nr01-mobile.png', roles: ['gallery', 'mobile'], sourceUrl: `${axiumRoot}nr-01`, origin: 'public-site', viewport: mobileViewport, bytes: 134201, alt: 'Página NR-01 da Axium em mobile.', description: 'Referência responsiva da página de serviço.', authorizationStatus: 'confirmed' }),
      image({ slug: axiumSlug, filename: 'axium-blog-desktop.png', roles: ['gallery', 'desktop'], sourceUrl: `${axiumRoot}blog/6`, origin: 'public-site', viewport: desktopViewport, bytes: 494293, alt: 'Artigo do blog da Axium em desktop.', description: 'Página editorial pública.', authorizationStatus: 'confirmed' }),
      image({ slug: axiumSlug, filename: 'axium-blog-mobile.png', roles: ['gallery', 'mobile'], sourceUrl: `${axiumRoot}blog/6`, origin: 'public-site', viewport: mobileViewport, bytes: 172923, alt: 'Artigo do blog da Axium em mobile.', description: 'Referência responsiva da página editorial.', authorizationStatus: 'confirmed' }),
      video({ slug: axiumSlug, filename: 'axium-tour-desktop.webm', roles: ['demo', 'desktop'], sourceUrl: axiumRoot, origin: 'public-site', viewport: desktopViewport, bytes: 8104329, alt: 'Tour desktop da Axium.', description: 'Navegação por homepage, NR-01 e artigo do blog.', authorizationStatus: 'confirmed', durationSeconds: 64.8, posterPath: axiumCover, fallbackPath: axiumCover }),
      video({ slug: axiumSlug, filename: 'axium-tour-mobile.webm', roles: ['demo', 'mobile'], sourceUrl: axiumRoot, origin: 'public-site', viewport: mobileViewport, bytes: 8836143, alt: 'Tour mobile da Axium.', description: 'Navegação móvel por homepage, NR-01 e artigo do blog.', authorizationStatus: 'confirmed', durationSeconds: 76.16, posterPath: axiumMobileCover, fallbackPath: axiumMobileCover }),
    ],
  },
  {
    slug: devScheduleSlug,
    evidenceStatus: 'confirmed',
    contentStatus: 'ready',
    authorizationStatus: 'not-required',
    authorizationSource: null,
    linkStatus: 'verified',
    mediaStatus: 'ready',
    blockers: [],
    nextSteps: [],
    assets: [
      image({ slug: devScheduleSlug, filename: 'devschedule-social.png', roles: ['cover', 'social', 'gallery', 'desktop'], sourceUrl: devScheduleRoot, origin: 'public-site', viewport: socialViewport, bytes: 219276, alt: 'Fluxo público do DevSchedule para compartilhamento social.', description: 'Captura principal preparada para uso social.', authorizationStatus: 'not-required' }),
      image({ slug: devScheduleSlug, filename: 'devschedule-client-services-mobile.png', roles: ['mobile'], sourceUrl: devScheduleRoot, origin: 'public-site', viewport: mobileViewport, bytes: 108170, alt: 'Seleção de serviços do DevSchedule em mobile.', description: 'Referência responsiva do início do fluxo.', authorizationStatus: 'not-required' }),
      image({ slug: devScheduleSlug, filename: 'devschedule-client-calendar-desktop.png', roles: ['gallery', 'desktop'], sourceUrl: devScheduleRoot, origin: 'public-site', viewport: desktopViewport, bytes: 163670, alt: 'Calendário de agendamento do DevSchedule em desktop.', description: 'Etapa pública de escolha de data.', authorizationStatus: 'not-required' }),
      image({ slug: devScheduleSlug, filename: 'devschedule-client-calendar-mobile.png', roles: ['gallery', 'mobile'], sourceUrl: devScheduleRoot, origin: 'public-site', viewport: mobileViewport, bytes: 69993, alt: 'Calendário de agendamento do DevSchedule em mobile.', description: 'Etapa móvel de escolha de data.', authorizationStatus: 'not-required' }),
      image({ slug: devScheduleSlug, filename: 'devschedule-client-availability-desktop.png', roles: ['gallery', 'desktop'], sourceUrl: devScheduleRoot, origin: 'public-site', viewport: desktopViewport, bytes: 171974, alt: 'Horários disponíveis do DevSchedule em desktop.', description: 'Etapa pública de disponibilidade.', authorizationStatus: 'not-required' }),
      image({ slug: devScheduleSlug, filename: 'devschedule-client-availability-mobile.png', roles: ['gallery', 'mobile'], sourceUrl: devScheduleRoot, origin: 'public-site', viewport: mobileViewport, bytes: 73244, alt: 'Horários disponíveis do DevSchedule em mobile.', description: 'Etapa móvel de disponibilidade.', authorizationStatus: 'not-required' }),
      image({ slug: devScheduleSlug, filename: 'devschedule-client-data-desktop.png', roles: ['gallery', 'desktop'], sourceUrl: devScheduleRoot, origin: 'public-site', viewport: desktopViewport, bytes: 169960, alt: 'Dados do agendamento no DevSchedule em desktop.', description: 'Etapa do fluxo sem efetivação de novo agendamento.', authorizationStatus: 'not-required' }),
      image({ slug: devScheduleSlug, filename: 'devschedule-client-data-mobile.png', roles: ['gallery', 'mobile'], sourceUrl: devScheduleRoot, origin: 'public-site', viewport: mobileViewport, bytes: 69373, alt: 'Dados do agendamento no DevSchedule em mobile.', description: 'Etapa móvel sem efetivação de novo agendamento.', authorizationStatus: 'not-required' }),
      image({ slug: devScheduleSlug, filename: 'devschedule-admin-dashboard-desktop.png', roles: ['gallery', 'desktop'], sourceUrl: `${devScheduleRoot}admin`, origin: 'authenticated-demo', viewport: desktopViewport, bytes: 204993, alt: 'Dashboard administrativo demonstrativo do DevSchedule em desktop.', description: 'Estado administrativo com dados de demonstração controlados.', authorizationStatus: 'not-required' }),
      image({ slug: devScheduleSlug, filename: 'devschedule-admin-dashboard-mobile.png', roles: ['gallery', 'mobile'], sourceUrl: `${devScheduleRoot}admin`, origin: 'authenticated-demo', viewport: mobileViewport, bytes: 64492, alt: 'Dashboard administrativo demonstrativo do DevSchedule em mobile.', description: 'Estado administrativo móvel com dados de demonstração controlados.', authorizationStatus: 'not-required' }),
      video({ slug: devScheduleSlug, filename: 'devschedule-client-desktop.webm', roles: ['demo', 'desktop'], sourceUrl: devScheduleRoot, origin: 'public-site', viewport: desktopViewport, bytes: 1406410, alt: 'Fluxo do cliente do DevSchedule em desktop.', description: 'Serviço, calendário, disponibilidade, horário e dados do cliente.', authorizationStatus: 'not-required', durationSeconds: 16.6, posterPath: devScheduleCover, fallbackPath: devScheduleCover }),
      video({ slug: devScheduleSlug, filename: 'devschedule-client-mobile.webm', roles: ['demo', 'mobile'], sourceUrl: devScheduleRoot, origin: 'public-site', viewport: mobileViewport, bytes: 1018410, alt: 'Fluxo do cliente do DevSchedule em mobile.', description: 'Fluxo móvel sem novo agendamento efetivado.', authorizationStatus: 'not-required', durationSeconds: 19.2, posterPath: devScheduleMobileCover, fallbackPath: devScheduleMobileCover }),
      video({ slug: devScheduleSlug, filename: 'devschedule-admin-desktop.webm', roles: ['demo', 'desktop'], sourceUrl: `${devScheduleRoot}admin`, origin: 'authenticated-demo', viewport: desktopViewport, bytes: 1447553, alt: 'Fluxo administrativo do DevSchedule em desktop.', description: 'Dashboard e gestão em estado demonstrativo controlado.', authorizationStatus: 'not-required', durationSeconds: 13.92, posterPath: devScheduleAdmin, fallbackPath: devScheduleAdmin }),
      video({ slug: devScheduleSlug, filename: 'devschedule-admin-mobile.webm', roles: ['demo', 'mobile'], sourceUrl: `${devScheduleRoot}admin`, origin: 'authenticated-demo', viewport: mobileViewport, bytes: 1226553, alt: 'Fluxo administrativo do DevSchedule em mobile.', description: 'Dashboard administrativo móvel em estado demonstrativo controlado.', authorizationStatus: 'not-required', durationSeconds: 16.2, posterPath: devScheduleAdminMobile, fallbackPath: devScheduleAdminMobile }),
    ],
  },
  {
    slug: greenTweetSlug,
    evidenceStatus: 'confirmed',
    contentStatus: 'ready',
    authorizationStatus: 'not-required',
    authorizationSource: null,
    linkStatus: 'verified',
    mediaStatus: 'ready',
    blockers: [],
    nextSteps: [],
    assets: [
      image({ slug: greenTweetSlug, filename: 'greentweet-social.png', roles: ['cover', 'social', 'gallery', 'desktop'], sourceUrl: `${greenTweetRoot}feed`, origin: 'authenticated-demo', viewport: socialViewport, bytes: 252431, alt: 'Feed demonstrativo do GreenTweet para compartilhamento social.', description: 'Estado demonstrativo preparado para uso social.', authorizationStatus: 'not-required' }),
      image({ slug: greenTweetSlug, filename: 'greentweet-feed-mobile.png', roles: ['mobile'], sourceUrl: `${greenTweetRoot}feed`, origin: 'authenticated-demo', viewport: mobileViewport, bytes: 48543, alt: 'Feed demonstrativo do GreenTweet em mobile.', description: 'Referência móvel do feed autenticado.', authorizationStatus: 'not-required' }),
      image({ slug: greenTweetSlug, filename: 'greentweet-feed-posts-mobile.png', roles: ['gallery', 'mobile'], sourceUrl: `${greenTweetRoot}feed`, origin: 'authenticated-demo', viewport: mobileViewport, bytes: 80183, alt: 'Publicações do feed do GreenTweet em mobile.', description: 'Posts de demonstração no feed autenticado.', authorizationStatus: 'not-required' }),
      image({ slug: greenTweetSlug, filename: 'greentweet-profile-desktop.png', roles: ['gallery', 'desktop'], sourceUrl: `${greenTweetRoot}profile`, origin: 'authenticated-demo', viewport: desktopViewport, bytes: 246486, alt: 'Perfil demonstrativo do GreenTweet em desktop.', description: 'Área de perfil em estado autenticado de demonstração.', authorizationStatus: 'not-required' }),
      image({ slug: greenTweetSlug, filename: 'greentweet-profile-mobile.png', roles: ['gallery', 'mobile'], sourceUrl: `${greenTweetRoot}profile`, origin: 'authenticated-demo', viewport: mobileViewport, bytes: 58987, alt: 'Perfil demonstrativo do GreenTweet em mobile.', description: 'Área móvel de perfil em demonstração.', authorizationStatus: 'not-required' }),
      image({ slug: greenTweetSlug, filename: 'greentweet-notifications-desktop.png', roles: ['gallery', 'desktop'], sourceUrl: `${greenTweetRoot}notifications`, origin: 'authenticated-demo', viewport: desktopViewport, bytes: 78183, alt: 'Notificações demonstrativas do GreenTweet em desktop.', description: 'Estados de notificação sem informações privadas.', authorizationStatus: 'not-required' }),
      image({ slug: greenTweetSlug, filename: 'greentweet-notifications-mobile.png', roles: ['gallery', 'mobile'], sourceUrl: `${greenTweetRoot}notifications`, origin: 'authenticated-demo', viewport: mobileViewport, bytes: 39051, alt: 'Notificações demonstrativas do GreenTweet em mobile.', description: 'Estados móveis de notificação sem informações privadas.', authorizationStatus: 'not-required' }),
      image({ slug: greenTweetSlug, filename: 'greentweet-demo-profile-desktop.png', roles: ['gallery', 'desktop'], sourceUrl: `${greenTweetRoot}profile`, origin: 'authenticated-demo', viewport: desktopViewport, bytes: 68272, alt: 'Perfil de demonstração do GreenTweet em desktop.', description: 'Perfil de outro usuário de demonstração.', authorizationStatus: 'not-required' }),
      image({ slug: greenTweetSlug, filename: 'greentweet-demo-profile-mobile.png', roles: ['gallery', 'mobile'], sourceUrl: `${greenTweetRoot}profile`, origin: 'authenticated-demo', viewport: mobileViewport, bytes: 43169, alt: 'Perfil de demonstração do GreenTweet em mobile.', description: 'Perfil móvel de outro usuário de demonstração.', authorizationStatus: 'not-required' }),
      image({ slug: greenTweetSlug, filename: 'greentweet-comments-desktop.png', roles: ['gallery', 'desktop'], sourceUrl: `${greenTweetRoot}feed`, origin: 'authenticated-demo', viewport: desktopViewport, bytes: 290983, alt: 'Comentários demonstrativos do GreenTweet em desktop.', description: 'Interações de comentários com conteúdo de demonstração.', authorizationStatus: 'not-required' }),
      image({ slug: greenTweetSlug, filename: 'greentweet-comments-mobile.png', roles: ['gallery', 'mobile'], sourceUrl: `${greenTweetRoot}feed`, origin: 'authenticated-demo', viewport: mobileViewport, bytes: 95291, alt: 'Comentários demonstrativos do GreenTweet em mobile.', description: 'Interações móveis de comentários em demonstração.', authorizationStatus: 'not-required' }),
      video({ slug: greenTweetSlug, filename: 'greentweet-tour-desktop.webm', roles: ['demo', 'desktop'], sourceUrl: `${greenTweetRoot}feed`, origin: 'authenticated-demo', viewport: desktopViewport, bytes: 3093127, alt: 'Tour desktop do GreenTweet.', description: 'Feed, compositor, perfil, notificações e comentários de demonstração.', authorizationStatus: 'not-required', durationSeconds: 40.24, posterPath: greenTweetCover, fallbackPath: greenTweetCover }),
      video({ slug: greenTweetSlug, filename: 'greentweet-tour-mobile.webm', roles: ['demo', 'mobile'], sourceUrl: `${greenTweetRoot}feed`, origin: 'authenticated-demo', viewport: mobileViewport, bytes: 2996435, alt: 'Tour mobile do GreenTweet.', description: 'Jornada móvel autenticada com dados de demonstração.', authorizationStatus: 'not-required', durationSeconds: 53.52, posterPath: greenTweetMobileCover, fallbackPath: greenTweetMobileCover }),
    ],
  },
  {
    slug: almaSlug,
    evidenceStatus: 'confirmed',
    contentStatus: 'ready',
    authorizationStatus: 'confirmed',
    authorizationSource: paidAuthorizationSource,
    linkStatus: 'verified',
    mediaStatus: 'ready',
    blockers: [],
    nextSteps: [],
    assets: [
      image({ slug: almaSlug, filename: 'alma-social.png', roles: ['cover', 'social', 'gallery', 'desktop'], sourceUrl: almaRoot, origin: 'public-site', viewport: { width: 1689, height: 725 }, bytes: 1587706, alt: 'Abertura de A Alma no Comando para compartilhamento social.', description: 'Captura principal preparada para uso social.', authorizationStatus: 'confirmed' }),
      image({ slug: almaSlug, filename: 'alma-home-mobile.png', roles: ['mobile'], sourceUrl: almaRoot, origin: 'public-site', viewport: mobileViewport, bytes: 471207, alt: 'Abertura do site A Alma no Comando em mobile.', description: 'Referência móvel da landing page pública.', authorizationStatus: 'confirmed' }),
      image({ slug: almaSlug, filename: 'alma-method-desktop.png', roles: ['gallery', 'desktop'], sourceUrl: almaRoot, origin: 'public-site', viewport: desktopViewport, bytes: 200916, alt: 'Seção de método do site A Alma no Comando.', description: 'Conteúdo público do método em desktop.', authorizationStatus: 'confirmed' }),
      image({ slug: almaSlug, filename: 'alma-book-desktop.png', roles: ['gallery', 'desktop'], sourceUrl: almaRoot, origin: 'public-site', viewport: desktopViewport, bytes: 685426, alt: 'Seção da obra no site A Alma no Comando.', description: 'Apresentação pública do livro em desktop.', authorizationStatus: 'confirmed' }),
      image({ slug: almaSlug, filename: 'alma-manifesto-desktop.png', roles: ['gallery', 'desktop'], sourceUrl: almaRoot, origin: 'public-site', viewport: desktopViewport, bytes: 299240, alt: 'Manifesto do site A Alma no Comando em desktop.', description: 'Região final de manifesto e CTA.', authorizationStatus: 'confirmed' }),
      image({ slug: almaSlug, filename: 'alma-manifesto-mobile.png', roles: ['gallery', 'mobile'], sourceUrl: almaRoot, origin: 'public-site', viewport: mobileViewport, bytes: 148806, alt: 'Manifesto do site A Alma no Comando em mobile.', description: 'Região final móvel de manifesto e CTA.', authorizationStatus: 'confirmed' }),
      video({ slug: almaSlug, filename: 'alma-tour-desktop.webm', roles: ['demo', 'desktop'], sourceUrl: almaRoot, origin: 'public-site', viewport: desktopViewport, bytes: 7398363, alt: 'Tour desktop de A Alma no Comando.', description: 'Navegação natural pela landing page até o manifesto final.', authorizationStatus: 'confirmed', durationSeconds: 61.2, posterPath: almaCover, fallbackPath: almaCover }),
      video({ slug: almaSlug, filename: 'alma-tour-mobile.webm', roles: ['demo', 'mobile'], sourceUrl: almaRoot, origin: 'public-site', viewport: mobileViewport, bytes: 5943298, alt: 'Tour mobile de A Alma no Comando.', description: 'Navegação móvel até a região de manifesto.', authorizationStatus: 'confirmed', durationSeconds: 49.92, posterPath: almaMobileCover, fallbackPath: almaMobileCover }),
    ],
  },
  {
    slug: alicerceSlug,
    evidenceStatus: 'confirmed',
    contentStatus: 'ready',
    authorizationStatus: 'confirmed',
    authorizationSource: paidAuthorizationSource,
    linkStatus: 'verified',
    mediaStatus: 'ready',
    blockers: [],
    nextSteps: [],
    assets: [
      image({ slug: alicerceSlug, filename: 'alicerce-social.png', roles: ['cover', 'social', 'gallery', 'desktop'], sourceUrl: alicerceRoot, origin: 'public-site', viewport: socialViewport, bytes: 655748, alt: 'Abertura do Alicerce da Alma para compartilhamento social.', description: 'Captura principal preparada para uso social.', authorizationStatus: 'confirmed' }),
      image({ slug: alicerceSlug, filename: 'alicerce-home-mobile.png', roles: ['mobile'], sourceUrl: alicerceRoot, origin: 'public-site', viewport: mobileViewport, bytes: 235086, alt: 'Abertura do site Alicerce da Alma em mobile.', description: 'Referência móvel da homepage pública.', authorizationStatus: 'confirmed' }),
      image({ slug: alicerceSlug, filename: 'alicerce-services-desktop.png', roles: ['gallery', 'desktop'], sourceUrl: alicerceRoot, origin: 'public-site', viewport: desktopViewport, bytes: 550194, alt: 'Serviços do site Alicerce da Alma em desktop.', description: 'Seção pública de serviços.', authorizationStatus: 'confirmed' }),
      image({ slug: alicerceSlug, filename: 'alicerce-services-mobile.png', roles: ['gallery', 'mobile'], sourceUrl: alicerceRoot, origin: 'public-site', viewport: mobileViewport, bytes: 174837, alt: 'Serviços do site Alicerce da Alma em mobile.', description: 'Seção móvel de serviços.', authorizationStatus: 'confirmed' }),
      image({ slug: alicerceSlug, filename: 'alicerce-differentials-desktop.png', roles: ['gallery', 'desktop'], sourceUrl: alicerceRoot, origin: 'public-site', viewport: desktopViewport, bytes: 578474, alt: 'Diferenciais do site Alicerce da Alma em desktop.', description: 'Seção pública de diferenciais.', authorizationStatus: 'confirmed' }),
      image({ slug: alicerceSlug, filename: 'alicerce-differentials-mobile.png', roles: ['gallery', 'mobile'], sourceUrl: alicerceRoot, origin: 'public-site', viewport: mobileViewport, bytes: 143445, alt: 'Diferenciais do site Alicerce da Alma em mobile.', description: 'Seção móvel de diferenciais.', authorizationStatus: 'confirmed' }),
      image({ slug: alicerceSlug, filename: 'alicerce-testimonials-desktop.png', roles: ['gallery', 'desktop'], sourceUrl: alicerceRoot, origin: 'public-site', viewport: desktopViewport, bytes: 371855, alt: 'Depoimentos exibidos no site Alicerce da Alma em desktop.', description: 'Seção pública de depoimentos; não representa resultado da Repage.', authorizationStatus: 'confirmed' }),
      image({ slug: alicerceSlug, filename: 'alicerce-testimonials-mobile.png', roles: ['gallery', 'mobile'], sourceUrl: alicerceRoot, origin: 'public-site', viewport: mobileViewport, bytes: 142101, alt: 'Depoimentos exibidos no site Alicerce da Alma em mobile.', description: 'Seção móvel de depoimentos; não representa resultado da Repage.', authorizationStatus: 'confirmed' }),
      video({ slug: alicerceSlug, filename: 'alicerce-tour-desktop.webm', roles: ['demo', 'desktop'], sourceUrl: alicerceRoot, origin: 'public-site', viewport: desktopViewport, bytes: 9618405, alt: 'Tour desktop do Alicerce da Alma.', description: 'Navegação natural pelas seções da landing page.', authorizationStatus: 'confirmed', durationSeconds: 77.2, posterPath: alicerceCover, fallbackPath: alicerceCover }),
      video({ slug: alicerceSlug, filename: 'alicerce-tour-mobile.webm', roles: ['demo', 'mobile'], sourceUrl: alicerceRoot, origin: 'public-site', viewport: mobileViewport, bytes: 10639963, alt: 'Tour mobile do Alicerce da Alma.', description: 'Navegação móvel pelas seções da landing page.', authorizationStatus: 'confirmed', durationSeconds: 86.44, posterPath: alicerceMobileCover, fallbackPath: alicerceMobileCover }),
    ],
  },
] as const satisfies readonly ProjectReadiness[];

export function findReadinessBySlug(
  slug: string,
  records: readonly ProjectReadiness[] = projectReadinessManifest,
): ProjectReadiness | undefined {
  return records.find((record) => record.slug === slug);
}

export function findDuplicateReadinessSlugs(records: readonly ProjectReadiness[] = projectReadinessManifest): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  records.forEach((record) => {
    if (seen.has(record.slug)) duplicates.add(record.slug);
    seen.add(record.slug);
  });

  return [...duplicates];
}

export function listRegisteredProjectMediaPaths(
  records: readonly ProjectReadiness[] = projectReadinessManifest,
): readonly string[] {
  return records.flatMap((record) => record.assets.map((asset) => asset.path));
}

export function validateProjectReadinessManifest(
  records: readonly ProjectReadiness[] = projectReadinessManifest,
): string[] {
  const errors: string[] = [];
  const readinessSlugs: readonly string[] = records.map((record) => record.slug);
  const projectRecords: readonly { slug: string; publicationStatus: 'draft' | 'published' }[] = projects;
  const duplicateSlugs = findDuplicateReadinessSlugs(records);
  const duplicatePaths = listRegisteredProjectMediaPaths(records).filter(
    (path, index, paths) => paths.indexOf(path) !== index,
  );

  if (records.length !== projects.length) errors.push('O manifesto deve conter exatamente os seis projetos.');
  if (duplicateSlugs.length) errors.push(`Slugs duplicados no manifesto: ${duplicateSlugs.join(', ')}.`);
  if (duplicatePaths.length) errors.push(`Caminhos de mídia duplicados: ${[...new Set(duplicatePaths)].join(', ')}.`);

  projectRecords.forEach((project) => {
    if (!readinessSlugs.includes(project.slug)) errors.push(`Projeto sem prontidão: ${project.slug}.`);
  });

  records.forEach((record) => {
    const nature = projectNaturesBySlug.get(record.slug);
    if (!nature) errors.push(`Slug de prontidão desconhecido: ${record.slug}.`);
    if (!record.blockers.length && (record.contentStatus === 'blocked' || record.mediaStatus === 'blocked')) {
      errors.push(`Estado bloqueado sem bloqueador: ${record.slug}.`);
    }
    if (record.blockers.length !== record.nextSteps.length || record.blockers.some((blocker) => !blocker.trim()) || record.nextSteps.some((nextStep) => !nextStep.trim())) {
      errors.push(`Bloqueador sem próximo passo coerente: ${record.slug}.`);
    }
    validateAuthorization(record, nature, errors);
    validateAssets(record, errors);
  });

  return errors;
}

function validateAuthorization(record: ProjectReadiness, nature: ProjectNature | undefined, errors: string[]) {
  if (!nature) return;
  if (nature === 'paid' && record.authorizationStatus !== 'confirmed') {
    errors.push(`Projeto pago sem autorização confirmada: ${record.slug}.`);
  }
  if (nature === 'paid' && !record.authorizationSource?.trim()) {
    errors.push(`Projeto pago sem fonte de autorização: ${record.slug}.`);
  }
  if (nature !== 'paid' && record.authorizationStatus !== 'not-required') {
    errors.push(`Projeto não pago exige not-required: ${record.slug}.`);
  }
  if (nature !== 'paid' && record.authorizationSource !== null) {
    errors.push(`Projeto não pago não deve registrar fonte de autorização: ${record.slug}.`);
  }
}

function validateAssets(record: ProjectReadiness, errors: string[]) {
  const registeredRoles = new Set(record.assets.flatMap((asset) => asset.roles));
  const requiredRoles: readonly ProjectMediaRole[] = ['cover', 'desktop', 'mobile', 'gallery', 'demo'];

  if (record.mediaStatus === 'ready' && !record.assets.length) errors.push(`Mídia pronta sem ativos: ${record.slug}.`);
  if (record.mediaStatus === 'ready') {
    requiredRoles.forEach((role) => {
      if (!registeredRoles.has(role)) errors.push(`Função de mídia ausente (${role}): ${record.slug}.`);
    });
  }
  record.assets.forEach((asset) => {
    if (!asset.roles.length) errors.push(`Função de mídia ausente: ${asset.path}.`);
    if (!asset.path.startsWith(`/projects/${record.slug}/`)) errors.push(`Caminho fora do projeto: ${asset.path}.`);
    if (!asset.path.endsWith(`.${asset.format}`)) errors.push(`Extensão incompatível: ${asset.path}.`);
    if (asset.width <= 0 || asset.height <= 0 || asset.bytes <= 0) errors.push(`Metadados inválidos: ${asset.path}.`);
    if (asset.viewport.width !== asset.width || asset.viewport.height !== asset.height) errors.push(`Viewport divergente: ${asset.path}.`);
    if (!asset.aspectRatio.trim() || !asset.sourceUrl.startsWith('https://')) errors.push(`Origem ou proporção ausente: ${asset.path}.`);
    if (!asset.alt.trim() || !asset.description.trim() || !asset.compression.trim()) errors.push(`Texto descritivo ausente: ${asset.path}.`);
    if (record.mediaStatus === 'ready' && asset.privacyReview !== 'approved') {
      errors.push(`Mídia pronta sem revisão de privacidade aprovada: ${asset.path}.`);
    }
    if (asset.authorizationStatus !== record.authorizationStatus) errors.push(`Autorização de mídia divergente: ${asset.path}.`);
    if (asset.kind === 'video' && (!asset.durationSeconds || !asset.codec || asset.hasAudio !== false || !asset.posterPath || !asset.fallbackPath)) {
      errors.push(`Vídeo sem metadados, poster ou fallback: ${asset.path}.`);
    }
  });
}
