export const PROJECT_NATURES = ['paid', 'owned', 'technical-challenge'] as const;

export type ProjectNature = (typeof PROJECT_NATURES)[number];

export const projectNatureLabels: Record<ProjectNature, string> = {
  paid: 'Projeto pago',
  owned: 'Projeto próprio',
  'technical-challenge': 'Desafio técnico',
};

type ProjectBase = {
  title: string;
  slug: string;
  nature: ProjectNature;
  predatesRepage?: true;
  featuredOrder?: 1 | 2 | 3;
};

export type DraftProject = ProjectBase & {
  publicationStatus: 'draft';
};

export type PublishedProject = ProjectBase & {
  publicationStatus: 'published';
};

export type Project = DraftProject | PublishedProject;

export const projects = [
  { title: 'EchoCosmicEnergia', slug: 'echo-cosmic-energia', nature: 'paid', publicationStatus: 'draft', featuredOrder: 1 },
  { title: 'Axium', slug: 'axium', nature: 'paid', publicationStatus: 'draft', featuredOrder: 2 },
  { title: 'DevSchedule', slug: 'dev-schedule', nature: 'technical-challenge', publicationStatus: 'draft', featuredOrder: 3 },
  { title: 'GreenTweet', slug: 'green-tweet', nature: 'owned', publicationStatus: 'draft' },
  { title: 'A Alma no Comando', slug: 'a-alma-no-comando', nature: 'paid', publicationStatus: 'draft' },
  { title: 'Alicerce da Alma', slug: 'alicerce-da-alma', nature: 'paid', publicationStatus: 'draft' },
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

export function listPublishedProjects(records: readonly Project[] = projects): PublishedProject[] {
  return records.filter((project): project is PublishedProject => project.publicationStatus === 'published');
}

export function listFeaturedProjects(records: readonly Project[] = projects): Project[] {
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
