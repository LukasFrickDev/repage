# Repage Frontend — Instruções

## Escopo

Aplica-se a `frontend/` e complementa [`../AGENTS.md`](../AGENTS.md). Consultar Produto, Arquitetura, Design System, ADR e spec aplicáveis antes de alterar rotas, portfólio, formulário, consentimento, SEO ou experiência.

## Stack e estado

Stack aprovada: React, TypeScript, Vite, Styled Components, Framer Motion, React Router, React Hook Form, Zod e Fetch API encapsulada.

A baseline pode ainda não conter todas as dependências da arquitetura-alvo. Confirmar `package.json` antes de usar; não confundir decisão aprovada com implementação existente.

## Organização

```text
src/
├── app/
├── assets/
├── components/
├── data/projects/
├── features/consent/
├── features/lead-form/
├── pages/
├── sections/home/
├── services/api/
├── services/analytics/
├── styles/
├── types/
└── utils/
```

- componentes compartilhados em `components`;
- seções exclusivas da homepage em `sections/home`;
- páginas em `pages`;
- tipos próximos ao domínio;
- padrão preferencial `ComponentName/index.tsx`, `styles.ts` e teste próximo;
- não criar abstração genérica para uso único.

Estado local é padrão. `ConsentProvider` é contexto global aprovado. Não adicionar Redux ou store equivalente na V1.

## Rotas

```text
/
/portfolio
/portfolio/:slug
/privacidade
/cookies
/*
```

Âncoras:

```text
/#servicos
/#processo
/#sobre
/#contato
```

Usar um `PublicLayout`. CTAs internos de orçamento apontam para `/#contato`. Navegação entre rotas e âncoras deve posicionar conteúdo, mover foco e respeitar `prefers-reduced-motion`.

Não criar `href="#"`, rota inexistente, CTA falso ou aparência de ação sem destino.

## Portfólio

Portfólio da V1 é estático, tipado, versionado e derivado de uma fonte única. A mesma estrutura alimenta homepage, listagem, cases, ordem, metadados, Open Graph e sitemap.

Cada projeto deve registrar slug, título, natureza, destaque, ordem, resumo, contexto, desafio, solução, participação, serviços, funcionalidades, tecnologias, galeria, URL opcional, autorização, indicador de projeto anterior à Repage e SEO.

Naturezas: pago, próprio ou desafio técnico. Projetos próprios e desafios não podem ser apresentados como clientes.

Não criar modelo Django, API, CMS ou CRUD de portfólio na V1.

## Conteúdo

Não inventar copy definitiva, projeto, cliente, métrica, resultado, funcionalidade, URL, autorização ou imagem. Placeholder de desenvolvimento deve ser explícito e não pode chegar ao lançamento.

## Estilos e identidade

- Styled Components é o sistema principal;
- consumir tokens;
- evitar valores mágicos;
- manter estilos próximos;
- não introduzir Tailwind, CSS Modules, Sass, biblioteca de UI ou segundo sistema sem decisão;
- prevenir overflow na origem;
- preservar logo, símbolo, paleta, Instrument Sans e contraste;
- usar azul-violeta como destaque estratégico.

A direção é sofisticada, contemporânea, autoral e comercialmente clara.

Evitar template SaaS, dashboard recorrente, bento grid por tendência, glassmorphism, partículas, WebGL, 3D, cursor customizado, glow permanente, livros literais, grids sem função, cards automáticos e repetição de `50 / 50`.

## Tipografia

Instrument Sans é principal. Clash Display é preferência display limitada após validação de licença, acentuação, arquivos, carregamento e mobile. Bricolage Grotesque é apenas contingência comprovada.

Usar fontes locais e evitar layout shift. Não substituir silenciosamente a tipografia.

## Mídia

Imagens da V1 são estáticas, otimizadas e versionadas. Exigir origem, autorização, dimensões, proporção, alt adequado, remoção de dados sensíveis, compressão, poster e fallback quando aplicável.

Usar screenshots reais. Evitar mockup publicitário e mídia externa apresentada como projeto. Aplicar lazy loading, controlar prioridade e impedir autoplay simultâneo. Conteúdo deve continuar compreensível sem vídeo. Cloudinary não é dependência da V1.

## Componentes e estados

Implementar, quando aplicável: padrão, hover, foco, pressionado, desabilitado, carregamento, sucesso e erro.

Hover é melhoria, não requisito. Foco deve ser visível. Elemento desabilitado não pode parecer ativo. Loading deve impedir ação duplicada. Erro deve permitir recuperação.

## Formulário

Usar React Hook Form, Zod, validação por campo, normalização e cliente de API encapsulado. Validação do cliente não substitui backend.

Campos: nome, e-mail, WhatsApp, tipo de projeto, marca/negócio, mensagem e ciência da Política de Privacidade.

- rótulos persistentes;
- erros associados e resumo acessível;
- foco no primeiro erro;
- feedback anunciado;
- impedir envio duplicado;
- uma `Idempotency-Key` por tentativa;
- não limpar antes de confirmação;
- sucesso representa persistência;
- não prometer resposta imediata;
- não enviar campos ao Analytics;
- sem formulário em etapas na V1.

## Consentimento e Analytics

Categorias: necessários, analíticos e publicitários. Analíticos e publicitários ficam desativados por padrão.

Permitir aceitar, rejeitar não essenciais, personalizar e revisar escolhas. Carregar Analytics conforme consentimento. Não ativar Ads sem campanha. Nunca enviar dado pessoal ou conteúdo dos campos.

