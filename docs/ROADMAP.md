# Repage — Roadmap da V1

* **Status:** approved
* **Responsável:** Lukas Frick
* **Baseline:** `main`
* **Última consolidação:** 5 de agosto de 2026

## Objetivo da V1

Publicar a Repage como site comercial completo, com conteúdo real, seis cases, solicitação de orçamento persistida, administração de leads, consentimento, Analytics condicionado, SEO e operação verificável.
A conversão principal é o envio persistido da solicitação de orçamento.
A V1 deve servir como referência comercial da marca, apoiar prospecção e conduzir visitantes a contatos reais sem antecipar CRM, CMS, painel próprio ou outras funcionalidades adiadas.

## Estado atual

* Fundação documental aprovada e materializada.
* Frontend em React, TypeScript, Vite e Styled Components.
* Framer Motion, homepage responsiva, logo, marca, tokens e direção visual disponíveis.
* Roteamento público, páginas auxiliares e layout compartilhado ainda não materializados.
* Portfólio, cases, conteúdo e mídias reais ainda incompletos.
* Formulário ainda sem persistência.
* Backend, PostgreSQL e e-mails ainda inexistentes.
* Consentimento, Analytics, SEO e prerender ainda inexistentes.
* Testes automatizados, CI/CD e deploy definitivo ainda inexistentes.

## Princípios de execução

* Trabalhar em entregas incrementais e verificáveis.
* Preservar Produto, Arquitetura, Design System e regras de governança.
* Evoluir a base saudável existente sem reconstrução desnecessária.
* Fazer mudanças focadas e evitar refatorações paralelas.
* Não inventar clientes, projetos, métricas, resultados, URLs, autorizações ou conteúdo jurídico.
* Não apresentar conteúdo provisório como final.
* Criar specs somente quando a entrega iniciar e justificar detalhamento próprio.
* Atualizar documentação quando uma decisão vigente mudar.
* Executar validações configuradas e registrar bloqueios sem simular evidência.
* Considerar concluída apenas a entrega com resultado observável e critérios atendidos.

## Sequência das entregas

1. Fundação do frontend, roteamento e caminho de conversão.
2. Organização de conteúdo e mídias reais.
3. Homepage definitiva.
4. Portfólio e seis cases.
5. Backend, PostgreSQL, API, Admin e formulário.
6. E-mails, idempotência e proteção.
7. Consentimento, Analytics e páginas legais.
8. SEO, sitemap e prerender.
9. CI/CD, deploy, backups e observabilidade.
10. QA final e lançamento.

## Entrega 1 — Fundação do frontend, roteamento e caminho de conversão

**Objetivo:** estabelecer a estrutura pública de navegação sem redesenhar a homepage.
**Resultado esperado:** rotas, layout, âncoras, CTAs, 404, foco, menu mobile, metadados básicos e dados iniciais de projetos tornam-se previsíveis e testáveis.
**Escopo principal:**

* React Router, `PublicLayout`, skip link e conteúdo principal.
* Rotas públicas, navegação por âncoras e CTAs com destinos reais.
* 404, foco, scroll, movimento reduzido e menu mobile acessível.
* Estrutura inicial tipada dos seis projetos e metadados básicos.
* Testes essenciais e scripts ausentes.
  **Dependências:** fundação documental, baseline do frontend e nomes e naturezas confirmados dos seis projetos.
  **Validações:** lint, typecheck, testes, build, rotas, âncoras, teclado, foco, menu, viewports, console e overflow.
  **Critério de conclusão:** estrutura pública funcional, sem ação falsa, regressão relevante ou redesign da homepage.
  **Spec:** obrigatória em `docs/specs/0001-frontend-foundation-and-routing.md`.

## Entrega 2 — Organização de conteúdo e mídias reais

**Objetivo:** preparar informações e ativos confiáveis para homepage, portfólio e cases.
**Resultado esperado:** cada projeto possui inventário verificável de conteúdo, natureza, participação, autorização, links e mídias, ou bloqueio real registrado.
**Escopo principal:**

* Auditar informações comprováveis dos seis projetos.
* Confirmar natureza, participação, links e autorizações.
* Capturar desktop, mobile e fluxos relevantes.
* Remover dados sensíveis e preparar imagens principais, galerias e imagens sociais.
* Otimizar, nomear e versionar os ativos.
  **Dependências:** Entrega 1, acesso aos projetos, materiais originais, autorizações e validação de Lukas.
  **Validações:** correspondência com o projeto real, origem, autorização, privacidade, dimensões, compressão, proporção e alt.
  **Critério de conclusão:** material suficiente para implementação ou pendência explícita que impeça publicação sem invenção.
  **Spec:** obrigatória ao iniciar, limitada à produção e organização de conteúdo e mídia.

## Entrega 3 — Homepage definitiva

