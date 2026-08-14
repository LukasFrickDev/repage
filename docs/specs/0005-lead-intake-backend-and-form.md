# 0005 — Backend, persistência de leads e formulário

- **Status:** approved
- **Responsável:** Lukas Frick
- **Data:** 14 de agosto de 2026
- **Branch-base:** `main`
- **Entrega do roadmap:** 5 — Backend, PostgreSQL, API, Admin e formulário
- **Specs predecessoras:** `0001-frontend-foundation-and-routing.md`, `0002-project-content-and-media-preparation.md`, `0003-definitive-homepage.md` e `0004-portfolio-and-cases.md`
- **Documentos relacionados:** `AGENTS.md`, `frontend/AGENTS.md`, `backend/AGENTS.md`, `docs/PRODUCT.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md` e `docs/ROADMAP.md`

## 1. Contexto

As Entregas 1–4 estão implementadas, validadas e integradas à `main`.

A Repage já possui:

- homepage definitiva;
- portfólio definitivo;
- seis cases;
- navegação pública;
- acessibilidade e responsividade;
- testes frontend;
- Playwright Test;
- conteúdo e mídia reais.

Ainda não existe implementação de backend.

Em `main`:

- `backend/` contém somente `AGENTS.md`;
- não existe projeto Django;
- não existe PostgreSQL configurado;
- não existe API;
- não existe modelo de Lead;
- não existe Django Admin operacional;
- não existe formulário funcional de solicitação de orçamento;
- a seção `#contato` contém somente a composição editorial aprovada;
- React Hook Form e Zod estão aprovados arquiteturalmente, mas ainda não instalados.

A conversão principal definida no Produto é:

> envio bem-sucedido e persistido da solicitação de orçamento.

A persistência do Lead define sucesso.

## 2. Fronteira com a Entrega 6

A Arquitetura e os AGENTS descrevem o fluxo final da V1, que inclui também:

- `EmailDelivery`;
- `IdempotencyRecord`;
- idempotência;
- detecção de repetição;
- honeypot;
- tempo mínimo;
- throttling;
- notificações por e-mail;
- confirmação ao visitante;
- retentativas;
- reenvio.

Esses itens pertencem à **Entrega 6 — E-mails, idempotência e proteção**.

A 0005 materializa somente o núcleo necessário para receber, validar e persistir um Lead real.

Nesta entrega, o fluxo termina em:

`formulário → validação → API → persistência do Lead → resposta`

A Entrega 6 posteriormente evolui esse fluxo para:

`formulário → proteção/idempotência → persistência → EmailDelivery → envio/retentativa → resposta`

Essa implementação incremental não altera a arquitetura-alvo.

## 3. Objetivo

Criar o primeiro fluxo funcional de conversão da Repage.

Ao final, um visitante deve conseguir:

1. preencher o formulário em `/#contato`;
2. receber validação clara;
3. enviar os dados para a API;
4. ter um Lead persistido no PostgreSQL;
5. receber confirmação visual somente após persistência;
6. encontrar o registro criado no Django Admin.

Também devem existir:

- backend Django/DRF funcional;
- banco PostgreSQL local;
- health check;
- readiness check;
- logs sanitizados;
- tratamento seguro de erros;
- integração frontend/backend;
- estados acessíveis de formulário.

## 4. Resultado esperado

Ao concluir:

- Django está materializado em `backend/`;
- PostgreSQL é o banco principal;
- `apps/core` existe;
- `apps/leads` existe;
- `Lead` possui migration versionada;
- `POST /api/v1/leads/` persiste Lead válido;
- payload inválido não persiste;
- endpoints públicos de leitura de Lead não existem;
- `/health/` funciona;
- `/health/ready/` verifica PostgreSQL;
- Django Admin permite consultar Leads;
- formulário real está integrado à seção `#contato`;
- React Hook Form e Zod estão instalados e utilizados;
- validação cliente e servidor são independentes;
- sucesso visual significa persistência confirmada;
- erro não remove os dados preenchidos;
- nenhum dado pessoal aparece em URL, Analytics ou logs;
- nenhuma funcionalidade da Entrega 6 foi antecipada.

## 5. Stack da entrega

### Backend

Usar:

- Python compatível com a arquitetura de hospedagem;
- Django 5;
- Django REST Framework;
- PostgreSQL;
- driver PostgreSQL compatível;
- Django Admin;
- `django-cors-headers` ou solução equivalente já compatível com a arquitetura;
- Ruff;
- pytest;
- pytest-django.

