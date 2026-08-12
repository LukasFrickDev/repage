# 0003 — Homepage definitiva

* **Status:** in_progress
* **Responsável:** Lukas Frick
* **Data:** 7 de agosto de 2026
* **Última revisão:** 10 de agosto de 2026
* **Branch-base:** `main`
* **Entrega do roadmap:** 3 — Homepage definitiva
* **Specs predecessoras:** `0001-frontend-foundation-and-routing.md` e `0002-project-content-and-media-preparation.md`
* **Documentos relacionados:** `AGENTS.md`, `frontend/AGENTS.md`, `docs/PRODUCT.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md`, `docs/ROADMAP.md` e `docs/content/`

## 1. Contexto

As specs 0001 e 0002 estão implementadas e integradas à `main`.

A branch `feat/definitive-homepage` já contém uma primeira implementação da 0003. Essa passagem consolidou conteúdo real, fonte tipada dos destaques, mídias da 0002, componentes, responsividade e testes. As validações técnicas passaram, mas a revisão humana rejeitou o resultado visual como conclusão da homepage definitiva.

O problema não é estrutural: a implementação atual preserva composição próxima demais da versão anterior, repete padrões entre seções, trata projetos como blocos semelhantes e não materializa suficientemente a narrativa, a assimetria, a variação de escala e a experiência mobile aprovadas no Design System.

Esta revisão:

* preserva conteúdo, dados, mídia, acessibilidade, testes e arquitetura que continuam válidos;
* reabre somente a camada visual e de experiência necessária para concluir a homepage;
* não reabre Produto, Arquitetura, Design System, specs 0001/0002 ou mídia;
* não antecipa portfólio final, cases, formulário ou backend.

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
* a entrada e o hero estabelecem uma primeira impressão própria da Repage;
* o hero não depende da identidade visual dos projetos;
* EchoCosmicEnergia, Axium e DevSchedule são os três destaques;
* os destaques derivam das fontes estruturadas e usam mídia real da 0002;
* os projetos funcionam como três capítulos visuais, não como cards/layouts repetidos;
* natureza administrativa dos projetos permanece nos dados, mas não aparece como badge comercial;
* Serviços apresenta três ofertas principais com o mesmo peso e exploração acessível;
* Suporte e evolução aparece separadamente como continuidade;
* Proposta de valor e diferenciais possuem linguagem visual própria;
* Processo possui seis momentos apresentados como trajetória;
* Sobre apresenta Repage e Lukas com presença visual intencional;
* Contato possui conteúdo editorial final e não exibe ação falsa;
* movimento possui função e respeita movimento reduzido;
* desktop e mobile possuem acabamento equivalente;
* a homepage recebe aprovação visual humana;
* nenhuma entrega posterior é antecipada.

## 4. Estado atual relevante

Na branch `feat/definitive-homepage`, antes desta revisão:

* ordem final, conteúdo real e três destaques já foram materializados;
* destaques já derivam da fonte tipada e do manifesto de mídia;
* os seis projetos continuam `draft`;
* Proposta de valor, Processo, Sobre e Contato já existem;
* testes de integração e Playwright já foram ampliados;
* Playwright Test cobre sete configurações responsivas;
* Instrument Sans continua carregada externamente pelo `index.html`;
* Playwright MCP ficou indisponível, mas Playwright Test local passou;
* a revisão humana posterior identificou que a direção visual ainda não atende o objetivo da spec.

Preservar a base técnica existente quando saudável. Não reverter trabalho válido apenas para reconstruir a camada visual.

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

A homepage deve ser percebida como uma experiência contínua, não como seções independentes apenas empilhadas.

Ritmo de referência:

`entrada → abertura → prova → oferta → posicionamento → processo → marca → conversão`

Evitar como solução recorrente:

* divisão `50 / 50`;
* cards;
* separadores idênticos;
* grid visível decorativo;
* mesma animação ou composição em todas as seções;
* desktop apenas empilhado no mobile.

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

