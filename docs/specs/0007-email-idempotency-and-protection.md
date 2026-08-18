# 0007 — E-mails, idempotência e proteção

- **Status:** implemented
- **Responsável:** Lukas Frick
- **Data:** 15 de agosto de 2026
- **Branch-base:** `main`
- **Entrega do roadmap:** 7 — E-mails, idempotência e proteção
- **Specs predecessoras:** `0005-lead-intake-backend-and-form.md` e `0006-repage-admin-experience.md`
- **Documentos relacionados:** `AGENTS.md`, `backend/AGENTS.md`, `frontend/AGENTS.md`, `docs/PRODUCT.md`, `docs/ARCHITECTURE.md`, `docs/ROADMAP.md`

## 1. Contexto

As Entregas 1–6 estão implementadas, validadas e integradas à `main`.

A baseline atual já possui Django 5.2, Django REST Framework, PostgreSQL, `apps/core`, `apps/leads`, modelo `Lead`, API pública `POST /api/v1/leads/`, validação e normalização backend, request ID, health/readiness, formulário React persistente, cliente Fetch encapsulado e Django Admin com experiência Repage.

Hoje o fluxo público termina em:

`formulário → validação → API → Lead no PostgreSQL → 201`

Ainda não existem `EmailDelivery`, `IdempotencyRecord`, `Idempotency-Key`, fingerprint, deduplicação acidental, honeypot, tempo mínimo, throttling, envio de e-mail, retentativas ou reenvio administrativo.

A Entrega 7 materializa essas responsabilidades sem reconstruir as Entregas 5 e 6.

## 2. Objetivo

Tornar o fluxo público de Leads resiliente a resposta de rede ambígua, duplo clique, retry explícito, repetição idêntica acidental, falha de SMTP, indisponibilidade temporária de e-mail, automação trivial e abuso básico de frequência.

Ao final:

- cada tentativa pública válida utiliza uma chave de idempotência;
- retries da mesma tentativa não criam novo Lead;
- a mesma chave com payload diferente gera conflito;
- repetição idêntica acidental com nova chave possui janela curta de deduplicação;
- novo contato legítimo continua permitido;
- honeypot e tempo mínimo reduzem automação trivial;
- throttling limita abuso básico por IP e contato;
- Lead, entregas e idempotência são persistidos antes de SMTP;
- falha de qualquer e-mail não remove nem reverte o Lead;
- notificação interna e confirmação ao visitante possuem rastreabilidade;
- falhas podem ser retentadas;
- entregas com falha podem ser reenviadas explicitamente no Django Admin.

## 3. Princípios da entrega

### Persistência antes de integração

Lead e registros necessários devem estar comprometidos no PostgreSQL antes de qualquer tentativa de SMTP. SMTP nunca fica dentro da transação de criação.

### Sucesso do visitante

A conversão continua sendo Lead persistido. Falha de e-mail não transforma um Lead persistido em erro público.

### Idempotência antes de retry

Retry explícito reutiliza a chave da tentativa original. Nenhum retry automático é introduzido no frontend.

### Proteção proporcional

A V1 implementa proteção de aplicação contra abuso básico. Não pretende substituir WAF, proteção DDoS ou controles de infraestrutura.

### Minimização

Não duplicar PII sem necessidade. Fingerprints, cache e logs não armazenam formulário bruto.

## 4. Decisões congeladas das Entregas 5 e 6

Preservar Django, DRF, PostgreSQL, `apps/core`, `apps/leads`, `Lead`, API pública, `/admin/`, `RepageAdminSite`, autenticação Django, sessão, CSRF, permissões, criação manual, normalização, statuses e experiência administrativa aprovada.

Não reconstruir essas áreas.

## 5. Domínio `Lead` preservado

Não alterar semanticamente os campos atuais nem os cinco statuses:

- `new`;
- `in_progress`;
- `delivered`;
- `maintenance`;
- `archived`.

`source` continua `website` ou `manual`. `acquisition_source` continua restrito ao fluxo administrativo manual.

