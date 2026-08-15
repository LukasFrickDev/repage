# Especificações de entregas

## Finalidade

Esta pasta contém specs de entregas delimitadas. Uma spec descreve objetivo, escopo, estados, cenários, critérios de aceite, dependências, validações e riscos.

Não substitui [`../PRODUCT.md`](../PRODUCT.md), [`../ARCHITECTURE.md`](../ARCHITECTURE.md) ou [`../DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md).

## Quando criar

Criar quando a entrega possui múltiplos estados, jornada, exceções, coordenação frontend/backend, migração, protótipo, produção de mídia ou critérios de aceite relevantes.

Exemplos futuros: rotas, portfólio, cases, formulário, API, e-mails, consentimento, Analytics, prerender, hero e projetos destacados.

Não criar para correção simples, texto pequeno, refatoração local, procedimento ou decisão arquitetural.

## Nome

```text
frontend-routing-foundation.md
portfolio-and-cases.md
lead-form.md
lead-api.md
hero-experience.md
```

Não criar uma spec por componente pequeno nem uma fila antecipada.

## Estrutura mínima

```markdown
# Título

- Status:
- Responsáveis:
- Data:
- Documentos relacionados:

## Contexto
## Objetivo
## Escopo
## Fora de escopo
## Jornada
## Requisitos
## Estados e cenários
## Erros e exceções
## Dados ou contratos
## Acessibilidade e responsividade
## Segurança e privacidade
## Critérios de aceite
## Validação
## Dependências
## Riscos e pendências
```

## Status

- `draft`
- `approved`
- `in_progress`
- `implemented`
- `cancelled`
- `superseded`

Somente spec aprovada orienta implementação planejada.

## Regras

- declarar o que entra e não entra;
- critérios devem ser observáveis e verificáveis;
- não usar “ficar bonito” ou “funcionar bem” como aceite;
- decisão estrutural encontrada exige ADR;
- mudança sistêmica exige atualização do documento durável;
- definir testes, viewports, erros e evidências;
- registrar bloqueios reais;
- ao concluir, ligar PR/commit e atualizar documentos relacionados.

## Índice

| Spec | Status | Entrega |
|---|---|---|
| [`0001-frontend-foundation-and-routing.md`](0001-frontend-foundation-and-routing.md) | `implemented` | Fundação do frontend, roteamento e caminho de conversão |
| [`0002-project-content-and-media-preparation.md`](0002-project-content-and-media-preparation.md) | `implemented` | Preparação de conteúdo e mídias dos projetos |
| [`0003-definitive-homepage.md`](0003-definitive-homepage.md) | `implemented` | Homepage definitiva |
| [`0004-portfolio-and-cases.md`](0004-portfolio-and-cases.md) | `implemented` | Portfólio e seis cases |
| [`0005-lead-intake-backend-and-form.md`](0005-lead-intake-backend-and-form.md) | `implemented` | Backend, persistência de leads e formulário |