O hero deve comunicar atividade, público, transformação e ação sem restringir a Repage a landing pages e sites institucionais.

#### Entrada

Pode existir uma assinatura curta de `Repage` antes do estado final do hero.

Deve:

* executar uma vez;
* ser curta e não funcionar como loader;
* não bloquear navegação;
* desembocar diretamente no hero;
* ser removida ou simplificada em movimento reduzido.

#### Composição

O hero deve ser 100% protagonizado pela identidade da Repage.

Não usar os três projetos como colagem, miniaturas ou palco principal.

A headline permanece expressiva, mas deve dividir o peso visual com um palco proprietário da Repage. Esse palco deve representar:

`ideia → estrutura → experiência digital`

Pode usar planos, recortes, linhas, superfícies e relações entre conteúdo, mídia e ação da própria linguagem Repage.

Não deve:

* inventar projeto real;
* parecer dashboard genérico;
* reproduzir página dobrada literalmente;
* depender de identidades visuais externas;
* virar ilustração ornamental sem função.

A transição para Projetos deve ter continuidade perceptível por ritmo, plano, linha, escala ou movimento simples, sem exigir que o palco do hero vire a mídia do primeiro projeto.

### 6.2 Projetos selecionados

**Eyebrow**

> Projetos selecionados

**Título**

> Trabalho real para necessidades diferentes.

**Descrição**

> Uma seleção que reúne comércio digital, presença institucional e uma aplicação de agendamento.

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

#### Composição

Os três destaques devem funcionar como **três capítulos visuais**.

Não implementar como:

* três cards equivalentes;
* três blocos `imagem | texto` apenas alternando lados;
* o mesmo layout visual repetido com dados diferentes.

Cada capítulo pode adaptar enquadramento e composição à mídia real, preservando unidade pela linguagem Repage.

A mídia deve ser protagonista e legível, sem transformar a homepage em visualizador full-screen. Como referência, pode ocupar aproximadamente `60–70%` da composição quando adequado, sem valor rígido.

Direções possíveis, sem obrigar moldes artificiais:

* EchoCosmicEnergia: captura desktop ampla;
* Axium: enquadramento, escala ou extrapolação diferente;
* DevSchedule: interface principal com segunda evidência quando útil.

Deve existir progressão clara equivalente a `01 / 03`, `02 / 03`, `03 / 03`.

A técnica pode usar `sticky`, transformação ou deslocamento desde que preserve scroll natural, conteúdo sempre disponível, fallback de movimento reduzido e funcionamento em viewport baixa.

Cada destaque pode levar para `/portfolio/:slug`.

A seção pode oferecer:

> Ver todos os projetos

Destino: `/portfolio`

Não mencionar métricas, resultados comerciais ou participação não confirmada.

#### Mobile

No mobile, os projetos viram capítulos verticais próprios.

Cada capítulo apresenta cedo progressão, mídia grande, nome, resumo e ação. Não reproduzir obrigatoriamente sticky desktop nem reduzir mídia a miniatura para manter texto ao lado.

### 6.3 Serviços

**Eyebrow**

> O que a Repage desenvolve

**Título**

> Soluções digitais construídas para o momento do seu negócio.

**Descrição**

> Cada projeto parte da necessidade real para combinar estrutura, conteúdo, design e desenvolvimento na medida certa.

As três ofertas principais possuem o mesmo peso.

A seção é comercialmente central e deve ser compreensível mesmo sem expansão.

Usar **lista editorial interativa**, sem cards SaaS e sem `01 / 02 / 03` como hierarquia principal.

#### Landing pages

Estado fechado:

> Para campanhas, lançamentos, eventos, produtos, serviços e captação de leads com uma ação principal clara.

Na expansão podem aparecer campanhas, lançamentos, eventos, produtos, serviços, leads e inscrições.

#### Sites institucionais

Estado fechado:

> Para apresentar sua marca, organizar serviços, centralizar informações e fortalecer sua presença digital.

