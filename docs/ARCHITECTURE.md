# Repage — Arquitetura
## Status
- **Status:** aprovado para implementação.
- **Última consolidação:** 14 de agosto de 2026.
- **Baseline documental:** `main`.
- **Responsabilidade:** stack, rotas, dados, backend, segurança, testes, ambientes, CI/CD, deploy e backups.
- **Memória completa:** página de Arquitetura no Notion.
Este documento registra arquitetura atual, arquitetura-alvo e limites duráveis. Procedimentos passo a passo pertencem a `docs/operations/`. Detalhes exclusivos de uma entrega pertencem a `docs/specs/`. Decisões estruturais futuras com alternativas reais pertencem a ADRs.
Decisão aprovada não significa funcionalidade já implementada.
## 1. Princípios
### 1.1 Simplicidade evolutiva
Resolver a V1 sem antecipar CRM, CMS, filas, autenticação própria ou painel administrativo customizado.
### 1.2 Preservação da base saudável
Evoluir o frontend existente. Não reconstruir sem necessidade comprovada.
### 1.3 Fonte única de dados
Evitar duplicação entre homepage, portfólio, cases, metadados, Open Graph e sitemap.
### 1.4 Persistência antes de integrações
Salvar o lead antes de tentar e-mail. Falha de e-mail não pode apagar o contato.
### 1.5 Coleta mínima e segurança por padrão
Coletar somente o necessário. Produção não pode depender de configuração permissiva de desenvolvimento.
### 1.6 GitHub como fonte oficial
Código, migrations, mídia estática e documentação vivem no GitHub. Hospedagem contém artefatos implantados e dados operacionais.
### 1.7 Operação verificável
Deploy, backup, restauração e health checks exigem evidência.
## 2. Arquitetura atual
Estado atual ao concluir a Entrega 9:
- React;
- TypeScript;
- Vite;
- Styled Components;
- Framer Motion;
- React Router;
- `PublicLayout` e roteamento público materializados;
- homepage definitiva implementada;
- `/portfolio` definitivo;
- seis cases públicos;
- fonte tipada de projetos;
- manifesto/readiness de mídia e publicação;
- testes frontend e Playwright Test configurados;
- backend Django/DRF materializado;
- PostgreSQL configurado como banco principal;
- `apps/core` e `apps/leads` materializados;
- API pública de Lead e Django Admin operacionais;
- formulário público integrado com persistência real;
- tokens em `frontend/src/styles/theme.ts`.
- prerender build-time com Vite e APIs estáticas do React 19;
- `StaticRouter` no prerender e `BrowserRouter` no cliente;
- hydration com `hydrateRoot`;
- Styled Components SSR com `ServerStyleSheet` e IDs determinísticos;
- HTML específico por rota, metadata central compartilhada, sitemap derivado dos projetos públicos, robots condicionado à indexação explícita e JSON-LD factual.
Dependências aprovadas para a arquitetura-alvo podem ainda não estar instaladas. O manifesto do projeto é a fonte do estado instalado.
## 3. Arquitetura-alvo
```text
/
├── .github/
│   └── workflows/
├── frontend/
├── backend/
├── docs/
├── AGENTS.md
├── README.md
└── .gitignore
```
Não introduzir ferramenta adicional de monorepo na V1.
## 4. Topologia pública
```text
https://repage.com.br
└── frontend público
https://www.repage.com.br
└── redirecionamento permanente
https://api.repage.com.br
├── /api/v1/
├── /admin/
├── /health/
└── /health/ready/
```
Domínio canônico:
```text
https://repage.com.br
```
## 5. Infraestrutura de produção
Direção aprovada:
- domínio `repage.com.br`;
- controle sob Lukas/Repage;
- frontend estático servido pela hospedagem;
- backend Django via Passenger/WSGI;
- PostgreSQL;
- e-mails profissionais;
- GitHub Actions para CI e deploy.
Direção de hospedagem:
- HomeHost Python Start;
- frontend estático e backend Django via Passenger/WSGI na conta validada.
- Python `3.12.13`;
- app root `/home/re190924/repage_backend`;
- virtualenv `/home/re190924/virtualenv/repage_backend/3.12/`.
Banco de produção:
- PostgreSQL permanece a engine estrutural;
- Neon é o provedor atual, por incompatibilidade do PostgreSQL 13.23 nativo da HomeHost com Django 5.2;
- topologia: `Django/HomeHost → PostgreSQL/Neon`.
A arquitetura não depende do registrador de domínio escolhido.
## 6. Condicionantes da hospedagem
Validações operacionais já realizadas incluem Python `3.12.13`, SSH/SFTP por
chave, restart do Passenger, HTTPS da API, conexão TLS ao Neon, SMTP real,
cron de teste, acesso a logs e diretório local de backup. Workflows, deploy
automatizado, retenção e runbooks continuam pertencendo à Entrega 10.
## 7. Frontend
Stack aprovada:
- React;
- TypeScript;
- Vite;
- Styled Components;
- Framer Motion;
- React Router;
- React Hook Form;
- Zod;
- Fetch API encapsulada.
Decisões:
- sem Redux na V1;
- estado local como padrão;
- `ConsentProvider` como contexto global justificado;
- sem Axios;
- um `PublicLayout`;
- componentes por diretório;
- testes próximos quando aplicável;
- mídia estática na V1.
## 8. Organização do frontend
```text
frontend/src/
├── app/
├── assets/
├── components/
├── data/
│   └── projects/
├── features/
│   ├── consent/
│   └── lead-form/
├── pages/
├── sections/
│   └── home/
├── services/
│   ├── analytics/
│   └── api/
├── styles/
├── types/
└── utils/
```
Responsabilidades:
- `app`: roteador, providers, layout e boundaries;
- `assets`: fontes, marca e ativos comuns;
- `components`: componentes compartilhados;
- `data/projects`: fonte única e seletores;
- `features/consent`: preferências e carregamento condicionado;
- `features/lead-form`: schema, estados e integração;
- `pages`: composição por rota;
- `sections/home`: seções exclusivas da homepage;
- `services/api`: cliente HTTP, erros e idempotência;
- `services/analytics`: eventos e consentimento;
- `styles`: tokens, estilos globais e utilitários;
- `types`: apenas tipos realmente transversais;
- `utils`: utilitários reutilizados.
## 9. Rotas públicas
```text
/
/portfolio
/portfolio/:slug
/privacidade
/cookies
/*
```
A rota curinga apresenta 404 própria.
## 10. Âncoras da homepage
```text
/#servicos
/#processo
/#sobre
/#contato
```
Requisitos:
- funcionar a partir de qualquer rota;
- posicionar a seção;
- mover foco;
- respeitar movimento reduzido;
- preservar histórico coerente;
- evitar salto incorreto por carregamento tardio.
Todos os CTAs internos de orçamento apontam para `/#contato`.
## 11. PublicLayout
Responsável por:
- header;
- navegação;
- footer;
- skip link;
- conteúdo principal;
- consentimento;
- restauração de scroll e foco;
- boundaries aplicáveis.
Páginas legais e cases compartilham o layout sem obrigatoriamente compartilhar a mesma composição.
## 12. Portfólio
O portfólio da V1 é:
- estático;
- tipado;
- versionado;
- mantido no frontend.
Não haverá:
- modelo Django;
- API de projetos;
- CMS;
- CRUD administrativo;
- upload dinâmico.
## 13. Fonte única de projetos
Existe uma fonte pública tipada para identidade e conteúdo editorial dos projetos e uma camada/manifesto tipado de readiness, evidência e mídia. Seletores e gate combinam essas fontes; os mesmos dados não devem ser mantidos manualmente em listas paralelas.

