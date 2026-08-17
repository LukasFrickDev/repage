# 0010 — CI/CD, deploy, backups e observabilidade

- **Status:** approved
- **Responsável:** Lukas Frick
- **Data:** 17 de agosto de 2026
- **Branch-base:** `main`
- **Entrega do roadmap:** 10 — CI/CD, deploy, backups e observabilidade
- **Spec predecessora:** `0009-seo-sitemap-and-prerender.md`
- **ADR relacionado:** `0001-vite-static-prerender.md` — `accepted`; `0002-postgresql-neon-production-provider.md` — `accepted`
- **Documentos relacionados:** `AGENTS.md`, `frontend/AGENTS.md`, `backend/AGENTS.md`, `docs/PRODUCT.md`, `docs/ARCHITECTURE.md`, `docs/ROADMAP.md`, `docs/operations/README.md`

## 1. Contexto

As Entregas 1–9 estão implementadas, validadas e integradas à `main`.

A baseline atual possui:

- frontend React/TypeScript/Vite estático;
- prerender build-time com HTML específico por rota;
- `hydrateRoot` no cliente;
- sitemap, robots e metadata derivados;
- indexação deny-by-default via `VITE_SITE_INDEXING_ENABLED`;
- backend Django 5.2 + DRF;
- PostgreSQL como banco aprovado;
- Django Admin Repage;
- Lead público persistente;
- idempotência, proteção e DatabaseCache/PostgreSQL;
- e-mails persistidos e retentativas executáveis;
- `process_email_retries`;
- `cleanup_idempotency`;
- `/health/`;
- `/health/ready/`;
- consentimento e Analytics condicionado;
- CI versionado em `.github/workflows/ci.yml` e fundação de CD em
  `.github/workflows/deploy.yml`;
- runbook de deploy materializado, sem execução end-to-end após merge em `main`.

A Entrega 10 transforma essa aplicação já pronta em uma operação de produção reproduzível, verificável e recuperável.

## 2. Estado da hospedagem

### Confirmado pelo projeto/operador

- hospedagem contratada na HomeHost, plano Python/Django Start;
- domínio `repage.com.br` registrado no Registro.br;
- DNS delegado para a HomeHost;
- `https://repage.com.br` já resolve na hospedagem e possui HTTPS funcional;
- contas `contato@repage.com.br` e `notificacoes@repage.com.br` já foram criadas;
- registros SPF, DKIM, DMARC e PTR foram verificados no painel;
- dados de FTP foram recebidos.

Esses fatos deixam de ser tratados como hipóteses genéricas na documentação.

### Confirmado operacionalmente na conta

- SSH externo e SFTP por chave funcionais em `h66.servidorhh.com`, porta `64413`, usuário `re190924`;
- home `/home/re190924`;
- Python `3.12.13` e `Setup Python App` funcionais;
- app root `/home/re190924/repage_backend`;
- virtualenv `/home/re190924/virtualenv/repage_backend/3.12/`;
- Passenger/WSGI funcional e restart pelo cPanel validado;
- `https://api.repage.com.br/` chegando corretamente à aplicação WSGI;
- HTTPS da API e redirecionamento HTTP → HTTPS permanente;
- PostgreSQL nativo da HomeHost identificado como `13.23`, incompatível com Django 5.2;
- conexão HomeHost → Neon por TLS;
- toolchain cliente PostgreSQL 18.4 privada em `/home/re190924/tools/postgresql-18/`, com `psql`, `pg_dump` e `pg_restore`;
- `psql`, `pg_dump` e restore controlado validados contra o Neon;
- cron do cPanel executado em teste real e removido ao final;
- SMTP real em `mail.repage.com.br:465` com SSL/TLS e autenticação;
- Passenger stderr em `/home/re190924/repage_backend/stderr.log`;
- Raw Access do cPanel disponível para apex/API e arquivamento habilitado;
- Force HTTPS Redirect no apex e na API;
- redirecionamento `www.repage.com.br` → `https://repage.com.br` validado em HTTP e HTTPS, preservando path;
- diretório de backup `/home/re190924/backups/repage/postgresql` com permissão `700`;
- quota de 51.200 MB, com uso observado de aproximadamente 319 MB.

Esses fatos orientam a implementação, mas não equivalem à implementação dos
workflows, automações ou runbooks desta spec.

## 3. Capacidades públicas atuais da HomeHost consideradas

A documentação pública da HomeHost para hospedagem Python informa suporte a:

- cPanel;
- Python 3.10, 3.11 e 3.12;
- Django 5;
- aplicações Python;
- FTP/SSH;
- PostgreSQL;
- WSGI;
- certificado SSL;
- Backup Angel.

O tutorial Django da HomeHost usa `Setup Python App`, virtualenv, startup WSGI, Passenger log e restart da aplicação.

A existência pública da funcionalidade não substitui a validação na conta contratada.

## 4. Objetivo

Criar um processo de produção em que:

- pull requests são validados automaticamente;
- `main` só chega à produção após checks aprovados;
- frontend e backend podem ser implantados por GitHub Actions;
- segredos não vivem no repositório;
- produção usa configuração explícita e segura;
- migrations são controladas;
- Passenger pode ser reiniciado de forma reproduzível;
- cron processa retries e limpezas;
- SMTP real é validado;
- health/readiness são usados no deploy;
- logs são acessíveis e sanitizados;
- banco possui backup periódico e cópia externa;
- existe teste real de restauração;
- rollback possui procedimento documentado;
- disponibilidade básica é verificada continuamente sem adicionar uma plataforma paga obrigatória.

## 5. Fronteira com a Entrega 11

A Entrega 10 coloca a infraestrutura e o site no domínio real, mas **não representa o lançamento comercial final**.

A Entrega 11 continua responsável por:

- regressão final completa em produção;
- revisão final de conteúdo e mídias;
- revisão jurídica final quando aplicável;
- GA4 real/Measurement ID quando disponível;
- decisão efetiva de divulgação;
- ativação final da indexação pública;
- QA final de acessibilidade, responsividade e desempenho;
- correção de bloqueadores de lançamento.

Durante a Entrega 10, produção deve permanecer com indexação global **desabilitada**.

A Entrega 11 é o gate que altera a configuração para indexável e dispara novo deploy de lançamento.

## 6. Sem staging permanente

Preservar a arquitetura:

- `development`;
- `production`.

Não criar staging permanente na V1.

A própria produção, ainda deny-by-default para SEO e sem divulgação, é usada para validar infraestrutura durante a Entrega 10.

## 7. Topologia final a preparar

```text
https://repage.com.br
└── frontend estático prerenderizado

https://www.repage.com.br
└── redirecionamento permanente para https://repage.com.br

https://api.repage.com.br
├── /api/v1/leads/
├── /admin/
├── /health/
└── /health/ready/
```

Não colocar Django sob `/api` do domínio principal.

Não introduzir proxy/API gateway novo.

## 8. Domínio e DNS

Preservar:

- domínio canônico `https://repage.com.br`;
- Registro.br como registrador;
- DNS atualmente delegado à HomeHost.

Na Entrega 10, versionar a configuração definitiva de redirects e validar os
registros efetivos. O redirect atual de `http://www` pode passar por dois 301
por sobreposição entre Force HTTPS e a regra de hostname; isso deve ser
refinado na implementação versionada.

## 9. HTTPS e SSL

HTTPS funcional existe no domínio principal e em `api.repage.com.br`.

A Entrega 10 deve versionar a configuração definitiva, validar a cadeia e
confirmar que o Django reconhece a requisição como segura. Somente configurar
`SECURE_PROXY_SSL_HEADER` se o comportamento real do proxy da HomeHost for
confirmado e confiável.

Não confiar cegamente em `X-Forwarded-Proto`.

HSTS permanece progressivo: não habilitar preload nem prazo anual antes da estabilização e QA final.

## 10. Python de produção

Versão alvo:

```text
Python 3.12
```

Motivos:

- já compatível com a aplicação;
- suportado por Django 5.2;
- publicamente oferecido pela HomeHost Python;
- reduz diferença em relação ao desenvolvimento atual.

Se Python 3.12 não estiver disponível na conta real, parar e avaliar a versão disponível antes de mudar a arquitetura.

## 11. Atualização de segurança do Django

A baseline atual fixa:

```text
Django==5.2.6
```

Antes de produção, atualizar somente a linha de patch do Django 5.2 para:

```text
Django==5.2.17
```

ou patch 5.2 mais recente oficialmente disponível no momento exato da implementação, após confirmar release oficial e compatibilidade.

Não migrar para Django 6 nesta entrega.

Não atualizar dependências não relacionadas por conveniência.

A atualização exige:

- `manage.py check`;
- migration check;
- Ruff;
- pytest completo;
- smoke do Admin/API/e-mail.

## 12. PostgreSQL de produção

PostgreSQL permanece obrigatório como engine estrutural. O PostgreSQL nativo
da HomeHost é `13.23` e não é compatível com Django 5.2; portanto, a produção
utilizará Neon, conforme o ADR 0002:

```text
Django/HomeHost → PostgreSQL/Neon
```

Estado aprovado do Neon:

- projeto Repage;
- branch `production`;
- região AWS South America East 1 / São Paulo;
- PostgreSQL 18;
- database `repage`;
- role/owner `repage_app`.

Não fazer downgrade do Django nem migrar para MySQL. A aplicação não deve
depender de recursos específicos do Neon, preservando a portabilidade futura
para outro PostgreSQL compatível.

## 13. Banco de produção

O banco e a role dedicados já estão definidos no Neon para a produção.

Princípios:

- credencial exclusiva;
- senha forte;
- menor exposição possível;
- não usar usuário administrativo global da hospedagem;
- não versionar connection string;
- conexão com o Neon usa TLS.

Configuração continua por:

- `POSTGRES_DB`;
- `POSTGRES_USER`;
- `POSTGRES_PASSWORD`;
- `POSTGRES_HOST`;
- `POSTGRES_PORT`.

Não introduzir `DATABASE_URL` apenas por preferência e não versionar a
connection string.

## 14. DatabaseCache

Produção deve criar e validar:

```text
repage_lead_protection_cache
```

Usar o comando oficial existente do Django:

```bash
python manage.py createcachetable
```

Readiness deve continuar verificando PostgreSQL e o cache de proteção.

## 15. Static files do Django Admin

Adicionar/configurar `STATIC_ROOT` apropriado para produção.

O document root público de `api.repage.com.br` foi validado como
`/home/re190924/api.repage.com.br`; arquivos colocados ali são servidos pelo
LiteSpeed. `/home/re190924/repage_backend/public` não é o document root desse
acesso. O destino real planejado para `collectstatic` é
`/home/re190924/api.repage.com.br/static`, recebido por variável de ambiente.

Preferir configuração por ambiente quando o caminho absoluto depender da conta.

Deploy executa:

```bash
python manage.py collectstatic --noinput
```

Não servir o frontend React por Django.

## 16. Configuração de produção do Django

Preservar fail-fast de secrets e hosts.

Produção deve usar no mínimo:

- `DJANGO_ENVIRONMENT=production`;
- `DJANGO_DEBUG=False`;
- secret key exclusiva;
- `DJANGO_ALLOWED_HOSTS=api.repage.com.br`;
- CORS restrito ao domínio frontend real;
- CSRF origins coerentes;
- PostgreSQL real;
- SMTP real;
- endereços profissionais;
- privacy policy version vigente;
- configurações de proteção já aprovadas.