Na expansão podem aparecer presença oficial, posicionamento, organização de serviços, informações e canais de contato.

#### Soluções personalizadas

Estado fechado:

> Para necessidades que pedem mais: e-commerce, áreas restritas, painéis, agendamentos, integrações e aplicações web, avaliadas caso a caso.

A expansão deve deixar clara atuação além de sites e pode apresentar:

* e-commerce;
* áreas restritas;
* painéis administrativos;
* agendamento;
* integrações;
* automações;
* sistemas internos;
* aplicações web;
* fluxos específicos.

Não prometer capacidade irrestrita para qualquer sistema ou escala.

#### Interação

Usar controle de expansão preferencialmente `+` fechado e `−` expandido.

Desktop:

* hover pode melhorar a resposta, mas não ser necessário;
* clique e teclado controlam a expansão;
* foco é visível;
* título, divisor e controle podem reagir discretamente.

Mobile:

* mesma informação acessível por toque;
* alvo adequado;
* sem dependência de hover.

Princípio de movimento:

`scroll apresenta → interação permite explorar`

Não transformar cada serviço em uma viewport inteira.

#### Suporte e evolução

Apresentar separadamente como continuidade, com passagem editorial equivalente a:

> E depois da publicação?

Texto:

> Depois da publicação, a Repage também pode continuar ao lado do projeto com atualizações, correções, refinamentos e novas evoluções avaliadas conforme a necessidade.

Não tratar como quarta oferta principal nem como bloco lateral desconectado.

### 6.4 Proposta de valor e diferenciais

**Eyebrow**

> Por que Repage

**Título**

> Clareza para quem chega. Estrutura para o que vem depois.

**Descrição**

> A Repage conecta estratégia, direção visual e desenvolvimento para transformar necessidades reais em experiências digitais profissionais, claras e preparadas para evoluir.

Diferenciais comprováveis:

* atendimento direto com o responsável;
* condução integrada de estrutura, conteúdo, design e desenvolvimento;
* soluções avaliadas conforme a necessidade real;
* continuidade opcional depois da publicação.

A seção deve ter linguagem claramente diferente de Serviços, priorizando afirmação tipográfica forte, mudança de ritmo e diferenciais como sustentação editorial.

Não repetir `título à esquerda + lista à direita`, não reutilizar a mesma interação dos Serviços e não transformar automaticamente cada diferencial em card.

Não usar promessa de resultado, garantia de qualidade ou superlativo vazio.

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

A representação deve parecer um percurso conectado, não grid de seis cards.

Usar linha ou percurso gráfico contínuo com curvas, mudança de direção, alternância ou variação de altura quando isso ajudar a leitura.

Evitar timeline genérica apenas `ponto — linha reta — ponto`.

Conforme a rolagem avança, o trecho percorrido pode ganhar destaque e a etapa atual assumir maior ênfase, mantendo anteriores e seguintes compreensíveis. A progressão não pode bloquear o scroll nem esconder conteúdo.

Hover/foco podem reforçar ponto, trecho e texto correspondente, sem seis animações independentes.

Em movimento reduzido, trajetória e conteúdo aparecem em estado estável.

#### Mobile

Criar trajetória própria, predominantemente vertical, com curvas suaves e texto próximo a cada etapa.

Não substituir simplesmente por seis cards empilhados.

### 6.6 Sobre

**Eyebrow**

> Sobre a Repage

**Título**

> Uma marca próxima, com responsabilidade direta.

**Descrição**

> A Repage é um estúdio de desenvolvimento web conduzido de forma próxima, unindo estrutura, conteúdo, direção visual e tecnologia para criar experiências digitais profissionais e preparadas para evoluir.

**Assinatura**

> Projetos conduzidos por Lukas Frick

**Papel**

> Desenvolvimento e direção digital

A seção deve reforçar confiança, esclarecer responsabilidade, humanizar a operação, manter a Repage como marca principal e funcionar como desaceleração intencional.

