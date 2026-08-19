# 0010 — CI/CD, deploy, backups e observabilidade

- **Status:** approved
- **Estado operacional:** em execução — revisão de escopo após validação real de produção
- **Responsável:** Lukas Frick
- **Data original:** 17 de agosto de 2026
- **Revisão operacional:** 18 de agosto de 2026
- **Branch-base:** `main`
- **Entrega do roadmap:** 10 — CI/CD, deploy, backups e observabilidade
- **Spec predecessora:** `0009-seo-sitemap-and-prerender.md`
- **ADR relacionado:** `0001-vite-static-prerender.md` — `accepted`; `0002-postgresql-neon-production-provider.md` — `accepted`
- **Documentos relacionados:** `AGENTS.md`, `frontend/AGENTS.md`, `backend/AGENTS.md`, `docs/PRODUCT.md`, `docs/ARCHITECTURE.md`, `docs/ROADMAP.md`, `docs/operations/README.md`

## 1. Contexto

As Entregas 1–9 estão implementadas, validadas e integradas à `main`.

A Entrega 10 já materializou e validou grande parte da operação real da Repage:

- frontend React/TypeScript/Vite estático com prerender;
- backend Django 5.2 + DRF;
- PostgreSQL como engine estrutural;
- Neon como provedor PostgreSQL de produção;
- Django Admin Repage;
- Lead público persistente;
- `EmailDelivery`, idempotência e proteção por `RateLimitCounter`;
- `/health/` e `/health/ready/`;
- CI versionado;
- deploy por GitHub Actions para HomeHost;
- aplicação Python/Passenger em produção;
- SMTP real;
- logging estruturado;
- scripts de cron e backup;
- runbooks operacionais;
- domínio definitivo e HTTPS.

A validação real da produção revelou alguns pontos em que a primeira versão desta spec estava mais complexa do que a V1 necessita. Esta revisão substitui as decisões operacionais conflitantes anteriores sem reabrir arquitetura, produto ou entregas já concluídas.

Princípio desta revisão:

> manter segurança, recuperabilidade e profissionalismo, removendo polling, gates temporais e automações desproporcionais ao volume real da V1.

## 2. Objetivo

Concluir uma operação de produção em que:

- pull requests sejam validados automaticamente;
- `main` só chegue à produção após checks aprovados;
- frontend e backend sejam implantados de forma reproduzível;
- segredos permaneçam fora do repositório;
- migrations e static files sejam controlados;
- Passenger possa ser reiniciado de forma reproduzível;
- Leads sejam persistidos antes de qualquer dependência SMTP;
- e-mails sejam tentados imediatamente após a persistência;
- falha de e-mail nunca reverta um Lead;
- falhas de e-mail possam ser recuperadas manualmente pelo Admin;
- logs sejam acessíveis e sanitizados;
- disponibilidade básica seja monitorada sem manter o PostgreSQL acordado sem necessidade;
- o banco tenha backup diário, cópia externa e restore comprovado;
- exista procedimento de rollback;
- produção permaneça `noindex` até a Entrega 11.

## 3. Fronteira com a Entrega 11

A Entrega 10 deixa a Repage tecnicamente operacional no domínio definitivo, mas **não representa o lançamento comercial final**.

Continuam na Entrega 11:

- regressão final completa em produção;
- revisão final de conteúdo e mídias;
- revisão jurídica final quando aplicável;
- GA4 real/Measurement ID quando disponível;
- decisão efetiva de divulgação;
- ativação final da indexação pública;
- QA final completo de acessibilidade, responsividade e desempenho;
- revisão final de links/copy/mídias;
- Search Console;
- refinamento visual/comercial de templates de e-mail, se desejado;
- correção de bloqueadores de lançamento.

Durante toda a Entrega 10:

```text
VITE_SITE_INDEXING_ENABLED=false
```

## 4. Topologia de produção

```text
https://repage.com.br
└── frontend estático prerenderizado

https://www.repage.com.br
└── redirect permanente para https://repage.com.br

https://api.repage.com.br
├── /api/v1/leads/
├── /admin/
├── /health/
└── /health/ready/
```

Preservar:

- Registro.br como registrador;
- DNS delegado à HomeHost;
- frontend fora do Django;
- Django sob `api.repage.com.br`;
- nenhuma camada nova de proxy/API gateway;
- somente `development` e `production`, sem staging permanente na V1.

