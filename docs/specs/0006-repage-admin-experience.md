# 0006 — Experiência administrativa Repage

- **Status:** implemented
- **Responsável:** Lukas Frick
- **Data:** 15 de agosto de 2026
- **Branch-base:** `main`
- **Entrega do roadmap:** 6 — Experiência administrativa Repage
- **Spec predecessora:** `0005-lead-intake-backend-and-form.md`
- **Documentos relacionados:** `AGENTS.md`, `backend/AGENTS.md`, `docs/PRODUCT.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md`, `docs/ROADMAP.md`

## 1. Contexto

A Entrega 5 está implementada, validada e integrada à `main`.

O backend atual usa Django 5.2.6, Django REST Framework, PostgreSQL e Django Admin nativo, preservando autenticação, sessão, CSRF e permissões do Django.

A administração de Leads já é funcional. O `LeadAdmin` existente possui listagem, busca, filtros, criação manual, detalhe, edição operacional limitada, ação em massa de arquivamento, exclusão desabilitada e autenticação obrigatória.

A implementação final materializa o `AdminSite` padrão do Django como `RepageAdminSite`, com templates e assets administrativos próprios, login com branding, shell Repage e refinamento específico da área administrativa. Após autenticação, `/admin/` direciona diretamente para a changelist de Leads; não há uma index operacional separada.

A Entrega 6 evolui essa base funcional. Ela não reconstrói o domínio de Leads nem cria um novo produto administrativo.

## 2. Objetivo

Transformar o Django Admin existente em uma experiência administrativa profissional, clara e coerente com a Repage para uso cotidiano, preservando integralmente o mecanismo administrativo nativo do Django.

Ao final:

- `/admin/` continua sendo o ponto de entrada administrativo;
- login, header e navegação usam identidade Repage;
- a listagem de Leads fica mais clara e ergonômica;
- o detalhe organiza as informações por contexto;
- a criação manual recebe a mesma organização visual;
- estados e ações ficam fáceis de identificar;
- desktop/notebook são a experiência principal;
- tablet e mobile permanecem utilizáveis para consultas e operações razoáveis;
- autenticação, autorização, CSRF e sessões permanecem nativos;
- nenhuma responsabilidade da Entrega 7 é antecipada.

## 3. Resultado esperado

A área administrativa deve parecer uma ferramenta interna profissional da Repage, e não o Django Admin padrão sem acabamento.

Critérios observáveis:

- branding Repage presente no login e no shell administrativo;
- título e favicon próprios;
- paleta coerente com azul-grafite, off-white e violeta;
- hierarquia visual consistente;
- navegação nativa preservada e refinada;
- entrada administrativa objetiva, direcionada à listagem de Leads;
- listagem de Leads legível e funcional;
- status distinguíveis por texto e apoio visual;
- detalhe do Lead dividido em grupos compreensíveis;
- criação manual organizada;
- foco visível;
- erros e mensagens nativas preservados;
- ausência de quebra severa ou overflow de página em viewports menores;
- nenhuma dependência de tema de terceiros.

## 4. Decisões congeladas

### 4.1 Superfície administrativa

Continuar usando Django Admin.

Não criar:

- SPA administrativa;
- React administrativo;
- rota administrativa no frontend público;
- API privada apenas para um painel;
- JWT;
- autenticação própria;
- sistema próprio de usuários;
- novo painel substituindo Django Admin.

### 4.2 URL

Preservar `/admin/`. Não criar segunda área administrativa em paralelo.

### 4.3 Banco e domínio

Preservar PostgreSQL, modelo `Lead`, migrations existentes, API pública existente, normalização existente e fluxo público de criação de Lead.

A Entrega 6 não exige migration de domínio. Se a implementação visual parecer exigir mudança de modelo, parar e tratar como desvio de escopo antes de alterar schema.

## 5. Estado funcional herdado da 0005

### 5.1 Campos do Lead

Preservar:

- `id`;
- `name`;
- `email`;
- `whatsapp`;
- `project_type`;
- `business_name`;
- `message`;
- `source`;
- `acquisition_source`;
- `status`;
- `privacy_policy_acknowledged`;
- `privacy_policy_version`;
- `created_at`;
- `updated_at`.

### 5.2 Status

Preservar exatamente:

- `new` — Novo;
- `in_progress` — Em andamento;
- `delivered` — Entregue;
- `maintenance` — Manutenção;
- `archived` — Arquivado.

Não criar novos estados nesta entrega.

### 5.3 Origem

`source` continua sendo origem técnica (`website` ou `manual`). `acquisition_source` continua sendo origem comercial livre e opcional de Lead manual. Não fundir os dois conceitos.

### 5.4 Criação manual

Na criação manual:

- `source = manual`;
- status inicial = `new`;
- `acquisition_source` pode ser informado;
- não registrar ciência fictícia de Política de Privacidade;
- preservar normalização existente.

### 5.5 Edição depois da criação

Continuam editáveis:

- `email`;
- `whatsapp`;
- `project_type`;
- `status`.

Continuam somente leitura:

- `id`;
- `name`;
- `business_name`;
- `message`;
- `source`;
- `acquisition_source`;
- `privacy_policy_acknowledged`;
- `privacy_policy_version`;
- `created_at`;
- `updated_at`.

Não ampliar edição apenas por conveniência visual.

### 5.6 Exclusão

Continuar desabilitada como operação administrativa comum. A Entrega 6 não cria fluxo de exclusão por privacidade.

## 6. Abordagem técnica aprovada

A implementação deve preferir mecanismos nativos do Django Admin.

Direção:

1. criar um `AdminSite` Repage;
2. torná-lo o site administrativo padrão via configuração nativa do Django;
3. preservar a URL `/admin/` e os names/reverses do namespace `admin`;
4. usar templates administrativos estendidos/overridden seletivamente;
5. usar assets estáticos próprios para branding e CSS;
6. usar `ModelAdmin` para ergonomia específica de Leads;
7. evitar JavaScript customizado quando CSS/templates/ModelAdmin resolverem.

Não adicionar biblioteca de tema/Admin de terceiros.

Não copiar grandes templates do Django quando um `{% extends %}` com blocos específicos resolver.

## 7. `AdminSite` Repage

Criar uma subclasse dedicada, por exemplo `RepageAdminSite`.

Ela deve definir pelo menos:

- `site_header`;
- `site_title`;
- `index_title`;
- templates específicos quando necessários;
- identidade consistente no contexto administrativo.

Direção de texto:

- `site_header`: `Repage`;
- `site_title`: `Repage Admin`;
- `index_title`: `Administração`.

Preservar o link nativo para visualizar o site quando ele continuar útil.

Não criar segundo `AdminSite`.

## 8. Estrutura de templates

Preferir templates de projeto em:

```text
backend/templates/admin/
```

e configurar o backend de templates para encontrá-los antes do fallback do `django.contrib.admin`.

Criar somente overrides necessários.

Candidatos esperados:

- `admin/base.html` ou `admin/base_site.html`;
- template de login;
- templates específicos de Lead somente se o `ModelAdmin` não resolver a necessidade.

Não duplicar integralmente `change_list.html`, `change_form.html` ou `submit_line.html` quando bastar estender o template nativo e sobrescrever um bloco.

## 9. Static administrativo

Criar assets próprios do backend para a área administrativa.

Direção sugerida:

```text
backend/static/repage-admin/
├── admin.css
└── brand/
    └── logo.svg
```

A localização final pode seguir a organização existente do projeto desde que permaneça simples e previsível.

O logo deve derivar do SVG oficial já aprovado da Repage.

Não:

- redesenhar o logo;
- gerar variante nova sem necessidade;
- depender da aplicação frontend estar online para carregar branding;
- carregar asset administrativo de URL externa.

Uma cópia estática no backend é aceitável devido à separação de deploy entre frontend público e backend/Admin, desde que preserve exatamente a marca aprovada.

## 10. Tipografia

Não adicionar dependência remota de fonte apenas para o Admin.

Se Instrument Sans estiver disponível como asset local e reutilizável de forma adequada, pode ser usada. Caso contrário, usar uma pilha de sistema limpa e legível no Admin.

A coerência visual da área administrativa deve depender principalmente de identidade, cor, proporção, hierarquia, espaçamento e acabamento, e não de uma nova dependência tipográfica.

## 11. Tema e cores

Usar como base azul-grafite profundo, off-white, violeta de destaque e superfícies neutras coerentes.