## 6. Escopo de e-mail

E-mails são criados somente para Leads recebidos pela API pública com `source=website`.

Criação manual no Django Admin não cria `EmailDelivery`, não envia e-mail e não participa de idempotência/proteção pública.

## 7. Modelo `EmailDelivery`

Adicionar em `apps/leads`.

Tipos:

- `internal_notification` — Notificação interna;
- `visitor_confirmation` — Confirmação ao visitante.

Status:

- `pending`;
- `sent`;
- `failed`.

Campos mínimos:

- `id`: UUID;
- `lead`: FK para `Lead`;
- `kind`;
- `status`;
- `attempts`;
- `next_attempt_at`;
- `last_attempt_at`;
- `last_error_code`;
- `sent_at`;
- `created_at`;
- `updated_at`.

Defaults:

- status `pending`;
- attempts `0`;
- `next_attempt_at` no momento atual;
- timestamps de tentativa/envio nulos.

Constraint única:

`(lead, kind)`

A relação deve permitir que uma exclusão futura legítima do Lead remova suas entregas relacionadas.

Não duplicar corpo, nome, e-mail, WhatsApp, mensagem ou credenciais em `EmailDelivery`.

## 8. Semântica de status da entrega

`pending`: criada e ainda sem tentativa concluída.

`sent`: envio aceito pelo backend de e-mail; `sent_at` preenchido e `next_attempt_at=null`.

`failed`: última tentativa falhou. Se ainda houver retry automático, `next_attempt_at` fica preenchido; se o limite terminou, fica nulo.

`attempts` conta apenas chamadas reais ao backend de e-mail.

## 9. Modelo `IdempotencyRecord`

Adicionar em `apps/leads`.

Campos:

- `key`: UUID único;
- `fingerprint`;
- `lead`: FK;
- `response_status`;
- `response_payload`;
- `created_at`;
- `expires_at`.

`response_payload` contém apenas a resposta pública segura, sem `request_id` e sem PII.

## 10. `Idempotency-Key`

Header obrigatório:

`Idempotency-Key: <uuid>`

Frontend gera UUID. Backend valida formato.

Chave ausente:
- `400`;
- `idempotency_key_required`.

Chave inválida:
- `400`;
- `idempotency_key_invalid`.

## 11. Expiração

TTL inicial de idempotência:

`24h`

Configuração:

`IDEMPOTENCY_TTL_SECONDS=86400`

Registro expirado não bloqueia nova tentativa.

Deve existir mecanismo de limpeza executável sem Celery/Redis; agendamento real fica para a Entrega 10.

## 12. Fingerprint

Usar representação canônica dos campos semânticos normalizados e HMAC-SHA256 com segredo server-side e purpose separation.

Incluir:

- name;
- email;
- whatsapp;
- project_type;
- business_name;
- message;
- privacy acknowledgement/version;
- source.

Excluir:

- `Idempotency-Key`;
- honeypot;
- timestamp;
- IP;
- request ID;
- campos administrativos.

Não usar hash simples sem segredo.

## 13. Replay e conflito

Mesma chave + mesmo fingerprint dentro do TTL:

- não cria Lead;
- não cria entregas;
- não envia e-mail;
- retorna a resposta segura registrada;
- usa request ID atual;
- HTTP `201`.

Mesma chave + fingerprint diferente:

- HTTP `409`;
- código `idempotency_conflict`;
- não cria/edita nada;
- não envia e-mail.

A unicidade da chave deve existir também no PostgreSQL para resolver corrida concorrente.

## 14. Duplicidade acidental com chave diferente

Janela inicial:

`5 minutos`

Configuração:

`LEAD_DUPLICATE_WINDOW_SECONDS=300`

Mesmo fingerprint com nova chave dentro da janela:

- reutiliza o Lead existente;
- registra a nova chave de forma segura;
- retorna `201`;
- não reenvia e-mails.

Fora da janela, a mesma pessoa pode criar novo Lead, sujeito aos limites de frequência.

