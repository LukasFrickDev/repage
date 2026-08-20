export const siteConfig = {
  brand: {
    name: 'Repage',
  },
  publicContacts: {
    email: 'contato@repage.com.br',
    whatsappUrl: 'https://wa.me/5511958244081',
    instagramUrl: 'https://instagram.com/repagebr',
    whatsappDefaultMessage: 'Olá! Conheci a Repage pelo site e gostaria de conversar sobre um projeto.',
  },
  privacyPolicy: {
    version: import.meta.env.VITE_PRIVACY_POLICY_VERSION?.trim() || '2026-08-20-v1',
    date: "20 de agosto de 2026",
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

export function getWhatsAppUrl(): string {
  return `${siteConfig.publicContacts.whatsappUrl}?text=${encodeURIComponent(siteConfig.publicContacts.whatsappDefaultMessage)}`;
}

export function isSiteIndexingEnabled(value: unknown = import.meta.env.VITE_SITE_INDEXING_ENABLED): boolean {
  return value === 'true';
}
