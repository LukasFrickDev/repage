# 0011 — QA final e lançamento da V1

- **Status:** approved
- **Responsável:** Lukas Frick
- **Data:** 19 de agosto de 2026
- **Branch-base:** `main`
- **Baseline confirmada:** `8694df5436dd563d849e7e157599b7d04f8db672`
- **Entrega do roadmap:** 11 — QA final e lançamento
- **Spec predecessora:** `0010-ci-cd-deploy-backups-observability.md`
- **Documentos relacionados:** `AGENTS.md`, `frontend/AGENTS.md`, `backend/AGENTS.md`, `docs/PRODUCT.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md`, `docs/ROADMAP.md`, `docs/operations/`, `docs/adr/0001-vite-static-prerender.md`, `docs/adr/0002-postgresql-neon-production-provider.md`

## 1. Contexto

As Entregas 1–10 estão concluídas.

A produção já está operacional em:

- `https://repage.com.br`;
- `https://api.repage.com.br`.

A Entrega 10 comprovou CI/CD, deploy, Passenger/WSGI, Neon/PostgreSQL, SMTP, cron operacional necessário, health/readiness, logs, backup, cópia externa e restore.

A produção permanece deliberadamente fora da indexação pública:

```text
VITE_SITE_INDEXING_ENABLED=false
```

A Entrega 11 é o gate final entre **produção tecnicamente operacional** e **V1 comercialmente lançada**.

Não reabrir entregas anteriores sem regressão concreta.

## 2. Objetivo

Executar o QA final da V1, corrigir somente bloqueadores ou refinamentos necessários ao lançamento profissional e, após aprovação explícita de Lukas:

1. habilitar Analytics real;
2. preparar e validar a integração Google Ads sem criar campanhas;
3. finalizar os textos legais;
4. verificar Search Console;
5. habilitar indexação pública de forma controlada;
6. realizar smoke pós-lançamento;
7. fechar documentalmente a V1.

## 3. Princípios

- não redesenhar o site;
- não ampliar produto;
- não reauditar decisões congeladas sem regressão;
- separar falha real de melhoria opcional;
- corrigir somente o necessário para uma V1 profissional;
- produção permanece `noindex` durante preparação e QA;
- indexação é ativada somente após decisão explícita de lançamento;
- não provocar falhas destrutivas só para repetir evidência já válida;
- não tratar ferramenta externa ou score isolado como substituto de QA funcional.

## 4. Estado operacional herdado

Preservar:

- HomeHost + Passenger/WSGI;
- frontend estático prerenderizado;
- Neon PostgreSQL 18 em Frankfurt;
- endpoint direct na V1;
- TLS obrigatório;
- CI component-aware;
- deploy seletivo/resiliente;
- SMTP imediato após persistência;
- recuperação de e-mail pelo Admin;
- `cleanup_idempotency` às 03:17;
- backup PostgreSQL às 03:20;
- uptime horário em homepage + `/health/`;
- retenções de backup já validadas;
- runbooks da Entrega 10.

Não alterar esses contratos sem regressão comprovada.

## 5. Bloqueadores conhecidos antes do lançamento

### 5.1 Textos legais ainda são pré-lançamento

No estado atual:

- `/privacidade` declara explicitamente ser rascunho técnico de pré-lançamento;
- `/cookies` declara explicitamente ser texto de pré-lançamento;
- versões permanecem `pre-launch`.

Antes do lançamento:

- obter revisão final aplicável;
- remover linguagem de rascunho/pré-lançamento;
- definir data e versão finais;
- manter texto factual;
- sincronizar `VITE_PRIVACY_POLICY_VERSION` e `PRIVACY_POLICY_VERSION`;
- atualizar a versão de Cookies quando aplicável;
- garantir que o formulário continue aceitando exatamente a versão publicada.

Não inventar CNPJ, razão social, endereço, DPO ou estrutura empresarial inexistente.

### 5.2 GA4 real ainda não está comprovado

Antes do lançamento:

- criar/usar propriedade GA4 real da Repage;
- obter Measurement ID real;
- configurar o valor por GitHub Environment/variável apropriada;
- passar `VITE_GA_MEASUREMENT_ID` ao build de produção;
- manter Analytics bloqueado sem consentimento;
- validar com consentimento em Realtime e/ou DebugView;
- validar pelo menos `page_view` e um evento comercial seguro;
- confirmar ausência de PII;
- confirmar que rejeição/revogação interrompem coleta.

