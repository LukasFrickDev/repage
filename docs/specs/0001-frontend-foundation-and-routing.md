# 0001 — Fundação do frontend, roteamento e caminho de conversão

* **Status:** approved
* **Responsável:** Lukas Frick
* **Data:** 5 de agosto de 2026
* **Branch-base:** `main`
* **Relacionados:** `AGENTS.md`, `frontend/AGENTS.md`, `docs/PRODUCT.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md` e `docs/ROADMAP.md`

## 1. Contexto

A Repage possui uma homepage em React, TypeScript, Vite e Styled Components, mas ainda funciona como página única.
Não existem roteamento público completo, layout compartilhado, páginas auxiliares, 404 própria ou testes automatizados.
A arquitetura aprovada exige:

* rotas `/`, `/portfolio`, `/portfolio/:slug`, `/privacidade`, `/cookies` e `/*`;
* âncoras `/#servicos`, `/#processo`, `/#sobre` e `/#contato`.
  Esta entrega cria a fundação das próximas fases sem redesenhar a homepage ou antecipar backend, conteúdo final, Analytics, SEO completo ou produção.

## 2. Objetivo

Estabelecer a estrutura pública do frontend e tornar rotas, navegação, âncoras, foco, menu mobile, 404, metadados básicos e dados iniciais do portfólio previsíveis, acessíveis e testáveis.

## 3. Resultado esperado

Ao final:

* React Router está instalado e configurado;
* a homepage continua em `/` dentro de um `PublicLayout`;
* todas as rotas aprovadas existem;
* rotas e âncoras controlam scroll e foco;
* CTAs de orçamento usam `/#contato` e a ação de projetos usa `/portfolio`;
* `#briefing` e ações falsas do escopo foram removidos;
* 404, skip link, `main` e menu mobile acessível funcionam;
* os seis projetos possuem estrutura inicial estática e tipada;
* metadados básicos são centralizados;
* páginas incompletas usam `noindex`;
* testes essenciais, `test` e `typecheck` estão configurados;
* a homepage mantém sua composição visual atual.

## 4. Estado atual relevante

Em `main`:

* `App.tsx` renderiza diretamente `Home` e `main.tsx` monta apenas `App`;
* somente `Home` está materializada;
* React Router e biblioteca de testes não estão instalados;
* não existem scripts `test` e `typecheck`;
* header e footer usam hashes locais;
* o CTA principal aponta para `#briefing`, que não existe;
* o CTA final é um botão desabilitado com aparência de ação;
* o menu mobile mantém conteúdo renderizado quando fechado e `aria-hidden` não garante retirada do foco;
* não existem skip link, restauração coordenada de foco e scroll ou 404 própria;
* projetos provisórios ficam junto da copy geral;
* `index.html` possui título genérico.
  Diferenças completas de ordem, copy, mídia e composição da homepage pertencem à entrega da homepage definitiva.

## 5. Escopo

### 5.1 Dependências e scripts

* Instalar React Router compatível com React 19 e Vite 7.
* Configurar testes de componentes e integração, preferencialmente com Vitest, Testing Library, `jest-dom`, `user-event` e `jsdom`, salvo incompatibilidade comprovada.
* Adicionar `npm run test` não interativo e `npm run typecheck` sem emissão.
* Atualizar o lockfile sem atualizar dependências não relacionadas.

### 5.2 Estrutura da aplicação

* Criar camada de aplicação para roteador, layout e comportamentos globais.
* Criar `PublicLayout` com skip link, header, `main`, `Outlet` ou equivalente e footer.
* Manter estilos globais aplicados uma única vez.
* Centralizar rotas e evitar lógica de roteamento distribuída nos componentes visuais.

### 5.3 Rotas e conversão

* Materializar `/`, `/portfolio`, `/portfolio/:slug`, `/privacidade`, `/cookies` e `/*`.
* Manter a homepage existente em `/`.
* Resolver somente slugs registrados; slug desconhecido usa a 404.
* Criar páginas estruturais acessíveis para portfólio, case e páginas legais.
* Direcionar CTAs de orçamento e início de projeto para `/#contato`.
* Direcionar a ação de projetos para `/portfolio`.
* Converter a área final em destino `contato`.
* Remover `#briefing`, CTA final falso e outros destinos internos inexistentes no escopo.
* Não criar formulário, envio, WhatsApp ou conteúdo final.

