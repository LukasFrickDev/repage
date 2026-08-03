import {
  Globe,
  Rocket,
  LayoutGrid,
  ShoppingCart,
  ServerCog,
  Cloud,
} from 'lucide-react';

const services = [
  {
    icon: Globe,
    title: 'Sites Institucionais',
    description:
      'Sites modernos e responsivos que fortalecem a presença online da sua marca, com design personalizado, SEO básico e estrutura escalável.',
    features: [
      'Design exclusivo',
      'SEO básico configurado',
      'Estrutura escalável',
    ],
  },
  {
    icon: Rocket,
    title: 'Landing Pages',
    description:
      'Páginas de alta conversão focadas em captar leads ou gerar vendas, otimizadas para performance e integradas a ferramentas de marketing.',
    features: [
      'Layout otimizado',
      'Integrações de marketing',
      'Performance mobile',
    ],
  },
  {
    icon: LayoutGrid,
    title: 'Painéis Administrativos',
    description:
      'Interfaces administrativas para autonomia total na gestão de conteúdo, com UI intuitiva, responsiva e segura.',
    features: [
      'UI intuitiva',
      'Gestão sem código',
      'Segurança e escalabilidade',
    ],
  },
  {
    icon: ShoppingCart,
    title: 'E-commerce Personalizado',
    description:
      'Lojas online flexíveis prontas para vender de verdade, com checkout otimizado, meios de pagamento e experiência fluida.',
    features: [
      'Pagamentos integrados',
      'Carrinho e checkout',
      'Experiência fluida',
    ],
  },
  {
    icon: ServerCog,
    title: 'Integrações & Back-End',
    description:
      'APIs REST, automações e integrações com plataformas externas (CRMs, ERPs) usando Python/Django e arquitetura robusta.',
    features: ['APIs REST', 'Integrações externas', 'Arquitetura robusta'],
  },
  {
    icon: Cloud,
    title: 'Hospedagem & Deploy',
    description:
      'Configuração de domínios, deploy otimizado e suporte para manter seu projeto estável em produção.',
    features: ['Domínios e SSL', 'Deploy otimizado', 'Suporte contínuo'],
  },
];

export default services;