Não introduzir:

- FastAPI;
- Flask;
- GraphQL;
- Celery;
- Redis;
- filas;
- Docker para Django;
- autenticação própria;
- painel administrativo customizado.

### Frontend

Adicionar:

- React Hook Form;
- Zod;
- integração oficial/apropriada entre ambos quando necessária.

Continuar usando:

- React;
- TypeScript;
- Vite;
- Styled Components;
- Fetch API encapsulada.

Não adicionar Axios.

## 6. Organização do backend

Seguir:

```text
backend/
├── apps/
│   ├── core/
│   └── leads/
├── config/
├── manage.py
└── testes/configuração aplicáveis
```

### `core`

Responsável nesta entrega por:

- health;
- readiness;
- request ID;
- erros transversais seguros;
- logging compartilhado quando necessário.

### `leads`

Responsável nesta entrega por:

- `Lead`;
- migration;
- validação;
- normalização;
- serializer;
- API pública de criação;
- Django Admin.

Não criar apps separados para:

- API;
- Admin;
- e-mail;
- notification.

## 7. PostgreSQL local

PostgreSQL é obrigatório nesta entrega.

SQLite não pode ser usado como substituto principal para desenvolvimento ou testes de persistência.

Docker Compose pode fornecer **somente PostgreSQL**.

Django e Vite continuam executados diretamente no ambiente local.

A configuração local deve permitir:

1. iniciar PostgreSQL;
2. configurar variáveis;
3. executar migrations;
4. iniciar Django;
5. iniciar Vite;
6. testar o fluxo real.

Não versionar credenciais de produção.

Credenciais locais explícitas e exclusivamente de desenvolvimento podem existir na configuração de exemplo quando claramente identificadas como não secretas.

## 8. Configuração

Segredos ficam no ambiente.

Adicionar configuração de exemplo sem segredo real.

Categorias mínimas:

- Django secret;
- debug;
- allowed hosts;
- PostgreSQL;
- CORS;
- versão da Política de Privacidade.

Produção não pode depender de defaults permissivos de desenvolvimento.

`VITE_*` continua sendo informação pública e não recebe segredo.

A URL da API no frontend deve vir de configuração centralizada adequada ao ambiente.

Não espalhar URLs de API pelos componentes.

## 9. Modelo `Lead`

Criar `Lead` com:

- `id`;
- `name`;
- `email`;
- `whatsapp`;
- `project_type`;
- `business_name`;
- `message`;
- `source`;
- `status`;
- `privacy_policy_acknowledged`;
- `privacy_policy_version`;
- `created_at`;
- `updated_at`.

### 9.1 Identificador

`id`:

- UUID;
- gerado pelo backend;
- imutável;
- não controlável pelo cliente.

### 9.2 Status

Somente:

- `new`;
- `archived`.

Novo Lead começa como:

`new`

Não criar pipeline de CRM.

### 9.3 Tipos de projeto

Contrato interno:

- `landing_page`;
- `institutional_site`;
- `custom_solution`;
- `support_or_evolution`;
- `not_sure`.

Labels públicas:

- Landing page;
- Site institucional;
- Solução personalizada;
- Suporte ou evolução;
- Ainda não sabe.

### 9.4 Limites

Referências de contrato:

- `name`: obrigatório, máximo de 120 caracteres;
- `email`: obrigatório, formato válido, máximo compatível com endereço de e-mail padrão;
- `whatsapp`: obrigatório e normalizado;
- `project_type`: obrigatório e limitado às escolhas;
- `business_name`: opcional, máximo de 160 caracteres;
- `message`: opcional, máximo de 4000 caracteres;
- `source`: valor controlado;
- `privacy_policy_version`: tamanho limitado e controlado.

O frontend deve possuir limites coerentes, mas o backend é a autoridade.

## 10. Normalização

Aplicar no servidor:

### Nome

- remover espaços externos;
- não alterar agressivamente capitalização ou grafia.

### E-mail

- remover espaços externos;
- validar formato;
- aplicar normalização segura.

### WhatsApp

Aceitar entrada brasileira comum, por exemplo:

- `(11) 99999-9999`;
- `11999999999`;
- `+55 11 99999-9999`.

Persistir em formato internacional normalizado:

`+55...`

Aceitar número nacional válido de 10 ou 11 dígitos depois da normalização aplicável.

