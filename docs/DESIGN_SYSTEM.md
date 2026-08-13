# Repage — Design System
## Status
- **Status:** direção visual e experiência aprovadas.
- **Última consolidação:** 13 de agosto de 2026.
- **Responsabilidade:** identidade, layout, componentes, mídia, movimento, responsividade, acessibilidade e qualidade.
- **Tokens auditados:** `frontend/src/styles/theme.ts`.
- **Memória completa:** página de Design System no Notion.
Este documento define regras sistêmicas. Storyboards, coreografias exatas e produção específica de uma entrega pertencem a specs.
## 1. Síntese
A Repage deve ser percebida como:
- estúdio digital sofisticado;
- contemporâneo;
- autoral;
- tecnicamente preciso;
- comercialmente claro;
- sustentado por provas reais;
- vivo sem perder usabilidade.
Não deve parecer:
- template SaaS;
- portfólio experimental excessivo;
- dashboard recorrente;
- site institucional parado;
- composição vazia;
- coleção de efeitos.
## 2. Princípios
### 2.1 Prova antes de promessa
Projetos, screenshots, fluxos e funcionalidades reais são a principal prova.
Elementos abstratos apoiam a composição, mas não substituem evidências.
Não inventar:
- cliente;
- métrica;
- resultado;
- equipe;
- depoimento;
- funcionalidade.
### 2.2 Clareza comercial
O visitante deve entender rapidamente:
- o que a Repage faz;
- para quem;
- qual transformação oferece;
- como solicitar orçamento.
Movimento não pode atrasar essa compreensão.
### 2.3 Sofisticação com conteúdo
Sofisticação resulta de:
- proporção;
- hierarquia;
- acabamento;
- ritmo;
- mídia;
- precisão;
- contraste;
- consistência.
Não resulta de:
- vazio excessivo;
- texto pequeno;
- sutileza ilegível;
- falta de conteúdo;
- interação oculta.
### 2.4 Movimento com função
Toda animação deve:
- apresentar;
- orientar;
- conectar;
- demonstrar;
- hierarquizar;
- confirmar.
### 2.5 Identidade sem repetição literal
A marca é reconhecida por:
- cor;
- tipografia;
- recorte;
- plano;
- linha;
- assimetria;
- ritmo;
- mídia;
- movimento.
Não repetir o símbolo `R` em todas as seções.
### 2.6 Mobile como experiência própria
Mobile preserva conceito, prova, acabamento, conversão e identidade, mas recebe composição e coreografia próprias.
## 3. Personalidade
Personalidade principal:
> Estúdio digital sofisticado.
Personalidade secundária:
> Parceiro técnico confiável.
Características:
- claro;
- preciso;
- atual;
- humano;
- seguro;
- autoral;
- próximo;
- responsável.
Evitar tom:
- infantil;
- agressivo;
- futurista genérico;
- corporativo demais;
- informal demais;
- frio;
- ornamental sem conteúdo.
## 4. Presença humana
Lukas aparece em processo, Sobre, contato, tom das mensagens e assinatura discreta.
A Repage não será apresentada como equipe ampla.
Fotografia pessoal não é obrigatória na V1. Quando usada, deve ser real, coerente, profissional e natural, sem transformar o site em currículo.
## 5. Referências
Absorver como princípios:
- tipografia como elemento visual;
- mídia integrada;
- continuidade entre seções;
- mudança de escala;
- sobreposição controlada;
- vídeos curtos;
- composição assimétrica;
- transições intencionais;
- narrativa ligada ao scroll;
- hierarquia editorial.
Referência não autoriza copiar identidade, layout, animação, conteúdo, código ou marca.
## 6. Antirreferências
Evitar:
- template SaaS genérico;
- dashboard em todas as seções;
- bento grid por tendência;
- glassmorphism;
- partículas;
- WebGL;
- cenário 3D;
- cursor customizado;
- scroll hijacking;
- carrossel infinito;
- som automático;
- máquina de escrever;
- terminal;
- glow permanente;
- mockups abstratos semelhantes;
- grid decorativo;
- livros literais;
- página dobrada literal;
- card para todo conteúdo;
- cápsulas excessivas;
- excesso de gradiente.
## 7. Cores
### 7.1 Paleta-base auditada
| Token | Valor | Papel |
|---|---|---|
| `ink` | `#101827` | fundo escuro principal |
| `graphite` | `#182235` | fundo escuro secundário |
| `paper` | `#F5F2EC` | superfície clara e texto em fundo escuro |
| `violet` | `#6C63FF` | destaque estratégico |
| `blue` | `#91A8FF` | reflexo e apoio |
| `mist` | `#B9C0CC` | texto secundário e apoio |
Tons adicionais existentes:
| Token | Valor | Papel |
|---|---|---|
| `inkRaised` | `#151F31` | superfície escura elevada |
| `inkHeader` | `#141E30` | superfície do header |
| `inkDeep` | `#0D1522` | profundidade escura |
Não criar novos tons sem necessidade, papel semântico, contraste e revisão do conjunto.
## 8. Papéis semânticos
Preferir nomes por função:
- background;
- surface;
- text;
- text-muted;
- border;
- accent;
- focus;
- success;
- error;
- warning.
Evitar hexadecimais espalhados em componentes.
## 9. Distribuição de superfícies
Superfícies escuras:
- hero;
- projetos destacados;
- proposta de valor e diferenciais;
- Sobre;
- contato;
- encerramento;
- header após o hero.
Superfícies claras:
- serviços;
- processo;
- textos longos dos cases;
- páginas legais.
A alternância deve construir continuidade entre capítulos, não funcionar como padrão decorativo nem exigir divisores rígidos.
## 10. Azul-violeta e azul
O violeta pode aparecer em:
- CTA;
- foco;
- estado ativo;
- indicador;
- linha;
- pequeno reflexo;
- destaque tipográfico pontual.
Não usar como fundo recorrente, glow constante ou borda de todos os componentes.
O azul pode apoiar reflexos, transição localizada e profundidade. Não deve competir com o violeta.
## 11. Gradientes
Permitidos quando localizados, pouco saturados, funcionais e coerentes com profundidade.
Evitar:
- gradiente em todos os textos;
- gradiente em todos os botões;
- fundo aurora genérico;
- violeta–azul como solução automática.
## 12. Dark mode
Não haverá seletor de dark mode na V1.
A experiência já usa superfícies claras e escuras como parte da narrativa.
Tokens devem permanecer semânticos para evolução futura.
## 13. Tipografia principal
Família:
- Instrument Sans.
Usos:
- navegação;
- texto;
- botão;
- formulário;
- título funcional;
- case;
- página legal;
- metadado.
Carregamento local obrigatório.
## 14. Tipografia display
Preferência:
- Clash Display.
Usos limitados:
- palavra estratégica;
- frase curta;
- número editorial;
- composição `R` → `Repage`;
- trecho especial do hero;
- frase tipográfica;
- encerramento justificado.
Não usar em texto longo, formulário, navegação, informação crítica ou todos os títulos.
## 15. Contingência tipográfica
Bricolage Grotesque só pode substituir Clash Display diante de impedimento comprovado de:
- licença;
- arquivo;
- acentuação;
- legibilidade;
- carregamento;
- compatibilidade;
- comportamento mobile.
Não é uma segunda opção estética livre.
## 16. Validação de fontes
Antes de publicar:
- validar licença comercial;
- validar caracteres portugueses;
- validar pesos;
- validar renderização;
- validar tamanhos grandes;
- validar mobile;
- usar arquivo local;
- evitar layout shift;
- definir fallback;
- verificar desempenho.
Não versionar fonte sem licença adequada.
## 17. Hierarquia tipográfica
- Hero muito expressivo.
- Títulos de seção fortes e proporcionais.
- Corpo confortável.
- Case com largura de leitura.
- Metadados pequenos sem perder legibilidade.
- Alinhamento predominantemente à esquerda.
- Caixa alta somente em identificadores.
- Escala fluida com `clamp()` quando apropriado.
Não depender apenas de cor para criar hierarquia.
## 18. Layout e containers
O layout usa três níveis que não devem ser confundidos:

- `page gutter`: proteção mínima compartilhada da viewport;
- `editorial content frame`: largura de leitura e composição para conteúdos convencionais;
- `immersive stage`: palco local para narrativas, mídia ou trajetórias que precisam extrapolar o frame.

O gutter não deve ser alterado globalmente para corrigir uma seção. O frame editorial pode ser reutilizado entre capítulos convencionais, enquanto palcos imersivos mantêm largura e altura próprias.

Container amplo de referência:
- aproximadamente `1280px–1360px` para conteúdo;
- token atual permite até `1440px`.
A largura final depende do conteúdo.
Textos longos não ocupam toda a largura.
## 19. Grid
Desktop usa grid estrutural invisível de 12 colunas para alinhamento, proporção, sobreposição e ritmo.
O grid não precisa aparecer.
Grids visíveis só podem existir quando tiverem função narrativa ou de profundidade.
## 20. Assimetria
Usar assimetria controlada em mídia, recortes, títulos, escala e sobreposição.
Textos, controles e ações devem manter alinhamento legível.
O estado final deve continuar estável e compacto; a assimetria pertence à relação entre conteúdo, mídia e entrada, não a desalinhamentos arbitrários.
## 21. Extrapolação do container
Podem ultrapassar o container:
- screenshot;
- fundo de mídia;
- linha;
- recorte;
- luz;
- elemento narrativo.
Não podem cortar conteúdo essencial, provocar overflow, esconder controle ou prejudicar leitura.
## 22. Divisões de layout
Evitar repetição de `50 / 50`.
Alternar mídia dominante, texto curto, composição editorial, sequência vertical, recorte, escala e alinhamento deslocado quando isso servir ao conteúdo.
## 23. Espaçamento e ritmo
Base em múltiplos de `4px`.
Ritmo esperado:
- hero amplo;
- projetos longos;
- serviços compactos;
- frase tipográfica com respiro;
- processo narrativo;
- Sobre calmo;
- contato expressivo.
Espaço vazio reforça hierarquia e leitura. Não simula luxo.
## 24. Densidade
Não manter o mesmo padding, altura, card, gap ou quantidade de informação em todas as seções.
A variação deve preservar coerência.
## 25. Superfícies e profundidade
Profundidade moderada por:
- sobreposição;
- escala;
- recorte;
- contraste;
- borda;
- sombra curta;
- luz localizada.
Evitar sombra grande, blur, vidro, glow recorrente e perspectiva excessiva.
Planos, linhas, recortes e variações tonais podem apoiar a identidade como camadas de profundidade, desde que poucos, assimétricos e subordinados ao conteúdo. Não formar grid técnico, moldura ou dashboard decorativo.
## 26. Raios, bordas e sombras
Tokens atuais:
- controle: `10px`;
- ação: `12px`.
Controles usam raios pequenos e precisos. Imagens e superfícies grandes podem usar raio moderado.
Bordas padrão são discretas. Foco e seleção usam contraste maior.
Sombras são curtas e funcionais. Evitar sombra de card SaaS e elevação artificial.
## 27. Luz
Luminosidade digital é pontual e estratégica.
Pode apoiar CTA, linha, mídia ativa, transição e foco narrativo.
Não criar estética neon dominante.
## 28. Componentes compartilhados
Previstos:
- botões;
- links;
- header;
- menu mobile;
- footer;
- card de projeto;
- destaque de projeto;
- moldura de mídia;
- dispositivo;
- microvídeo;
- galeria;
- visualizador;
- campos;
- mensagens;
- resumo de erros;
- consentimento;
- preferências;
- skip link;
- feedback;
- boundary.
Criar componente compartilhado somente com repetição e contrato claros.
## 29. Conteúdos que não viram card automaticamente
- serviços;
- diferenciais;
- Sobre;
- processo;
- frase editorial;
- explicação de case;
- textos legais.
Card é ferramenta, não unidade padrão.
## 30. Estados obrigatórios
Quando aplicável:
- padrão;
- hover;
- foco;
- pressionado;
- desabilitado;
- carregamento;
- sucesso;
- erro.
Estado ausente significa requisito incompleto.
## 31. Hover e foco
Hover:
- somente melhoria;
- sem informação exclusiva;
- apenas em dispositivos compatíveis;
- curto;
- sem deslocar layout.
Foco:
- altamente visível;
- coerente nos dois fundos;
- independente de hover;
- não cortado;
- presente em links, botões, campos e controles.
## 32. Pressionado, desabilitado e loading
Pressionado confirma ação sem salto.
Desabilitado parece indisponível, não responde e preserva legibilidade.
Loading impede ação duplicada, mantém contexto, comunica progresso e não causa layout shift relevante.
## 33. Sucesso e erro
Sucesso:
- confirma ação;
- usa linguagem humana;
- orienta próximo passo;
- não depende apenas de verde.
Erro:
- explica o problema;
- não revela detalhe técnico;
- permite recuperação;
- preserva dados quando seguro;
- não depende apenas de vermelho.
## 34. Botões, links e ícones
Botão primário representa a ação principal. Botão secundário mantém prioridade menor sem parecer inativo.
Evitar múltiplos primários concorrentes, texto genérico, cápsula excessiva e ícone decorativo.
Links devem ter destino real, aparência de link, foco e segurança para destino externo.
Ícones são lineares, discretos, funcionais e consistentes. Não criar ícone genérico para decorar cada serviço.
## 35. Imagens reais
Imagens reais são a principal prova do portfólio.
Cada projeto precisa de:
- captura principal;
- screenshots desktop;
- screenshots mobile;
- imagem social;
- dimensão;
- texto alternativo;
- descrição quando necessária;
- dados sensíveis removidos;
- autorização;
- natureza identificada.
## 36. Captura principal e molduras
Escolher o melhor enquadramento, não necessariamente homepage inteira reduzida.
Permitido:
- desktop com barra mínima;
- recorte sem moldura;
- notebook moderadamente realista;
- celular moderadamente realista.
Obrigatório:
- interface real;
- proporção coerente;
- legibilidade.
Evitar mockup publicitário, dispositivo decorativo e perspectiva que esconde a interface.
## 37. Produção de mídia
Lukas prepara o projeto, oculta dados, captura telas e grava fluxos simples.
A direção e implementação definem enquadramento, duração, capa, recorte, compressão, nome e composição.
Detalhes por projeto pertencem à spec.
## 38. Vídeos
Usar somente quando provarem fluxo, interação, funcionalidade ou transição relevante.
Regras:
- curtos;
- poster;
- sem som automático;
- sem autoplay simultâneo;
- parar fora de contexto;
- respeitar movimento reduzido;
- oferecer alternativa estática.
## 39. Níveis de movimento
### Funcional
Botões, campos, menu, feedback e galeria.
### Narrativo
Projetos, processo, mídia, progressão e transição.
### Assinatura
Hero, frase tipográfica e no máximo outro momento forte.
Não transformar cada seção em assinatura.
## 40. Famílias de movimento
- revelação;
- reorganização;
- continuidade;
- resposta.
Toda animação deve pertencer a uma função equivalente.
## 41. Regras gerais de movimento
- introdução do hero executa uma vez;
- evitar loop decorativo;
- priorizar `transform` e `opacity`;
- conteúdo existe no estado final;
- CTA e navegação não esperam animação;
- não animar layout continuamente;
- não prender o usuário;
- não bloquear scroll.
Movimento temporal é adequado para entradas curtas ligadas à chegada de uma seção. Movimento scroll-driven deve usar o progresso local quando a construção depende da posição na narrativa, responder de forma reversível ao avanço e ao retorno e não usar timers, snap ou interceptação de wheel como substitutos de composição.
## 42. Tipografia cinética
Preferir palavra, linha ou bloco.
Letras individuais somente em palavra especial.
Evitar cursor, terminal, digitação e embaralhamento ilegível.
## 43. Scroll e sticky
Permitido:
- continuidade hero → projetos;
- projetos em capítulos;
- processo narrativo;
- profundidade leve;
- até dois usos relevantes de sticky.
Proibido:
- scroll hijacking;
- `scroll-snap` rígido;
- seção presa por várias telas;
- conteúdo escondido;
- rolagem artificial por JavaScript.
Sticky só é válido quando houver necessidade narrativa concreta, com track curto, release previsível, fallback para viewport baixa e tratamento próprio no mobile. Não usar sticky para prolongar uma entrada ou compensar espaço vazio.
## 44. Responsividade
Faixas de referência:
- desktop amplo: acima de `1440px`;
- desktop/notebook: `1024px–1439px`;
- tablet: `768px–1023px`;
- mobile: abaixo de `768px`;
- mobile compacto: abaixo de aproximadamente `420px`.
Breakpoints são guiados pelo conteúdo.
### Desktop amplo
Texto permanece limitado. Mídia aproveita espaço. Não apenas aumentar tudo.
### Notebook
Reduzir gaps e sobreposição, preservar hierarquia e validar viewport baixa.
### Tablet
Preservar composição reduzida até a migração necessária. Não depender de hover. Garantir toque e reduzir sticky.
### Mobile
Texto, posicionamento e CTA aparecem cedo. Capítulos tornam-se verticais. Sobreposição reduz. Vídeo é contextual. Nenhuma informação depende de hover.
### Mobile compacto
Ajustar título, padding, quebra de CTA, mídia, menu, formulário e texto legal sem perder legibilidade.
### Celular horizontal
Tratar como viewport baixa, reduzir altura e sticky, evitar `100vh` rígido e manter rolagem natural.
## 45. Zoom e texto ampliado
Validar zoom, reflow, foco, menu, formulário e galeria.
Não cortar conteúdo com altura fixa.
## 46. Movimento reduzido
Com `prefers-reduced-motion`:
- hero organizado;
- projetos estáveis;
- vídeos sem autoplay;
- dispositivos estáveis;
- transições mínimas;
- linhas no estado final;
- conteúdo completo.
A identidade permanece.
## 47. Teclado e foco
- ordem lógica;
- skip link;
- foco visível;
- sem armadilha involuntária;
- `Esc` fecha overlay;
- foco retorna ao acionador;
- galeria operável;
- CTA acionável.
## 48. Menu mobile
Fechado:
- fora da ordem de foco;
- sem interação;
- oculto para tecnologia assistiva conforme implementação.
Aberto:
- foco inicial coerente;
- trap;
- `Esc`;
- retorno de foco;
- controle de scroll do fundo;
- estado anunciado.
## 49. Conteúdo acessível
Nenhuma informação depende exclusivamente de:
- animação;
- vídeo;
- hover;
- arraste;
- cor;
- áudio;
- autoplay.
## 50. Formulário acessível
- rótulos persistentes;
- descrição associada;
- erro por campo;
- resumo de erros;
- foco direcionado;
- feedback anunciado;
- loading;
- sucesso na própria área;
- uma coluna no mobile;
- erro não indicado só por vermelho.
Não usar formulário em etapas na V1.
## 51. Galeria acessível
- botões nomeados;
- teclado;
- indicador compreensível;
- alt;
- foco;
- fechamento;
- retorno de foco;
- sem gesto exclusivo;
- ampliação sem perder contexto.
## 52. Homepage
Ordem:
1. Hero.
2. Projetos selecionados.
3. Serviços.
4. Proposta de valor e diferenciais.
5. Processo.
6. Sobre.
7. Contato.
A ordem é decisão de produto.
## 53. Hero
Regras sistêmicas:
- slogan e CTAs estáveis;
- palco proprietário;
- fragmentos reais ou representações honestas;
- landing page, institucional e solução personalizada representadas;
- linha luminosa pontual;
- introdução curta;
- estado final estável;
- não depender de um cliente como rosto da marca;
- clareza antes de animação.
Storyboard detalhado pertence à spec.
## 54. Projetos selecionados
- três capítulos;
- mídia ampla;
- texto legível;
- progresso claro;
- próximo projeto assume espaço de forma compreensível;
- vídeo somente no capítulo ativo;
- CTA disponível;
- fallback vertical;
- protótipo antes de fixar técnica.
Comportamento exato pertence à spec.
## 55. Serviços
Apresentar uma composição editorial em fluxo normal, não cards SaaS nem accordion como padrão obrigatório.
Mostrar com o mesmo peso:
- landing page;
- site institucional;
- solução personalizada.
Suporte aparece como continuidade.
## 56. Proposta de valor
- frase curta;
- escala ampla;
- trecho display limitado;
- revelação por palavras quando apropriado;
- conteúdo legível sem animação;
- contraste forte.
## 57. Processo
- sequência narrativa;
- progresso claro;
- relação entre etapas;
- versão mobile própria;
- sem scroll bloqueado;
- sem etapa escondida.
Coreografia detalhada pertence à spec.
## 58. Sobre
- composição calma;
- marca e Lukas equilibrados;
- símbolo pode formar ou revelar Repage;
- texto direto;
- sem currículo completo;
- sem equipe fictícia.
Movimento exato pertence à spec.
## 59. Contato
- encerramento expressivo;
- frase forte;
- luz violeta pontual;
- formulário estável;
- movimento para no primeiro foco;
- WhatsApp alternativo;
- política acessível;
- sem promessa imediata.
## 60. Portfólio
- seis projetos;
- grade editorial controlada;
- escaneabilidade antes de experiência longa;
- formatos maiores e menores limitados;
- título, natureza, resumo, imagem, serviços e acesso;
- tecnologia secundária;
- sem autoplay simultâneo;
- sem mesmo efeito em todos os cards.
## 61. Cases
### Abertura
Título, natureza, resumo, participação, mídia principal e link publicado quando existir.
### Conteúdo
Visão geral, contexto, desafio, solução, participação, serviços, funcionalidades, decisões, galeria, tecnologias e CTA.
### Mídia
Uma mídia principal, sequência funcional, vídeo somente quando prova, reprodução controlada e dados sensíveis removidos.
### Encerramento
Síntese, CTA de orçamento, anterior/próximo, retorno ao portfólio e link externo quando disponível.
Textos longos usam superfície clara e largura de leitura.
## 62. Header, menu e footer
Header:
- fixo;
- integrado ao hero;
- sem cápsula;
- ganha superfície após o hero;
- reduz discretamente;
- mantém contraste;
- navegação clara;
- CTA coerente.
Menu mobile:
- movimento curto;
- foco controlado;
- inacessível quando fechado;
- fundo controlado;
- fechamento claro.
Footer:
- compacto;
- funcional;
- links legais;
- preferências de cookies;
- sem repetir a seção de contato.
## 63. Formulário visual
Desktop usa duas colunas apenas para campos curtos. Mobile usa uma coluna.
Campos têm superfície, borda discreta, rótulo persistente, foco forte, erro claro, loading e sucesso na própria área.
## 64. Páginas legais, 404 e falhas
Páginas legais:
- layout editorial;
- largura de leitura;
- índice quando útil;
- pouco movimento;
- hierarquia;
- data e versão;
- links acessíveis.
404:
- composição tipográfica;
- símbolo discreto;
- mensagem humana;
- ação para homepage e portfólio.
Falhas:
- mensagens úteis;
- sem detalhe interno;
- recuperação;
- poster, texto e links quando mídia ou JavaScript falhar.
## 65. Critérios objetivos de qualidade
Uma página ou seção só está concluída quando:
- usa conteúdo real;
- não depende de placeholder;
- não apresenta overflow;
- mantém texto legível;
- possui ação real;
- possui estados;
- funciona com teclado;
- possui foco;
- funciona no toque;
- respeita movimento reduzido;
- mantém conteúdo sem animação e hover;
- possui fallback de mídia;
- funciona com mídia lenta;
- funciona em desktop e mobile;
- não expõe dado sensível;
- não possui erro relevante de console;
- não possui link quebrado;
- não inventa prova;
- preserva identidade.
## 66. O que preservar
- logo;
- símbolo;
- paleta-base;
- Instrument Sans;
- hierarquia e legibilidade;
- responsividade saudável;
- movimento reduzido;
- animações úteis;
- componentes acessíveis;
- tokens;
- arquitetura de estilos;
- React;
- TypeScript;
- Vite;
- Styled Components;
- Framer Motion.
## 67. O que substituir ou recompor
Quando necessário:
- hero atual;
- portfólio provisório;
- cards repetitivos;
- mockups conceituais semelhantes;
- grids decorativos;
- processo genérico;
- CTA desabilitado ativo;
- menu fechado focável;
- animações básicas iguais;
- seções sem prova;
- mídia provisória.
Preservar a base saudável, mas recompor seções que não atendem à direção.
## 68. Sistema reutilizável e identidade específica
Específico da Repage:
- palco do hero;
- recortes do símbolo;
- linha violeta;
- composição `R` → `Repage`;
- capítulos de projeto;
- narrativa visual;
- combinação de mídia e tipografia.
Não copiar essa identidade para clientes.
Reutilizável como base técnica:
- acessibilidade;
- componentes funcionais;
- responsividade;
- tokens estruturais;
- formulário;
- fallback;
- carregamento;
- arquitetura;
- testes.
## 69. Specs no momento adequado
Criar somente quando a entrega iniciar:
- tipografia e carregamento;
- storyboard do hero;
- projetos destacados;
- produção de mídia;
- portfólio;
- cases;
- formulário;
- consentimento;
- SEO;
- páginas auxiliares.
Não criar todas antecipadamente.
## 70. Definição de pronto
O design da V1 está pronto quando:
- seis projetos possuem mídia real;
- três destaques funcionam;
- rotas estão completas;
- desktop e mobile têm acabamento equivalente;
- foco e teclado funcionam;
- movimento reduzido funciona;
- formulário possui todos os estados;
- consentimento funciona;
- páginas legais são legíveis;
- 404 funciona;
- mídia possui fallback;
- não existe placeholder final;
- não existe overflow;
- não existe interação falsa;
- não existe prova inventada;
- identidade é reconhecível sem repetição literal.
## 71. Pendências
- Validar licença, arquivos e acentuação da Clash Display.
- Decidir contingência somente se necessário.
- Aprovar mídias de projetos pagos.
- Prototipar capítulos de projetos.
- Concluir conteúdo dos cases.
- Validar contraste final.
- Validar performance de mídia.
