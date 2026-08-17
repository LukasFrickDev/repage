import { describe, expect, it } from 'vitest';
import { listPublicProjects } from './data/projects/publication';
import { listPrerenderRoutes } from './prerenderRoutes';

describe('prerender routes', () => {
  it('derives every public case route from the publication gate', () => {
    const routes = listPrerenderRoutes();
    expect(routes).toContain('/');
    expect(routes).toContain('/portfolio');
    expect(routes).toContain('/privacidade');
    expect(routes).toContain('/cookies');
    expect(routes).toContain('/__404__');
    expect(routes.filter((route) => route.startsWith('/portfolio/'))).toEqual(
      listPublicProjects().map((project) => `/portfolio/${project.slug}`),
    );
  });

  it('does not duplicate or include external project URLs', () => {
    const routes = listPrerenderRoutes();
    expect(new Set(routes).size).toBe(routes.length);
    expect(routes.some((route) => route.startsWith('https://'))).toBe(false);
  });
});