Não validar operadora ou existência real do número.

### Texto

- trim;
- mensagem como texto simples;
- normalizar quebras quando necessário;
- não executar HTML fornecido pelo visitante.

### Campos opcionais

String opcional vazia pode ser normalizada para representação consistente definida pela implementação.

## 11. `source`

Nesta entrega existem somente duas origens de Lead na V1:

- `website`: Lead recebido pelo formulário/API pública;
- `manual`: Lead cadastrado internamente pelo Django Admin autenticado.

O frontend e a API pública enviam somente `website`. A API pública rejeita `manual`.

O backend aceita somente essas duas origens, e `manual` é reservado à criação administrativa.

Não implementar tracking de campanha, UTM, referer persistido ou perfil de navegação nesta entrega.

## 12. Política de Privacidade

O formulário exige ciência da Política de Privacidade.

Campo:

`privacy_policy_acknowledged`

só é válido quando:

`true`

Não representa:

- consentimento de marketing;
- consentimento analítico;
- consentimento publicitário.

### 12.1 Estado pré-lançamento

A página `/privacidade` ainda não contém redação jurídica final.

A 0005 pode implementar o mecanismo técnico de ciência e versão para desenvolvimento e validação, mas não deve fingir que a política atual está juridicamente finalizada.

A versão utilizada nesta etapa deve ser explicitamente identificada como **pré-lançamento** na configuração.

A Entrega 7 deverá substituir essa versão pela política revisada antes da produção pública.

Nenhum teste local com dados fictícios deve ser tratado como consentimento real de usuário.

### 12.2 Consistência da versão

Frontend envia a versão configurada da política.

Backend conhece a versão atualmente aceita.

Se houver divergência entre cliente e servidor, a solicitação não deve ser persistida como se a ciência fosse válida.

Retornar erro seguro solicitando atualização/recarregamento da experiência.

Não inventar conteúdo jurídico nesta spec.

Lead criado manualmente pelo Django Admin não passou pelo formulário público. Portanto,
deve manter `privacy_policy_acknowledged` como `false` e
`privacy_policy_version` vazio, sem simular ciência ou inventar uma versão aceita.

## 13. API pública

Implementar:

```text
POST /api/v1/leads/
GET  /health/
GET  /health/ready/
```

Não implementar:

```text
GET    /api/v1/leads/
GET    /api/v1/leads/:id/
PUT    /api/v1/leads/:id/
PATCH  /api/v1/leads/:id/
DELETE /api/v1/leads/:id/
```

Lead não possui CRUD público.

## 14. Contrato de `POST /api/v1/leads/`

### Request

`Content-Type: application/json`

Payload:

```json
{
  "name": "Lukas Frick",
  "email": "exemplo@dominio.com",
  "whatsapp": "(11) 99999-9999",
  "project_type": "institutional_site",
  "business_name": "Empresa opcional",
  "message": "Mensagem opcional",
  "privacy_policy_acknowledged": true,
  "privacy_policy_version": "versao-configurada",
  "source": "website"
}
```

Não aceitar como campos controláveis:

- `id`;
- `status`;
- timestamps;
- campos administrativos.

Campos desconhecidos devem produzir erro de validação em vez de serem silenciosamente persistidos ou ignorados.

Na API pública, `source` só pode ser `website`. `manual` é exclusivo da criação autenticada pelo Admin.

## 15. Resposta de sucesso

Status:

`201 Created`

Formato seguro:

```json
{
  "status": "received",
  "message": "Recebemos sua solicitação.",
  "request_id": "uuid"
}
```

Não retornar:

- Lead completo;
- e-mail;
- WhatsApp;
- mensagem;
- dados internos;
- configuração;
- SQL.

Retornar `id` do Lead não é necessário nesta entrega.

## 16. Erro de validação

Status:

`400 Bad Request`

Formato:

```json
{
  "error": {
    "code": "validation_error",
    "message": "Revise os campos informados.",
    "fields": {
      "email": ["Informe um e-mail válido."]
    }
  },
  "request_id": "uuid"
}
```

Mensagens públicas em português brasileiro.

Códigos de máquina permanecem estáveis e em inglês.

## 17. Versão de política desatualizada

Quando a versão enviada pelo frontend não corresponder à aceita pelo backend:

- não persistir Lead;
- retornar erro seguro;
- permitir que o frontend oriente recarregamento.

Código estável sugerido:

`privacy_policy_version_mismatch`

