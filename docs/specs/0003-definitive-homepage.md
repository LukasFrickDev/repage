# 0003 — Homepage definitiva

* **Status:** implemented
* **Responsável:** Lukas Frick
* **Data:** 7 de agosto de 2026
* **Última revisão:** 12 de agosto de 2026
* **Branch-base:** `main`
* **Branch de implementação:** `feat/definitive-homepage`
* **Entrega do roadmap:** 3 — Homepage definitiva
* **Specs predecessoras:** `0001-frontend-foundation-and-routing.md` e `0002-project-content-and-media-preparation.md`
* **Documentos relacionados:** `AGENTS.md`, `frontend/AGENTS.md`, `docs/PRODUCT.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md`, `docs/ROADMAP.md` e `docs/content/`

## 1. Contexto

As specs 0001 e 0002 estão implementadas e integradas à `main`.

A branch `feat/definitive-homepage` contém a implementação final da homepage definitiva. A entrega consolidou conteúdo real, fonte tipada dos destaques, mídias da 0002, componentes, responsividade, movimento e testes, seguida de aprovação visual humana da homepage completa.

A revisão visual posterior avançou por checkpoints, preservando arquitetura, conteúdo válido, mídia aprovada e trabalho técnico existente. Até esta revisão documental, Hero, Projetos selecionados, Serviços, Suporte e evolução e Proposta de valor e diferenciais já receberam aprovação visual humana como direção e devem ser tratados como congelados durante a continuação da spec, salvo regressão, incompatibilidade técnica ou nova instrução explícita.

Esta revisão final da spec:

* reconcilia o documento com o estado visual já aprovado;
* substitui orientações anteriores de composição que foram superadas durante a implementação;
* preserva Produto, Arquitetura, Design System, specs 0001/0002 e mídia já aprovada;
* registra Processo, Sobre, Contato e Footer conforme implementados;
* mantém fora de escopo desta entrega o portfólio final, cases, formulário funcional, backend, analytics, SEO completo e deploy.

## 2. Objetivo

Concluir a homepage definitiva da Repage em conteúdo, hierarquia, composição visual, mídia, movimento, responsividade e acessibilidade.

A experiência deve:

* explicar rapidamente o que a Repage faz;
* transmitir profissionalismo e identidade própria;
* apresentar prova real cedo;
* evitar aparência de template SaaS ou site institucional genérico;
* criar ritmo e continuidade perceptíveis ao longo da rolagem;
* comunicar corretamente as três ofertas principais;
* explicar diferenciais e processo;
* apresentar Lukas sem transformar o site em currículo;
* conduzir para contato;
* tratar mobile como composição própria;
* receber aprovação visual humana além das validações técnicas.

## 3. Resultado esperado

Ao final:

* a homepage segue a ordem aprovada;
* a copy temporária foi substituída por conteúdo final desta entrega;
* a entrada e o Hero estabelecem uma primeira impressão própria da Repage;
* o Hero não depende da identidade visual dos projetos;
* EchoCosmicEnergia, Axium e DevSchedule são os três destaques;
* os destaques derivam das fontes estruturadas e usam mídia real da 0002;
* Projetos funciona como um palco compartilhado de portfólio, e não como cards ou blocos alternados;
* natureza administrativa dos projetos permanece nos dados, mas não aparece como badge comercial;
* Serviços apresenta três ofertas principais com o mesmo peso, copy clara, escopo rápido e mídia real;
* Suporte e evolução aparece separadamente como continuidade pós-publicação;
* Proposta de valor e diferenciais usam capítulo ink próprio, afirmação tipográfica forte e quatro argumentos finais construídos progressivamente;
* Processo possui seis momentos apresentados como trajetória;
* Sobre apresenta Repage e Lukas com presença visual intencional;
* Contato possui conteúdo editorial final e não exibe ação falsa;
* movimento possui função e respeita movimento reduzido;
* desktop e mobile possuem acabamento equivalente;
* a homepage recebe aprovação visual humana;
* nenhuma entrega posterior é antecipada.

## 4. Estado atual relevante

### 4.1 Aprovado visualmente e congelado

Na branch `feat/definitive-homepage`, os seguintes checkpoints já foram aprovados visualmente:

* Hero;
* transição Hero → Projetos;
* introdução de Projetos;
* palco sticky compartilhado de Projetos;
* EchoCosmicEnergia, Axium e DevSchedule dentro do `ProjectStage`;
* CTA de case e CTA geral de projetos;
* composição mobile de Projetos;
* Intro sticky de Serviços;
* Landing pages;
* Sites institucionais;
* Soluções personalizadas;
* escopos violetas dos serviços;
* mídias reais e tratamento/frame das mídias de Serviços;
* microinterações dos serviços;
* Suporte e evolução como epílogo da seção;
* mudança direta de superfície paper → ink na entrada de Proposta de valor;
* abertura tipográfica `Clareza para quem chega. / Estrutura para o que vem depois.`;
* descrição e ponte `Na prática, isso significa`;
* quatro diferenciais finais em composição 2 × 2 no desktop e sequência vertical no mobile;
* progressão reversível dos diferenciais e hold terminal curto antes de Processo.

Essas áreas não devem ser redesenhadas novamente durante a continuação da 0003, salvo:

* regressão concreta;
* problema de acessibilidade;
* incompatibilidade responsiva;
* requisito novo;
* instrução explícita de Lukas.

### 4.2 Resultado final aprovado

Processo, Sobre, Contato, Footer, integração entre capítulos, responsividade, acessibilidade e ritmo final foram revisados e aprovados visualmente. A homepage completa recebeu validação humana independente das validações automatizadas.

### 4.3 Estado técnico

Preservar a base técnica existente quando saudável.

* os seis projetos continuam `draft`;
* os destaques derivam de fonte tipada e mídia real;
* testes automatizados já existem e devem ser ajustados quando a implementação final exigir;
* Playwright Test local é a ferramenta preferencial para QA reproduzível;
* indisponibilidade de navegador MCP não invalida Playwright Test local;
* validação visual humana foi concluída em desktop e mobile;
* Instrument Sans permanece a família principal;
* nenhuma validação histórica substitui a rodada final de lint, typecheck, testes, build, E2E e diff.

## 5. Ordem obrigatória

A homepage deve seguir exatamente:

1. Hero;
2. Projetos selecionados;
3. Serviços;
4. Proposta de valor e diferenciais;
5. Processo;
6. Sobre;
7. Contato.

Footer permanece depois do conteúdo da rota por responsabilidade do `PublicLayout`.

Não alterar essa ordem.

## 6. Conteúdo e direção visual da homepage

A homepage deve ser percebida como experiência contínua, não como seções independentes apenas empilhadas.

Ritmo de referência:

`entrada → abertura → prova → oferta → posicionamento → processo → marca → conversão`

Evitar como solução recorrente:

* divisão `50 / 50` genérica;
* cards repetidos;
* separadores idênticos;
* grid visível apenas decorativo;
* mesma animação em todas as seções;
* sticky em todas as seções;
* desktop apenas empilhado no mobile;
* padding e densidade idênticos em toda a homepage.

Decisões recorrentes devem usar tokens semânticos existentes antes de hardcodes locais.

