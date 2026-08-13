# 0004 — Portfólio e seis cases

* **Status:** approved
* **Responsável:** Lukas Frick
* **Data:** 13 de agosto de 2026
* **Branch-base:** `main`
* **Entrega do roadmap:** 4 — Portfólio e seis cases
* **Specs predecessoras:** `0001-frontend-foundation-and-routing.md`, `0002-project-content-and-media-preparation.md` e `0003-definitive-homepage.md`
* **Documentos relacionados:** `AGENTS.md`, `frontend/AGENTS.md`, `docs/PRODUCT.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md`, `docs/ROADMAP.md`, `docs/content/` e `frontend/src/data/projects/`

## 1. Contexto

As Entregas 1, 2 e 3 estão implementadas, validadas e integradas à `main`.

A Repage já possui:

* fundação pública de navegação e acessibilidade;
* homepage definitiva aprovada visualmente;
* seis projetos cadastrados;
* três destaques derivados da fonte tipada;
* seis dossiês de evidência;
* manifesto tipado de prontidão e mídia;
* screenshots reais desktop e mobile;
* imagens principais;
* vídeos WebM;
* posters e fallbacks;
* URLs verificadas;
* autorização operacional aplicável;
* revisão de privacidade aprovada;
* testes unitários e Playwright Test configurados.

As rotas `/portfolio` e `/portfolio/:slug` ainda mantêm a implementação estrutural temporária criada na Entrega 1.

A fonte principal de projetos ainda contém somente identidade, natureza, status e destaque. A 0004 deve evoluir essa estrutura para sustentar listagem e cases finais sem duplicar a camada de evidência e mídia preparada na 0002.

A homepage aprovada e o Design System consolidado são referências visuais diretas. Esta entrega não inicia nova descoberta de identidade ou direção visual.

## 2. Objetivo

Transformar `/portfolio` e `/portfolio/:slug` em experiências comerciais finais da V1, apresentando os seis projetos com conteúdo verificável, mídia real e uma estrutura editorial compartilhada.

A entrega deve:

* tornar o portfólio escaneável e comercialmente útil;
* permitir aprofundamento em cada projeto;
* demonstrar capacidade por evidência, não promessa;
* explicar corretamente natureza e participação;
* preservar a identidade consolidada da Repage;
* funcionar de forma equivalente em desktop e mobile;
* permanecer útil mesmo quando o projeto externo estiver indisponível;
* impedir publicação de case incompleto ou não autorizado.

## 3. Projetos e ordem

A Entrega 4 cobre exatamente, nesta ordem:

1. EchoCosmicEnergia;
2. Axium;
3. DevSchedule;
4. GreenTweet;
5. A Alma no Comando;
6. Alicerce da Alma.

Naturezas obrigatórias:

* EchoCosmicEnergia — `paid`;
* Axium — `paid`;
* DevSchedule — `technical-challenge`;
* GreenTweet — `owned`;
* A Alma no Comando — `paid`;
* Alicerce da Alma — `paid`.

DevSchedule e GreenTweet não são clientes.

A natureza deve permanecer explícita na fonte tipada e pode aparecer editorialmente no portfólio e na abertura do case.

Não utilizar expressões que transformem projeto próprio ou desafio técnico em trabalho para cliente.

## 4. Participação confirmada

Para esta entrega está confirmado que Lukas Frick conduziu, nos seis projetos:

* estratégia inicial;
* estrutura;
* direção visual/design;
* desenvolvimento.

Para DevSchedule e GreenTweet, essa confirmação abrange estratégia inicial, estrutura, direção visual/design e desenvolvimento.

DevSchedule permanece classificado como `technical-challenge` e GreenTweet como `owned`. Nenhum dos dois é cliente. Ambos integram publicamente o portfólio da Repage como projetos conduzidos por Lukas Frick, respeitando suas naturezas de desafio técnico e projeto próprio. A relação temporal com a formalização da Repage permanece não confirmada; portanto, não afirmar que foram originalmente desenvolvidos pela Repage enquanto marca sem essa confirmação.

Nos projetos pagos, o trabalho foi refinado e validado com o cliente.

A copy pública pode descrever essa participação de forma compatível com a natureza de cada projeto.

Não afirmar que o cliente autorizou publicação, aprovou o case ou forneceu depoimento sem evidência específica.

Não afirmar que um projeto foi desenvolvido formalmente pela Repage quando a relação temporal com a criação da marca não estiver confirmada.

`predatesRepage` continua sendo informação opcional e só deve ser preenchida mediante confirmação explícita.

Ausência dessa informação não bloqueia a publicação do case e não deve gerar inferência pública.

## 5. Resultado esperado

Ao final:

* `/portfolio` apresenta exatamente seis projetos publicáveis;
* os seis projetos possuem case final em `/portfolio/:slug`;
* todos derivam de uma fonte pública tipada comum;
* identidade, natureza, ordem, resumo e conteúdo não são duplicados entre homepage, portfólio e cases;
* o manifesto da 0002 continua sendo a fonte dos metadados e da prontidão das mídias;
* cada case possui conteúdo editorial completo;
* cada case possui mídia real;
* os projetos pagos só são publicáveis com autorização operacional `confirmed`;
* projeto próprio e desafio técnico exigem `not-required`;
* os seis projetos terminam `published` somente se todos os critérios de publicação forem atendidos;
* projeto `draft` não aparece no portfólio nem recebe case público;
* links externos verificados aparecem quando aplicáveis;
* galeria funciona com teclado e toque;
* vídeos aparecem somente quando provam fluxo ou interação relevante;
* mídia indisponível possui fallback;
* anterior, próximo e retorno ao portfólio funcionam;
* páginas temporárias e textos “em preparação” são removidos dessas rotas;
* desktop e mobile recebem aprovação visual humana;
* nenhuma entrega posterior é antecipada.

