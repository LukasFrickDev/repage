import { routeMetadata, useRouteMetadata } from '../../app/routeMetadata';
import * as S from '../StructuralPage/styles';

export function PrivacyPage() {
  useRouteMetadata(routeMetadata.privacy);

  return (
    <S.Page aria-labelledby="privacy-title">
      <S.Container>
        <S.Eyebrow>Privacidade</S.Eyebrow>
        <S.Title id="privacy-title" data-route-heading tabIndex={-1}>Política de Privacidade em preparação.</S.Title>
        <S.Description>
          O conteúdo final desta política ainda está em preparação e passará por revisão antes da publicação.
        </S.Description>
        <S.Actions>
          <S.ActionLink to="/" data-primary="true">Voltar para a página inicial</S.ActionLink>
          <S.ActionLink to="/cookies">Ver página de Cookies</S.ActionLink>
        </S.Actions>
      </S.Container>
    </S.Page>
  );
}
