# Backup e restauração PostgreSQL de produção

- **Status:** mecanismo versionado e runbook materializado; validação operacional final pendente
- **Ambiente:** HomeHost Python App + Neon PostgreSQL 18
- **Responsável:** Lukas Frick
- **Última validação:** scripts 5A/5B e testes automatizados versionados; execução operacional definitiva ainda pendente
- **Frequência:** backup diário às 02:17; cópia externa semanal; restore check periódico ou antes de mudança relevante de infraestrutura

## Objetivo

Definir o backup local do PostgreSQL, a cópia externa controlada pelo
operador, a retenção e o restore check seguro. O procedimento protege o banco
real contra restore ou DROP acidental e não transforma backup em evidência de
produção antes da execução operacional correspondente.

Este documento não ativa cron, executa cópia externa ou restaura dados reais.

## Pré-condições

- CI aprovado para o código que será usado;
- acesso ao cPanel para configurar ou inspecionar o cron, quando aplicável;
- Python App de produção configurada;
- variáveis PostgreSQL presentes no ambiente da aplicação;
- endpoint direto PostgreSQL configurado para backup e restore;
- toolchain PostgreSQL 18 disponível nos paths documentados;
- diretório local fora do webroot;
- para cópia externa, estação do operador com SSH/SFTP por chave e destino protegido/criptografado;
- janela de manutenção e decisão explícita para qualquer recuperação destrutiva.

## Acessos necessários

O backup e o restore check usam o ambiente da Python App por meio do
CloudLinux selector. O shell SSH comum não deve ser usado para executar
operações que dependem das variáveis da aplicação.

Para a cópia externa, o operador precisa de:

- chave SSH privada não versionada;
- arquivo known_hosts com a chave do servidor já validada;
- host, porta e usuário SSH parametrizados;
- diretório externo sob controle do operador.

Não registrar senha, private key, connection string ou valores das variáveis
em evidências ou chamados.

## Topologia

~~~text
HomeHost
├── app root: /home/re190924/repage_backend
├── backups:  /home/re190924/backups/repage/postgresql
└── PostgreSQL/Neon direto por TLS para backup/restore
        │
        └── pull semanal por SSH/SFTP
            armazenamento externo protegido pelo operador
~~~

O diretório local de backup fica fora do webroot e deve permanecer com
permissão 0700. O destino externo não é GitHub, GitHub Actions, bucket,
SaaS ou caminho privado hardcoded neste repositório.

O runtime Django pode usar um endpoint pooled separado, mas backup e restore
usam `POSTGRES_DIRECT_HOST` e `POSTGRES_DIRECT_PORT`. Isso mantém `pg_dump`,
`pg_restore` e o `CREATE/DROP DATABASE` do restore check fora de um pool de
transações. As credenciais continuam nas variáveis da Python App.

## Backup diário

O cron definitivo previsto, ainda não ativado nesta entrega, é:

~~~text
17 2 * * * /bin/bash /home/re190924/repage_backend/scripts/run_production_backup.sh daily
~~~

O timezone de referência do servidor é America/Sao_Paulo (UTC-03:00).

O comando allowlisted chama o script versionado de backup diário. O fluxo
produz um archive custom do PostgreSQL 18, valida a listagem com pg_restore,
calcula checksum SHA-256, promove o arquivo somente depois da validação e
aplica retenção local aos pares completos.

Para configurar no cPanel:

1. abrir **Cron Jobs** da conta de produção;
2. inserir o horário acima;
3. usar exatamente o comando completo, com /bin/bash;
4. não inserir senha, connection string ou valores PostgreSQL no comando;
5. salvar o horário e registrar somente a configuração não sensível.

Para verificar uma execução, observar o resultado sanitizado do job no
histórico/log de cron disponibilizado pelo cPanel e confirmar, no servidor,
somente os nomes, tamanhos e permissões dos artefatos:

~~~bash
backup_dir='/home/re190924/backups/repage/postgresql'
find "$backup_dir" -maxdepth 1 -type f -name 'repage-daily-????????T??????Z.dump' -print
stat -c '%a %n' "$backup_dir"
~~~

O resultado esperado é um archive diário acompanhado do arquivo com o mesmo
nome e sufixo .sha256. Não usar cat em payloads, sidecars ou logs de produção.

## Backup pré-migration

Antes de migration de risco ou alteração destrutiva, executar explicitamente:

~~~bash
/bin/bash /home/re190924/repage_backend/scripts/run_production_backup.sh pre_migration
~~~

