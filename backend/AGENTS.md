# Repage Backend — Instruções

## Escopo

Aplica-se a `backend/` e complementa [`../AGENTS.md`](../AGENTS.md). Consultar Produto, Arquitetura, ADR e spec antes de alterar modelos, API, persistência, proteção, e-mail, Admin, logs, deploy ou backups.

## Stack

Django, Django REST Framework, PostgreSQL, Django Admin e Passenger/WSGI em produção.

PostgreSQL é o banco principal em desenvolvimento e produção. Docker Compose pode fornecer apenas o banco local; Django e Vite ficam fora de containers. Não usar SQLite como banco principal.

## Apps

```text
backend/apps/
├── core/
└── leads/
```

`core`: health, readiness, logging, erros padronizados e utilitários transversais.

`leads`: modelos, API, validação, normalização, idempotência, proteção, e-mails, retentativas e Admin.

Não criar apps separados para `emails`, `notifications`, `api` ou `admin` sem domínio independente comprovado.

## Configuração

- segredos somente no ambiente;
- `.env.example` sem valores sensíveis;
- falhar claramente quando configuração crítica faltar;
- não usar fallback inseguro em produção;
- alinhar Python e dependências à hospedagem;
- não copiar dados reais para desenvolvimento.

## Modelos da V1

- `Lead`;
- `EmailDelivery`;
- `IdempotencyRecord`.

Não criar portfólio, CRM, cliente, projeto, pagamento ou contrato no backend da V1.

Lead registra UUID, nome, e-mail, WhatsApp, tipo de projeto, marca/negócio,
mensagem, `source`, `acquisition_source`, status, ciência e versão da política
e timestamps. Status vigentes: `new`, `in_progress`, `delivered`, `maintenance`
e `archived`. Arquivamento não é exclusão. `acquisition_source` é uma origem
comercial opcional, distinta da origem técnica `source`, usada na criação
manual.

EmailDelivery representa notificação interna ou confirmação ao visitante, com status `pending`, `sent` ou `failed`, tentativas, próxima tentativa, timestamps e erro sanitizado.

IdempotencyRecord registra chave, fingerprint, resposta segura, Lead, criação e expiração curta.

## API

```text
POST /api/v1/leads/
GET  /health/
GET  /health/ready/
```

Não expor listagem, detalhe, edição ou exclusão pública de leads. Administração ocorre pelo Django Admin.

Aceitar somente campos documentados, usar `snake_case`, limitar tamanho, normalizar, tratar mensagem como texto simples e retornar erros por campo, código estável, mensagem segura e `request_id`.

Não expor stack trace, SQL, configuração, SMTP ou segredos.

## Fluxo obrigatório do lead

1. validar formato e tamanho;
2. verificar honeypot;
3. verificar tempo mínimo;
4. aplicar throttling;
5. validar idempotência;
6. normalizar;
7. detectar repetição acidental;
8. persistir o Lead;
9. criar registros de entrega;
10. tentar notificação;
11. tentar confirmação;
12. registrar resultados;
13. responder.

Persistência bem-sucedida representa sucesso. Falha de e-mail não remove nem reverte o Lead.

Usar transação para Lead e registros necessários, sem manter transação aberta durante SMTP.

## Idempotência e duplicidade

- mesma chave e fingerprint retornam resposta segura anterior;
- mesma chave com payload diferente é rejeitada;
- retenção curta e configurável;
- repetição idêntica acidental não duplica;
- novo contato legítimo continua permitido;
- uma chave por tentativa do frontend.

## Proteção

Aplicar honeypot, tempo mínimo, limites, throttling por IP e contato, idempotência e detecção de repetição.

Limites são configuráveis e testados. IP pode ser usado temporariamente, sem persistência no Lead. Não adicionar geolocalização.

Cloudflare Turnstile somente diante de abuso real. Não usar CAPTCHA visível por padrão.