## 6. Arquitetura de dados

### 6.1 Fonte pública única

A implementação deve preservar uma única fonte pública de projetos para:

* homepage;
* portfólio;
* cases;
* ordem;
* destaques;
* navegação anterior/próximo;
* metadados básicos.

A estrutura existente em `frontend/src/data/projects/` deve ser evoluída, não substituída por uma segunda lista paralela.

É permitido manter arquivos separados por responsabilidade desde que exista um único contrato público agregado e que um mesmo dado não seja mantido manualmente em dois lugares.

A camada pode continuar separando:

* identidade e conteúdo editorial do projeto;
* manifesto de evidência/prontidão/mídia;
* seletores derivados.

### 6.2 Conteúdo obrigatório do projeto

O contrato final deve permitir representar:

* `slug`;
* `title`;
* `nature`;
* `publicationStatus`;
* `portfolioOrder`;
* `featuredOrder`, quando aplicável;
* `summary`;
* visão geral;
* contexto;
* desafio;
* solução;
* participação;
* serviços;
* funcionalidades;
* decisões relevantes;
* tecnologias;
* URL pública opcional;
* seleção de mídia;
* estado de autorização derivado da prontidão;
* metadados básicos de rota.

Tecnologias continuam informação secundária.

Não duplicar dimensões, alt, poster, fallback, origem ou autorização de mídia que já existam em `projectReadinessManifest`.

### 6.3 Homepage

Os resumos dos três destaques devem passar a derivar da mesma fonte editorial usada pelo portfólio.

Remover duplicação desnecessária dos resumos atualmente mantidos em conteúdo exclusivo da homepage.

Essa consolidação é mudança de dados, não autorização para redesenhar a homepage aprovada.

A composição visual da homepage permanece congelada salvo regressão concreta causada pela integração.

## 7. Regra de publicação

Um projeto só pode utilizar:

`publicationStatus: 'published'`

quando todos os requisitos obrigatórios estiverem atendidos.

`publicationStatus: 'published'` não pode ser a única condição usada pelos seletores públicos. A exposição pública depende da validação conjunta dos requisitos obrigatórios desta spec e do manifesto de prontidão. Alterar isoladamente `publicationStatus` não pode expor um projeto que falhe em conteúdo, autorização, mídia, privacidade, cover, galeria, natureza, ordem, slug ou outro requisito obrigatório.

O gate concreto dessa exposição será definido na Fase 1; esta spec não prescreve ainda sua implementação.

### Projeto pago

Exigir:

* conteúdo obrigatório completo;
* `authorizationStatus: 'confirmed'`;
* fonte de autorização registrada;
* mídia `ready`;
* revisão de privacidade `approved`;
* captura principal disponível;
* galeria utilizável;
* natureza válida;
* ordem válida;
* slug único.

### Projeto próprio ou desafio técnico

Exigir:

* conteúdo obrigatório completo;
* `authorizationStatus: 'not-required'`;
* mídia `ready`;
* revisão de privacidade `approved`;
* captura principal disponível;
* galeria utilizável;
* natureza válida;
* ordem válida;
* slug único.

URL pública é opcional no contrato geral.

Quando existir e estiver exposta no case, deve estar `verified`.

A regra antiga da 0002 que considera qualquer projeto `published` indevido deve ser substituída pela validação de publicabilidade desta spec.

Ao concluir a Entrega 4, a expectativa é que os seis projetos atendam ao contrato e estejam `published`.

Caso um requisito obrigatório realmente não possa ser comprovado, o projeto permanece `draft`, não é exposto publicamente e a spec não pode ser marcada `implemented` enquanto o roadmap exigir seis cases.

## 8. Integridade

Testes devem detectar pelo menos:

* quantidade diferente de seis projetos;
* slug duplicado;
* `portfolioOrder` ausente, duplicado ou inválido;
* `featuredOrder` inválido;
* natureza inválida;
* projeto `published` sem conteúdo obrigatório;
* projeto pago publicado sem autorização confirmada;
* projeto não pago com autorização diferente de `not-required`;
* projeto publicado sem mídia pronta;
* projeto publicado sem cover;
* projeto publicado sem galeria;
* mídia registrada inexistente;
* caminho de mídia duplicado;
* URL pública inválida quando utilizada;
* projeto `draft` retornado por seletor público;
* projeto publicado sem metadados básicos;
* homepage destacando projeto que não existe na fonte pública.

Não reduzir as validações existentes da 0002 apenas para permitir publicação.

## 9. Conteúdo editorial

A copy dos cases deve partir exclusivamente de:

* Produto aprovado;
* dossiê do projeto;
* repositório/README já auditado na 0002;
* manifesto de mídia;
* confirmações explícitas de Lukas registradas nesta spec.

Não reauditar projetos de origem sem contradição concreta.

Não transformar implementação técnica em resultado comercial.

Exemplos proibidos:

* aumento de vendas sem evidência;
* aumento de leads;
* aumento de conversão;
* melhoria percentual;
* satisfação do cliente;
* sucesso de campanha;
* número de usuários;
* resultado de SEO;
* resultado de Ads.

Quando o motivo comercial original não estiver documentado, escrever o desafio como desafio de estrutura, comunicação, experiência ou implementação observado no próprio projeto.

