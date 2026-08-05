import { projects } from '.';
import type { ProjectNature } from '.';

export const EVIDENCE_STATUSES = ['confirmed', 'partial', 'blocked'] as const;
export const CONTENT_STATUSES = ['ready', 'partial', 'blocked'] as const;
export const AUTHORIZATION_STATUSES = ['confirmed', 'pending', 'restricted', 'not-required'] as const;
export const LINK_STATUSES = ['verified', 'unavailable', 'not-applicable', 'blocked'] as const;
export const MEDIA_STATUSES = ['ready', 'partial', 'blocked'] as const;
export const MEDIA_FORMATS = ['webp', 'png', 'svg', 'webm'] as const;

export type EvidenceStatus = (typeof EVIDENCE_STATUSES)[number];
export type ContentStatus = (typeof CONTENT_STATUSES)[number];
export type AuthorizationStatus = (typeof AUTHORIZATION_STATUSES)[number];
export type LinkStatus = (typeof LINK_STATUSES)[number];
export type MediaStatus = (typeof MEDIA_STATUSES)[number];
export type MediaFormat = (typeof MEDIA_FORMATS)[number];

export type ProjectMediaAsset = {
  role: 'cover' | 'desktop' | 'mobile' | 'social' | 'poster' | 'demo';
  path: string;
  format: MediaFormat;
  width: number;
  height: number;
  alt: string;
  privacyReview: 'approved';
  authorizationStatus: AuthorizationStatus;
};

export type ProjectReadiness = {
  slug: string;
  evidenceStatus: EvidenceStatus;
  contentStatus: ContentStatus;
  authorizationStatus: AuthorizationStatus;
  linkStatus: LinkStatus;
  mediaStatus: MediaStatus;
  blockers: readonly string[];
  assets: readonly ProjectMediaAsset[];
};

const projectNaturesBySlug = new Map<string, ProjectNature>(
  projects.map((project) => [project.slug, project.nature]),
);

export const projectReadinessManifest = [
  {
    slug: 'echo-cosmic-energia',
    evidenceStatus: 'confirmed',
    contentStatus: 'partial',
    authorizationStatus: 'pending',
    linkStatus: 'blocked',
    mediaStatus: 'blocked',
    blockers: ['Autorização explícita para uso público ainda não foi registrada.'],
    assets: [],
  },
  {
    slug: 'axium',
    evidenceStatus: 'partial',
    contentStatus: 'partial',
    authorizationStatus: 'pending',
    linkStatus: 'blocked',
    mediaStatus: 'blocked',
    blockers: ['Autorização explícita para uso público ainda não foi registrada.'],
    assets: [],
  },
  {
    slug: 'dev-schedule',
    evidenceStatus: 'confirmed',
    contentStatus: 'ready',
    authorizationStatus: 'not-required',
    linkStatus: 'verified',
    mediaStatus: 'blocked',
    blockers: ['Capturas bloqueadas: navegador controlável indisponível nesta execução.'],
    assets: [],
  },
  {
    slug: 'green-tweet',
    evidenceStatus: 'confirmed',
    contentStatus: 'ready',
    authorizationStatus: 'not-required',
    linkStatus: 'verified',
    mediaStatus: 'blocked',
    blockers: ['Capturas bloqueadas: navegador controlável indisponível nesta execução.'],
    assets: [],
  },
  {
    slug: 'a-alma-no-comando',
    evidenceStatus: 'confirmed',
    contentStatus: 'partial',
    authorizationStatus: 'pending',
    linkStatus: 'unavailable',
    mediaStatus: 'blocked',
    blockers: [
      'Autorização explícita para uso público ainda não foi registrada.',
      'URL de origem retornou HTTP 404 na verificação de 5 de agosto de 2026.',
    ],
    assets: [],
  },
  {
    slug: 'alicerce-da-alma',
    evidenceStatus: 'partial',
    contentStatus: 'blocked',
    authorizationStatus: 'pending',
    linkStatus: 'blocked',
    mediaStatus: 'blocked',
    blockers: [
      'Autorização explícita para uso público ainda não foi registrada.',
      'README do repositório não contém conteúdo verificável do projeto.',
    ],
    assets: [],
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
    if (project.publicationStatus === 'published') errors.push(`Projeto publicado indevidamente: ${project.slug}.`);
  });

  records.forEach((record) => {
    const nature = projectNaturesBySlug.get(record.slug);
    if (!nature) errors.push(`Slug de prontidão desconhecido: ${record.slug}.`);
    if (!record.blockers.length && (record.contentStatus === 'blocked' || record.mediaStatus === 'blocked')) {
      errors.push(`Estado bloqueado sem bloqueador: ${record.slug}.`);
    }
    validateAuthorization(record, nature, errors);
    validateAssets(record, errors);
  });

  return errors;
}

function validateAuthorization(
  record: ProjectReadiness,
  nature: ProjectNature | undefined,
  errors: string[],
) {
  if (!nature) return;

  if (nature === 'paid' && record.authorizationStatus === 'not-required') {
    errors.push(`Projeto pago com autorização inadequada: ${record.slug}.`);
  }
  if (nature !== 'paid' && record.authorizationStatus !== 'not-required') {
    errors.push(`Projeto não pago exige not-required: ${record.slug}.`);
  }
  if (nature === 'paid' && record.authorizationStatus !== 'confirmed') {
    if (record.contentStatus === 'ready' || record.mediaStatus === 'ready' || record.linkStatus === 'verified') {
      errors.push(`Projeto pago sem autorização confirmada não está bloqueado: ${record.slug}.`);
    }
    if (record.assets.length) errors.push(`Projeto pago sem autorização possui mídia: ${record.slug}.`);
  }
}

function validateAssets(record: ProjectReadiness, errors: string[]) {
  if (record.mediaStatus === 'ready' && !record.assets.length) {
    errors.push(`Mídia pronta sem ativos: ${record.slug}.`);
  }

  record.assets.forEach((asset) => {
    if (!asset.path.startsWith(`/projects/${record.slug}/`)) errors.push(`Caminho fora do projeto: ${asset.path}.`);
    if (!asset.path.endsWith(`.${asset.format}`)) errors.push(`Extensão incompatível: ${asset.path}.`);
    if (asset.width <= 0 || asset.height <= 0) errors.push(`Dimensões inválidas: ${asset.path}.`);
    if (!asset.alt.trim()) errors.push(`Alt ausente: ${asset.path}.`);
    if (asset.privacyReview !== 'approved') errors.push(`Privacidade não revisada: ${asset.path}.`);
    if (asset.authorizationStatus !== record.authorizationStatus) {
      errors.push(`Autorização de mídia divergente: ${asset.path}.`);
    }
  });
}