## 5. Estado real da HomeHost

Confirmado operacionalmente:

- plano HomeHost Python/Django Start;
- domínio e HTTPS funcionais;
- `api.repage.com.br` funcional;
- SSH/SFTP por chave;
- Python 3.12;
- app root `/home/re190924/repage_backend`;
- virtualenv `/home/re190924/virtualenv/repage_backend/3.12/`;
- Passenger/WSGI funcional;
- restart por `tmp/restart.txt`/mecanismo da Python App validado;
- static root público da API em `/home/re190924/api.repage.com.br/static`;
- Passenger stderr em `/home/re190924/repage_backend/stderr.log`;
- Raw Access disponível no cPanel;
- SMTP real em `mail.repage.com.br:465` com SSL implícito;
- diretório de backup `/home/re190924/backups/repage/postgresql` fora do webroot e restrito;
- toolchain PostgreSQL 18 privada disponível para `psql`, `pg_dump` e `pg_restore`.

O PostgreSQL nativo da HomeHost permanece inadequado para Django 5.2 e não é utilizado como banco estrutural da aplicação.

## 6. PostgreSQL/Neon — decisão vigente

PostgreSQL permanece obrigatório como engine estrutural e Neon permanece o provedor aprovado da V1.

Estado vigente de produção:

- projeto Repage;
- PostgreSQL 18;
- database `repage`;
- role dedicada `repage_app`;
- região AWS `eu-central-1` / Frankfurt;
- TLS obrigatório;
- runtime Django da V1 usando endpoint **direct**;
- migrations, backup e restore também usando endpoint **direct**.

A região anterior de São Paulo foi abandonada após medição real HomeHost → Neon demonstrar latência excessiva. Frankfurt apresentou latência significativamente menor e foi validada em produção.

O endpoint pooled não é necessário para a concorrência atual da V1. Pode ser reavaliado futuramente somente diante de pressão real de conexões.

Não:

- migrar para MySQL;
- fazer downgrade do Django;
- introduzir `DATABASE_URL` apenas por preferência;
- versionar connection string;
- tornar a aplicação dependente de recurso proprietário do Neon;
- contratar plano pago apenas para evitar cold start sem evidência de necessidade real.

Configuração continua por variáveis já existentes:

- `POSTGRES_DB`;
- `POSTGRES_USER`;
- `POSTGRES_PASSWORD`;
- `POSTGRES_HOST`;
- `POSTGRES_PORT`;
- `POSTGRES_DIRECT_HOST`;
- `POSTGRES_DIRECT_PORT`.

Nenhuma variável nova de banco é necessária nesta revisão.

## 7. Scale-to-zero e uso proporcional do Neon

A operação da V1 deve permitir que o compute gratuito do Neon suspenda quando não houver atividade real.

Evitar jobs de polling frequente que consultem PostgreSQL sem demanda.

Acordar o banco é aceitável quando houver:

- solicitação real de Lead;
- uso do Admin;
- deploy/smoke;
- backup diário;
- cleanup diário;
- diagnóstico manual;
- restore/atividade operacional explícita.

Não manter consulta a cada minuto ou a cada hora apenas para comprovar que o banco está disponível.

## 8. Django de produção e segurança

Preservar:

- `DJANGO_ENVIRONMENT=production`;
- `DJANGO_DEBUG=False`;
- secret key exclusiva;
- `DJANGO_ALLOWED_HOSTS=api.repage.com.br`;
- CORS restrito ao frontend real;
- CSRF origins explícitas;
- cookies seguros;
- `SESSION_COOKIE_SECURE=True`;
- `CSRF_COOKIE_SECURE=True`;
- `SESSION_COOKIE_HTTPONLY=True`;
- `SESSION_COOKIE_SAMESITE='Lax'`;
- `SECURE_SSL_REDIRECT=True`;
- `SECURE_CONTENT_TYPE_NOSNIFF=True`;
- `SECURE_REFERRER_POLICY` restritiva e compatível;
- `X_FRAME_OPTIONS='DENY'`.

O proxy real da HomeHost já foi validado e não exige confiança artificial em `X-Forwarded-Proto`.

Executar/revisar:

```bash
python manage.py check --deploy
```

HSTS longo/preload continua fora do gate da Entrega 10.

CSP agressiva não será introduzida apenas para marcar hardening adicional.