A fonte compartilhada alimenta:
- três destaques;
- seis cards;
- seis cases;
- metadados;
- Open Graph;
- sitemap;
- navegação anterior/próximo;
- ordem e destaque.
O conteúdo editorial pode conter, quando aplicável:
- slug;
- título;
- natureza;
- tipo;
- status de publicação;
- destaque;
- ordem;
- resumo;
- contexto;
- desafio;
- solução;
- participação;
- serviços;
- funcionalidades;
- tecnologias;
- galeria;
- URL pública opcional;
- seleção de mídia;
- metadados da rota;
- `predatesRepage`, somente quando houver confirmação explícita.

Autorização, fonte da autorização, revisão de privacidade, estado de mídia, origem, dimensões, poster, fallback e demais evidências pertencem ao manifesto/camada de prontidão e não devem ser duplicados na fonte editorial. `predatesRepage` é opcional; sua ausência não permite inferir relação temporal com a Repage.

O publication gate combina conteúdo editorial e readiness antes da exposição pública. Homepage, portfólio, cases, ordem e, futuramente, SEO/sitemap derivam dessas fontes compartilhadas.
## 14. Integridade do portfólio
Build ou testes devem detectar:
- slug duplicado;
- ordem inválida;
- destaque inválido;
- mídia obrigatória ausente;
- case incompleto;
- URL inválida;
- natureza inválida;
- falha no readiness ou na autorização aplicável;
- metadado ausente.
Não publicar case final incompleto: seletores públicos só retornam projetos aprovados pelo gate combinado de conteúdo e readiness.
## 15. Imagens e vídeos
Na V1, mídias são estáticas, otimizadas e versionadas.
Imagens devem ter:
- dimensões conhecidas;
- texto alternativo;
- proporção;
- compressão;
- lazy loading quando aplicável;
- prioridade controlada.
Vídeos devem ser:
- curtos;
- sem áudio automático;
- com poster;
- com fallback;
- sem autoplay simultâneo;
- desativados ou estabilizados com movimento reduzido;
- não essenciais para compreensão.
## 16. Cloudinary
Cloudinary é provedor preferencial futuro para mídia dinâmica, uploads e transformações.
Não é dependência da V1. Introdução futura exige avaliar segurança, privacidade, custos, cache, autorização e modelo de dados.
## 17. SEO e renderização
Cada rota pública deve possuir:
- HTML específico;
- título;
- descrição;
- canonical;
- Open Graph;
- Twitter Card;
- imagem social quando aplicável.
Cases usam dados da fonte única.
## 18. Prerender
Decisão aceita no [`ADR 0001`](adr/0001-vite-static-prerender.md):
- Vite SSG/build-time prerender;
- React static APIs, `StaticRouter` e `hydrateRoot`;
- manter React e Vite;
- não migrar para Next.js na V1;
- sem SSR runtime;
- frontend final continua estático.