A Entrega 10 deve materializar também as configurações de segurança de cookies/HTTPS que hoje ainda não estão explícitas em `settings.py`.

## 17. Segurança Django em produção

Depois de validar HTTPS/proxy, configurar de forma explícita e testada:

- `SESSION_COOKIE_SECURE=True`;
- `CSRF_COOKIE_SECURE=True`;
- `SESSION_COOKIE_HTTPONLY=True`;
- `SESSION_COOKIE_SAMESITE='Lax'`;
- `SECURE_SSL_REDIRECT=True` quando compatível com o proxy real;
- `SECURE_CONTENT_TYPE_NOSNIFF=True`;
- `SECURE_REFERRER_POLICY` restritiva e compatível;
- `X_FRAME_OPTIONS='DENY'`;
- hosts/origins explícitos.

O probe WSGI real confirmou `wsgi.url_scheme=https`, `HTTPS=on`, porta 443 e
nenhum `X-Forwarded-Proto`/`X-Forwarded-SSL`. Portanto, a aplicação não deve
configurar `SECURE_PROXY_SSL_HEADER` nem confiar nesses headers; `SECURE_SSL_REDIRECT=True`
é compatível com o comportamento comprovado.

Executar:

```bash
python manage.py check --deploy
```

Warnings restantes precisam ser explicados individualmente; não silenciar checks apenas para obter saída limpa.

HSTS longo/preload permanece para após estabilização, não é habilitado cegamente nesta spec.

## 18. Headers do frontend estático

Configurar no mecanismo real suportado pela HomeHost/LiteSpeed/cPanel, preferencialmente `.htaccess` versionado quando comprovadamente aplicável:

- HTTPS/apex canonical redirect quando não fornecido pelo painel;
- `ErrorDocument 404 /404.html`;
- `X-Content-Type-Options: nosniff`;
- `Referrer-Policy`;
- `Permissions-Policy` mínima;
- proteção contra framing.

Não criar CSP agressiva sem validar:

- GA4 condicionado;
- Styled Components;
- mídias;
- navegação.

CSP continua evolutiva e só deve ser aplicada em enforcement se os testes reais passarem sem regressão.

## 19. GitHub Actions — princípio

GitHub continua sendo fonte oficial de código e o mecanismo aprovado de CI/deploy.

A Entrega 10 deve criar workflows versionados.

O workflow de deploy foi materializado em `.github/workflows/deploy.yml` com
`workflow_run` do CI bem-sucedido na `main`, aceitando eventos `push` e
`workflow_dispatch` do próprio CI. Redeploy manual começa pelo
`workflow_dispatch` do CI na `main`; `deploy.yml` não possui caminho manual
direto. O deploy também confirma que o SHA aprovado continua sendo o HEAD de
`origin/main`. A execução real end-to-end permanece pendente.

O workflow `.github/workflows/ci.yml` foi materializado nesta Fase 2 com jobs
independentes de frontend e backend. A validação definitiva ainda depende da
execução real no GitHub.

Usar actions oficiais sempre que possível e shell/OpenSSH para deploy.

Não introduzir action de terceiro para SSH/SFTP quando as ferramentas nativas do runner resolverem.

## 20. GitHub Environment `production`

Criar Environment:

```text
production
```

Restringir deploy à `main`.

Separar:

### Variables públicas/operacionais

Exemplos:

- host público;
- porta SSH;
- usuário SSH quando não sensível;
- caminhos remotos;
- `VITE_API_BASE_URL=https://api.repage.com.br`;
- `VITE_SITE_INDEXING_ENABLED=false` durante Entrega 10;
- `VITE_GA_MEASUREMENT_ID` quando existir;
- versão de Política vigente.

### Secrets

Exemplos:

- private key de deploy;
- dados sensíveis necessários ao deploy;
- fingerprint/known hosts quando tratado como secret operacional;
- qualquer token futuro realmente necessário.

Segredos da aplicação Django devem preferencialmente permanecer configurados no ambiente da aplicação HomeHost, não ser copiados para o workflow quando o deploy não precisa lê-los.

## 21. SSH de deploy

Antes de automatizar:

- solicitar/validar SSH na HomeHost se necessário;
- confirmar host e porta reais;
- confirmar usuário;
- gerar par de chaves exclusivo para GitHub Actions;
- instalar somente a chave pública no servidor;
- guardar private key no Environment `production`;
- registrar e fixar host key real;
- nunca usar `StrictHostKeyChecking=no`.

A documentação HomeHost indica que SSH em hospedagem pode precisar de habilitação prévia e usa porta não padrão em parte da infraestrutura. O valor real da conta é a fonte final.

## 22. CI automático

Criar workflow para:

- `pull_request` para `main`;
- `push` em `main`;
- `workflow_dispatch` quando útil.

CI deve possuir pelo menos jobs independentes de frontend e backend.

Permissões padrão do workflow:

```text
contents: read
```

Elevar permissões somente quando necessário.

## 23. CI frontend

Ambiente:

- Node 24;
- instalação via `npm ci`.

Executar:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

Build de PR/CI usa indexação segura:

```text
VITE_SITE_INDEXING_ENABLED=false
```

Não colocar Measurement ID real em PR quando não for necessário.

Playwright deve usar a configuração do projeto, não MCP.

## 24. CI backend

Ambiente:

- Python 3.12;
- PostgreSQL service compatível;
- dependências fixadas.

Executar:

```bash
python manage.py check
python manage.py makemigrations --check --dry-run
ruff check .
pytest
```

Validar também o patch Django atualizado antes do primeiro deploy.

Não usar SQLite para simplificar CI.

## 25. CI documentação

Validar proporcionalmente:

- arquivos obrigatórios;
- caminhos de specs/ADR/runbooks;
- links internos que a ferramenta escolhida consiga validar sem acesso externo instável;
- ausência de arquivo/documento obsoleto quando houver regra vigente.

