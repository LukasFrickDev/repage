import { describe, expect, it } from 'vitest';
import {
  findDuplicateProjectSlugs,
  findProjectBySlug,
  isProjectNature,
  listDraftProjects,
  listFeaturedProjectRecords,
  listProjects,
  listPublishedProjectRecords,
  PROJECT_NATURES,
  projects,
} from '.';
import type { Project } from '.';
import { listHomepageFeaturedProjects } from './homepage';
import { findPublicProjectBySlug, getProjectPublicabilityErrors, listPublicProjects } from './publication';
import { projectReadinessManifest } from './projectReadiness';

describe('project data', () => {
  it('registers the six confirmed projects with valid natures, order and editorial content', () => {
    expect(listProjects()).toHaveLength(6);
    expect(listProjects().map((project) => project.title)).toEqual([
      'EchoCosmicEnergia',
      'Axium',
      'DevSchedule',
      'GreenTweet',
      'A Alma no Comando',
      'Alicerce da Alma',
    ]);
    expect(listProjects().map((project) => project.portfolioOrder)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(listProjects().map((project) => project.projectType)).toEqual([
      'Site institucional · E-commerce',
      'Site institucional',
      'Aplicação web · Full stack',
      'Aplicação web · Full stack',
      'Landing page',
      'Landing page',
    ]);
    expect(projects.every((project) => isProjectNature(project.nature))).toBe(true);
    expect(projects.every((project) => project.summary && project.overview && project.context && project.challenge && project.solution && project.participation)).toBe(true);
    expect(PROJECT_NATURES).toEqual(['paid', 'owned', 'technical-challenge']);
  });

  it('finds a registered and a public project by slug', () => {
    expect(findProjectBySlug('dev-schedule')?.title).toBe('DevSchedule');
    expect(findPublicProjectBySlug('dev-schedule')?.title).toBe('DevSchedule');
    expect(findProjectBySlug('unknown-project')).toBeUndefined();
    expect(findPublicProjectBySlug('unknown-project')).toBeUndefined();
  });

  it('separates internal drafts from published records', () => {
    const draft = { ...projects[0], publicationStatus: 'draft' } as Project;
    const records: Project[] = [draft, projects[1]];

    expect(listDraftProjects(records)).toEqual([draft]);
    expect(listPublishedProjectRecords(records)).toEqual([projects[1]]);
    expect(listPublishedProjectRecords()).toHaveLength(6);
  });

  it('detects duplicate slugs', () => {
    const duplicate: Project = { ...projects[0] };

    expect(findDuplicateProjectSlugs([projects[0], duplicate])).toEqual(['echo-cosmic-energia']);
    expect(findDuplicateProjectSlugs()).toEqual([]);
  });

  it('returns only public projects in portfolio order and preserves the three highlights', () => {
    expect(listPublicProjects().map((project) => project.slug)).toEqual([
      'echo-cosmic-energia',
      'axium',
      'dev-schedule',
      'green-tweet',
      'a-alma-no-comando',
      'alicerce-da-alma',
    ]);
    expect(listFeaturedProjectRecords().map((project) => project.slug)).toEqual([
      'echo-cosmic-energia',
      'axium',
      'dev-schedule',
    ]);
    expect(listFeaturedProjectRecords().map((project) => project.featuredOrder)).toEqual([1, 2, 3]);
    expect(listFeaturedProjectRecords()).toHaveLength(3);
  });

  it('resolves each portfolio cover from the readiness manifest', () => {
    listPublicProjects().forEach((project) => {
      const readiness = projectReadinessManifest.find(({ slug }) => slug === project.slug);
      const cover = readiness?.assets.find(({ path }) => path === project.media.cover);

      expect(cover?.kind).toBe('screenshot');
      expect(cover?.roles).toContain('cover');
      expect(cover?.alt.trim()).not.toBe('');
      expect(cover?.width).toBeGreaterThan(0);
      expect(cover?.height).toBeGreaterThan(0);
    });
  });

  it('rejects malformed public URLs even when they start with https://', () => {
    const invalidUrl = { ...projects[0], publicUrl: 'https://not a public url' } as Project;

    expect(getProjectPublicabilityErrors(invalidUrl, [invalidUrl])).toContain('URL pública não está verificada.');
  });

  it('rejects invalid project nature at runtime', () => {
    const invalidNature = { ...projects[0], nature: 'invalid-nature' } as unknown as Project;

    expect(getProjectPublicabilityErrors(invalidNature, [invalidNature])).toContain('Natureza inválida: echo-cosmic-energia.');
  });

  it('does not bypass the publication gate by changing only publicationStatus', () => {
    const invalidReadiness = { ...projectReadinessManifest[0], contentStatus: 'partial' as const };
    const published = { ...projects[0], publicationStatus: 'published' } as Project;

    expect(getProjectPublicabilityErrors(published, [published], [invalidReadiness, ...projectReadinessManifest.slice(1)])).toContain(
      'Conteúdo do manifesto não está ready.',
    );
    expect(findPublicProjectBySlug(published.slug, [published], [invalidReadiness, ...projectReadinessManifest.slice(1)])).toBeUndefined();
  });

  it('resolves each homepage highlight cover from the readiness manifest', () => {
    const highlights = listHomepageFeaturedProjects();

    expect(highlights.map(({ project }) => project.slug)).toEqual([
      'echo-cosmic-energia',
      'axium',
      'dev-schedule',
    ]);
    highlights.forEach(({ cover, desktopProof, mobileProof }) => {
      expect(cover.kind).toBe('screenshot');
      expect(cover.roles).toContain('cover');
      expect(cover.path).toMatch(/^\/projects\/.+\.png$/);
      expect([cover.width, cover.height]).toEqual([1200, 630]);
      expect(cover.alt.trim()).not.toBe('');
      expect(desktopProof?.roles).toEqual(expect.arrayContaining(['desktop', 'gallery']));
      expect(mobileProof?.roles).toContain('mobile');
      expect(desktopProof?.path).toMatch(/^\/projects\/.+\.png$/);
      expect(mobileProof?.path).toMatch(/^\/projects\/.+\.png$/);
    });
  });
});
