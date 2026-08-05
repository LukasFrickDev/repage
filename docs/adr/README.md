# Decisões arquiteturais — ADRs

## Finalidade

Esta pasta registra decisões técnicas estruturais, duradouras e com alternativas reais. A arquitetura vigente permanece consolidada em [`../ARCHITECTURE.md`](../ARCHITECTURE.md).

## Quando criar

Criar ADR para decisões como mudança de framework, prerender estrutural, banco, hospedagem, topologia, ferramenta de monorepo, CMS, portfólio dinâmico, autenticação, filas, substituição do Django Admin, backups ou garantia de persistência antes do e-mail.

Não criar para correção local, refatoração pequena, procedimento, critério de aceite, detalhe visual ou opção facilmente reversível.

## Nome

```text
NNNN-kebab-case-title.md
```

Não reservar números antecipadamente.

## Estrutura mínima

```markdown
# NNNN — Título

- Status:
- Data:
- Responsáveis:
- Substitui:
- Substituído por:

## Contexto
## Critérios
## Alternativas consideradas
## Decisão
## Consequências
## Riscos e mitigação
## Impacto de implementação
## Referências
```

## Status

- `proposed`
- `accepted`
- `superseded`
- `rejected`
- `deprecated`

Somente `accepted` orienta implementação.

## Mudança de decisão

Não reescrever um ADR aceito para apagar o histórico. Criar novo ADR, marcar o anterior como `superseded`, ligar ambos e atualizar Arquitetura, specs e operações afetadas.

A Arquitetura mostra o estado atual; o ADR preserva o motivo da escolha.

## Índice

| ADR | Status | Decisão |
|---|---|---|
| — | — | Nenhum ADR materializado |
