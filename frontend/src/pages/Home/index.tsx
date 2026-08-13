import { ArrowRight } from 'lucide-react';
import { PrimaryCta } from '../../components/PrimaryCta';
import { useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { routeMetadata, useRouteMetadata } from '../../app/routeMetadata';
import { FeaturedProjectsSection } from '../../components/FeaturedProjectsSection';
import { FinalCtaSection } from '../../components/FinalCtaSection';
import { PageExperience } from '../../components/PageExperience';
import { ProcessSection } from '../../components/ProcessSection';
import { ServicesSection } from '../../components/ServicesSection';
import { SignatureSection } from '../../components/SignatureSection';
import { ValuePropositionSection } from '../../components/ValuePropositionSection';
import { heroContent } from '../../content/repageContent';
import * as S from './styles';

const Home = () => {
  const prefersReducedMotion = useReducedMotion();
  const entranceDelay = prefersReducedMotion ? 0 : 0.68;
  useRouteMetadata(routeMetadata.home);

  return (
    <S.Page>
      <S.Hero data-home-section="hero" aria-labelledby="hero-title">
        <S.HeroBackdrop aria-hidden="true" />
        {!prefersReducedMotion && (
          <S.BrandEntrance aria-hidden="true">
            <S.BrandEntranceIdentity>
              <img src="/brands/logo-offwhiote.svg" alt="" />
              <span>Repage</span>
            </S.BrandEntranceIdentity>
            <S.BrandEntranceLine />
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
                <PrimaryCta as={Link} to={heroContent.primaryCta.href}>
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