Não adicionar stack pesada de documentação só para esta checagem.

## 26. Deploy automático

Após a infraestrutura estar validada, o deploy de produção deve ocorrer por GitHub Actions em `push` aprovado para `main`, depois dos jobs de CI.

Também permitir `workflow_dispatch` em `main` para redeploy controlado.

Usar:

- Environment `production`;
- concurrency específica de produção;
- nunca dois deploys simultâneos;
- mesmo SHA como referência de frontend/backend.

Não deployar feature branch em produção.

## 27. Artefato frontend de produção

Build do deploy usa:

```text
VITE_API_BASE_URL=https://api.repage.com.br
VITE_SITE_INDEXING_ENABLED=false
```

durante toda a Entrega 10.

A variável de GA permanece vazia se nenhum Measurement ID real existir.

`npm run build` continua responsável por:

- client build;
- prerender;
- sitemap;
- robots;
- validação fail-fast.

## 28. Estratégia de publicação do frontend

Preservar invariantes da Arquitetura:

1. validar `dist`;
2. transferir assets/versionados antes do HTML;
3. substituir HTML por último;
4. preservar `.htaccess`/configuração operacional aplicável;
5. não limpar `public_html` indiscriminadamente;
6. validar rotas físicas prerenderizadas;
7. validar `404.html`;
8. smoke após publicação.

O pacote mantém manifesto de arquivos gerenciados. A publicação remove apenas
entradas do manifesto anterior que não existem no novo; arquivos externos
desconhecidos do document root permanecem. O manifesto e archive anteriores
formam o rollback inicial, sem arquitetura de releases ou symlinks.

SSH/SFTP por chave já foram validados na conta. A implementação usa
OpenSSH/SCP/tar e manifestos de arquivos gerenciados; o workflow aborta se o
SHA aprovado não for o HEAD atual de `origin/main`.

Preferir OpenSSH/SCP/tar ou ferramenta nativa equivalente, sem action externa desnecessária.

## 29. Backend — bootstrap manual único

O primeiro bootstrap da aplicação Django pode exigir cPanel e não precisa ser forçado pelo GitHub Actions.

Runbook deve documentar:

- criação de `api.repage.com.br`;
- SSL;
- `Setup Python App`;
- Python 3.12;
- app root;
- startup file WSGI;
- virtualenv;
- Passenger log;
- env vars;
- banco PostgreSQL;
- cache table;
- migrations;
- static root/collectstatic;
- conta administrativa inicial;
- restart;
- health/readiness.

Depois do bootstrap, deploys normais devem ser automatizados.

## 30. Deploy backend

A cada deploy:

1. preparar/transferir código do SHA aprovado;
2. ativar virtualenv;
3. instalar dependências fixadas;
4. validar configuração;
5. criar backup pré-migration quando houver risco de schema;
6. executar migrations;
7. executar `collectstatic`;
8. reiniciar Passenger;
9. verificar `/health/`;
10. verificar `/health/ready/`;
11. executar smoke funcional seguro;
12. inspecionar logs diante de falha.

Não manter `.env` dentro do repositório ou pacote de deploy.

O resultado JSON do `cloudlinux-selector --json` é validado antes do restart:
`result` deve ser `success`, o campo Base64 deve decodificar para um resultado
válido e o `returncode` interno deve ser `0`.

## 31. Migrations

Deploy falha imediatamente se migration falhar.

Antes de migration potencialmente destrutiva:

- revisar migration;
- backup;
- avaliar lock/reversibilidade;
- documentar recuperação.

Rollback de código não reverte banco automaticamente.

Não usar `migrate --fake` como procedimento comum.

## 32. Restart do Passenger

O restart pelo cPanel já foi validado na conta HomeHost. O deploy deve
documentar e automatizar esse mecanismo quando possível; não inventar comando
root/systemctl em hospedagem compartilhada.

Prioridade:

1. comando/arquivo oficialmente aceito pela aplicação cPanel quando automatizável;
2. restart pelo mecanismo do `Setup Python App` no bootstrap/recuperação.

## 33. SMTP de produção

Produção usa o backend SMTP nativo do Django.

Configuração lógica:

```text
EMAIL_FROM_ADDRESS=notificacoes@repage.com.br
EMAIL_INTERNAL_RECIPIENT=contato@repage.com.br
```

Servidor SMTP real validado:

- `mail.repage.com.br`;
- porta `465`;
- SSL implícito (`EMAIL_USE_SSL=True` e `EMAIL_USE_TLS=False`);
- autenticação obrigatória e funcional.

Não ativar simultaneamente TLS e SSL.

## 34. Validação SMTP

Essa configuração já foi validada com envio real controlado de
`notificacoes@repage.com.br` para `contato@repage.com.br`. A implementação ainda
deve:

- enviar teste controlado do Django;
- validar autenticação e TLS/SSL;
- validar notificação interna;
- validar confirmação ao visitante usando endereço controlado;
- validar `Reply-To`;
- validar falha/retry de forma segura;
- confirmar que logs não expõem credenciais ou PII.

Não usar dados de cliente real.

## 35. SPF, DKIM, DMARC e PTR

Já foram verificados operacionalmente no painel durante a preparação da hospedagem.

Na Entrega 10:

- registrar esse estado no runbook;
- revalidar depois que as caixas SMTP reais estiverem em uso;
- não alterar política DMARC para `quarantine`/`reject` sem evidência de entrega estável.

## 36. Cron

 A execução real temporária do cron do cPanel já foi validada e a tarefa foi
 removida ao final do teste. A implementação deve criar as tarefas definitivas
 e registrar seus comandos no runbook.

Configurar pelo menos:

### Retry de e-mail

Executar `process_email_retries` em frequência compatível com a política de retries.