Não revelar configuração interna desnecessária.

## 18. Erros inesperados

Erros do servidor:

- não expõem traceback;
- não expõem SQL;
- não expõem paths;
- não expõem configuração;
- não expõem segredo;
- não ecoam payload completo.

O frontend apresenta mensagem recuperável.

Não afirmar:

> sua solicitação não foi recebida

quando houver falha de rede ambígua e o cliente não puder saber se o servidor persistiu antes da conexão cair.

Essa limitação será resolvida de forma mais robusta com idempotência na 0006.

## 19. Request ID

Cada requisição backend deve possuir um identificador de correlação.

Pode ser gerado pelo Django nesta entrega.

Usar UUID ou formato equivalente seguro.

O ID:

- pode aparecer na resposta;
- pode aparecer em log;
- não contém dado pessoal.

Não aceitar valor arbitrário do visitante como identificador confiável sem validação.

## 20. Health

`GET /health/`

Verifica somente que o processo Django está operacional.

Resposta de sucesso simples e sem dados sensíveis.

Exemplo:

```json
{
  "status": "ok"
}
```

Não consultar SMTP.

## 21. Readiness

`GET /health/ready/`

Verifica que o backend está apto a receber e persistir Lead.

Nesta entrega, a dependência crítica é:

- PostgreSQL.

Sucesso:

`200`

Falha de banco:

`503`

Não expor:

- host;
- usuário;
- senha;
- nome interno da exceção;
- SQL.

SMTP não faz parte da readiness desta entrega.

## 22. Django Admin

Registrar `Lead` no Django Admin.

### Listagem

Exibir informações úteis como:

- nome;
- e-mail;
- tipo de projeto;
- status;
- data de criação.

### Filtros

Pelo menos:

- status;
- tipo de projeto;
- data.

### Busca

Pelo menos:

- nome;
- e-mail;
- WhatsApp;
- negócio.

### Detalhe

Dados enviados são registro histórico.

Evitar edição livre dos campos enviados.

Status pode ser controlado de maneira explícita.

### Arquivamento

Permitir marcar Lead como:

`archived`

sem excluir o registro.

### Inclusão

O Admin permite criar Leads manualmente, além dos Leads recebidos pelo formulário público.

Na criação manual, o operador preenche somente os dados comerciais existentes:

- `name`;
- `email`;
- `whatsapp`;
- `project_type`;
- `business_name`;
- `message`.

O backend define `source=manual`, `status=new`,
`privacy_policy_acknowledged=false` e `privacy_policy_version` vazio.
Esses campos técnicos não são controláveis pelo operador.

### Exclusão

Não construir nesta entrega fluxo específico de exclusão por privacidade.

Também evitar expor exclusão casual como operação operacional principal.

A política final de privacidade e procedimentos aplicáveis pertencem às entregas posteriores.

### Entrega futura

Não mostrar ainda:

- EmailDelivery;
- reenvio;
- tentativas;
- status de e-mail.

## 23. Autenticação do Admin

Usar autenticação padrão segura do Django.

Admin:

- não é público sem login;
- usa sessão;
- mantém CSRF;
- não recebe autenticação customizada.

Não criar sistema próprio de usuários.

MFA, restrições adicionais e hardening de produção podem ser finalizados de acordo com o ambiente real antes do lançamento.

Nenhuma credencial de Admin pode ser versionada.

## 24. CORS

A API pública é consumida pelo frontend.

CORS deve ser explícito por ambiente.

Development permite somente origens locais aprovadas.

Production deverá permitir somente origens públicas da Repage configuradas.

Não usar:

`CORS_ALLOW_ALL_ORIGINS = True`

como configuração de produção.

## 25. CSRF e autenticação da API pública

`POST /api/v1/leads/` é endpoint público sem sessão.

Não exigir login.

Não utilizar autenticação de sessão do Django como mecanismo da API pública.

Admin continua protegido por sessão e CSRF.

Não desabilitar CSRF globalmente para resolver integração.

## 26. Logging

Logs podem conter:

- request ID;
- evento;
- status HTTP;
- resultado;
- duração;
- Lead ID depois da persistência.

Não registrar:

- formulário completo;
- mensagem;
- WhatsApp integral;
- e-mail integral;
- segredo;
- credencial;
- headers sensíveis.

Quando dado pessoal for estritamente necessário em log operacional futuro, deverá ser mascarado.

Não usar `print` como sistema de observabilidade.