Quando uma decisão for específica de um capítulo da homepage, preferir `homepageTokens.<seção>` ou estrutura semântica equivalente. Alteração global só deve ocorrer quando o comportamento for realmente compartilhado.

### 6.1 Hero

**Identificação**

> Sites e soluções digitais para profissionais, especialistas e negócios.

**Título**

> Uma nova página para o seu negócio começa aqui.

**Descrição**

> Estratégia, design e desenvolvimento para transformar ideias e serviços em experiências digitais profissionais, claras e preparadas para fortalecer sua marca e facilitar novos contatos.

**CTA principal**

> Solicitar orçamento

Destino:

`/#contato`

**CTA secundário**

> Ver projetos

Destino:

`/portfolio`

O Hero comunica atividade, público, transformação e ação sem restringir a Repage a landing pages e sites institucionais.

#### Entrada

Existe uma assinatura curta de marca antes do estado final do Hero.

Deve:

* executar uma vez;
* ser curta;
* não funcionar como loader;
* não bloquear navegação;
* desembocar diretamente no Hero;
* ser removida ou simplificada em movimento reduzido.

#### Composição aprovada

O Hero é 100% protagonizado pela identidade da Repage.

A headline divide o peso visual com um palco proprietário que materializa:

`ideia → estrutura → experiência digital`

A composição aprovada usa, de forma coerente com a identidade:

* planos;
* curva/percurso;
* superfícies;
* estrutura inclinada;
* acentos azul-violeta;
* bloco claro de experiência digital;
* asset real da marca Repage;
* relação de profundidade coerente entre percurso e estrutura: quando a linha cruza a estrutura inclinada, o trecho correspondente passa visualmente por trás dela.

O palco não deve:

* inventar projeto real;
* parecer dashboard genérico;
* reproduzir página dobrada literalmente;
* depender de identidades visuais externas;
* exibir colagem dos projetos;
* virar ornamentação sem função.

A marca não deve ser duplicada de forma gratuita dentro do palco.

#### Responsividade do Hero

O Hero possui tratamento próprio para notebooks desktop com menor altura útil.

Em viewport larga e baixa:

* a composição pode subir moderadamente;
* o espaço morto superior deve ser reduzido;
* headline, palco e CTAs devem permanecer equilibrados;
* CTAs não podem encostar no limite inferior;
* essa adaptação deve permanecer específica do Hero.

Não alterar gutter ou spacing global da homepage para corrigir altura de Hero.

Tablet e mobile preservam tratamento próprio.

#### Transição Hero → Projetos

O Hero termina no final de sua própria composição.

Não existe faixa, spacer ou estado intermediário dedicado no bottom do Hero.

A linha horizontal e o pequeno marcador vertical usados na entrada seguinte pertencem ao topo de Projetos.

A sequência é:

`Hero termina → Projects começa imediatamente → linha/marcador → intro de Projetos`

### 6.2 Projetos selecionados

**Eyebrow**

> Projetos selecionados

**Título**

> Trabalho real para necessidades diferentes.

A introdução pública prioriza eyebrow + headline forte. Copy auxiliar pode permanecer na fonte de conteúdo sem ser obrigada a competir visualmente com essa abertura.

Ordem obrigatória:

1. EchoCosmicEnergia;
2. Axium;
3. DevSchedule.

#### EchoCosmicEnergia

> Experiência full stack com catálogo, loja, conteúdo editorial e diferentes pontos de contato em uma presença digital integrada.

Slug: `echo-cosmic-energia`

#### Axium

> Experiência institucional para uma empresa de serviços, com páginas especializadas e conteúdo editorial responsivo.

Slug: `axium`

#### DevSchedule

> Aplicação de agendamento com fluxo público por etapas e uma área administrativa demonstrativa.

Slug: `dev-schedule`

DevSchedule continua sendo desafio técnico na fonte e não pode ser apresentado como cliente.

Não exibir como badge ou rótulo comercial:

* `Projeto pago`;
* `Projeto próprio`;
* `Desafio técnico`.

A natureza permanece obrigatória nos dados para proteger veracidade.

#### Intro e ownership da transição

A entrada de Projetos é parte da própria seção.

* linha horizontal + marcador vertical pertencem ao topo de Projetos;
* não existe spacer autônomo entre Hero e Projetos;
* a intro assume escala expressiva, abaixo do Hero e acima de uma section title convencional;
* essa escala deve usar o token semântico compartilhado de intro imersiva quando aplicável, e não hardcode local.

A intro funciona como primeiro estado da experiência de portfólio.

Ela se estabelece, permanece legível por tempo suficiente e entrega o palco para EchoCosmicEnergia com overlap curto. A entrada de Echo não deve antecipar demais a saída da intro, e a intro não deve permanecer competindo com o primeiro projeto por um trecho longo de scroll.

#### Arquitetura aprovada do palco

Os três destaques utilizam um **mesmo `ProjectStage` compartilhado**.

Todos devem manter:

* mesma composição;
* mesmos eixos principais;
* mesma hierarquia;
* mesma posição de nome, resumo e CTA;
* mesmo padrão de mídia desktop principal + mídia mobile;
* mesmo tratamento de browser frame;
* mesmo tratamento de device frame;
* mesma lógica de escala e movimento;
* mesma relação entre mídia, texto e ações.

Não alternar lados entre os projetos.

Não criar background individual por projeto.

Não criar layout específico para Echo, Axium ou DevSchedule.

A unidade do portfólio vem do palco compartilhado; a diferença vem do conteúdo e da identidade das screenshots reais.

O enquadramento interno de Projects deve preservar respiro lateral coerente com o restante da homepage sem alterar gutter/container global.

Quando desktop + celular aparecem juntos, o conjunto completo deve ser centralizado pela sua área visual combinada, e não pelo browser frame isoladamente.

#### Sticky e progressão

Projetos utiliza uma única experiência sticky/pinned interna de portfólio.

O scroll da página permanece natural.

Não usar:

* interceptação de wheel;
* scroll hijacking;
* `scroll-snap` rígido.

A progressão deve fazer o visitante sentir que atravessa o portfólio dentro de um mesmo palco.

Transições entre:

`Echo → Axium → DevSchedule`

devem ser sobrepostas e suaves, evitando:

`projeto A desaparece completamente → vazio → projeto B aparece`.

A intro e os projetos podem usar progresso local de scroll e transforms/springs quando isso preservar suavidade e desempenho.

#### Mídias aprovadas para a homepage

Usar as mídias preparadas na 0002 e aprovadas para esse palco:

**EchoCosmicEnergia**

* desktop principal: `/projects/echo-cosmic-energia/echo-social.png`
* mobile: `/projects/echo-cosmic-energia/echo-home-mobile.png`

**Axium**

* desktop principal: `/projects/axium/axium-social.png`
* mobile: `/projects/axium/axium-home-mobile.png`

**DevSchedule**

* desktop principal: `/projects/dev-schedule/devschedule-social.png`
* mobile: `/projects/dev-schedule/devschedule-client-services-mobile.png`

Não substituir DevSchedule pela tela de calendário como mídia principal da homepage.

Não recapturar mídia nesta spec.

#### Frames

Desktop:

* screenshot principal usa tratamento consistente de janela/browser;
* chrome discreto;
* moldura fina;
* sombra controlada;
* sem laptop físico;
* sem URL falsa ou branding de navegador.