Direção preferencial desta revisão:

* superfície azul-grafite/azul já existente na identidade;
* versão branca da marca quando houver contraste adequado;
* composição tipográfica mais expressiva;
* no máximo uma assinatura de movimento `R → Repage` por revelação, máscara, linha ou recorte.

A solução final depende de aprovação visual humana e não autoriza criação de novo tom sem necessidade sistêmica.

Não deve virar currículo, fingir equipe ampla, exigir fotografia, repetir `R` decorativamente ou usar loop de logo.

### 6.7 Contato

Manter `id="contato"`.

**Eyebrow**

> Vamos conversar

**Título**

> Uma nova página para o seu negócio pode começar por aqui.

**Descrição**

> Conte o que você precisa construir ou evoluir. A Repage parte do contexto, objetivo e momento do seu negócio para organizar o próximo passo.

A seção finaliza conteúdo e composição, mas não implementa formulário.

Usar apenas ações com destino real já aprovado. Não criar campos falsos, submissão temporária, botão de envio falso, `mailto:` inventado ou WhatsApp não aprovado.

Remover “em preparação”, “em breve” e qualquer promessa de formulário funcional.

Contato deve funcionar como encerramento comercial e receber movimento mínimo.

A homepage ainda não é V1 pronta para lançamento enquanto a conversão funcional não existir.

### 6.8 Footer

Direção:

> Sites e soluções digitais para profissionais, especialistas e negócios.

Preservar assinatura discreta e navegação existente.

Footer permanece secundário ao encerramento de Contato.

## 7. Fonte dos três destaques

Os três destaques devem ser derivados da fonte tipada de projetos.

Adicionar à estrutura atual somente o mínimo necessário para representar seleção e ordem.

Contrato esperado:

* projeto destacado;
* ordem do destaque.

Ordem obrigatória:

1. `echo-cosmic-energia`;
2. `axium`;
3. `dev-schedule`.

Criar ou ajustar seletor para retornar exatamente esses três registros na ordem aprovada.

Não manter uma segunda lista com nomes duplicados em `repageContent.ts`.

Copy editorial específica da homepage pode permanecer separada, indexada por slug, quando isso evitar antecipar o modelo completo dos cases.

Não preencher ainda:

* conteúdo completo do case;
* galeria editorial final;
* SEO do case;
* navegação anterior/próximo;
* ordem dos seis projetos no portfólio final.

Todos os seis projetos permanecem com:

`publicationStatus: 'draft'`

## 8. Mídia real e palco do Hero

Eliminar interfaces fictícias usadas como prova de projeto.

### Hero

O hero não deve mais ser baseado nos três destaques.

Implementar palco proprietário da Repage conforme 6.1, usando a própria linguagem visual e recursos leves da stack existente. Não adquirir nova mídia, inventar interface de cliente ou adicionar dependência apenas para esse efeito.

### Projetos selecionados

Cada projeto deve possuir mídia real, nome, resumo e ação aplicável.

A natureza permanece na fonte estruturada, mas não aparece como badge comercial.

Preferir ativos `cover` ou equivalentes do manifesto, sem duplicar caminhos. Usar alt já disponível como base.

O enquadramento deve privilegiar legibilidade da interface real, não uniformidade artificial entre os capítulos.

### Vídeos

Não utilizar WebM na homepage nesta entrega.

Os vídeos preparados permanecem para cases e experiências posteriores.

Não recapturar, recomprimir, renomear ou substituir mídias aprovadas na 0002.

## 9. Movimento e microinterações

Usar Framer Motion já existente quando necessário.

Distribuição esperada:

* Entrada: assinatura curta;
* Hero: organização do palco;
* Projetos: movimento narrativo;
* Serviços: microinteração de exploração;
* Proposta/diferenciais: revelação tipográfica leve, se útil;
* Processo: progressão explicativa;
* Sobre: no máximo uma assinatura de marca;
* Contato: movimento mínimo.