## 9. CI

Preservar o CI versionado e component-aware.

Frontend:

```bash
npm ci
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

Backend:

```bash
python manage.py check
python manage.py makemigrations --check --dry-run
ruff check .
pytest
```

Requisitos:

- PostgreSQL compatível no CI backend;
- `CI Gate` sempre presente;
- nenhuma secret exposta a PR;
- build de CI com indexação SAFE;
- Playwright Test do projeto como referência de E2E;
- permissões mínimas necessárias.

## 10. Deploy de produção

Preservar o deploy automatizado a partir de `main` após CI aprovado.

Requisitos:

- Environment `production`;
- SSH/SCP por chave;
- host key pinada;
- `StrictHostKeyChecking=yes`;
- concurrency de produção;
- SHA aprovado confirmado contra `origin/main`;
- mesmo SHA para frontend/backend;
- seleção de componentes quando segura;
- fallback/recovery completo quando o state não for confiável;
- frontend publica assets antes dos HTMLs;
- backend executa management de produção;
- migrations controladas;
- `collectstatic`;
- restart Passenger;
- health/readiness;
- smoke;
- state avançado somente após sucesso.

A estratégia seletiva/resiliente já recebeu deploy real após integração em `main`; manter o mecanismo e sua documentação, sem criar outra arquitetura de releases.

## 11. Smoke pós-deploy

Frontend:

- homepage 200;
- `/portfolio` 200;
- pelo menos um case 200;
- `/privacidade` 200;
- `/cookies` 200;
- `/sitemap.xml` 200;
- `/robots.txt` 200 e deny-by-default;
- rota inexistente retorna 404.

Backend:

- `/health/` 200;
- `/health/ready/` 200;
- `/admin/` responde sem detalhe interno.

O smoke automatizado não cria Lead real em todo deploy.

Um smoke funcional controlado do formulário é suficiente na validação final da entrega.

## 12. SMTP e fluxo de e-mail — decisão revisada

Produção usa Django SMTP nativo:

```text
EMAIL_FROM_ADDRESS=notificacoes@repage.com.br
EMAIL_INTERNAL_RECIPIENT=contato@repage.com.br
SMTP=mail.repage.com.br:465
EMAIL_USE_SSL=True
EMAIL_USE_TLS=False
```

SPF, DKIM, DMARC e PTR já foram verificados operacionalmente. Inbox placement/spam continua sendo questão de entregabilidade/reputação e não deve provocar alterações aleatórias de código nesta spec.

### Fluxo normal da V1

O envio normal **não depende de cron**.

Fluxo obrigatório:

```text
POST válido
→ validar proteção/idempotência
→ persistir Lead
→ persistir EmailDelivery
→ confirmar transação
→ tentar envio SMTP imediatamente
→ registrar sucesso/falha em EmailDelivery
→ responder ao cliente
```

Regras:

- persistência do Lead ocorre antes de SMTP;
- SMTP nunca participa da transação que cria o Lead;
- falha SMTP nunca reverte/exclui Lead;
- notificação interna e confirmação ao visitante são tentadas imediatamente após persistência;
- o formulário pode responder sucesso se o Lead foi persistido, mesmo que um e-mail falhe;
- erros SMTP continuam sanitizados;
- `Reply-To` da notificação interna continua apontando para o endereço do Lead quando aplicável.

### Recuperação de falha

A recuperação automática por polling foi removida da V1.

Falha deve ficar visível em `EmailDelivery` e pode ser recuperada com **reenvio manual protegido no Django Admin**.

O management command `process_email_retries` e wrappers já existentes podem permanecer no repositório como ferramenta operacional/manual se continuarem seguros, mas **não são cron permanente nem gate da V1**.

Não introduzir:

- Celery;
- Redis;
- fila;
- worker persistente;
- scheduler externo;
- SaaS adicional.

## 13. Cron — decisão vigente

Crons permanentes da V1:

### Cleanup de idempotência

Executar `cleanup_idempotency` uma vez ao dia.

Objetivo:

- remover somente registros expirados;
- não fazer polling frequente;
- não expor dados/segredos em stdout.

### Backup PostgreSQL

Executar a rotina de backup uma vez ao dia.

Sempre que possível, concentrar jobs diários em uma janela operacional próxima para reduzir despertares desnecessários do compute.

### Removido da agenda

`process_email_retries` **não deve possuir cron permanente**.

## 14. Logs de produção

Preservar logging Django mínimo com biblioteca padrão:

- JSON sanitizado;
- stdout/stderr compatível com Passenger;
- nível configurável;
- request ID;
- método;
- path sem query string;
- status;
- duração;
- eventos de e-mail limitados a códigos/IDs operacionais permitidos.

Nunca registrar:

- formulário integral;
- nome/e-mail/telefone integrais;
- senha/token/secret;
- cookies/sessões;
- Authorization;
- connection string;
- erro SMTP bruto;
- backup;
- log real no Git.

## 15. Observabilidade proporcional

Mínimo da V1:

- Passenger stderr acessível;
- Raw Access disponível;
- logs estruturados do Django;
- `/health/`;
- `/health/ready/`;
- smoke pós-deploy;
- monitor horário básico;
- `EmailDelivery` no Admin;
- backup/restore verificáveis.

Não adicionar Sentry, Datadog, New Relic ou plataforma paga apenas por preferência.

## 16. Monitor de disponibilidade — decisão revisada

O monitor horário deve verificar somente:

- `https://repage.com.br/`;
- `https://api.repage.com.br/health/`.