Mobile:

* screenshot usa frame de device/celular discreto;
* bezel fino;
* cantos coerentes;
* hardware mínimo;
* sem mockup fotorealista.

O mesmo sistema de frame deve ser aplicado aos três projetos.

#### Ações

Cada projeto possui ação específica:

> Ver case

Destino:

`/portfolio/:slug`

A seção possui ação geral:

> Ver todos os projetos

Destino:

`/portfolio`

O CTA geral permanece dentro da experiência de Projetos, com hierarquia inferior a `Ver case`.

No mobile:

* `Ver case` ocupa a faixa superior à direita do bloco informativo do projeto, associado diretamente ao nome;
* `Ver todos os projetos` permanece separado como ação geral e deve caber em uma única linha;
* deve existir separação espacial suficiente entre a ação específica e a ação geral para que não pareçam redundantes ou concorrentes.

Após DevSchedule, não manter bloco redundante de CTA fora do palco apenas para repetir `Ver todos os projetos`.

#### Mobile

Mobile preserva o mesmo sistema narrativo e a mesma identidade do `ProjectStage`, adaptando composição, escala e duração.

Não transformar automaticamente Projetos em três cards ou blocos independentes.

A mídia deve continuar grande e legível.

#### Movimento reduzido

Com `prefers-reduced-motion`:

* remover ou simplificar sticky/transforms narrativos;
* manter os três projetos disponíveis e legíveis em estado estável;
* preservar conteúdo, links, hierarquia e mídia.

### 6.3 Serviços

**Eyebrow**

> O que a Repage desenvolve

**Título**

> Uma solução digital começa pela necessidade, não pelo formato.

**Descrição**

> Da ideia à publicação, cada projeto combina estratégia, design e desenvolvimento de acordo com o que o negócio realmente precisa.

As três ofertas principais possuem o mesmo peso:

1. Landing pages;
2. Sites institucionais;
3. Soluções personalizadas.

Suporte e evolução permanece separado como continuidade pós-publicação.

A direção anterior de `lista editorial interativa` e expansão `+ / −` está **superada**.

Não reintroduzir accordion, lista numerada ou padrão editorial anterior.

#### Intro aprovada

A seção começa em superfície paper imediatamente após Projetos, sem faixa vazia adicional criada pelo padding genérico da homepage.

O padding global da homepage não deve ser alterado por causa dessa exceção. Services controla internamente seu próprio spacing.

Somente a introdução de Serviços utiliza uma experiência sticky curta.

Arquitetura conceitual:

`ServicesSection → IntroTrack → IntroStage sticky → Offers em fluxo normal`

A intro possui três momentos:

1. entrada progressiva;
2. curto estado de leitura;
3. saída lateral enquanto Landing pages assume a viewport.

Desktop/notebook:

* eyebrow + headline formam o bloco principal;
* apoio permanece próximo e legível;
* a composição é um núcleo narrativo centralizado/equilibrado, sem espalhar os textos nas extremidades;
* headline/eyebrow saem suavemente para a esquerda;
* texto de apoio sai suavemente para a direita;
* ambos fazem fade progressivo;
* deslocamentos laterais são curtos e controlados.

Mobile:

* eyebrow → headline → apoio em sequência vertical;
* saída lateral é reduzida;
* não pode existir overflow horizontal.

A intro pode usar aproximadamente uma viewport útil e track curto suficiente para a coreografia, sem transformar Services inteira em sticky.

#### Landing pages

**Descrição**

> Para campanhas, lançamentos, eventos, produtos e serviços que precisam conduzir o visitante a uma ação principal clara.

**Escopo rápido**

> Captação de leads · lançamento de produto · campanha / evento

**Mídia**

`/projects/a-alma-no-comando/alma-social.png`

A mídia desktop/horizontal é a fonte principal compartilhada do serviço; no mobile, o recorte e a escala se adaptam sem trocar a natureza da composição. A mídia funciona como evidência do tipo de entrega, não como segundo portfólio.

#### Sites institucionais

**Descrição**

> Para apresentar sua marca, organizar serviços e informações e construir uma presença digital profissional e confiável.

**Escopo rápido**

> Apresentação da marca · serviços · conteúdo e contato

**Mídia desktop/horizontal**

`/projects/axium/axium-social.png`

A escolha deve comunicar estrutura institucional, navegação, marca e organização de conteúdo.

#### Soluções personalizadas

**Descrição**

> Para necessidades que vão além de uma página: e-commerce, áreas restritas, painéis, agendamentos, integrações e aplicações web avaliadas caso a caso.

**Escopo rápido**

> E-commerce · áreas restritas · agendamentos e integrações

**Mídia desktop/horizontal**

`/projects/dev-schedule/devschedule-admin-dashboard-desktop.png`

A oferta deve deixar clara atuação além de páginas e sites, sem prometer capacidade irrestrita para qualquer sistema ou escala.

#### Composição das ofertas

Os três serviços permanecem em fluxo normal.

Não usar sticky para Landing pages, Sites institucionais ou Soluções personalizadas.

Não criar:

* uma viewport por serviço;
* grandes cenas isoladas;
* cards SaaS;
* lista editorial;
* tabela;
* accordion.

Cada oferta usa:

* título com presença;
* descrição principal legível;
* escopo curto em violeta;
* mídia real;
* mesma família visual.

Os três serviços possuem mesmo peso comercial, mas não precisam parecer três caixas idênticas.

Em desktop/notebook, copy e mídia devem se relacionar pelo centro da composição, em vez de serem empurradas para as bordas externas. Landing pages e Soluções personalizadas preservam `copy | mídia`; Sites institucionais preserva `mídia | copy`, com respiro central suficiente para não comprimir texto e imagem.

O enquadramento lateral das ofertas é local de Services e deve permanecer coerente com Projects sem alterar gutter/container global.

A seção deve manter continuidade e respiro suficiente entre ofertas sem voltar ao excesso de scroll da primeira tentativa.

#### Progressão e microinterações

A revelação de cada serviço deve tratar copy e mídia como uma única composição.

Direção aprovada:

* Landing pages: copy entra discretamente da esquerda e mídia da direita;
* Sites institucionais: mídia entra discretamente da esquerda e copy da direita;
* Soluções personalizadas: repete a lógica de Landing pages;
* título, descrição e escopo podem manter stagger curto dentro da copy;
* mídia começa próxima da copy e conclui seu crop/clip reveal junto do fechamento da composição;
* movimentos laterais são curtos;
* entrada é reversível conforme o usuário desce e sobe;
* não usar `once: true` como comportamento final.

Priorizar:

* `opacity`;
* pequenos `translate`;
* crop/clip reveal da mídia.

O próximo serviço pode começar a ganhar presença antes de o anterior abandonar totalmente a área de leitura, mantendo continuidade.

Não usar animação contínua sem função.

#### Escopos violetas

A camada de escopo em violeta é parte aprovada da hierarquia comercial.

Ela:

* não substitui a descrição;
* funciona como leitura rápida;
* deve permanecer mais destacada que body secundário;
* não deve virar coleção de badges SaaS ou cápsulas pesadas.

#### Mídia e `ServiceMediaFrame`

