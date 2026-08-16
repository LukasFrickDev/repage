import { Link } from 'react-router-dom';
import { useConsent } from './useConsent';
import * as S from './styles';

export function ConsentBanner() {
  const { acceptAll, rejectNonEssential, openPreferences } = useConsent();

  return (
    <S.Banner role="region" aria-labelledby="consent-banner-title">
      <S.BannerCopy>
        <S.BannerTitle id="consent-banner-title">Sua privacidade importa</S.BannerTitle>
        <S.BannerText>
          Usamos apenas tecnologias necessárias por padrão. O Analytics só é ativado com sua autorização.
          {' '}Saiba mais na <Link to="/cookies">Política de Cookies</Link>.
        </S.BannerText>
      </S.BannerCopy>
      <S.BannerActions>
        <S.SecondaryButton type="button" onClick={rejectNonEssential}>Rejeitar não essenciais</S.SecondaryButton>
        <S.SecondaryButton type="button" onClick={openPreferences}>Personalizar</S.SecondaryButton>
        <S.PrimaryButton type="button" onClick={acceptAll}>Aceitar todos</S.PrimaryButton>
      </S.BannerActions>
    </S.Banner>
  );
}
