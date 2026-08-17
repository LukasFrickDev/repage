import { listPublicProjects } from './data/projects/publication';

export const staticRoutes = ['/', '/portfolio', '/privacidade', '/cookies'] as const;

export function listPrerenderRoutes(): string[] {
  return [
    ...staticRoutes,
    ...listPublicProjects().map((project) => `/portfolio/${project.slug}`),
    '/__404__',
  ];
}
