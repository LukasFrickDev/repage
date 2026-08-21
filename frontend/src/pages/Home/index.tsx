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

const criticalFont = '620 1em "Instrument Sans"';
const fontSafetyTimeout = 4_000;
type IntroStatus = 'waiting' | 'ready' | 'degraded';

const Home = () => {
  const prefersReducedMotion = useHydrationSafeReducedMotion();
  const [introStatus, setIntroStatus] = useState<IntroStatus>('waiting');
  const entranceDelay = prefersReducedMotion ? 0 : 0.68;
  const introReleased = introStatus !== 'waiting';
  const introFontReady = introStatus === 'ready';

  useEffect(() => {
    let active = true;
    let settled = false;
    const settle = (status: Exclude<IntroStatus, 'waiting'>) => {
      if (!active || settled) return;
      settled = true;
      setIntroStatus(status);
    };
    const timeoutId = window.setTimeout(() => settle('degraded'), fontSafetyTimeout);

    if (!document.fonts) {
      settle('degraded');
    } else {
      document.fonts.load(criticalFont).then((loadedFonts) => {
        if (loadedFonts.length > 0 && document.fonts.check(criticalFont)) {
          settle('ready');
        } else {
          settle('degraded');
        }
      }, () => settle('degraded'));
    }

    return () => {
      active = false;
      settled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  useRouteMetadata(routeMetadata.home);

  return (
    <S.Page data-intro-status={introStatus}>
      <S.Hero data-home-section="hero" aria-labelledby="hero-title">
        <S.HeroBackdrop aria-hidden="true" />
        {introStatus !== 'degraded' && (!prefersReducedMotion || !introReleased) && (
          <S.BrandEntrance $fontReady={introFontReady} aria-hidden="true">
            <S.BrandEntranceIdentity $fontReady={introFontReady}>
              <img data-intro-symbol src="/brands/logo-offwhiote.svg" alt="" />
              {introFontReady && <span data-intro-wordmark>Repage</span>}
            </S.BrandEntranceIdentity>
            <S.BrandEntranceLine $fontReady={introFontReady} />
          </S.BrandEntrance>
        )}
        <S.HeroInner>
          <S.Copy>
            <S.Eyebrow
              initial={!introReleased ? { opacity: 0, y: 8 } : prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              animate={introReleased ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.48, delay: prefersReducedMotion ? 0 : entranceDelay, ease: [0.22, 1, 0.36, 1] }}
            >
              {heroContent.eyebrow}
            </S.Eyebrow>
            <S.Title
              id="hero-title"
              data-route-heading
              tabIndex={-1}
              initial={prefersReducedMotion || !introReleased ? { opacity: 0, y: 12 } : false}
              animate={introReleased ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.58, delay: prefersReducedMotion ? 0 : entranceDelay + 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              {heroContent.title}
            </S.Title>
            <S.Details
              initial={prefersReducedMotion || !introReleased ? { opacity: 0, y: 10 } : false}
              animate={introReleased ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.58, delay: prefersReducedMotion ? 0 : entranceDelay + 0.14, ease: [0.22, 1, 0.36, 1] }}
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
