export type NavigationItem = {
  label: string;
  href: string;
};

export type Service = {
  title: string;
  description: string;
  highlights: string[];
};

export type Project = {
  name: string;
  category: string;
  description: string;
  kind: 'client' | 'authorial';
  href?: string;
  image?: string;
};

export type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

export type FaqItem = {
  question: string;
  answer: string;
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
  description: 'Landing pages e sites institucionais para negócios que querem avançar no digital.',
  signature: 'Projetos conduzidos por Lukas Frick',
  copyright: '© 2026 Repage. Todos os direitos reservados.',
};

export const problems = [
  {
    title: 'Seu negócio entrega mais do que o site mostra',
    description:
      'Uma presença digital fraca pode fazer um bom serviço parecer comum antes mesmo da primeira conversa.',
  },
  {
    title: 'Visitas não viram contatos',
    description:
      'Quando a mensagem não é clara e o próximo passo não está visível, o visitante vai embora sem entrar em contato.',
  },
  {
    title: 'O site deixou de acompanhar o momento da empresa',
    description:
      'Layout antigo, experiência ruim no celular e informações dispersas enfraquecem a confiança na marca.',
  },
];

export const primaryServices: Service[] = [
  {
    title: 'Landing pages',
    description:
      'Uma página estratégica para apresentar uma oferta com clareza e conduzir o visitante para a ação certa.',
    highlights: ['Campanhas e lançamentos', 'Captação de contatos', 'Apresentação de serviços ou produtos'],
  },
  {
    title: 'Sites institucionais',
    description:
      'Um site completo para mostrar o valor do seu negócio, seus serviços, diferenciais e formas de contato.',
    highlights: ['Posicionamento e credibilidade', 'Experiência pensada para celular', 'Estrutura pronta para evoluir'],
  },
];

export const customSolution = {
  title: 'Projetos que pedem mais',
  description:
    'Quando a necessidade vai além de uma página, a Repage também desenvolve soluções sob medida, como áreas de membros, painéis, integrações e experiências de venda.',
};

export const featuredProjects: Project[] = [
  {
    name: 'Alicerce da Alma',
    category: 'Site institucional',
    description:
      'Presença digital para comunicar uma proposta de desenvolvimento pessoal com profundidade, clareza e identidade própria.',
    kind: 'client',
    href: 'https://alicercedaalma.com.br',
  },
  {
    name: 'A Alma no Comando',
    category: 'Landing page',
    description:
      'Landing page editorial para apresentar uma obra, organizar a mensagem e conduzir o visitante ao próximo passo.',
    kind: 'client',
    href: 'https://aalmanocomando.com.br',
  },
  {
    name: 'Echo Cosmic Energia',
    category: 'E-commerce e conteúdo',
    description:
      'Projeto com vitrine de produtos, conteúdo e estrutura administrativa para uma operação digital em evolução.',
    kind: 'client',
  },
  {
    name: 'DevSchedule',
    category: 'Produto autoral',
    description:
      'Plataforma de agendamento com experiência para clientes e área administrativa para gestão do negócio.',
    kind: 'authorial',
  },
];

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Entender o momento do negócio',
    description:
      'Começamos pela sua oferta, público, objetivos e pelo que precisa melhorar na presença digital.',
  },
  {
    number: '02',
    title: 'Organizar a mensagem',
    description:
      'Definimos a estrutura, a hierarquia das informações e o caminho que o visitante deve percorrer.',
  },
  {
    number: '03',
    title: 'Projetar e desenvolver',
    description:
      'Transformamos a estratégia em uma experiência visual responsiva, clara e alinhada à sua marca.',
  },
  {
    number: '04',
    title: 'Publicar e evoluir',
    description:
      'Depois da entrega, o site pode continuar evoluindo com melhorias, ajustes e novas necessidades.',
  },
];

export const aboutContent = {
  title: 'Uma marca comercial, com acompanhamento próximo.',
  description:
    'A Repage é conduzida por Lukas Frick, desenvolvedor full stack que une estratégia, design e desenvolvimento para criar presenças digitais que fazem sentido para cada negócio.',
  signature: 'Projetos conduzidos por Lukas Frick.',
};

export const faqItems: FaqItem[] = [
  {
    question: 'A Repage trabalha apenas com landing pages?',
    answer:
      'Não. Landing pages e sites institucionais são as ofertas principais, mas cada projeto é definido de acordo com a necessidade real do negócio.',
  },
  {
    question: 'O site funciona bem no celular?',
    answer:
      'Sim. A experiência é pensada desde o início para celular, tablet e desktop, com leitura, navegação e CTAs confortáveis em cada tela.',
  },
  {
    question: 'Vocês cuidam do conteúdo do site?',
    answer:
      'A Repage ajuda a organizar a mensagem e a estrutura da página. O conteúdo final é construído em conjunto para representar o negócio com clareza.',
  },
  {
    question: 'É possível evoluir o site depois da publicação?',
    answer:
      'Sim. O projeto pode receber correções, novas seções, integrações e melhorias conforme o negócio cresce.',
  },
];

export const briefingContent = {
  title: 'Vamos entender o seu próximo projeto?',
  description:
    'Conte um pouco sobre o seu negócio e o que você precisa melhorar. A partir disso, conversamos sobre o formato mais adequado para o site.',
  ctaLabel: 'Enviar briefing',
  fields: [
    { name: 'name', label: 'Seu nome', type: 'text', required: true },
    { name: 'business', label: 'Empresa ou projeto', type: 'text', required: true },
    { name: 'email', label: 'E-mail', type: 'email', required: true },
    { name: 'whatsapp', label: 'WhatsApp', type: 'tel', required: true },
    {
      name: 'projectType',
      label: 'O que você precisa?',
      type: 'select',
      required: true,
      options: ['Landing page', 'Site institucional', 'Redesign de site', 'Projeto sob medida', 'Ainda não tenho certeza'],
    },
    { name: 'message', label: 'Conte um pouco sobre o projeto', type: 'textarea', required: true },
  ],
};

export const finalCta = {
  title: 'Seu negócio já tem muito a mostrar. Vamos dar a ele uma nova página?',
  description:
    'Converse com a Repage e descubra qual estrutura faz sentido para o seu próximo site.',
  primaryCta: { label: 'Solicitar orçamento', href: '#briefing' },
};
