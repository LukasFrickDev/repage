# Deploy de produção

- **Status:** draft — um deploy completo anterior e seu smoke foram comprovados; a implementação resiliente desta branch ainda não foi validada em produção
- **Ambiente:** produção HomeHost + Neon
- **Responsável:** Lukas Frick
- **Última validação:** deploy completo `4b94c1ff3a069206777a07d6c183feb0cc56e56d` e smoke comprovados; a implementação nova permanece pendente de validação real
- **Frequência:** a cada deploy aprovado pela `main`

## Objetivo

Publicar o frontend e o backend do mesmo commit SHA por GitHub Actions, usando
o Environment `production`, sem copiar segredos da aplicação para o workflow.

## Pré-condições

- CI concluído com sucesso na PR que protegeu a integração na `main`;
- para validação manual, `CI` pode ser executado por `workflow_dispatch` na
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

1. O workflow `CI` valida a PR com os componentes afetados; `CI Gate` é o
   check obrigatório da proteção de `main`.
2. Depois do merge permitido pela `main` protegida, `Deploy production` reage
   diretamente ao `push` em `main`; `workflow_dispatch` do deploy só é aceito
   quando a referência é `main`.
3. O deploy confirma que o SHA disparador ainda é o HEAD atual de
   `origin/main`.
4. O mesmo SHA é usado para checkout, build e empacotamento.
5. O frontend é construído com `VITE_SITE_INDEXING_ENABLED=false` e os
   arquivos prerenderizados obrigatórios são verificados.
6. O backend é empacotado sem `.env`, `.venv`, `requirements-dev.txt`, testes, caches, logs,
   `docker-compose.yml` ou arquivos locais.
7. A private key é escrita somente em arquivo temporário com permissão restrita.
8. SSH/SCP usa o `DEPLOY_SSH_KNOWN_HOSTS` pinado e
   `StrictHostKeyChecking=yes`, `BatchMode=yes`, timeout de conexão de 15
   segundos e keepalive para sessões longas.
9. O archive e o manifesto de rollback do estado gerenciado anterior são
    preservados em `tmp/repage-rollback-frontend.tar.gz`,
    `tmp/repage-rollback-backend.tar.gz`,
    `tmp/repage-rollback-frontend.manifest` e
    `tmp/repage-rollback-backend.manifest`.
10. Assets frontend são publicados antes dos HTMLs; o `.htaccess` e o
   `404.html` fazem parte do artefato validado.
11. Arquivos gerenciados removidos pelo novo SHA são removidos apenas a partir
    do manifesto anterior; arquivos externos desconhecidos permanecem.
12. Backend é atualizado sem substituir o `.env` externo nem o `tmp/` do
    Passenger.
13. Somente `requirements.txt` runtime é instalado no virtualenv existente.
14. O executor Django roda via `cloudlinux-selector`; o JSON retornado é
    decodificado e o `returncode` interno precisa ser `0`.
15. O Passenger é reiniciado com:

```bash
touch /home/re190924/repage_backend/tmp/restart.txt
```

16. O workflow executa o smoke completo de health, readiness, homepage,
    portfolio, case, páginas legais, sitemap, robots, Admin, meta robots e
    rota inexistente com status HTTP exatamente `404`.

O job de deploy possui timeout de 20 minutos. Esse limite é deliberadamente
superior à duração observada para a transferência do frontend de produção e
interrompe somente travamentos prolongados do runner ou da sessão remota.
Quando existe o SHA da última publicação bem-sucedida e não há marker, o deploy
compara esse estado com o SHA atual e transfere/muta somente os componentes
alterados; na ausência ou invalidez do estado, usa o fluxo completo como
fallback seguro. Com marker, state válido igual ao alvo significa
`finalize-only`; qualquer state diferente, ausente ou inválido força
`recovery-full` de frontend e backend, preservando os rollbacks existentes.