## E-mail

Notificação interna: remetente operacional, destinatário `contato@repage.com.br` e `Reply-To` com e-mail validado.

Confirmação: confirma recebimento sem prometer orçamento, aceite, resposta imediata ou prazo.

- persistir antes de enviar;
- timeout configurável;
- lógica desacoplada do provedor;
- registrar entrega;
- retentar;
- permitir reenvio no Admin;
- sanitizar erros;
- sem Celery ou Redis na V1;
- cron ou mecanismo simples validado.

Não registrar corpo integral do e-mail. Evitar processamento simultâneo da mesma entrega. Reenvio manual deve ser auditável.

## Django Admin

Admin é provisório. Exigir conta individual, senha forte, sem compartilhamento, sessão expirada, CSRF, HTTPS, cookies seguros, proteção de login e MFA/restrição adicional quando viável.

Oferecer listagem, filtros, busca, leitura protegida, arquivamento, inspeção de entregas, reenvio e exclusão definitiva apenas por ação explícita de privacidade.

Depois da criação, `email`, `whatsapp`, `project_type` e `status` podem ser
corrigidos in-place no mesmo Lead. Permanecem históricos e somente leitura:
`name`, `business_name`, `message`, `source`, `acquisition_source`, ciência e
versão da política, `id` e timestamps.

## Logs

Logs estruturados podem conter `request_id`, `lead_id`, evento, resultado, status HTTP, código de erro, timestamp, duração e tentativa.

Não registrar formulário completo, telefone/e-mail integrais, corpo de e-mail, segredo, credencial, token ou detalhe interno. Mascarar dados pessoais. Não usar `print` como observabilidade.

## Health

`/health/` verifica processo. `/health/ready/` verifica banco e dependências críticas para receber lead.

Respostas rápidas, sem dados sensíveis, com status coerente e testes. Não depender de SMTP opcional.

## Segurança e privacidade

- CORS restrito por ambiente;
- endpoint de leads público sem sessão;
- Admin com sessão e CSRF;
- HTTPS;
- cookies `Secure`, `HttpOnly`, `SameSite=Lax`;
- CSP, proteção contra framing, Referrer-Policy, Permissions-Policy e nosniff;
- HSTS após estabilização;
- segredos fora do Git;
- sem uploads na V1;
- `DEBUG=False` e hosts explícitos em produção.

Coleta mínima, acesso restrito, política registrada com versão e nenhuma criação de perfil analítico no backend. Retenção de leads permanece pendente e exige atualização documental quando definida.

## Migrations

Modelos e migrations versionadas são a fonte do schema. Não editar banco manualmente nem migration já aplicada.

Antes de concluir:

```bash
python manage.py makemigrations --check --dry-run
```

Revisar lock, duração, reversibilidade e compatibilidade. Backup antes de mudança destrutiva. Rollback de código não reverte banco automaticamente. Procedimento de produção pertence a operações.

## Testes

Cobertura: criação, validação, limites, normalização, honeypot, tempo mínimo, throttling, idempotência, conflito de chave, duplicidade, persistência antes de e-mail, falhas, retentativas, Admin, logs, health, readiness, segurança e migrations.

Quando configurados:

```bash
python manage.py check
python manage.py makemigrations --check --dry-run
ruff check
pytest
```

Para produção:

```bash
python manage.py check --deploy
```

## Deploy e backups

Deploy deve usar dependências fixadas, segredos no ambiente, migrations controladas, restart do Passenger, health, readiness, smoke test e logs. Comandos específicos pertencem a runbook.

Backups devem permitir `pg_dump`, cópia externa controlada pela Repage, retenção, backup antes de destruição e teste de restauração. Não assumir que a hospedagem é suficiente nem afirmar backup sem evidência.

Quando banco, SMTP, cron, Passenger ou hospedagem não estiver disponível, listar o que foi validado e o que depende do ambiente.