Preferir:

> O trabalho precisava organizar...

ou:

> O desafio de implementação foi...

em vez de:

> O cliente precisava aumentar...

quando essa necessidade do cliente não possuir evidência.

## 10. Base factual por projeto

### 10.1 EchoCosmicEnergia

**Natureza:** projeto pago.

**Resumo-base:**

Experiência full stack com catálogo, loja, conteúdo editorial e diferentes pontos de contato em uma presença digital integrada.

**Capacidades confirmadas:**

* catálogo;
* carrinho;
* checkout;
* pagamentos;
* loja virtual;
* blog;
* página de links;
* painel administrativo;
* Analytics;
* preparação/uso de Ads conforme evidência.

**Tecnologias verificadas:**

* React;
* TypeScript;
* Vite;
* Styled Components;
* Django;
* Django REST Framework.

**Participação:**

Lukas conduziu estratégia inicial, estrutura, direção visual e desenvolvimento full stack, com refinamentos validados com o cliente.

**URL verificada:**

`https://echocosmicenergia.com.br/`

### 10.2 Axium

**Natureza:** projeto pago.

**Resumo-base:**

Experiência institucional para uma empresa de serviços, com páginas especializadas e conteúdo editorial responsivo.

**Capacidades confirmadas:**

* experiência institucional;
* páginas de serviços;
* conteúdo editorial;
* formulário;
* registro de lead;
* integração com RD Station;
* Analytics;
* preparação/uso de Ads conforme evidência.

**Participação:**

Lukas conduziu estratégia inicial, estrutura, direção visual e desenvolvimento frontend, com refinamentos validados com o cliente.

**URL verificada:**

`https://projeto-lukasfrick-axiumdh.vercel.app/`

### 10.3 DevSchedule

**Natureza:** desafio técnico.

Não é cliente.

**Resumo-base:**

Aplicação de agendamento com fluxo público por etapas e uma área administrativa demonstrativa.

**Capacidades confirmadas:**

* seleção de serviço;
* calendário;
* disponibilidade;
* dados para agendamento;
* fluxo público;
* área administrativa demonstrativa;
* gestão visual do estado administrativo.

**Tecnologias verificadas:**

* React;
* TypeScript;
* Vite;
* Styled Components;
* Django REST Framework;
* PostgreSQL;
* Docker.

**Participação:**

Projeto técnico estruturado e desenvolvido por Lukas.

**URL verificada:**

`https://projetolukasfrick-devschedule.vercel.app/`

### 10.4 GreenTweet

**Natureza:** projeto próprio.

Não é cliente.

**Resumo-base:**

Aplicação full stack inspirada em uma rede social, construída para explorar fluxos de publicação, perfil e interação entre usuários.

**Capacidades confirmadas:**

* cadastro;
* autenticação JWT;
* perfis;
* publicações;
* curtidas;
* comentários;
* seguidores;
* notificações;
* busca.

**Tecnologias verificadas:**

* React;
* TypeScript;
* Vite;
* Django REST Framework;
* PostgreSQL.

**Participação:**

Projeto próprio estruturado e desenvolvido por Lukas.

Não atribuir participação à Repage sem confirmação temporal.

**URL verificada:**

`https://greentweet.vercel.app/`

### 10.5 A Alma no Comando

**Natureza:** projeto pago.

**Direção factual:**

Landing page responsiva organizada em seções editoriais.

**Elementos verificados:**

* abertura;
* apresentação de método;
* apresentação de obra/livro;
* manifesto;
* CTAs da própria página.

**Tecnologias verificadas:**

* React;
* TypeScript;
* Vite;
* Styled Components.

**Participação:**

Lukas conduziu estratégia inicial, estrutura, direção visual e desenvolvimento da página, com refinamentos validados com o cliente.

**URL verificada:**

`https://www.aalmanocomando.com.br/`

Não inferir resultados de lançamento, venda da obra ou conversão.

### 10.6 Alicerce da Alma

**Natureza:** projeto pago.

**Direção factual:**

Experiência institucional responsiva organizada para apresentar conteúdo, serviços e diferenciais.

**Elementos verificados:**

* abertura;
* serviços;
* diferenciais;
* conteúdo institucional.

**Participação:**

Lukas conduziu estratégia inicial, estrutura, direção visual e desenvolvimento da página, com refinamentos validados com o cliente.

**URL verificada:**

`https://www.alicercedaalma.com.br/`

Depoimentos existentes dentro do projeto não são depoimentos sobre a Repage e não devem ser apresentados como prova de resultado do trabalho.

## 11. `/portfolio`

### 11.1 Objetivo

A página deve permitir que o visitante compreenda rapidamente a variedade do portfólio e escolha um projeto para aprofundar.

Escaneabilidade vem antes de experiência longa.

### 11.2 Abertura

Direção editorial:

* superfície `ink`;
* identificação curta de Portfólio;
* headline forte;
* descrição curta;
* continuidade visual com a Repage;
* sem repetir a introdução do Hero;
* sem entrada de marca;
* sem palco sticky.

Direção de copy:

**Eyebrow**

> Portfólio

**Título**

> Projetos reais para contextos diferentes.

**Descrição**

> Trabalhos pagos, projetos próprios e desafios técnicos que mostram diferentes formas de combinar estrutura, design e desenvolvimento.

### 11.3 Listagem

Usar grade editorial controlada no desktop.