Referência:

```text
a cada 15 minutos
```

Se a conta impor frequência mínima diferente, usar a menor frequência permitida que preserve comportamento aceitável e documentar.

### Limpeza de idempotência

Executar:

```text
cleanup_idempotency
```

uma vez ao dia.

Na Fase 4, os dois jobs foram materializados em wrappers versionados e
allowlisted que chamam `cloudlinux-selector`, validam o `returncode` interno
com o parser existente e não imprimem stdout/stderr bruto. Os horários finais
documentados são `*/15 * * * *` para retry e `17 3 * * *` para cleanup, na hora
local do servidor (`America/Sao_Paulo`, UTC-03:00). A ativação no cPanel ainda
depende de implantação real.

### Backup PostgreSQL

Executar rotina diária definida na seção de backups.

Todos os comandos cron devem:

- ativar virtualenv/caminho correto;
- usar cwd correto;
- não imprimir segredos;
- registrar somente saída operacional sanitizada;
- ser testados manualmente antes de agendar.

## 37. Logs de produção

A Entrega 10 deve configurar logging mínimo com biblioteca padrão, sem nova plataforma obrigatória.

Requisitos:

- saída para stdout/stderr compatível com Passenger log;
- nível configurável por ambiente;
- request/application errors úteis;
- eventos operacionais de deploy/cron quando aplicável;
- sem formulário integral;
- sem email/telefone integral;
- sem secret;
- sem SMTP raw error;
- sem traceback para visitante.

Não adicionar Sentry apenas por preferência.

O logging Django foi materializado com biblioteca padrão: formatter JSON
sanitizado em stdout, nível configurável por `DJANGO_LOG_LEVEL`, request ID,
método, path sem query string, status e duração monotônica no evento
`request_completed`. O contexto do request ID é limpo ao final da request.
Eventos de e-mail existentes continuam limitados a códigos e identificadores
operacionais permitidos.

## 38. Passenger logs

O Passenger stderr já está disponível em
`/home/re190924/repage_backend/stderr.log`. O Raw Access do cPanel também está
disponível para apex e API, com arquivamento de raw logs para a home habilitado.
O runbook deve documentar consulta, correlação e limpeza sem versionar logs.

Não versionar logs nem registrar formulário integral, PII ou segredos.

## 39. Observabilidade proporcional

Mínimo da V1:

- logs acessíveis;
- `/health/`;
- `/health/ready/`;
- smoke pós-deploy;
- monitor de disponibilidade;
- inspeção de EmailDelivery no Admin;
- backup/restore verificados.

Não adicionar plataforma paga obrigatória.

## 40. Monitor de disponibilidade

Criar workflow GitHub Actions agendado, sem segredos de aplicação, para verificar periodicamente:

- `https://repage.com.br/`;
- `https://api.repage.com.br/health/`;
- `https://api.repage.com.br/health/ready/`.

Referência inicial:

```text
1 vez por hora
```

Falha do workflow é evidência de indisponibilidade e deve gerar a notificação normal do GitHub para o operador.

Não fazer POST de Lead a cada monitoramento.

O workflow `.github/workflows/uptime.yml` foi materializado com
`17 * * * *`, `workflow_dispatch`, `contents: read`, sem secrets e sem
Environment `production`. A execução horária real permanece pendente até o
workflow estar na default branch/main.

## 41. Smoke pós-deploy

Depois de cada deploy:

Frontend:

- homepage 200;
- `/portfolio` 200;
- um case 200;
- `/privacidade` 200;
- `/cookies` 200;
- `/sitemap.xml` 200;
- `/robots.txt` 200 e deny-by-default durante Entrega 10;
- rota inexistente responde HTTP 404; o arquivo `/404.html` é validado no build.

Backend:

- `/health/` 200;
- `/health/ready/` 200;
- `/admin/` responde sem expor detalhe interno.

Smoke automatizado não deve criar Lead real por padrão.

Um smoke funcional do formulário com dados fictícios é executado controladamente durante bootstrap/validação da Entrega 10, não em todo deploy.

## 42. Backups — princípio

A Repage não depende apenas do backup da hospedagem.

Backup Angel da HomeHost é camada adicional, não única fonte de recuperação.

GitHub protege código e mídia versionada; não protege PostgreSQL.

## 43. Backup PostgreSQL local no servidor

O diretório local de backup validado é
`/home/re190924/backups/repage/postgresql`, fora de diretório público e com
permissão `700`. A rotina definitiva deve usar `pg_dump` compatível com
PostgreSQL 18, a partir da toolchain privada em
`/home/re190924/tools/postgresql-18/`.

Referência inicial de retenção no servidor:

```text
7 backups diários
```

Cada dump deve:

- ter timestamp;
- usar permissões restritas;
- não ser acessível por HTTP;
- não ser commitado;
- ser removido de acordo com rotação definida.

## 44. Cópia externa

Além da rotação no servidor:

- manter uma cópia fora da HomeHost;
- destino controlado por Lukas;
- armazenamento protegido/criptografado;
- sem sincronizar automaticamente para pasta pública;
- sem usar GitHub repository para armazenar banco.

Referência inicial:

```text
1 cópia semanal externa
retenção de 4 cópias semanais
```

O destino concreto não precisa ser documentado publicamente se expuser informação operacional sensível, mas a existência e o procedimento precisam ser verificáveis.

Não adicionar novo SaaS de backup sem necessidade.

## 45. Backups pré-migration

Antes de alteração destrutiva ou migration de risco:

- gerar backup adicional;
- verificar arquivo não vazio;
- registrar timestamp/evidência;
- não apagar cópias existentes antes da validação.

## 46. Restauração

Backup só é considerado validado após restauração real.