Movimento deve apresentar, orientar, conectar ou explicar. Não deve compensar composição fraca.

Não usar scroll hijacking, `scroll-snap` rígido, loop decorativo, máquina de escrever, partículas, WebGL, carrossel infinito, sticky prolongado, `fade-up` universal ou informação dependente de animação.

Priorizar `transform` e `opacity`.

Com `prefers-reduced-motion: reduce`, remover ou simplificar entrada, transformações narrativas e assinatura do Sobre; manter Hero, projetos, Serviços e Processo completos e operáveis em estado estável.

## 10. Superfícies e identidade

Preservar a identidade aprovada.

Direção:

* Hero: escuro;
* Projetos: escuro;
* Serviços: claro;
* Proposta/diferenciais: claro, com linguagem própria;
* Processo: claro;
* Sobre: preferencialmente azul-grafite/azul existente na identidade nesta revisão, sujeito à aprovação humana;
* Contato: escuro.

A alternância deve construir narrativa, não apenas trocar a cor do fundo.

Grid estrutural permanece invisível por padrão. Grid visível exige função narrativa.

Usar azul-violeta como destaque estratégico.

Evitar template SaaS, bento grid automático, glassmorphism, glow permanente, card para cada conteúdo, repetição de `50 / 50`, gradientes excessivos, mesmos divisores, padding ou densidade em toda a homepage.

Usar tokens existentes e adicionar token somente por necessidade semântica real.

## 11. Tipografia

Instrument Sans permanece como família principal.

A implementação deve verificar o estado atual do carregamento.

Não baixar, gerar ou versionar fonte automaticamente.

Se arquivos locais devidamente licenciados não estiverem disponíveis no repositório:

* preservar Instrument Sans no mecanismo atual nesta entrega;
* registrar no relatório que self-hosting continua requisito pré-lançamento já definido pelo Design System;
* não tratar isso como autorização para trocar de família.

Não introduzir Clash Display nesta entrega sem:

* arquivos locais aprovados;
* licença validada;
* acentuação validada;
* comportamento mobile validado.

Não criar dependência externa adicional de tipografia.

## 12. Responsividade

Desktop e mobile devem ser tratados simultaneamente. Mobile não é apenas desktop empilhado.

Validar:

* desktop amplo acima de `1440px`;
* notebook entre `1024px` e `1439px`;
* tablet entre `768px` e `1023px`;
* mobile abaixo de `768px`;
* mobile compacto abaixo de aproximadamente `420px`;
* viewport com pouca altura;
* celular horizontal.

### Desktop amplo

* aproveitar espaço principalmente em mídia e composição;
* preservar largura de leitura;
* não ampliar texto indefinidamente;
* evitar vazio sem função.

### Notebook

* reduzir sobreposição, extrapolação, sticky e gaps quando necessário;
* preservar hierarquia e prova visual;
* validar alturas menores.

### Tablet

* preservar intenção desktop enquanto funcionar;
* migrar para soluções mobile antes de prejudicar leitura;
* não depender de hover.

### Mobile

* mensagem e CTAs do hero aparecem cedo;
* palco participa da primeira impressão sem dominar a altura;
* projetos viram capítulos verticais com mídia grande;
* Serviços funcionam por toque;
* Processo recebe trajetória vertical própria;
* Sobre preserva identidade com composição simplificada;
* nenhum conteúdo depende de hover;
* não comprimir desktop em coluna única sem revisão de hierarquia.

### Mobile compacto e horizontal

* reavaliar títulos, palco, mídia, serviços expandidos, trajetória e assinatura;
* reduzir alturas e gaps;
* evitar `100vh` rígido e sticky inadequado;
* manter rolagem natural;
* preservar CTAs;
* impedir overflow horizontal.

## 13. Acessibilidade

Preservar tudo implementado na 0001.

Obrigatório:

* heading principal único;
* hierarquia coerente;
* landmarks e skip link;
* ordem lógica e foco visível;
* destinos por hash focáveis;
* contraste adequado;
* links distinguíveis;
* alt correto;
* decoração ignorada por tecnologia assistiva;
* conteúdo não dependente de hover ou movimento;
* controles de Serviços com semântica e estado acessíveis;
* nenhum projeto próprio ou desafio apresentado como cliente;
* natureza preservada nos dados mesmo sem badge público.

Mudança de layout não pode regredir menu mobile, foco ou restauração de scroll.

## 14. Desempenho e mídia

Na homepage:

* palco do hero deve ser leve;
* mídia dos projetos usa prioridade compatível com sua posição;
* mídia posterior usa lazy loading quando adequado;
* dimensões conhecidas evitam layout shift;
* usar arquivos já preparados;
* não carregar vídeos;
* não carregar imagens de projetos ausentes;
* evitar renderização duplicada;
* não adicionar dependência visual ou custo contínuo de renderização sem necessidade.

## 15. Metadados básicos

Atualizar somente os metadados básicos da rota `/` quando necessário.

Manter título, descrição e estado de indexação atual.

SEO completo permanece fora de escopo.

Não implementar canonical, Open Graph, Twitter Card, sitemap, JSON-LD ou prerender.

## 16. Testes automatizados

Preservar testes existentes e ajustar cobertura proporcional à mudança.

Cobrir no mínimo:

* ordem das seções;
* exatamente três destaques, slugs e ordem;
* natureza de DevSchedule preservada na fonte e ausência de apresentação como cliente;
* ausência na homepage de badges `Projeto pago`, `Projeto próprio` e `Desafio técnico`;
* ausência de GreenTweet entre os destaques;
* destaques e mídia derivados das fontes tipadas;
* links dos destaques;
* três ofertas principais;
* suporte separado;
* controles de Serviços acessíveis e operáveis;
* conteúdo essencial dos Serviços disponível sem hover;
* seis etapas do Processo;
* anchors `servicos`, `processo`, `sobre` e `contato`;
* ausência de texto temporário e ação falsa;
* metadados básicos quando alterados.

Não usar snapshots extensos como substituto de comportamento.

Testes automatizados não substituem aprovação visual.

## 17. Playwright e revisão visual

Executar o Playwright Test configurado no projeto.

Usar preferencialmente Playwright MCP para inspeção visual quando houver navegador disponível. A indisponibilidade do MCP não invalida Playwright Test local nem substitui revisão humana.

Validar:

* carregamento e entrada;
* Hero e palco;
* transição Hero → Projetos;
* três capítulos e legibilidade das mídias;
* progressão entre projetos;
* Serviços fechados/expandidos, `+ / −`, teclado e foco;
* Proposta/diferenciais;
* trajetória e fallback do Processo;
* Sobre, Contato e footer;
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

Verificar regressão também em `/portfolio`, um `/portfolio/:slug`, `/privacidade`, `/cookies` e 404, sem redesenhá-los.

### Revisão humana obrigatória

Avaliar a homepage como experiência completa em desktop e mobile.

Confirmar:

* primeira impressão própria da Repage;
* hero equilibrado;
* continuidade entre seções;
* projetos percebidos como capítulos, não cards repetidos;
* mídia grande e legível;
* Serviços fortes e claros;
* Diferenciais distintos de Serviços;
* Processo percebido como trajetória;
* Sobre intencional;
* ritmo variável;
* ausência de sensação de template genérico;
* qualidade equivalente em mobile.

Se MCP estiver indisponível:

* executar Playwright Test local;
* registrar tentativa e erro exato;
* realizar revisão humana no navegador local;
* não declarar inspeção MCP realizada.

**Registro histórico:** em 7 de agosto de 2026, o navegador MCP retornou `No browser is available` e descoberta vazia. Playwright Test local passou nos sete cenários. A revisão humana posterior rejeitou a composição visual como conclusão da spec, motivando esta revisão.