Essa decisão foi implementada na Entrega 9. O pipeline integra o prerender ao build, gera HTML por rota e case, valida outputs obrigatórios e falha diante de inconsistências. O frontend final continua estático e sem runtime SSR; a configuração da hospedagem para servir os diretórios e `404.html` permanece na Entrega 10.
## 19. Sitemap, robots e dados estruturados
Sitemap é gerado a partir de rotas estáticas e projetos publicados por `listPublicProjects()`, sem lista duplicada, excluindo legais, 404 e projetos não publicáveis. `robots.txt` é condicionado à configuração explícita de indexação: ambientes SAFE usam `Disallow: /`, enquanto o modo indexável permite a raiz e aponta para o sitemap canônico. `robots.txt` não substitui controle de acesso.
JSON-LD factual e compartilhado entre SPA e prerender representa organização, site e breadcrumbs quando aplicável. A metadata central também alimenta SPA e HTML estático. O build valida outputs, metadata, canonical, sitemap, robots e structured data antes de concluir.
## 20. Resiliência do frontend
Implementar:
- Error Boundary;
- 404;
- loading;
- erro;
- fallback de mídia;
- conteúdo útil sem terceiros;
- case útil se o projeto externo estiver indisponível.
## 21. Backend
Stack:
- Django;
- Django REST Framework;
- PostgreSQL;
- Django Admin;
- Passenger/WSGI.
## 22. Organização do backend
```text
backend/
├── apps/
│   ├── core/
│   └── leads/
├── config/
├── manage.py
└── tests/
```
`core` concentra health, readiness, logging, request ID, erros transversais e utilitários compartilhados.
`leads` concentra modelos, migrations, serializers, validação, normalização, API, proteção, idempotência, e-mail, retentativa e Admin.
Não criar apps separados para `emails`, `notifications`, `api` ou `admin` na V1.
## 23. Banco
PostgreSQL é o banco principal em desenvolvimento e produção.
Em produção, o banco é PostgreSQL 18 no Neon; a HomeHost hospeda a aplicação e
conecta ao Neon por TLS. A engine permanece portável para outro PostgreSQL
compatível.
Docker Compose pode fornecer PostgreSQL local. Django e Vite permanecem fora de containers.
SQLite não é banco principal.
Dados reais de produção não são copiados para desenvolvimento.
## 24. Modelo Lead
Campos semânticos aprovados:
- `id`: UUID;
- `name`;
- `email`;
- `whatsapp`;
- `project_type`;
- `business_name`;
- `message`;
- `source`;
- `acquisition_source`;
- `status`;
- `privacy_policy_acknowledged`;
- `privacy_policy_version`;
- `created_at`;
- `updated_at`.
Código e API usam inglês e `snake_case`.
Tipos de projeto:
- landing page;
- site institucional;
- solução personalizada;
- suporte ou evolução;
- ainda não sabe.
Status da V1:
- `new`;
- `in_progress`;
- `delivered`;
- `maintenance`;
- `archived`.
O status representa somente o valor operacional atual. Não há transições
rígidas, histórico, eventos ou pipeline de CRM nesta V1. `archived` não
significa exclusão.

