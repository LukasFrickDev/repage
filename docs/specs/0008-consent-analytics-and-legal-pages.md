# 0008 — Consentimento, Analytics e páginas legais

- **Status:** draft
- **Responsável:** Lukas Frick
- **Data:** 16 de agosto de 2026
- **Branch-base:** `main`
- **Entrega do roadmap:** 8 — Consentimento, Analytics e páginas legais
- **Specs predecessoras relevantes:** `0005-lead-intake-backend-and-form.md`, `0006-repage-admin-experience.md` e `0007-email-idempotency-and-protection.md`
- **Documentos relacionados:** `AGENTS.md`, `frontend/AGENTS.md`, `backend/AGENTS.md`, `docs/PRODUCT.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md`, `docs/ROADMAP.md`

## 1. Contexto

As Entregas 1–7 estão implementadas, validadas e integradas à `main`.

A baseline atual já possui:

- frontend React + TypeScript + Vite;
- Styled Components;
- React Router;
- homepage definitiva;
- portfólio e seis cases;
- formulário público real;
- backend Django 5.2 + DRF;
- PostgreSQL;
- Lead persistente;
- ciência e versão da Política de Privacidade no Lead público;
- idempotência, proteção e e-mails;
- Django Admin Repage;
- rotas `/privacidade` e `/cookies`;
- links legais no footer.

Ainda não existem:

- `ConsentProvider`;
- persistência de preferências de consentimento;
- banner de consentimento;
- central de preferências;
- serviço de Analytics;
- Google Analytics carregado condicionalmente;
- eventos analíticos centralizados;
- link funcional para revisar preferências no footer;
- conteúdo legal factual completo.

As páginas `/privacidade` e `/cookies` ainda são placeholders explícitos e permanecem `noindex`.

Existe ainda uma requisição externa a Google Fonts no `index.html`, anterior a qualquer escolha de consentimento. A identidade aprovada usa Instrument Sans e as regras vigentes determinam uso local da fonte. Esta entrega deve reconciliar essa inconsistência sem alterar a identidade visual.

## 2. Objetivo

Implementar uma camada de privacidade e medição verificável para a V1, de modo que:

- o visitante controle tecnologias não essenciais;
- analíticos e publicitários permaneçam desligados por padrão;
- Google Analytics somente seja carregado após autorização analítica;
- nenhuma tag publicitária seja ativada nesta entrega;
- preferências sejam persistidas localmente sem criar perfil no backend;
- escolhas possam ser revisadas a qualquer momento;
- eventos autorizados sejam centralizados e não carreguem PII;
- as páginas de Privacidade e Cookies deixem de ser placeholders;
- a ciência da Política de Privacidade no formulário continue separada do consentimento de Analytics/cookies;
- nenhum terceiro não essencial seja carregado automaticamente antes da escolha.

## 3. Resultado esperado

Ao final da implementação técnica:

- existe `features/consent/`;
- existe um `ConsentProvider` global;
- existe estado versionado de consentimento no navegador;
- primeira visita apresenta escolha clara;
- é possível aceitar todos, rejeitar não essenciais e personalizar;
- o footer permite reabrir as preferências;
- necessários permanecem sempre ativos;
- analíticos e publicitários começam desligados;
- Google Analytics não é solicitado antes de consentimento analítico;
- rejeição mantém Google Analytics sem carregamento;
- revogação interrompe novos eventos e remove cookies analíticos first-party que a aplicação consegue remover;
- nenhuma tag de Google Ads é carregada;
- eventos são enviados somente quando autorizados;
- nenhum evento contém dados do formulário ou identificadores internos;
- `/privacidade` possui rascunho factual/técnico completo;
- `/cookies` possui rascunho factual/técnico completo;
- páginas legais exibem versão/data e canal de privacidade;
- Google Fonts remoto foi removido;
- Instrument Sans continua sendo a fonte principal, servida localmente;
- o formulário continua exigindo ciência da Política de Privacidade sem transformá-la em consentimento analítico ou publicitário.

## 4. Decisões de produto congeladas

Categorias:

- `necessary` — Necessários;
- `analytics` — Analíticos;
- `advertising` — Publicitários.

Regras:

- necessários sempre ativos;
- analíticos desligados por padrão;
- publicitários desligados por padrão;
- aceitar todos;
- rejeitar não essenciais;
- personalizar;
- revisar escolhas posteriormente;
- Google Analytics condicionado à categoria analítica;
- Google Ads apenas preparado;
- nenhuma tag Ads ativa sem campanha real;
- nenhum dado pessoal ou conteúdo dos campos em Analytics.

Não reabrir essas decisões nesta spec.

## 5. Ciência da Política de Privacidade ≠ consentimento de cookies

A checkbox do formulário permanece:

> Li e estou ciente da Política de Privacidade.

Ela representa ciência da política associada ao tratamento necessário para responder à solicitação enviada.

Ela NÃO representa:

- aceite de cookies analíticos;
- consentimento publicitário;
- marketing;
- newsletter;
- autorização para Google Analytics;
- autorização para Google Ads.