A garantia forte de retry continua sendo `Idempotency-Key + constraint única`; a deduplicação por nova chave é best-effort e não promete distributed exactly-once.

## 15. Campos técnicos de proteção

A API passa a reconhecer dois campos write-only não persistidos no Lead:

- `company_website`;
- `form_started_at`.

Eles não entram no fingerprint, Admin ou logs.

## 16. Honeypot

`company_website` deve permanecer vazio.

Frontend:
- fora da ordem de tab;
- oculto de tecnologia assistiva;
- `autocomplete="off"`;
- invisível e sem alterar layout.

Backend, se preenchido:
- não persiste;
- retorna `400`;
- código `invalid_submission`;
- mensagem genérica.

## 17. Tempo mínimo

Frontend envia `form_started_at` desde a inicialização do formulário.

Default:

`LEAD_MIN_SUBMISSION_SECONDS=2`

Submissão anterior ao mínimo:
- não persiste;
- retorna `429`;
- código `submission_too_fast`;
- `Retry-After` quando calculável.

Timestamp ausente/inválido também não persiste.

É apenas barreira contra automação trivial.

## 18. Throttling

Valores iniciais configuráveis:

- IP: 5 tentativas / 10 min;
- IP: 20 tentativas / 24 h;
- e-mail normalizado: 3 / 30 min;
- telefone normalizado: 3 / 30 min.

A solicitação é limitada se qualquer janela aplicável for excedida.

Resposta:
- `429`;
- código `rate_limited`;
- mensagem segura;
- `Retry-After` quando possível.

## 19. Store de proteção

Não adicionar Redis/Memcached.

Usar o model PostgreSQL dedicado `RateLimitCounter`, com chave HMAC
purpose-separated, contador e expiração. A operação de incremento em produção
usa upsert atômico; a limpeza ocorre junto do comando diário de idempotência.

Não usar `LocMemCache` como mecanismo de proteção de produção.

## 20. Chaves de proteção e IP

Não colocar IP/e-mail/telefone em claro nas chaves do cache.

Usar HMAC purpose-separated.

Até validar a topologia real de proxy:
- usar `REMOTE_ADDR`;
- não confiar automaticamente em `X-Forwarded-For`;
- manter configuração equivalente a `NUM_PROXIES=0`.

IP não é persistido no Lead.

## 21. Falha da proteção

Falha do backend compartilhado de proteção não deve desabilitar silenciosamente throttling.

Para nova solicitação:
- log sanitizado;
- `503 Service Unavailable`;
- código `service_unavailable`.

Replay idempotente já persistido pode ser resolvido sem criar novo Lead quando seguro.

## 22. Health/readiness

`/health/` continua verificando somente processo.

`/health/ready/` verifica:
- PostgreSQL;
- cache necessário à proteção.

SMTP não participa da readiness e nenhum health envia e-mail.

## 23. Ordem do fluxo público

Para tentativa nova:

1. receber JSON;
2. validar campos técnicos básicos;
3. honeypot;
4. tempo mínimo;
5. validar chave;
6. canonicalizar/normalizar para fingerprint;
7. resolver chave já existente;
8. limitar IP;
9. validar payload completamente;
10. limitar e-mail/telefone normalizados;
11. detectar duplicidade curta;
12. abrir transação;
13. criar Lead;
14. criar duas EmailDelivery;
15. criar IdempotencyRecord;
16. commit;
17. tentar notificação interna;
18. tentar confirmação;
19. registrar resultados;
20. retornar.

Replay da mesma tentativa não incrementa contadores de criação nem reenvia e-mail.

A implementação pode ajustar micro-ordem para evitar validação duplicada desde que preserve essas garantias.

## 24. Transação

Uma transação atômica inclui:

- Lead;
- duas EmailDelivery;
- IdempotencyRecord.

Se falhar, rollback e nenhum e-mail é tentado.

SMTP ocorre somente após commit.

Não habilitar `ATOMIC_REQUESTS` para resolver a entrega.

## 25. Sucesso público

Preservar:

- HTTP `201`;
- `status=received`;
- mensagem já aprovada;
- request ID atual.

Significa Lead + registros persistidos, não entrega de e-mail.

Falha SMTP após commit continua retornando `201`.

## 26. Endereços lógicos aprovados

Todos os endereços operacionais devem vir de configuração de ambiente. O código não deve espalhar endereços por services, views, templates ou testes.

Remetente (`EMAIL_FROM_ADDRESS`):

Development inicial:

`EMAIL_FROM_ADDRESS=contatolukasfrick@gmail.com`

Production futura:

`EMAIL_FROM_ADDRESS=notificacoes@repage.com.br`

Destinatário interno (`EMAIL_INTERNAL_RECIPIENT`):

Development inicial:

`EMAIL_INTERNAL_RECIPIENT=contatolukasfrick@gmail.com`

Production futura:

`EMAIL_INTERNAL_RECIPIENT=contato@repage.com.br`

A troca entre development e production exige somente configuração do ambiente, sem alteração do código.

Não escolher provedor SMTP nesta spec.

## 27. Backend de e-mail por ambiente

Development/test:
`django.core.mail.backends.locmem.EmailBackend`

Não usar console backend para conteúdo com PII.

A configuração lógica de endereços para development não implica envio externo real durante testes.

Production:
backend SMTP nativo do Django, configurado por ambiente.

Configuração prevista:
- host;
- port;
- username;
- password;
- TLS ou SSL;
- timeout;
- from;
- recipient interno.

Segredos fora do Git.

## 28. Timeout e segurança SMTP

`EMAIL_TIMEOUT=5`

TLS/SSL não podem estar simultaneamente ativos.

Produção falha claramente diante de configuração contraditória/crítica ausente, sem testar conectividade durante import de settings.

## 29. Formato de e-mail

V1 usa `text/plain`.

Não há HTML nesta entrega.

## 30. Notificação interna

Tipo: `internal_notification`

Assunto:

`[Repage] Nova solicitação de orçamento`

From:
`EMAIL_FROM_ADDRESS` (em production, o valor planejado é `notificacoes@repage.com.br`)

To:
`EMAIL_INTERNAL_RECIPIENT` (em production, o valor planejado é `contato@repage.com.br`)

Reply-To:
e-mail validado atual do Lead.

Corpo inclui somente informação operacional necessária:
- nome;
- e-mail;
- WhatsApp;
- tipo;
- negócio quando informado;
- mensagem quando informada;
- origem técnica;
- data.

## 31. Confirmação ao visitante

Tipo: `visitor_confirmation`

Assunto:

`Recebemos sua solicitação | Repage`

From:
`EMAIL_FROM_ADDRESS` (em production, o valor planejado é `notificacoes@repage.com.br`)

To:
e-mail validado atual do Lead.

Texto proposto para aprovação junto desta spec:

```text
Olá, {nome}.

Recebemos sua solicitação e registramos seu contato com a Repage.
Obrigado por escrever.

Esta mensagem confirma apenas o recebimento da solicitação e não representa orçamento ou aceite do projeto.

Repage
Uma nova página para o seu negócio começa aqui.
```

Sem prazo, preço, aceite, marketing ou conteúdo da mensagem original.

## 32. Independência das entregas

Internal e visitor são processadas separadamente.

Falha de uma não impede tentativa da outra.

Combinações `sent/failed` independentes são válidas.

## 33. Sanitização

`last_error_code` armazena apenas categoria segura, como:

- `timeout`;
- `connection_error`;
- `authentication_error`;
- `recipient_refused`;
- `send_error`;
- `backend_error`.

Não armazenar erro bruto, traceback, corpo, credencial ou PII.

Logs podem conter request/lead/delivery IDs, tipo, status, tentativa, código, timestamp e duração; não PII/corpo/segredo.

## 34. Retry automático

Tentativas totais:

1. imediata;
2. ~15 min;
3. ~1 h;
4. ~6 h;
5. ~24 h.

Máximo automático: 5 tentativas.