Restore real controlado já foi validado em database temporário: dado criado,
dump custom, remoção/recriação do database, `pg_restore` e recuperação do dado.
A implementação deve transformar esse procedimento em automação/runbook e
preservar o teste sem expor PII.

Depois do lançamento, referência operacional:

```text
teste de restauração trimestral
```

ou antes de mudança de infraestrutura relevante.

## 47. Retenção de Leads e backups

Preservar a decisão da Entrega 8:

- não existe prazo automático fixo de exclusão de Lead nesta V1;
- dados ficam enquanto necessários às finalidades aprovadas;
- exclusão por privacidade continua explícita.

Backups, porém, possuem rotação finita:

- 7 diários no servidor;
- 4 semanais externos.

Assim, dado excluído da base ativa não permanece indefinidamente nas novas gerações de backup.

Não criar job automático de expurgo de Leads nesta entrega.

## 48. Rollback de frontend

Procedimento deve permitir redeploy de SHA anterior validado.

Rollback:

- recompila ou reutiliza artefato verificável do SHA escolhido;
- publica assets antes de HTML;
- remove somente arquivos presentes no manifesto gerenciado anterior;
- restaura o archive e o manifesto correspondentes;
- valida rotas e smoke.

Não manter cópia manual não rastreada como “versão de produção”.

## 49. Rollback de backend

Rollback de código:

- redeploy de commit anterior conhecido;
- reinstala dependências correspondentes;
- não executa migrations como parte do rollback de código;
- restart Passenger;
- health/readiness;
- smoke.

Banco:

- não fazer migration reversa automaticamente;
- avaliar compatibilidade entre código anterior e schema atual;
- usar restauração somente quando realmente necessária e com impacto entendido.

## 50. Runbooks obrigatórios

Materializar somente procedimentos realmente usados:

```text
docs/operations/production-bootstrap.md
docs/operations/production-deploy.md
docs/operations/production-rollback.md
docs/operations/production-backup-and-restore.md
docs/operations/production-smtp-and-cron.md
docs/operations/production-observability.md
```

Atualizar `docs/operations/README.md` com o índice real.

Cada runbook precisa de:

- status;
- ambiente;
- responsável;
- última validação;
- pré-condições;
- acessos;
- procedimento;
- validação;
- falhas conhecidas;
- recuperação;
- evidências;
- segurança/privacidade.

## 51. Segredos e arquivos sensíveis

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

Revisar `.gitignore` e workflows antes do merge.

## 52. FTP

Os dados FTP já recebidos podem ser usados para diagnóstico/manual bootstrap se necessário, mas **FTP simples não é o mecanismo de deploy aprovado**.

Preferir SSH/SFTP/SCP autenticado por chave.

Não colocar senha FTP em workflow se SSH por chave estiver disponível.

## 53. HomeHost sem root

Tratar a hospedagem como ambiente compartilhado.

Não presumir:

- `sudo`;
- root;
- systemd;
- Docker;
- serviços persistentes próprios;
- alteração de firewall global;
- instalação de daemon.

Usar apenas capacidades da conta/cPanel/SSH limitado.

## 54. Recursos do plano

Registrar durante bootstrap:

- memória efetiva;
- limites de CPU/processos quando o painel mostrar;
- uso de disco;
- versão Python;
- versão PostgreSQL;
- limites de cron;
- limites de SMTP;
- limites de logs/backups.

Não fazer upgrade de plano sem evidência de saturação ou limitação incompatível.

## 55. Indexação durante Entrega 10

GitHub Environment `production` deve manter:

```text
VITE_SITE_INDEXING_ENABLED=false
```

Validações devem comprovar:

- `robots.txt` com `Disallow: /`;
- meta robots noindex conforme build SAFE.

A Entrega 10 não muda para `true`.

## 56. Ativação de indexação

A Entrega 11, após QA/lançamento aprovado:

1. altera a variable de produção para `true`;
2. executa deploy controlado;
3. verifica robots/metadados/sitemap;
4. confirma publicação comercial.

Essa fronteira impede indexação antes do gate de lançamento.

## 57. Google Analytics

Measurement ID real continua opcional durante Entrega 10.

Se ainda não existir:

- manter `VITE_GA_MEASUREMENT_ID` vazio;
- não inventar ID;
- consentimento/loader continuam funcionais;
- GA real permanece pendência explícita da Entrega 11.

Não criar propriedade GA apenas para fechar infraestrutura sem decisão do operador.

## 58. Search Console

Não configurar/submeter Search Console nesta entrega.

Isso pertence ao fechamento de lançamento depois que indexação estiver autorizada.

## 59. Fases de implementação

### Fase 1 — Validação de produção e hardening mínimo

- validar conta HomeHost;
- SSH/SFTP/chave;
- Python 3.12;
- PostgreSQL/Neon compatível com Django 5.2;
- paths;
- `api.repage.com.br`;
- SSL;
- Python App/WSGI/Passenger;
- cron;
- logs;
- atualizar Django 5.2 patch;
- `STATIC_ROOT`;
- settings de segurança;
- `.env.example`;
- `check --deploy`;
- testes focados.

Não criar workflow de deploy antes de provar os acessos reais necessários.

### Fase 2 — CI

- `.github/workflows`;
- frontend CI;
- backend CI com PostgreSQL;
- E2E;
- documentação proporcional;
- permissions/concurrency quando aplicável;
- validação em PR.

### Fase 3 — Bootstrap e CD

- Environment `production`;
- secrets/variables;
- bootstrap HomeHost;
- banco/cache/migrations/static;
- workflow de deploy;
- frontend estático;
- backend/Passenger;
- smoke;
- rollback inicial;
- produção ainda noindex.

### Fase 4 — SMTP, cron, logs e observabilidade

- SMTP real;
- e-mail controlado;
- cron retries;
- cron cleanup;
- logging;
- Passenger log;
- monitor horário;
- runbooks correspondentes.