Aqui, “editorial” descreve composição, hierarquia e ritmo; não significa uma estética crua, excessivamente tipográfica ou com pouca mídia. A mídia real da Entrega 2 deve ter forte presença visual, e screenshots não devem ser tratados como pequenas thumbnails secundárias.

Ordem obrigatória:

1. EchoCosmicEnergia;
2. Axium;
3. DevSchedule;
4. GreenTweet;
5. A Alma no Comando;
6. Alicerce da Alma.

Cada item possui:

* mídia principal real;
* natureza;
* título;
* resumo;
* principais serviços/capacidades;
* acesso ao case.

Não exibir tecnologia como informação dominante.

Não transformar a listagem em seis cards SaaS iguais.

A listagem pode explorar diferentes escalas, proporções, assimetria controlada, recortes e alternância de densidade. O resultado deve parecer uma coleção curada, não seis cards SaaS nem um bento grid. A qualidade visual dos projetos deve ser perceptível antes da leitura detalhada.

Não usar vídeo na listagem.

Não usar autoplay.

### 11.4 Ritmo da grade

Desktop pode utilizar grade estrutural de 12 colunas com três pares editoriais:

* EchoCosmicEnergia com maior presença + Axium;
* DevSchedule + GreenTweet com maior presença;
* A Alma no Comando + Alicerce da Alma com equilíbrio equivalente.

A diferença de escala deve ser moderada.

Não criar hierarquia que pareça indicar maior importância comercial, melhor qualidade ou cliente mais relevante.

Tablet reduz a assimetria progressivamente.

Mobile usa sequência vertical única, preservando ordem e mídia.

A variação de escala e ritmo deve servir à curadoria e à presença da mídia, sem transformar a listagem em uma sequência de molduras tipográficas vazias.

### 11.5 Referências visuais operacionais

As referências abaixo orientam somente mecanismos para esta entrega:

* Koto: presença forte de mídia; portfólio como showcase comercial; relação texto/imagem; layouts flexíveis;
* Build in Amsterdam: escaneabilidade da listagem; transição listagem → case; mídia como prova; alternância entre explicação e demonstração;
* BASIC/DEPT: ritmo de storytelling; capítulos semânticos; mídia assumindo o palco; variação entre cases dentro do mesmo sistema;
* Studio Freight: narrativa contextual por projeto; evitar linguagem genérica de agência.

Não devem ser copiadas identidade, paleta, tipografia, layout completo, animação característica ou conceito proprietário.

`docs/DESIGN_SYSTEM.md`, a homepage aprovada e a mídia real da Entrega 2 continuam sendo as referências primárias.

### 11.6 Interação

Hover, quando disponível, pode usar:

* pequeno deslocamento de mídia;
* mudança de seta/linha;
* alteração discreta de contraste.

Não esconder informação no hover.

Foco deve produzir indicação equivalente.

O item completo não precisa virar uma grande área clicável se isso prejudicar semântica. Deve existir link claro para o case.

## 12. Estrutura compartilhada dos cases

Todos os seis cases usam o mesmo `CasePage` e os mesmos componentes estruturais.

Não criar seis páginas React independentes.

Variações devem vir de dados e composição de mídia.

Estrutura:

1. retorno ao portfólio;
2. abertura;
3. mídia principal;
4. visão geral;
5. contexto;
6. desafio;
7. solução;
8. participação;
9. serviços/capacidades;
10. funcionalidades;
11. decisões relevantes quando existirem;
12. galeria;
13. tecnologias;
14. link externo quando disponível;
15. CTA;
16. anterior/próximo;
17. retorno ao portfólio.

A estrutura semântica é compartilhada, mas nem todo bloco precisa possuir a mesma densidade visual.

A sequência acima representa cobertura semântica obrigatória, não 17 seções visuais consecutivas. É permitido agrupar conteúdos relacionados em capítulos editoriais, intercalar mídia e texto e variar densidade e ritmo conforme o conteúdo.

Conteúdo vazio não gera seção vazia.

## 13. Direção visual dos cases

### 13.1 Abertura

Usar superfície `ink`.

Deve conter:

* retorno ao portfólio;
* natureza como metadado editorial, não badge comercial;
* título;
* resumo;
* participação;
* link externo quando disponível;
* mídia principal real.

O título é o elemento dominante.

A mídia principal pode atravessar visualmente a transição entre abertura escura e conteúdo claro.

Não copiar o `ProjectStage` da homepage.

Sticky não é padrão e não deve reproduzir o `ProjectStage` da homepage. Só pode ser considerado diante de necessidade narrativa concreta, exigindo track curto, release previsível, tratamento para viewport baixa e solução própria para mobile. Qualquer uso deve ser validado no checkpoint visual antes de replicação.

A mídia mostra a identidade do trabalho; a composição da página mostra a identidade da Repage. Os projetos podem ocupar bastante espaço através de suas mídias, mas a camada externa do case deve continuar reconhecivelmente Repage por tipografia, enquadramento, gutters, superfícies, ritmo, navegação, linhas, planos, recortes, microinterações e motion grammar.

Não transformar cada case em um tema integral baseado na identidade visual do projeto.

### 13.2 Corpo editorial

Textos longos usam superfície `paper` e largura de leitura confortável.

Usar:

* hierarquia tipográfica;
* números/eyebrows quando úteis;
* assimetria controlada;
* mídia integrada;
* respiro variável.

Evitar transformar:

* contexto;
* desafio;
* solução;
* participação;
* serviços;
* funcionalidades;

em uma sequência de cards iguais.

### 13.3 Prova visual