Não ativar Google Ads.

### 5.3 Search Console

Antes ou no momento correto do lançamento:

- criar/verificar propriedade de domínio `repage.com.br`;
- preferir verificação de domínio via DNS quando aplicável;
- não remover token de verificação enquanto a propriedade depender dele.

Após indexação pública:

- confirmar `robots.txt` indexável;
- confirmar meta robots das páginas indexáveis;
- confirmar sitemap público;
- submeter `https://repage.com.br/sitemap.xml`;
- inspecionar a home/canonical no Search Console;
- solicitar indexação da home quando apropriado.

A indexação pelo Google é assíncrona e não é requisito que todas as páginas apareçam imediatamente nos resultados.

### 5.4 Google Ads preparado, sem campanha ativa

A V1 deve deixar a conta Google Ads preparada para futura aquisição paga sem iniciar mídia nesta entrega.

Obrigatório antes do fechamento:

- criar/configurar a conta Google Ads oficial da Repage;
- vincular a propriedade GA4 real da Repage ao Google Ads;
- habilitar auto-tagging na conta Ads;
- manter campanhas, orçamento e veiculação desativados/inexistentes;
- não instalar tag Google Ads separada apenas por antecipação;
- não ativar remarketing, públicos publicitários ou Google Ads personalization nesta etapa;
- não usar Enhanced Conversions nesta V1.

### Conversão principal

Preservar o contrato de eventos do código.

No GA4, criar o evento recomendado `generate_lead` derivado de `lead_form_success`, sem renomear ou remover o evento existente da aplicação.

`generate_lead` deve:

- ocorrer somente quando `lead_form_success` ocorrer;
- ser marcado como evento principal/key event no GA4;
- ser importado para o Google Ads;
- ser configurado como ação de conversão **Primary** no Google Ads para futura otimização de campanhas de geração de leads.

Não atribuir valor monetário artificial ao Lead nesta V1.

### Conversões/ações secundárias

`whatsapp_click` pode ser importado/configurado como conversão **Secondary / observation only**, porque representa intenção de contato, não Lead confirmado.

Não usar como conversão de lances por padrão:

- `quote_cta_click`;
- `lead_form_start`;
- `portfolio_view`;
- `case_view`;
- `external_project_click`;
- `consent_update`;
- `lead_form_error`.

Esses eventos permanecem métricas de comportamento/diagnóstico no GA4.

### Consentimento publicitário

A categoria `advertising` já existente passa a ter função real de preparação de consentimento para produtos Google Ads.

Preservar carregamento estrito:

- `analytics=false` continua impedindo o carregamento da Google tag;
- `advertising=true` sozinho não carrega tag Google;
- quando a tag GA4 estiver carregada por `analytics=true`, mapear `advertising` para os sinais de Consent Mode v2:
  - `ad_storage`;
  - `ad_user_data`;
  - `ad_personalization`.
- `advertising=false` → todos os sinais publicitários em `denied`;
- `advertising=true` → sinais publicitários podem ser `granted`, respeitando a escolha atual;
- revogação deve atualizar imediatamente esses sinais.

Não usar Consent Mode avançado para enviar pings antes do opt-in.

### Enhanced Conversions

Ficam fora da V1.

Motivos:

- exigiriam novo tratamento de dados próprios como e-mail/telefone com hash;
- alterariam o contrato atual de ausência de PII em Analytics/Ads;
- exigiriam revisão adicional de privacidade e consentimento;
- conversões importadas do GA4 não são compatíveis com Enhanced Conversions.

Reavaliar somente quando campanhas reais e volume justificarem.

### Políticas legais

Os textos finais de Privacidade/Cookies devem refletir honestamente que:

- GA4 pode ser vinculado ao Google Ads para medição de conversões;
- nenhum Google Ads, remarketing ou tecnologia publicitária é carregado sem a escolha publicitária aplicável;
- nenhuma campanha paga está ativa no fechamento desta entrega;
- não são usadas Enhanced Conversions na V1.

### 5.5 Instagram oficial da Repage

A melhoria obrigatória do footer inclui Instagram.

Até esta spec:

- e-mail profissional confirmado: `contato@repage.com.br`;
- WhatsApp público confirmado: `https://wa.me/5511958244081`;
- URL/@ oficial do Instagram da Repage ainda não está registrado nas fontes vigentes.

Não inventar perfil.

A URL oficial deve ser fornecida/verificada antes da implementação do link.

## 6. Refinamento final do footer

Objetivo:

usar o espaço disponível no lado direito do footer para canais comerciais reais sem redesenhar o componente inteiro.

Adicionar:

- e-mail;
- WhatsApp;
- Instagram.

Requisitos:

- manter marca, descrição, navegação, links legais e Preferências de cookies;
- preservar hierarquia atual;
- composição simples e sofisticada;
- não criar nova seção comercial;
- não transformar os três canais em CTAs primários concorrentes;
- reutilizar tokens e gramática visual existentes;
- links/controles com foco visível;
- labels acessíveis;
- targets externos protegidos;
- responsividade em desktop, tablet, mobile e mobile compacto;
- sem overflow;
- ícones somente se funcionais e coerentes com o sistema.

### Fonte única dos canais

Evitar duplicar o WhatsApp entre formulário e footer.

Centralizar os canais públicos reutilizados em configuração/conteúdo compartilhado quando isso reduzir duplicação real.

O formulário continua com o CTA atual de WhatsApp.

O clique de WhatsApp pode reutilizar o evento `whatsapp_click` já aprovado.

Não adicionar evento novo para Instagram ou e-mail nesta entrega sem requisito explícito.

## 7. Revisão final de conteúdo e portfólio

Revisar visual e funcionalmente:

- homepage;
- três projetos destacados;
- `/portfolio`;
- seis cases;
- links públicos dos projetos;
- imagens;
- vídeos/posters/fallbacks;
- textos;
- CTAs;
- footer;
- páginas legais;
- 404.

Objetivo:

detectar somente regressão, informação obsoleta, link quebrado, mídia indisponível, placeholder ou erro de publicação.

Não reabrir copy aprovada apenas por preferência estilística.

Não reauditar autorizações já congeladas sem nova evidência de conflito.

## 8. Regressão funcional final

Validar em produção/noindex antes do lançamento:

### Navegação

- rotas;
- reload direto;
- back/forward;
- âncoras;
- header/menu;
- footer;
- 404;
- links externos.

### Conversão

- formulário;
- validação;
- sucesso;
- erro recuperável;
- idempotência/repetição;
- persistência real;
- Admin;
- envio SMTP;
- WhatsApp.

Usar dados fictícios claramente identificáveis.

Remover dados de QA quando apropriado.

Não repetir cenários destrutivos sem necessidade.

### Consentimento/Analytics

- primeira visita;
- aceitar;
- rejeitar;
- personalizar;
- revisar;
- persistência;
- revogação;
- GA somente com consentimento.

## 9. SEO e prerender

Antes do lançamento, confirmar no artefato/produção:

- HTML específico por rota;
- hydration sem warnings;
- title/description;
- canonical;
- Open Graph;
- Twitter Card;
- social image;
- JSON-LD;
- sitemap;
- 404;
- legal pages `noindex`;
- rotas comerciais preparadas para `index`.

Enquanto `VITE_SITE_INDEXING_ENABLED=false`, o estado público deve permanecer SAFE.

## 10. Acessibilidade final

Validar pelo menos:

- teclado;
- foco visível;
- skip link;
- menu mobile;
- dialogs/consentimento;
- formulários;
- erros e sucesso;
- galerias/viewer;
- footer;
- páginas legais;
- movimento reduzido;
- reflow/zoom quando relevante.

Correção é obrigatória para regressão que impeça uso, compreensão ou operação por teclado.

Não exigir perfeição de ferramenta automática como substituto da inspeção funcional.

## 11. Responsividade final

Cobrir rotas representativas em:

- desktop amplo;
- notebook;
- tablet;
- mobile;
- mobile compacto;
- viewport baixa;
- celular horizontal quando aplicável.

Verificar:

- overflow;
- texto cortado;
- mídia;
- controles;
- formulário;
- footer;
- consentimento;
- galerias.

## 12. Desempenho final

Registrar evidência de produção em rotas representativas:

- home;
- portfolio;
- um case.

Usar Lighthouse/PageSpeed ou ferramenta equivalente como diagnóstico.

