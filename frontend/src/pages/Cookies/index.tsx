import { routeMetadata, useRouteMetadata } from '../../app/routeMetadata';
import * as S from '../StructuralPage/styles';

export function CookiesPage() {
  useRouteMetadata(routeMetadata.cookies);

  return (
    <S.Page aria-labelledby="cookies-title">
      <S.Container>
        <S.Eyebrow>Cookies</S.Eyebrow>
        <S.Title id="cookies-title" data-route-heading tabIndex={-1}>Política de Cookies em preparação.</S.Title>
        <S.Description>
          O conteúdo final desta política ainda está em preparação e passará por revisão antes da publicação.
        </S.Description>
        <S.Actions>
          <S.ActionLink to="/" data-primary="true">Voltar para a página inicial</S.ActionLink>
          <S.ActionLink to="/privacidade">Ver página de Privacidade</S.ActionLink>
        </S.Actions>
      </S.Container>
    </S.Page>
  );
}