## 6. Fora de escopo

* Redesign, nova ordem, copy final ou coreografia definitiva da homepage.
* Escolha final dos três destaques.
* Conteúdo completo, galerias e mídias finais dos cases.
* Formulário funcional, React Hook Form ou Zod do formulário.
* Backend, Django, API, PostgreSQL ou e-mails.
* Idempotência do Lead, proteção contra abuso, consentimento, Analytics ou Ads.
* Conteúdo jurídico final.
* SEO completo, canonical definitivo, Open Graph, sitemap, JSON-LD ou prerender.
* Deploy ou CI/CD.
* Migração tipográfica ou carregamento local de fonte.
* Biblioteca de UI, Redux, store equivalente ou refatoração paralela.

## 7. Requisitos funcionais

* **RF-01:** `/` renderiza a homepage no layout público.
* **RF-02:** header, footer e marca navegam para destinos aprovados.
* **RF-03:** navegação interna usa o roteador sem reload desnecessário.
* **RF-04:** âncora na homepage posiciona e foca a seção.
* **RF-05:** âncora acionada de outra rota navega para `/`, monta, posiciona e foca o destino.
* **RF-06:** reload direto com hash, voltar e avançar mantêm comportamento coerente.
* **RF-07:** CTAs de orçamento usam `/#contato`; projetos usa `/portfolio`.
* **RF-08:** rota dinâmica resolve somente projetos registrados.
* **RF-09:** slug ou rota desconhecidos renderizam a 404.
* **RF-10:** páginas legais possuem heading, leitura mínima e ação de retorno.
* **RF-11:** mudança de rota atualiza título, descrição e indexação.
* **RF-12:** nenhuma ação falsa permanece nas áreas alteradas.

## 8. Requisitos técnicos

* Usar React Router e manter configuração de rotas centralizada.
* Usar APIs do roteador para links internos; `window.location` não é solução padrão.
* Tratar path e hash sem usar timeout arbitrário como mecanismo principal.
* Permitir `scroll-margin-top` para compensar o header fixo.
* Manter estado local como padrão e dados de projetos no frontend.
* Manter metadados independentes da composição visual.
* Não adicionar biblioteca de head ou focus trap quando solução pequena e testável for suficiente.
* Continuar com Styled Components e tokens; não introduzir segundo sistema de estilos.
* Evitar renomeações, movimentações em massa e abstrações sem repetição real.
* Justificar dependências novas e registrar todas no lockfile.

## 9. Acessibilidade

* Skip link fica entre os primeiros elementos focáveis, aparece ao foco e leva ao `main`.
* Cada rota possui um `main` e heading principal identificável.
* Mudança de rota sem hash move scroll ao início e foco ao `main` ou heading.
* Navegação com hash move foco ao destino; `tabIndex="-1"` pode ser usado.
* Foco deve permanecer visível, não cortado e legível nos fundos existentes.
* Conteúdo oculto não pode permanecer focável.
* `aria-hidden` não pode ser a única proteção para descendentes interativos.
* Nenhuma informação depende de animação, hover ou arraste.
* Páginas estruturais e 404 devem ser operáveis por teclado.

## 10. Responsividade

Validar desktop amplo, notebook, tablet, mobile, mobile compacto, viewport baixa e celular horizontal.
Preservar a responsividade atual da homepage.
Verificar especialmente header, menu, skip link, foco, bloqueio de scroll, headings, 404, CTAs e overflow.
Páginas estruturais recebem composição simples e coerente, não redesign elaborado.

## 11. Navegação por rotas e âncoras

Âncoras obrigatórias:

* `/#servicos`
* `/#processo`
* `/#sobre`
* `/#contato`
  Devem funcionar na homepage, portfólio, case, páginas legais, 404 e reload direto.
  Fluxo esperado:

1. atualizar path e hash;
2. garantir que o destino esteja montado;
3. posicionar sem ficar coberto pelo header;
4. mover foco ao destino;
5. preservar histórico coerente.
   Com `prefers-reduced-motion: reduce`, posicionar sem rolagem suave prolongada.
   Âncora aprovada ausente deve falhar em teste e não causar loop ou erro não tratado em runtime.