Customizar preferencialmente as variáveis CSS do próprio Django Admin antes de substituir regras internas em grande escala.

Preservar suporte ao mecanismo nativo de tema quando ele continuar funcional. Se light/dark estiverem disponíveis, ambos devem permanecer legíveis e coerentes com a Repage.

Não esconder informação por cor.

## 12. Login administrativo

Criar experiência de login identificável como Repage.

Deve conter:

- logo Repage;
- identificação administrativa curta;
- formulário nativo de autenticação;
- labels existentes;
- mensagens de erro existentes;
- gerenciamento nativo de CSRF;
- suporte a password manager/autocomplete nativo;
- foco visível.

Direção visual:

- composição simples;
- fundo ou painel azul-grafite;
- off-white;
- violeta apenas como destaque funcional;
- sem hero;
- sem motion narrativo;
- sem marketing;
- sem informações internas do sistema.

Não criar login custom por API, tela React, credenciais padrão, usuário demo ou botão de acesso público.

## 13. Header administrativo

O header deve:

- exibir marca Repage;
- deixar claro que se trata da administração;
- preservar informações/ações do usuário autenticado;
- preservar alteração de senha e logout nativos;
- preservar link para o site público quando aplicável;
- funcionar por teclado;
- manter contraste.

Não copiar o header público da homepage. A experiência administrativa compartilha identidade, não composição literal.

## 14. Navegação

Preservar a navegação nativa do Django Admin como base.

O módulo de Leads deve ser o foco principal da V1.

Usuários/Grupos do Django podem permanecer disponíveis conforme permissão, mas visualmente subordinados à administração de Leads.

É permitido ordenar apps/modelos para colocar Leads primeiro usando mecanismos do `AdminSite`.

Não criar menu custom em JavaScript, router administrativo, navegação paralela ou sidebar proprietária complexa.

## 15. Entrada administrativa

Após autenticação, `/admin/` direciona diretamente para a changelist de Leads, que é a
superfície operacional principal da V1. O namespace `admin`, a navegação nativa, o acesso
a Leads e o gerenciamento de usuários/grupos continuam sujeitos às permissões nativas.

Não criar dashboard com faturamento, conversão, leads por mês, gráficos, metas, funil ou KPIs fictícios.

## 16. Lista de Leads

Preservar a funcionalidade atual e melhorar ergonomia.

### 16.1 Conteúdo

A listagem continua apresentando pelo menos:

- nome;
- e-mail;
- WhatsApp;
- tipo de projeto;
- status;
- data de criação.

### 16.2 Status

O status deve aparecer com label textual e tratamento visual discreto, com contraste suficiente. Cor é apoio, nunca a única distinção. Preservar ordenação/filtro funcional do campo.

### 16.3 WhatsApp

Manter apresentação brasileira legível. Não alterar o valor persistido por causa da apresentação.

### 16.4 Busca

Preservar busca por nome, e-mail, WhatsApp, negócio e `acquisition_source`.

Pode adicionar texto de ajuda curto à busca se isso melhorar descoberta sem poluir a interface.

### 16.5 Filtros

Preservar status, tipo de projeto e data.

É permitido adicionar `source` como filtro administrativo, pois o campo já existe e ajuda a distinguir leads de website e manuais.

Não criar filtros derivados complexos ou novas categorias de domínio.

### 16.6 Ações

Preservar arquivamento em massa. Não substituir ação em massa por JavaScript customizado. Não adicionar exclusão.

## 17. Detalhe do Lead

A tela de alteração deve organizar informações por função.

Direção de agrupamento:

### Contato

- nome;
- e-mail;
- WhatsApp;
- negócio.

### Projeto

- tipo de projeto;
- status;
- mensagem.

### Origem

- origem técnica;
- origem comercial quando existente.

### Privacidade e registro

- ciência da política;
- versão da política;
- ID;
- criação;
- atualização.

A ordem exata pode ser refinada visualmente durante implementação sem alterar o contrato dos campos.

## 18. Mensagem

A mensagem integral deve permanecer facilmente legível.

Como é histórico readonly:

- não transformar em campo editável;
- não truncar de forma que esconda conteúdo;
- preservar quebras de linha;
- impedir overflow;
- tratar somente como texto;
- não renderizar HTML fornecido pelo Lead.

