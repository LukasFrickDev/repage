# Observabilidade de produção

- **Status:** validado operacionalmente em produção
- **Ambiente:** HomeHost Passenger + API pública + GitHub Actions
- **Responsável:** Lukas Frick
- **Última validação:** Passenger stderr, Raw Access, logs estruturados e execução Uptime validados
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

### Estado validado de saúde e conexão PostgreSQL

A observabilidade de produção foi validada com health, readiness no deploy/smoke, Admin, logs estruturados e fluxo de Lead/EmailDelivery. O endpoint `/health/` não consulta PostgreSQL; `/health/ready/` continua reservado a deploy, smoke e diagnóstico manual. A medição de performance detalhada permanece fora do fechamento desta entrega e não é usada como evidência de causa ou ganho.

Verificar, sem criar Lead:

```text
GET https://api.repage.com.br/health/
GET https://api.repage.com.br/health/ready/
```

`health` indica que o processo responde. `readiness` verifica as dependências
críticas necessárias para receber leads. O workflow de deploy já executa esses
checks após publicação.

## Monitor horário

`.github/workflows/uptime.yml` faz GET, sem secrets e sem Environment `production`, somente para:

- `https://repage.com.br/`;
- `https://api.repage.com.br/health/`.

`/health/ready/` não participa do schedule e permanece disponível para deploy, smoke e diagnóstico manual.

O schedule é horário, com timeout e retries finitos. A execução manual do workflow Uptime na `main` foi aprovada (run #40). Não há claim de observação prolongada do scale-to-zero; evitar chamadas recorrentes ao readiness preserva esse comportamento.

## Falhas conhecidas

- ausência de `X-Request-ID` em uma resposta deve ser tratada como falha de
  observabilidade e investigada junto ao middleware;
- Passenger stderr pode conter erro operacional, mas não deve ser copiado
  integralmente para tickets;
- falha do uptime identifica o endpoint lógico, mas não substitui a análise de health do processo e do Passenger;
- a observação prolongada de scale-to-zero não faz parte desta validação e fica para manutenção operacional.

## Recuperação

Em indisponibilidade, confirmar primeiro o workflow Uptime e os dois endpoints monitorados; depois correlacionar horário, request ID e status com o Passenger stderr. Para
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

Confirmado operacionalmente:

- Passenger stderr e Raw Access disponíveis;
- logs estruturados observados sem payload, PII ou segredo;
- homepage e `/health/` monitorados pelo workflow Uptime;
- `/health/ready/` preservado fora do schedule;
- execução manual do Uptime na `main` aprovada (run #40).

## Segurança e privacidade

Nunca versionar ou publicar logs reais. Não registrar request body, query string,
nome, e-mail integral, telefone, mensagem, corpo de e-mail, senha, token,
secret, cookie, header Authorization, connection string, environment completo
ou exceção SMTP bruta. Sanitizar qualquer evidência antes de documentá-la.

## Referências

- [`production-deploy.md`](production-deploy.md)
- [`production-smtp-and-cron.md`](production-smtp-and-cron.md)
- [`../../.github/workflows/uptime.yml`](../../.github/workflows/uptime.yml)
