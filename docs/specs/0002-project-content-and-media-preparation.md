# 0002 — Preparação de conteúdo e mídias dos projetos

* **Status:** implemented
* **Responsável:** Lukas Frick
* **Data:** 5 de agosto de 2026
* **Branch-base:** `main`
* **Entrega do roadmap:** 2 — Organização de conteúdo e mídias reais
* **Spec predecessora:** `0001-frontend-foundation-and-routing.md`
* **Documentos relacionados:** `AGENTS.md`, `frontend/AGENTS.md`, `docs/PRODUCT.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md` e `docs/ROADMAP.md`
* **Commit documental:** `14255ba` — `docs: add project content and media preparation spec`

## 1. Contexto

A spec 0001 foi implementada, validada e integrada à `main`.

O frontend agora possui roteamento público, `PublicLayout`, páginas estruturais, navegação por âncoras, gerenciamento de foco e scroll, menu mobile acessível, metadados básicos e testes automatizados.

Os seis projetos da V1 já estão registrados em uma fonte estática e tipada, mas todos permanecem como rascunho e contêm somente informações mínimas.

Ainda não existem no repositório:

* dossiês de conteúdo verificável por projeto;
* registro operacional de fontes e evidências;
* confirmação de participação e autoria por projeto;
* controle explícito de autorização;
* inventário de links públicos;
* screenshots desktop e mobile;
* capturas principais;
* imagens sociais;
* inventário tipado de mídia;
* ativos de projetos versionados.

A homepage definitiva e os seis cases não podem ser implementados com segurança antes dessa preparação.

## 2. Objetivo

Preparar e versionar um pacote confiável de conteúdo, evidências, autorizações, links e mídias para os seis projetos da V1.

A entrega deve permitir que as specs posteriores da homepage e do portfólio usem somente informações verificadas, sem depender da memória de conversas ou de novas suposições.

## 3. Resultado esperado

Ao final da entrega:

* os seis projetos possuem dossiê operacional;
* fatos confirmados e pendências estão claramente separados;
* participação, natureza e autoria estão registradas corretamente;
* links públicos estão verificados ou marcados como indisponíveis;
* autorizações aplicáveis estão confirmadas ou registradas como pendentes;
* ativos autorizados estão capturados, revisados, otimizados e versionados;
* dados pessoais, credenciais e informações confidenciais não aparecem nas mídias;
* existe um manifesto tipado de prontidão e mídia;
* testes detectam inconsistências entre projetos, manifesto e arquivos;
* bloqueios externos possuem responsável e próximo passo;
* nenhum projeto é promovido para `published`;
* nenhuma interface final de homepage, portfólio ou case é implementada.

## 4. Estado atual relevante

Na `main`:

* os seis projetos estão registrados em `frontend/src/data/projects/`;
* todos possuem `publicationStatus: 'draft'`;
* os registros atuais contêm título, slug, natureza e estado;
* `predatesRepage` não foi preenchido por falta de confirmação explícita;
* `/portfolio` e `/portfolio/:slug` ainda apresentam estados estruturais temporários;
* páginas temporárias e cases usam `noindex`;
* `frontend/public/` contém somente ativos da marca;
* o frontend possui lint, typecheck, testes e build configurados;
* a spec 0001 foi validada com Playwright MCP;
* nenhuma fonte de projeto deve ser presumida a partir do estado anterior à spec 0001.

## 5. Projetos obrigatórios

A entrega cobre exatamente:

1. EchoCosmicEnergia;
2. Axium;
3. DevSchedule;
4. GreenTweet;
5. A Alma no Comando;
6. Alicerce da Alma.

Não adicionar, remover ou substituir projetos nesta entrega.

## 6. Escopo

### 6.1 Auditoria das fontes

Para cada projeto:

* localizar fontes acessíveis e verificáveis;
* conferir documentação aprovada da Repage;
* inspecionar o repositório real do projeto quando disponível;
* inspecionar README, código, rotas, funcionalidades e configurações relevantes;
* identificar um commit, branch ou estado de referência;
* localizar URL pública somente quando ela vier de fonte verificável;
* validar a URL pública quando acessível;
* registrar o que foi realmente inspecionado;
* separar evidência direta de informação ainda pendente.