**Objetivo:** transformar a homepage existente na experiência comercial aprovada.
**Resultado esperado:** marca, três destaques, ofertas, diferenciais, processo, Lukas e contato aparecem com conteúdo real e acabamento equivalente em desktop e mobile.
**Escopo principal:**

* Aplicar a ordem aprovada das seções e finalizar a copy.
* Implementar três projetos destacados derivados da fonte única.
* Apresentar as três ofertas com o mesmo peso e suporte como continuidade.
* Finalizar proposta de valor, processo, Sobre e contato.
* Substituir mídia conceitual, validar tipografia local e definir movimento funcional.
  **Dependências:** Entregas 1 e 2, copy, destaques, mídias e fontes aprovados.
  **Validações:** clareza comercial, conteúdo, links, teclado, foco, movimento reduzido, responsividade, desempenho, fallback e console.
  **Critério de conclusão:** homepage sem placeholder final, com conversão clara e acabamento validado.
  **Spec:** obrigatória ao iniciar.

## Entrega 4 — Portfólio e seis cases

**Objetivo:** publicar provas reais da capacidade da Repage por uma fonte única.
**Resultado esperado:** `/portfolio` lista seis projetos e cada projeto possui case completo, acessível e coerente com sua natureza.
**Escopo principal:**

* Consolidar fonte única, listagem editorial e cases por slug.
* Publicar contexto, desafio, solução, participação, serviços e funcionalidades.
* Incluir tecnologias, galerias e links externos verificados.
* Implementar anterior, próximo, retorno e bloqueio de publicação incompleta.
  **Dependências:** Entregas 1, 2 e 3, conteúdo, mídias, autorizações e links verificados.
  **Validações:** seis projetos, slugs únicos, destaques derivados, dados completos, navegação, acessibilidade, mobile e fallbacks.
  **Critério de conclusão:** seis cases úteis mesmo sem o projeto externo, sem prova inventada.
  **Spec:** obrigatória ao iniciar, preferencialmente conjunta para portfólio e cases.

## Entrega 5 — Backend, PostgreSQL, API, Admin e formulário

**Objetivo:** criar o fluxo básico de solicitação de orçamento com persistência real.
**Resultado esperado:** envio válido persiste um Lead no PostgreSQL e fica disponível no Django Admin.
**Escopo principal:**

* Base Django e DRF, PostgreSQL, apps `core` e `leads`.
* Modelos, migrations, health, readiness, API pública e Admin.
* Formulário com React Hook Form e Zod.
* Integração frontend/backend e estados de loading, sucesso, validação e erro.
  **Dependências:** Entrega 1, contrato de campos, versão da política, PostgreSQL local e origens definidas.
  **Validações:** checks, migrations, Ruff, pytest, validações frontend, persistência, Admin, health, readiness e logs sanitizados.
  **Critério de conclusão:** envio válido persiste; envio inválido não persiste; falhas são recuperáveis e seguras.
  **Spec:** obrigatória ao iniciar, coordenando API, persistência, Admin e formulário.

## Entrega 6 — E-mails, idempotência e proteção

**Objetivo:** tornar o fluxo confiável diante de falhas, repetição e abuso básico.
**Resultado esperado:** Lead permanece salvo apesar do e-mail, retries não duplicam contatos e abusos são limitados sem CAPTCHA visível inicial.
**Escopo principal:**

* `EmailDelivery`, `IdempotencyRecord` e chave por tentativa.
* Fingerprint, conflito de chave e repetição acidental.
* Honeypot, tempo mínimo e throttling.
* Notificação interna, confirmação, falhas sanitizadas, retentativas e reenvio protegido.
  **Dependências:** Entrega 5, SMTP ou ambiente seguro, textos aprovados, endereços profissionais e mecanismo de retentativa.
  **Validações:** persistência antes do SMTP, idempotência, conflito, novo contato legítimo, proteção, retentativa, reenvio e logs.
  **Critério de conclusão:** falhas, repetições e abusos possuem comportamento previsível, testado e recuperável.
  **Spec:** obrigatória ao iniciar.

## Entrega 7 — Consentimento, Analytics e páginas legais

**Objetivo:** implementar privacidade, preferências e medição condicionada.
**Resultado esperado:** visitante controla categorias, Analytics só carrega quando autorizado e páginas legais revisadas ficam disponíveis.
**Escopo principal:**

* `ConsentProvider`, persistência local e revisão de escolhas.
* Aceitar, rejeitar e personalizar categorias.
* Políticas de Privacidade e Cookies e ciência no formulário.
* Analytics condicionado, eventos centralizados e preparação futura para Ads.
  **Dependências:** Entregas 5 e 6, revisão jurídica, versões das políticas, identificador do Analytics e eventos finais.
  **Validações:** não essenciais desativados por padrão, preferências persistidas, Analytics condicionado, ausência de dados pessoais e acessibilidade.
  **Critério de conclusão:** consentimento, páginas e Analytics funcionam de forma verificável e coerente com as políticas.
  **Spec:** obrigatória ao iniciar.

