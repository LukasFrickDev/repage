import { ArrowRight } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { FeaturedProjectsSection } from '../../components/FeaturedProjectsSection';
import { FinalCtaSection } from '../../components/FinalCtaSection';
import { HomeHeader } from '../../components/HomeHeader';
import { PageExperience } from '../../components/PageExperience';
import { ProcessSection } from '../../components/ProcessSection';
import { ServicesSection } from '../../components/ServicesSection';
import { SiteFooter } from '../../components/SiteFooter';
import { SignatureSection } from '../../components/SignatureSection';
import { heroContent } from '../../content/repageContent';
import * as S from './styles';

const Home = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <S.Page id="top">
      <HomeHeader />
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
                <S.PrimaryCta href={heroContent.primaryCta.href}>
                  <span>{heroContent.primaryCta.label}</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </S.PrimaryCta>
                <S.SecondaryCta href={heroContent.secondaryCta.href}>
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
      <SiteFooter />
    </S.Page>
  );
};

export default Home;