## 19. Campos editáveis e readonly

A customização visual deve deixar distinguível informação histórica/readonly de informação operacional editável, sem depender apenas de cor.

Readonly não deve parecer campo quebrado.

Campos editáveis permanecem controles nativos acessíveis do Django Admin.

## 20. Ações de contato

No detalhe do Lead, é permitido oferecer atalhos simples:

- `Enviar e-mail`;
- `Abrir WhatsApp`.

Regras:

- disponíveis somente dentro da área autenticada;
- derivados do e-mail/telefone já persistidos;
- sem mensagem pré-preenchida com dados do Lead;
- sem envio automático;
- WhatsApp abre apenas por ação explícita;
- destino externo deve usar proteção adequada;
- não registrar ação ou PII em logs customizados;
- não criar integração com API do WhatsApp.

Se o valor não puder gerar destino seguro, apresentar somente o dado em texto.

## 21. Arquivamento e status

No detalhe, alteração de status continua sendo o mecanismo simples para Em andamento, Entregue, Manutenção e Arquivado.

Não criar workflow, botão mágico ou automação para cada status.

A ação em massa de arquivamento continua disponível na listagem.

## 22. Histórico nativo

Preservar o histórico nativo do Django Admin quando disponível.

Não criar audit log customizado, timeline proprietária, modelo de histórico ou biblioteca de auditoria.

## 23. Criação manual

A criação manual recebe o mesmo acabamento da área.

Exibir somente os campos necessários ao registro manual:

- nome;
- e-mail;
- WhatsApp;
- tipo de projeto;
- negócio;
- mensagem;
- origem comercial opcional.

Não precisa exibir como campos funcionais ID, source, status inicial, ciência da política, versão da política ou timestamps.

Esses valores continuam definidos pelo comportamento já aprovado da 0005.

Pode existir texto de apoio discreto informando que Leads manuais entram como `Novo` e usam origem técnica `Manual`.

## 24. Validação e erros

Preservar a validação do `LeadAdminForm`.

Erros devem continuar associados aos campos, ser perceptíveis, manter labels, não depender apenas de vermelho e não perder o valor digitado sem necessidade.

Não duplicar lógica de normalização em template ou JavaScript.

## 25. Responsividade

### Desktop/notebook

É a experiência administrativa principal. Usar bem a largura disponível, manter densidade adequada e deixar tabela, filtros e ações facilmente alcançáveis.

### Tablet

Deve permanecer operacional para buscar, filtrar, abrir Lead, editar campos permitidos, salvar e criar Lead manual quando necessário.

### Mobile

Deve permitir consultas e operações razoáveis. Não é necessário transformar o Admin em experiência mobile-first.

Obrigatório:

- nenhuma quebra severa;
- body sem overflow horizontal descontrolado;
- header utilizável;
- formulários legíveis;
- ações principais acessíveis;
- filtros e busca utilizáveis;
- conteúdo do detalhe legível;
- tabela contida em região de scroll quando não couber.

Scroll horizontal controlado na região da tabela é aceitável. Scroll horizontal da página inteira não é.

## 26. Viewports de validação

Validar pelo menos:

- desktop amplo;
- notebook;
- tablet;
- mobile padrão;
- mobile compacto.

Adicionar viewport de baixa altura somente se login/header apresentarem problema observado.

## 27. Acessibilidade

Preservar capacidades nativas do Django Admin.

Obrigatório:

- teclado funcional;
- ordem de foco lógica;
- foco visível;
- labels;
- estrutura compreensível;
- mensagens de erro legíveis;
- contraste;
- links identificáveis;
- status com texto;
- controles nativos sempre que possível;
- nenhuma ação exclusiva de hover;
- nenhum ícone de controle sem nome acessível.

Não substituir inputs/selects nativos por componentes customizados apenas por estética.

## 28. Movimento

A área administrativa não precisa de motion narrativo.

Permitido:

- transições CSS curtas em hover/focus;
- mudança de estado discreta.

Não usar Framer Motion, animações de entrada, scroll-driven, parallax, loaders decorativos ou transições de rota.

`prefers-reduced-motion` deve ser respeitado por qualquer transição adicionada.

## 29. Segurança

