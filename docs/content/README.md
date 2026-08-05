# Conteúdo verificável dos projetos

Esta pasta reúne notas editoriais e operacionais que preparam os projetos da Repage para futuras implementações de homepage, portfólio e cases. Ela não é copy final nem autoriza publicação por si só.

## Fontes aceitas

Cada fato precisa referenciar uma fonte aprovada: documento vigente da Repage, código ou README do projeto, commit ou branch identificável, aplicação local real, URL encontrada em fonte verificável ou confirmação explícita de Lukas. Ausência de fonte é registrada como pendência ou bloqueio.

## Estados

Os dossiês separam fatos confirmados, parciais e bloqueados. O manifesto tipado em [`../../frontend/src/data/projects/projectReadiness.ts`](../../frontend/src/data/projects/projectReadiness.ts) usa os mesmos slugs da fonte principal e registra evidência, conteúdo, autorização, link, mídia, bloqueadores e ativos.

## Autorização e privacidade

Projetos pagos só são liberados quando a autorização operacional estiver `confirmed`. Enquanto estiver `pending` ou `restricted`, nenhum detalhe comercial novo, mídia identificável ou link público é liberado para uso no site. Projetos próprios e desafios técnicos usam `not-required`.

Qualquer ativo futuro precisa ter origem, dimensões, formato, alt de trabalho, revisão de privacidade e autorização registrados. Não versionar dados pessoais, credenciais, segredos, conteúdo administrativo real ou capturas de produção com dados reais.

## Estrutura e prontidão

Há um dossiê por slug em [`projects/`](projects/). Um projeto fica pronto para a interface final somente quando o manifesto e seu dossiê registrarem conteúdo, autorização, link e mídia compatíveis; bloqueios permanecem explícitos até serem resolvidos por uma fonte verificável.