Esse modo produz um backup adicional pre-migration e não participa da rotação
automática dos sete backups diários. A cópia deve ser mantida até a mudança
estabilizar; sua limpeza é uma decisão manual posterior.

Rollback de código não restaura banco nem reverte migration automaticamente.
Compatibilidade entre código e schema deve ser avaliada antes de qualquer
recuperação.

## Validação de checksum

O script de backup escreve o sidecar no formato:

~~~text
<64 hex>  <nome-exato-do-archive>
~~~

Em produção Linux, a verificação operacional de um par conhecido pode ser
feita sem imprimir o conteúdo:

~~~bash
cd /home/re190924/backups/repage/postgresql
sha256sum -c repage-daily-YYYYMMDDTHHMMSSZ.dump.sha256
~~~

O nome no sidecar precisa corresponder exatamente ao archive. Checksum
ausente, inválido ou divergente invalida o par e interrompe o restore check.

## Retenção local

A retenção local mantém sete pares completos mais recentes:

- archive regular com nome exato repage-daily-YYYYMMDDTHHMMSSZ.dump;
- sidecar regular correspondente;
- archive e sidecar removidos juntos quando são pares excedentes;
- archives órfãos e sidecars órfãos não contam e não são removidos pela rotina;
- backups pre-migration e arquivos desconhecidos não são tocados.

O diretório e os arquivos são criados com permissões restritas. A retenção
não recalcula SHA-256 de todos os backups; a validação criptográfica completa
ocorre quando o par é usado.

## Cópia externa semanal

A cópia é um PULL iniciado pelo operador:

~~~text
HomeHost --SSH/SFTP/SCP--> armazenamento externo controlado pelo operador
~~~

O servidor não empurra backups para terceiros. Não usar GitHub, artifacts,
SaaS, bucket novo ou provedor adicional para armazenar banco.

Defina os parâmetros somente na sessão local do operador:

~~~bash
REPAGE_BACKUP_REMOTE_HOST='host-validado'
REPAGE_BACKUP_REMOTE_PORT='porta-validada'
REPAGE_BACKUP_REMOTE_USER='re190924'
REPAGE_BACKUP_EXTERNAL_DIR='/caminho/controlado/pelo/operador'
REPAGE_BACKUP_SSH_KEY='/caminho/local/da/chave'
REPAGE_BACKUP_KNOWN_HOSTS='/caminho/local/do/known_hosts'
~~~

Não salve esse bloco como .env no repositório e não substitua os valores por
segredos em documentação versionada. O path remoto conhecido é fixo:

~~~text
/home/re190924/backups/repage/postgresql
~~~

O procedimento semanal deve ser executado em uma estação protegida, com
permissões locais restritas e armazenamento externo criptografado pelo
operador. O exemplo abaixo usa apenas ferramentas padrão e não foi executado
nesta entrega:

~~~bash
set -Eeuo pipefail
umask 077
: "${REPAGE_BACKUP_REMOTE_HOST:?}"
: "${REPAGE_BACKUP_REMOTE_PORT:?}"
: "${REPAGE_BACKUP_REMOTE_USER:?}"
: "${REPAGE_BACKUP_EXTERNAL_DIR:?}"
: "${REPAGE_BACKUP_SSH_KEY:?}"
: "${REPAGE_BACKUP_KNOWN_HOSTS:?}"
remote_dir='/home/re190924/backups/repage/postgresql'
external_dir="$REPAGE_BACKUP_EXTERNAL_DIR"
mkdir -p "$external_dir"
ssh_options=(
  -p "$REPAGE_BACKUP_REMOTE_PORT"
  -i "$REPAGE_BACKUP_SSH_KEY"
  -o BatchMode=yes
  -o IdentitiesOnly=yes
  -o StrictHostKeyChecking=yes
  -o UserKnownHostsFile="$REPAGE_BACKUP_KNOWN_HOSTS"
)
scp_options=(
  -P "$REPAGE_BACKUP_REMOTE_PORT"
  -i "$REPAGE_BACKUP_SSH_KEY"
  -o BatchMode=yes
  -o IdentitiesOnly=yes
  -o StrictHostKeyChecking=yes
  -o UserKnownHostsFile="$REPAGE_BACKUP_KNOWN_HOSTS"
)
remote_target="$REPAGE_BACKUP_REMOTE_USER@$REPAGE_BACKUP_REMOTE_HOST"
~~~

