import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useConsent } from './useConsent';
import * as S from './styles';

const BANNER_ENTRY_DELAY_MS = 1600;

export function ConsentBanner() {
  const { acceptAll, rejectNonEssential, openPreferences } = useConsent();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setIsVisible(true), BANNER_ENTRY_DELAY_MS);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <S.Banner
      data-visible={isVisible}
      role="region"
      aria-hidden={!isVisible}
      aria-labelledby="consent-banner-title"
      inert={!isVisible}
    >
      <S.BannerCopy>
        <S.BannerTitle id="consent-banner-title">Sua privacidade importa</S.BannerTitle>
        <S.BannerText>
          Usamos apenas tecnologias necessárias por padrão. O Analytics só é ativado com sua autorização.
          {' '}Saiba mais na <Link to="/cookies" tabIndex={isVisible ? 0 : -1}>Política de Cookies</Link>.
        </S.BannerText>
      </S.BannerCopy>
      <S.BannerActions>
        <S.SecondaryButton type="button" tabIndex={isVisible ? 0 : -1} onClick={rejectNonEssential}>Recusar opcionais</S.SecondaryButton>
        <S.SecondaryButton type="button" tabIndex={isVisible ? 0 : -1} onClick={openPreferences}>Personalizar</S.SecondaryButton>
        <S.PrimaryButton type="button" tabIndex={isVisible ? 0 : -1} onClick={acceptAll}>Aceitar todos</S.PrimaryButton>
      </S.BannerActions>
    </S.Banner>
  );
}