Não usar memória, pesquisa genérica ou texto promocional não verificado para preencher lacunas.

### 6.2 Dossiês dos projetos

Criar um dossiê Markdown para cada slug em:

`docs/content/projects/`

Cada dossiê deve conter:

* identificação;
* slug;
* natureza;
* fontes inspecionadas;
* estado ou commit de referência;
* participação de Lukas ou da Repage;
* relação temporal com a formalização da Repage, quando confirmada;
* contexto verificável;
* necessidade ou desafio verificável;
* solução verificável;
* funcionalidades verificadas;
* serviços relacionados;
* tecnologias verificadas;
* URL pública e seu estado;
* autorização;
* inventário de mídia;
* revisão de privacidade;
* fatos ainda não confirmados;
* bloqueios;
* próximo passo;
* estado de prontidão.

Os textos são notas editoriais e evidências de trabalho.

Não são a copy final dos cases.

### 6.3 Autorização

Para projetos pagos, registrar um dos estados:

* `confirmed`;
* `pending`;
* `restricted`.

Para projeto próprio e desafio técnico, registrar:

* `not-required`.

Uma autorização só pode ser marcada como `confirmed` quando existir confirmação explícita de Lukas ou evidência aplicável fornecida por ele.

Não versionar contrato, conversa privada, e-mail, documento assinado, telefone, endereço ou dado pessoal usado como prova da autorização.

O repositório registra somente o estado operacional da autorização.

Sem autorização confirmada, não adicionar nova mídia identificável, link público ou detalhe comercial do projeto pago ao conteúdo publicável.

O nome já aprovado e mantido em páginas temporárias `noindex` não autoriza a inclusão automática de novos detalhes ou imagens.

### 6.4 Captura de mídia

Usar preferencialmente o Playwright MCP para projetos acessíveis em navegador.

Para cada projeto acessível:

* validar a origem da URL antes de abrir;
* usar conteúdo público, demonstração segura ou dados fictícios controlados;
* verificar desktop;
* verificar mobile;
* identificar telas e fluxos que comprovam o trabalho;
* capturar somente estados visualmente estáveis;
* evitar banners, extensões, dados de sessão e elementos estranhos ao projeto;
* registrar problemas de carregamento, console ou recursos indisponíveis;
* selecionar as capturas com maior valor de prova.

Referências mínimas:

* desktop em aproximadamente `1440 × 900`;
* mobile em aproximadamente `390 × 844`.

Outros tamanhos podem ser usados quando necessários.

Não alterar o código dos projetos de origem para melhorar artificialmente a captura.

Ajustes locais temporários só podem ser usados para iniciar o projeto, carregar dados de demonstração existentes, ocultar dados sensíveis ou estabilizar desenvolvimento.

Esses ajustes não devem ser enviados aos repositórios de origem.

### 6.5 Tipos de mídia

Quando disponíveis, relevantes e autorizados, preparar:

* captura principal;
* screenshots desktop;
* screenshots mobile;
* imagem social;
* detalhes ou fluxos relevantes;
* poster estático para eventual vídeo.

Vídeo não é obrigatório.

Só preparar vídeo quando ele comprovar interação, fluxo ou funcionalidade que uma imagem não representa adequadamente.

### 6.6 Processamento

Os ativos finais devem:

* usar interface real;
* preservar legibilidade;
* ter enquadramento coerente;
* possuir dimensões conhecidas;
* possuir proporção registrada;
* possuir formato adequado;
* estar comprimidos;
* ter metadados desnecessários removidos;
* não conter dados pessoais;
* não conter credenciais;
* não conter segredos;
* não conter informações administrativas reais;
* não conter conteúdo confidencial;
* não depender de serviço externo para carregar.

Preferir WebP para screenshots, PNG quando necessário, SVG somente para original seguro e WebM para vídeo justificado.

Não usar mockup publicitário, dispositivo decorativo que esconda a interface, perspectiva artificial, imagem gerada por IA como prova, screenshot de outro projeto, mídia externa apresentada como própria ou Cloudinary.

