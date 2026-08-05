import { routeMetadata, useRouteMetadata } from '../../app/routeMetadata';
import * as S from '../StructuralPage/styles';

export function NotFoundPage() {
  useRouteMetadata(routeMetadata.notFound);

  return (
    <S.Page aria-labelledby="not-found-title">
      <S.Container>
        <S.Eyebrow>Erro 404</S.Eyebrow>
        <S.Title id="not-found-title" data-route-heading tabIndex={-1}>Página não encontrada.</S.Title>
        <S.Description>O endereço informado não existe ou não está disponível.</S.Description>
        <S.Actions>
          <S.ActionLink to="/" data-primary="true">Ir para a página inicial</S.ActionLink>
          <S.ActionLink to="/portfolio">Ver portfólio</S.ActionLink>
        </S.Actions>
      </S.Container>
    </S.Page>
  );
}