## Movimento

Toda animação deve apresentar, orientar, conectar, demonstrar, hierarquizar ou confirmar. Priorizar `transform` e `opacity`.

Evitar reflow frequente, loop decorativo, scroll hijacking, `scroll-snap` rígido, conteúdo escondido, sticky prolongado, mesma entrada em todas as seções, máquina de escrever e terminal.

Hero executa introdução uma vez; CTA e navegação permanecem disponíveis. Respeitar `prefers-reduced-motion`.

Com movimento reduzido: hero organizado, projetos estáveis, vídeos sem autoplay, transições mínimas e conteúdo completo.

## Responsividade

Referências: desktop amplo acima de ~1440px, notebook 1024–1439px, tablet 768–1023px, mobile abaixo de 768px e ajuste compacto abaixo de ~420px.

Breakpoints surgem quando o conteúdo falha. Mobile é composição própria: CTAs cedo, controles de toque, texto legível, menos sobreposição e nenhum hover obrigatório. Viewport baixo e celular horizontal devem reduzir alturas e sticky. Não usar altura fixa sem necessidade.

## Acessibilidade

Obrigatório: semântica, skip link, ordem de foco, contraste, rótulos, alt, mensagens claras e conteúdo independente de cor, animação, hover ou arraste.

Menu fechado fica fora do foco; aberto prende foco, fecha por `Esc` e devolve foco. Galerias devem funcionar por teclado.

## SEO

Preservar React/Vite e implementar prerender conforme decisão posterior. Exigir HTML por rota, título, descrição, canonical, Open Graph, Twitter Card, imagem social, sitemap derivado, robots por ambiente, JSON-LD quando aplicável, 404, Error Boundary e lazy loading de rotas secundárias.

Não migrar para Next.js na V1.

## Segurança

Nenhum segredo em `VITE_*`; nenhum dado pessoal em URL, Analytics ou console; nenhum formulário completo em log; nenhum detalhe interno em erro; links externos com proteção adequada.

## Testes e QA

Cobertura prioritária:

- schema e normalização;
- dados e seletores de projetos;
- rotas e navegação;
- metadados;
- consentimento;
- integrações com API;
- estados de interface;
- acessibilidade;
- fluxos públicos críticos.

Quando configurados, executar:

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

Não remover testes, reduzir cobertura ou alterar regras apenas para obter aprovação.

### Validação em navegador da Repage

A validação reproduzível em navegador deve usar prioritariamente a suíte Playwright Test do projeto por meio de:

```bash
npm run test:e2e
```

A suíte deve iniciar ou reutilizar o servidor Vite conforme a configuração do projeto, executar o Chromium e produzir resultado verificável pelo terminal.

O servidor MCP `playwright` pode ser utilizado como apoio para:

- exploração interativa;
- inspeção visual complementar;
- reprodução manual de comportamentos;
- captura adicional de screenshots;
- investigação de problemas não cobertos pelos testes automatizados.

A indisponibilidade do Playwright MCP ou do navegador nativo do agente não deve bloquear o QA quando `npm run test:e2e` puder ser executado.

Não considerar `agent.browsers.list()` como verificação da disponibilidade:

- do Playwright Test;
- do Playwright CLI;
- do servidor MCP `playwright`.

Quando aparecer uma mensagem como `no browser is available`, não repetir tentativas pelo mesmo mecanismo. Verificar diretamente se a suíte do projeto pode ser executada pelo terminal.

### Cobertura por entrega

Quando uma alteração afetar interface, navegação ou comportamento público, ampliar ou ajustar os testes end-to-end conforme o escopo.

Validar, quando aplicável:

- rotas públicas afetadas;
- navegação entre rotas e âncoras;
- reload direto;
- voltar e avançar;
- links e ações reais;
- desktop amplo;
- notebook;
- tablet;
- mobile;
- mobile compacto;
- viewport com pouca altura;
- celular na horizontal;
- teclado e ordem de foco;
- skip link;
- foco visível;
- menu mobile;
- contenção e retorno de foco;
- fechamento por `Esc`;
- bloqueio e restauração do scroll do fundo;
- movimento reduzido;
- overflow horizontal;
- console;
- warnings do React;
- falhas de rede;
- estados de loading, sucesso e erro;
- comportamento com mídia indisponível.

Priorizar comportamento observável. Evitar snapshots extensos e testes acoplados à estrutura interna dos componentes.

### Evidências e limitações

Screenshots, traces e vídeos são evidências complementares.

Testes automatizados não substituem integralmente inspeção visual ou julgamento de qualidade estética. O relatório deve diferenciar claramente:

- comportamentos cobertos pela suíte automatizada;
- comportamentos inspecionados interativamente;
- viewports realmente executados;
- itens não validados;
- bloqueios encontrados.

Quando a suíte Playwright Test falhar:

- registrar o comando executado;
- registrar o erro exato;
- distinguir falha da aplicação, configuração, servidor ou instalação do navegador;
- executar todas as validações independentes ainda possíveis;
- não inferir resultados visuais ou interativos.

Quando o Playwright MCP estiver indisponível, não tratar isso como bloqueio se a suíte Playwright Test do projeto estiver funcionando.

## Regressões proibidas

CTA falso, link inexistente, mídia provisória como real, projeto próprio como cliente, menu fechado focável, foco invisível, desabilitado ativo, conteúdo dependente de hover ou animação, autoplay incompatível, scroll hijacking, overflow, mobile comprimido, segredo em `VITE_*` ou dado pessoal em Analytics, console ou URL.
