import { existsSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { findProjectBySlug, projects } from '.';
import {
  findDuplicateReadinessSlugs,
  findReadinessBySlug,
  listRegisteredProjectMediaPaths,
  projectReadinessManifest,
  validateProjectReadinessManifest,
} from './projectReadiness';
import type { ProjectReadiness } from './projectReadiness';

const publicProjectsDirectory = resolve(import.meta.dirname, '../../../public/projects');

function listFiles(directory: string): string[] {
  if (!existsSync(directory)) return [];

  return readdirSync(directory).flatMap((entry) => {
    const path = resolve(directory, entry);
    return statSync(path).isDirectory() ? listFiles(path) : [path];
  });
}

describe('project readiness manifest', () => {
  it('covers every draft project with coherent readiness states', () => {
    expect(projectReadinessManifest).toHaveLength(6);
    expect(validateProjectReadinessManifest()).toEqual([]);
    expect(projects.every((project) => project.publicationStatus === 'draft')).toBe(true);
  });

  it('resolves known slugs and rejects unknown slugs', () => {
    expect(findReadinessBySlug('dev-schedule')?.linkStatus).toBe('verified');
    expect(findReadinessBySlug('unknown-project')).toBeUndefined();
    expect(findProjectBySlug('unknown-project')).toBeUndefined();
  });

  it('detects duplicated slugs and paid media without confirmed authorization', () => {
    const duplicate = { ...projectReadinessManifest[0] } satisfies ProjectReadiness;
    const invalidPaidMedia: ProjectReadiness = {
      ...projectReadinessManifest[0],
      mediaStatus: 'ready',
      assets: [{
        role: 'cover',
        path: '/projects/echo-cosmic-energia/cover.webp',
        format: 'webp',
        width: 1440,
        height: 900,
        alt: 'Captura de trabalho.',
        privacyReview: 'approved',
        authorizationStatus: 'pending',
      }],
    };

    expect(findDuplicateReadinessSlugs([projectReadinessManifest[0], duplicate])).toEqual(['echo-cosmic-energia']);
    expect(validateProjectReadinessManifest([invalidPaidMedia, ...projectReadinessManifest.slice(1)])).toContain(
      'Projeto pago sem autorização confirmada não está bloqueado: echo-cosmic-energia.',
    );
  });

  it('has no unregistered project media files', () => {
    const registeredPaths = new Set(listRegisteredProjectMediaPaths().map((path) => path.replace(/^\//, '')));
    const actualPaths = listFiles(publicProjectsDirectory).map((path) => path.replace(/\\/g, '/'));
    const relativePaths = actualPaths.map((path) => path.slice(path.indexOf('/projects/') + 1));

    expect(relativePaths).toEqual([...registeredPaths]);
  });
});
