# 0009 — SEO, sitemap e prerender

- **Status:** approved
- **Responsável:** Lukas Frick
- **Data:** 16 de agosto de 2026
- **Branch-base:** `main`
- **Entrega do roadmap:** 9 — SEO, sitemap e prerender
- **ADR relacionado:** `docs/adr/0001-vite-static-prerender.md` — deve estar `accepted` antes da implementação estrutural do prerender
- **Specs predecessoras relevantes:** `0001-frontend-foundation-and-routing.md`, `0003-definitive-homepage.md`, `0004-portfolio-and-cases.md`, `0008-consent-analytics-and-legal-pages.md`

## 1. Contexto

As Entregas 1–8 estão implementadas, validadas e integradas à `main`.

A baseline já possui React 19, TypeScript, Vite 7, Styled Components 6, React Router 7 em modo declarativo, homepage definitiva, `/portfolio`, seis cases públicos, `/privacidade`, `/cookies`, 404, fonte tipada de projetos, publication gate/readiness, metadados básicos por rota, imagens sociais dos projetos, consentimento e GA4 condicionado.

O frontend ainda é uma SPA no primeiro carregamento: `index.html` contém `#root` vazio, o cliente usa `createRoot`, metadados são aplicados no browser e não há HTML específico por rota, canonical, Open Graph completo, Twitter Card, sitemap, JSON-LD final ou prerender integrado ao build.

## 2. Objetivo

Tornar as rotas públicas da Repage renderizadas com HTML específico no build, hidratáveis no cliente, indexáveis conforme política explícita, compartilháveis com metadata social completa e representadas por sitemap/robots derivados das mesmas fontes públicas.

Preservar:

- React;
- Vite;
- React Router;
- hospedagem estática do frontend;
- interação SPA após hidratação;
- consentimento deny-by-default;
- fonte única do portfólio.

## 3. Resultado esperado

Ao final:

- `npm run build` gera HTML real para todas as rotas obrigatórias;
- o conteúdo principal já existe no HTML antes de JavaScript;
- o cliente hidrata sem substituir a árvore;
- não existem warnings de hydration nas rotas obrigatórias;
- title, description, canonical, Open Graph e Twitter Card estão no HTML;
- cases usam dados e mídia da fonte pública existente;
- existe imagem social padrão da Repage para rotas institucionais;
- `sitemap.xml` deriva das rotas indexáveis e dos projetos publicáveis;
- `robots.txt` varia por ambiente;
- JSON-LD contém apenas fatos aprovados;
- o build falha se uma saída obrigatória ou metadata necessária não for gerada.

## 4. Rotas e fonte única

Rotas vigentes:

```text
/
/portfolio
/portfolio/:slug
/privacidade
/cookies
/*
```

Cases de SEO, sitemap e prerender devem vir de `listPublicProjects()` e do publication gate. Não manter lista paralela dos seis slugs.

## 5. Domínio canônico

Domínio aprovado:

```text
https://repage.com.br
```

`www.repage.com.br` não é canônico. O redirecionamento HTTP real pertence à Entrega 10.

Canonicals preservam os paths lógicos atuais, sem trailing slash exceto a raiz:

```text
https://repage.com.br/
https://repage.com.br/portfolio
https://repage.com.br/portfolio/<slug>
https://repage.com.br/privacidade
https://repage.com.br/cookies
```

A estrutura física do `dist` pode usar diretórios com `index.html` sem alterar a URL canônica.

## 6. Política de indexação

### Indexáveis em produção

- `/`;
- `/portfolio`;
- todos os cases retornados por `listPublicProjects()`.

### Não indexáveis

- `/privacidade` → `noindex, follow`;
- `/cookies` → `noindex, follow`;
- 404 → `noindex, nofollow`;
- projetos não publicáveis;
- qualquer ambiente com indexação global desligada.

Quando a indexação global estiver desligada, todas as páginas usam `noindex, nofollow`.

## 7. Indexação por ambiente

