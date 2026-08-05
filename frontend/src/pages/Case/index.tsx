import { useParams } from 'react-router-dom';
import { getCaseMetadata, routeMetadata, useRouteMetadata } from '../../app/routeMetadata';
import { findProjectBySlug, projectNatureLabels } from '../../data/projects';
import * as S from '../StructuralPage/styles';

export function CasePage() {
  const { slug = '' } = useParams();
  const project = findProjectBySlug(slug);
  useRouteMetadata(project ? getCaseMetadata(project.title) : routeMetadata.notFound);

  if (!project) {
    return (
      <S.Page aria-labelledby="not-found-title">
        <S.Container>
          <S.Eyebrow>Erro 404</S.Eyebrow>
          <S.Title id="not-found-title" data-route-heading tabIndex={-1}>Projeto não encontrado.</S.Title>
          <S.Description>O endereço informado não corresponde a um projeto registrado.</S.Description>
          <S.Actions>
            <S.ActionLink to="/portfolio" data-primary="true">Ver portfólio</S.ActionLink>
            <S.ActionLink to="/">Ir para a página inicial</S.ActionLink>
          </S.Actions>
        </S.Container>
      </S.Page>
    );
  }

  return (
    <S.Page aria-labelledby="case-title">
      <S.Container>
        <S.Eyebrow>Case em preparação</S.Eyebrow>
        <S.Title id="case-title" data-route-heading tabIndex={-1}>{project.title}</S.Title>
        <S.Meta>{projectNatureLabels[project.nature]}</S.Meta>
        <S.Description>
          Este case ainda está em preparação. A página completa será publicada somente após a validação das informações e dos materiais aplicáveis.
        </S.Description>
        <S.Actions>
          <S.ActionLink to="/#contato" data-primary="true">Solicitar orçamento</S.ActionLink>
          <S.ActionLink to="/portfolio">Voltar ao portfólio</S.ActionLink>
        </S.Actions>
      </S.Container>
    </S.Page>
  );
}
