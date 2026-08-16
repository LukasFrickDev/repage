import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { routeMetadata, useRouteMetadata } from '../../app/routeMetadata';
import { useEffect } from 'react';
import { ANALYTICS_EVENT_NAMES, trackEvent } from '../../services/analytics';
import { useConsent } from '../../features/consent/useConsent';
import { listPublicProjects } from '../../data/projects/publication';
import { findReadinessBySlug } from '../../data/projects/projectReadiness';
import { ProjectBrowserFrame } from '../../components/ProjectBrowserFrame';
import { ProjectCaseLink } from '../../components/ProjectCaseLink';
import { PrimaryCta } from '../../components/PrimaryCta';
import { EditorialInkBackdrop } from '../../components/EditorialInkBackdrop';
import { useTitleReveal } from '../../components/TitleReveal/useTitleReveal';
import { useEditorialReveal } from '../../components/EditorialMotion/useEditorialReveal';
import { editorialMotion } from '../../styles/editorialMotion';
import * as S from './styles';

export function PortfolioPage() {
  useRouteMetadata(routeMetadata.portfolio);
  const { preference } = useConsent();

  useEffect(() => {
    if (preference.analytics) trackEvent(ANALYTICS_EVENT_NAMES.portfolioView);
  }, [preference.analytics]);

  const projects = listPublicProjects();
  const introRef = useRef<HTMLDivElement>(null);
  const titleReveal = useTitleReveal(introRef, {
    trigger: 'mount',
    firstRange: [...editorialMotion.entry.threePole.first],
    secondRange: [...editorialMotion.entry.threePole.second],
    thirdRange: [...editorialMotion.entry.threePole.third],
    supportRange: [...editorialMotion.entry.threePole.support],
  });

  return (
    <S.Page aria-labelledby="portfolio-title">
      <S.Intro>
        <EditorialInkBackdrop />
        <S.IntroInner ref={introRef}>
          <S.Eyebrow style={titleReveal.prefersReducedMotion ? undefined : titleReveal.eyebrow}>Portfólio</S.Eyebrow>
          <S.Title id="portfolio-title" data-route-heading tabIndex={-1}>
            <S.TitlePole style={titleReveal.prefersReducedMotion ? undefined : titleReveal.first}>
              <S.TitlePoleText style={titleReveal.prefersReducedMotion ? undefined : titleReveal.firstText}>Projetos reais</S.TitlePoleText>
            </S.TitlePole>
            <S.TitlePole style={titleReveal.prefersReducedMotion ? undefined : titleReveal.second}>
              <S.TitlePoleText style={titleReveal.prefersReducedMotion ? undefined : titleReveal.secondText}>para contextos</S.TitlePoleText>
            </S.TitlePole>
            <S.TitlePole style={titleReveal.prefersReducedMotion ? undefined : titleReveal.third}>
              <S.TitlePoleText style={titleReveal.prefersReducedMotion ? undefined : titleReveal.thirdText}>diferentes.</S.TitlePoleText>
            </S.TitlePole>
          </S.Title>
          <S.IntroDescription style={titleReveal.prefersReducedMotion ? undefined : titleReveal.description}>
            Sites institucionais, e-commerce, landing pages e aplicações web que mostram diferentes formas de combinar estrutura, design e desenvolvimento.
          </S.IntroDescription>
        </S.IntroInner>
      </S.Intro>

      <S.Collection aria-label="Projetos do portfólio">
        <S.CollectionHeader>
          <S.CollectionKicker>Uma seleção de trabalhos</S.CollectionKicker>
          <S.CollectionRule aria-hidden="true" />
          <S.CollectionCount>06 projetos</S.CollectionCount>
        </S.CollectionHeader>
        <S.ProjectList>
          {projects.map((project, index) => <PortfolioProject key={project.slug} project={project} index={index} />)}
        </S.ProjectList>
        <S.CollectionFooter>
          <S.FooterNote>Estratégia, direção visual e desenvolvimento conduzidos de perto.</S.FooterNote>
          <PrimaryCta
            as={Link}
            to="/#contato"
            onClick={() => trackEvent(ANALYTICS_EVENT_NAMES.quoteCtaClick, { context: 'portfolio' })}
          >
            Solicitar orçamento
            <ArrowRight size={18} aria-hidden="true" />
          </PrimaryCta>
        </S.CollectionFooter>
      </S.Collection>
    </S.Page>
  );
}

type PortfolioProjectProps = {
  project: ReturnType<typeof listPublicProjects>[number];
  index: number;
};

function PortfolioProject({ project, index }: PortfolioProjectProps) {
  const projectRef = useRef<HTMLLIElement>(null);
  const reveal = useEditorialReveal(projectRef);
  const readiness = findReadinessBySlug(project.slug);
  const cover = readiness?.assets.find((asset) => asset.path === project.media.cover);

  if (!cover || cover.kind !== 'screenshot' || !cover.roles.includes('cover')) {
    throw new Error(`Projeto público sem cover no manifesto: ${project.slug}.`);
  }

  return (
    <S.ProjectItem ref={projectRef} style={reveal.prefersReducedMotion ? undefined : reveal.style}>
      <S.ProjectMeta>
        <S.ProjectIndex aria-hidden="true">0{index + 1}</S.ProjectIndex>
        <S.ProjectType>{project.projectType}</S.ProjectType>
      </S.ProjectMeta>
      <S.ProjectMediaLink to={`/portfolio/${project.slug}`} aria-label={`Ver case ${project.title}`}>
        <ProjectBrowserFrame
          src={cover.path}
          alt={cover.alt}
          width={cover.width}
          height={cover.height}
          loading={index < 2 ? 'eager' : 'lazy'}
          listing
        />
      </S.ProjectMediaLink>
      <S.ProjectInfo>
        <S.ProjectTitle>{project.title}</S.ProjectTitle>
        <S.ProjectSummary>{project.summary}</S.ProjectSummary>
        <S.ProjectDetails>{project.services.slice(0, 3).join(' · ')}</S.ProjectDetails>
        <ProjectCaseLink to={`/portfolio/${project.slug}`} ariaLabel={`Ver case ${project.title}`} />
      </S.ProjectInfo>
    </S.ProjectItem>
  );
}