O Lead continua persistindo:

- `privacy_policy_acknowledged`;
- `privacy_policy_version`.

O backend continua validando a versão vigente.

Nenhum campo de consentimento analítico/publicitário é adicionado ao `Lead`.

## 6. Arquitetura de consentimento

Criar no frontend:

```text
frontend/src/features/consent/
```

Responsabilidades:

- estado global;
- leitura da preferência persistida;
- validação/versionamento;
- ações de aceitar/rejeitar/personalizar;
- abertura/fechamento do painel;
- integração com Analytics;
- exposição de API mínima aos componentes.

`ConsentProvider` é contexto React global.

Não adicionar:

- Redux;
- Zustand;
- store externa;
- CMP externa;
- backend de preferências.

## 7. Estado persistido

Persistir somente no navegador.

Chave recomendada:

```text
repage:consent:v1
```

Estrutura conceitual:

```json
{
  "version": 1,
  "necessary": true,
  "analytics": false,
  "advertising": false,
  "updatedAt": "ISO-8601"
}
```

Não persistir:

- nome;
- e-mail;
- telefone;
- Lead ID;
- request ID;
- IP;
- rota histórica;
- fingerprint;
- identificador publicitário próprio.

`necessary` nunca pode ser `false`.

## 8. Armazenamento

Usar `localStorage` first-party para a preferência.

Se `localStorage` estiver indisponível ou corrompido:

- site continua funcional;
- não essenciais permanecem desligados;
- preferência não é presumida;
- interface de consentimento continua disponível;
- não lançar erro fatal.

## 9. Versionamento do consentimento

A preferência possui versão própria, independente da versão do Lead.

Versão inicial:

`1`

Quando o significado das categorias, fornecedores ou finalidades mudar materialmente:

- incrementar a versão;
- considerar registro antigo incompatível;
- voltar ao estado sem escolha;
- pedir nova decisão.

Mudança meramente editorial que não altera finalidade/categoria não exige reconsentimento automático.

## 10. Estado inicial

Sem preferência válida:

- `necessary = true`;
- `analytics = false`;
- `advertising = false`;
- banner de consentimento visível.

Não usar opt-in implícito por:

- rolagem;
- permanência na página;
- fechamento do banner;
- navegação;
- envio do formulário.

Fechar ou ignorar não equivale a aceitar.

## 11. Banner inicial

Exibir na primeira visita enquanto não houver escolha válida.

Ações principais:

- `Aceitar todos`;
- `Rejeitar não essenciais`;
- `Personalizar`.

O banner deve:

- ser claramente identificável;
- explicar de forma curta que necessários permanecem ativos;
- informar que Analytics depende da escolha;
- oferecer link para `/cookies`;
- não bloquear o conteúdo do site;
- não tomar foco automaticamente;
- não impedir navegação;
- não usar linguagem manipulativa.

`Aceitar todos` e `Rejeitar não essenciais` devem ter legibilidade e acessibilidade equivalentes.

## 12. Central de preferências

`Personalizar` abre uma interface dedicada, preferencialmente dialog/modal acessível.

Categorias:

### Necessários

- sempre ativos;
- controle visualmente marcado e não editável;
- descrição curta sobre funcionamento, segurança e preferências.

### Analíticos

- toggle editável;
- desligado por padrão;
- explica medição de uso via Google Analytics sem dados do formulário.

### Publicitários

- toggle editável;
- desligado por padrão;
- informa claramente que nenhuma tag publicitária está ativa na V1 atual;
- preferência fica preparada para futura campanha, sem carregar tecnologia publicitária agora.

Ações:

- `Salvar preferências`;
- atalho equivalente para aceitar todos;
- atalho equivalente para rejeitar não essenciais, quando a composição permanecer clara.

## 13. Revisão posterior

O footer deve possuir controle:

`Preferências de cookies`

Esse controle:

- é um `button` ou controle equivalente sem navegação falsa;
- reabre a central;
- funciona em todas as rotas públicas;
- mantém foco visível;
- não depende de Analytics estar ativo.

A página `/cookies` também pode oferecer o mesmo controle.

## 14. Acessibilidade do consentimento

Obrigatório:

- semântica apropriada;
- labels;
- descrição das categorias;
- foco visível;
- teclado;
- contraste;
- estado selecionado compreensível;
- nenhuma informação apenas por cor;
- dialog com foco controlado;
- `Esc` fecha quando seguro;
- retorno de foco ao acionador;
- scroll do fundo controlado quando modal;
- screen reader compreende títulos e ações;
- mobile permanece operável.

O banner não precisa trap de foco porque não bloqueia a página.

## 15. Movimento

Consentimento é interface funcional.

Usar somente:

- transições curtas;
- opacity/transform quando útil;
- nenhuma coreografia narrativa.

Respeitar `prefers-reduced-motion`.

Não usar Framer Motion se CSS simples resolver.

## 16. Google Analytics aprovado

Fornecedor analítico da V1:

**Google Analytics 4 (GA4).**

Não escolher outro fornecedor sem nova decisão de produto/arquitetura.

## 17. Measurement ID

Configuração pública:

```text
VITE_GA_MEASUREMENT_ID
```

Não é segredo.

Regras:

- não hardcodar;
- `.env.example` documenta a variável;
- ausência da variável mantém Analytics desabilitado de forma segura;
- consentimento analítico sozinho não cria Measurement ID;
- ambiente de produção deverá fornecer ID real.

O GA4 Measurement ID real permanece uma dependência externa para validar coleta real no produto Google.

A implementação estrutural e os testes determinísticos podem avançar antes desse valor existir.

## 18. Carregamento estrito

A Repage adota carregamento estrito:

**nenhum script do Google Analytics é solicitado antes de `analytics=true`.**

Antes do consentimento analítico:

- não inserir `gtag.js`;
- não enviar page view;
- não enviar cookieless ping;
- não criar cookies `_ga`;
- não enviar eventos para Google Analytics.

Isso é deliberadamente mais restritivo que carregar a tag com consentimento negado.

## 19. Script do GA4

Após consentimento analítico válido e Measurement ID configurado:

1. inicializar camada analítica;
2. carregar `gtag.js` dinamicamente;
3. configurar GA4;
4. evitar page view automático duplicado;
5. enviar page view centralizado da rota atual;
6. permitir eventos tipados.

O script deve ser carregado no máximo uma vez por sessão de página.

Não adicionar SDK npm do Google Analytics sem necessidade.

## 20. Revogação de Analytics

Se Analytics estava ativo e o visitante desativá-lo:

- bloquear novos eventos imediatamente;
- atualizar estado de consentimento do Google quando a tag já tiver sido carregada;
- usar mecanismo de disable compatível com o Measurement ID;
- remover, em best effort, cookies analíticos first-party conhecidos e acessíveis;
- não recarregar a página automaticamente;
- manter o site funcional.

Cookies conhecidos a considerar:

- `_ga`;
- `_ga_*`.

Não apagar cookies/armazenamentos não pertencentes à camada analítica.

## 21. Publicitários nesta entrega

A categoria `advertising` existe na experiência e na preferência.

Mas a Entrega 8 NÃO carrega:

- Google Ads;
- Meta Pixel;
- remarketing;
- Floodlight;
- tag publicitária;
- conversão publicitária.

Mesmo `advertising=true` não dispara tecnologia nesta V1 atual.

Ativação futura exige campanha real e nova revisão.

## 22. Serviço de Analytics

Criar:

```text
frontend/src/services/analytics/
```

Responsabilidades:

- carregar GA4;
- manter estado de prontidão;
- bloquear antes do consentimento;
- enviar page view;
- enviar eventos tipados;
- tratar ausência de Measurement ID;
- tratar falha de script sem quebrar UX;
- interromper novos eventos após revogação.

Componentes não chamam `window.gtag` diretamente.

## 23. Contrato de eventos

Centralizar nomes e payloads.

Eventos aprovados:

```text
page_view
quote_cta_click
portfolio_view
case_view
external_project_click
lead_form_start
lead_form_success
lead_form_error
whatsapp_click
consent_update
```

Não espalhar strings livres de eventos pelos componentes.

## 24. `page_view`

Enviar somente após consentimento analítico.

Em SPA:

- primeira rota após inicialização do GA;
- mudanças de pathname via React Router.

Enviar somente pathname/metadata segura.

Não enviar query string, hash variável, e-mail, telefone, request ID ou Lead ID.

## 25. Eventos comerciais

### `quote_cta_click`

Pode registrar contexto controlado como header, hero, case ou outro local enumerado.

### `portfolio_view`

Disparado na visualização da rota `/portfolio`.

### `case_view`

Pode incluir `project_slug` público.

### `external_project_click`

Pode incluir `project_slug` público.

### `lead_form_start`

Uma vez por interação lógica com o formulário, não a cada campo.

### `lead_form_success`

Somente após sucesso persistido confirmado.

### `lead_form_error`

Usar categoria controlada e não PII, por exemplo:

- `validation`;
- `network`;
- `rate_limited`;
- `idempotency_conflict`;
- `service_unavailable`;
- `server`.

Não enviar mensagens de erro livres.

### `whatsapp_click`

Evento de clique, sem telefone do visitante ou conteúdo digitado.

### `consent_update`

Somente pode ser enviado se o estado resultante possuir `analytics=true`.

Não enviar evento analítico depois que Analytics foi revogado/rejeitado.

## 26. Proibição de PII em Analytics

É proibido enviar:

- nome;
- e-mail;
- WhatsApp;
- mensagem;
- business name identificável;
- conteúdo do formulário;
- Lead ID;
- request ID;
- idempotency key;
- IP explícito;
- fingerprint;
- aquisição manual;
- erro bruto;
- corpo de e-mail.

Preferir enums e identificadores públicos já existentes, como slug de projeto.

## 27. Configuração da propriedade GA4

