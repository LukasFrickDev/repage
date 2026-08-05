# Repage — Instruções do repositório

## Escopo

Aplica-se a todo o repositório. `AGENTS.md` internos complementam estas regras, mas não podem relaxar segurança, privacidade, escopo, documentação ou qualidade.

Comunicar-se em português brasileiro, salvo instrução diferente. Manter código, identificadores, nomes técnicos, branches e commits em inglês.

## Contexto essencial

A Repage é um estúdio comercial de landing pages, sites institucionais e soluções digitais personalizadas. As três ofertas possuem o mesmo peso comercial. Suporte e evolução são complementares.

A marca é conduzida inicialmente por Lukas Frick. Não apresentá-la como equipe ampla, operação maior do que a realidade ou currículo pessoal.

O objetivo principal do site é gerar solicitações de orçamento. A conversão principal é o envio persistido do formulário; WhatsApp é alternativa.

## Fontes de verdade

- [`docs/PRODUCT.md`](docs/PRODUCT.md): público, oferta, jornadas, conteúdo, conversões, escopo e conclusão;
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): stack, rotas, dados, backend, segurança, testes, ambientes e deploy;
- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md): identidade, componentes, mídia, movimento, responsividade e acessibilidade;
- [`docs/adr/README.md`](docs/adr/README.md): decisões técnicas estruturais;
- [`docs/operations/README.md`](docs/operations/README.md): procedimentos operacionais;
- [`docs/specs/README.md`](docs/specs/README.md): entregas delimitadas.

O Notion preserva descoberta e justificativas. O repositório preserva decisões vigentes.

## Precedência

Instruções operacionais:

1. sistema e plataforma;
2. tarefa atual;
3. instruções globais do usuário;
4. `/AGENTS.md`;
5. `AGENTS.md` mais próximo.

Decisões do projeto:

1. documento responsável pelo assunto;
2. ADR aceito;
3. spec aprovada;
4. implementação existente quando não contradizer fontes superiores;
5. documentação histórica.

`AGENTS.md` define como trabalhar. Os documentos definem o que construir. Não resolver conflito silenciosamente.

Não reabrir decisão aprovada sem contradição real, risco relevante, inviabilidade comprovada ou mudança explícita de requisito.

## Antes de alterar

- inspecionar estrutura e arquivos afetados;
- verificar estado do Git e mudanças locais;
- ler os `AGENTS.md` aplicáveis;
- ler documentos, ADRs e specs relacionados;
- identificar validações existentes;
- avaliar impacto documental.

Mudança ampla exige plano conciso com objetivo, limites, riscos, arquivos, validações e documentação.

## Escopo da V1

Inclui homepage, portfólio com seis cases, três destaques, páginas legais, 404, formulário real, PostgreSQL, e-mails, preservação do lead, WhatsApp, Django Admin, consentimento, Analytics condicionado, preparação para Ads, prerender, SEO, responsividade, acessibilidade, testes, CI, deploy, health checks e backups verificados.

## Itens adiados

Não antecipar CRM, gestão completa de clientes ou projetos, pagamentos, contratos no painel, área do cliente, painel próprio, blog, preços, multilíngue, CMS, portfólio dinâmico, uploads, Cloudinary, Redux, Axios, ferramenta de monorepo, Celery, Redis, filas, autenticação própria ou CAPTCHA visível sem abuso comprovado.

## Estrutura

Monorepo simples:

```text
/
├── .github/workflows/
├── frontend/
├── backend/
├── docs/
├── AGENTS.md
├── README.md
└── .gitignore
```

Não adicionar ferramenta de monorepo na V1.

## Mudanças

- fazer mudanças mínimas e focadas;
- não realizar refatorações paralelas;
- não alterar áreas não relacionadas;
- preservar mudanças existentes do usuário;
- não descartar trabalho local;
- não executar operações destrutivas de Git sem pedido explícito;
- parar ao concluir o escopo.

## Veracidade

Não inventar clientes, projetos, métricas, resultados, depoimentos, equipe, URLs, funcionalidades, autorizações ou evidências. Projetos próprios e desafios não são clientes. Conteúdo provisório não pode parecer aprovado.

## Segurança e privacidade

- coletar somente o necessário;
- não expor dados pessoais em URLs, Analytics, console, logs ou respostas técnicas;
- não registrar formulário completo;
- manter segredos fora do Git e de `VITE_*`;
- não copiar produção para desenvolvimento;
- não publicar mídia com dados sensíveis;
- preservar CORS, CSRF, HTTPS, cookies e headers aprovados.

Mudança de privacidade, retenção, consentimento, segurança ou acesso administrativo exige atualização documental.

## Dependências

Antes de adicionar:

1. confirmar necessidade;
2. verificar manutenção, licença, tamanho, compatibilidade e segurança;
3. evitar sobreposição;
4. atualizar lockfile;
5. validar.

Dependência estrutural exige ADR. Não atualizar dependências fora do escopo.

## Documentação

Atualizar na mesma entrega quando mudar escopo, rota, contrato, modelo, fluxo do lead, consentimento, Analytics, segurança, deploy, backup, estrutura, dependência arquitetural, comportamento visual sistêmico ou definição de pronto.

Usar documento durável para regra vigente, ADR para decisão estrutural, operação para procedimento e spec para entrega delimitada. Não criar documentos vazios ou antecipar dezenas deles.

## Git

- branch e commits focados;
- `main` representa produção;
- tags somente em marcos;
- inspecionar o diff;
- não incluir artefatos ou segredos;
- não afirmar push, merge ou deploy sem evidência.

## Validações

Executar apenas comandos configurados e relevantes.

Frontend, quando aplicável:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Backend, quando aplicável:

```bash
python manage.py check
python manage.py makemigrations --check --dry-run
ruff check
pytest
```

Produção:

```bash
python manage.py check --deploy
```

Documentação: validar links, caminhos, coerência, fontes concorrentes, remoções e diff.

Se navegador, banco, SMTP ou ambiente não estiver disponível, relatar o bloqueio sem simular validação.

## Relatório final

Informar resumo, arquivos, validações, resultados, itens não validados, pendências, riscos e impacto documental. Não declarar “tudo funcionando” sem evidência.
