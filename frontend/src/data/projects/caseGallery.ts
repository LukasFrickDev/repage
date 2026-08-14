import type { Project } from '.';
import type { ProjectMediaAsset, ProjectReadiness } from './projectReadiness';

export type CaseGalleryAsset = ProjectMediaAsset;

function resolveAsset(path: string, readiness: ProjectReadiness): ProjectMediaAsset {
  const asset = readiness.assets.find((candidate) => candidate.path === path);
  if (!asset || asset.privacyReview !== 'approved' || asset.state !== 'ready') {
    throw new Error(`Mídia pública inválida no manifesto: ${path}.`);
  }
  return asset;
}

export function resolveCaseGallery(project: Project, readiness: ProjectReadiness): { desktop: CaseGalleryAsset[]; mobile: CaseGalleryAsset[] } {
  const screenshots = project.media.gallery.map((path) => resolveAsset(path, readiness));
  const videos = (project.media.videos ?? []).map((path) => resolveAsset(path, readiness));
  const assets = [...screenshots, ...videos];

  if (assets.some((asset) => asset.kind !== 'screenshot' && asset.kind !== 'video')) {
    throw new Error(`Tipo de mídia pública inválido no manifesto: ${project.slug}.`);
  }

  const orderedAssets = [
    ...assets.filter((asset) => asset.kind === 'screenshot'),
    ...assets.filter((asset) => asset.kind === 'video'),
  ];

  return {
    desktop: orderedAssets.filter((asset) => asset.roles.includes('desktop')),
    mobile: orderedAssets.filter((asset) => asset.roles.includes('mobile')),
  };
}
