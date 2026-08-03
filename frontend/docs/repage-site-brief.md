# Repage — Site Brief

## Papel do site

O site da Repage é uma ferramenta comercial. Ele deve explicar a oferta de forma simples, transmitir confiança por meio de projetos reais e levar empresas e profissionais a solicitar um orçamento.

Não é um portfólio técnico de desenvolvedor nem um catálogo de tecnologias.

## Posicionamento

> A Repage cria landing pages e sites institucionais para empresas e profissionais que precisam apresentar melhor o seu trabalho, transmitir confiança e transformar visitas em novos contatos.

## Público

- Profissionais e prestadores de serviço.
- Pequenas e médias empresas.
- Negócios que dependem de indicação, WhatsApp ou redes sociais, mas não possuem uma presença digital à altura do que entregam.
- Empresas com site antigo, confuso, lento ou pouco convincente.

## Oferta

### Serviços principais

1. **Landing pages** — páginas focadas em explicar uma oferta e conduzir o visitante a uma ação.
2. **Sites institucionais** — presença digital completa para apresentar empresa, serviços, diferenciais e canais de contato.

### Serviços complementares

- Suporte e evolução após a entrega.
- Soluções sob medida: e-commerce, áreas de membros, painéis e integrações quando o projeto realmente exigir.

Não apresentar soluções sob medida como a mesma prioridade dos dois serviços principais.

## Identidade verbal

- Hero: **Uma nova página para o seu negócio começa aqui.**
- Tom: direto, acessível, profissional e próximo.
- Benefícios e resultado antes de tecnologia.
- Evitar jargões como “stack”, “soluções disruptivas”, “high performance” ou “experiência excepcional” sem explicar valor.
- Não usar promessas, números, avaliações ou clientes inexistentes.

## Identidade visual

- Direção: editorial digital, contemporânea, clara e sofisticada.
- Fundo principal: `#101827`.
- Fundo claro: `#F5F2EC`.
- Ação e destaque: `#6C63FF`.
- Apoio: `#91A8FF` e `#B9C0CC`.
- Interface e leitura: Instrument Sans.
- Destaques editoriais pontuais: Instrument Serif.
- Logo principal: símbolo + wordmark “Repage”.
- Logo não leva slogan fixo.

O violeta é uma cor de atenção: CTA, links, detalhes e estados. Ele não deve dominar toda a página.

## Estrutura da homepage

| Seção | Objetivo |
| --- | --- |
| Header | Identificar a Repage, permitir navegar por âncoras e iniciar o orçamento. |
| Hero | Deixar clara a proposta de valor e conduzir ao orçamento/projetos. |
| Problemas | Fazer o visitante reconhecer a própria situação antes de apresentar a solução. |
| Serviços | Explicar landing page e site institucional em linguagem não técnica. |
| Projetos | Provar capacidade com entregas reais e produtos próprios relevantes. |
| Processo | Reduzir insegurança mostrando como o trabalho acontece. |
| Sobre | Apresentar Lukas de forma breve como assinatura pessoal de uma marca comercial. |
| FAQ | Responder objeções iniciais sem criar barreiras de contato. |
| Briefing | Coletar informações mínimas para iniciar uma conversa produtiva. |
| CTA final e rodapé | Reforçar o próximo passo e canais de contato. |

## Portfólio

Usar apenas projetos reais ou produtos autorais identificados como tal:

- Alicerce da Alma.
- A Alma no Comando.
- Echo Cosmic Energia.
- Axion.
- DevSchedule.
- GreenTweet.

Cada case deve mostrar contexto, desafio, solução e resultado/escopo percebido. Tecnologia é conteúdo secundário. Não usar imagens genéricas como se fossem projetos entregues.

## Responsividade

Responsividade é requisito de produto, não correção final.

- Cada seção deve ser projetada e validada em celular, tablet e desktop.
- Mobile precisa manter hierarquia, leitura, CTAs e navegação confortáveis.
- Não compactar layout desktop sem redesenhar a composição para telas pequenas.
- Navegação, cards, imagens, formulário e FAQ não podem depender de hover.
- Evitar texto cortado, ações pequenas, colunas apertadas e animação excessiva em celular.

## Movimento

- Movimento deve conduzir atenção e demonstrar cuidado de execução.
- Sem tela de abertura longa, texto escondido ou sequência que impeça a leitura.
- Preferir transições curtas, hover discreto, entrada progressiva de conteúdo e microinterações de CTA.
- Respeitar `prefers-reduced-motion`.

## Conteúdo e arquitetura

- Toda copy e dados estáticos devem ficar em `src/content/repageContent.ts`.
- Dados públicos compartilhados ficam em `src/config/site.ts`.
- Componentes não devem conter textos longos, URLs de contato ou dados de projeto hard-coded.
- Não criar backend, CMS, Redux adicional ou camada de API antes de haver uma necessidade real.
- Quando existir backend, adicionar uma camada em `src/services/` sem alterar a estrutura visual dos componentes.

## Critérios de conclusão da primeira versão

- Homepage one-page clara e funcional.
- Página de portfólio separada.
- Marca e paleta aplicadas de forma consistente.
- Versões desktop, tablet e celular validadas.
- Sem projetos ou informações fictícias.
- CTAs e formulário prontos para receber os canais reais.
- `npm run lint` e `npm run build` aprovados.