`Lead.source` possui somente `website` e `manual`: a API pública cria apenas Leads
com `website`, enquanto `manual` é reservado à criação administrativa autenticada.
Ciência e versão da Política de Privacidade pertencem ao fluxo público e não são
falsificadas em Leads manuais.
`source` representa a entrada técnica no sistema. `acquisition_source` é um
texto livre opcional, limitado a 160 caracteres, para registrar a origem
comercial de Leads manuais; recebe apenas trim, não possui enum ou tabela
separada, e fica somente leitura após a criação. Leads públicos mantêm esse
campo vazio e a API não o aceita.
## 25. Modelo EmailDelivery
Relaciona-se ao Lead e representa:
- `internal_notification`;
- `visitor_confirmation`.
Status:
- `pending`;
- `sent`;
- `failed`.
Registra:
- tentativas;
- próxima tentativa;
- último erro sanitizado;
- timestamps;
- data de envio.
É criado somente para Leads públicos. A criação manual de Lead não cria
delivery nem dispara e-mail. `next_attempt_at` pode ser nulo em deliveries
enviadas ou em falha terminal.
## 26. Modelo IdempotencyRecord
Registra:
- chave;
- fingerprint;
- resposta segura;
- Lead;
- criação;
- expiração.
Retenção inicial curta, configurável, com referência aproximada de 24 horas.
O payload persistido é a resposta pública sem `request_id` e sem PII; replay
reutiliza o registro, mas recebe o `request_id` da requisição atual.
## 27. API pública
Base:
```text
https://api.repage.com.br/api/v1/
```
Endpoints:
```text
POST /api/v1/leads/
GET  /health/
GET  /health/ready/
```
Não criar endpoint público de listagem, detalhe, edição, arquivamento, exclusão, entregas ou idempotência.
## 28. Contrato de criação
Cabeçalhos relevantes:
```text
Content-Type: application/json
Idempotency-Key: <valor por tentativa>
```
Corpo semântico:
```json
{
  "name": "string",
  "email": "string",
  "whatsapp": "string",
  "project_type": "string",
  "business_name": "string opcional",
  "message": "string opcional",
  "privacy_policy_acknowledged": true,
  "privacy_policy_version": "string",
  "source": "string controlada"
}
```
Na API pública, `source` é obrigatoriamente `website`; `manual` é exclusivo do Admin autenticado.
Campos de proteção podem existir sem aparecer na experiência visível.
O código HTTP e o envelope final devem ser consolidados na spec da API, sem alterar a semântica aprovada.
## 29. Respostas
Sucesso significa:
- Lead persistido;
- registros de entrega criados;
- e-mail tentado ou registrado para recuperação.
A resposta contém somente informação segura para confirmar recebimento e evitar reenvio desnecessário.
Erros devem possuir:
- código estável;
- mensagem segura;
- erros por campo quando aplicável;
- `request_id`.
Não expor stack trace, SQL, caminho interno, configuração, segredo, dado administrativo ou erro SMTP.
## 30. Fluxo obrigatório do lead
1. validar formato;
2. validar tamanho;
3. verificar honeypot;
4. verificar tempo mínimo;
5. aplicar throttling;
6. validar idempotência;
7. normalizar;
8. detectar repetição acidental;
9. persistir Lead;
10. criar EmailDelivery;
11. tentar notificação interna;
12. tentar confirmação;
13. registrar resultados;
14. responder.
Persistência bem-sucedida representa sucesso para o visitante.
## 31. Transações e duplicidade
A transação inclui Lead, registros de entrega e associação de idempotência quando aplicável.
SMTP não deve manter transação longa aberta.
Cada solicitação legítima cria um Lead. Prevenir clique duplo, retry e repetição idêntica acidental sem bloquear novo contato legítimo.
## 32. Normalização
Aplicar:
- trim;
- normalização adequada de e-mail;
- WhatsApp brasileiro em formato internacional;
- tipo controlado;
- mensagem em texto simples;
- origem controlada;
- limites de tamanho.
Não permitir HTML ativo.
## 33. Honeypot, tempo mínimo e throttling
Honeypot não deve prejudicar tecnologia assistiva.
Tempo mínimo deve reduzir automação trivial sem bloquear autofill ou usuários legítimos.
Throttling aplica-se por IP e contato normalizado.
Referências iniciais configuráveis:
- 5 tentativas por IP em 10 minutos;
- 20 por IP ao dia;
- 3 por e-mail ou telefone em 30 minutos.
São valores iniciais, não constantes irrevogáveis.
IP pode ser usado para proteção sem armazenamento permanente no Lead.
## 34. CAPTCHA
Não usar CAPTCHA visível no início.
Cloudflare Turnstile é opção futura apenas diante de abuso real, com avaliação de privacidade, acessibilidade, consentimento e disponibilidade.
## 35. E-mail
Notificação interna:
- remetente configurado em `EMAIL_FROM_ADDRESS`;
- destinatário configurado em `EMAIL_INTERNAL_RECIPIENT`;
- `Reply-To` com o e-mail validado.
Confirmação ao visitante:
- confirma recebimento;
- identifica a Repage;
- não promete orçamento;
- não promete aceite;
- não promete resposta imediata;
- não promete prazo.
Não inserir HTML ativo fornecido pelo visitante.
## 36. Provedor e falhas
SMTP da hospedagem pode ser inicial se atender autenticação, TLS, SPF, DKIM, DMARC, limites e entregabilidade.
A lógica permanece desacoplada do provedor.
Timeout inicial de referência:
- 5 segundos;
- configurável.
Falhas atualizam EmailDelivery, preservam Lead, registram código sanitizado e permitem recuperação.
## 37. Retentativas
Política inicial de referência:
1. imediata;
2. aproximadamente 15 minutos;
3. aproximadamente 1 hora;
4. aproximadamente 6 horas;
5. aproximadamente 24 horas.
Sem Celery e Redis. Execução por cron ou mecanismo simples validado.
Reenvio manual no Admin deve ser explícito, protegido, auditável e evitar duplicidade acidental.
O retry é executável pelo management command `process_email_retries`; a
configuração de scheduler/cron real permanece pendente da Entrega 10. O Admin
reutiliza a mesma delivery e permite reenvio manual somente para falhas.
## 38. Django Admin
Admin provisório da V1.
Recursos:
- listagem;
- filtros;
- busca;
- visualização;
- criação manual de Lead;
- arquivamento;
- inspeção de entregas;
- reenvio;
- exclusão definitiva explícita por privacidade.
Proteção:
- conta individual;
- senha forte;
- sem compartilhamento;
- HTTPS;
- CSRF;
- sessão expirada;
- cookies seguros;
- proteção de login;
- logs de ações;
- MFA ou restrição adicional quando viável.
No Django Admin, `email`, `whatsapp`, `project_type` e `status` podem ser
corrigidos in-place no mesmo Lead, com normalização compartilhada e atualização
normal de `updated_at`. Os demais dados originais permanecem somente leitura,
incluindo a mensagem, que continua disponível no detalhe. A V1 não mantém
histórico de alterações administrativas, audit log customizado ou cópia paralela.
Leads manuais usam `source=manual`, status inicial `new` e não registram ciência ou versão de Política de Privacidade.
`source` permanece a entrada técnica (`website` ou `manual`); `acquisition_source`
registra origem comercial opcional de Leads manuais, fica readonly após a criação
e é pesquisável. A Entrega 6 futura refinará visual e ergonomicamente este
Django Admin, sem introduzir painel React ou autenticação própria.
## 39. Privacidade e consentimento
Categorias:
- necessários;
- analíticos;
- publicitários.
Consentimento geral permanece no navegador na V1.
Backend armazena somente ciência e versão da Política de Privacidade ligadas ao formulário.
Não criar banco de preferências de cookies nem perfil analítico do visitante.
## 40. Analytics e Ads
Google Analytics carrega conforme consentimento analítico.
Eventos previstos:
- clique em orçamento;
- acesso ao portfólio;
- acesso a case;
- clique em projeto externo;
- início do formulário;
- sucesso e erro;
- clique no WhatsApp;
- alteração de consentimento.
Nomes finais devem ser centralizados.
Não enviar nome, e-mail, telefone, mensagem, empresa identificável, ID do Lead ou conteúdo dos campos.
Google Ads fica preparado, mas nenhuma tag é ativada automaticamente. Quando houver campanha, revisar consentimento, política e conversões.
Candidatas:
- envio persistido como conversão principal;
- clique no WhatsApp como secundária.
## 41. Segurança
- CORS restrito por ambiente;
- endpoint de leads público sem sessão;
- Admin com sessão e CSRF;
- HTTPS obrigatório;
- cookies administrativos `Secure`, `HttpOnly` e `SameSite=Lax`;
- CSP restritiva e evolutiva;
- proteção contra framing;
- `Referrer-Policy`;
- `Permissions-Policy`;
- `X-Content-Type-Options`;
- HSTS após estabilização;
- segredos fora do Git;
- credenciais de deploy no GitHub Environment;
- sem uploads;
- sem geolocalização;
- `DEBUG=False`;
- hosts explícitos.
Qualquer variável `VITE_*` é pública e não contém segredo.
## 42. Logs e request ID
Logs estruturados podem conter:
- `request_id`;
- `lead_id`;
- evento;
- resultado;
- status HTTP;
- código de erro;
- timestamp;
- duração;
- tentativa.
Não podem conter formulário completo, telefone ou e-mail integrais, corpo do e-mail, segredo ou credencial.
Dados pessoais necessários devem ser mascarados.
Cada requisição deve possuir ID de correlação gerado ou recebido de proxy confiável e seguro.
## 43. Observabilidade
Mínimo da V1:
- logs acessíveis;
- health;
- readiness;
- smoke test;
- verificação de disponibilidade;
- inspeção de falhas de e-mail;
- revisão de backup.
Plataforma externa não é obrigatória e deve considerar custo e privacidade.
## 44. Health checks
`GET /health/` verifica o processo Django.
`GET /health/ready/` verifica banco e dependências críticas para receber lead.
Devem ser rápidos, sem dados sensíveis, com status coerente e testes. SMTP não deve tornar health básico indisponível.
## 45. Ambientes
Ambientes permanentes:
- development;
- production.
Não haverá staging permanente na V1.
Development:
- Vite;
- Django;
- PostgreSQL por Docker Compose;
- dados fictícios;
- e-mail seguro ou simulado;
- indexação bloqueada.
Production:
- domínio real;
- PostgreSQL real;
- SMTP real;
- HTTPS;
- segredos;
- consentimento;
- backups;
- monitoramento;
- Admin protegido.
## 46. Variáveis de ambiente
Categorias:
- Django;
- banco;
- origens;
- SMTP;
- domínio;
- segurança;
- throttling;
- retenção;
- Analytics público;
- deploy.
Manter `.env.example` sem valores sensíveis. Não reutilizar segredos entre ambientes.
Os endereços operacionais são sempre lidos de `EMAIL_FROM_ADDRESS` e
`EMAIL_INTERNAL_RECIPIENT`; development/test usa locmem e production usa o
backend SMTP nativo configurado por ambiente. Nenhum endereço deve ser
espalhado por services, views, templates ou testes de produção.
## 47. Desenvolvimento local
Docker Compose somente para PostgreSQL, com imagem compatível, porta, volume, health e credenciais locais.
Arquivo `.http` versionado é recomendado para inspeção manual. Postman é opcional.
Não versionar token nem dado pessoal em exemplos.
## 48. Testes
Frontend:
- schema;
- normalização;
- projetos;
- metadados;
- consentimento;
- API;
- estados;
- rotas;
- acessibilidade;
- movimento reduzido.
Backend:
- modelos;
- serializers;
- API;
- validação;
- idempotência;
- throttling;
- duplicidade;
- persistência;
- e-mail;
- retentativas;
- Admin;
- logs;
- health;
- readiness;
- migrations.
Playwright é a direção aprovada para jornadas críticas quando configurado.
Cenários E2E:
- navegação;
- portfólio;
- case;
- contato;
- validação;
- envio;
- sucesso;
- falha;
- consentimento;
- teclado;
- mobile.
## 49. Qualidade visual
Validar desktop amplo, notebook, tablet, mobile, viewport baixa, movimento reduzido, foco, teclado, rede, console, overflow e mídia indisponível.
## 50. CI
GitHub Actions valida pull requests e `main`.
Frontend:
- instalação reproduzível;
- lint;
- typecheck quando configurado;
- testes quando configurados;
- build;
- prerender quando configurado.
Backend:
- instalação;
- `check`;
- migrations;
- ruff;
- pytest.
Documentação:
- caminhos;
- arquivos obrigatórios;
- ausência do brief obsoleto;
- links quando houver ferramenta adequada.
## 51. Branches e produção
Branches por fase ou entrega.
Exemplos:
```text
feat/frontend-foundation
feat/portfolio
feat/backend-leads
feat/lead-form
feat/email-delivery
feat/consent-analytics
feat/seo-prerender
chore/production-deploy
```
`main` representa produção. Deploy ocorre após CI, revisão, merge e validação do ambiente.
## 52. Deploy do frontend
Invariantes:
1. build;
2. prerender;
3. validação de `dist`;
4. assets versionados antes do HTML;
5. HTML substituído por último;
6. sem remoção indiscriminada do diretório público;
7. verificação das rotas;
8. domínio canônico;
9. smoke test.
Comandos específicos pertencem a runbook.
## 53. Deploy do backend
Invariantes:
1. alinhar Python;
2. instalar dependências fixadas;
3. sincronizar código;
4. ativar ambiente;
5. validar configuração;
6. executar migrations;
7. coletar estáticos do Admin quando necessário;
8. reiniciar Passenger;
9. health;
10. readiness;
11. smoke test;
12. logs.
## 54. Migrations e rollback
Antes de migration destrutiva:
- revisar;
- criar backup;
- avaliar lock;
- avaliar compatibilidade;
- definir recuperação.
Falha interrompe deploy.
Rollback geral ocorre por revert de commit e novo deploy. Rollback de código não reverte banco automaticamente. Migration irreversível exige plano explícito.
## 55. Backups
A Repage é responsável por garantir e verificar backups.
Requisitos:
- `pg_dump`;
- cópia externa controlada;
- retenção;
- periodicidade;
- backup antes de destruição;
- teste de restauração;
- controle de acesso;
- proteção;
- evidência.
Backup da hospedagem não substitui cópia externa. GitHub protege código e mídia versionada, não o banco.
Prazo final de retenção permanece pendente.
## 56. Plano de transição
### Fundação documental
- adicionar documentos;
- adicionar `AGENTS.md`;
- remover brief antigo;
- preservar baseline.
### Fundação do frontend
- React Router;
- `PublicLayout`;
- rotas;
- 404;
- preservar visual saudável.
### Portfólio
- tipo `Project`;
- fonte única;
- listagem;
- cases;
- seis projetos.
### Backend e formulário
- Django;
- PostgreSQL;
- modelos;
- Admin;
- health;
- API;
- React Hook Form;
- Zod;
- proteção;
- idempotência;
- estados.
### E-mails e consentimento
- templates;
- SMTP;
- entregas;
- cron;
- reenvio;
- provider de consentimento;
- políticas;
- eventos.
### SEO, infraestrutura e lançamento
- prerender;
- sitemap;
- robots;
- metadados;
- domínio;
- hospedagem;
- DNS;
- SSL;
- CI/CD;
- backup;
- testes;
- acessibilidade;
- produção.
As etapas representam dependências técnicas, não roadmap comercial. Specs devem delimitar cada entrega.
## 57. Riscos
### Limites da hospedagem e do provedor
Mitigar mantendo portabilidade, evitando acoplamento ao cPanel/Neon e
registrando as capacidades ainda não implementadas em workflows e runbooks.
### SMTP inadequado
Mitigar com abstração, registros persistidos, retentativas e possibilidade de troca.
### Falha após persistência
Mitigar com Lead salvo, EmailDelivery, Admin, reenvio e logs.
### Deploy estático inconsistente
Mitigar com assets antes do HTML, validação, smoke test e rollback.
### Migration destrutiva
Mitigar com revisão, backup, compatibilidade e plano.
### Mídia pesada
Mitigar com dimensões, compressão, lazy loading, poster e prioridade.
### Consentimento incorreto
Mitigar com categorias, padrão desativado, testes e revisão.
### Dados pessoais em logs
Mitigar com estrutura, mascaramento, testes e revisão.
### Portfólio incompleto
Mitigar com validação, autorização e bloqueio de publicação.
### Retenção indefinida
Mitigar definindo antes da produção e alinhando exclusão e backups.
## 58. Decisões adiadas
- migração futura para outro provedor PostgreSQL compatível;
- provedor alternativo de e-mail;
- prazo de retenção de leads;
- prazo de retenção de backups;
- MFA do Admin;
- observabilidade externa;
- Turnstile diante de abuso;
- Cloudinary;
- CMS;
- painel próprio;
- autenticação;
- filas;
- staging permanente.
## 59. Candidatos a ADR
Criar ADR futuro para:
- migração de framework;
- troca permanente de banco;
- mudança de topologia;
- mudança de hospedagem;
- CMS ou portfólio dinâmico;
- Celery ou Redis;
- autenticação própria;
- substituição do Admin;
- ferramenta de monorepo;
- mudança da política de backups;
- mudança da persistência antes do e-mail.
Não criar ADR retroativo para cada decisão já consolidada.
## 60. Pendências técnicas
- Implementar e validar workflows e runbooks de produção na HomeHost/Neon.
- Confirmar limites da hospedagem.
- Definir retenção de leads e backups.
- Revisar políticas.
- Aprovar conteúdo dos e-mails.
- Concluir mídias dos cases.
- Materializar os runbooks da Entrega 10 com as evidências já coletadas.