## Entrega 8 — SEO, sitemap e prerender

**Objetivo:** tornar rotas públicas indexáveis, compartilháveis e renderizadas com HTML específico.
**Resultado esperado:** cada rota e case possui HTML e metadados completos sem migração de framework.
**Escopo principal:**

* Título, descrição, canonical e cards sociais.
* Sitemap derivado, robots por ambiente e JSON-LD aplicável.
* Seleção e integração do prerender.
* HTML por rota e case, hidratação e falha de build diante de saída obrigatória ausente.
  **Dependências:** Entregas 3, 4 e 7, conteúdo, slugs, imagens sociais, domínio e decisão do prerender.
  **Validações:** HTML, metadados, canonical, sitemap, robots, rotas geradas, hidratação e build.
  **Critério de conclusão:** páginas publicáveis geram HTML e metadados completos por fontes centralizadas.
  **Spec:** obrigatória; a decisão estrutural de prerender pode exigir ADR.

## Entrega 9 — CI/CD, deploy, backups e observabilidade

**Objetivo:** criar processo reproduzível e verificável de entrega e operação.
**Resultado esperado:** pull requests são validados, deploys são controlados e produção possui health, logs, backups externos e recuperação documentada.
**Escopo principal:**

* Validar hospedagem, recursos, ambientes e segredos.
* CI para frontend, backend e documentação.
* Deploy, migrations, domínio, DNS, SSL, Passenger, cron e SMTP.
* Smoke tests, logs, backups externos, restauração e runbooks.
  **Dependências:** Entregas 5 a 8, hospedagem e provedores confirmados, acessos, retenções e GitHub Environments.
  **Validações:** CI, deploy, health, readiness, HTTPS, headers, logs, backup, restauração, rollback e ausência de segredos.
  **Critério de conclusão:** frontend e backend podem ser implantados, verificados e recuperados por procedimentos com evidência.
  **Spec:** spec de infraestrutura ao iniciar; runbooks obrigatórios conforme o ambiente real.

## Entrega 10 — QA final e lançamento

**Objetivo:** validar a V1 completa e liberar divulgação somente após evidências suficientes.
**Resultado esperado:** Repage publicada no domínio definitivo, com conteúdo real, conversão funcional e riscos críticos resolvidos.
**Escopo principal:**

* Regressão funcional, conteúdo, mídias, links, seis cases e três destaques.
* Formulário, Admin, e-mails, consentimento e Analytics.
* SEO, sitemap, prerender, acessibilidade, responsividade e desempenho.
* Produção, logs, health, backups, correção de bloqueadores e evidências.
  **Dependências:** todas as entregas, autorizações, revisão jurídica, domínio, SMTP, Analytics e backups.
  **Validações:** viewports, teclado, foco, movimento reduzido, fallbacks, rede, formulário, consentimento, metadados, produção e restauração.
  **Critério de conclusão:** critérios obrigatórios atendidos ou exceção formalmente aceita sem comprometer segurança, privacidade, conversão ou lançamento.
  **Spec:** checklist ou spec curta de lançamento ao iniciar.

## Riscos e dependências transversais

* Conteúdo incompleto pode bloquear homepage, portfólio e lançamento.
* Projetos pagos dependem de autorização aplicável.
* Mídia pesada pode comprometer desempenho e responsividade.
* Hospedagem deve confirmar Python, PostgreSQL, SSH, Passenger, cron, logs e limites.
* SMTP depende de autenticação, TLS, SPF, DKIM, DMARC e entregabilidade.
* Retenção de leads e backups deve ser definida antes de produção.
* Políticas exigem revisão jurídica antes da publicação.
* O mecanismo de prerender ainda exige decisão técnica.
* Domínio, DNS, SSL e Analytics dependem de acessos reais.
* Falha de e-mail não pode reverter persistência do Lead.
* Nenhum bloqueio autoriza conteúdo, autorização ou evidência inventada.

## Definição de conclusão da V1

A V1 está concluída quando:

* todas as rotas públicas funcionam;
* homepage, portfólio e seis cases usam conteúdo e mídia reais;
* três destaques derivam da fonte única;
* formulário valida e persiste no PostgreSQL;
* Lead permanece salvo diante de falha de e-mail;
* Admin, e-mails, idempotência e proteção funcionam;
* consentimento e Analytics condicionado funcionam;
* páginas legais revisadas estão publicadas;
* SEO, sitemap, robots e prerender estão validados;
* acessibilidade e responsividade foram verificadas;
* CI/CD e deploy são reproduzíveis;
* health, readiness, logs e smoke tests estão disponíveis;
* backups externos foram configurados e a restauração foi testada;
* domínio definitivo está configurado;
* não existem placeholders finais, ações falsas, links quebrados ou provas inventadas;
* o site está pronto para divulgação e geração de solicitações de orçamento.