## 12. Menu mobile

Quando fechado:

* conteúdo fica fora da ordem de foco, sem interação e oculto corretamente para tecnologia assistiva.
  Quando aberto:
* `aria-expanded` representa o estado;
* foco inicial é coerente e permanece dentro do menu;
* `Esc` fecha e foco retorna ao acionador;
* scroll do fundo fica bloqueado;
* estado é anunciado.
  Também deve fechar ao selecionar link, mudar de rota ou entrar no breakpoint desktop.
  Qualquer fechamento deve restaurar scroll, listeners e estilos globais.
  O menu deve continuar funcional com movimento reduzido.

## 13. Estrutura inicial tipada dos projetos

Criar fonte estática, tipada, versionada, separada da copy geral e preparada para seletores.
Registrar:

* EchoCosmicEnergia;
* Axium;
* DevSchedule;
* GreenTweet;
* A Alma no Comando;
* Alicerce da Alma.
  Campos mínimos:
* título;
* slug interno revisado;
* natureza;
* estado de publicação;
* indicador anterior à Repage quando aplicável.
  Naturezas permitidas: projeto pago, projeto próprio e desafio técnico.
  A estrutura deve distinguir rascunho de projeto publicável por união discriminada, validação em runtime ou solução equivalente.
  Seletores mínimos: localizar por slug, listar registros, separar rascunhos e publicados e detectar slug duplicado.
  Não definir destaques, ordem editorial, textos completos, galerias, métricas, resultados, autorizações inexistentes ou URLs externas não verificadas.

## 14. Metadados básicos

Criar fonte central e tipada com:

* título;
* descrição;
* estado de indexação.
  A implementação atualiza `document.title`, `meta[name="description"]` e instrução de robots quando aplicável.
  Deve restaurar valores corretos após navegação, oferecer fallback seguro e permitir teste isolado.
  Usar `noindex` em:
* 404;
* portfólio estrutural;
* cases temporários;
* Privacidade sem texto final;
* Cookies sem texto final.
  Canonical, Open Graph, Twitter Card, JSON-LD, sitemap e prerender ficam fora da entrega.

## 15. Estados temporários das páginas incompletas

Páginas não concluídas podem usar conteúdo curto, verdadeiro e explicitamente em preparação.
Devem possuir heading, navegação útil, responsividade e `noindex`.
Não podem inventar texto jurídico, detalhes de case, autorização, link externo, métrica ou resultado.
`/portfolio` pode mostrar os seis nomes e naturezas aprovadas como estrutura de desenvolvimento.
Cases conhecidos podem mostrar apenas informações mínimas confirmadas.
A 404 é funcional e não deve ser apresentada como temporária.

## 16. Áreas provavelmente afetadas

### Obrigatórias

* manifesto, lockfile, composição da aplicação, rotas, header, footer, área final, navegação e testes.

### Caminhos existentes prováveis

* `frontend/package.json`
* `frontend/package-lock.json`
* `frontend/src/main.tsx`
* `frontend/src/App.tsx`
* `frontend/src/pages/Home/`
* `frontend/src/components/HomeHeader/`
* `frontend/src/components/SiteFooter/`
* `frontend/src/components/FinalCtaSection/`
* `frontend/src/content/repageContent.ts`
* `frontend/src/styles/globalStyles.ts`
* `frontend/index.html`

### Novas áreas prováveis

* `frontend/src/app/`
* páginas de Portfolio, Case, Privacy, Cookies e NotFound;
* `frontend/src/data/projects/`.
  Os nomes finais dependem da inspeção. Não criar diretórios vazios ou abstrações de uso único.

## 17. Testes

Configurar `npm run test`, `npm run typecheck`, ambiente DOM e matchers necessários.
Cobrir:

* todas as rotas públicas e 404;
* slug conhecido, desconhecido, duplicado e estado de publicação;
* naturezas válidas;
* CTAs, remoção de `#briefing` e navegação para `/#contato`;
* foco após rota e âncora;
* título, descrição, robots e `noindex`;
* menu fechado sem foco;
* foco contido, `Esc`, retorno de foco e fechamento por link.
  Priorizar comportamento observável, evitar snapshots extensos e não remover `StrictMode` para ocultar falha.