### Fase 5 — Backup e recuperação

- `pg_dump` diário;
- rotação;
- cópia externa;
- backup pré-migration;
- restauração real em banco temporário;
- runbook;
- evidências.

### Fase 6 — Fechamento operacional

- deploy completo a partir de `main`;
- smoke final da infraestrutura;
- validações de segurança;
- verificação de secrets;
- restore confirmado;
- documentação reconciliada;
- spec `implemented`;
- roadmap → Entrega 10 concluída / Entrega 11 próxima.

Uma fase por vez.

## 60. Testes e validações — Fase 1

Backend após patch/hardening:

```bash
cd backend
python manage.py check
python manage.py makemigrations --check --dry-run
ruff check .
pytest
```

Produção/configuração equivalente:

```bash
python manage.py check --deploy
```

Validar manualmente no servidor:

- `python --version`;
- PostgreSQL version;
- SSH key auth;
- app restart;
- env vars;
- static path;
- health/readiness.

## 61. Validação do CI

Antes de congelar a fase:

- PR real ou branch de teste executa workflow;
- frontend aprovado;
- backend aprovado;
- PostgreSQL service real no CI;
- E2E aprovado;
- build SAFE aprovado;
- nenhuma secret disponível em jobs de PR;
- falha intencional controlada comprova que deploy não acontece com CI falhando.

## 62. Validação do deploy

Com infraestrutura pronta:

- merge/push controlado em `main` dispara CI;
- deploy só inicia depois dos jobs necessários;
- Environment `production` é usado;
- SHA implantado é observável;
- SHA aprovado é confirmado contra o HEAD atual de `origin/main`;
- dois deploys não rodam simultaneamente;
- frontend real é atualizado;
- backend real é atualizado;
- migrations funcionam;
- Passenger reinicia;
- health/readiness aprovam;
- smoke aprova;
- rota inexistente retorna HTTP 404;
- logs acessíveis.

## 63. Validação do SMTP/cron

- SMTP autenticado;
- conexão criptografada;
- mensagem interna chega;
- confirmação controlada chega;
- Reply-To correto;
- retry real pode ser processado;
- cron executa comando no horário esperado;
- cleanup remove apenas registros expirados;
- logs permanecem sanitizados.

## 64. Validação de backup

- cron gera dump;
- dump fica fora do webroot;
- permissões são restritas;
- rotação funciona;
- existe cópia externa;
- restore para banco temporário funciona;
- aplicação/schema podem ser inspecionados sem expor PII;
- banco temporário é removido depois;
- evidência fica no runbook sem incluir backup/dados.

## 65. Validação de segurança

Verificar:

- `DEBUG=False`;
- segredo ausente do Git;
- allowed hosts restritos;
- CORS restrito;
- cookies Admin seguros;
- HTTP → HTTPS;
- frame protection;
- nosniff;
- referrer policy;
- nenhum diretório de backup público;
- Admin somente HTTPS;
- env files não públicos;
- SSH host key pinning;
- nenhuma senha FTP em workflow;
- nenhum log com PII/secret;
- `check --deploy` revisado.

## 66. Validação do frontend em produção

Durante Entrega 10:

- domínio apex;
- www redirect;
- rotas prerenderizadas;
- reload direto;
- `404.html`;
- assets;
- consentimento;
- formulário apontando para API real;
- indexação SAFE;
- nenhuma regressão de hydration.

Não executar a regressão visual/comercial completa da Entrega 11.

## 67. Smoke funcional do Lead em produção

Executar uma vez durante a validação de infraestrutura com dados fictícios/controlados:

- formulário/API cria Lead;
- PostgreSQL persiste;
- duas EmailDelivery existem;
- notificação/confirmation testáveis;
- Admin exibe;
- dados de teste são removidos depois conforme procedimento seguro;
- nenhum dado real de terceiro é usado.

Esse smoke não vira job automático recorrente.

## 68. Fora de escopo — Entrega 11

Não considerar concluído nesta spec:

- lançamento comercial;
- divulgação;
- indexação ativada;
- Search Console;
- QA final completo de todas as rotas/viewports;
- revisão final de cada mídia/link/copy;
- Lighthouse/meta de performance final como gate comercial;
- Measurement ID GA obrigatório;
- revisão jurídica final.

## 69. Fora de escopo geral

Não implementar:

- Kubernetes;
- Docker em produção;
- VPS;
- Nginx administrado pela Repage;
- Celery;
- Redis;
- fila;
- staging permanente;
- Sentry obrigatório;
- Datadog;
- New Relic;
- Cloudflare por preferência;
- CDN nova;
- troca de provedor PostgreSQL sem falha comprovada do Neon ou ADR;
- mudança para MySQL;
- novo provedor SMTP sem falha comprovada da HomeHost.

## 70. Critérios de aceite