Avaliar especialmente:

- carregamento inicial;
- LCP/CLS quando disponíveis;
- tamanho e falhas de assets;
- vídeo/mídia;
- scripts de terceiros;
- console/rede.

Um score isolado não bloqueia lançamento por si só.

Bloqueiam:

- regressão evidente;
- asset crítico falhando;
- layout shift grave;
- interação comercial prejudicada;
- carregamento incompatível com uso razoável;
- terceiro desnecessário carregado antes do consentimento.

## 13. Produção e operação

Revalidar sem repetir destrutivamente:

- HTTPS;
- domínio canônico;
- `www` redirect;
- API;
- Admin;
- `/health/`;
- `/health/ready/` manualmente no QA;
- logs sanitizados;
- uptime vigente;
- último backup válido;
- última cópia externa;
- evidência de restore já concluída;
- cron esperado.

Não repetir restore real somente para “marcar caixa” se a evidência recente da Entrega 10 continuar válida.

Repetir procedimento operacional apenas diante de regressão, mudança relevante ou evidência vencida/inadequada.

## 14. Gate de release candidate

Antes de habilitar indexação:

- código final da 0011 integrado em `main`;
- produção atualizada;
- produção ainda `noindex`;
- CI verde;
- QA funcional completo;
- revisão humana de conteúdo/mídia;
- footer aprovado;
- textos legais finais;
- GA4 real validado;
- Search Console verificado;
- nenhum bloqueador crítico aberto.

Então apresentar a Lukas um resumo:

```text
GO / NO-GO
```

Somente `GO` explícito autoriza a indexação.

## 15. Mecanismo de ativação da indexação

O workflow atual foi deliberadamente criado para exigir:

```text
VITE_SITE_INDEXING_ENABLED=false
```

A 0011 deve substituir esse bloqueio temporário por mecanismo seguro para o estado pós-lançamento.

Requisito:

- aceitar somente valores literais válidos;
- manter `false` durante QA;
- permitir rebuild/redeploy explícito do frontend com o mesmo SHA quando a variável mudar;
- não depender de commit artificial para forçar rebuild;
- impedir ativação acidental por valor inválido;
- preservar deploy seletivo normal.

Direção esperada:

- `VITE_SITE_INDEXING_ENABLED` continua como GitHub Environment variable;
- adicionar opção explícita/segura de `workflow_dispatch` para forçar frontend deploy quando necessário;
- após `GO`, alterar a variável de production para `true`;
- executar redeploy explícito do frontend;
- validar resultado antes de considerar lançamento concluído.

Não ligar indexação por alteração manual de arquivos no servidor.

## 16. Build de produção com GA4

O deploy deve receber:

```text
VITE_GA_MEASUREMENT_ID
```

do GitHub Environment.

Regras:

- Measurement ID não é segredo;
- não hardcodar;
- vazio continua fail-safe durante desenvolvimento;
- para o lançamento da V1, GA4 real deve estar configurado salvo exceção formal aceita;
- consentimento continua sendo o gate de carregamento.

## 17. Lançamento

Após `GO`:

1. garantir `VITE_SITE_INDEXING_ENABLED=true`;
2. executar frontend redeploy controlado;
3. confirmar workflow verde;
4. confirmar homepage acessível;
5. confirmar `/robots.txt` em modo indexável;
6. confirmar meta robots da home/portfolio/cases;
7. confirmar legais continuam `noindex`;
8. confirmar sitemap;
9. confirmar canonical;
10. confirmar frontend/API/health;
11. confirmar consentimento;
12. confirmar GA mediante consentimento;
13. submeter sitemap no Search Console;
14. solicitar indexação da home quando apropriado;
15. registrar evidência.

Não esperar indexação completa do Google para concluir tecnicamente o lançamento.

## 18. Smoke pós-lançamento

Executar smoke curto e prioritariamente não destrutivo:

- home;
- portfolio;
- um case;
- privacidade/cookies;
- 404;
- robots;
- sitemap;
- API health;
- consentimento;
- GA condicionado.

A conversão real já deve ter sido validada imediatamente antes do `GO`; não criar Lead adicional pós-lançamento apenas por redundância sem necessidade.

## 19. Bloqueadores reais

Bloqueia lançamento:

- CI vermelho relacionado à release;
- rota/CTA/formulário principal quebrado;
- persistência de Lead quebrada;
- falha de segurança/privacidade relevante;
- consentimento permitindo Analytics sem autorização;
- páginas legais ainda explicitamente pré-lançamento;
- canais públicos obrigatórios inválidos;
- seis cases/três destaques incompletos ou quebrados;
- metadata/robots/sitemap incompatíveis com lançamento;
- hydration/runtime error relevante;
- acessibilidade que impeça jornada crítica;
- layout/responsividade que impeça uso;
- GA4 obrigatório da V1 sem validação, salvo exceção formal;
- Search Console sem propriedade verificável quando a tarefa depender dele;
- backup/restore sem evidência válida;
- produção instável.

## 20. Melhorias opcionais

Não bloqueiam por si só:

- microajuste visual sem impacto de clareza;
- ganho marginal de Lighthouse;
- animação mais refinada;
- mudança de copy já aprovada;
- nova observabilidade;
- novo canal social além dos definidos;
- redesign de e-mail;
- automação adicional de backup;
- mudança de Neon;
- pooled connection;
- rollback destrutivo automatizado;
- novas páginas SEO.

Só executar opcional se resolver problema concreto e não ampliar a entrega.

## 21. Fora de escopo

Não implementar:

- redesign geral;
- nova homepage;
- novo portfólio/case;
- novos serviços;
- blog;
- CMS;
- CRM;
- área do cliente;
- Google Ads;
- Meta Pixel;
- remarketing;
- newsletter;
- nova arquitetura;
- troca de hospedagem;
- troca de banco;
- Celery/Redis;
- nova plataforma de observabilidade;
- nova política de backup;
- otimização prematura de Neon;
- alteração de infraestrutura sem regressão;
- SEO programático;
- multilíngue.

## 22. Fases

### Fase 1 — Release gaps e acabamento

- confirmar inputs pendentes;
- footer;
- textos legais/versionamento;
- wiring GA4 no deploy;
- mecanismo seguro de force frontend deploy/indexação;
- correções objetivas encontradas.

### Fase 2 — Release candidate

- CI;
- deploy em produção ainda `noindex`;
- regressão funcional;
- conteúdo/mídia/links;
- seis cases/três destaques;
- acessibilidade;
- responsividade;
- desempenho;
- operação/evidências.

### Fase 3 — Integrações externas

- GA4 real;
- conta Google Ads preparada;
- vínculo GA4 ↔ Google Ads;
- `generate_lead` como conversão principal;
- `whatsapp_click` apenas como secundária/observação quando configurado;
- auto-tagging;
- Consent Mode v2 para sinais publicitários;
- Search Console domain property;
- validações de consentimento;
- preparação de sitemap/indexação.

Pode ocorrer em paralelo à Fase 2 quando não alterar código.

### Fase 4 — GO/NO-GO e lançamento

- relatório final;
- decisão explícita;
- `VITE_SITE_INDEXING_ENABLED=true`;
- force frontend redeploy;
- smoke;
- Search Console/sitemap;
- evidências.

### Fase 5 — Fechamento

- spec `implemented`;
- Roadmap;
- specs README;
- documentação final somente onde o estado mudou;
- registrar V1 lançada;
- separar manutenção futura.

## 23. Validações técnicas finais

Frontend:

```bash
cd frontend
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

Executar também E2E/prerender específico vigente quando aplicável.

Backend, se houver alteração backend ou para regressão final planejada:

```bash
cd backend
python manage.py check
python manage.py check --deploy
python manage.py makemigrations --check --dry-run
ruff check .
pytest
```

Raiz:

```bash
git diff --check
```

CI real em GitHub continua sendo evidência obrigatória.

## 24. Critérios de aceite

- [ ] `main` pós-0010 usada como baseline.
- [ ] Nenhuma entrega anterior foi reaberta sem regressão.
- [ ] Footer contém e-mail, WhatsApp e Instagram reais.
- [ ] Footer preserva identidade, navegação, legal e preferências.
- [ ] Footer funciona por teclado e mobile.
- [ ] WhatsApp não permanece duplicado em fontes conflitantes.
- [ ] Instagram oficial foi verificado, não inventado.
- [ ] Políticas deixaram de se declarar pré-lançamento.
- [ ] Versões legais finais estão coerentes.
- [ ] Formulário usa versão da Política publicada.
- [ ] GA4 real está configurado e validado.
- [ ] Conta Google Ads oficial está criada/configurada sem campanha ativa.
- [ ] GA4 está vinculado ao Google Ads.
- [ ] Auto-tagging do Google Ads está habilitado.
- [ ] `generate_lead` deriva de `lead_form_success` e está configurado como conversão Primary.
- [ ] `whatsapp_click`, se importado, está Secondary / observation only.
- [ ] Nenhuma tag Ads separada, remarketing ou Enhanced Conversions está ativa.
- [ ] Consent Mode v2 respeita a categoria `advertising`.
- [ ] GA continua condicionado ao consentimento.
- [ ] Nenhuma PII é enviada ao GA.
- [ ] Search Console domain property está verificada.
- [ ] Home, portfolio, seis cases, legais e 404 foram revisados.
- [ ] Três destaques continuam corretos.
- [ ] Links/mídias/fallbacks foram revisados.
- [ ] Formulário e Admin passaram regressão.
- [ ] SMTP/fluxo de Lead continua operacional.
- [ ] Consentimento passou regressão.
- [ ] SEO/prerender/hydration passaram regressão.
- [ ] Acessibilidade final aprovada.
- [ ] Responsividade final aprovada.
- [ ] Desempenho de produção foi revisado.
- [ ] HTTPS/domínios/health/logs estão coerentes.
- [ ] Evidência recente de backup/cópia externa/restore foi confirmada.
- [ ] Release candidate ficou validada em produção ainda noindex.
- [ ] Lukas deu `GO` explícito.
- [ ] Indexação foi habilitada somente depois do GO.
- [ ] Frontend foi rebuildado/reimplantado com indexação `true`.
- [ ] Robots/meta/sitemap/canonical pós-lançamento estão corretos.
- [ ] Sitemap foi submetido ao Search Console.
- [ ] Smoke pós-lançamento passou.
- [ ] Nenhum bloqueador crítico permanece aberto.
- [ ] Melhorias opcionais não foram confundidas com bloqueadores.
- [ ] Documentação final foi reconciliada.
- [ ] V1 foi declarada pronta para divulgação.

## 25. Evidências de conclusão

Registrar:

- SHA lançado;
- CI/deploy correspondente;
- data/hora do GO;
- checklist final;
- screenshots somente quando úteis e sem dados sensíveis;
- resultado do smoke;
- estado de robots/sitemap;
- propriedade Search Console verificada;
- GA4 real validado;
- confirmação de revisão legal;
- confirmação humana do footer/conteúdo;
- bloqueadores resolvidos;
- exceções formais, se existirem.

Não registrar:

- credenciais;
- tokens;
- cookies;
- `.env`;
- dados de Lead real;
- backup;
- dados pessoais desnecessários.

## 26. Documentação no fechamento

Depois do lançamento:

- esta spec → `implemented`;
- `docs/specs/README.md`;
- `docs/ROADMAP.md` → Entrega 11 concluída / V1 concluída;
- `docs/PRODUCT.md` somente se o produto realmente mudou;
- `docs/ARCHITECTURE.md` somente para estado operacional durável alterado;
- runbooks apenas se o procedimento real de deploy/indexação/GA mudou;
- não criar ADR sem decisão estrutural nova.

## 27. Branch sugerida

Depois da aprovação desta spec:

```text
release/v1-final-qa-and-launch
```

A branch concentra somente:

- gaps finais necessários;
- footer;
- legal/versionamento;
- GA/deploy/indexation mechanism;
- correções de bloqueadores encontrados.

O lançamento efetivo ocorre somente após o release candidate estar em `main`, produção noindex validada e `GO` explícito.

## 28. Definição de pronto

A Entrega 11 termina quando a V1 deixa de ser apenas uma produção técnica e passa a ser uma publicação comercial verificável:

```text
release candidate noindex
→ QA final
→ legal final
→ GA4 real
→ Google Ads preparado sem campanha
→ Search Console verificado
→ GO explícito
→ indexing=true
→ frontend redeploy
→ smoke
→ sitemap submetido
→ documentação fechada
```

A ausência de indexação imediata pelo Google, crescimento de tráfego ou conversões comerciais não é falha da entrega.