As mídias reais usam um sistema visual compartilhado e mais leve que os browser/device frames de Projetos.

Direção aprovada:

* hairline/contorno sutil;
* cantos consistentes;
* sombra em camadas controlada;
* sensação de superfície digital;
* chrome de desktop discreto quando usado;
* camada secundária/página de apoio sutil;
* acento violeta lateral discreto e claramente secundário à imagem, sem formar grande faixa dominante;
* reveal por crop/clip na entrada.

Não usar:

* laptop físico;
* grande placa ink;
* browser chrome pesado;
* URL falsa;
* glow;
* mockup fotorealista.

A mídia deve apoiar a clareza do serviço, não dominar a copy.

#### Responsividade de Serviços

Desktop e notebook preservam relação equilibrada entre texto e mídia.

Mobile:

* texto aparece antes da mídia;
* escopo permanece legível;
* reveal é mais curto;
* a seção mantém densidade controlada;
* não depende de hover.

#### Movimento reduzido

Com `prefers-reduced-motion`:

* intro e ofertas permanecem completas e legíveis;
* transforms narrativos podem ser removidos;
* frames e mídia permanecem em estado estável;
* nenhuma informação depende da animação.

#### Suporte e evolução

Suporte e evolução é um **epílogo de Serviços**, não uma quarta oferta.

**Eyebrow**

> Depois da publicação

**Headline**

> O projeto pode continuar evoluindo.

**Texto**

> Depois da publicação, a Repage também pode continuar ao lado do projeto com atualizações, correções, refinamentos e novas evoluções avaliadas conforme a necessidade.

O apoio deve possuir presença editorial real, com peso suficiente para não parecer legenda.

Headline e apoio formam uma composição concentrada e equilibrada, sem grande vazio horizontal.

O epílogo explicita três dimensões de continuidade:

**Atualizações**

> Pequenos ajustes e melhorias de conteúdo, estrutura e interface.

**Correções**

> Ajustes pontuais para manter a experiência consistente.

**Novas evoluções**

> Expansões e refinamentos avaliados conforme a necessidade.

Esses três pontos:

* devem ser menores e mais compactos que as três ofertas principais;
* explicam semanticamente o que significa continuidade;
* podem usar acentos violetas e conexão gráfica discreta;
* não devem parecer três novos serviços ou planos.

Não usar como conceito principal:

* linha abstrata sem conteúdo;
* páginas genéricas sem explicação;
* screenshot;
* browser frame;
* headset;
* engrenagem;
* card SaaS.

O epílogo permanece na superfície paper e fecha Services antes da próxima mudança de capítulo.

Movimento:

* leve;
* sem sticky;
* reversível com o scroll;
* sequência perceptível `eyebrow → headline → apoio → Atualizações → Correções → Novas evoluções`;
* os três pontos entram individualmente, com overlap curto e sem aparecer todos de uma vez;
* pequenos deslocamentos + opacity;
* sem animação contínua.

### 6.4 Proposta de valor e diferenciais

**Eyebrow**

> Por que Repage

**Título**

> Clareza para quem chega. Estrutura para o que vem depois.

**Descrição**

> A Repage conecta estratégia, direção visual e desenvolvimento para transformar necessidades reais em experiências digitais profissionais, claras e preparadas para evoluir.

**Ponte**

> Na prática, isso significa

#### Diferenciais finais

**Responsabilidade direta**

> Você fala com quem conduz o projeto do primeiro alinhamento aos ajustes, reduzindo ruído e mantendo contexto e decisões no mesmo lugar.

**Condução integrada**

> Estrutura, conteúdo, direção visual e desenvolvimento são pensados em conjunto para que a experiência funcione como um todo.

**Necessidade antes do formato**

> A solução parte do objetivo, do contexto e do momento do negócio — não de um pacote pronto ou de um formato definido antes do problema.

**Continuidade quando fizer sentido**

> A entrega pode terminar na publicação ou seguir com correções, atualizações e novas evoluções avaliadas conforme a necessidade.

Não usar promessa de resultado, garantia de qualidade ou superlativo vazio.

#### Composição aprovada

A seção começa diretamente após o epílogo paper de Services com mudança para superfície ink/azul-grafite, sem spacer ou divisor intermediário.

O background:

* permanece escuro;
* pode usar poucos planos tonais grandes e muito sutis em azul-grafite/violeta para criar profundidade;
* não usa grid, glow, ruído ou dobra de página literal;
* não usa `R` gigante/watermark;
* não depende de ilustração.

A headline é um único `h2` semântico, visualmente construída em dois polos próximos:

`Clareza para quem chega.`

`Estrutura para o que vem depois.`

A segunda frase pode deslocar-se horizontalmente de forma controlada, sem virar composição diagonal ou espalhada.

A descrição permanece integrada à abertura, próxima da headline.

Depois da descrição, `Na prática, isso significa` introduz os quatro argumentos.

Desktop/notebook:

* argumentos formam composição final 2 × 2;
* duas colunas e duas linhas alinhadas;
* conjunto compacto;
* sem offsets editoriais que recriem escada/diagonal;
* sem cards, backgrounds individuais ou bordas;
* micro-sinal proprietário e discreto substitui marcador circular genérico;
* o mesmo micro-sinal é usado nos quatro argumentos;
* violeta permanece contido.

Mobile:

* argumentos seguem verticalmente em ordem 1 → 4;
* não forçar 2 × 2;
* preservar hierarquia e leitura;
* reduzir amplitude dos deslocamentos laterais.

#### Progressão aprovada

A abertura usa progresso local de scroll, de forma contínua e reversível.

Sequência:

`Clareza`
→
`Estrutura`
→
`descrição`
→
`Na prática, isso significa`
→
`Responsabilidade direta`
→
`Condução integrada`
→
`Necessidade antes do formato`
→
`Continuidade quando fizer sentido`
→
`estado final`
→
`release para Processo`

A headline usa reveal horizontal/máscara, opacity progressiva e deslocamento lateral pequeno. Não usar typewriter ou stagger por caractere.

`Na prática, isso significa` também participa da progressão e não pode ficar estático aguardando os argumentos.

Os argumentos entram individualmente:

* 1 e 3: esquerda → posição final;
* 2 e 4: direita → posição final.

As entradas são reversíveis ao subir o scroll.

Não usar sticky para toda a seção, track longo, snap, wheel interception ou scroll hijacking.

Somente no final da progressão existe um **hold terminal curto**, suficiente para:

* concluir os argumentos 3 e 4;
* apresentar brevemente os quatro argumentos completos;
* impedir que Processo invada a viewport antes de o último argumento terminar;
* liberar naturalmente a próxima seção logo depois.

O hold terminal não pode recriar palco vazio nem separar abertura e diferenciais em duas experiências.

#### Movimento reduzido

Com `prefers-reduced-motion`:

* remover deslocamentos e reveals narrativos;
* exibir headline, descrição, ponte e quatro argumentos em estado completo;
* remover dependência do hold narrativo quando necessário;
* preservar composição, conteúdo e leitura.

**Status deste checkpoint:** aprovado visualmente e congelado.

### 6.5 Processo

**Eyebrow**

> Como funciona

**Título**

> Do primeiro alinhamento à publicação.

**Descrição**

