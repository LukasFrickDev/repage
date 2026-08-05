import { describe, expect, it } from 'vitest';
import {
  findDuplicateProjectSlugs,
  findProjectBySlug,
  isProjectNature,
  listDraftProjects,
  listProjects,
  listPublishedProjects,
  PROJECT_NATURES,
  projects,
} from '.';
import type { Project, PublishedProject } from '.';

describe('project data', () => {
  it('registers the six confirmed projects with valid natures', () => {
    expect(listProjects()).toHaveLength(6);
    expect(listProjects().map((project) => project.title)).toEqual([
      'EchoCosmicEnergia',
      'Axium',
      'DevSchedule',
      'GreenTweet',
      'A Alma no Comando',
      'Alicerce da Alma',
    ]);
    expect(projects.every((project) => isProjectNature(project.nature))).toBe(true);
    expect(PROJECT_NATURES).toEqual(['paid', 'owned', 'technical-challenge']);
  });

  it('finds a registered project by slug', () => {
    expect(findProjectBySlug('dev-schedule')?.title).toBe('DevSchedule');
    expect(findProjectBySlug('unknown-project')).toBeUndefined();
  });

  it('separates drafts from published projects', () => {
    const published: PublishedProject = {
      title: 'Published example',
      slug: 'published-example',
      nature: 'owned',
      publicationStatus: 'published',
    };
    const records: Project[] = [projects[0], published];

    expect(listDraftProjects(records)).toEqual([projects[0]]);
    expect(listPublishedProjects(records)).toEqual([published]);
    expect(listPublishedProjects()).toHaveLength(0);
  });

  it('detects duplicate slugs', () => {
    const duplicate: Project = { ...projects[0] };

    expect(findDuplicateProjectSlugs([projects[0], duplicate])).toEqual(['echo-cosmic-energia']);
    expect(findDuplicateProjectSlugs()).toEqual([]);
  });
});