Quando a propriedade real for criada/configurada:

- usar Measurement ID próprio da Repage;
- não vincular/ativar Google Ads nesta entrega;
- manter Enhanced Measurement desativado ou estritamente limitado até revisão, evitando eventos fora do contrato centralizado;
- validar Realtime/DebugView somente com dados fictícios/não pessoais.

## 28. Falha do Analytics

Se `gtag.js` falhar:

- site continua funcionando;
- consentimento continua salvo;
- formulário continua funcionando;
- nenhum erro técnico é mostrado ao visitante;
- não fazer retry agressivo;
- não bloquear navegação.

Analytics é não essencial.

## 29. Fontes e terceiros antes do consentimento

Hoje `index.html` carrega Instrument Sans via Google Fonts remoto.

Esta entrega deve:

- remover `fonts.googleapis.com`;
- remover `fonts.gstatic.com`;
- remover preconnects correspondentes;
- servir Instrument Sans localmente;
- preservar pesos/estilos necessários;
- manter fallback de sistema.

Fonte deve vir de origem oficial/licenciada, com licença compatível versionada conforme necessário.

Não alterar a família tipográfica aprovada.

## 30. Regra de terceiros antes da escolha

Na experiência pública normal, antes de consentimento analítico:

- nenhum Google Analytics;
- nenhuma tag Ads;
- nenhum Google Fonts remoto;
- nenhuma CMP externa.

Links externos acionados explicitamente pelo visitante continuam permitidos.

## 31. Política de Privacidade — identidade

Identificação factual inicial:

**Repage, marca conduzida por Lukas Frick.**

Não inventar CNPJ, razão social, endereço empresarial, DPO formal, equipe jurídica ou empresa inexistente.

Canal de privacidade:

`contato@repage.com.br`

## 32. Política de Privacidade — status do texto

A Entrega 8 prepara um rascunho factual e técnico baseado no funcionamento real da Repage.

Esse rascunho:

- não é apresentado como aconselhamento jurídico;
- não inventa base empresarial inexistente;
- deve ser revisado por Lukas;
- permanece sujeito a revisão jurídica antes do lançamento público definitivo.

## 33. Política de Privacidade — estrutura mínima

A página deve explicar:

1. quem conduz a Repage;
2. escopo;
3. dados fornecidos pelo formulário;
4. dados técnicos usados para segurança;
5. finalidades;
6. comunicação por e-mail;
7. Analytics condicionado;
8. compartilhamento com prestadores necessários;
9. retenção;
10. direitos e contato;
11. atualização/data/versão.

## 34. Dados do formulário descritos na política

Dados coletados quando o visitante envia solicitação:

- nome;
- e-mail;
- WhatsApp;
- tipo de projeto;
- marca/negócio quando informado;
- mensagem quando informada;
- ciência da Política de Privacidade;
- versão da política.

Não afirmar coleta de campo que não existe.

## 35. Dados técnicos de segurança

Explicar de forma proporcional que o fluxo pode processar temporariamente dados técnicos necessários para prevenção de abuso, limitação de frequência, idempotência, segurança e funcionamento.

Pode citar endereço IP usado temporariamente para proteção.

Não afirmar que IP é persistido no Lead.

Não expor detalhes que enfraqueçam mecanismos de segurança.

## 36. Finalidades descritas

Finalidades factuais:

- receber e analisar solicitação;
- entrar em contato;
- conduzir tratativas relacionadas;
- confirmar recebimento;
- proteger o formulário contra abuso/repetição;
- manter segurança e operação;
- medir uso do site quando houver consentimento analítico.

Não incluir venda de dados, perfil oculto, newsletter automática, marketing por e-mail ou Ads ativos.

## 37. Compartilhamento

Rascunho pode explicar compartilhamento somente quando necessário com:

- infraestrutura/hospedagem;
- serviços de e-mail;
- fornecedores técnicos necessários;
- Google Analytics, apenas após consentimento analítico.

Não inventar fornecedores ainda não definidos.

## 38. Retenção

Regra aprovada:

> Os dados de solicitação são mantidos pelo período necessário para analisar o contato, conduzir tratativas relacionadas, atender finalidades operacionais e cumprir obrigações aplicáveis. Quando deixarem de ser necessários, devem ser eliminados ou tratados conforme hipóteses de conservação aplicáveis.

Não definir prazo arbitrário nesta spec.

Não criar job automático de exclusão nesta entrega.

## 39. Direitos e contato

A página deve indicar `contato@repage.com.br` para solicitações relacionadas a dados.

Rascunho pode mencionar de forma geral acesso/informações, correção, eliminação quando aplicável, revisão de preferências e demais direitos previstos na legislação aplicável.

Redação jurídica exata permanece sujeita à revisão.

## 40. Política de Cookies — escopo

A página deve explicar cookies e tecnologias semelhantes da V1.

Categorias:

- necessários;
- analíticos;
- publicitários.

Não afirmar tecnologia publicitária ativa quando não existe.

## 41. Tecnologias necessárias

