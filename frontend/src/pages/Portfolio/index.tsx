import { routeMetadata, useRouteMetadata } from '../../app/routeMetadata';
import { projectNatureLabels } from '../../data/projects';
import { listPublicProjects } from '../../data/projects/publication';
import * as S from '../StructuralPage/styles';

export function PortfolioPage() {
  useRouteMetadata(routeMetadata.portfolio);

  return (
    <S.Page aria-labelledby="portfolio-title">
      <S.Container>
        <S.Eyebrow>Portfólio</S.Eyebrow>
        <S.Title id="portfolio-title" data-route-heading tabIndex={-1}>Projetos conduzidos por Lukas Frick.</S.Title>
        <S.Description>
          Trabalhos pagos, projeto próprio e desafio técnico que mostram diferentes formas de combinar estratégia, design e desenvolvimento.
        </S.Description>
        <S.ProjectList aria-label="Projetos registrados">
          {listPublicProjects().map((project) => (
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