Após falha:
- agenda próxima quando houver;
- após o limite, `next_attempt_at=null`.

Configuração deve permitir ajuste sem mudança estrutural.

## 35. Management command de retry

Criar comando dedicado, por exemplo:

`python manage.py process_email_retries`

Deve:
- buscar `pending`/`failed` devidas;
- aceitar `--limit`;
- processar lote finito;
- não abortar lote por falha individual;
- usar logs sanitizados.

Não criar daemon/loop infinito.

## 36. Agendamento

A 0007 implementa o mecanismo executável, mas NÃO configura cron, GitHub Action recorrente, Celery Beat ou scheduler.

A Entrega 10 agenda o comando conforme ambiente real.

Isso não bloqueia marcar a 0007 `implemented` se command e política forem testados deterministicamente.

## 37. Concorrência de entrega

Usar claim curto apoiado no PostgreSQL:

- lock/claim dentro de transação curta;
- lease temporário;
- fechar transação;
- SMTP fora dela;
- persistir resultado depois.

Lease referência: 5 minutos.

Se processo morrer antes de concluir, a entrega volta a ser elegível após lease.

Não manter transação durante rede.

## 38. Limite de exactly-once SMTP

Não alegar exactly-once no e-mail.

Existe risco residual raro se SMTP aceitar a mensagem e o processo falhar antes de persistir `sent`.

Minimizar com registro prévio, claim e retries controlados, sem adicionar fila externa.

## 39. Admin — EmailDelivery

Registrar no Django Admin Repage.

Permitir:
- inspeção;
- filtros por tipo/status;
- associação ao Lead;
- tentativas;
- próxima tentativa;
- último código sanitizado;
- sent_at.

Não permitir criação manual nem exclusão administrativa comum.

No detalhe do Lead, exibir entregas relacionadas readonly, preferencialmente via inline nativo.

Não registrar `IdempotencyRecord` no Admin por padrão.

## 40. Reenvio manual

Somente `failed`.

Não reenviar `sent` nem `pending`.

Exigir:
- autenticação;
- permissão adequada;
- ação explícita;
- confirmação antes do envio.

Reenvio:
- usa o mesmo serviço;
- incrementa attempts apenas se houver chamada real;
- não cria Lead;
- não cria nova delivery;
- não cria idempotência;
- não reseta attempts.

Mesmo após 5 automáticas, manual resend pode realizar uma tentativa explícita adicional; falhando, permanece terminal sem reiniciar a série automática.

Registrar ação no histórico nativo do Django Admin.

## 41. Frontend — idempotência

Gerar UUID em memória para a tentativa.

Adicionar header `Idempotency-Key`.

Não persistir em localStorage/sessionStorage/URL.

Sem retry automático.

Após erro de rede, 5xx recuperável, `503` ou `429`, nova ação explícita da mesma tentativa reutiliza a chave.

Resetar após `201` ou quando um conflito exigir uma nova tentativa lógica.

Replay `201` é tratado como sucesso normal.

## 42. Frontend — proteção

Adicionar honeypot sem mudar visual aprovado e timestamp de início.

Para `429`, `409` e `503`:
- preservar dados;
- mensagem humana;
- nenhuma repetição automática.

Honeypot não entra na tab order nem na árvore acessível.

## 43. Códigos públicos novos

- `idempotency_key_required` — 400;
- `idempotency_key_invalid` — 400;
- `idempotency_conflict` — 409;
- `invalid_submission` — 400;
- `submission_too_fast` — 429;
- `rate_limited` — 429;
- `service_unavailable` — 503.

Preservar `validation_error`, `privacy_policy_version_mismatch` e `server_error`.

## 44. Configuração

Adicionar settings/env para:

Idempotência:
- TTL;
- janela de duplicidade.

Proteção:
- tempo mínimo;
- limites/janelas;
- cache;
- proxy count.

E-mail:
- backend;
- host/port/user/password;
- TLS/SSL;
- timeout;
- from/recipient;
- retry delays;
- lease;
- batch size.

