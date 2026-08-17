export const siteConfig = {
  brand: {
    name: 'Repage',
  },
  canonicalOrigin: 'https://repage.com.br',
  socialLocale: 'pt_BR',
  slogan: 'Uma nova página para o seu negócio começa aqui.',
  socialImage: {
    path: '/seo/repage-social.png',
    width: 1200,
    height: 630,
    alt: 'Repage — uma nova página para o seu negócio começa aqui.',
  },
} as const;

export function isSiteIndexingEnabled(value: unknown = import.meta.env.VITE_SITE_INDEXING_ENABLED): boolean {
  return value === 'true';
}
