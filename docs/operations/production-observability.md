# Observabilidade de produção

- **Status:** logging, correlação e monitor versionados; evidência de produção ainda pendente
- **Ambiente:** HomeHost Passenger + API pública + GitHub Actions
- **Responsável:** Lukas Frick
- **Última validação:** componentes de log e workflow validados localmente; Passenger stderr e Raw Access já comprovados operacionalmente
- **Frequência:** monitor horário; inspeção sob falha ou após deploy

## Objetivo

Oferecer evidência operacional suficiente para correlacionar requests, saúde da
API, entregas de e-mail e disponibilidade sem adicionar uma plataforma externa
ou registrar dados pessoais.

## Pré-condições

- aplicação implantada pelo fluxo aprovado da `main`;
- Passenger executando a versão versionada;
- acesso autorizado ao cPanel e ao Django Admin;
- notificações normais de falha do GitHub Actions disponíveis ao operador.

## Acessos necessários

- Passenger stderr em `/home/re190924/repage_backend/stderr.log`;
- Raw Access do cPanel para apex e API;
- Django Admin para `EmailDelivery`;
- workflow `Uptime` no GitHub Actions.

O arquivamento de Raw Access está habilitado no cPanel, mas nenhum caminho
interno adicional é presumido ou documentado sem observação direta.

## Logging Django

O Django usa o formatter JSON `apps.core.logging.StructuredFormatter`, enviado
para stdout, compatível com a coleta do Passenger. O nível é configurado pela
variável não sensível `DJANGO_LOG_LEVEL`, com default `INFO` e valores aceitos
`DEBUG`, `INFO`, `WARNING`, `ERROR` e `CRITICAL`.

Os campos emitidos são limitados a timestamp, level, logger, event e, quando
aplicáveis, request_id, method, path, status_code, duration_ms, lead_id,
delivery_id, kind, attempts e error_code. O formatter não serializa o
`LogRecord` inteiro.

O middleware registra `request_completed` com método, `request.path` sem query
string, status e duração baseada em `perf_counter`. O `X-Request-ID` da
resposta usa o mesmo identificador colocado no contexto da request e usado nos
eventos correlacionados; o contexto é limpo ao final, inclusive quando há
erro.

## Correlação prática

Ao investigar um caso, registrar somente:

1. horário aproximado e timezone;
2. `X-Request-ID`, quando disponível;
3. status HTTP e endpoint lógico, sem query string;
4. `event` e duração;
5. `lead_id`/`delivery_id` somente quando já presentes em evidência interna
   autorizada.

O Admin oferece a evidência persistida de `EmailDelivery`: status, tentativas,
próxima tentativa, código de erro sanitizado e timestamps. Não copiar o Lead
ou o corpo do e-mail para issue, PR ou documento.

## Health e readiness

### Latência observada e conexão PostgreSQL

O baseline operacional observado antes desta correção foi:

- `/health/`: aproximadamente 40–60 ms;
- `/health/ready/`: aproximadamente 3–5 s;
- Django Admin: aproximadamente 1,9–2,8 s por request;
- `POST /api/v1/leads/`: aproximadamente 12,35 s.

Como `/health/` não acessa PostgreSQL e readiness, Admin e Lead acessam banco
ou sessão, a hipótese operacional sustentada é o custo de abrir/fechar a
conexão PostgreSQL em cada request. A primeira correção conservadora é manter
conexão persistente curta em produção, com `CONN_MAX_AGE=30` e
`CONN_HEALTH_CHECKS=True`. A validação pós-deploy e qualquer ganho de
performance permanecem pendentes de medição real.

Na implementação anterior, a estimativa estrutural do happy path do POST era
de aproximadamente 20 statements SQL. Medição local posterior, com
`CaptureQueriesContext`, registrou **12 statements** no happy path atual:
quatro correspondentes aos rate limits atômicos e oito restantes à leitura,
duplicidade, persistência do Lead, deliveries e idempotência, incluindo dois
statements de controle transacional. O SMTP não faz parte do caminho crítico do
request; o envio ocorre posteriormente pelo processamento de deliveries. Esse
resultado é local e não declara ganho em produção: readiness, Admin e POST
deverão ser medidos novamente após o próximo deploy.

Uma medição local adicional registrou 1 statement no readiness e 5 statements
em cada uma das páginas changelist e detalhe do Admin, com tempos SQL locais
de 3–14 ms. Ela não reproduz a latência HomeHost/Neon e, portanto, não atribui
os picos observados a uma query específica.

Para uma amostra controlada após o próximo deploy, definir temporariamente
`DJANGO_DB_TIMING_ENABLED=True` no Setup Python App e reiniciar o Passenger.
Os eventos `request_completed` passam a registrar somente
`db_query_count` e `db_duration_ms`, sem SQL, PII ou secrets. Coletar uma
sequência de readiness, login/Admin, changelist, detalhe e POST controlado;
depois restaurar `DJANGO_DB_TIMING_ENABLED=False` e reiniciar o Passenger.

Verificar, sem criar Lead:

```text
GET https://api.repage.com.br/health/
GET https://api.repage.com.br/health/ready/
```

`health` indica que o processo responde. `readiness` verifica as dependências
críticas necessárias para receber leads. O workflow de deploy já executa esses
checks após publicação.

## Monitor horário

`.github/workflows/uptime.yml` faz GET, sem secrets e sem Environment
`production`, para:

- homepage;
- API health;
- API readiness.

O schedule é `17 * * * *`, com timeout e retries finitos. A execução horária
real fica pendente até o workflow estar na default branch/main; no PR é
validada somente a configuração.

## Falhas conhecidas

- ausência de `X-Request-ID` em uma resposta deve ser tratada como falha de
  observabilidade e investigada junto ao middleware;
- Passenger stderr pode conter erro operacional, mas não deve ser copiado
  integralmente para tickets;
- falha do uptime identifica o endpoint lógico, mas não substitui a análise de
  health/readiness e do Passenger;
- logging e uptime versionados ainda não constituem evidência de execução real
  em produção antes da implantação/main.

## Recuperação

Em indisponibilidade, confirmar primeiro o workflow Uptime e os três endpoints;
depois correlacionar horário, request ID e status com o Passenger stderr. Para
falhas de e-mail, consultar `EmailDelivery` no Admin e correlacionar
`delivery_id`/`lead_id` com os eventos sanitizados.

Não reiniciar, editar ou remover arquivos de produção sem o procedimento
aprovado de deploy/recuperação. Não apagar logs antes de preservar a evidência
sanitizada necessária.

## Evidências

Já comprovado:

- Passenger stderr disponível em `/home/re190924/repage_backend/stderr.log`;
- Raw Access de apex/API acessível pelo cPanel;
- arquivamento de Raw Access habilitado;
- X-Request-ID existente no contrato da API.

Ainda pendente:

- logs estruturados observados após implantação;
- execução horária real do workflow na default branch/main;
- correlação de uma ocorrência real sem expor PII.

## Segurança e privacidade

Nunca versionar ou publicar logs reais. Não registrar request body, query string,
nome, e-mail integral, telefone, mensagem, corpo de e-mail, senha, token,
secret, cookie, header Authorization, connection string, environment completo
ou exceção SMTP bruta. Sanitizar qualquer evidência antes de documentá-la.

## Referências

- [`production-deploy.md`](production-deploy.md)
- [`production-smtp-and-cron.md`](production-smtp-and-cron.md)
- [`../../.github/workflows/uptime.yml`](../../.github/workflows/uptime.yml)