Depois de contexto/solução, a mídia deve assumir papel mais forte.

A composição pode alternar:

* imagem larga;
* dupla desktop/mobile;
* detalhe;
* imagem vertical;
* sequência funcional.

A variação é determinada pelos ativos existentes e não por componente específico para cada cliente.

## 14. Curadoria de mídia

Não recapturar nem reprocessar a mídia da 0002/0003 nesta entrega salvo defeito concreto.

Usar o manifesto tipado como fonte dos arquivos e metadados.

### EchoCosmicEnergia

Priorizar:

* `echo-social.png`;
* `echo-store-desktop.png`;
* `echo-articles-desktop.png`;
* `echo-business-services-desktop.png`;
* `echo-home-mobile.png`;
* `echo-links-mobile.png`.

Sem vídeo no case inicial.

### Axium

Priorizar:

* `axium-social.png`;
* `axium-nr01-desktop.png`;
* `axium-nr01-mobile.png`;
* `axium-blog-desktop.png`;
* `axium-blog-mobile.png`;
* `axium-home-mobile.png`.

Sem vídeo no case inicial.

### DevSchedule

Priorizar:

* `devschedule-social.png`;
* calendário;
* disponibilidade;
* etapa de dados;
* início mobile;
* dashboard administrativo demonstrativo.

Usar vídeo somente para demonstrar os dois fluxos distintos:

* cliente;
* administração.

Preferir as versões desktop já preparadas como demonstração principal.

Não expor credenciais ou mecanismo de autenticação.

### GreenTweet

Priorizar:

* `greentweet-social.png`;
* feed;
* perfil;
* notificações;
* comentários;
* estados mobile.

Usar um tour desktop para demonstrar a interação entre esses estados.

Não apresentar perfis demonstrativos como usuários reais ou clientes.

### A Alma no Comando

Priorizar:

* `alma-social.png`;
* `alma-home-mobile.png`;
* `alma-method-desktop.png`;
* `alma-book-desktop.png`;
* `alma-manifesto-desktop.png`;
* `alma-manifesto-mobile.png`.

Sem vídeo no case inicial.

### Alicerce da Alma

Priorizar:

* `alicerce-social.png`;
* `alicerce-home-mobile.png`;
* `alicerce-services-desktop.png`;
* `alicerce-services-mobile.png`;
* `alicerce-differentials-desktop.png`;
* `alicerce-differentials-mobile.png`.

Não usar screenshots de depoimentos como prova da Repage.

Sem vídeo no case inicial.

## 15. Vídeos

Vídeo é prova complementar, nunca requisito para compreender o case.

Nesta entrega, usar somente onde interação ou fluxo acrescentam informação relevante:

* DevSchedule;
* GreenTweet.

Regras:

* sem autoplay;
* sem áudio automático;
* `controls`;
* `playsInline`;
* `preload="metadata"` ou estratégia equivalente;
* poster existente;
* fallback existente;
* nunca iniciar mais de um vídeo automaticamente;
* conteúdo textual e imagens devem explicar o projeto sem reprodução;
* `prefers-reduced-motion` não pode retirar conteúdo.

Não carregar vídeos dos quatro cases que não os utilizam.

## 16. Galeria e visualizador

Cada case possui galeria editorial inline.

Imagens informativas usam alt do manifesto como base.

A galeria deve funcionar completamente sem abertura de visualizador.

Também implementar um visualizador compartilhado para ampliação.

Não adicionar biblioteca externa apenas para isso.

Comportamento obrigatório:

* acionável por botão/link semântico;
* diálogo modal acessível;
* botão de fechar;
* `Esc`;
* foco inicial coerente;
* foco contido enquanto aberto;
* retorno de foco ao acionador;
* anterior/próximo quando houver mais de uma imagem;
* teclado;
* toque;
* nenhuma dependência de swipe;
* legenda/descrição quando necessária;
* imagem preservando proporção;
* ausência de overflow horizontal.

Preferir plataforma nativa, como `<dialog>`, se ela atender integralmente ao comportamento e acessibilidade necessários.

## 17. Fallback de mídia

Mídia quebrada não pode produzir espaço vazio ou ícone de imagem quebrada como estado final.

Para imagem de galeria:

1. tentar o ativo registrado;
2. quando aplicável, usar cover do próprio projeto como fallback;
3. se não houver alternativa válida, apresentar estado textual neutro de mídia indisponível.

Nunca usar:

* screenshot de outro projeto;
* imagem conceitual;
* imagem gerada;
* placeholder que pareça prova real.

Vídeos reutilizam poster e fallback registrados no manifesto.

Falha de vídeo não remove as imagens ou o conteúdo do case.

## 18. Link externo

Exibir somente quando:

* existir URL pública;
* `linkStatus` estiver `verified`;
* autorização aplicável permitir publicação.

Rótulo recomendado:

> Ver projeto publicado

Links externos:

* abrem de forma segura;
* usam proteção adequada;
* não recebem dados pessoais;
* não são requisito para entender o case.

Não fazer requisição automática em runtime para testar disponibilidade do projeto externo.

A indisponibilidade futura do site externo não invalida o conteúdo local do case.

## 19. Navegação entre cases

A navegação deriva de `portfolioOrder`.

É limitada, não circular.

Comportamento:

* primeiro projeto: somente próximo;
* projetos intermediários: anterior e próximo;
* último projeto: somente anterior.

Cada link deve apresentar título suficiente para identificar o destino.

Todos os cases também oferecem retorno explícito para:

`/portfolio`