A personalização não pode modificar negativamente autenticação, permissões, CSRF, sessão, escaping, proteção contra XSS, cookies, logout, alteração de senha ou login requerido.

Não usar `mark_safe` com conteúdo vindo do Lead.

Quando gerar HTML administrativo, usar escaping automático e mecanismos seguros do Django, como `format_html` quando aplicável.

Não incluir PII em assets, CSS, JavaScript, URLs internas públicas, logs customizados, fixtures versionadas ou screenshots públicas.

Screenshots de QA administrativo não devem ser publicados como mídia do portfólio.

## 30. Dependências

A implementação deve ser possível sem nova dependência Python ou JavaScript.

Não instalar tema Admin de terceiros.

Se durante a implementação surgir necessidade real de dependência nova:

1. parar;
2. demonstrar a limitação dos recursos nativos;
3. avaliar manutenção, segurança e compatibilidade;
4. obter aprovação antes de adicionar.

## 31. Django 5.2 e manutenção

Overrides devem ser mínimos para reduzir fragilidade em upgrades futuros.

Preferir variáveis CSS, blocos de template, `AdminSite` e `ModelAdmin`.

Evitar cópia integral de template base sem necessidade.

A customização deve continuar compreensível sem depender de detalhes privados do Django.

## 32. Testes automatizados

### 32.1 AdminSite

Cobrir:

- site customizado ativo;
- títulos/branding configurados;
- `/admin/` usando o AdminSite esperado;
- login custom renderiza;
- `/admin/` direciona para a changelist de Leads;
- autenticação continua obrigatória.

### 32.2 Permissões

Preservar e testar:

- staff sem permissão não ganha acesso indevido;
- permissões nativas de `view`/`add`/`change` continuam respeitadas;
- exclusão continua desabilitada.

### 32.3 LeadAdmin

Preservar testes da 0005 e adicionar cobertura para:

- listagem;
- filtros;
- busca;
- status display;
- fieldsets;
- readonly;
- criação manual;
- edição operacional;
- arquivamento;
- ações de contato se implementadas.

### 32.4 Templates/static

Validar de forma proporcional:

- template customizado realmente aplicado;
- stylesheet administrativo referenciado;
- branding presente;
- ausência de dependência de asset externo.

Não usar snapshot HTML grande como prova principal.

## 33. Validação manual funcional

Antes do fechamento, usar usuário administrativo fictício/local para validar:

### Login

- login válido;
- login inválido;
- logout;
- alteração de senha nativa acessível quando aplicável.

### Index

- Leads acessíveis;
- permissões respeitadas;
- ações recentes não quebradas.

### Listagem

- busca;
- filtros;
- navegação para detalhe;
- ação de arquivamento.

### Detalhe

- mensagem completa;
- readonly;
- edição de e-mail;
- edição de WhatsApp;
- edição de tipo;
- edição de status;
- salvar;
- histórico nativo.

### Criação manual

- criação válida;
- validação inválida;
- `source=manual`;
- status inicial `new`;
- política não falsificada;
- `acquisition_source` preservada.

## 34. Revisão visual humana

A 0006 é significativamente visual. Testes automatizados não aprovam design.

### Checkpoint A — Fundação administrativa

Depois de AdminSite, branding, login, header e index, revisar pelo menos login desktop, index desktop, login mobile e index mobile. Congelar após aprovação.

### Checkpoint B — Leads

Depois de listagem, detalhe e criação manual, revisar pelo menos lista desktop/notebook, detalhe desktop/notebook, criação manual desktop, lista mobile e detalhe mobile. Congelar após aprovação.

### Checkpoint C — Refinamento final

Revisar tablet, mobile compacto, foco, erros, filtros, tabela e ações.

Não reabrir checkpoints aprovados sem regressão ou requisito novo.

## 35. Critérios visuais verificáveis

A entrega não pode ser considerada aprovada apenas por “ficar bonita”.

Verificar:

- logo Repage aparece corretamente;
- nenhum texto padrão “Django administration” permanece como identidade principal;
- login é reconhecível como Repage;
- header diferencia marca e contexto administrativo;
- index destaca Leads sem dashboard artificial;
- listagem usa densidade adequada;
- status sempre possui texto;
- filtros e busca não perdem legibilidade;
- readonly não parece controle editável;
- mensagem longa continua legível;
- erros continuam claros;
- foco é visível em fundos claros e escuros;
- página não possui overflow horizontal descontrolado;
- mobile mantém ações essenciais;
- customização não parece cópia da homepage;
- customização não parece tema SaaS genérico.