Adicionar configuração pública explícita, por exemplo:

```text
VITE_SITE_INDEXING_ENABLED=false
```

Regras:

- default/local = `false`;
- ausente/inválida = deny-by-default;
- produção só indexa quando explicitamente habilitada;
- a variável não é segredo;
- não inferir indexação apenas pelo mode `production` do Vite.

A Entrega 10 configura o ambiente real.

## 8. Configuração central do site

Expandir `siteConfig` para centralizar no mínimo:

- `Repage`;
- URL canônica;
- locale social `pt_BR`;
- imagem social padrão.

Não espalhar `https://repage.com.br` por componentes e scripts.

## 9. Fonte central de metadata

Evoluir o contrato atual de `routeMetadata` para representar, quando aplicável:

- path;
- title;
- description;
- robots policy;
- canonical;
- social image;
- social image alt;
- Open Graph type;
- JSON-LD aplicável.

Cases continuam derivando title/description/slug/imagem dos projetos publicáveis.

A mesma fonte alimenta prerender e navegação SPA. Não manter metadata de server e client separadas.

## 10. Titles e descriptions

Preservar como baseline os textos atuais já aprovados no código.

### Home

```text
Repage | Sites e soluções digitais
```

```text
Estratégia, design e desenvolvimento para transformar ideias e serviços em experiências digitais profissionais.
```

### Portfólio

```text
Portfólio | Repage
```

Usar a description factual atual.

### Privacidade / Cookies

Preservar títulos e descriptions factuais consolidados na 0008.

### Cases

Usar `project.routeMetadata` de cada projeto publicável.

Refinamento editorial só é permitido por problema objetivo de clareza, duplicação ou comprimento, sem reabrir conteúdo do case.

## 11. Canonical

Cada rota válida possui um único `<link rel="canonical">` absoluto.

Cases:

```text
https://repage.com.br/portfolio/<slug>
```

Páginas legais também possuem canonical embora permaneçam `noindex`.

404 e rotas desconhecidas não possuem canonical.

Canonical nunca aponta para localhost, Vercel, API, `www`, projeto externo, query ou hash.

## 12. Open Graph e Twitter/X Card

Rotas válidas recebem, quando aplicável:

- `og:title`;
- `og:description`;
- `og:url`;
- `og:type`;
- `og:site_name=Repage`;
- `og:locale=pt_BR`;
- `og:image`;
- `og:image:width`;
- `og:image:height`;
- `og:image:alt`;
- `twitter:card=summary_large_image`;
- `twitter:title`;
- `twitter:description`;
- `twitter:image`;
- `twitter:image:alt`.

Usar `og:type=website` na V1 para evitar modelagem social desnecessária.

Não inventar handle de Twitter/X.

## 13. Imagem social padrão da Repage

Criar asset dedicado, por exemplo:

```text
frontend/public/seo/repage-social.png
```

Requisitos:

- 1200 × 630;
- identidade Repage aprovada;
- azul-grafite/off-white/violeta;
- logo/nome Repage;
- slogan ou descrição curta apenas se legível;
- sem cliente, métrica, claim novo ou PII;
- compressão adequada.

Uso: home, portfolio, privacidade e cookies.

Checkpoint visual humano obrigatório.

## 14. Imagens sociais dos cases

Preferir `project.media.cover` já aprovado quando:

- estiver no readiness/publication gate;
- tiver revisão de privacidade aprovada;
- arquivo existir;
- dimensão/proporção forem adequadas para social sharing.

Os atuais `*-social.png` são candidatos, mas devem ser verificados.

Se algum não for adequado, preparar asset com mídia já autorizada e reconciliar fonte/readiness sem inventar prova.

Open Graph/Twitter sempre usa URL absoluta em `https://repage.com.br/...`.

## 15. JSON-LD

Implementar apenas dados estruturados factuais.

### Home

- `Organization`;
- `WebSite`.

Pode usar:

- nome `Repage`;
- URL;
- slogan aprovado;
- responsável/fundador `Lukas Frick` quando factual.

Não inventar razão social, CNPJ, endereço, rating, preço, equipe, `sameAs` ou dados empresariais ausentes.

### Portfolio

`BreadcrumbList`:

```text
Início → Portfólio
```

### Cases

`BreadcrumbList`:

```text
Início → Portfólio → <Projeto>
```

Não adicionar Review, Product, LocalBusiness ou schemas artificiais.

Serializar JSON-LD de forma segura; não usar formulário, query string ou dados de Lead.

## 16. Sitemap

Gerar:

```text
dist/sitemap.xml
```

Derivar das mesmas fontes públicas.

Incluir somente:

- home;
- portfolio;
- `listPublicProjects()`.

Excluir:

- privacidade;
- cookies;
- 404;
- drafts/bloqueados;
- URLs externas.

Não adicionar `lastmod`, `changefreq` ou `priority` sem fonte confiável.

## 17. Robots

Gerar:

```text
dist/robots.txt
```

### Indexação habilitada

```text
User-agent: *
Allow: /

Sitemap: https://repage.com.br/sitemap.xml
```

### Indexação desabilitada

```text
User-agent: *
Disallow: /
```

`robots.txt` não substitui `noindex` nem controle de acesso.

## 18. Outputs HTML obrigatórios

O build deve gerar no mínimo:

```text
dist/index.html
dist/portfolio/index.html
dist/portfolio/<slug>/index.html
dist/privacidade/index.html
dist/cookies/index.html
dist/404.html
```

para todos os projetos publicáveis.

Cada output deve conter dentro do root heading e conteúdo textual real. Root vazio não é aceitável.

## 19. Decisão estrutural de prerender

A implementação deve seguir o ADR `0001-vite-static-prerender.md` depois de aceito.

Direção proposta:

- Vite preservado;
- React Router declarativo preservado;
- `BrowserRouter` no cliente;
- `StaticRouter` no prerender;
- APIs estáticas do React 19 para SSG;
- HTML gerado no build;
- `hydrateRoot` no cliente;
- nenhum servidor SSR em produção;
- nenhuma migração para React Router Framework Mode/Next.js;
- nenhum headless browser como mecanismo principal de geração.

## 20. Hydration

Hoje o cliente usa `createRoot`.

A Entrega 9 deve usar `hydrateRoot` quando houver HTML prerenderizado. O shell de desenvolvimento pode continuar usando `createRoot` quando necessário.

Server render e primeiro render do cliente precisam ser determinísticos.

Hydration mismatch é bloqueador.

## 21. Entry de prerender

Criar entry separado para renderizar pathname conhecido.

Responsabilidades:

- router estático;
- mesma árvore de providers/páginas;
- geração estática;
- coleta SSR de Styled Components;
- saída de markup;
- zero Analytics/rede externa;
- nenhuma API browser-only durante render.

Não duplicar páginas.

## 22. Consentimento hydration-safe

A implementação atual lê `localStorage` durante a inicialização do state e é browser-only.

Adaptar apenas o necessário para SSG:

- render inicial server-safe;
- primeiro render client idêntico ao server;
- leitura do storage somente após entrar no browser;
- preferência aplicada depois da hidratação;
- GA continua deny-by-default;
- sem regressão da 0008.

A UI de consentimento pode esperar a hidratação antes de decidir se mostra o banner, evitando mismatch/flash indevido, desde que primeira visita continue recebendo a escolha normalmente.

## 23. Browser APIs e movimento

Durante prerender, render não pode depender diretamente de:

- `window`;
- `document`;
- `localStorage`;
- `sessionStorage`;
- `matchMedia`;
- DOM APIs.

Effects e handlers client-only continuam permitidos.

Framer Motion/reduced motion precisam manter markup inicial compatível entre server/client. Não remover a direção visual aprovada para simplificar SSG.

## 24. Styled Components

Coletar estilos no prerender com `ServerStyleSheet` ou mecanismo oficial equivalente.