Não manter uma lista manual separada para navegação.

## 20. CTA

Cada case termina com uma ponte para conversão.

Direção:

**Eyebrow**

> Tem um projeto em mente?

**Título**

> Vamos conversar sobre o que sua próxima página precisa resolver.

**Ação**

> Solicitar orçamento

Destino:

`/#contato`

Não implementar formulário nesta entrega.

Não criar ação falsa.

## 21. Metadados básicos

Remover metadados temporários:

* `Portfólio em preparação`;
* `Case em preparação`.

`/portfolio` recebe título e descrição finais básicos.

Cada case recebe título e descrição derivados da fonte única do projeto.

Projetos `published` podem usar estado básico `index`.

Projeto `draft`, slug desconhecido e 404 permanecem `noindex`.

Continuam fora da 0004:

* canonical;
* Open Graph completo;
* Twitter Card;
* JSON-LD;
* sitemap;
* prerender;
* HTML específico por rota no build.

Esses itens pertencem à Entrega 8.

## 22. 404 e projeto não publicável

Slug desconhecido mantém comportamento de 404.

Projeto existente porém `draft` não expõe conteúdo interno.

Para a experiência pública, ele deve se comportar como conteúdo não disponível e permanecer `noindex`.

Não exibir:

* conteúdo parcial;
* motivo de autorização;
* blocker editorial;
* informação interna de prontidão.

Na conclusão esperada da 0004, os seis projetos estão `published`, portanto esse estado funciona como proteção futura e não como estado normal da entrega.

## 23. Responsividade

Validar:

* desktop amplo;
* notebook;
* tablet;
* mobile;
* mobile compacto;
* viewport com pouca altura;
* celular horizontal.

### Portfolio

Desktop preserva grade editorial.

Tablet reduz assimetria antes da leitura ficar comprimida.

Mobile usa coluna única.

Nenhum projeto depende de hover.

### Cases

Abertura reorganiza título, metadados, ações e mídia sem comprimir a composição desktop.

Mobile não é apenas desktop empilhado. Para composições expressivas, a implementação deve buscar a versão mobile da mesma ideia, preservando presença da mídia, hierarquia, narrativa, identidade, CTA e ritmo. A geometria pode mudar significativamente quando necessário.

Blocos editoriais se tornam verticais quando necessário.

Duplas desktop/mobile preservam legibilidade.

Galeria não força imagem larga além da viewport.

Visualizador funciona em tela pequena.

Navegação anterior/próximo reorganiza sem perda de identificação.

Evitar alturas rígidas.

## 24. Movimento

A 0004 utiliza a mesma linguagem de movimento da Repage sem repetir coreografias da homepage.

Preferir:

* revelações temporais curtas;
* continuidade entre texto e mídia;
* pequenas respostas de hover/foco;
* transições discretas no visualizador;
* mudanças de superfície intencionais.

Não usar como padrão:

* sticky/pinned stage sem necessidade narrativa concreta;
* scroll-driven longo;
* scroll hijacking;
* snap;
* entrada de marca;
* loop;
* mesma animação em todos os projetos.

Com `prefers-reduced-motion`:

* conteúdo aparece completo;
* mídias permanecem estáveis;
* hover animado deixa de ser necessário;
* visualizador continua funcional;
* vídeo nunca inicia sozinho.

## 25. Acessibilidade

Obrigatório:

* heading principal único por rota;
* hierarquia de headings consistente;
* landmarks;
* skip link preservado;
* foco de rota preservado;
* foco visível;
* links externos identificáveis;
* alt correto;
* natureza expressa em texto;
* conteúdo independente de cor;
* conteúdo independente de hover;
* conteúdo independente de movimento;
* galeria operável por teclado;
* modal sem armadilha involuntária;
* `Esc`;
* retorno de foco;
* alvos adequados ao toque.

Não introduzir regressão no `PublicLayout`, header ou menu mobile.

## 26. Desempenho

Na listagem:

* carregar somente covers dos seis projetos;
* não carregar vídeos;
* usar lazy loading fora da área inicial quando adequado;
* preservar dimensões conhecidas.

Nos cases:

* mídia principal recebe prioridade proporcional;
* galeria posterior usa lazy loading;
* vídeos usam carregamento controlado;
* não carregar mídia de outros cases;
* não pré-carregar todos os vídeos;
* evitar layout shift.

Não adicionar dependência de galeria, carrossel ou vídeo sem necessidade comprovada.

## 27. Áreas provavelmente afetadas

Principais:

* `frontend/src/pages/Portfolio/`;
* `frontend/src/pages/Case/`;
* `frontend/src/data/projects/`;
* `frontend/src/app/routeMetadata.ts`;
* testes de projetos;
* testes de rotas;
* Playwright E2E.

Novos componentes compartilhados podem incluir:

* card/item editorial de projeto;
* abertura de case;
* moldura de mídia reutilizável;
* galeria;
* visualizador;
* navegação entre cases;
* fallback de mídia.

Não criar abstração genérica sem repetição real.

Não redesenhar componentes da homepage para reutilização forçada.

## 28. Estratégia de implementação

A entrega é ampla e visualmente sensível.

Não deve ser enviada como um único prompt gigante.

Dividir a implementação em fases coerentes.

### Fase 1 — dados e contrato de publicação

* consolidar fonte pública;
* materializar conteúdo editorial;
* implementar ordem;
* implementar regras de publicação;
* reconciliar seletores;
* ajustar testes de integridade;
* não alterar UI além do necessário.

### Fase 2 — `/portfolio`

