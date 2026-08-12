type NavigationItem = {
  label: string;
  href: string;
};

export type FeaturedProjectSlug = 'echo-cosmic-energia' | 'axium' | 'dev-schedule';

export const navigation: NavigationItem[] = [
  { label: 'Serviços', href: '/#servicos' },
  { label: 'Projetos', href: '/portfolio' },
  { label: 'Como funciona', href: '/#processo' },
  { label: 'Sobre', href: '/#sobre' },
];

export const legalNavigation: NavigationItem[] = [
  { label: 'Privacidade', href: '/privacidade' },
  { label: 'Cookies', href: '/cookies' },
];

export const heroContent = {
  eyebrow: 'Sites e soluções digitais para profissionais, especialistas e negócios.',
  title: 'Uma nova página para o seu negócio começa aqui.',
  description:
    'Estratégia, design e desenvolvimento para transformar ideias e serviços em experiências digitais profissionais, claras e preparadas para fortalecer sua marca e facilitar novos contatos.',
  primaryCta: { label: 'Solicitar orçamento', href: '/#contato' },
  secondaryCta: { label: 'Ver projetos', href: '/portfolio' },
};

export const featuredProjectsSectionContent = {
  eyebrow: 'Projetos selecionados',
  title: 'Trabalho real para necessidades diferentes.',
  description:
    'Uma seleção que reúne comércio digital, presença institucional e uma aplicação de agendamento.',
  summaries: {
    'echo-cosmic-energia':
      'Experiência full stack com catálogo, loja, conteúdo editorial e diferentes pontos de contato em uma presença digital integrada.',
    axium:
      'Experiência institucional para uma empresa de serviços, com páginas especializadas e conteúdo editorial responsivo.',
    'dev-schedule':
      'Aplicação de agendamento com fluxo público por etapas e uma área administrativa demonstrativa.',
  } satisfies Record<FeaturedProjectSlug, string>,
  allProjectsCta: { label: 'Ver todos os projetos', href: '/portfolio' },
};

export const servicesSectionContent = {
  eyebrow: 'O que a Repage desenvolve',
  title: 'Uma solução digital começa pela necessidade, não pelo formato.',
  description:
    'Da ideia à publicação, cada projeto combina estratégia, design e desenvolvimento de acordo com o que o negócio realmente precisa.',
  services: [
    {
      visual: 'landing',
      title: 'Landing pages',
      description:
        'Para campanhas, lançamentos, eventos, produtos e serviços que precisam conduzir o visitante a uma ação principal clara.',
      scope: 'Captação de leads · lançamento de produto · campanha / evento',
      media: {
        desktop: '/projects/a-alma-no-comando/alma-social.png',
        mobile: '/projects/a-alma-no-comando/alma-social.png',
        alt: 'Landing page A Alma no Comando com proposta principal e chamadas para ação.',
        width: 1200,
        height: 630,
      },
      details: ['Campanhas e lançamentos', 'Eventos e inscrições', 'Produtos e serviços', 'Captação de leads'],
    },
    {
      visual: 'institutional',
      title: 'Sites institucionais',
      description:
        'Para apresentar sua marca, organizar serviços e informações e construir uma presença digital profissional e confiável.',
      scope: 'Apresentação da marca · serviços · conteúdo e contato',
      media: {
        desktop: '/projects/axium/axium-social.png',
        mobile: '/projects/axium/axium-home-mobile.png',
        alt: 'Home institucional da Axium com navegação, apresentação da marca e áreas de serviços.',
        width: 1200,
        height: 630,
      },
      details: ['Presença oficial', 'Posicionamento', 'Organização de serviços', 'Informações e canais de contato'],
    },
    {
      visual: 'custom',
      title: 'Soluções personalizadas',
      description:
        'Para necessidades que vão além de uma página: e-commerce, áreas restritas, painéis, agendamentos, integrações e aplicações web avaliadas caso a caso.',
      scope: 'E-commerce · áreas restritas · agendamentos e integrações',
      media: {
        desktop: '/projects/dev-schedule/devschedule-admin-dashboard-desktop.png',
        mobile: '/projects/dev-schedule/devschedule-admin-dashboard-mobile.png',
        alt: 'Painel administrativo do DevSchedule com indicadores, filtros e gestão de agendamentos.',
        width: 1440,
        height: 900,
      },
      details: [
        'E-commerce e áreas restritas',
        'Painéis administrativos e sistemas internos',
        'Agendamentos e fluxos específicos',
        'Integrações, automações e aplicações web',
      ],
    },
  ],
  support: {
    eyebrow: 'E depois da publicação?',
    title: 'Suporte e evolução',
    description:
      'Depois da publicação, a Repage também pode continuar ao lado do projeto com atualizações, correções, refinamentos e novas evoluções avaliadas conforme a necessidade.',
  },
};

export const valuePropositionContent = {
  eyebrow: 'Por que Repage',
  title: 'Clareza para quem chega. Estrutura para o que vem depois.',
  description:
    'A Repage conecta estratégia, direção visual e desenvolvimento para transformar necessidades reais em experiências digitais profissionais, claras e preparadas para evoluir.',
  differentiators: [
    'Atendimento direto com o responsável.',
    'Condução integrada de estrutura, conteúdo, design e desenvolvimento.',
    'Soluções avaliadas conforme a necessidade real.',
    'Continuidade opcional depois da publicação.',
  ],
};

export const processSectionContent = {
  eyebrow: 'Como funciona',
  title: 'Do primeiro alinhamento à publicação.',
  description:
    'Um processo próximo e organizado para transformar contexto, objetivos e decisões em uma entrega clara.',
  steps: [
    { title: 'Conversa', description: 'Entender negócio, necessidade, objetivo, público e momento.' },
    { title: 'Planejamento', description: 'Organizar estrutura, conteúdo, prioridades e caminho da solução.' },
    { title: 'Criação', description: 'Transformar as decisões em direção visual e desenvolvimento.' },
    { title: 'Ajustes', description: 'Revisar a entrega com validações objetivas e refinamentos necessários.' },
    { title: 'Publicação', description: 'Preparar e disponibilizar a solução no ambiente definido.' },
    { title: 'Evolução', description: 'Avaliar suporte, manutenção ou novas necessidades depois da entrega.' },
  ],
};

export const signatureSectionContent = {
  eyebrow: 'Sobre a Repage',
  title: 'Uma marca próxima, com responsabilidade direta.',
  description:
    'A Repage é um estúdio de desenvolvimento web conduzido de forma próxima, unindo estrutura, conteúdo, direção visual e tecnologia para criar experiências digitais profissionais e preparadas para evoluir.',
  signature: 'Projetos conduzidos por Lukas Frick',
  signatureRole: 'Desenvolvimento e direção digital',
};

export const finalCtaSectionContent = {
  eyebrow: 'Vamos conversar',
  title: 'Uma nova página para o seu negócio pode começar por aqui.',
  description:
    'Conte o que você precisa construir ou evoluir. A Repage parte do contexto, objetivo e momento do seu negócio para organizar o próximo passo.',
};

export const siteFooterContent = {
  description: 'Sites e soluções digitais para profissionais, especialistas e negócios.',
  signature: 'Projetos conduzidos por Lukas Frick',
  copyright: '© 2026 Repage. Todos os direitos reservados.',
};
