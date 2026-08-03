# Repage — Instruções do projeto

## Contexto da marca

Repage é um estúdio comercial de criação de landing pages e sites institucionais.

Posicionamento: criar presença digital clara, rápida, moderna e sob medida para empresas e profissionais que precisam transmitir confiança e transformar visitas em novos contatos.

Ofertas principais:

1. Landing pages
2. Sites institucionais
3. Suporte e evolução
4. Soluções sob medida, como e-commerce, áreas restritas, integrações, painéis e sistemas

A marca é comercial, com assinatura pessoal discreta. Não se apresentar como uma agência grande nem como um portfólio pessoal genérico.

## Fonte de verdade

Antes de trabalhar na homepage, consultar:

- `frontend/docs/repage-site-brief.md`
- `frontend/src/content/repageContent.ts`
- `frontend/src/config/site.ts`

Conteúdo, projetos, textos, links e dados devem permanecer centralizados nesses arquivos.

Não inventar copy, projetos, depoimentos, métricas, resultados, clientes, URLs ou funcionalidades. Quando uma informação não existir, usar estrutura visual honesta ou deixar o destino pendente.

## Stack e arquitetura

- React + TypeScript + Vite
- Styled Components
- Framer Motion já disponível
- Estrutura preferida: `components/NomeDoComponente/index.tsx` e `styles.ts`
- Componentes de seção reutilizáveis em `src/components`
- Páginas em `src/pages`
- Sem Tailwind, shadcn, CSS modules ou bibliotecas de UI novas
- Não adicionar dependências sem necessidade comprovada
- Não alterar rotas, páginas antigas ou código fora do escopo solicitado
- Não fazer refatorações amplas durante implementação de seções

## Identidade visual

- Fonte única: Instrument Sans
- Ink: `#101827`
- Paper: `#F5F2EC`
- Violet: `#6C63FF`
- Blue: `#91A8FF`
- Mist: `#B9C0CC`

A direção visual é tecnológica, contemporânea, sofisticada e chamativa.

Evitar:

- aparência genérica de template SaaS;
- minimalismo vazio;
- serifadas;
- glassmorphism;
- bento grids genéricos;
- bolhas, anéis ou formas abstratas sem função;
- livros ou dobras literais;
- partículas, WebGL, Canvas e efeitos pesados;
- botões excessivamente arredondados;
- imagens externas ou mockups falsos.

Usar profundidade, grids discretos, bordas finas, gradientes violeta–azul controlados, luz, contraste e composição editorial para construir personalidade.

## Movimento

Movimento deve reforçar a interface, nunca distrair ou alterar estrutura.

- Usar entradas curtas e suaves.
- Hover apenas em dispositivos com ponteiro fino.
- Usar `transform`, `opacity`, `background-position` e CSS variables.
- Não animar propriedades que causem reflow.
- Sempre respeitar `prefers-reduced-motion`.
- Tablet e mobile mantêm luz, gradiente e detalhes vivos, mas não dependem de mouse, parallax ou hover.

## Responsividade

Responsividade é requisito de produto.

- Projetar para desktop, notebook, tablet e celular.
- Não tratar mobile como desktop comprimido.
- Não usar altura fixa sem necessidade.
- Não criar espaços vazios artificiais.
- Não causar overflow horizontal.
- Preservar leitura, CTAs e hierarquia em qualquer largura.
- Validar alterações relevantes em 1440px, 1024px, 768px, 430px e 375px.

## Padrões de interface

- Header usa símbolo oficial + texto Repage.
- Símbolo isolado somente para favicon, avatar ou espaços muito restritos.
- CTAs precisam ser claros e convidativos.
- Não criar links vazios, `href="#"`, rotas inexistentes ou interações falsas.
- Se um destino ainda não existir, manter o elemento visual sem navegação.
- Cards de projetos devem usar apenas imagens e informações reais já disponíveis no repositório.

## Scroll e acabamento global

- Scrollbar deve ser discreto e integrado ao visual da Repage.
- Usar trilho transparente.
- Usar thumb fino, com baixa opacidade em Mist/Violet.
- Hover pode aumentar contraste de forma sutil.
- Não esconder completamente o scrollbar.
- Não usar JavaScript para customizar scroll.
- Aplicar `scroll-behavior: smooth` apenas respeitando `prefers-reduced-motion`.

## Qualidade

Ao concluir uma tarefa:

1. Executar `npm run lint`.
2. Executar `npm run build`.
3. Informar arquivos alterados.
4. Descrever comportamento em desktop, tablet e mobile.
5. Parar ao concluir o escopo solicitado.