Descrever o `localStorage` de preferência:

- chave conceitual `repage:consent:v1`;
- versão;
- categorias;
- timestamp;
- sem PII.

Mecanismos de segurança do formulário podem processar dados técnicos temporários, sem serem descritos incorretamente como cookies.

## 42. Cookies analíticos

Somente após consentimento analítico e GA4 configurado.

Informar que GA4 pode usar cookies first-party como:

- `_ga`;
- `_ga_<container-id>`.

Referência factual atual:

- prazo padrão de até 2 anos, sujeito à configuração e limites do navegador.

Finalidade:

- distinguir usuários/sessões e medir uso agregado.

## 43. Publicitários

Página deve afirmar:

- categoria prevista;
- desligada por padrão;
- nenhuma tag publicitária ativa nesta V1;
- futura ativação exige revisão das escolhas e da política.

## 44. Alterar preferências

A Política de Cookies deve oferecer ação real:

`Revisar preferências`

O visitante não precisa limpar manualmente o navegador para mudar escolhas.

## 45. Páginas legais — layout

Preservar Design System:

- layout editorial;
- largura de leitura;
- headings claros;
- índice quando útil;
- pouco movimento;
- data;
- versão;
- links acessíveis;
- foco;
- responsividade.

Não transformar texto legal em cards.

Pode existir componente compartilhado `LegalPage` se houver contrato real.

## 46. Metadados das páginas legais

Substituir títulos/descriptions de “em preparação” por metadados factuais.

Nesta entrega, manter `noindex` se a política de indexação final pertencer à Entrega 9.

Não antecipar canonical/sitemap/prerender.

## 47. Versionamento da Política de Privacidade

O formulário já usa:

- frontend: `VITE_PRIVACY_POLICY_VERSION`;
- backend: `PRIVACY_POLICY_VERSION`.

Esses valores permanecem sincronizados por ambiente.

Enquanto o texto estiver em revisão:

- não inventar versão jurídica final;
- manter identificação explícita de pré-lançamento.

Quando Lukas aprovar o texto para a V1:

- escolher versão final clara;
- atualizar frontend/backend em conjunto;
- exibir a versão na página;
- manter teste de mismatch.

Mudança futura material exige nova versão.

## 48. Versão da Política de Cookies

A Política de Cookies deve ter versão/data própria no conteúdo frontend.

Não precisa ser persistida no Lead.

A versão técnica do consentimento não precisa ser idêntica à versão textual da Política de Cookies.

## 49. Configuração de ambiente

Adicionar ao frontend `.env.example`:

```text
VITE_GA_MEASUREMENT_ID=
```

Preservar:

```text
VITE_PRIVACY_POLICY_VERSION=
```

Nenhum segredo em `VITE_*`.

## 50. Backend

A Entrega 8 não cria model, endpoint ou tabela de consentimento; não cria Analytics backend nem perfil de visitante.

Backend apenas continua coerente com a versão da Política de Privacidade validada no Lead.

Não criar mudança artificial.

## 51. Sem CMP externa

Não adicionar OneTrust, Cookiebot, iubenda, Usercentrics ou outra CMP.

A necessidade atual é atendida pela aplicação React.

## 52. Sem nova dependência frontend obrigatória

A solução deve ser possível com React, TypeScript, React Router, Styled Components e APIs nativas do navegador.

Não adicionar pacote de cookies/consentimento/Analytics sem necessidade concreta.

## 53. Responsividade

Validar:

- desktop amplo;
- notebook;
- tablet;
- mobile;
- mobile compacto;
- baixa altura quando o dialog puder ficar apertado.

Banner não cobre ações críticas sem recuperação. Central permanece rolável e com salvar alcançável. Páginas legais não têm overflow ou linhas excessivas.

## 54. Segurança e privacidade

Obrigatório:

- deny-by-default;
- nenhum script GA antes de autorização;
- nenhuma tag Ads;
- nenhuma PII em eventos;
- nenhuma PII na preferência;
- nenhum segredo em Vite;
- nenhum dado do Lead no localStorage;
- não registrar escolhas no backend;
- não criar identificador próprio de usuário.

## 55. Comportamento sem Analytics

O site continua útil se Analytics não carregar.

Consentimento/Analytics não podem quebrar navegação, portfólio, cases, formulário ou páginas legais.

## 56. Eventos não autorizados

Antes do consentimento, interações não são enfileiradas para envio posterior.

A medição começa da autorização em diante.

Consentimento não retroage.

## 57. Testes unitários — consentimento

Cobrir:

- estado inicial;
- preferência válida/inválida;
- versão incompatível;
- aceitar/rejeitar/personalizar;
- necessário sempre true;
- persistência;
- falha de storage;
- reabrir;
- salvar;
- revogar Analytics.

## 58. Testes unitários — Analytics

Cobrir:

- sem consentimento = loader não chamado;
- rejeitado = loader não chamado;
- consentido + ID = loader chamado;
- sem ID = no-op;
- script uma vez;
- eventos bloqueados/liberados;
- page view manual;
- mudança de rota;
- revogação;
- cookie cleanup best effort;
- erro de script;
- payloads sem PII.

