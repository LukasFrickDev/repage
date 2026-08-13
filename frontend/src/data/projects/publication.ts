import { findProjectBySlug, isProjectNature, projects } from '.';
import type { Project, ProjectNature, PublishedProject } from '.';
import { findReadinessBySlug, projectReadinessManifest } from './projectReadiness';
import type { ProjectReadiness } from './projectReadiness';

const REQUIRED_CONTENT_FIELDS = ['summary', 'overview', 'context', 'challenge', 'solution', 'participation'] as const;
const isPositiveOrder = (value: number): boolean => Number.isInteger(value) && value > 0;

export function getProjectPublicabilityErrors(
  project: Project,
  records: readonly Project[] = projects,
  readinessRecords: readonly ProjectReadiness[] = projectReadinessManifest,
): string[] {
  const errors: string[] = [];
  const readiness = findReadinessBySlug(project.slug, readinessRecords);
  const duplicateSlugs = records.filter((record) => record.slug === project.slug).length > 1;
  const duplicateOrders = records.filter((record) => record.portfolioOrder === project.portfolioOrder).length > 1;

  if (project.publicationStatus !== 'published') errors.push('publicationStatus não é published.');
  if (!isProjectNature(project.nature)) {
    errors.push(`Natureza inválida: ${project.slug}.`);
    return errors;
  }
  REQUIRED_CONTENT_FIELDS.forEach((field) => {
    if (!project[field].trim()) errors.push(`Conteúdo obrigatório ausente: ${field}.`);
  });
  if (!project.services.length) errors.push('Serviços/capacidades ausentes.');
  if (!project.capabilities.length) errors.push('Funcionalidades ausentes.');
  if (!project.media.cover) errors.push('Cover ausente.');
  if (!project.media.gallery.length) errors.push('Galeria ausente.');
  if (!project.routeMetadata.title.trim() || !project.routeMetadata.description.trim()) errors.push('Metadados básicos ausentes.');
  if (!isPositiveOrder(project.portfolioOrder)) errors.push('portfolioOrder inválida.');
  if (duplicateSlugs) errors.push('Slug duplicado.');
  if (duplicateOrders) errors.push('portfolioOrder duplicada.');
  if (project.featuredOrder !== undefined && !isPositiveOrder(project.featuredOrder)) errors.push('featuredOrder inválida.');
  if (!readiness) {
    errors.push('Manifesto de prontidão ausente.');
    return errors;
  }

  if (readiness.contentStatus !== 'ready') errors.push('Conteúdo do manifesto não está ready.');
  if (readiness.mediaStatus !== 'ready') errors.push('Mídia do manifesto não está ready.');
  if (readiness.authorizationStatus !== requiredAuthorization(project.nature)) {
    errors.push(`Autorização incompatível com a natureza: ${project.slug}.`);
  }
  if (project.nature === 'paid' && !readiness.authorizationSource?.trim()) errors.push('Fonte de autorização ausente.');
  if (project.nature !== 'paid' && readiness.authorizationSource !== null) errors.push('Fonte de autorização indevida.');
  if (readiness.assets.some((asset) => asset.privacyReview !== 'approved')) errors.push('Privacidade de mídia não aprovada.');

  const assetsByPath = new Map(readiness.assets.map((asset) => [asset.path, asset]));
  const cover = assetsByPath.get(project.media.cover);
  if (!cover || !cover.roles.includes('cover')) errors.push('Cover não está registrada no manifesto.');
  project.media.gallery.forEach((path) => {
    const asset = assetsByPath.get(path);
    if (!asset || (!asset.roles.includes('gallery') && !asset.roles.includes('mobile'))) {
      errors.push(`Mídia de galeria não está registrada: ${path}.`);
    }
  });
  project.media.videos?.forEach((path) => {
    const asset = assetsByPath.get(path);
    if (!asset || asset.kind !== 'video' || (!asset.roles.includes('desktop') && !asset.roles.includes('mobile'))) errors.push(`Vídeo não está registrado ou classificado: ${path}.`);
  });
  if (project.publicUrl && (readiness.linkStatus !== 'verified' || !isValidPublicUrl(project.publicUrl))) {
    errors.push('URL pública não está verificada.');
  }

  return errors;
}

function isValidPublicUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:'
      && /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$|^(?:\d{1,3}\.){3}\d{1,3}$/i.test(url.hostname);
  } catch {
    return false;
  }
}

function requiredAuthorization(nature: ProjectNature): 'confirmed' | 'not-required' {
  return nature === 'paid' ? 'confirmed' : 'not-required';
}

export function isProjectPublicable(
  project: Project,
  records: readonly Project[] = projects,
  readinessRecords: readonly ProjectReadiness[] = projectReadinessManifest,
): project is PublishedProject {
  return getProjectPublicabilityErrors(project, records, readinessRecords).length === 0;
}

export function listPublicProjects(
  records: readonly Project[] = projects,
  readinessRecords: readonly ProjectReadiness[] = projectReadinessManifest,
): PublishedProject[] {
  return records
    .filter((project): project is PublishedProject => isProjectPublicable(project, records, readinessRecords))
    .sort((first, second) => first.portfolioOrder - second.portfolioOrder);
}

export function findPublicProjectBySlug(
  slug: string,
  records: readonly Project[] = projects,
  readinessRecords: readonly ProjectReadiness[] = projectReadinessManifest,
): PublishedProject | undefined {
  const project = findProjectBySlug(slug, records);
  return project && isProjectPublicable(project, records, readinessRecords) ? project : undefined;
}

export function listPublicFeaturedProjects(
  records: readonly Project[] = projects,
  readinessRecords: readonly ProjectReadiness[] = projectReadinessManifest,
): PublishedProject[] {
  return listPublicProjects(records, readinessRecords)
    .filter((project) => project.featuredOrder !== undefined)
    .sort((first, second) => (first.featuredOrder ?? 0) - (second.featuredOrder ?? 0));
}

export function findPublicProjectNeighbors(
  slug: string,
  records: readonly Project[] = projects,
  readinessRecords: readonly ProjectReadiness[] = projectReadinessManifest,
): { previous?: PublishedProject; next?: PublishedProject } {
  const publicProjects = listPublicProjects(records, readinessRecords);
  const index = publicProjects.findIndex((project) => project.slug === slug);
  if (index < 0) return {};
  return { previous: publicProjects[index - 1], next: publicProjects[index + 1] };
}