## 27. Formulário frontend

O formulário é integrado à seção existente:

`/#contato`

Preservar:

- identidade;
- superfície escura;
- headline;
- direção visual aprovada;
- hierarquia;
- movimento existente quando saudável.

Adicionar o formulário sem transformar o contato em página SaaS ou bloco genérico.

Não criar nova rota para orçamento.

## 28. Campos do formulário

### Obrigatórios

- Nome;
- E-mail;
- WhatsApp;
- Tipo de projeto;
- Ciência da Política de Privacidade.

### Opcionais

- Marca, negócio ou projeto;
- Mensagem.

Não perguntar:

- orçamento;
- faixa de investimento;
- prazo obrigatório;
- senha;
- endereço;
- CPF/CNPJ.

## 29. Labels

Usar rótulos persistentes.

Sugestões:

- `Nome`
- `E-mail`
- `WhatsApp`
- `Tipo de projeto`
- `Marca, negócio ou projeto`
- `Conte um pouco sobre o que você precisa`

Placeholder não substitui label.

## 30. Tipo de projeto no frontend

Exibir:

- Landing page;
- Site institucional;
- Solução personalizada;
- Suporte ou evolução;
- Ainda não sei.

Mapear para os valores internos definidos no contrato da API.

## 31. Ciência de privacidade

Checkbox obrigatório com linguagem equivalente a:

> Li e estou ciente da Política de Privacidade.

`Política de Privacidade` deve apontar para:

`/privacidade`

Não inserir consentimento de marketing nessa checkbox.

Não pré-marcar.

## 32. CTA

Ação principal:

> Solicitar orçamento

Não usar texto que prometa:

- orçamento imediato;
- resposta imediata;
- aceite;
- prazo.

## 33. React Hook Form e Zod

Usar React Hook Form para:

- estado;
- registro de campos;
- erros;
- submissão;
- foco.

Usar Zod para:

- schema;
- tipos;
- regras do cliente;
- mensagens coerentes.

Validação frontend melhora UX.

Ela não substitui validação do servidor.

Não reutilizar automaticamente schema TypeScript como autoridade do backend.

## 34. Cliente de API

Criar cliente Fetch encapsulado.

Responsabilidades:

- URL base;
- JSON;
- tratamento de erro;
- timeout razoável quando implementado;
- parsing seguro;
- contrato tipado.

Não chamar `fetch` diretamente de vários componentes.

Não implementar retry automático nesta entrega.

Retry automático sem idempotência pode duplicar Lead.

## 35. Estado inicial

Antes de interação:

- campos vazios;
- nenhuma mensagem de erro;
- checkbox desmarcada;
- ação disponível quando semanticamente adequado.

Validação não deve poluir a tela antes da interação necessária.

## 36. Validação inválida

Quando o visitante envia dados inválidos:

- não chamar API quando o schema cliente já detectar o problema;
- apresentar erros junto aos campos;
- apresentar resumo acessível;
- mover foco para o primeiro erro relevante;
- preservar valores preenchidos;
- não indicar erro apenas por cor.

## 37. Loading

Enquanto a requisição estiver em andamento:

- botão comunica carregamento;
- nova submissão pelo mesmo controle fica bloqueada;
- conteúdo permanece estável;
- não limpar formulário;
- não bloquear navegação global.

Isso evita clique duplo dentro da tentativa atual.

Não é substituto de idempotência.

## 38. Sucesso

Somente resposta `201` válida confirma sucesso.

No sucesso:

- informar que a solicitação foi recebida;
- fornecer próximo passo humano sem prazo prometido;
- comunicar pelo menos por região `aria-live`;
- limpar os campos somente depois da confirmação, se a implementação optar por limpar;
- não redirecionar automaticamente;
- não abrir modal desnecessário.

Mensagem pode seguir direção:

> Solicitação recebida. Obrigado por entrar em contato com a Repage.

Não afirmar que e-mail foi enviado.

## 39. Erro de API

Quando o backend rejeitar campos:

- mapear erros compatíveis para os campos;
- apresentar erro geral quando necessário;
- preservar dados.

## 40. Erro de rede ou servidor

Apresentar mensagem humana.

Não limpar formulário.

Não executar retry automático.

Como a 0005 ainda não possui idempotência, uma falha de conexão pode ser ambígua depois que o servidor recebeu o payload.

A interface não pode afirmar com certeza que o Lead não foi criado quando isso não puder ser comprovado.