## 59. Testes de eventos

Validar nomes e payloads seguros para CTA, portfolio, case, projeto externo, formulário, WhatsApp e consentimento.

Não usar snapshots extensos.

## 60. Testes — páginas legais

Cobrir:

- Privacidade não é placeholder;
- Cookies não é placeholder;
- identidade correta;
- canal correto;
- data/versão;
- links;
- botão de preferências;
- formulário continua apontando para `/privacidade`;
- conteúdo não afirma Ads ativo.

## 61. Playwright

Cobrir:

### Primeira visita
- banner aparece;
- Analytics não é solicitado;
- página navegável.

### Rejeitar
- escolha persiste;
- reload não mostra banner;
- nenhuma request GA.

### Aceitar analíticos
Com mock controlado:
- request `gtag.js` ocorre só após ação;
- eventos subsequentes podem sair.

### Personalizar
- analytics/publicitários independentes;
- necessário imutável.

### Revisar
- footer reabre;
- revogação bloqueia novos eventos.

### Acessibilidade
- teclado;
- foco;
- Esc/retorno;
- mobile;
- reduced motion.

## 62. Teste de terceiros

Antes do consentimento, verificar ausência de requests automáticas para:

- `googletagmanager.com`;
- `google-analytics.com`;
- `fonts.googleapis.com`;
- `fonts.gstatic.com`.

Google Fonts continua ausente mesmo depois do consentimento.

## 63. Validação GA4 real

Quando houver Measurement ID real:

- configurar em ambiente controlado;
- consentir analíticos;
- validar carregamento;
- validar Realtime/DebugView;
- validar ao menos `page_view` e um evento seguro;
- confirmar ausência de PII;
- rejeitar/revogar e validar interrupção.

Não usar dados pessoais reais.

Se ID ainda não existir, registrar como pendência externa, sem simular evidência.

## 64. Revisão visual humana

Checkpoint obrigatório para:

- banner desktop/mobile;
- central desktop/mobile;
- Privacidade;
- Cookies;
- footer com preferências.

Confirmar que não parece CMP genérica, rejeitar não está escondido, a UI não domina a homepage, páginas legais preservam leitura editorial e mobile/foco estão corretos.

## 65. Fases de implementação

### Fase 1 — Fundação de privacidade e consentimento

- remover Google Fonts remoto;
- Instrument Sans local;
- estado/versionamento;
- `ConsentProvider`;
- storage;
- banner;
- central;
- footer;
- testes focados.

Checkpoint visual de consentimento.

### Fase 2 — Analytics condicionado

- `services/analytics`;
- Measurement ID;
- loader;
- page views;
- eventos;
- instrumentação;
- revogação;
- testes focados.

Não ativar Ads.

### Fase 3 — Páginas legais

- conteúdo factual/técnico;
- layout editorial;
- data/versão;
- canal;
- Cookies;
- integração com preferências;
- metadados básicos.

Checkpoint visual legal.

### Fase 4 — Integração e revisão

- versão de privacidade;
- regressão do formulário;
- rede de terceiros;
- acessibilidade;
- responsividade;
- GA real se ID disponível;
- revisão factual/privacidade.

### Fase 5 — Fechamento

- bateria completa;
- segurança/privacidade;
- revisão visual;
- diff;
- documentação;
- status.

## 66. Validações finais frontend