IDs de Styled Components devem ser determinísticos entre client/server.

Conforme ADR, habilitar suporte SSR do compilador e registrar a dependência de tooling no lockfile.

Não trocar Styled Components.

## 25. Lazy loading e Error Boundary

Materializar os requisitos já existentes do `frontend/AGENTS.md`:

- lazy loading de rotas secundárias compatível com SSG;
- Error Boundary de aplicação se ainda ausente.

Candidatas a lazy:

- portfolio;
- case;
- privacidade;
- cookies.

Home pode permanecer eager.

O prerender deve aguardar conteúdo assíncrono; HTML contendo apenas fallback de Suspense não atende.

Error Boundary não pode mascarar erro de prerender: rota obrigatória com falha deve falhar o build.

## 26. Pipeline de build

`npm run build` continua sendo o comando canônico e só termina após:

1. validação TypeScript/build client;
2. bundle/entry de prerender necessário;
3. geração de todas as rotas;
4. geração de metadata/head;
5. sitemap;
6. robots;
7. validação dos outputs.

Artefatos intermediários de SSR não permanecem no pacote público final sem necessidade.

## 27. Fail-fast

Build falha se houver:

- rota obrigatória ausente;
- case publicável sem HTML;
- title/description obrigatórios ausentes;
- canonical obrigatório ausente;
- social image ausente/inválida;
- sitemap divergente da fonte pública;
- erro no prerender;
- root vazio;
- política de robots incorreta;
- 404 com canonical.

Não degradar esses erros para warnings apenas para concluir a entrega.

## 28. Metadata no cliente

Navegação SPA continua atualizando title, description, robots, canonical, OG, Twitter e JSON-LD a partir da mesma fonte central.

Após hidratação:

- BrowserRouter continua funcional;
- back/forward continuam funcionais;
- NavigationManager/âncoras/foco continuam funcionais;
- Analytics page view condicionado continua funcional;
- consentimento continua funcional.

## 29. 404

Gerar `404.html` com a experiência existente.

Metadata:

- title/description factuais;
- `noindex, nofollow`;
- sem canonical.

A configuração da hospedagem para servir `404.html` pertence à Entrega 10.

## 30. Páginas legais

Prerenderizar `/privacidade` e `/cookies` preservando conteúdo, preferências, acessibilidade e `noindex` definidos na 0008.

Não reabrir conteúdo jurídico.

## 31. Privacidade durante build

O prerender:

- não carrega GA;
- não envia page view/evento;
- não registra consentimento;
- não chama API de Leads;
- não acessa sites dos projetos;
- não gera PII;
- não depende de rede externa.

## 32. Search Console

Configuração/verificação de Google Search Console e submissão real de sitemap ficam fora da 0009 porque dependem de domínio/deploy real.

A 0009 apenas produz os artefatos corretos.

## 33. Dependências

A proposta de ADR permite somente a dependência de tooling necessária para SSR determinístico do Styled Components, mantendo a stack atual.

Não adicionar:

- Next.js;
- Gatsby;
- Astro;
- Vike;
- `@react-router/dev`/Framework Mode;
- Puppeteer;
- react-snap;
- serviço externo de prerender;
- CMS.

Desvio exige revisão do ADR.

## 34. Testes de metadata

Cobrir:

- home;
- portfolio;
- privacy;
- cookies;
- 404;
- cada case publicável;
- canonical;
- policy de robots;
- OG;
- Twitter;
- URL absoluta de imagem;
- ausência de canonical no 404;
- override global de indexação.

## 35. Testes de fonte única

Comprovar:

- SEO de cases deriva de `listPublicProjects()`;
- sitemap usa a mesma lista;
- draft/bloqueado não entra;
- novo case publicável entra no prerender/sitemap sem nova lista paralela.

## 36. Testes de JSON-LD, sitemap e robots

Validar:

- Organization/WebSite somente com dados permitidos;
- breadcrumbs corretos;
- serialização segura;
- sitemap sem duplicatas/legal/404/external;
- URLs absolutas sem query/hash;
- robots indexável e bloqueado.

## 37. Testes de prerender

Após `npm run build`, inspecionar os arquivos reais do `dist`.

Para cada rota obrigatória:

- arquivo existe;
- root contém conteúdo;
- heading/conteúdo esperado;
- title;
- description;
- robots;
- canonical quando aplicável;
- OG/Twitter;
- JSON-LD quando aplicável;
- paths de assets válidos.

## 38. Testes de hydration

Playwright sobre build/preview deve validar ao menos:

- home;
- portfolio;
- um case;
- privacidade;
- cookies;
- 404;
- navegação SPA;
- voltar/avançar;
- CTA/âncora;
- consentimento sem escolha;
- consentimento persistido;
- Analytics deny-by-default;
- reduced motion.

Console sem hydration mismatch, styled-components mismatch ou warnings novos de React.

## 39. HTML sem JavaScript

Validar que HTML gerado contém conteúdo útil sem executar JS:

- proposta principal da home;
- identificação/listagem do portfólio;
- conteúdo principal de case;
- textos legais.

Não é requisito tornar toda interação funcional sem JavaScript.

## 40. Social card e visual

Validar programaticamente tags, arquivo, dimensões, URL absoluta e alt.

Checkpoint visual obrigatório apenas para:

- card social padrão Repage;
- regressões de estilo/hydration em desktop/notebook e mobile representativos;
- ausência de flash indevido no consentimento após adaptação.

Não redesenhar páginas.

## 41. Fases

### Pré-condição — ADR

- materializar `docs/adr/0001-vite-static-prerender.md`;
- marcar `accepted` após aprovação;
- atualizar índice de ADR;
- ligar Arquitetura/spec à decisão.

### Fase 1 — Fundação SEO

- `siteConfig`;
- metadata central;
- canonical;
- robots policy;
- OG/Twitter;
- imagem social padrão;
- case metadata derivada;
- testes focados.

### Fase 2 — Prerender e hydration

- tooling SSR do Styled Components;
- entry client/hydration;
- entry static;
- StaticRouter;
- consent hydration-safe;
- browser APIs server-safe;
- lazy routes;
- Error Boundary;
- geração HTML/fail-fast;
- testes focados.

### Fase 3 — Sitemap, robots e JSON-LD

- sitemap derivado;
- robots por ambiente;
- Organization/WebSite;
- breadcrumbs;
- build integration;
- testes focados.

### Fase 4 — Integração e QA

- build completo;
- outputs;
- hydration;
- SPA navigation;
- consent/Analytics;
- reduced motion;
- social cards;
- modo indexável e bloqueado;
- revisão visual proporcional.

### Fase 5 — Fechamento

- bateria completa;
- segurança/privacidade;
- diff;
- documentação;
- spec `implemented`;
- roadmap → Entrega 10.

Uma fase por vez.

## 42. Validações finais