## 36. Fora de escopo — Entrega 7

Não implementar:

- `EmailDelivery`;
- `IdempotencyRecord`;
- idempotência;
- `Idempotency-Key`;
- fingerprint;
- deduplicação;
- honeypot;
- tempo mínimo;
- throttling;
- rate limit;
- SMTP;
- notificações;
- confirmação por e-mail;
- retries;
- cron;
- reenvio;
- inspeção de entregas de e-mail.

O Admin não pode exibir componentes fictícios para modelos que ainda não existem.

## 37. Fora de escopo — produto administrativo futuro

Não implementar CRM, kanban, pipeline comercial novo, clientes, projetos administrativos, tarefas, notas, contratos, pagamentos, calendário, agenda, relatórios, gráficos, métricas comerciais, Analytics administrativo, gestão de portfólio, CMS, uploads ou área do cliente.

## 38. Arquivos provavelmente afetados

Esperados:

- `backend/config/settings.py`;
- configuração do `AdminSite`;
- `backend/apps/leads/admin.py`;
- templates em `backend/templates/admin/`;
- static administrativo;
- testes backend do Admin.

Pode ser afetado `backend/config/urls.py` somente se necessário para materializar o AdminSite sem mudar `/admin/`.

Não alterar frontend público para implementar o Admin. A única exceção admissível é reutilizar/copiar asset oficial de marca como fonte de branding, sem mudança visual no frontend.

## 39. Fases de implementação

### Fase 1 — Fundação administrativa e branding

Implementar:

- `AdminSite` Repage;
- configuração do site padrão;
- estrutura mínima de templates;
- static administrativo;
- branding;
- favicon;
- login;
- header;
- index;
- testes pontuais.

Checkpoint visual A obrigatório.

### Fase 2 — Experiência de Leads

Implementar/refinar:

- changelist;
- status visual;
- filtros/busca;
- fieldsets do detalhe;
- mensagem;
- readonly/editáveis;
- criação manual;
- ações de contato aprovadas;
- arquivamento existente;
- testes pontuais.

Checkpoint visual B obrigatório.

### Fase 3 — Responsividade, acessibilidade e refinamento

Validar e corrigir notebook, tablet, mobile, mobile compacto, teclado, foco, erros, tema, tabela, filtros, forms e ações.

Checkpoint visual C obrigatório.

### Fase 4 — Fechamento

Executar testes backend completos, checks/migrations, Ruff, revisão de segurança, revisão visual final, diff completo, reconciliação documental e status da spec.

Não antecipar bateria completa nas fases 1–3 salvo necessidade técnica específica.

## 40. Protocolo de execução

Seguir o Playbook vigente:

`fase → modelo + reasoning + commit sugerido → prompt delta → Codex implementa → revisão local → correção delta se necessária → aprovação → usuário commit/push → verificação remota → fase congelada`

Luna é o modelo padrão. Escalar para Terra ou Sol somente por evidência concreta de complexidade. Codex não executa operações Git simples.

## 41. Validações finais

No backend:

```bash
python manage.py check
python manage.py makemigrations --check --dry-run
ruff check .
pytest
```

Como esta entrega não deve alterar schema, `makemigrations --check --dry-run` deve permanecer limpo.

Na raiz:

```bash
git diff --check
```

Não há bateria frontend obrigatória se o frontend público não for alterado. Se algum arquivo frontend for modificado, executar validações proporcionais ao delta e justificar a mudança.

## 42. Regressão obrigatória da 0005

Confirmar no fechamento:

- API pública continua funcionando;
- PostgreSQL continua sendo banco principal;
- modelo Lead não mudou indevidamente;
- criação web continua persistindo;
- criação manual continua funcionando;
- normalização continua compartilhada;
- status continuam os cinco aprovados;
- campos readonly/editáveis continuam corretos;
- exclusão continua desabilitada;
- autenticação Admin continua obrigatória.

## 43. Documentação no fechamento

Ao concluir:

- marcar esta spec como `implemented`;
- atualizar `docs/specs/README.md`;
- atualizar `docs/ROADMAP.md`: Entrega 6 concluída e Entrega 7 próxima;
- atualizar `docs/README.md` se o estado executivo exigir;
- atualizar `docs/ARCHITECTURE.md` somente se a implementação final materializar regra estrutural além do que já está documentado;
- atualizar `docs/DESIGN_SYSTEM.md` somente se checkpoint humano validar regra administrativa reutilizável para a marca;
- atualizar `backend/AGENTS.md` somente se surgir regra operacional duradoura;
- não criar ADR sem decisão estrutural real.

## 44. Critérios de aceite

- [x] `main` pós-0005 foi usada como baseline.
- [x] `/admin/` continua sendo a URL administrativa.
- [x] Django Admin continua sendo a superfície administrativa.
- [x] Não existe painel React.
- [x] Não existe API privada nova para painel.
- [x] Não existe autenticação própria.
- [x] `AdminSite` Repage está ativo.
- [x] Branding Repage aparece no login e shell.
- [x] Logo usado deriva do asset oficial.
- [x] Não existe dependência externa de tema Admin.
- [x] Login mantém autenticação/CSRF/sessão nativos.
- [x] Header mantém ações nativas do usuário.
- [x] A entrada administrativa direciona diretamente para Leads.
- [x] Não há métricas fictícias na entrada administrativa.
- [x] Navegação nativa permanece funcional.
- [x] Listagem mantém nome, e-mail, WhatsApp, tipo, status e data.
- [x] Status possui texto e apoio visual.
- [x] Busca existente permanece funcional.
- [x] Filtros existentes permanecem funcionais.
- [x] Arquivamento em massa permanece funcional.
- [x] Exclusão continua desabilitada.
- [x] Detalhe organiza Contato, Projeto, Origem e Privacidade/registro.
- [x] Mensagem integral continua legível e readonly.
- [x] Somente `email`, `whatsapp`, `project_type` e `status` são editáveis depois da criação.
- [x] Demais campos permanecem readonly.
- [x] Criação manual preserva contrato da 0005.
- [x] Leads manuais continuam com `source=manual`.
- [x] Leads manuais continuam iniciando em `new`.
- [x] Ciência de política não é falsificada em Lead manual.
- [x] Ações de e-mail/WhatsApp, se implementadas, exigem ação explícita e não enviam PII automaticamente.
- [x] Histórico nativo permanece disponível.
- [x] Desktop/notebook possuem experiência aprovada.
- [x] Tablet permanece utilizável.
- [x] Mobile permite consultas/operações razoáveis.
- [x] Não há overflow horizontal descontrolado da página.
- [x] Tabela pode usar scroll horizontal contido quando necessário.
- [x] Teclado funciona.
- [x] Foco é visível.
- [x] Labels e erros continuam acessíveis.
- [x] Nenhuma informação depende só de cor.
- [x] Nenhuma informação depende só de hover.
- [x] Segurança nativa do Admin não foi enfraquecida.
- [x] Nenhuma PII foi adicionada a assets/logs/testes públicos.
- [x] Nenhum recurso da Entrega 7 foi antecipado.
- [x] Nenhum CRM/dashboard/Analytics administrativo foi criado.
- [x] Checkpoint visual A foi aprovado.
- [x] Checkpoint visual B foi aprovado.
- [x] Checkpoint visual C foi aprovado.
- [x] `python manage.py check` aprovado.
- [x] migration check aprovado e sem migration inesperada.
- [x] Ruff aprovado.
- [x] pytest aprovado.
- [x] `git diff --check` aprovado.
- [x] Revisão de segurança aprovada.
- [x] Documentação reconciliada.
- [x] Spec marcada `implemented` após os critérios obrigatórios.

## 45. Definição de pronto

A Entrega 6 está concluída quando o Django Admin existente continua funcional e seguro, mas passa a oferecer uma experiência administrativa reconhecível como Repage, clara e adequada ao uso cotidiano.

O resultado final deve comprovar identidade própria, login profissional, navegação clara, listagem de Leads ergonômica, detalhe organizado, criação manual consistente, responsividade suficiente, acessibilidade preservada, segurança nativa preservada, nenhuma regressão da 0005, nenhuma antecipação da 0007, aprovação visual humana, testes finais aprovados e documentação reconciliada.
