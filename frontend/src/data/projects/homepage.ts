import { listFeaturedProjects } from '.';
import { findReadinessBySlug } from './projectReadiness';
import type { Project } from '.';
import type { ProjectMediaAsset } from './projectReadiness';

export type HomepageFeaturedProject = {
  project: Project;
  cover: ProjectMediaAsset;
  desktopProof?: ProjectMediaAsset;
  mobileProof?: ProjectMediaAsset;
};

export function listHomepageFeaturedProjects(): HomepageFeaturedProject[] {
  return listFeaturedProjects().map((project) => {
    const readiness = findReadinessBySlug(project.slug);
    const cover = readiness?.assets.find((asset) => asset.kind === 'screenshot' && asset.roles.includes('cover'));
    const desktopProof = readiness?.assets.find((asset) => (
      asset.kind === 'screenshot'
      && asset.roles.includes('desktop')
      && asset.roles.includes('gallery')
    ));
    const mobileProof = readiness?.assets.find((asset) => (
      asset.kind === 'screenshot'
      && asset.roles.includes('mobile')
    ));

    if (!cover) throw new Error(`Projeto destacado sem mídia de capa: ${project.slug}.`);

    return { project, cover, desktopProof, mobileProof };
  });
}