Endereços:
- `EMAIL_FROM_ADDRESS`;
- `EMAIL_INTERNAL_RECIPIENT`.

O `.env` real é o ponto operacional local para os valores e permanece fora do Git. Não deve conter credenciais versionadas. O `.env.example` documenta as variáveis com valores seguros ou exemplos adequados.

## 45. Migrations e store de proteção

Criar migrations para os dois novos models/constraints/indexes.

Não editar migrations da 0005.

O model `RateLimitCounter` é criado pela migration versionada; não há tabela de
cache separada.

## 46. Segurança/privacidade

Não registrar:
- payload;
- PII integral;
- corpo;
- credenciais;
- fingerprint input;
- idempotency key em log comum;
- IP em claro em logs.

Fingerprint não é retornado ao frontend/Admin.

IP é temporário para proteção e não vira perfil.

## 47. Consentimento e futuras entregas

Não implementar ConsentProvider, Analytics, Ads, tracking, políticas legais finais, CAPTCHA, SEO, prerender, CI/CD, deploy, cron de produção, SPF/DKIM/DMARC, backups ou monitoramento externo.

## 48. Dependências

Não adicionar Redis, Celery, RQ, Dramatiq, RabbitMQ, Kafka, SDK SMTP proprietário, biblioteca externa de rate limiting ou CAPTCHA sem requisito novo.

A entrega deve ser implementável com Django/DRF/PostgreSQL existentes.

## 49. Testes obrigatórios

Backend:
- models/defaults/constraints;
- idempotency required/invalid/replay/conflict/expiry;
- same key concurrency protected;
- duplicate window;
- honeypot;
- min time;
- IP/contact rate limits;
- Retry-After;
- cache failure/readiness;
- PII absent from cache keys/logs;
- two email deliveries;
- no delivery for manual Lead;
- persistence before email;
- independent send failures;
- 201 despite email failure;
- retry schedule/max;
- management command/claim/lease;
- Admin delivery visibility/re-send/permissions;
- 0005/0006 regression.

Frontend:
- key generation/header/reuse/reset;
- honeypot/timestamp;
- 409/429/503;
- no auto retry;
- data preservation;
- accessibility.

Playwright:
- relevant mocked states;
- honeypot excluded from keyboard navigation;
- recovery messages;
- success unchanged.

## 50. Smoke real

Com PostgreSQL real e o store de proteção migrado:

1. aplicar as migrations;
2. POST público;
3. Lead criado;
4. duas EmailDelivery;
5. IdempotencyRecord;
6. replay sem duplicação;
7. falha de email simulada com backend seguro;
8. management command de retry;
9. inspeção pelo Admin.

Dados fictícios apenas.

SMTP real não é obrigatório para fechar a 0007 se credenciais/provedor ainda não existem. Conectividade SMTP real, SPF, DKIM, DMARC e entregabilidade são Entrega 10.

## 51. Fases

### Fase 1 — Persistência e configuração
- models;
- migrations;
- constraints/indexes;
- settings;
- `RateLimitCounter`;
- env example;
- fingerprint primitives;
- testes focados.

### Fase 2 — Idempotência e proteção
- header;
- replay/conflict;
- duplicate window;
- honeypot;
- time minimum;
- throttling;
- readiness;
- frontend technical fields/key;
- tests.

### Fase 3 — E-mail e retry
- sending service;
- text templates;
- settings;
- initial attempts;
- sanitization;
- schedule;
- claim/lease;
- management command;
- tests.

### Fase 4 — Admin e integração
- EmailDelivery Admin;
- readonly inline;
- protected resend;
- frontend recovery final;
- real smoke;
- regression 0005/0006.

### Fase 5 — Fechamento
- complete validation;
- security/privacy review;
- diff;
- docs;
- status.

Uma fase por vez, seguindo o Playbook.

## 52. Validações finais

Backend:

```bash
cd backend
python manage.py check
python manage.py makemigrations --check --dry-run
ruff check .
pytest
```

