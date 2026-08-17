# Deploy de produção

- **Status:** draft — preparado, ainda não executado end-to-end após merge em `main`
- **Ambiente:** produção HomeHost + Neon
- **Responsável:** Lukas Frick
- **Última validação:** componentes SSH, host key, Passenger e CloudLinux foram validados operacionalmente; o workflow completo ainda está pendente
- **Frequência:** a cada deploy aprovado pela `main`

## Objetivo

Publicar o frontend e o backend do mesmo commit SHA por GitHub Actions, usando
o Environment `production`, sem copiar segredos da aplicação para o workflow.

## Pré-condições

- CI concluído com sucesso para o mesmo push em `main`;
- workflow acionado por `workflow_run` bem-sucedido ou `workflow_dispatch` na
  `main`;
- Environment `production` restrito à `main`;
- `VITE_SITE_INDEXING_ENABLED` igual a `false`;
- private key exclusiva e host key ED25519 já cadastradas no Environment;
- Python App, paths e Environment Variables da aplicação configurados no
  Setup Python App da HomeHost;
- regra manual concorrente de Force HTTPS/hostname revisada antes de publicar
  o `.htaccess` definitivo.

## Acessos e variáveis

O workflow usa somente os nomes abaixo. Valores não são registrados neste
runbook.

Variables do Environment `production`:

- `DEPLOY_SSH_HOST`;
- `DEPLOY_SSH_PORT`;
- `DEPLOY_SSH_USER`;
- `DEPLOY_FRONTEND_PATH`;
- `DEPLOY_BACKEND_PATH`;
- `DEPLOY_SSH_KNOWN_HOSTS`;
- `VITE_API_BASE_URL`;
- `VITE_SITE_INDEXING_ENABLED`;
- `VITE_PRIVACY_POLICY_VERSION`.

Secret do Environment `production`:

- `DEPLOY_SSH_PRIVATE_KEY`.

Segredos Django, Neon, SMTP e static root permanecem exclusivamente no Setup
Python App e não são lidos pelo workflow.

## Primeiro bootstrap

Antes do primeiro deploy automatizado, o app root deve conter o layout do
backend diretamente em `/home/re190924/repage_backend`, incluindo `manage.py`,
`config/`, `apps/`, `templates/`, `static/`, `requirements.txt` e
`passenger_wsgi.py`. O virtualenv existente é
`/home/re190924/virtualenv/repage_backend/3.12/`.

O document root público do frontend é `/home/re190924/public_html`. O target
de static do Django é configurado externamente no Setup Python App como
`/home/re190924/api.repage.com.br/static`.

O workflow instala requirements no virtualenv existente e executa o script
versionado `scripts/production_manage.py` pelo mecanismo comprovado:

```text
/usr/sbin/cloudlinux-selector run-script \
  --json \
  --interpreter python \
  --app-root repage_backend \
  --script-name scripts/production_manage.py
```

O script executa `check --deploy`, migrations, `createcachetable` e
`collectstatic`. Ele recebe as variáveis da Python App sem expor settings ou
segredos no shell SSH.

## Deploy automatizado

1. O workflow `CI` valida o commit.
2. O workflow `Deploy production` é acionado pelo `workflow_run` bem-sucedido
   do CI na `main`, ou manualmente apenas na `main`.
3. O mesmo SHA é usado para checkout, build e empacotamento.
4. O frontend é construído com `VITE_SITE_INDEXING_ENABLED=false` e os
   arquivos prerenderizados obrigatórios são verificados.
5. O backend é empacotado sem `.env`, `.venv`, testes, caches, logs,
   `docker-compose.yml` ou arquivos locais.
6. A private key é escrita somente em arquivo temporário com permissão restrita.
7. SSH/SCP usa o `DEPLOY_SSH_KNOWN_HOSTS` pinado e
   `StrictHostKeyChecking=yes`.
8. Um arquivo de rollback do estado de código anterior é preservado em
   `tmp/repage-rollback-frontend.tar.gz` e
   `tmp/repage-rollback-backend.tar.gz`.
9. Assets frontend são publicados antes dos HTMLs; o `.htaccess` e o
   `404.html` fazem parte do artefato validado.
10. Backend é atualizado sem substituir o `.env` externo nem o `tmp/` do
    Passenger.
11. Requirements são instalados no virtualenv existente.
12. O executor Django roda via `cloudlinux-selector`.
13. O Passenger é reiniciado com:

```bash
touch /home/re190924/repage_backend/tmp/restart.txt
```

14. O workflow verifica health, readiness, homepage, uma rota prerenderizada
    e `404.html` com timeout e retries limitados.

## Falhas conhecidas

- O workflow não deve prosseguir se CI falhar.
- Falhas de `check --deploy`, migration, `createcachetable`, `collectstatic`,
  restart ou smoke encerram o deploy com erro.
- O shell SSH comum não possui as Environment Variables da Python App; não
  executar `manage.py` diretamente para operações de produção.
- A regra manual atual de Force HTTPS/hostname pode causar redirect duplicado
  até ser reconciliada com o `.htaccess` versionado.
- A presença do arquivo de rollback não constitui backup PostgreSQL.

## Rollback inicial

O rollback inicial restaura somente código e arquivos estáticos. Para uma
falha de publicação, preserve a evidência do SHA e restaure os arquivos com
os archives de rollback conhecidos no `tmp/`, depois execute o restart do
Passenger e os mesmos smoke tests.

Com o alvo confirmado e após verificar o SHA do archive, a restauração mínima
é:

```bash
tar -xzf /home/re190924/repage_backend/tmp/repage-rollback-frontend.tar.gz \
  -C /home/re190924/public_html
tar -xzf /home/re190924/repage_backend/tmp/repage-rollback-backend.tar.gz \
  -C /home/re190924/repage_backend
touch /home/re190924/repage_backend/tmp/restart.txt
```

Depois, repetir os smoke tests do workflow. Não remover arquivos fora dos
archives conhecidos.

Rollback de código não reverte migrations. Migration destrutiva exige
procedimento específico e backup validado da Fase 5.

## Evidências

Já comprovado antes do workflow:

- autenticação SSH/SFTP por chave;
- host key ED25519 validada e pinada;
- acesso aos paths da aplicação;
- `touch tmp/restart.txt` reiniciando o Passenger;
- `cloudlinux-selector run-script` recebendo o ambiente real da Python App;
- CI da Fase 2 aprovado no GitHub.

Ainda pendente:

- execução end-to-end do deploy após merge em `main`;
- smoke pós-deploy executado pelo workflow;
- rollback automatizado comprovado;
- reconciliação final do redirect manual do cPanel com o `.htaccess`.

## Segurança e privacidade

Não registrar senha, token, private key, connection string, host key completa,
`.env`, backup, log real ou dados pessoais. Não usar `ssh-keyscan` dinâmico,
`StrictHostKeyChecking=no`, action SSH de terceiro ou permissões de escrita
além de `contents: read`.

## Referências

- [`docs/specs/0010-ci-cd-deploy-backups-observability.md`](../specs/0010-ci-cd-deploy-backups-observability.md)
- [`docs/adr/0002-postgresql-neon-production-provider.md`](../adr/0002-postgresql-neon-production-provider.md)
- [`../../.github/workflows/deploy.yml`](../../.github/workflows/deploy.yml)