```bash
cd frontend
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

Mais validações específicas dos artefatos estáticos definidas pela implementação.

Na raiz:

```bash
git diff --check
```

Backend não exige bateria completa se não for alterado.

## 43. Dois modos de build a validar

### Safe/default

```text
VITE_SITE_INDEXING_ENABLED=false
```

Todos os HTMLs: `noindex, nofollow`.

### Produção simulada

```text
VITE_SITE_INDEXING_ENABLED=true
```

- home/portfolio/cases → index;
- legal → `noindex, follow`;
- 404 → `noindex, nofollow`.

Isso não é deploy real.

## 44. Fora de escopo — Entrega 10

Não implementar:

- GitHub Actions;
- deploy;
- FTP/SSH;
- Passenger;
- `.htaccess` final;
- redirecionamentos HTTP reais;
- DNS/SSL;
- Search Console real;
- submissão real do sitemap;
- monitoramento;
- backups;
- CDN/cache de produção.

## 45. Fora de escopo — produto/SEO artificial

Não:

- redesenhar homepage;
- reescrever cases;
- mudar portfólio;
- mudar consentimento/eventos GA;
- ativar Ads;
- criar blog/páginas de serviço;
- criar landing pages por keyword;
- keyword stuffing;
- doorway pages;
- schema inventado;
- reviews falsas;
- FAQ artificial;
- local SEO com endereço inexistente;
- automação massiva de conteúdo.

## 46. Riscos

### Hydration mismatch

Mitigar com render inicial determinístico, SSR tooling do Styled Components, testes de console, consentimento/reduced motion testados.

### Divergência de fontes

Mitigar com metadata central + `listPublicProjects()` + invariantes.

### Indexação acidental de staging/local

Mitigar com deny-by-default e teste explícito dos dois modos.

### Prerender mascarar erro

Mitigar fazendo rota obrigatória com erro falhar o build.

### Hosting não servir diretórios/404 conforme esperado

É risco real da Entrega 10; a 0009 define outputs e não declara serving resolvido.

## 47. Critérios de aceite

- [ ] `main` pós-0008 é baseline.
- [ ] ADR de prerender aceito antes da implementação estrutural.
- [ ] React/Vite/React Router declarativo preservados.
- [ ] Nenhum SSR runtime em produção.
- [ ] Domínio canônico centralizado.
- [ ] Indexação deny-by-default por ambiente.
- [ ] Home/portfolio/cases possuem metadata completa.
- [ ] Legal pages possuem canonical/social e permanecem noindex.
- [ ] 404 é noindex/nofollow e sem canonical.
- [ ] Open Graph completo.
- [ ] Twitter Card completo.
- [ ] Social image padrão existe e foi aprovada.
- [ ] Social images de cases são reais/autorizadas.
- [ ] JSON-LD factual/seguro.
- [ ] Sitemap deriva de `listPublicProjects()`.
- [ ] Sitemap exclui legal/404/draft/external.
- [ ] Robots funciona nos dois modos.
- [ ] HTML específico gerado para todas as rotas obrigatórias.
- [ ] `404.html` gerado.
- [ ] Nenhum root obrigatório vazio.
- [ ] Cliente hidrata HTML prerenderizado.
- [ ] Sem hydration mismatch.
- [ ] ConsentProvider server/hydration-safe.
- [ ] GA permanece deny-by-default e não roda no prerender.
- [ ] Styled Components é SSR-safe.
- [ ] Rotas secundárias têm lazy loading compatível.
- [ ] Error Boundary existe sem mascarar build failure.
- [ ] SPA/âncoras/foco continuam funcionais.
- [ ] Reduced motion não causa mismatch.
- [ ] Build falha diante de saída obrigatória incompleta.
- [ ] Nenhuma Entrega 10 antecipada.
- [ ] lint/typecheck/test/build/E2E aprovados.
- [ ] `git diff --check` aprovado.
- [ ] revisão visual proporcional aprovada.
- [ ] documentação reconciliada.

## 48. Documentação no fechamento

- spec → `implemented`;
- `docs/specs/README.md`;
- roadmap → Entrega 9 concluída / Entrega 10 próxima;
- `docs/README.md` se necessário;
- `docs/ARCHITECTURE.md` com mecanismo real de prerender;
- ADR aceito e indexado;
- `frontend/AGENTS.md` só se surgir regra duradoura nova;
- não alterar backend docs sem mudança real.

## 49. Definição de pronto

A Entrega 9 está concluída quando o artefato estático do build contém HTML real e metadata correta por rota, hidrata sem regressão e está pronto para ser servido pela Entrega 10 sem depender de crawler executar JavaScript para descobrir conteúdo principal.

Fluxo:

```text
fontes tipadas
→ metadata central
→ rotas publicáveis
→ prerender build-time
→ HTML + styles
→ canonical/social/JSON-LD
→ sitemap/robots
→ hydrateRoot
→ SPA interativa
```