`/health/ready/` **não deve ser consultado pelo uptime horário**, porque acessa dependências críticas, incluindo PostgreSQL, e acordaria o Neon sem tráfego real.

Readiness continua obrigatório em:

- deploy;
- smoke pós-deploy;
- diagnóstico manual;
- validação operacional explícita.

O monitor:

- não usa secrets;
- não cria Lead;
- não usa Environment `production` se não necessário;
- pode rodar uma vez por hora;
- usa a notificação normal de falha do GitHub Actions.

## 17. Backups — política

A Repage não depende apenas do Backup Angel da HomeHost.

Backup PostgreSQL local:

- diretório fora do webroot;
- permissões restritas;
- `pg_dump` PostgreSQL 18;
- archive com timestamp;
- checksum;
- validação antes de promoção;
- rotação segura.

Política de retenção:

```text
até 7 backups diários locais
até 4 cópias semanais externas
```

Esses números são política operacional, **não um gate temporal que obrigue a Entrega 10 a ficar aberta por 7 dias ou 4 semanas**.

## 18. Prova necessária de backup para fechar a V1

Para fechar a Entrega 10 é obrigatório comprovar:

- cron diário definitivo configurado;
- primeiro backup diário real produzido pelo cron definitivo;
- arquivo fora do webroot;
- permissões restritas;
- checksum válido;
- lógica de rotação local testada;
- primeira cópia externa real;
- lógica de retenção externa testada;
- restore real usando backup válido em database temporário;
- inspeção básica do schema/dado controlado restaurado;
- remoção do database temporário ao fim.

Não é obrigatório esperar acumular sete ou quatro gerações reais antes de marcar a spec como `implemented`.

A observação contínua dessas gerações passa a ser manutenção operacional pós-lançamento.

## 19. Cópia externa

A cópia externa permanece obrigatória.

Princípios:

- destino sob controle do operador;
- armazenamento protegido/criptografado;
- não usar repositório GitHub;
- não usar pasta pública;
- não versionar path privado/credenciais;
- preferência por PULL iniciado da estação do operador via SSH/SCP/SFTP com host key validada.

A primeira cópia externa real é gate da Entrega 10.

## 20. Restore

Backup só é considerado operacionalmente confiável depois de restore real.

Executar uma vez antes do fechamento:

- escolher backup válido;
- validar checksum;
- restaurar em database temporário;
- não tocar no database ativo;
- inspecionar schema/resultado controlado;
- remover database temporário.

Depois do lançamento, restore trimestral ou antes de mudança relevante de infraestrutura é rotina operacional futura, não gate recorrente da V1.

## 21. Rollback

Preservar procedimento documentado para frontend e backend.

Frontend:

- restaurar somente arquivos gerenciados;
- usar archive/manifesto conhecido;
- validar rotas e smoke.

Backend:

- redeploy/restauração de código conhecido;
- dependências correspondentes;
- restart Passenger;
- health/readiness;
- smoke.

Banco:

- rollback de código não reverte migration automaticamente;
- não executar migration reversa automaticamente;
- restore de banco somente quando necessário e com impacto entendido.