> Um processo próximo e organizado para transformar contexto, objetivos e decisões em uma entrega clara.

Sequência:

1. **Conversa** — entender negócio, necessidade, objetivo, público e momento.
2. **Planejamento** — organizar estrutura, conteúdo, prioridades e caminho da solução.
3. **Criação** — transformar decisões em direção visual e desenvolvimento.
4. **Ajustes** — revisar a entrega com validações objetivas e refinamentos necessários.
5. **Publicação** — preparar e disponibilizar a solução no ambiente definido.
6. **Evolução** — avaliar suporte, manutenção ou novas necessidades depois da entrega.

Não prometer revisões ilimitadas.

#### Trajetória

A representação deve parecer percurso conectado, não grid de seis cards.

Usar linha ou percurso gráfico contínuo com curvas, mudança de direção, alternância ou variação de altura quando isso ajudar a leitura.

Evitar timeline genérica apenas:

`ponto — linha reta — ponto`

Conforme a rolagem avança, o trecho percorrido pode ganhar destaque e a etapa atual assumir maior ênfase, mantendo anteriores e seguintes compreensíveis.

A progressão usa um track local com stage pinned curto e hold terminal:

* não pode bloquear scroll;
* não pode esconder conteúdo;
* o stage fica pinned apenas durante a construção da jornada;
* o hold terminal libera naturalmente após a sexta etapa.

Hover/foco podem reforçar ponto, trecho e texto correspondente, sem seis animações independentes.

Em movimento reduzido, trajetória e conteúdo aparecem em estado estável.

#### Mobile

Criar trajetória própria, predominantemente vertical, com curvas suaves e texto próximo a cada etapa.

Não substituir simplesmente por seis cards empilhados. Desktop e mobile usam a mesma geometria compartilhada entre anchors, markers e path, com trajetória vertical curva no desktop e predominantemente vertical no mobile. A jornada permanece em palco pinned curto, com progressão única, estados reversíveis, seis etapas em ordem e hold terminal antes do release.

**Status deste capítulo:** aprovado visualmente e implementado.

### 6.6 Sobre

**Eyebrow**

> Sobre a Repage

**Título**

> Uma marca independente, conduzida de perto.

**Descrição**

> A Repage é um estúdio de desenvolvimento web conduzido de forma próxima, unindo estrutura, conteúdo, direção visual e tecnologia para criar experiências digitais profissionais e preparadas para evoluir.

**Assinatura**

> Projetos conduzidos por Lukas Frick

**Papel**

> Desenvolvimento e direção digital

A seção deve:

* reforçar confiança;
* esclarecer responsabilidade;
* humanizar a operação;
* manter Repage como marca principal;
* funcionar como desaceleração intencional.

Composição final:

* superfície azul-grafite/azul existente na identidade;
* versão branca da marca quando houver contraste adequado;
* composição tipográfica expressiva;
* brand field localizado com planos, trace e profundidade tonal sutis;
* logo real da Repage como protagonista, com entrada curta guiada pelo progresso local;
* conteúdo em fluxo normal, sem sticky, pin, hold ou runway.

O fundo azul-grafite permanece calmo e a entrada do conteúdo segue `eyebrow → headline → descrição → assinatura`, com animação reversível e estado completo em movimento reduzido.

Não deve:

* virar currículo;
* fingir equipe ampla;
* exigir fotografia;
* repetir `R` decorativamente;
* usar loop de logo.

**Status deste capítulo:** aprovado visualmente e implementado.

### 6.7 Contato

Manter `id="contato"`.

**Eyebrow**

> Vamos conversar

**Título**

> Sua próxima página pode começar por aqui.

**Descrição**

> Conte o que você precisa construir ou evoluir. A Repage entende o contexto, os objetivos e o momento do seu negócio para definir o próximo passo.

A seção finaliza conteúdo e composição, mas não implementa formulário funcional nesta spec.

Usar apenas ações com destino real já aprovado.

Não criar:

* campos falsos;
* submissão temporária;
* botão de envio falso;
* `mailto:` inventado;
* WhatsApp não aprovado.

Remover “em preparação”, “em breve” e qualquer promessa de formulário funcional.

Contato deve funcionar como encerramento comercial e receber movimento mínimo.

O CTA funciona como encerramento editorial; a conversão persistida, backend e formulário funcional permanecem para entregas posteriores.

**Status deste capítulo:** aprovado visualmente e implementado.

### 6.8 Footer

Composição final:

> Sites e soluções digitais para profissionais, especialistas e negócios.

Preservar logo, descrição, navegação, links legais, assinatura e copyright. A faixa principal reúne marca/descrição à esquerda e navegação compacta em duas colunas à direita; a faixa inferior mantém assinatura e copyright como epílogo secundário.

Footer permanece secundário ao encerramento de Contato, com separação tonal e linha superior sutil, sem nova narrativa ou background elaborado.

## 7. Fonte dos três destaques

Os três destaques devem ser derivados da fonte tipada de projetos.

A estrutura deve representar somente o mínimo necessário para seleção e ordem.

Ordem obrigatória:

1. `echo-cosmic-energia`;
2. `axium`;
3. `dev-schedule`.

Criar ou ajustar seletor para retornar exatamente esses três registros na ordem aprovada.

Não manter segunda lista administrativa com nomes duplicados apenas para selecionar projetos.

Copy editorial específica da homepage pode permanecer separada, indexada por slug, quando isso evitar antecipar o modelo completo dos cases.

Não preencher ainda:

* conteúdo completo do case;
* galeria editorial final;
* SEO do case;
* navegação anterior/próximo;
* ordem final dos seis projetos no portfólio.

Todos os seis projetos permanecem com:

`publicationStatus: 'draft'`

## 8. Mídia real

Eliminar interfaces fictícias usadas como prova de projeto.

### Hero

O Hero usa palco proprietário da Repage.

Não adquirir nova mídia, inventar interface de cliente ou adicionar dependência apenas para o efeito.

### Projetos selecionados

Usar somente mídia real aprovada e preparada na 0002, conforme os caminhos registrados em 6.2.

A natureza permanece na fonte estruturada, mas não aparece como badge comercial.

Alt deve derivar da fonte existente quando aplicável.

### Serviços

Services usa recortes reais já preparados na 0002 para demonstrar tipos de entrega, conforme 6.3.

Não transformar Services em segundo Portfólio.

Não recapturar, recomprimir ou substituir mídia aprovada apenas por preferência estética.

### Vídeos

Não utilizar WebM na homepage nesta entrega.

Os vídeos preparados permanecem para cases e experiências posteriores.

## 9. Movimento e microinterações

Usar Framer Motion já existente quando necessário.

Distribuição consolidada:

* Entrada: assinatura curta da marca;
* Hero: organização do palco;
* Projetos: experiência sticky narrativa e progressão entre três projetos;
* Serviços intro: sticky curto com entrada, estado de leitura e saída lateral;
* Serviços ofertas: reveals coordenados e reversíveis de copy + mídia em fluxo normal;
* Suporte e evolução: sequência editorial reversível do grupo principal e dos três pontos;
* Proposta/diferenciais: abertura tipográfica scroll-driven, diferenciais laterais reversíveis e hold terminal curto;
* Processo: trajetória vertical scroll-driven, com stage pinned curto, markers/path compartilhados e hold terminal;
* Sobre: entrada scroll-driven reversível de conteúdo e logo em fluxo normal;
* Contato: entrada scroll-driven curta e reversível, sem sticky ou runway.