Permitir nova tentativa somente por ação consciente do visitante.

A 0006 resolverá retries de forma idempotente.

## 41. Movimento da seção de contato

O formulário é conteúdo funcional.

Quando o primeiro campo receber foco:

- movimento narrativo relevante da seção deve parar ou permanecer em estado estável;
- campos não podem se mover durante preenchimento;
- erros não podem deslocar foco para elementos animados;
- CTA permanece previsível.

Com `prefers-reduced-motion`, todo o conteúdo aparece estável.

Não redesenhar as outras seções da homepage.

## 42. Layout do formulário

Desktop:

- usar duas colunas somente para campos curtos quando saudável;
- campos longos ocupam largura adequada;
- checkbox e feedback possuem espaço suficiente.

Mobile:

- uma coluna;
- ordem linear;
- controles grandes o suficiente para toque;
- teclado móvel apropriado para e-mail/telefone;
- nenhum overflow.

Não comprimir versão desktop.

## 43. Acessibilidade

Obrigatório:

- `<form>` semântico;
- labels persistentes;
- associação de label e input;
- `autocomplete` apropriado;
- `inputMode` quando útil;
- erros associados por `aria-describedby`;
- `aria-invalid`;
- resumo de erros;
- foco no primeiro campo inválido;
- loading anunciado;
- sucesso anunciado;
- erro geral anunciado;
- checkbox acessível;
- link de Política acessível;
- ordem de tab natural;
- foco visível;
- mensagem independente de cor.

Não usar formulário em etapas.

## 44. Responsividade

Validar:

- desktop amplo;
- notebook;
- tablet;
- mobile;
- mobile compacto;
- viewport baixa;
- celular horizontal.

A alteração da seção `#contato` não pode causar regressão nas demais partes da homepage.

## 45. Segurança de frontend

Não colocar em:

- URL;
- query string;
- hash;
- console;
- Analytics;

qualquer conteúdo do formulário.

Não persistir os campos em:

- localStorage;
- sessionStorage;

sem decisão específica futura.

Não registrar payload no console.

Não usar dados do formulário para montar HTML não escapado.

## 46. Entrega 6 explicitamente fora de escopo

Não criar nesta spec:

- `EmailDelivery`;
- `IdempotencyRecord`;
- cabeçalho `Idempotency-Key`;
- fingerprint;
- deduplicação;
- detecção de repetição;
- honeypot;
- campo de tempo mínimo;
- throttling;
- rate limit por IP;
- rate limit por contato;
- CAPTCHA;
- Turnstile;
- notificação interna;
- confirmação por e-mail;
- SMTP;
- cron;
- fila;
- retentativa;
- reenvio;
- status de entrega de e-mail.

Também não criar abstrações vazias ou modelos antecipatórios para esses recursos.

## 47. Outras áreas fora de escopo

Não implementar:

- consentimento de cookies;
- Analytics;
- Ads;
- redação jurídica final;
- Política de Cookies final;
- SEO completo;
- prerender;
- deploy;
- CI/CD;
- backups;
- observabilidade externa;
- CRM;
- painel próprio;
- autenticação própria;
- CMS;
- pagamentos;
- área do cliente.

## 48. Testes backend

Cobrir nesta entrega:

### Lead

- defaults;
- choices;
- normalização;
- representação;
- persistência;
- status.

### Serializer/API

- payload válido;
- campos obrigatórios;
- e-mail inválido;
- WhatsApp inválido;
- tipo inválido;
- limites;
- campos extras;
- política não reconhecida;
- policy version divergente;
- normalização;
- sucesso `201`;
- erro `400`;
- ausência de endpoint público de listagem/detalhe.

### Banco

Testes de persistência devem usar PostgreSQL no fluxo final de validação.

### Admin

- modelo registrado;
- acesso requer autenticação;
- filtros/busca/configuração essencial;
- criação manual autenticada com origem `manual`;
- Leads manuais sem ciência ou versão de política;
- arquivamento.

### Core

- health `200`;
- readiness `200` com banco;
- readiness `503` diante de indisponibilidade simulável com segurança;
- resposta sem informação sensível.

### Logs

Testes aplicáveis devem garantir que payload integral ou campos sensíveis não sejam deliberadamente registrados.

## 49. Testes frontend

Cobrir:

- schema Zod;
- normalização de WhatsApp;
- valores de `project_type`;
- campos obrigatórios;
- opcionais;
- checkbox;
- primeiro erro;
- submit válido;
- loading;
- sucesso;
- erro de campo vindo da API;
- erro geral;
- falha de rede;
- preservação dos dados em erro;
- ausência de retry automático.

## 50. Playwright

A suíte existente continua sendo a principal validação reproduzível de navegador da Repage.

Adicionar cobertura da experiência de formulário.

Pode simular respostas da API para testar estados de interface de forma determinística.

Cobrir:

- formulário renderizado;
- navegação por teclado;
- erro de validação;
- loading;
- sucesso;
- erro;
- mobile;
- reduced motion;
- ausência de overflow;
- regressão da homepage.

Não é necessário fazer toda a suíte Playwright depender de PostgreSQL.

## 51. Validação full stack real

Além dos testes isolados, realizar ao menos um smoke local com:

- PostgreSQL real local;
- Django real;
- frontend real;
- submissão pelo formulário;
- Lead persistido;
- Lead visível no Django Admin.

Esse smoke comprova integração ponta a ponta.

Não usar apenas mock para declarar persistência aprovada.

Usar somente dados fictícios.

## 52. Estratégia de implementação

A entrega atravessa backend, banco e frontend e deve ser dividida em fases.

### Fase 1 — fundação backend

- scaffold Django;
- dependências;
- configuração;
- PostgreSQL local;
- `core`;
- health;
- readiness;
- request ID.

### Fase 2 — domínio de Leads

- `Lead`;
- migration;
- serializer;
- normalização;
- API;
- Admin;
- criação manual autenticada no Admin;
- testes backend dos fluxos público e manual.

### Fase 3 — formulário frontend

- dependências;
- schema;
- cliente de API;
- campos;
- acessibilidade;
- estados.

### Fase 4 — integração e acabamento

- ligação frontend/backend;
- erros;
- responsividade;
- movimento/foco;
- smoke full stack.

### Fase 5 — fechamento

- bateria completa;
- revisão de segurança;
- revisão visual;
- diff;
- documentação.

Prompts de implementação devem ser deltas.

Não repetir a spec inteira entre fases.

Testes intermediários devem ser proporcionais ao delta.

A bateria completa fica para o fechamento.

## 53. Validação visual humana

A seção `#contato` muda de composição porque passa a conter o formulário real.

Antes de congelar a entrega, revisar visualmente:

- desktop/notebook;
- mobile.

Confirmar:

- formulário integrado à identidade;
- headline preservada;
- hierarquia clara;
- formulário não parece componente SaaS genérico;
- estados de erro/loading/sucesso são coerentes;
- campos têm boa leitura;
- seção não se torna excessivamente longa ou pesada;
- mobile mantém conversão clara.

As demais seções da homepage permanecem checkpoints congelados.

## 54. Comandos finais — backend

Com ambiente local configurado:

```bash
python manage.py check
python manage.py makemigrations --check --dry-run
ruff check .
pytest
```

Também:

- aplicar migrations em PostgreSQL local;
- verificar health;
- verificar readiness;
- realizar smoke da API.

Não exigir `check --deploy` como prova de produção nesta entrega, porque deploy pertence à Entrega 9.

## 55. Comandos finais — frontend

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

## 56. Validação final Git/diff

Na raiz:

```bash
git diff --check
```

Revisar também:

- segredos;
- `.env`;
- credenciais;
- arquivos gerados;
- bancos locais;
- caches Python;
- logs;
- payloads de teste;
- dados pessoais.

Nenhum deles pode ser commitado indevidamente.

## 57. Critérios de aceite