Não é obrigatório provocar falha destrutiva artificial em produção apenas para comprovar o runbook.

## 22. Admin e formulário — refinamentos de fechamento permitidos

A validação real em produção revelou problemas de ergonomia diretamente ligados à operação. Eles podem ser corrigidos nesta entrega sem constituir redesign ou nova feature de produto.

### Django Admin

Antes do fechamento, corrigir:

- responsividade real em viewport estreita;
- paddings mobile;
- conteúdo que hoje é cortado à direita;
- tabela com scroll horizontal interno utilizável;
- evitar quebra desnecessária de nome/e-mail/células quando existe scroll horizontal;
- comportamento correto com sidebar aberta e fechada;
- detalhe de Lead e Email Delivery sem overflow indevido;
- preservar tema claro/escuro e correção do primeiro paint já implementada;
- permitir exclusão de Lead individual;
- permitir seleção e exclusão em massa de Leads;
- usar confirmação nativa/segura antes da exclusão;
- relações dependentes devem seguir o comportamento `CASCADE` já modelado;
- não criar painel React próprio.

A exclusão em massa é uma decisão operacional revisada: o administrador deve conseguir remover vários Leads selecionados quando necessário, com a confirmação do Django Admin.

### Formulário público

Antes do fechamento, corrigir:

- espaço vertical excessivo no status mobile;
- feedback de sucesso no mesmo bloco de ações do submit;
- `Enviando…` durante request;
- reset dos campos depois de sucesso;
- erro preservando dados para nova tentativa;
- mensagem de sucesso clara, com `Solicitação recebida.` visualmente destacada;
- texto restante informando confirmação por e-mail e verificação de Spam/Lixo eletrônico;
- sem toast, overlay ou novo padrão de interação desnecessário.

Esses refinamentos devem ser aprovados localmente antes de novo deploy.

## 23. Performance e cold start

A migração São Paulo → Frankfurt resolveu o gargalo de latência PostgreSQL identificado durante a Entrega 10.

Não continuar criando otimizações de banco apenas para reduzir milissegundos sem evidência.

Pode existir latência ocasional após suspensão do compute gratuito. Isso é aceitável para a V1 enquanto:

- requests normais permanecem funcionais;
- Admin continua utilizável;
- health/readiness passam;
- o atraso não constitui indisponibilidade real.

Não mascarar espera de backend com flash/loading artificial no Admin sem causa comprovada.

Escalar Neon para plano pago somente se uso real justificar.

## 24. Segurança e privacidade

Nunca versionar:

- `.env` real;
- SSH private key;
- senha cPanel/FTP;
- senha PostgreSQL;
- secret key Django;
- credenciais SMTP;
- cookies/sessões;
- backup;
- log real;
- export de banco;
- arquivo com PII.

Preservar:

- HTTPS;
- allowed hosts restritos;
- CORS restrito;
- cookies seguros;
- frame protection;
- nosniff;
- referrer policy;
- Admin somente HTTPS;
- backups fora do webroot;
- SSH host key pinning;
- logs sem PII/secrets.

## 25. HomeHost compartilhada

Continuar tratando a HomeHost como ambiente sem root.

Não presumir:

- `sudo`;
- root;
- systemd;
- Docker;
- daemon próprio;
- firewall global;
- processo persistente customizado.

Não fazer upgrade de plano sem evidência de saturação ou limitação incompatível.

## 26. Fases revisadas para concluir a Entrega 10

As fases históricas anteriores permanecem como histórico de implementação. A partir desta revisão, o fechamento segue estas fases objetivas.

### Fase A — alinhamento da spec

- reconciliar decisões desta revisão;
- não alterar toda a documentação ainda;
- manter spec `approved` até evidência final.

### Fase B — estabilização final em desenvolvimento

Implementar em uma única rodada:

- Admin responsivo;
- tabelas/overflow/nowrap;
- delete individual e em massa de Lead;
- correções finais de formulário;
- tentativa imediata de e-mail pós-persistência;
- remover dependência operacional do cron de retry;
- ajustar uptime para não chamar readiness.

Não fazer deploy durante a fase até os ajustes estarem consolidados.

### Fase C — validação local

Validar antes de commit/PR:

Admin:

- desktop largo;
- notebook;
- viewport mobile (~375–430 px);
- sidebar aberta e fechada;
- lista de Leads;
- detalhe de Lead;
- novo Lead manual;
- lista/detalhe de Email Delivery;
- Usuários e Grupos;
- busca;
- filtros;
- paginação;
- seleção simples e múltipla;
- delete individual;
- delete em massa;
- cancelamento da confirmação;
- tema claro/escuro;
- login;
- `Ver site`.

Formulário:

- desktop;
- mobile;
- validação inválida;
- estado `Enviando…`;
- sucesso;
- erro de API;
- reset após sucesso;
- mensagem sem espaço mobile excessivo.

Backend/e-mail:

- Lead persiste antes do SMTP;
- duas `EmailDelivery` persistem;
- envio imediato é tentado;
- SMTP bem-sucedido registra `sent`;
- falha SMTP não remove Lead;
- falha registra estado recuperável;
- reenvio manual funciona;
- nenhum polling é necessário para envio normal.

Executar também:

```bash
# frontend
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e

# backend
python manage.py check
python manage.py makemigrations --check --dry-run
ruff check .
pytest

git diff --check
```

Aprovação visual humana local é necessária para os refinamentos visuais. Teste automatizado não substitui inspeção visual.

### Fase D — um único PR e deploy final desta rodada

Depois da aprovação local:

```text
commit
→ push
→ PR
→ CI
→ merge
→ deploy
```

Em produção executar somente smoke e confirmação operacional, não nova descoberta visual extensa.

### Fase E — fechamento operacional

- confirmar Neon suspendendo quando ocioso;
- cleanup diário definitivo;
- uptime horário sem readiness;
- backup diário definitivo;
- primeiro backup real;
- primeira cópia externa;
- restore real;
- segurança final;
- secrets final;
- logs/monitor.

### Fase F — reconciliação documental

Somente depois da implementação/prova real:

- esta spec → `implemented`;
- `docs/specs/README.md`;
- `docs/ROADMAP.md` → Entrega 10 concluída / Entrega 11 próxima;
- `docs/ARCHITECTURE.md`;
- ADR 0002 apenas no que for necessário para refletir a região/topologia vigente sem inventar nova decisão de provider;
- `docs/operations/README.md`;
- runbooks reais;
- remover pendências obsoletas;
- atualizar AGENTS somente se surgiu regra duradoura nova.

## 27. Critérios de aceite revisados

### Infraestrutura e deploy

- [x] `main` pós-0009 usada como baseline.
- [x] HomeHost/Registro.br tratados como estado real.
- [x] SSH/SFTP real validado.
- [x] chave de deploy por SSH funcional.
- [x] host key pinada no fluxo de deploy.
- [x] Python 3.12 real validado.
- [x] `api.repage.com.br` funcional.
- [x] SSL funcional.
- [x] Python App/WSGI/Passenger funcional.
- [x] restart Passenger validado.
- [x] PostgreSQL/Neon validado por TLS.
- [x] database/role de produção dedicados.
- [x] região de produção migrada e validada em Frankfurt.
- [x] `STATIC_ROOT`/collectstatic funcionando.
- [x] settings de produção materializados.
- [x] CI frontend/backend/E2E materializado.
- [x] Environment `production` configurado.
- [x] deploy automatizado a partir de `main` funcionando.
- [x] deploy seletivo/resiliente recebeu execução real de produção.
- [x] health/readiness pós-deploy passam.
- [x] smoke pós-deploy passa.

### SMTP/e-mail

- [x] SMTP real `mail.repage.com.br:465` autenticado e criptografado.
- [x] remetente `notificacoes@repage.com.br`.
- [x] destinatário interno `contato@repage.com.br`.
- [x] SPF/DKIM/DMARC/PTR verificados.
- [ ] envio normal ocorre imediatamente depois da persistência.
- [ ] falha SMTP comprovadamente não reverte Lead.
- [x] reenvio manual protegido existe no Admin.
- [ ] cron de retry removido da operação permanente.

### Admin/formulário

- [ ] Admin responsivo sem corte lateral indevido.
- [ ] tabela usa scroll horizontal interno quando necessário.
- [ ] células principais não quebram desnecessariamente com scroll disponível.
- [ ] sidebar aberta/fechada preserva a tabela utilizável.
- [ ] delete individual de Lead funciona com confirmação.
- [ ] delete em massa de Leads funciona com confirmação.
- [ ] formulário mobile não cria espaço vertical excessivo no status.
- [ ] feedback de sucesso fica claro junto à ação de envio.
- [ ] campos são limpos depois de sucesso.
- [ ] erros preservam os campos para correção.

