import { ArrowRight } from 'lucide-react';
import { PrimaryCta } from '../../components/PrimaryCta';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { routeMetadata, useRouteMetadata } from '../../app/routeMetadata';
import { FeaturedProjectsSection } from '../../components/FeaturedProjectsSection';
import { FinalCtaSection } from '../../components/FinalCtaSection';
import { PageExperience } from '../../components/PageExperience';
import { ProcessSection } from '../../components/ProcessSection';
import { ServicesSection } from '../../components/ServicesSection';
import { SignatureSection } from '../../components/SignatureSection';
import { ValuePropositionSection } from '../../components/ValuePropositionSection';
import { heroContent } from '../../content/repageContent';
import { ANALYTICS_EVENT_NAMES, trackEvent } from '../../services/analytics';
import { useHydrationSafeReducedMotion } from '../../hooks/useHydrationSafeReducedMotion';
import * as S from './styles';

const Home = () => {
  const prefersReducedMotion = useHydrationSafeReducedMotion();
  const [introFontReady, setIntroFontReady] = useState(false);
  const entranceDelay = prefersReducedMotion ? 0 : 0.68;

  useEffect(() => {
    let active = true;
    const revealIntro = () => {
      if (active) setIntroFontReady(true);
    };
    const timeoutId = window.setTimeout(revealIntro, 1200);

    if (!document.fonts) {
      revealIntro();
    } else {
      document.fonts.load('620 1em "Instrument Sans"').then(revealIntro, revealIntro);
    }

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
    };
  }, []);

  useRouteMetadata(routeMetadata.home);

  return (
    <S.Page>
      <S.Hero data-home-section="hero" aria-labelledby="hero-title">
        <S.HeroBackdrop aria-hidden="true" />
        {!prefersReducedMotion && (
          <S.BrandEntrance $fontReady={introFontReady} aria-hidden="true">
            <S.BrandEntranceIdentity $fontReady={introFontReady}>
              <img src="/brands/logo-offwhiote.svg" alt="" />
              <span>Repage</span>
            </S.BrandEntranceIdentity>
            <S.BrandEntranceLine $fontReady={introFontReady} />
          </S.BrandEntrance>
        )}
        <S.HeroInner>
          <S.Copy>
            <S.Eyebrow
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, delay: entranceDelay, ease: [0.22, 1, 0.36, 1] }}
            >
              {heroContent.eyebrow}
            </S.Eyebrow>
            <S.Title
              id="hero-title"
              data-route-heading
              tabIndex={-1}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.58, delay: entranceDelay + 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              {heroContent.title}
            </S.Title>
            <S.Details
              initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.58, delay: entranceDelay + 0.14, ease: [0.22, 1, 0.36, 1] }}
            >
              <S.Description>{heroContent.description}</S.Description>
              <S.Actions>
                <PrimaryCta
                  as={Link}
                  to={heroContent.primaryCta.href}
                  onClick={() => trackEvent(ANALYTICS_EVENT_NAMES.quoteCtaClick, { context: 'hero' })}
                >
                  <span>{heroContent.primaryCta.label}</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </PrimaryCta>
                <S.SecondaryCta as={Link} to={heroContent.secondaryCta.href}>
                  <span>{heroContent.secondaryCta.label}</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </S.SecondaryCta>
              </S.Actions>
            </S.Details>
          </S.Copy>

          <S.Visual>
            <PageExperience entranceDelay={entranceDelay} />
          </S.Visual>
        </S.HeroInner>
      </S.Hero>
      <FeaturedProjectsSection />
      <ServicesSection />
      <ValuePropositionSection />
      <ProcessSection />
      <SignatureSection />
      <FinalCtaSection />
    </S.Page>
  );
};

export default Home;
