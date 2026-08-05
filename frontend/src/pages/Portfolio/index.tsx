import { routeMetadata, useRouteMetadata } from '../../app/routeMetadata';
import { listProjects, projectNatureLabels } from '../../data/projects';
import * as S from '../StructuralPage/styles';

export function PortfolioPage() {
  useRouteMetadata(routeMetadata.portfolio);

  return (
    <S.Page aria-labelledby="portfolio-title">
      <S.Container>
        <S.Eyebrow>Portfólio</S.Eyebrow>
        <S.Title id="portfolio-title" data-route-heading tabIndex={-1}>Projetos em preparação.</S.Title>
        <S.Description>
          Esta página reúne a estrutura inicial dos projetos confirmados. Os cases e materiais completos ainda estão em preparação.
        </S.Description>
        <S.ProjectList aria-label="Projetos registrados">
          {listProjects().map((project) => (
            <li key={project.slug}>
              <S.ProjectLink to={`/portfolio/${project.slug}`}>
                <strong>{project.title}</strong>
                <span>{projectNatureLabels[project.nature]}</span>
              </S.ProjectLink>
            </li>
          ))}
        </S.ProjectList>
        <S.Actions>
          <S.ActionLink to="/#contato" data-primary="true">Solicitar orçamento</S.ActionLink>
          <S.ActionLink to="/">Voltar para a página inicial</S.ActionLink>
        </S.Actions>
      </S.Container>
    </S.Page>
  );
}