### Observabilidade/cron

- [x] Passenger stderr acessível.
- [x] logging Django mínimo implementado.
- [x] logs estruturados observados em produção.
- [x] logs não expõem payload integral/segredos.
- [ ] uptime horário verifica somente homepage + `/health/`.
- [ ] cleanup de idempotência diário definitivo ativo e validado.
- [ ] Neon consegue suspender quando não há atividade real.

### Backup/restore

- [ ] cron diário de backup definitivo ativo.
- [ ] primeiro backup diário real produzido pelo cron.
- [ ] backup fora do webroot e com permissão restrita.
- [ ] checksum real validado.
- [ ] rotação local testada para política de até 7 cópias.
- [ ] primeira cópia externa real concluída.
- [ ] retenção externa testada para política de até 4 cópias.
- [ ] restore real executado em database temporário.
- [ ] database temporário removido depois do teste.
- [ ] Backup Angel não é a única camada de recuperação.

### Segurança e fechamento

- [ ] `check --deploy` final revisado.
- [ ] nenhuma secret/backup/log real entrou no Git.
- [ ] produção continua `VITE_SITE_INDEXING_ENABLED=false`.
- [ ] nenhuma Entrega 11 foi antecipada indevidamente.
- [ ] runbooks reconciliados com o comportamento real.
- [ ] documentação final reconciliada.
- [ ] `git diff --check` aprovado no fechamento.
- [ ] spec alterada para `implemented` somente após evidência operacional obrigatória.

## 28. Bloqueios reais

Impedem fechar a Entrega 10:

- Neon não permanecer acessível por TLS/PostgreSQL compatível;
- deploy seguro/reproduzível deixar de funcionar;
- Python App/Passenger não suportar a aplicação;
- SSL da API falhar;
- SMTP não permitir tentativa criptografada;
- persistência do Lead depender de sucesso SMTP;
- health/readiness falharem após deploy;
- não existir backup externo real;
- restore real não ter sido comprovado;
- secrets/PII entrarem em código, logs versionados ou artefatos públicos.

Não são bloqueadores:

- ausência de cron automático de retry de e-mail;
- ausência de GA4 real;
- Search Console ainda não configurado;
- indexação global desligada;
- HSTS longo/preload ainda não ativado;
- ausência de plataforma externa de observabilidade;
- MFA do Django Admin ainda não implementado;
- template visual de e-mail ainda simples;
- mensagens eventualmente classificadas como Spam quando SPF/DKIM/DMARC estão válidos e a entrega técnica funciona;
- lançamento comercial ainda não realizado;
- não ter acumulado fisicamente 7 backups locais/4 externos antes do fechamento.

## 29. Fora de escopo geral

Não implementar nesta entrega:

- Kubernetes;
- Docker em produção;
- VPS;
- Nginx administrado pela Repage;
- Celery;
- Redis;
- fila;
- worker persistente;
- staging permanente;
- Sentry obrigatório;
- Datadog;
- New Relic;
- Cloudflare apenas por preferência;
- CDN nova;
- mudança de engine PostgreSQL;
- mudança para MySQL;
- novo provedor SMTP sem falha comprovada do atual;
- plano Neon pago sem necessidade real comprovada;
- redesign completo do Admin;
- painel administrativo React próprio.

## 30. Definição de pronto

A Entrega 10 está concluída quando a Repage possuir, com evidência real:

```text
PR
→ CI
→ merge em main
→ deploy controlado
→ frontend estático
→ Django/Passenger
→ migrations/collectstatic
→ health/readiness no deploy
→ smoke
→ Lead persistido antes do SMTP
→ envio imediato + recuperação manual
→ Admin operacional/responsivo
→ logs + uptime proporcional
→ cleanup diário
→ backup diário
→ cópia externa
→ restore comprovado
```

com procedimentos reproduzíveis, sem polling desnecessário, sem manter o Neon acordado artificialmente e sem exigir semanas de espera para comprovar políticas de retenção já testadas.

Ao final da Entrega 10, produção permanece tecnicamente operacional no domínio definitivo, protegida por indexação deny-by-default e ainda não é considerada lançamento comercial até a Entrega 11.
