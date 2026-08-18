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

- CI concluído com sucesso para o mesmo SHA em `main`;
- redeploy manual iniciado pelo `workflow_dispatch` do workflow `CI` na
  `main`, seguido de `workflow_run` bem-sucedido;
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
2. Redeploy manual significa executar `CI` por `workflow_dispatch` na `main`;
   `Deploy production` não possui caminho manual direto.
3. Após CI concluir com sucesso, `Deploy production` é acionado por
   `workflow_run` para push ou dispatch na `main`.
4. O deploy confirma que o SHA aprovado ainda é o HEAD atual de `origin/main`.
5. O mesmo SHA é usado para checkout, build e empacotamento.
6. O frontend é construído com `VITE_SITE_INDEXING_ENABLED=false` e os
   arquivos prerenderizados obrigatórios são verificados.
7. O backend é empacotado sem `.env`, `.venv`, testes, caches, logs,
   `docker-compose.yml` ou arquivos locais.
8. A private key é escrita somente em arquivo temporário com permissão restrita.
9. SSH/SCP usa o `DEPLOY_SSH_KNOWN_HOSTS` pinado e
   `StrictHostKeyChecking=yes`, `BatchMode=yes`, timeout de conexão de 15
   segundos e keepalive para sessões longas.
10. O archive e o manifesto de rollback do estado gerenciado anterior são
    preservados em `tmp/repage-rollback-frontend.tar.gz`,
    `tmp/repage-rollback-backend.tar.gz`,
    `tmp/repage-rollback-frontend.manifest` e
    `tmp/repage-rollback-backend.manifest`.
11. Assets frontend são publicados antes dos HTMLs; o `.htaccess` e o
   `404.html` fazem parte do artefato validado.
12. Arquivos gerenciados removidos pelo novo SHA são removidos apenas a partir
    do manifesto anterior; arquivos externos desconhecidos permanecem.
13. Backend é atualizado sem substituir o `.env` externo nem o `tmp/` do
    Passenger.
14. Requirements são instalados no virtualenv existente.
15. O executor Django roda via `cloudlinux-selector`; o JSON retornado é
    decodificado e o `returncode` interno precisa ser `0`.
16. O Passenger é reiniciado com:

```bash
touch /home/re190924/repage_backend/tmp/restart.txt
```

17. O workflow verifica health, readiness, homepage, uma rota prerenderizada
    e uma rota inexistente com status HTTP exatamente `404`.

O job de deploy possui timeout de 20 minutos. Esse limite é deliberadamente
superior à duração observada para a transferência do frontend de produção e
interrompe somente travamentos prolongados do runner ou da sessão remota.
Quando existe o SHA da última publicação bem-sucedida, o deploy compara esse
estado com o SHA atual e transfere/muta somente os componentes alterados; na
ausência ou invalidez do estado, usa o fluxo completo como fallback seguro.

## Falhas conhecidas

- O workflow não deve prosseguir se CI falhar.
- Redeploy manual significa executar `CI` por `workflow_dispatch` na `main`;
  `Deploy production` só reage ao `workflow_run` concluído com sucesso.
- O deploy aborta se o SHA aprovado não for o HEAD atual de `origin/main`.
- Falhas de `check --deploy`, migration, `createcachetable`, `collectstatic`,
  restart ou smoke encerram o deploy com erro.
- Resultado JSON inválido, `result` diferente de `success`, Base64 inválido ou
  `returncode` interno diferente de zero encerra o deploy antes do restart.
- O shell SSH comum não possui as Environment Variables da Python App; não
  executar `manage.py` diretamente para operações de produção.
- A regra manual atual de Force HTTPS/hostname pode causar redirect duplicado
  até ser reconciliada com o `.htaccess` versionado.
- A presença do arquivo de rollback não constitui backup PostgreSQL.
- O smoke HTTP real da rota inexistente permanece pendente até execução após
  merge em `main`.

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
```

Antes de extrair, remova somente as entradas do manifesto atual que não
existem no manifesto de rollback correspondente. Depois de restaurar o
backend, substitua atomicamente os manifestos current pelos manifestos de
rollback:

```bash
cp /home/re190924/repage_backend/tmp/repage-rollback-frontend.manifest \
  /home/re190924/repage_backend/tmp/repage-manifest-frontend.txt.rollback
mv -f /home/re190924/repage_backend/tmp/repage-manifest-frontend.txt.rollback \
  /home/re190924/repage_backend/tmp/repage-manifest-frontend.txt
cp /home/re190924/repage_backend/tmp/repage-rollback-backend.manifest \
  /home/re190924/repage_backend/tmp/repage-manifest-backend.txt.rollback
mv -f /home/re190924/repage_backend/tmp/repage-manifest-backend.txt.rollback \
  /home/re190924/repage_backend/tmp/repage-manifest-backend.txt
```

Depois, reinstale o `requirements.txt` do archive anterior no virtualenv
existente, execute `touch /home/re190924/repage_backend/tmp/restart.txt` e
repita os smoke tests. Não remover arquivos fora dos manifestos e archives
conhecidos.

Rollback de código não reverte migrations. Migration destrutiva exige
procedimento específico e backup validado conforme o
[runbook de backup e restauração](production-backup-and-restore.md); o restore
check desse runbook não restaura a base ativa.

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
- validação HTTP end-to-end da rota inexistente após merge em `main`.

## Segurança e privacidade

Não registrar senha, token, private key, connection string, host key completa,
`.env`, backup, log real ou dados pessoais. Não usar `ssh-keyscan` dinâmico,
`StrictHostKeyChecking=no`, action SSH de terceiro ou permissões de escrita
além de `contents: read`.

## Referências

- [`docs/specs/0010-ci-cd-deploy-backups-observability.md`](../specs/0010-ci-cd-deploy-backups-observability.md)
- [`docs/adr/0002-postgresql-neon-production-provider.md`](../adr/0002-postgresql-neon-production-provider.md)
- [`../../.github/workflows/deploy.yml`](../../.github/workflows/deploy.yml)
