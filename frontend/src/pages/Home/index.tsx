import { ArrowRight } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { routeMetadata, useRouteMetadata } from '../../app/routeMetadata';
import { FeaturedProjectsSection } from '../../components/FeaturedProjectsSection';
import { FinalCtaSection } from '../../components/FinalCtaSection';
import { PageExperience } from '../../components/PageExperience';
import { ProcessSection } from '../../components/ProcessSection';
import { ServicesSection } from '../../components/ServicesSection';
import { SignatureSection } from '../../components/SignatureSection';
import { heroContent } from '../../content/repageContent';
import * as S from './styles';

const Home = () => {
  const prefersReducedMotion = useReducedMotion();
  useRouteMetadata(routeMetadata.home);

  return (
    <S.Page>
      <S.Hero aria-labelledby="hero-title">
        <S.HeroBackdrop aria-hidden="true" />
        <S.HeroInner>
          <S.Copy>
            <S.Eyebrow
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              {heroContent.eyebrow}
            </S.Eyebrow>
            <S.Title
              id="hero-title"
              data-route-heading
              tabIndex={-1}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.58, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
            >
              {heroContent.title}
            </S.Title>
            <S.Details
              initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.58, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <S.Description>{heroContent.description}</S.Description>
              <S.Actions>
                <S.PrimaryCta as={Link} to={heroContent.primaryCta.href}>
                  <span>{heroContent.primaryCta.label}</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </S.PrimaryCta>
                <S.SecondaryCta as={Link} to={heroContent.secondaryCta.href}>
                  <span>{heroContent.secondaryCta.label}</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </S.SecondaryCta>
              </S.Actions>
            </S.Details>
          </S.Copy>

          <S.Visual>
            <PageExperience />
          </S.Visual>
        </S.HeroInner>
      </S.Hero>
      <ServicesSection />
      <FeaturedProjectsSection />
      <ProcessSection />
      <SignatureSection />
      <FinalCtaSection />
    </S.Page>
  );
};

export default Home;