Não versionar arquivos brutos redundantes.

### 6.7 Organização dos ativos

Usar:

`frontend/public/projects/<slug>/`

Nomes preferenciais:

* `cover.webp`;
* `desktop-01.webp`;
* `desktop-02.webp`;
* `mobile-01.webp`;
* `mobile-02.webp`;
* `social.webp`;
* `poster.webp`;
* `demo.webm`.

Somente criar diretórios que possuam arquivos reais.

Não criar arquivos vazios, placeholders binários ou imagens genéricas.

### 6.8 Manifesto tipado de prontidão

Criar uma estrutura tipada próxima de:

`frontend/src/data/projects/`

O nome final pode seguir a organização real encontrada.

O manifesto deve ser ligado aos slugs já registrados, sem duplicar desnecessariamente título e natureza.

Deve registrar:

* slug;
* estado das evidências;
* estado do conteúdo;
* estado da autorização;
* estado dos links;
* estado da mídia;
* bloqueadores;
* ativos disponíveis.

Estados de evidência:

* `confirmed`;
* `partial`;
* `blocked`.

Estados de autorização:

* `confirmed`;
* `pending`;
* `restricted`;
* `not-required`.

Estados de link:

* `verified`;
* `unavailable`;
* `not-applicable`;
* `blocked`.

Estados de mídia:

* `ready`;
* `partial`;
* `blocked`.

Cada ativo deve conter:

* função;
* caminho;
* formato;
* largura;
* altura;
* texto alternativo de trabalho;
* revisão de privacidade;
* estado de autorização.

Nenhum registro deve mudar para `publicationStatus: 'published'`.

### 6.9 Índice de conteúdo

Criar:

`docs/content/README.md`

Explicar:

* finalidade;
* fontes aceitas;
* estados;
* autorização;
* privacidade;
* estrutura;
* relação com a fonte tipada;
* critério de prontidão.

## 7. Fora de escopo

Não incluir:

* redesign ou nova ordem da homepage;
* copy final;
* escolha dos três destaques;
* implementação visual do portfólio ou cases;
* galeria;
* visualizador;
* anterior ou próximo;
* projeto publicado;
* SEO completo;
* sitemap;
* JSON-LD;
* prerender;
* formulário;
* backend;
* PostgreSQL;
* e-mails;
* consentimento;
* Analytics;
* deploy;
* CI/CD;
* Cloudinary;
* contato automático com clientes;
* autorização automática;
* alteração dos projetos de origem;
* projeto demonstrativo novo;
* correção geral dos projetos auditados.

## 8. Regras de evidência

Fontes aceitas:

1. documentos aprovados da Repage;
2. código e documentação do projeto;
3. commit, branch ou tag identificável;
4. aplicação local real;
5. URL encontrada em fonte verificável;
6. confirmação explícita de Lukas.

Toda afirmação deve ser confirmada, parcial, bloqueada ou removida.

Não transformar integração técnica em resultado comercial.

## 9. Requisitos de conteúdo

Distinguir:

* fato técnico;
* fato de produto;
* participação;
* serviço;
* resultado verificável;
* resultado não comprovado.

Não usar promessas, métricas, percentuais ou depoimentos sem evidência.

## 10. Segurança e privacidade

Antes de versionar mídia, verificar nomes, e-mails, telefones, endereços, pedidos, clientes, dashboards, IDs, tokens, URLs internas, notificações, mensagens e dados financeiros.

Não usar produção real como demonstração.

Não capturar painel restrito com dados reais.

## 11. Acessibilidade do conteúdo

Para cada imagem:

* criar texto alternativo de trabalho;
* descrever o que ela comprova;
* evitar repetição e SEO artificial;
* registrar descrição complementar quando necessária.

## 12. Testes

Cobrir:

* seis slugs;
* slugs desconhecidos e duplicados;
* estados válidos;
* correspondência com a fonte principal;
* nenhum projeto publicado;
* autorização adequada à natureza;
* projeto pago sem autorização não pronto;
* caminhos únicos;
* extensões;
* dimensões;
* alt;
* existência dos arquivos;
* arquivos não registrados;
* mídia paga vinculada a autorização;
* bloqueadores coerentes.

