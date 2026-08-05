type NavigationItem = {
  label: string;
  href: string;
};

export const navigation: NavigationItem[] = [
  { label: 'Serviços', href: '#servicos' },
  { label: 'Projetos', href: '#projetos' },
  { label: 'Como funciona', href: '#processo' },
  { label: 'Sobre', href: '#sobre' },
];

export const heroContent = {
  eyebrow: 'Landing pages e sites institucionais',
  title: 'Uma nova página para o seu negócio começa aqui.',
  description:
    'Criamos sites claros, rápidos e sob medida para empresas e profissionais que precisam transmitir confiança e transformar visitas em novos contatos.',
  primaryCta: { label: 'Solicitar orçamento', href: '#briefing' },
  secondaryCta: { label: 'Conhecer projetos', href: '#projetos' },
};

export const servicesSectionContent = {
  eyebrow: 'O que a Repage cria',
  title: 'Presença digital que acompanha a ambição do seu negócio.',
  description:
    'Do primeiro acesso ao próximo contato, cada projeto une estratégia, design e tecnologia para fazer sua marca ser compreendida, lembrada e escolhida.',
  services: [
    {
      title: 'Landing pages',
      description:
        'Páginas diretas e estratégicas para campanhas, lançamentos, serviços e captação de novos contatos.',
    },
    {
      title: 'Sites institucionais',
      description:
        'Sites que apresentam sua empresa com clareza, credibilidade e uma experiência à altura do seu negócio.',
    },
    {
      title: 'Suporte e evolução',
      description:
        'Acompanhamento para manter seu site atualizado, rápido e pronto para os próximos passos da sua marca.',
    },
    {
      title: 'Soluções sob medida',
      description:
        'E-commerce, áreas restritas, integrações, painéis e experiências digitais quando o projeto pede mais do que uma página.',
    },
  ],
};

export const featuredProjectsSectionContent = {
  eyebrow: 'Projetos selecionados',
  title: 'Trabalho real, pensado para contextos diferentes.',
  description:
    'Da presença institucional a experiências mais completas, cada projeto foi construído para comunicar com clareza e funcionar bem em qualquer tela.',
  projects: [
    { name: 'Echo Cosmic Energia', category: 'Site comercial e e-commerce' },
    { name: 'Axium', category: 'Landing page empresarial' },
    { name: 'DevSchedule', category: 'Plataforma de agendamento' },
    { name: 'GreenTweet', category: 'Produto social full stack' },
  ],
};

export const processSectionContent = {
  eyebrow: 'Como funciona',
  title: 'Do primeiro briefing ao site no ar.',
  description:
    'Um processo direto, com espaço para alinhamento, decisões bem pensadas e uma entrega que faz sentido para o seu negócio.',
  steps: [
    {
      title: 'Entender o momento',
      description:
        'Conversamos sobre seu negócio, objetivo, público e referências para definir o que o site precisa resolver.',
    },
    {
      title: 'Projetar e construir',
      description:
        'Transformamos estratégia em estrutura, visual e tecnologia, com acompanhamento durante o desenvolvimento.',
    },
    {
      title: 'Publicar e evoluir',
      description:
        'Depois dos ajustes finais, o site vai ao ar pronto para crescer junto com a sua marca.',
    },
  ],
};

export const signatureSectionContent = {
  eyebrow: 'A assinatura Repage',
  title: 'Clareza para quem chega. Estrutura para quem cresce.',
  description:
    'A Repage combina estratégia, direção visual e desenvolvimento para criar experiências digitais que não param na primeira impressão.',
  signature: 'Projetos conduzidos por Lukas Frick',
  signatureRole: 'Desenvolvimento e direção digital',
};

export const finalCtaSectionContent = {
  eyebrow: 'Seu próximo site começa aqui',
  title: 'Vamos criar uma presença digital à altura do seu negócio.',
  description:
    'Conte um pouco sobre o que você precisa. A partir daí, alinhamos a melhor direção para o seu projeto.',
  ctaLabel: 'Solicitar orçamento',
};

export const siteFooterContent = {
  description:
    'Landing pages e sites institucionais para negócios que querem avançar no digital.',
  signature: 'Projetos conduzidos por Lukas Frick',
  copyright: '© 2026 Repage. Todos os direitos reservados.',
};
