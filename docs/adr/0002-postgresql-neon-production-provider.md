# 0002 — PostgreSQL com Neon como provedor de produção atual

- **Status:** accepted
- **Data:** 17 de agosto de 2026
- **Responsável:** Lukas Frick
- **Substitui:** —
- **Substituído por:** —

## Contexto

A Repage usa Django 5.2 e PostgreSQL como engine estrutural. A validação da
conta HomeHost confirmou PostgreSQL 13.23, incompatível com o requisito de
produção do Django 5.2. A aplicação permanece hospedada na HomeHost, mas o
banco de produção precisa ser PostgreSQL compatível e acessível por TLS.

## Critérios

A decisão deve:

1. preservar Django 5.2 e PostgreSQL;
2. oferecer compatibilidade com a aplicação e seus backups;
3. manter a aplicação na HomeHost;
4. permitir backup, restauração e migração futura verificáveis;
5. evitar dependência estrutural irreversível de um provedor.

## Alternativas consideradas

### A. PostgreSQL 13.23 na HomeHost com downgrade de Django

Rejeitada. Exigiria reduzir a versão do Django para acomodar a limitação da
engine disponível e contrariaria a baseline aprovada.

### B. MySQL na HomeHost

Rejeitada. Troca a engine estrutural, não atende à decisão vigente de manter
PostgreSQL e introduziria diferenças desnecessárias de comportamento e
portabilidade.

### C. Neon PostgreSQL

Aceita. Neon fornece PostgreSQL compatível, a HomeHost conecta ao serviço por
TLS e a toolchain cliente PostgreSQL 18.4 validou conexão, `pg_dump` e
restauração controlada.

## Decisão

PostgreSQL permanece a engine estrutural da Repage. O provedor de produção
atual é o Neon, com:

- projeto Repage;
- branch Neon `production`;
- região AWS eu-central-1 / Frankfurt;
- PostgreSQL 18;
- database `repage`;
- role/owner `repage_app`.

A topologia de produção é:

```text
Django/HomeHost → PostgreSQL/Neon
```

Frankfurt substituiu a região inicial de São Paulo após medições reais de latência HomeHost → Neon. Neon é uma escolha operacional atual, não uma dependência arquitetural
permanente. Uma futura migração para outro PostgreSQL compatível continua
possível por backup e restauração validados.

## Consequências

- Django não sofre downgrade e a aplicação não migra para MySQL.
- A HomeHost continua hospedando o frontend/backend e o Passenger/WSGI.
- Conexões de produção usam TLS até o Neon.
- Backups e restaurações devem usar clientes compatíveis com PostgreSQL 18;
  os clientes de sistema PostgreSQL 13.23 da HomeHost não são suficientes.
- A toolchain privada PostgreSQL 18.4 fica em
  `/home/re190924/tools/postgresql-18/`, sem substituir as ferramentas do
  sistema.
- O diretório local de backups fica em
  `/home/re190924/backups/repage/postgresql`, com permissão `700`.

## Riscos e mitigação

O provedor pode mudar disponibilidade, limites ou condições. Mitigar mantendo
PostgreSQL como contrato estrutural, documentando o procedimento de backup e
restore e evitando APIs específicas do Neon na aplicação.

Backups podem falhar por incompatibilidade de cliente. Mitigar fixando a
toolchain PostgreSQL 18.4 para as rotinas de produção e testando restauração.

## Impacto de implementação

Configuração de produção, workflows, cron, backups, smoke tests e runbooks
apontam para o PostgreSQL/Neon sem incluir segredos ou connection strings no
repositório. A Entrega 10 operacionalizou esses procedimentos; Neon continua
sendo substituível por outro PostgreSQL compatível mediante backup e restore.

## Referências

- [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md)
- [`docs/specs/0010-ci-cd-deploy-backups-observability.md`](../specs/0010-ci-cd-deploy-backups-observability.md)
- [`docs/operations/README.md`](../operations/README.md)