Movimento deve:

* apresentar;
* orientar;
* conectar;
* explicar.

Não deve compensar composição fraca.

Não usar:

* scroll hijacking;
* `scroll-snap` rígido;
* loop decorativo;
* máquina de escrever;
* partículas;
* WebGL;
* carrossel infinito;
* sticky prolongado sem função;
* `fade-up` universal;
* informação dependente de animação.

Priorizar `transform`, `opacity` e crop/clip quando apropriado.

Com `prefers-reduced-motion: reduce`:

* remover ou simplificar entrada;
* remover ou simplificar transformações narrativas;
* manter conteúdo completo e estável;
* preservar links, hierarquia, mídia e navegação.

## 10. Superfícies e identidade

Preservar a identidade aprovada.

Direção consolidada até o checkpoint atual:

* Hero: escuro;
* Projetos: escuro;
* Serviços: paper/off-white;
* Suporte e evolução: continuidade do paper de Serviços.

Direção consolidada adicional:

* Proposta/diferenciais: ink/azul-grafite, com profundidade tonal sutil e sem `R` gigante.

Direção final:

* Processo: superfície paper e trajetória vertical com profundidade violeta contida;
* Sobre: azul-grafite/azul existente, brand field localizado e assinatura de Lukas;
* Contato: ink profundo, halo e linhas convergentes discretos.

A alternância deve construir narrativa, não apenas trocar fundo.

Grid estrutural permanece invisível por padrão.

Usar azul-violeta como destaque estratégico.

Evitar:

* template SaaS;
* bento grid automático;
* glassmorphism;
* glow permanente;
* card para cada conteúdo;
* repetição de `50 / 50`;
* gradientes excessivos;
* mesmos divisores;
* mesmo padding em toda a homepage.

### Tokens

Usar tokens existentes antes de hardcode.

Decisões já consolidadas:

* container e gutter globais permanecem compartilhados;
* ajustes do Hero por altura são específicos do Hero;
* intro imersiva usa token semântico compartilhado quando aplicável;
* Projetos concentra valores narrativos em `homepageTokens.projects`;
* Serviços concentra valores próprios em `homepageTokens.services`;
* exceções locais não devem alterar `sectionPaddingBlock` global sem necessidade sistêmica.

## 11. Tipografia

Instrument Sans permanece como família principal.

Não baixar, gerar ou versionar fonte automaticamente.

Se arquivos locais devidamente licenciados não estiverem disponíveis:

* preservar Instrument Sans no mecanismo atual nesta entrega;
* registrar no relatório que self-hosting continua requisito pré-lançamento já definido pelo Design System;
* não trocar de família por conveniência.

Não introduzir Clash Display nesta entrega sem:

* arquivos locais aprovados;
* licença validada;
* acentuação validada;
* comportamento mobile validado.

Hierarquia consolidada:

`Hero > intro imersiva de Projetos > headlines principais de seção > títulos internos`

Serviços não deve criar segunda headline com escala equivalente ao Hero.

## 12. Responsividade

Desktop e mobile devem ser tratados simultaneamente.

Validar:

* desktop amplo acima de `1440px`;
* notebook entre `1024px` e `1439px`;
* tablet entre `768px` e `1023px`;
* mobile abaixo de `768px`;
* mobile compacto abaixo de aproximadamente `420px`;
* viewport com pouca altura;
* celular horizontal.

### Desktop amplo

* aproveitar espaço principalmente em composição e mídia;
* preservar largura de leitura;
* não ampliar texto indefinidamente;
* evitar vazio sem função.

### Notebook

* preservar hierarquia;
* validar altura útil;
* Hero possui adaptação específica para notebook baixo;
* sticky de Projetos e intro de Serviços não podem colidir com header ou viewport reduzida.

### Tablet

* preservar intenção desktop enquanto funcionar;
* migrar para composição simplificada antes de prejudicar leitura;
* não depender de hover.

### Mobile

* mensagem e CTAs do Hero aparecem cedo;
* palco participa da primeira impressão sem dominar a altura;
* Projetos preserva o sistema narrativo e mídia grande;
* CTA geral de Projetos permanece separado visualmente do CTA específico;
* Intro de Serviços adapta a coreografia lateral;
* ofertas de Serviços ficam em fluxo natural com texto antes da mídia;
* escopos violetas continuam legíveis;
* Suporte e evolução mantém leitura vertical clara;
* Proposta de valor mantém headline, descrição e ponte legíveis e apresenta diferenciais em sequência vertical 1 → 4;
* Processo recebe trajetória própria;
* Sobre preserva identidade;
* nenhum conteúdo depende de hover.

### Mobile compacto e horizontal

* reavaliar títulos, palco, mídia, sticky, trajetória e assinatura;
* reduzir alturas e gaps quando necessário;
* evitar `100vh` rígido onde barras dinâmicas causem problema;
* preferir unidades de viewport adequadas;
* manter rolagem natural;
* preservar CTAs;
* impedir overflow horizontal.

## 13. Acessibilidade

Preservar tudo implementado na 0001.

Obrigatório:

* heading principal único;
* hierarquia coerente;
* landmarks e skip link;
* ordem lógica;
* foco visível;
* destinos por hash focáveis;
* contraste adequado;
* links distinguíveis;
* alt correto;
* decoração ignorada por tecnologia assistiva;
* conteúdo não dependente de hover ou movimento;
* nenhuma animação necessária para acessar copy;
* nenhum projeto próprio ou desafio apresentado como cliente;
* natureza preservada nos dados mesmo sem badge público;
* reduced motion funcional em Hero, Projetos, Serviços, Suporte e Proposta de valor.

Mudança de layout não pode regredir menu mobile, foco ou restauração de scroll.

### Menu mobile

O menu abre mantendo o foco no botão `Fechar menu`, prende a navegação entre o botão e os links, fecha com `Esc` e devolve o foco ao acionador. Tab e Shift+Tab permanecem cíclicos, o item ativo acompanha a rota/hash atual e a abertura no topo não seleciona `Serviços` arbitrariamente. Containers de seção usados como destinos de âncora não exibem outline de foco; links e controles preservam foco visível.

## 14. Desempenho e mídia

Na homepage:

* palco do Hero deve ser leve;
* mídia dos projetos usa prioridade compatível com sua posição;
* mídia posterior usa lazy loading quando adequado;
* dimensões conhecidas evitam layout shift;
* usar arquivos já preparados;
* não carregar vídeos;
* não carregar imagens de projetos ausentes;
* evitar renderização duplicada;
* não adicionar dependência visual ou custo contínuo de renderização sem necessidade;
* sticky e transforms devem permanecer restritos aos capítulos onde têm função.

## 15. Metadados básicos

Atualizar somente os metadados básicos da rota `/` quando necessário.

Manter título, descrição e estado de indexação atual.

SEO completo permanece fora de escopo.

Não implementar:

* canonical;
* Open Graph;
* Twitter Card;
* sitemap;
* JSON-LD;
* prerender.

## 16. Testes automatizados

