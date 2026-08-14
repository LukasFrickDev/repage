# Documentação da Repage

## Objetivo

Esta pasta contém as decisões vigentes necessárias para implementar, operar e evoluir a Repage.

- **Notion:** memória completa, descoberta, justificativas e histórico;
- **repositório:** decisões vigentes e limites;
- **ADR:** decisão técnica estrutural;
- **operação:** procedimento executável;
- **spec:** detalhes de uma entrega delimitada.

## Fontes de verdade

- [`PRODUCT.md`](PRODUCT.md): público, oferta, jornada, conversões, escopo e conclusão;
- [`ARCHITECTURE.md`](ARCHITECTURE.md): stack, rotas, dados, backend, segurança, ambientes, CI/CD e deploy;
- [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md): identidade, componentes, mídia, movimento, responsividade e acessibilidade.

## Ordem de leitura

1. `AGENTS.md` aplicável;
2. [`PRODUCT.md`](PRODUCT.md);
3. [`ARCHITECTURE.md`](ARCHITECTURE.md);
4. [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md), quando houver interface;
5. ADR aplicável;
6. spec aplicável;
7. operação aplicável.

## Precedência

Produto prevalece para público, oferta, jornada, conversão e escopo. Arquitetura prevalece para implementação, dados, segurança e deploy. Design System prevalece para experiência visual e acessibilidade.

ADR aceito substitui decisão técnica anterior. Spec detalha uma entrega sem redefinir silenciosamente documentos duráveis. Implementação existente não prevalece sobre decisão aprovada.

Conflitos reais devem ser relatados e corrigidos.

## Status atual

Última consolidação: **13 de agosto de 2026**.

Estado conhecido:

- baseline em `main`;
- frontend React/TypeScript/Vite/Styled Components existente;
- Framer Motion disponível;
- Entregas 1–4 concluídas, incluindo homepage definitiva, portfólio e seis cases;
- roteamento público já materializado;
- Entrega 5 — Backend, banco, API, Admin e formulário persistido — como próxima entrega;
- backend, banco, formulário persistido e demais entregas posteriores ainda pendentes;
- arquitetura-alvo documentada.

Não confundir arquitetura aprovada com funcionalidade já implementada.

## Índices

- [ADRs](adr/README.md)
- [Operações](operations/README.md)
- [Specs](specs/README.md)

## Tipos de documento

**Durável:** regra vigente e transversal.  
**ADR:** escolha técnica estrutural com alternativas e consequências.  
**Operação:** passos, validação e recuperação de um procedimento.  
**Spec:** escopo, estados e critérios de uma entrega.

Não criar um documento durável para cada feature nem dezenas de arquivos antecipadamente.

## Atualização

Quando uma implementação mudar uma decisão:

1. atualizar o documento responsável na mesma entrega;
2. criar ADR se a mudança for estrutural;
3. atualizar specs e operações afetadas;
4. verificar links e referências;
5. registrar o impacto no relatório final.

## Obsolescência

Documento histórico não deve permanecer como fonte concorrente.

Quando precisar permanecer temporariamente:

```text
Status: OBSOLETO
Substituído por: <caminho>
Data da substituição: YYYY-MM-DD
Não utilizar como fonte de implementação.
```

`frontend/docs/repage-site-brief.md` deve ser removido na mesma entrega em que esta fundação for adicionada. O histórico permanece no Git.
