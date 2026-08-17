# 0001 — Prerender estático com Vite e React

- **Status:** accepted
- **Data:** 16 de agosto de 2026
- **Responsável:** Lukas Frick
- **Substitui:** —
- **Substituído por:** —

## Contexto

A Repage usa React 19 + Vite 7 + React Router 7 em modo declarativo e hoje é entregue como SPA.

A V1 exige HTML específico por rota, prerender build-time, hidratação e hospedagem estática, sem migrar de framework ou adicionar servidor SSR de frontend em produção.

As rotas e dados necessários ao build são conhecidos antecipadamente: rotas institucionais são estáticas e cases derivam do publication gate.

Essa escolha é estrutural porque altera entrypoint, build, compatibilidade server/client, hidratação, Styled Components e forma de adicionar futuras rotas publicáveis.

## Critérios

A solução deve:

1. preservar React/Vite;
2. preservar os contratos atuais do React Router;
3. gerar HTML no build;
4. gerar cases a partir dos slugs publicáveis;
5. hidratar sem reconstruir DOM;
6. funcionar em hospedagem estática;
7. não exigir runtime SSR;
8. integrar ao `npm run build`;
9. falhar quando rota obrigatória não for gerada;
10. preservar Styled Components;
11. preservar consentimento/Analytics deny-by-default;
12. evitar serviço externo de prerender;
13. minimizar refatoração de rotas validadas.

## Alternativas consideradas

### A. Vite native SSG + React static APIs + StaticRouter

Build usa entry estático, `StaticRouter`, API estática do React 19, `hydrateRoot` no cliente e `ServerStyleSheet`.

**Vantagens:** preserva arquitetura e roteamento atuais, sem runtime SSR, sem framework novo, cases derivados da fonte atual.

**Custos:** pequeno pipeline SSG próprio, necessidade de tornar componentes browser-only hydration-safe e testar server/client com rigor.

### B. React Router Framework Mode + prerender nativo

Usar `@react-router/dev` e configuração `prerender`.

**Vantagens:** mecanismo oficial de alto nível do React Router.

**Custos:** migração do modo declarativo atual para Framework Mode, mudança de entrypoints/route modules e refatoração maior de rotas já validadas.

### C. Prerender pós-build com headless browser

Executar a SPA no Chromium e serializar DOM.

**Vantagens:** browser APIs já disponíveis; Playwright já existe.

**Custos:** build depende de browser instalado, maior custo de CI, risco de capturar estado pós-effects/terceiros e hydration menos direta.

### D. SSR em runtime

Rejeitada por aumentar operação e contrariar frontend estático aprovado.

### E. Migrar para Next.js/Astro/Gatsby/Vike

Rejeitada porque não há requisito que justifique migração ampla de framework.

## Decisão proposta

Adotar a alternativa A:

**Vite native SSG + React static prerender + React Router `StaticRouter` + hydration no cliente.**

### Build

O build terá:

- bundle cliente Vite;
- entry de prerender executado apenas em Node durante o build.

O gerador:

1. obtém rotas estáticas;
2. deriva cases de `listPublicProjects()`;
3. prerenderiza cada pathname;
4. coleta Styled Components;
5. injeta metadata/JSON-LD;
6. escreve HTML;
7. gera sitemap/robots;
8. valida outputs;
9. falha diante de inconsistência.

O entry/bundle de prerender é intermediário e não é runtime de produção.

### React

Usar a API estática do React 19 apropriada para Node/SSG, preferencialmente `prerenderToNodeStream` ou equivalente estável da versão instalada.

Motivos:

- API dedicada a SSG;
- aguarda conteúdo assíncrono/Suspense;
- permite lazy routes;
- saída é hidratável com `hydrateRoot`.

Não usar `createRoot` sobre markup prerenderizado.

### Routing

Cliente: `BrowserRouter`.

Build: a mesma árvore de rotas sob `StaticRouter` com location conhecida.

Não duplicar páginas.

### Styled Components

Usar `ServerStyleSheet` para CSS inicial.

Para IDs determinísticos server/client, habilitar o tooling SSR recomendado pelo Styled Components.

Com a stack atual (`@vitejs/plugin-react` v5), a proposta é adicionar como `devDependency`:

```text
babel-plugin-styled-components
```

com configuração SSR no plugin React.

Se a versão efetiva mostrar incompatibilidade, parar e revisar o ADR em vez de trocar compiler silenciosamente.

### Hydration-safe state

Estado que depende de `localStorage`, `window`, `document` ou `matchMedia` não pode determinar o server render diretamente.

O primeiro render server/client precisa ser determinístico; browser state é aplicado depois da hidratação sem alterar os contratos funcionais já aprovados.

## Consequências

### Positivas

- HTML real por rota;
- SEO sem JS obrigatório do crawler;
- frontend continua estático;
- React/Vite/React Router preservados;
- sem servidor SSR;
- cases futuros entram automaticamente pelo publication gate;
- build valida artefato antes do deploy.

### Negativas

- build fica mais sofisticado;
- existe pipeline SSG próprio;
- componentes precisam ser server-safe;
- hydration tests tornam-se obrigatórios;
- entra uma devDependency de tooling para Styled Components SSR.

## Riscos e mitigação

### Hydration mismatch

Mitigar com `hydrateRoot`, primeiro render determinístico, tooling SSR do Styled Components e Playwright/console checks.

### Browser APIs

Isolar em effects/handlers e validar server render no build.

### Divergência de rotas

Cases vêm de `listPublicProjects()`; rotas estáticas/metadata usam registry único.

### Complexidade do pipeline

Manter script pequeno, focado, sem browser/rede externa e com invariantes testadas.

### Upgrades

Isolar SSG em poucos arquivos e manter este ADR como decisão conceitual durável.

## Impacto de implementação

Áreas esperadas:

- `frontend/vite.config.ts`;
- `frontend/package.json`/lockfile;
- entry client;
- entry de prerender;
- gerador SSG;
- metadata central;
- `App`/providers compartilháveis;
- consentimento hydration-safe;
- router/lazy boundaries;
- Styled Components SSR tooling;
- testes build/hydration.

Não exige backend novo, servidor SSR, migration ou deploy nesta entrega.

## Referências

Fontes técnicas consideradas:

- Vite — SSR / Pre-Rendering & SSG;
- React 19 — Static React DOM APIs;
- React — `hydrateRoot`;
- React Router 7 — `StaticRouter`;
- React Router 7 — prerender em Framework Mode como alternativa;
- Styled Components — Vite tooling e SSR.

## Critério para aceitar

Aceitar este ADR junto da spec 0009 se a prioridade permanecer:

**adicionar prerender estático mantendo a aplicação React/Vite/React Router atual, sem runtime SSR nem migração de framework.**