O protocolo operacional é `plan -> apply -> smoke -> finalize`. O state fica em
`/home/re190924/repage_backend/tmp/repage-last-successful-sha`, contém somente
um SHA hexadecimal de 40 caracteres e é gravado atomicamente com arquivo
temporário, `chmod 600` e `mv`. State ausente ou conteúdo inválido resulta em
full deploy; não é obrigatório pré-popular o arquivo manualmente: o `finalize`
do primeiro deploy aprovado o cria. Com marker, state ausente, inválido ou
diferente do alvo resulta em `recovery-full`; falha SSH durante a leitura
aborta o deploy.

Alterações somente em testes/dev comprovadamente excluídos do artefato, ou em
documentação, podem resultar em ordinary no-op. Nesse caso o último SHA da
aplicação permanece no state e o workflow não executa build, empacotamento,
apply, smoke ou finalize.

Para mutações de aplicação, o SHA só avança depois do smoke verde. Um
ordinary no-op não executa build, package, apply, smoke ou finalize e não altera
o state. Se o state já contém o SHA atual e o marker ainda existe, a próxima
execução trata isso como finalização pendente, sem republicar a aplicação.
Marker com state diferente sempre entra em recovery-full.

No `push` normal e no `workflow_dispatch`, o planejamento é automático e
seletivo. A execução manual controlada na `main` pode resultar em
frontend-only, backend-only, full por fallback/recovery, finalize-only ou
ordinary no-op. Não existe nesta V1 um mecanismo de republicação forçada do
mesmo SHA.

## Falhas conhecidas

- O workflow não deve prosseguir se CI falhar.
- `CI` pode ser executado integralmente por `workflow_dispatch`; o deploy
  manual só é aceito na referência `main`.
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
- A implementação resiliente/seletiva desta branch ainda não possui validação
  real em produção.

Antes do merge que ativa o trigger direto de deploy, `main` deve estar protegida
com pull request obrigatório, o status `CI Gate` como required check, exigência
de branch atualizada/strict checks, force push e delete bloqueados e, quando
disponível, bypass administrativo impedido. A V1 solo não exige aprovação de
terceiro apenas para satisfazer o processo. Essa configuração será feita pelo
operador antes do merge; este repositório não a configura via API.

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

Já comprovado anteriormente:

- deploy completo do SHA `4b94c1ff3a069206777a07d6c183feb0cc56e56d` com smoke
  pós-deploy aprovado;
- a tentativa do SHA `c053b2378c51d97b98e639f43ede2ad9bd600c9c` chegou à
  publicação parcial do frontend e falhou com `Broken pipe` antes de
  requirements, CloudLinux, Passenger e promoção final;

- autenticação SSH/SFTP por chave;
- host key ED25519 validada e pinada;
- acesso aos paths da aplicação;
- `touch tmp/restart.txt` reiniciando o Passenger;
- `cloudlinux-selector run-script` recebendo o ambiente real da Python App;
- CI da Fase 2 aprovado no GitHub.

Ainda pendente:

- validação real da implementação seletiva/resiliente desta branch;
- rollback automatizado comprovado;
- reconciliação final do redirect manual do cPanel com o `.htaccess`.
- validação HTTP end-to-end da nova implementação resiliente desta branch.

## Segurança e privacidade

Não registrar senha, token, private key, connection string, host key completa,
`.env`, backup, log real ou dados pessoais. Não usar `ssh-keyscan` dinâmico,
`StrictHostKeyChecking=no`, action SSH de terceiro ou permissões de escrita
além de `contents: read`.

## Referências

- [`docs/specs/0010-ci-cd-deploy-backups-observability.md`](../specs/0010-ci-cd-deploy-backups-observability.md)
- [`docs/adr/0002-postgresql-neon-production-provider.md`](../adr/0002-postgresql-neon-production-provider.md)
- [`../../.github/workflows/deploy.yml`](../../.github/workflows/deploy.yml)
