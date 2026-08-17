# Procedimentos operacionais

## Finalidade

Esta pasta contém procedimentos executáveis de produção, manutenção e recuperação.

A Arquitetura define requisitos e invariantes. Um runbook define passos, acessos, validação, falhas e recuperação.

## Quando criar

Criar para deploy, rollback, backup, restauração, teste de restauração, migration em produção, rotação de segredos, SMTP, cron, indisponibilidade, manutenção ou DNS.

Não criar para tarefa local, decisão técnica, critério de aceite ou detalhe de feature.

## Nome

```text
production-deploy.md
production-rollback.md
postgres-backup.md
postgres-restore.md
production-migrations.md
```

Não criar arquivos vazios antecipadamente.

## Estrutura mínima

```markdown
# Título

- Status:
- Ambiente:
- Responsável:
- Última validação:
- Frequência:

## Objetivo
## Pré-condições
## Acessos necessários
## Procedimento
## Validação
## Falhas conhecidas
## Rollback ou recuperação
## Evidências
## Segurança e privacidade
## Referências
```

## Regras

- nunca registrar senha, token, chave, segredo, `.env`, dado pessoal ou backup real;
- informar ambiente, acesso, backup, estado esperado e janela;
- definir evidências observáveis;
- não considerar ausência de erro como única validação;
- explicar gatilho e impacto do rollback;
- lembrar que rollback de código não reverte banco;
- backup só é verificado após teste de restauração;
- atualizar o runbook quando ambiente, acesso, workflow, comando ou provedor mudar;
- registrar apenas validação realmente executada.

## Índice

| Procedimento | Ambiente | Última validação |
|---|---|---|
| [`production-deploy.md`](production-deploy.md) | HomeHost + Neon | Componentes operacionais validados; deploy end-to-end pendente |
| [`production-smtp-and-cron.md`](production-smtp-and-cron.md) | HomeHost Python App + SMTP | SMTP e mecanismo de cron validados; ativação final pendente |
| [`production-observability.md`](production-observability.md) | HomeHost + GitHub Actions | Componentes versionados; evidência de produção pendente |
