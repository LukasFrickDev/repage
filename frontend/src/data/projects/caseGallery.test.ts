import { describe, expect, it } from 'vitest';
import { projects } from '.';
import { resolveCaseGallery } from './caseGallery';
import { findReadinessBySlug } from './projectReadiness';

describe('case gallery resolution', () => {
  it('keeps screenshots before videos and resolves every selected video by registered role', () => {
    projects.forEach((project) => {
      const readiness = findReadinessBySlug(project.slug);
      expect(readiness).toBeDefined();

      const gallery = resolveCaseGallery(project, readiness!);
      const selectedVideos = new Set<string>(project.media.videos ?? []);

      [gallery.desktop, gallery.mobile].forEach((assets) => {
        const firstVideoIndex = assets.findIndex((asset) => asset.kind === 'video');
        expect(firstVideoIndex === -1 || assets.slice(firstVideoIndex).every((asset) => asset.kind === 'video')).toBe(true);
        assets.filter((asset) => asset.kind === 'video').forEach((asset) => {
          expect(selectedVideos.has(asset.path)).toBe(true);
          expect(asset.roles).toEqual(expect.arrayContaining([assets === gallery.desktop ? 'desktop' : 'mobile']));
          expect(asset.posterPath).toBeTruthy();
          expect(asset.fallbackPath).toBeTruthy();
        });
      });

      expect(gallery.desktop.filter((asset) => asset.kind === 'video')).not.toHaveLength(0);
      expect(gallery.mobile.filter((asset) => asset.kind === 'video')).not.toHaveLength(0);
    });
  });
});