Não usar snapshots extensos.

## 13. Validação em navegador

Usar preferencialmente o MCP `playwright`.

Não considerar `agent.browsers.list()` como verificação suficiente.

Para projetos acessíveis:

* abrir;
* validar desktop e mobile;
* inspecionar console e rede;
* confirmar origem;
* confirmar estabilidade;
* confirmar privacidade;
* confirmar funcionalidade real.

Na Repage, executar smoke test em `/`, `/portfolio`, um case e uma rota desconhecida.

Confirmar ausência de regressão, erro, publicação acidental ou perda de `noindex`.

Quando bloqueado, registrar tentativa, ferramenta, erro e impacto.

## 14. Áreas provavelmente afetadas

Documentação:

* `docs/ROADMAP.md`;
* `docs/specs/README.md`;
* esta spec;
* `docs/content/README.md`;
* `docs/content/projects/`.

Frontend:

* `frontend/src/data/projects/`;
* `frontend/public/projects/`.

Não mover páginas ou componentes sem necessidade.

## 15. Critérios de aceite

* [ ] Spec adicionada como `approved` antes da implementação.
* [ ] Índice de specs atualizado.
* [ ] Estado atual do roadmap corrigido sem alterar sequência.
* [ ] Índice de conteúdo criado.
* [ ] Seis dossiês criados.
* [ ] Fontes inspecionadas registradas.
* [ ] Fatos e pendências separados.
* [ ] Participação e natureza corretas.
* [ ] Projetos próprios e desafios não são clientes.
* [ ] Autorizações explícitas e não inventadas.
* [ ] URLs verificadas ou bloqueadas.
* [ ] Manifesto tipado criado.
* [ ] Manifesto corresponde aos seis projetos.
* [ ] Todos permanecem como rascunho.
* [ ] Ativos e manifesto correspondem.
* [ ] Mídias estão revisadas e otimizadas.
* [ ] Nenhum dado sensível conhecido foi incluído.
* [ ] Projeto pago sem autorização não recebeu nova mídia identificável.
* [ ] Bloqueios possuem próximo passo.
* [ ] Testes adicionados.
* [ ] Lint, typecheck, testes e build aprovados.
* [ ] Playwright usado quando disponível.
* [ ] Repage não sofreu redesign.
* [ ] Cases não foram antecipados.
* [ ] Nada foi inventado.

## 16. Riscos

* falta de acesso;
* aplicação indisponível;
* falta de autorização;
* dados pessoais;
* crescimento para cases;
* duplicação da fonte;
* arquivos pesados.

Mitigar com bloqueios explícitos, fontes verificáveis, dados fictícios, manifesto ligado aos slugs atuais, otimização e preservação do escopo.

## 17. Dependências

* 0001 implementada;
* acesso às fontes;
* ambientes executáveis ou URLs verificáveis;
* confirmação de participação;
* autorizações;
* conteúdo seguro;
* Playwright MCP;
* ferramenta de otimização.

Ausência de dependência gera bloqueio, nunca invenção.

## 18. Documentação afetada

Ao materializar:

* adicionar spec;
* atualizar índice;
* corrigir estado atual do roadmap.

Ao implementar:

* adicionar índice de conteúdo;
* adicionar seis dossiês.

Ao concluir:

* mudar para `implemented`;
* atualizar índice;
* registrar PR ou commit;
* manter bloqueios;
* não alterar sequência.

Não criar página nova no Notion.

## 19. Validações obrigatórias

No frontend:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Na raiz:

```bash
git diff --check
```

Validar links, arquivos, formatos, segredos, artefatos, tamanho e diff.

## 20. Definição de pronto

A entrega está pronta quando:

* seis dossiês existem;
* informações estão classificadas;
* autorizações estão registradas;
* mídias seguras e autorizadas estão versionadas;
* bloqueios estão explícitos;
* manifesto e testes estão aprovados;
* todos continuam como rascunho;
* nenhuma interface final foi antecipada;
* validações foram executadas;
* diff foi revisado;
* spec está `implemented`;
* relatório final lista fontes, autorizações, ativos, bloqueios e resultados.