## 18. Validação em navegador

Validar:

* `/`, `/portfolio`, slug conhecido, slug desconhecido, `/privacidade`, `/cookies` e rota inexistente;
* header, footer, marca, CTAs, hashes, voltar, avançar e reload direto;
* Tab inicial, skip link, menu, `Esc`, retorno de foco e foco após navegação;
* desktop amplo, notebook, tablet, mobile, mobile compacto, viewport baixa e celular horizontal;
* movimento normal e reduzido;
* console, rede, warnings, overflow, scroll de fundo e links quebrados.
  Sem navegador controlável, executar o restante e registrar o bloqueio sem simular validação visual ou interativa.

## 19. Critérios de aceite

* [ ] React Router, testes e lockfile atualizados.
* [ ] Scripts `test` e `typecheck` disponíveis.
* [ ] Roteamento centralizado e `PublicLayout` ativo.
* [ ] Homepage preservada em `/`.
* [ ] Skip link e `main` funcionais.
* [ ] Todas as rotas aprovadas materializadas.
* [ ] Slug desconhecido e rota desconhecida usam a 404.
* [ ] Páginas legais não inventam conteúdo jurídico.
* [ ] Âncoras funcionam da homepage e de outras rotas.
* [ ] Foco e scroll são atualizados corretamente.
* [ ] Movimento reduzido é respeitado.
* [ ] CTAs usam `/#contato` e `/portfolio`.
* [ ] `#briefing`, CTA desabilitado e ações falsas foram removidos.
* [ ] Menu fechado não possui descendentes focáveis.
* [ ] Menu aberto controla foco, `Esc`, retorno e scroll.
* [ ] Seis projetos estão tipados com fatos mínimos confirmados.
* [ ] Rascunhos não são tratados como publicados.
* [ ] Metadados mudam por rota e temporários usam `noindex`.
* [ ] `npm run lint`, `typecheck`, `test` e `build` aprovados.
* [ ] Não há redesign, regressão responsiva relevante, erro de console ou refatoração paralela conhecida.

## 20. Riscos

* **Escopo crescer para redesign:** manter ajustes somente onde navegação, acessibilidade ou ação real exigirem.
* **Refatoração excessiva:** preservar componentes e mover apenas responsabilidades necessárias.
* **Regressão visual:** comparar viewports e manter estrutura visual próxima.
* **Corrida entre rota e âncora:** coordenar montagem sem delay arbitrário.
* **Menu fechado focável:** desmontar, usar `inert` corretamente ou remover interação real.
* **Conteúdo temporário parecer final:** usar aviso, dados mínimos e `noindex`.
* **Metadados divergentes:** usar fonte central tipada.
* **Destaques antecipados:** não definir escolha final.
* **Testes frágeis:** testar URL, conteúdo acessível, foco e comportamento.
* **Dependência desnecessária:** justificar cada pacote e evitar sobreposição.

## 21. Documentação afetada

Na materialização documental:

* adicionar `docs/ROADMAP.md`;
* adicionar esta spec;
* atualizar o índice de `docs/specs/README.md` para referenciar `0001`.
  Na conclusão da implementação:
* mudar o status da spec para `implemented`;
* registrar PR ou commit quando disponível;
* atualizar o roadmap somente se sequência, dependência ou critério mudar;
* criar ADR apenas diante de decisão estrutural real;
* registrar bloqueios no relatório final.

## 22. Definição de pronto

A entrega está pronta quando:

* escopo e critérios de aceite foram atendidos;
* lint, typecheck, testes e build foram executados;
* navegador foi validado ou o bloqueio foi registrado;
* nenhuma interação falsa conhecida permanece;
* homepage foi preservada visualmente;
* nenhum conteúdo, cliente, autorização, URL externa ou prova foi inventado;
* dependências novas foram justificadas;
* diff foi revisado;
* spec foi atualizada para `implemented`;
* relatório final lista arquivos, validações, resultados, bloqueios, riscos e impacto documental.