Use SSH com `-p`, BatchMode=yes, IdentitiesOnly=yes, StrictHostKeyChecking=yes,
UserKnownHostsFile apontando para o known_hosts previamente validado e a
chave indicada por REPAGE_BACKUP_SSH_KEY. As transferências usam `scp -P` com a
mesma porta parametrizada. Não use ssh-keyscan dinâmico.

O archive selecionado no servidor deve ser o daily completo mais recente:

~~~bash
latest_archive="$(ssh "${ssh_options[@]}" "$remote_target" /bin/sh -s <<'REMOTE'
set -eu
remote_dir='/home/re190924/backups/repage/postgresql'
for archive in "$remote_dir"/repage-daily-????????T??????Z.dump; do
  [ -f "$archive" ] || continue
  [ -f "$archive.sha256" ] || continue
  basename "$archive"
done | LC_ALL=C sort | tail -n 1
REMOTE
)"
case "$latest_archive" in
  repage-daily-????????T??????Z.dump) ;;
  *) echo 'No complete daily backup selected.' >&2; exit 1 ;;
esac
~~~

Transfira archive e sidecar para nomes temporários no destino:

~~~bash
partial_archive="$external_dir/.$latest_archive.partial"
partial_sidecar="$external_dir/.$latest_archive.sha256.partial"
cleanup() {
  rm -f -- "$partial_archive" "$partial_sidecar"
}
trap cleanup EXIT
scp "${scp_options[@]}" "$remote_target:$remote_dir/$latest_archive" "$partial_archive"
scp "${scp_options[@]}" "$remote_target:$remote_dir/$latest_archive.sha256" "$partial_sidecar"
~~~

Valide o filename e o digest do sidecar, depois calcule o digest do archive
temporário. No macOS use:

~~~bash
expected_digest="$(awk 'NF == 2 {print $1}' "$partial_sidecar")"
expected_name="$(awk 'NF == 2 {print $2}' "$partial_sidecar")"
test "$expected_name" = "$latest_archive"
actual_digest="$(shasum -a 256 "$partial_archive" | awk '{print $1}')"
test "$actual_digest" = "$expected_digest"
~~~

No Linux, substitua somente o cálculo por:

~~~bash
actual_digest="$(sha256sum "$partial_archive" | awk '{print $1}')"
~~~

Depois da validação, promova os dois arquivos no mesmo diretório:

~~~bash
mv -f -- "$partial_sidecar" "$external_dir/$latest_archive.sha256"
mv -f -- "$partial_archive" "$external_dir/$latest_archive"
trap - EXIT
~~~

Falha ou interrupção deve remover somente os dois nomes temporários
conhecidos. Faça uma nova validação SHA-256 no par promovido antes de
considerar a cópia concluída.

## Retenção externa

A frequência de referência é semanal e a retenção máxima é de quatro pares.
Use um diretório externo dedicado à rotina, sem misturar arquivos do operador.
Os nomes mantêm o timestamp diário de origem; cada execução semanal cria uma
geração externa identificável.

A limpeza deve considerar somente pares completos com o padrão exato. Archives
órfãos, sidecars órfãos e nomes desconhecidos permanecem para investigação:

~~~bash
complete_archives="$(
  for archive in "$REPAGE_BACKUP_EXTERNAL_DIR"/repage-daily-????????T??????Z.dump; do
    [ -f "$archive" ] || continue
    [ -f "$archive.sha256" ] || continue
    basename "$archive"
  done | LC_ALL=C sort
)"
count="$(printf '%s\n' "$complete_archives" | awk 'NF {n++} END {print n + 0}')"
if [ "$count" -gt 4 ]; then
  remove_count="$((count - 4))"
  printf '%s\n' "$complete_archives" | head -n "$remove_count" | while IFS= read -r archive_name; do
    [ -n "$archive_name" ] || continue
    archive="$REPAGE_BACKUP_EXTERNAL_DIR/$archive_name"
    sidecar="$archive.sha256"
    [ -f "$archive" ] && [ -f "$sidecar" ] || continue
    rm -f -- "$archive" "$sidecar"
  done
fi
~~~

Esse procedimento não remove qualquer arquivo fora do padrão nem qualquer
archive/sidecar sem o par correspondente.

## Restore check

O comando operacional existente é:

~~~bash
/bin/bash /home/re190924/repage_backend/scripts/run_production_backup.sh restore_check
~~~

O restore check:

1. seleciona somente o backup diário completo mais recente;
2. exige archive e sidecar;
3. valida o formato e o SHA-256 antes de criar banco;
4. gera internamente um database temporário seguro;
5. cria esse database usando o banco configurado apenas como conexão de manutenção;
6. executa pg_restore somente no database temporário;
7. valida estruturalmente public.django_migrations;
8. remove o database temporário em sucesso ou falha;
9. trata falha de cleanup como falha operacional;
10. mantém saída sanitizada e nunca imprime stdout/stderr bruto.

O target de restore não vem de argv, variável de ambiente ou entrada do
operador. A lógica rejeita qualquer target igual ao POSTGRES_DB antes de
CREATE, pg_restore e DROP.

Este procedimento não é um restore destrutivo da produção. Em desastre real,
a restauração da base ativa exige decisão manual, janela de manutenção,
entendimento do impacto, backup externo validado e confirmação explícita antes
de qualquer comando destrutivo. Não há comando automático apontando para o
database real neste runbook.

## Validação

Para uma execução operacional, registrar somente:

- timestamp e modo executado;
- nome do archive e sidecar, sem conteúdo;
- retorno sanitizado do wrapper;
- permissões e tamanho dos arquivos;
- resultado da verificação SHA-256;
- confirmação de que o database temporário foi removido.

Não registrar password, connection string, PII, conteúdo do dump, linhas de
banco ou payload JSON/Base64 do CloudLinux.

## Falhas conhecidas

- cron não ativado nesta entrega;
- não existe ainda evidência de backup diário real produzido pelo cron definitivo;
- ausência ou divergência de checksum interrompe o fluxo;
- falha de rede durante cópia deixa somente partials removíveis no destino;
- falha de promoção exige investigação antes de repetir;
- falha de cleanup do restore check é fatal e pode deixar database temporário;
- retenção não remove órfãos automaticamente;
- rollback de código não reverte migrations;
- a cópia externa depende de chave, known_hosts e armazenamento protegido do operador.

## Recuperação

Para falha do backup diário, preservar o archive/sidecar eventualmente
produzidos, não apagar órfãos automaticamente e corrigir a causa antes de
repetir. Para falha da cópia externa, remover apenas partials conhecidos da
execução e repetir após validar a origem.

Para recuperação de banco, primeiro validar uma cópia externa e o checksum.
Depois abrir uma janela de manutenção, avaliar compatibilidade de código/schema
e obter confirmação explícita para qualquer alteração no banco ativo. Restore
check é apenas uma prova não destrutiva em database temporário.

## Evidências

Já comprovado:

- diretório local de backup fora do webroot com permissão 0700;
- toolchain privada PostgreSQL 18 com psql, pg_dump e pg_restore;
- conexão TLS HomeHost → Neon;
- restore mecânico controlado em database temporário;
- scripts 5A/5B e seus testes automatizados;
- wrapper allowlisted de produção versionado.

Ainda pendente de validação operacional real:

- cron diário definitivo ativo;
- backup diário real produzido pelo cron definitivo;
- observação da retenção local de sete gerações ao longo do tempo;
- primeira cópia externa semanal;
- retenção externa real de quatro gerações;
- execução do wrapper restore_check com backup real em produção;
- evidência final de produção.

Testes locais ou mocks não substituem essas evidências.

## Segurança e privacidade

- não versionar dumps, sidecars reais, logs ou dados de produção;
- manter backups fora do webroot;
- manter permissões restritas;
- usar SSH por chave, BatchMode, IdentitiesOnly e StrictHostKeyChecking=yes;
- usar known_hosts previamente validado; nunca usar ssh-keyscan dinâmico;
- não imprimir senhas, connection strings, PII, stdout/stderr bruto ou payloads;
- manter o destino externo protegido/criptografado pelo operador;
- limitar a limpeza a pares completos do padrão gerenciado;
- nunca usar GitHub ou artefatos de CI para armazenar banco.

## Referências

- [Arquitetura](../ARCHITECTURE.md)
- [Spec 0010](../specs/0010-ci-cd-deploy-backups-observability.md)
- [Deploy de produção](production-deploy.md)
- [SMTP e cron](production-smtp-and-cron.md)
- [Observabilidade](production-observability.md)
- [Script de backup](../../backend/scripts/postgres_backup.py)
- [Script de restore check](../../backend/scripts/postgres_restore_check.py)
- [Wrapper de backup](../../backend/scripts/run_production_backup.sh)