* implementar abertura;
* implementar grade editorial;
* integrar seis projetos;
* revisar visualmente desktop e mobile;
* congelar a página após aprovação humana.

### Fase 3 — estrutura compartilhada de case

* implementar shell comum;
* usar um case representativo para validar composição;
* validar abertura, corpo editorial, mídia, CTA e navegação;
* revisar visualmente;
* congelar a estrutura compartilhada após aprovação.

### Fase 4 — seis cases

* preencher os seis pela fonte tipada;
* integrar galerias;
* integrar links;
* anterior/próximo;
* validar conteúdo e natureza;
* não criar componentes específicos por projeto sem necessidade real.

### Fase 5 — mídia interativa e fallbacks

* visualizador;
* vídeos de DevSchedule e GreenTweet;
* falhas de imagem;
* poster/fallback;
* teclado;
* reduced motion.

### Fase 6 — refinamento responsivo e visual

* notebook;
* tablet;
* mobile;
* mobile compacto;
* viewport baixa;
* horizontal;
* revisar todos os seis cases;
* corrigir somente problemas observados.

### Fase 7 — fechamento

* validações completas;
* revisão de diff;
* reconciliação documental;
* atualização de status.

Prompts intermediários devem ser apenas deltas.

Não repetir toda a spec a cada fase.

Durante fases intermediárias, executar somente testes pontuais necessários para proteger a continuação.

A bateria completa ocorre no fechamento.

## 29. Validações automatizadas

Cobrir no mínimo:

### Dados

* seis projetos;
* ordem correta;
* slugs únicos;
* naturezas corretas;
* três destaques preservados;
* conteúdo obrigatório;
* regras de autorização;
* regras de publicação;
* mídia necessária;
* seletores públicos;
* anterior/próximo.

### Portfolio

* seis projetos publicados;
* ordem;
* título;
* natureza;
* resumo;
* mídia;
* link para case;
* nenhum `draft`.

### Case

Para cada slug:

* rota resolve projeto correto;
* título;
* natureza;
* resumo;
* participação;
* conteúdo obrigatório;
* galeria;
* CTA;
* link externo quando aplicável;
* anterior/próximo correto.

Também validar:

* slug desconhecido;
* projeto draft protegido;
* metadata básica;
* fallback relevante.

Não usar snapshots extensos como substituto de comportamento.

## 30. Playwright E2E

No fechamento da spec, executar a suíte configurada.

Cobrir:

* `/portfolio`;
* os seis slugs;
* slug desconhecido;
* acesso direto;
* reload;
* navegação SPA;
* voltar/avançar;
* retorno ao portfólio;
* anterior/próximo;
* CTA para contato;
* links externos sem necessariamente abandonar a sessão de teste;
* galeria;
* visualizador;
* teclado;
* foco;
* menu mobile;
* movimento reduzido;
* mídia indisponível quando possível simular de forma controlada;
* ausência de overflow;
* console;
* warnings React.

Todos os seis cases precisam de smoke automatizado.

Não é necessário executar todos os seis em todos os viewports.

Distribuir os viewports de forma representativa e manter testes dedicados para comportamentos responsivos importantes.

## 31. Revisão visual humana

Testes técnicos não substituem avaliação estética.

Antes de fechar a spec:

* revisar `/portfolio` em desktop/notebook e mobile;
* revisar os seis cases;
* inspecionar todos os seis ao menos em desktop e mobile;
* confirmar hierarquia, ritmo, mídia, legibilidade e identidade;
* confirmar que nenhum case parece página genérica ou template SaaS;
* confirmar que a estrutura compartilhada não tornou os seis visualmente indistinguíveis;
* confirmar que diferenças vêm do conteúdo e da mídia, não de seis layouts independentes.

Perguntar também:

* A mídia possui presença suficiente para provar a qualidade do trabalho antes da leitura detalhada?
* O tratamento editorial está enriquecendo mídia, hierarquia e narrativa ou apenas tornando a interface mais crua?

Uma solução excessivamente tipográfica, vazia, estática ou que trate screenshots como thumbnails secundárias deve ser considerada visualmente incompleta.

Usar checkpoints.

Parte aprovada não deve ser reaberta posteriormente sem regressão, incompatibilidade ou nova instrução.

## 32. Validações finais

No diretório `frontend`:

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

Na raiz:

```bash
git diff --check
```

Além disso:

* revisar diff completo;
* verificar ausência de dependências desnecessárias;
* verificar ausência de novos arquivos de mídia sem justificativa;
* verificar que mídias aprovadas não foram modificadas acidentalmente;
* verificar ausência de segredos e dados pessoais;
* verificar os seis projetos `published`;
* verificar que nenhum blocker interno é exposto na interface.

## 33. Documentação

Durante a implementação, atualizar os dossiês de `docs/content/projects/` somente quando a 0004 materializar confirmação editorial que substitua uma pendência antiga.

Em especial:

* participação confirmada nesta spec pode substituir as pendências correspondentes;
* relação temporal com a formalização da Repage continua não confirmada e não deve ser inventada.

Ao concluir:

* marcar a spec como `implemented`;
* atualizar `docs/specs/README.md`;
* atualizar `docs/ROADMAP.md` para registrar a Entrega 4 concluída e a Entrega 5 como próxima;
* reconciliar qualquer regra sistêmica realmente descoberta com `docs/DESIGN_SYSTEM.md`;
* atualizar AGENTS somente se surgir regra operacional duradoura;
* não criar nova página no Notion apenas para esta spec.