## 18. Áreas provavelmente afetadas

Principais:

* `frontend/src/pages/Home/`;
* `frontend/src/content/repageContent.ts`;
* `frontend/src/components/FeaturedProjectsSection/`;
* `frontend/src/components/ServicesSection/`;
* `frontend/src/components/ProcessSection/`;
* `frontend/src/components/SignatureSection/`;
* `frontend/src/components/FinalCtaSection/`;
* `frontend/src/components/PageExperience/`;
* `frontend/src/data/projects/`;
* testes relacionados;
* `frontend/src/app/routeMetadata.ts` somente se necessário.

Novas áreas possíveis:

* seção de proposta de valor e diferenciais;
* pequenos seletores de projetos/mídia.

Não mover todas as seções para uma nova estrutura apenas para adequação estética da árvore.

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
* alteração das mídias aprovadas;
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
* natureza não precisa ser badge público para proteger veracidade.

### Resultado tecnicamente correto, mas visualmente genérico

Mitigação:

* contrato visual explícito nesta spec;
* capítulos de projeto em vez de layout repetido;
* linguagens distintas para Serviços, Diferenciais e Processo;
* aprovação visual humana obrigatória;
* não aceitar lint, testes ou build como evidência suficiente de direção visual.

### Excesso visual

Mitigação:

* composição antes de efeitos;
* prova real antes de ornamentação;
* hierarquia dominante por seção;
* movimento com função;
* evitar cards, grids e animações repetitivos.

### Homepage pesada

Mitigação:

* não usar WebM;
* hero leve;
* carregar somente mídia necessária;
* preservar dimensões;
* lazy loading onde adequado;
* não adicionar dependência visual sem necessidade.

### Regressão mobile

Mitigação:

* composição própria para mobile;
* Serviços por toque;
* trajetória mobile específica;
* viewport baixa e horizontal;
* não depender de hover;
* revisão humana também em mobile.

### Escopo avançar para cases

Mitigação:

* links podem apontar às rotas existentes;
* conteúdo final dos cases permanece na 0004;
* capítulos da homepage não antecipam galeria ou case completo.

### Contato ainda sem formulário

Mitigação:

* finalizar conteúdo e composição;
* não renderizar controle falso;
* usar somente destinos reais;
* manter conversão funcional para a entrega 5;
* não considerar a homepage isoladamente pronta para lançamento.

## 21. Documentação afetada

Durante esta revisão:

* manter esta mesma `0003-definitive-homepage.md`;
* alterar status para `in_progress`;
* atualizar `docs/specs/README.md` para `in_progress`;
* não criar `0003.1`;
* não alterar sequência ou escopo do roadmap;
* atualizar `docs/ROADMAP.md` somente se ele espelhar status ou se surgir mudança real.

Ao concluir:

* mudar spec e índice para `implemented`;
* registrar referência da PR/commit quando disponível;
* atualizar roadmap somente quando aplicável.

Não criar nova página no Notion.

`docs/DESIGN_SYSTEM.md` permanece sistêmico. Alterá-lo apenas se esta revisão consolidar mudança realmente global; a preferência de superfície do Sobre nesta spec, isoladamente, não exige reescrita do Design System.

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

Validações da primeira implementação são histórico e devem ser repetidas após alterações que possam afetá-las.

## 23. Critérios de aceite

Após esta revisão, os critérios permanecem abertos até nova implementação e validação.

### Conteúdo, dados e escopo

* [ ] Ordem corresponde ao Produto.
* [ ] EchoCosmicEnergia, Axium e DevSchedule são os únicos três destaques, na ordem correta.
* [ ] DevSchedule permanece correto na fonte e não é apresentado como cliente.
* [ ] `Projeto pago`, `Projeto próprio` e `Desafio técnico` não aparecem como badges comerciais na homepage.
* [ ] Destaques e mídia derivam das fontes estruturadas.
* [ ] Nenhum WebM é carregado.
* [ ] Projetos continuam `draft`.
* [ ] Portfólio/cases finais não foram antecipados.
* [ ] Mídias da 0002 não foram recapturadas ou alteradas.

