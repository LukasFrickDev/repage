import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useConsent } from './useConsent';
import * as S from './styles';

const BANNER_ENTRY_DELAY_MS = 1000;

export function ConsentBanner() {
  const { acceptAll, rejectNonEssential, openPreferences } = useConsent();
  const [isVisible, setIsVisible] = useState(() => (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ));

  useEffect(() => {
    if (isVisible) return undefined;

    const timeoutId = window.setTimeout(() => setIsVisible(true), BANNER_ENTRY_DELAY_MS);
    return () => window.clearTimeout(timeoutId);
  }, [isVisible]);

  if (!isVisible) return null;

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
        <S.SecondaryButton type="button" onClick={rejectNonEssential}>Recusar opcionais</S.SecondaryButton>
        <S.SecondaryButton type="button" onClick={openPreferences}>Personalizar</S.SecondaryButton>
        <S.PrimaryButton type="button" onClick={acceptAll}>Aceitar todos</S.PrimaryButton>
      </S.BannerActions>
    </S.Banner>
  );
}