## 34. Fora de escopo

Não implementar:

* redesign da homepage;
* mudança dos três destaques;
* novas capturas de mídia sem defeito comprovado;
* novos projetos;
* backend;
* Django;
* PostgreSQL;
* formulário funcional;
* e-mails;
* WhatsApp novo sem destino aprovado;
* idempotência;
* proteção contra abuso;
* consentimento;
* Analytics;
* Ads;
* política jurídica final;
* canonical;
* Open Graph completo;
* Twitter Card;
* sitemap;
* JSON-LD;
* prerender;
* CI/CD;
* deploy;
* CMS;
* CRUD de portfólio;
* Cloudinary;
* upload de mídia;
* nova identidade;
* nova pesquisa geral de design.

## 35. Riscos

### Conteúdo parecer mais comprovado do que realmente é

Mitigação:

* usar matriz factual;
* evitar resultado comercial;
* não atribuir motivação ao cliente sem fonte;
* diferenciar claramente natureza e participação.

### Duplicação de dados

Mitigação:

* uma fonte pública agregada;
* manifesto continua responsável por mídia/evidência;
* remover resumo duplicado da homepage.

### Cases visualmente genéricos

Mitigação:

* Design System e homepage como linguagem;
* estrutura editorial;
* mídia real dominante;
* variação de composição por conteúdo;
* checkpoint humano antes de replicar para seis cases.

### Seis layouts diferentes

Mitigação:

* shell compartilhado;
* variação por dados;
* componentes específicos apenas diante de necessidade concreta.

### Excesso de motion

Mitigação:

* fluxo normal;
* sem sticky como padrão;
* movimento curto;
* reduced motion estável.

### Página pesada

Mitigação:

* vídeos somente DevSchedule e GreenTweet;
* lazy loading;
* mídia de um case por vez;
* nenhuma mídia de outros projetos pré-carregada.

### Regressão da homepage

Mitigação:

* alterações nela limitadas à consolidação da fonte de dados;
* checkpoints visuais da 0003 permanecem congelados.

## 36. Critérios de aceite

* [ ] `/portfolio` não possui conteúdo temporário.
* [ ] `/portfolio` apresenta exatamente seis projetos.
* [ ] Ordem dos seis está correta.
* [ ] Natureza dos seis está correta.
* [ ] DevSchedule não é apresentado como cliente.
* [ ] GreenTweet não é apresentado como cliente.
* [ ] Os seis cases existem.
* [ ] Os seis cases utilizam estrutura compartilhada.
* [ ] Cada case contém visão geral, contexto, desafio, solução e participação.
* [ ] Cada case contém serviços/capacidades e funcionalidades.
* [ ] Cada case contém tecnologias quando relevantes.
* [ ] Cada case possui mídia principal real.
* [ ] Cada case possui galeria real.
* [ ] DevSchedule utiliza vídeo apenas para demonstrar fluxos relevantes.
* [ ] GreenTweet utiliza vídeo apenas para demonstrar interação relevante.
* [ ] Demais cases não carregam vídeo sem necessidade.
* [ ] Galeria funciona sem visualizador.
* [ ] Visualizador é acessível por teclado.
* [ ] `Esc` fecha visualizador.
* [ ] Foco retorna ao acionador.
* [ ] Fallback de mídia funciona.
* [ ] Links externos são derivados de URL verificada.
* [ ] Case permanece útil sem acessar projeto externo.
* [ ] Anterior/próximo deriva da ordem.
* [ ] Navegação anterior/próximo não é circular.
* [ ] Todos possuem retorno ao portfólio.
* [ ] Todos possuem CTA para `/#contato`.
* [ ] Nenhum case inventa métrica ou resultado.
* [ ] Nenhum case afirma autorização do cliente sem evidência.
* [ ] Relação temporal com a Repage não é inventada.
* [ ] Homepage continua visualmente aprovada.
* [ ] Fonte pública não duplica resumos da homepage.
* [ ] `publicationStatus` funciona como gate real.
* [ ] Os seis projetos estão `published` no fechamento.
* [ ] Projeto `draft` não é exposto publicamente.
* [ ] Metadados “em preparação” foram removidos.
* [ ] SEO completo não foi antecipado.
* [ ] `prefers-reduced-motion` funciona.
* [ ] Não existe informação exclusiva de hover.
* [ ] Não existe overflow horizontal.
* [ ] Desktop e mobile receberam revisão visual humana.
* [ ] Lint aprovado.
* [ ] Typecheck aprovado.
* [ ] Testes aprovados.
* [ ] Playwright E2E aprovado.
* [ ] Build aprovado.
* [ ] `git diff --check` aprovado.
* [ ] Documentação reconciliada.
* [ ] Spec marcada `implemented` somente após todos os critérios obrigatórios.

## 37. Definição de pronto

A Entrega 4 está concluída quando:

* os seis projetos são publicáveis;
* `/portfolio` apresenta os seis de forma editorial, clara e responsiva;
* os seis cases apresentam conteúdo real, participação correta e mídia aprovada;
* natureza e autoria não induzem interpretação falsa de cliente;
* navegação entre cases funciona;
* galerias, vídeos aplicáveis e fallbacks funcionam;
* teclado, foco, toque e movimento reduzido funcionam;
* desktop e mobile possuem acabamento aprovado;
* a homepage não sofreu regressão;
* todas as validações finais obrigatórias passaram;
* documentação e status foram reconciliados;
* a spec está `implemented`;
* a entrega está pronta para revisão humana e fluxo normal de merge.