```bash
cd frontend
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

## 67. Validações finais backend

```bash
cd backend
python manage.py check
python manage.py makemigrations --check --dry-run
ruff check .
pytest
```

Não se espera migration nesta entrega.

## 68. Diff

Na raiz:

```bash
git diff --check
```

Revisar secrets, traces, PII, fontes/licença e dependências inesperadas.

## 69. Fora de escopo — Ads

Não implementar tag Ads, conversão Ads, remarketing, enhanced conversions, audience, Meta Pixel ou campanha.

Somente preparar categoria publicitária.

## 70. Fora de escopo — Entrega 9

Não implementar sitemap final, canonical, Open Graph final, Twitter Cards finais, JSON-LD final ou prerender.

Metadados básicos das páginas legais podem ser atualizados.

## 71. Fora de escopo — Entrega 10

Não implementar deploy, CI/CD, domínio/DNS, SSL, proxy, cron, configuração operacional final do GA, monitoramento ou backups.

## 72. Fora de escopo geral

Não implementar CMP externa, consentimento no banco, identificador anônimo próprio, fingerprint analítico, CRM, marketing automation, newsletter, geolocalização, heatmap, session replay ou A/B testing.

## 73. Dependências externas / pendências reais

### Measurement ID
Ainda precisa existir um GA4 Measurement ID real para validar coleta no Google. Não bloqueia implementação estrutural.

### Revisão jurídica
O texto produzido nesta entrega é rascunho factual/técnico. Antes do lançamento público definitivo, a redação deve passar pela revisão jurídica prevista no Produto.

### Versão final
Somente depois da aprovação do texto será escolhida a versão final sincronizada frontend/backend.

## 74. Rascunho factual — Política de Privacidade

### Política de Privacidade

**Última atualização:** a definir na aprovação final.  
**Versão:** pré-lançamento até aprovação final.

A Repage é uma marca conduzida por Lukas Frick. Esta Política de Privacidade explica, de forma geral, como os dados são tratados quando você utiliza o site da Repage ou envia uma solicitação de orçamento.

#### 1. Dados fornecidos por você

Ao enviar uma solicitação pelo formulário, podem ser informados:

- nome;
- e-mail;
- WhatsApp;
- tipo de projeto;
- nome da marca, negócio ou projeto, quando informado;
- mensagem sobre a necessidade, quando informada.

O formulário também registra a ciência da versão vigente desta Política de Privacidade.

#### 2. Para que os dados são usados

Essas informações são usadas para:

- receber e analisar sua solicitação;
- entrar em contato sobre o pedido enviado;
- conduzir conversas e tratativas relacionadas ao projeto;
- confirmar o recebimento da solicitação;
- manter a segurança e o funcionamento do formulário.

A Repage não utiliza a ciência desta Política como autorização automática para marketing, publicidade ou comunicações promocionais.

#### 3. Segurança e prevenção de abuso

O formulário utiliza mecanismos técnicos para reduzir envios duplicados, automação indevida e abuso.

Dados técnicos estritamente necessários ao funcionamento e à proteção, como informações de rede usadas temporariamente para limitação de frequência e identificadores técnicos opacos, podem ser processados para essas finalidades.

Esses dados técnicos não são incorporados ao cadastro do Lead como perfil comercial.

#### 4. Comunicações

Após uma solicitação válida, a Repage pode enviar uma confirmação de recebimento ao e-mail informado e utilizar os dados de contato para responder à solicitação.

Essas mensagens não representam orçamento, aceite de projeto ou compromisso de contratação.

#### 5. Analytics

A Repage pode utilizar Google Analytics para compreender o uso do site.

O Google Analytics somente é carregado quando você autoriza a categoria analítica nas preferências do site.

Os eventos definidos pela Repage não enviam nome, e-mail, WhatsApp, mensagem, Lead ID ou conteúdo dos campos do formulário.

Você pode revisar sua escolha a qualquer momento em “Preferências de cookies”.

#### 6. Compartilhamento

Os dados podem ser tratados por fornecedores técnicos necessários ao funcionamento do site, banco de dados, infraestrutura e envio de e-mails, conforme a função de cada serviço.

Quando autorizado, dados analíticos também podem ser tratados pelo Google Analytics.

A lista e a redação desta seção devem ser revisadas antes do lançamento conforme os fornecedores de produção efetivamente utilizados.

#### 7. Retenção

Os dados de solicitação são mantidos pelo período necessário para analisar o contato, conduzir tratativas relacionadas, atender finalidades operacionais e cumprir obrigações aplicáveis.

Quando deixarem de ser necessários, devem ser eliminados ou tratados conforme hipóteses de conservação aplicáveis.

A Repage não define nesta versão um prazo automático único de exclusão para todos os Leads.

#### 8. Seus dados e contato

Para dúvidas ou solicitações relacionadas aos seus dados, entre em contato:

`contato@repage.com.br`

Podem ser solicitadas informações, correção ou eliminação quando aplicável, além de outros direitos previstos na legislação aplicável.

A redação jurídica final desta seção deve ser revisada antes da publicação definitiva.

#### 9. Atualizações

Esta Política pode ser atualizada quando o site, fornecedores, finalidades ou requisitos aplicáveis mudarem.

Mudanças materiais relacionadas ao tratamento do formulário exigem atualização da versão registrada pelo site.

## 75. Rascunho factual — Política de Cookies

### Política de Cookies e Tecnologias Semelhantes

**Última atualização:** a definir na aprovação final.  
**Versão:** pré-lançamento até aprovação final.

Esta página explica como a Repage utiliza cookies e tecnologias semelhantes no site.

#### 1. Categorias

A Repage organiza as preferências em:

- Necessários;
- Analíticos;
- Publicitários.

Necessários permanecem ativos porque suportam funcionamento e preferências essenciais.

Analíticos e Publicitários permanecem desligados por padrão.

#### 2. Necessários

A Repage utiliza armazenamento local do navegador para lembrar suas escolhas de consentimento.

Esse registro contém apenas informações técnicas da preferência, como versão, categorias escolhidas e data da atualização. Ele não contém nome, e-mail, telefone ou conteúdo do formulário.

Mecanismos de segurança do formulário também podem processar dados técnicos temporários, mas isso não significa que todos esses mecanismos utilizem cookies no navegador.

#### 3. Analíticos

Quando você autoriza a categoria Analíticos e existe uma configuração válida, a Repage pode carregar o Google Analytics 4.

O Google Analytics pode utilizar cookies first-party como:

- `_ga`;
- `_ga_<container-id>`.

Esses cookies podem possuir prazo padrão de até dois anos, sujeito à configuração do Google Analytics e às limitações do navegador.

A finalidade é medir uso do site e compreender, de forma agregada, interações com rotas e ações relevantes.

A Repage não envia ao Analytics o conteúdo do formulário ou os dados pessoais fornecidos nele.

#### 4. Publicitários

A categoria Publicitários existe para permitir evolução futura das preferências.

No estado atual da V1, nenhuma tag publicitária, Google Ads, remarketing ou pixel publicitário é carregado.

A autorização dessa categoria, isoladamente, não ativa tecnologia publicitária nesta entrega.

Uma futura campanha deverá exigir revisão da configuração e desta política antes de qualquer ativação.

#### 5. Como escolher

Na primeira visita, você pode:

- aceitar todos;
- rejeitar não essenciais;
- personalizar.

Você pode revisar a escolha posteriormente pelo controle “Preferências de cookies” disponível no site.

A navegação, rolagem ou simples fechamento da interface não equivalem a aceitar tecnologias não essenciais.

#### 6. Alterações

A Repage pode atualizar esta política quando mudar fornecedores, tecnologias ou finalidades.

Mudanças materiais nas categorias ou no uso de tecnologias podem exigir uma nova escolha.

## 76. Critérios de aceite

- [ ] `main` pós-0007 usada como baseline.
- [ ] Entregas 5–7 não foram reconstruídas.
- [ ] `ConsentProvider` global implementado.
- [ ] Preferência permanece somente no navegador.
- [ ] Nenhum model/API de consentimento criado.
- [ ] Categorias necessárias/analíticas/publicitárias implementadas.
- [ ] Não essenciais desativados por padrão.
- [ ] Aceitar/rejeitar/personalizar/revisar funcionam.
- [ ] Footer reabre preferências.
- [ ] Storage versionado e sem PII.
- [ ] GA4 configurável por `VITE_GA_MEASUREMENT_ID`.
- [ ] GA4 não é solicitado antes de consentimento.
- [ ] Rejeitar mantém GA4 não carregado.
- [ ] Consentir carrega GA4 no máximo uma vez.
- [ ] Revogar bloqueia novos eventos.
- [ ] Cookies GA removidos em best effort.
- [ ] Nenhuma tag publicitária carregada.
- [ ] Eventos centralizados e sem PII.
- [ ] Eventos anteriores ao consentimento não enviados retroativamente.
- [ ] Google Fonts remoto removido.
- [ ] Instrument Sans local/licenciada.
- [ ] Nenhum terceiro não essencial automático antes da escolha.
- [ ] `/privacidade` e `/cookies` não são placeholders.
- [ ] Identificação pública correta.
- [ ] Canal `contato@repage.com.br`.
- [ ] Retenção sem prazo inventado.
- [ ] Páginas exibem data/versão.
- [ ] Formulário continua persistindo ciência/versão.
- [ ] Backend continua rejeitando versão divergente.
- [ ] Nenhuma migration inesperada.
- [ ] Consent UI acessível/responsiva.
- [ ] Network tests aprovados.
- [ ] Testes frontend e Playwright aprovados.
- [ ] Backend regression aprovado.
- [ ] Build aprovado.
- [ ] `git diff --check` aprovado.
- [ ] Revisão visual humana aprovada.
- [ ] Pendências externas registradas sem evidência simulada.
- [ ] Nenhuma Entrega 9+ antecipada.
- [ ] Spec só vira `implemented` após os critérios técnicos obrigatórios.

## 77. Documentação no fechamento

Ao concluir:

- esta spec → `implemented`;
- atualizar `docs/specs/README.md`;
- roadmap → Entrega 8 concluída / Entrega 9 próxima;
- atualizar `docs/README.md` se necessário;
- reconciliar `docs/ARCHITECTURE.md` com storage, versionamento, carregamento estrito do GA, eventos finais e ausência de Ads;
- `frontend/AGENTS.md` somente se surgir regra duradoura não coberta;
- Design System somente se checkpoint validar padrão visual reutilizável novo;
- backend AGENTS somente se privacidade backend mudar;
- ADR apenas diante de decisão estrutural nova.

## 78. Definição de pronto

A Entrega 8 está tecnicamente pronta quando:

`visitante → escolha deny-by-default → preferência local → GA somente se autorizado → eventos seguros → preferências revisáveis → páginas legais factuais`

e quando:

- o fluxo de Lead permanece intacto;
- ciência de Privacidade continua separada de cookies/Analytics;
- nenhuma PII entra em Analytics;
- nenhuma tag Ads foi antecipada;
- terceiros não essenciais não carregam antes da escolha;
- páginas legais deixaram de ser placeholders;
- Instrument Sans não depende mais de Google Fonts remoto;
- UX é acessível e responsiva;
- testes e revisão visual passaram;
- Measurement ID real e revisão jurídica permanecem registrados com honestidade caso ainda não estejam disponíveis.