### Hero e Projetos

* [ ] Hero comunica atividade, público, transformação e ação.
* [ ] Hero é protagonizado pela Repage, não por colagem dos projetos.
* [ ] Headline e palco possuem hierarquia equilibrada.
* [ ] Palco comunica `ideia → estrutura → experiência digital` sem fingir projeto real.
* [ ] Transição Hero → Projetos possui continuidade perceptível.
* [ ] Projetos são percebidos como três capítulos e não cards/layouts repetidos.
* [ ] Mídia é grande e legível sem full-screen desnecessário.
* [ ] Existe progressão clara entre os três capítulos.
* [ ] Mobile apresenta capítulos próprios com mídia relevante.

### Serviços e diferenciais

* [ ] Três ofertas principais possuem peso equivalente e são compreensíveis fechadas.
* [ ] Expansão de Serviços funciona por clique, teclado e toque.
* [ ] Microinterações não dependem de hover.
* [ ] Soluções personalizadas comunica a atuação além de sites sem prometer capacidade irrestrita.
* [ ] Suporte aparece como continuidade, não quarta oferta.
* [ ] Diferenciais possui linguagem visual distinta de Serviços.

### Processo, Sobre e Contato

* [ ] Processo contém seis momentos e é percebido como trajetória conectada.
* [ ] Progressão acompanha a rolagem sem esconder conteúdo ou prender o usuário.
* [ ] Mobile recebe trajetória própria.
* [ ] Sobre apresenta Repage e Lukas sem currículo e possui presença visual intencional.
* [ ] Contato não contém texto temporário ou ação falsa.
* [ ] Footer representa a oferta ampla e permanece secundário.

### Responsividade, acessibilidade e qualidade visual

* [ ] Todos os viewports obrigatórios foram validados.
* [ ] Mobile preserva conceito e qualidade, não apenas empilha desktop.
* [ ] Movimento reduzido mantém experiência completa.
* [ ] Não existe overflow horizontal.
* [ ] Navegação, foco, skip link e menu mobile não regrediram.
* [ ] Conteúdo essencial não depende de hover ou movimento.
* [ ] Revisão humana confirma ritmo, continuidade e ausência de aparência genérica.
* [ ] Revisão humana aprova desktop e mobile.

### Validação técnica

* [ ] Instrument Sans permanece consistente.
* [ ] Lint aprovado.
* [ ] Typecheck aprovado.
* [ ] Testes unitários/integração aprovados.
* [ ] Build aprovado.
* [ ] Playwright Test aprovado.
* [ ] Playwright MCP executado quando disponível ou bloqueio registrado.
* [ ] Revisão visual humana executada independentemente do MCP.
* [ ] `git diff --check` aprovado.
* [ ] Diff completo revisado.
* [ ] Spec marcada como `implemented` somente ao final.

## 24. Definição de pronto

A spec está pronta quando:

* a homepage apresenta a experiência comercial e visual aprovada;
* hero estabelece identidade própria da Repage;
* três destaques usam mídia real em capítulos coerentes;
* natureza administrativa não é usada como rótulo comercial;
* Serviços explica com clareza as três ofertas e a amplitude de Soluções personalizadas;
* Diferenciais possui linguagem própria;
* Processo funciona como trajetória narrativa;
* Sobre e Contato estão finalizados dentro do escopo;
* desktop e mobile possuem acabamento equivalente e composição intencional;
* acessibilidade e movimento reduzido foram preservados;
* rotas existentes não regrediram;
* nenhuma entrega posterior foi antecipada;
* validações obrigatórias foram executadas;
* bloqueios de ferramenta foram registrados sem inferência;
* revisão visual humana foi aprovada;
* diff foi revisado;
* spec está `in_progress`;
* implementação está pronta para commit e PR sob controle de Lukas.