Preservar testes existentes e ajustar cobertura proporcional às mudanças finais.

Cobrir no mínimo:

* ordem das seções;
* exatamente três destaques, slugs e ordem;
* natureza de DevSchedule preservada na fonte;
* ausência de apresentação de DevSchedule como cliente;
* ausência na homepage de badges `Projeto pago`, `Projeto próprio` e `Desafio técnico`;
* ausência de GreenTweet entre os destaques;
* destaques e mídia derivados das fontes tipadas;
* links `Ver case`;
* CTA `Ver todos os projetos`;
* três ofertas principais de Serviços;
* copies e escopos rápidos de Serviços;
* mídias reais de Serviços;
* Suporte e evolução separado;
* continuidade explícita com Atualizações, Correções e Novas evoluções;
* seis etapas do Processo;
* anchors `servicos`, `processo`, `sobre` e `contato`;
* ausência de texto temporário;
* ausência de ação falsa;
* metadados básicos quando alterados.

Não manter testes que exijam o antigo accordion `+ / −` de Serviços.

Não usar snapshots extensos como substituto de comportamento.

Testes automatizados não substituem aprovação visual.

## 17. Playwright e revisão visual

Executar o Playwright Test configurado no projeto.

Playwright MCP pode apoiar quando houver navegador disponível, mas sua indisponibilidade não bloqueia QA local.

Validar:

* carregamento e entrada;
* Hero e palco;
* Hero em notebook de menor altura;
* transição Hero → Projetos;
* linha/marcador pertencendo a Projects;
* intro de Projetos;
* palco sticky e progressão Echo → Axium → DevSchedule;
* frames e legibilidade desktop/mobile;
* CTAs de Projetos;
* intro sticky de Serviços;
* entrada, estado de leitura e saída lateral;
* três ofertas e suas mídias;
* reveals e reduced motion;
* Suporte e evolução;
* mudança paper → ink de Proposta de valor;
* abertura `Clareza / Estrutura`, ponte e quatro diferenciais;
* progressão reversível e hold terminal de Proposta de valor;
* trajetória e fallback do Processo;
* Sobre;
* Contato;
* footer;
* links, CTAs e âncoras;
* voltar/avançar e reload com hash;
* menus desktop/mobile;
* teclado, skip link e foco;
* movimento reduzido;
* overflow horizontal;
* imagens, console, rede e warnings React.

Viewports obrigatórios:

* desktop amplo;
* notebook;
* tablet;
* mobile;
* mobile compacto;
* viewport baixa;
* celular horizontal.

Verificar regressão também em:

* `/portfolio`;
* um `/portfolio/:slug`;
* `/privacidade`;
* `/cookies`;
* 404.

Não redesenhar essas rotas dentro da 0003.

### Revisão humana obrigatória

Confirmar:

* primeira impressão própria da Repage;
* Hero equilibrado;
* continuidade entre Hero e Projetos;
* Projetos percebido como palco de portfólio compartilhado;
* mídia grande e legível;
* Serviços claro e comercialmente suficiente;
* Suporte compreendido como continuidade;
* Diferenciais distintos de Serviços e percebidos como um único capítulo ink;
* Processo percebido como trajetória;
* Sobre intencional;
* ritmo variável;
* ausência de sensação de template genérico;
* qualidade equivalente em mobile.

A revisão visual humana foi executada independentemente do Playwright e aprovou desktop/notebook e mobile nos viewports da entrega.

## 18. Áreas provavelmente afetadas

Principais:

* `frontend/src/pages/Home/`;
* `frontend/src/content/repageContent.ts`;
* `frontend/src/components/FeaturedProjectsSection/`;
* `frontend/src/components/ServicesSection/`;
* `frontend/src/components/ValuePropositionSection/`;
* `frontend/src/components/ProcessSection/`;
* `frontend/src/components/SignatureSection/`;
* `frontend/src/components/FinalCtaSection/`;
* `frontend/src/components/PageExperience/`;
* `frontend/src/styles/theme.ts`;
* `frontend/src/data/projects/`;
* testes relacionados;
* `frontend/src/app/routeMetadata.ts` somente se necessário.

Não mover todas as seções para uma nova estrutura apenas por estética da árvore.

Não realizar refatoração paralela.

## 19. Fora de escopo

Não implementar:

* `/portfolio` final;
* cases finais;
* conteúdo completo dos seis cases;
* galerias dos cases;
* player de vídeo;
* navegação anterior/próximo;
* publicação dos projetos;
* alteração arbitrária das mídias aprovadas;
* novas capturas;
* backend;
* Django;
* PostgreSQL;
* formulário funcional;
* React Hook Form;
* Zod do formulário;
* API;
* e-mails;
* idempotência;
* proteção contra abuso;
* WhatsApp sem destino público aprovado;
* consentimento;
* Analytics;
* Ads;
* texto jurídico final;
* SEO completo;
* sitemap;
* prerender;
* CI/CD;
* deploy;
* aquisição de fontes;
* redesign de páginas secundárias.

## 20. Riscos

### Duplicação de dados dos projetos

Mitigação:

* identidade, natureza, slug, seleção e mídia derivam das fontes estruturadas;
* copy editorial pode permanecer separada;
* natureza não precisa ser badge público.

### Resultado tecnicamente correto, mas visualmente genérico

Mitigação:

* contratos visuais explícitos;
* Hero proprietário;
* ProjectStage compartilhado;
* Services com linguagem própria;
* Support separado;
* Diferenciais e Processo com linguagens distintas;
* aprovação visual humana obrigatória;
* não aceitar lint/test/build como evidência suficiente de direção visual.

### Excesso visual

Mitigação:

* composição antes de efeitos;
* prova real antes de ornamentação;
* uma hierarquia dominante por capítulo;
* movimento com função;
* evitar cards, grids e animações repetitivos;
* sticky somente onde sua função foi explicitamente aprovada.

### Homepage pesada

Mitigação:

* não usar WebM;
* Hero leve;
* carregar somente mídia necessária;
* preservar dimensões;
* lazy loading onde adequado;
* não adicionar dependência visual sem necessidade.

### Regressão mobile

Mitigação:

* composição própria para mobile;
* ProjectStage adaptado;
* intro de Services adaptada;
* ofertas de Services em fluxo natural;
* trajetória mobile específica no Processo;
* viewport baixa e horizontal;
* não depender de hover;
* revisão humana em mobile.

### Escopo avançar para cases

Mitigação:

* links podem apontar às rotas existentes;
* conteúdo final dos cases permanece na 0004;
* homepage não antecipa galeria ou case completo.

### Contato ainda sem formulário

Mitigação:

* finalizar conteúdo e composição;
* não renderizar controle falso;
* usar somente destinos reais;
* manter conversão funcional para entrega posterior;
* não considerar a homepage isoladamente pronta para lançamento.

## 21. Documentação afetada

Durante esta entrega:

* manter esta mesma `0003-definitive-homepage.md`;
* marcar esta spec como `implemented` ao concluir os critérios;
* não criar `0003.1`;
* não alterar sequência ou escopo do roadmap;
* atualizar `docs/specs/README.md` para refletir `implemented`;
* atualizar `docs/ROADMAP.md` para concluir a Entrega 3 e apontar a Entrega 4 como próxima.

Ao concluir:

* spec e índice estão como `implemented`;
* não há referência de PR/commit a registrar nesta reconciliação documental;
* roadmap atualizado conforme o status final.

Não criar nova página no Notion.

`docs/DESIGN_SYSTEM.md` permanece sistêmico.

Alterá-lo apenas se a implementação consolidar mudança realmente global.

## 22. Validações obrigatórias

No diretório `frontend`:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

Na raiz:

```bash
git diff --check
```

Além disso:

* revisar diff completo;
* conferir caminhos de mídia;
* verificar ausência de arquivos ou dependências desnecessárias;
* verificar ausência de segredos ou dados pessoais;
* realizar revisão visual humana em desktop e mobile.

Resultado final registrado: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` e `npm run test:e2e` foram aprovados. A revisão visual humana também foi concluída em desktop/notebook e mobile, com foco em composição, responsividade, navegação, movimento reduzido e ausência de overflow.

Validações históricas devem ser repetidas após alterações que possam afetá-las.

## 23. Critérios de aceite

Os critérios abaixo registram o fechamento da entrega e foram atendidos na implementação aprovada.

### Conteúdo, dados e escopo

* [x] Ordem corresponde ao Produto.
* [x] EchoCosmicEnergia, Axium e DevSchedule são os únicos três destaques, na ordem correta.
* [x] DevSchedule permanece correto na fonte e não é apresentado como cliente.
* [x] `Projeto pago`, `Projeto próprio` e `Desafio técnico` não aparecem como badges comerciais na homepage.
* [x] Destaques e mídia derivam das fontes estruturadas.
* [x] Nenhum WebM é carregado.
* [x] Projetos continuam `draft`.
* [x] Portfólio/cases finais não foram antecipados.
* [x] Mídias da 0002 não foram recapturadas ou alteradas fora das decisões aprovadas.

### Hero e Projetos

* [x] Hero comunica atividade, público, transformação e ação.
* [x] Hero é protagonizado pela Repage.
* [x] Palco comunica `ideia → estrutura → experiência digital`.
* [x] Hero funciona em desktop alto e notebook de menor altura.
* [x] Hero termina sem spacer adicional dedicado à transição.
* [x] Linha/marcador pertencem à entrada de Projetos.
* [x] Projetos utiliza um palco compartilhado e não três layouts alternados.
* [x] Echo, Axium e DevSchedule compartilham mesma composição, hierarquia e sistema de frames.
* [x] Transições entre projetos possuem overlap e continuidade.
* [x] Mídia é grande e legível.
* [x] `Ver case` funciona por projeto.
* [x] `Ver todos os projetos` permanece disponível com hierarquia inferior.
* [x] Mobile preserva o sistema narrativo e não reduz projetos a cards.
* [x] Reduced motion mantém todos os projetos acessíveis em estado estável.

### Serviços e Suporte

* [x] Três ofertas principais possuem peso equivalente.
* [x] Intro de Services funciona como sticky curto, sem transformar as ofertas em sticky.
* [x] Headline e apoio da intro possuem leitura equilibrada.
* [x] Saída lateral da intro entrega naturalmente Landing pages.
* [x] Landing pages comunica conversão e usa mídia real aprovada.
* [x] Sites institucionais comunica presença institucional e usa mídia real aprovada.
* [x] Soluções personalizadas comunica atuação além de sites sem prometer capacidade irrestrita.
* [x] Escopos violetas permanecem legíveis.
* [x] Mídias usam sistema compartilhado de frame leve e não repetem Projects literalmente.
* [x] Progressão `título → descrição → escopo → mídia` funciona sem depender de hover.
* [x] Mobile mantém leitura e densidade adequadas.
* [x] Suporte aparece como epílogo, não quarta oferta.
* [x] Suporte explicita Atualizações, Correções e Novas evoluções.
* [x] Support não depende de ilustração abstrata para comunicar continuidade.

### Diferenciais

* [x] Proposta de valor utiliza headline, descrição e ponte aprovadas.
* [x] Os quatro argumentos finais são Responsabilidade direta, Condução integrada, Necessidade antes do formato e Continuidade quando fizer sentido.
* [x] Diferenciais permanecem comprováveis.
* [x] A seção usa superfície ink própria e permanece visualmente distinta de Services.
* [x] Desktop conclui os argumentos em composição 2 × 2 alinhada, sem cards.
* [x] Mobile apresenta os quatro argumentos em sequência vertical.
* [x] Entradas laterais são individuais e reversíveis.
* [x] Hold terminal conclui o quarto argumento antes da entrada de Processo.
* [x] Reduced motion mantém todo o conteúdo disponível em estado estável.

### Processo, Sobre e Contato

* [x] Processo contém seis momentos e é percebido como trajetória conectada.
* [x] Progressão acompanha a rolagem sem esconder conteúdo ou prender o usuário.
* [x] Mobile recebe trajetória própria.
* [x] Sobre apresenta Repage e Lukas sem currículo e possui presença visual intencional.
* [x] Contato não contém texto temporário ou ação falsa.
* [x] Footer representa a oferta ampla e permanece secundário.

### Responsividade, acessibilidade e qualidade visual

* [x] Todos os viewports obrigatórios foram validados.
* [x] Mobile preserva conceito e qualidade, não apenas empilha desktop.
* [x] Movimento reduzido mantém experiência completa.
* [x] Não existe overflow horizontal.
* [x] Navegação, foco, skip link e menu mobile não regrediram.
* [x] Conteúdo essencial não depende de hover ou movimento.
* [x] Revisão humana confirma ritmo, continuidade e ausência de aparência genérica.
* [x] Revisão humana aprova desktop e mobile.

### Validação técnica

* [x] Instrument Sans permanece consistente.
* [x] Lint aprovado.
* [x] Typecheck aprovado.
* [x] Testes unitários/integração aprovados.
* [x] Build aprovado.
* [x] Playwright Test aprovado.
* [x] Playwright Test local aprovado; MCP não foi necessário para concluir a validação.
* [x] Revisão visual humana executada independentemente do MCP.
* [x] `git diff --check` aprovado.
* [x] Diff completo revisado.
* [x] Spec marcada como `implemented` somente ao final.

## 24. Definição de pronto

A spec está pronta quando:

* a homepage apresenta a experiência comercial e visual aprovada;
* Hero estabelece identidade própria da Repage;
* três destaques usam mídia real dentro do `ProjectStage` compartilhado;
* natureza administrativa não é usada como rótulo comercial;
* Serviços explica com clareza as três ofertas e sua amplitude;
* Suporte aparece como continuidade pós-publicação;
* Diferenciais possui linguagem ink própria, quatro argumentos finais e progressão aprovada;
* Processo funciona como trajetória narrativa;
* Sobre e Contato estão finalizados dentro do escopo;
* desktop e mobile possuem acabamento equivalente e composição intencional;
* acessibilidade e movimento reduzido foram preservados;
* rotas existentes não regrediram;
* nenhuma entrega posterior foi antecipada;
* validações obrigatórias foram executadas;
* bloqueios de ferramenta foram registrados sem inferência;
* revisão visual humana final foi aprovada;
* diff foi revisado;
* spec está marcada como `implemented`;
* implementação está pronta para PR/merge sob controle de Lukas.