Validar também o `RateLimitCounter` real no PostgreSQL local.

Frontend:

```bash
cd frontend
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

Raiz:

```bash
git diff --check
```

## 53. Pendências operacionais não bloqueantes

Ficam explicitamente para Entrega 10:

- provedor SMTP;
- credenciais SMTP reais;
- validação das caixas profissionais;
- SPF;
- DKIM;
- DMARC;
- cron real;
- quantidade real de proxies confiáveis;
- scheduler de produção.

Não afirmar que esses itens foram validados durante 0007.

## 54. Critérios de aceite

- [x] `main` pós-0006 usada como baseline.
- [x] Lead/domain 0005 preservado.
- [x] Admin 0006 preservado.
- [x] `EmailDelivery` implementado.
- [x] `IdempotencyRecord` implementado.
- [x] Migrations versionadas.
- [x] Duas deliveries para Lead público.
- [x] Nenhuma delivery para Lead manual.
- [x] Idempotency-Key obrigatório.
- [x] Frontend gera UUID por tentativa.
- [x] Mesma chave/payload não duplica Lead.
- [x] Replay não reenvia e-mail.
- [x] Mesma chave/payload diferente retorna 409.
- [x] Constraint protege concorrência da chave.
- [x] Fingerprint não armazena PII em claro.
- [x] Duplicate window funciona.
- [x] Novo contato legítimo continua possível.
- [x] Honeypot acessível/seguro.
- [x] Min time configurável.
- [x] Throttling IP burst/daily funciona.
- [x] Throttling e-mail/telefone funciona.
- [x] `429` recuperável.
- [x] `RateLimitCounter` compartilhado usado para produção.
- [x] IP/contatos não aparecem em cache keys em claro.
- [x] Readiness verifica o store de proteção (`RateLimitCounter`).
- [x] SMTP não derruba readiness.
- [x] Lead + deliveries + idempotency são atômicos.
- [x] SMTP ocorre depois do commit.
- [x] Internal notification implementada.
- [x] Visitor confirmation implementada.
- [x] Emails são text/plain.
- [x] Falha SMTP preserva Lead e retorna 201.
- [x] Erros/logs sanitizados.
- [x] Retry imediato/15m/1h/6h/24h implementado.
- [x] Máximo automático 5.
- [x] Management command funciona.
- [x] Claim/lease evita processamento paralelo normal.
- [x] Cron de produção não foi inventado.
- [x] EmailDelivery aparece no Admin.
- [x] Lead mostra deliveries readonly.
- [x] Reenvio manual explícito/protegido.
- [x] IdempotencyRecord não polui Admin.
- [x] Nenhum provedor hardcoded.
- [x] Nenhum Redis/Celery/fila/CAPTCHA.
- [x] Entrega 8 não antecipada.
- [x] Testes backend/frontend/E2E aprovados.
- [x] Smoke real PostgreSQL/cache aprovado.
- [x] `git diff --check` aprovado.
- [x] Documentação reconciliada.
- [x] Spec só vira `implemented` após todos os obrigatórios.

## 55. Documentação no fechamento

Ao concluir:
- spec → `implemented`;
- atualizar `docs/specs/README.md`;
- roadmap → Entrega 7 concluída / Entrega 8 próxima;
- `docs/README.md` se necessário;
- reconciliar Arquitetura com contratos finais;
- AGENTS apenas se houver regra duradoura nova;
- ADR apenas se surgir decisão estrutural fora do aprovado.

## 56. Definição de pronto

A 0007 está pronta quando o fluxo público comprova:

`formulário → proteção → idempotência → Lead + deliveries + record → commit → 201 seguro → processamento posterior de e-mails → retry/recovery`

e quando retry legítimo não duplica Lead, conflito é previsível, repetição acidental é reduzida, novo contato legítimo continua possível, abuso básico é limitado, Lead sobrevive à falha SMTP, retries são executáveis sem Celery/Redis, Admin permite recuperação explícita, Entregas 5/6 permanecem estáveis e nenhuma entrega futura foi antecipada.