- [ ] `main` pós-0009 usada como baseline.
- [ ] HomeHost/Registro.br registrados como estado real, não hipótese.
- [ ] SSH/SFTP real validado.
- [ ] chave exclusiva de deploy configurada.
- [ ] host key fixada; nenhum `StrictHostKeyChecking=no`.
- [ ] Python 3.12 real validado ou incompatibilidade formalmente tratada.
- [ ] PostgreSQL/Neon de produção definido e validado por TLS.
- [ ] banco/usuário de produção dedicados.
- [ ] `api.repage.com.br` funcional.
- [ ] SSL da API funcional.
- [ ] Python App/WSGI/Passenger funcional.
- [ ] restart do Passenger validado.
- [ ] Django 5.2 atualizado para patch de segurança vigente aprovado.
- [ ] regressão backend do patch aprovada.
- [ ] DatabaseCache criado.
- [ ] `STATIC_ROOT`/collectstatic funcionando.
- [ ] settings de segurança de produção materializados.
- [ ] `check --deploy` executado e warnings revisados.
- [ ] `.github/workflows` materializado.
- [ ] CI frontend em PR/main.
- [ ] CI backend/PostgreSQL em PR/main.
- [ ] E2E executado no CI.
- [ ] nenhuma secret exposta a PR.
- [ ] Environment `production` configurado.
- [ ] deploy automatizado a partir da `main` após CI.
- [ ] deploy possui concurrency.
- [ ] frontend usa build/prerender real.
- [ ] frontend publica assets antes de HTML.
- [ ] `404.html` servido corretamente.
- [ ] www redireciona para apex.
- [ ] backend deploy executa migrations controladas.
- [ ] Passenger reinicia.
- [ ] health/readiness pós-deploy passam.
- [ ] smoke pós-deploy automatizado passa.
- [ ] SMTP real `mail.repage.com.br:465` com SSL/TLS e autenticação validado.
- [ ] `notificacoes@repage.com.br` usado como remetente.
- [ ] `contato@repage.com.br` usado como destinatário interno.
- [ ] SPF/DKIM/DMARC/PTR revalidados.
- [ ] cron de email retry funciona.
- [ ] cron de cleanup funciona.
- [ ] logs de Passenger acessíveis.
- [ ] logging Django mínimo implementado.
- [ ] logs não expõem PII/secrets.
- [ ] monitor de disponibilidade horário funciona.
- [ ] backup diário PostgreSQL funciona.
- [ ] retenção local de 7 cópias funciona.
- [ ] cópia externa semanal existe.
- [ ] retenção externa de 4 cópias funciona.
- [ ] Backup Angel não é a única cópia.
- [ ] restauração real foi testada.
- [ ] banco temporário de restore foi removido.
- [ ] runbook de bootstrap existe e foi validado.
- [ ] runbook de deploy existe e foi validado.
- [ ] runbook de rollback existe e foi validado.
- [ ] runbook de backup/restore existe e foi validado.
- [ ] runbook SMTP/cron existe e foi validado.
- [ ] runbook de observabilidade existe e foi validado.
- [ ] produção permanece `VITE_SITE_INDEXING_ENABLED=false`.
- [ ] nenhuma Entrega 11 foi antecipada.
- [ ] nenhum secret/backup/log real entrou no Git.
- [ ] `git diff --check` aprovado.
- [ ] documentação reconciliada.
- [ ] spec só vira `implemented` após evidência operacional obrigatória.

## 71. Bloqueios que impedem fechar a Entrega 10

São bloqueadores reais:

- Neon não permanecer acessível por TLS ou não oferecer PostgreSQL compatível;
- SSH/SFTP seguro não permitir deploy automatizado e não existir alternativa segura equivalente;
- Python App não suportar Django/WSGI necessário;
- impossibilidade de SSL em `api.repage.com.br`;
- ausência de scheduler utilizável para retries;
- SMTP real não permitir autenticação criptografada;
- não existir cópia externa de backup;
- restauração não ter sido comprovada;
- health/readiness falharem em produção;
- CI/CD não conseguir implantar e recuperar de forma reproduzível.

Nesses casos, parar e decidir a mudança estrutural antes de improvisar.

## 72. Itens que não bloqueiam a Entrega 10

Não bloqueiam, desde que registrados:

- GA4 Measurement ID ainda ausente;
- Search Console ainda não configurado;
- indexação global ainda desligada;
- HSTS longo/preload ainda não ativado;
- plataforma externa de observabilidade não adotada;
- MFA do Django Admin ainda não implementado;
- lançamento comercial ainda não realizado.

Esses itens permanecem para o gate adequado ou decisão futura.

## 73. Documentação no fechamento

Atualizar:

- esta spec → `implemented`;
- `docs/specs/README.md`;
- `docs/ROADMAP.md` → Entrega 10 concluída / Entrega 11 próxima;
- `docs/ARCHITECTURE.md` com capacidades HomeHost realmente validadas;
- `docs/operations/README.md`;
- runbooks reais;
- `backend/AGENTS.md` apenas se surgir regra duradoura nova;
- `frontend/AGENTS.md` apenas se deploy/hosting criar regra frontend duradoura.

Também remover/reconciliar pendências documentais que ficaram objetivamente obsoletas, como:

- “Validar HomeHost” quando a validação estiver concluída;
- registrador ainda pendente;
- mecanismo de prerender ainda pendente;
- SMTP/DNS marcados como desconhecidos depois de validação real.

Não apagar histórico de ADR.

## 74. ADR

O ADR [`0002-postgresql-neon-production-provider.md`](../adr/0002-postgresql-neon-production-provider.md)
registra a decisão atual: PostgreSQL permanece a engine e Neon é o provedor de
produção por causa da incompatibilidade do PostgreSQL 13.23 da HomeHost com
Django 5.2.

Criar outro ADR somente se a implementação exigir mudança estrutural real, por exemplo:

- trocar HomeHost;
- migrar PostgreSQL/Neon para outro provedor;
- mudar topologia;
- abandonar Passenger/WSGI;
- adotar plataforma externa como dependência obrigatória;
- mudar de forma relevante a política de backups depois de aprovada.

## 75. Definição de pronto

A Entrega 10 está concluída quando o projeto puder sair de:

```text
main validada localmente
```

para:

```text
PR
→ CI
→ merge em main
→ deploy controlado
→ frontend estático
→ Django/Passenger
→ migrations
→ health/readiness
→ smoke
→ SMTP/cron
→ logs/monitor
→ backup externo
→ restore comprovado
```

com procedimentos reproduzíveis e evidências reais.

A produção ao final da Entrega 10 deve estar tecnicamente operacional no domínio definitivo, porém ainda protegida por indexação deny-by-default e sem ser considerada lançamento comercial até a Entrega 11.