- [ ] Backend Django existe.
- [ ] DRF está configurado.
- [ ] PostgreSQL é o banco principal.
- [ ] SQLite não é usado como banco principal.
- [ ] `apps/core` existe.
- [ ] `apps/leads` existe.
- [ ] `Lead` usa UUID.
- [ ] Campos do Lead correspondem ao contrato.
- [ ] Status possui somente `new` e `archived`.
- [ ] Migration está versionada.
- [ ] `POST /api/v1/leads/` existe.
- [ ] Payload válido persiste exatamente um Lead por requisição nesta entrega.
- [ ] Payload inválido não persiste.
- [ ] Campos desconhecidos são rejeitados.
- [ ] API não possui listagem pública de Leads.
- [ ] API não possui detalhe público de Lead.
- [ ] Resposta de sucesso não expõe dados pessoais.
- [ ] Erros não expõem detalhes internos.
- [ ] Request ID funciona.
- [ ] `/health/` funciona.
- [ ] `/health/ready/` verifica PostgreSQL.
- [ ] Readiness não depende de SMTP.
- [ ] Django Admin exige autenticação.
- [ ] Lead aparece no Admin.
- [ ] Busca e filtros básicos funcionam.
- [ ] Arquivamento funciona sem exclusão.
- [ ] React Hook Form está integrado.
- [ ] Zod está integrado.
- [ ] Formulário possui os campos aprovados.
- [ ] Faixa de investimento não foi adicionada.
- [ ] Checkbox de privacidade é obrigatório e não vem marcado.
- [ ] Versão da política é persistida.
- [ ] Versão pré-lançamento está identificada como não final.
- [ ] Formulário possui labels persistentes.
- [ ] Erros por campo funcionam.
- [ ] Resumo de erros funciona.
- [ ] Foco vai para o primeiro erro.
- [ ] Loading impede clique duplicado da tentativa corrente.
- [ ] Sucesso só aparece depois de `201`.
- [ ] Erro preserva dados.
- [ ] Não existe retry automático.
- [ ] Formulário não coloca dados pessoais em URL.
- [ ] Formulário não persiste dados no browser.
- [ ] Dados pessoais não são logados integralmente.
- [ ] Contato mantém identidade visual aprovada.
- [ ] Movimento estabiliza durante interação com o formulário.
- [ ] Mobile usa uma coluna.
- [ ] Teclado e foco funcionam.
- [ ] `prefers-reduced-motion` funciona.
- [ ] Smoke full stack com PostgreSQL real foi aprovado.
- [ ] Lead submetido pelo frontend foi verificado no Admin.
- [ ] Nenhum `EmailDelivery` foi criado.
- [ ] Nenhum `IdempotencyRecord` foi criado.
- [ ] Nenhum honeypot foi criado.
- [ ] Nenhum throttling foi criado.
- [ ] Nenhum e-mail foi implementado.
- [ ] Nenhum retry backend foi implementado.
- [ ] Lint frontend aprovado.
- [ ] Typecheck frontend aprovado.
- [ ] Testes frontend aprovados.
- [ ] Playwright aprovado.
- [ ] Build frontend aprovado.
- [ ] `python manage.py check` aprovado.
- [ ] Migration check aprovado.
- [ ] Ruff aprovado.
- [ ] Pytest aprovado.
- [ ] `git diff --check` aprovado.
- [ ] Documentação reconciliada.
- [ ] Spec marcada `implemented` somente após todos os requisitos.

## 58. Documentação no fechamento

Quando a entrega estiver concluída:

- atualizar esta spec para `implemented`;
- atualizar `docs/specs/README.md`;
- atualizar `docs/ROADMAP.md`:
  - Entrega 5 concluída;
  - Entrega 6 próxima;
- atualizar `docs/README.md` se o estado executivo exigir;
- atualizar o bloco de arquitetura atual para registrar backend/PostgreSQL/formulário materializados;
- não alterar arquitetura-alvo apenas porque uma parte dela ainda pertence à 0006;
- atualizar `backend/AGENTS.md` ou `frontend/AGENTS.md` somente se surgir regra operacional duradoura nova;
- criar ADR somente diante de decisão estrutural real com alternativas relevantes.

## 59. Roadmap depois da conclusão

A conclusão da 0005 não significa que o fluxo de lead esteja totalmente resiliente para lançamento.

Estado esperado:

`persistência real concluída → Entrega 6 torna o fluxo resiliente`

Próxima entrega:

**Entrega 6 — E-mails, idempotência e proteção**

Não antecipar Entrega 7 ou posteriores.

## 60. Definição de pronto

A 0005 está pronta quando:

- um visitante consegue preencher o formulário real;
- os dados válidos são persistidos em PostgreSQL;
- dados inválidos não são persistidos;
- a API responde com contrato seguro;
- o Lead fica disponível no Django Admin;
- health e readiness funcionam;
- logs não expõem dados do formulário;
- erro, loading e sucesso são acessíveis;
- integração funciona em desktop e mobile;
- um smoke full stack real comprova frontend → API → PostgreSQL → Admin;
- nenhuma responsabilidade da Entrega 6 foi implementada;
- todas as validações obrigatórias da entrega passaram;
- documentação foi reconciliada;
- a spec está `implemented`.
