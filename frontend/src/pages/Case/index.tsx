import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { useMotionValueEvent } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { getCaseMetadata, routeMetadata, useRouteMetadata } from '../../app/routeMetadata';
import { PrimaryCta } from '../../components/PrimaryCta';
import { ProjectBrowserFrame } from '../../components/ProjectBrowserFrame';
import { useEditorialReveal } from '../../components/EditorialMotion/useEditorialReveal';
import { useTitleReveal } from '../../components/TitleReveal/useTitleReveal';
import { findPublicProjectNeighbors, findPublicProjectBySlug } from '../../data/projects/publication';
import { findReadinessBySlug } from '../../data/projects/projectReadiness';
import * as S from './styles';

export function CasePage() {
  const { slug = '' } = useParams();
  const project = findPublicProjectBySlug(slug);
  useRouteMetadata(project ? getCaseMetadata(project.routeMetadata) : routeMetadata.notFound);

  if (!project) {
    return (
      <S.NotFoundPage aria-labelledby="not-found-title">
        <S.NotFoundInner>
          <S.Eyebrow>Erro 404</S.Eyebrow>
          <S.Title id="not-found-title" data-route-heading tabIndex={-1}>Projeto não encontrado.</S.Title>
          <S.Lead>O endereço informado não corresponde a um projeto registrado.</S.Lead>
          <S.TextLink to="/portfolio">Ver portfólio</S.TextLink>
        </S.NotFoundInner>
      </S.NotFoundPage>
    );
  }

  const readiness = findReadinessBySlug(project.slug);
  const cover = readiness?.assets.find((asset) => asset.path === project.media.cover);
  const neighbors = findPublicProjectNeighbors(project.slug);

  if (!cover || cover.kind !== 'screenshot' || !cover.roles.includes('cover')) {
    throw new Error(`Case público sem cover no manifesto: ${project.slug}.`);
  }

  return <CaseExperience key={project.slug} project={project} cover={cover} neighbors={neighbors} />;
}

type CaseExperienceProps = {
  project: NonNullable<ReturnType<typeof findPublicProjectBySlug>>;
  cover: NonNullable<ReturnType<typeof findReadinessBySlug>>['assets'][number];
  neighbors: ReturnType<typeof findPublicProjectNeighbors>;
};

function CaseExperience({ project, cover, neighbors }: CaseExperienceProps) {
  return (
    <S.Page>
      <CaseIntro project={project} cover={cover} />
      <S.Body>
        <CaseChapter eyebrow="Visão e problema" title="O que precisava ser organizado.">
          <S.FeaturedCopy>{project.overview}</S.FeaturedCopy>
          <S.CopyPair>
            <S.CopyBlock><S.BlockTitle>Contexto</S.BlockTitle><S.CopyBlockText>{project.context}</S.CopyBlockText></S.CopyBlock>
            <S.CopyBlock><S.BlockTitle>Desafio</S.BlockTitle><S.CopyBlockText>{project.challenge}</S.CopyBlockText></S.CopyBlock>
          </S.CopyPair>
        </CaseChapter>

        <CaseChapter eyebrow="Construção" title="Estrutura, direção e desenvolvimento em conjunto.">
          <S.FeaturedCopy>{project.solution}</S.FeaturedCopy>
          <S.CopyPair>
            <S.CopyBlock><S.BlockTitle>Participação</S.BlockTitle><S.CopyBlockText>{project.participation}</S.CopyBlockText></S.CopyBlock>
            <ListBlock title="Serviços e capacidades" items={project.services} bordered={false} />
          </S.CopyPair>
        </CaseChapter>

        <CaseChapter eyebrow="O que foi entregue" title="Uma experiência construída para o contexto." compactAfter>
          <S.DeliveryColumns>
            <S.DeliveryColumn>
              <ListBlock title="Funcionalidades" items={project.capabilities} bordered={false} />
              {project.decisions?.length ? <ListBlock title="Decisões relevantes" items={project.decisions} bordered={false} /> : null}
            </S.DeliveryColumn>
            <S.DeliveryColumn>
              <ListBlock title="Tecnologias" items={project.technologies} subdued bordered={false} />
            </S.DeliveryColumn>
          </S.DeliveryColumns>
        </CaseChapter>

        <CaseClosing neighbors={neighbors} />
      </S.Body>
    </S.Page>
  );
}

type CaseIntroProps = {
  project: NonNullable<ReturnType<typeof findPublicProjectBySlug>>;
  cover: NonNullable<ReturnType<typeof findReadinessBySlug>>['assets'][number];
};

function CaseIntro({ project, cover }: CaseIntroProps) {
  const introRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLAnchorElement>(null);
  const reveal = useTitleReveal(introRef, { trigger: 'mount' });
  const [introTextReady, setIntroTextReady] = useState(reveal.prefersReducedMotion);
  const mediaReveal = useEditorialReveal(mediaRef, 'media', { trigger: 'route', start: introTextReady });

  useMotionValueEvent(reveal.description.opacity, 'change', (value) => {
    if (value >= 0.99) setIntroTextReady(true);
  });

  return (
    <S.Intro>
      <S.IntroInner ref={introRef}>
        <S.BackLink to="/portfolio"><ArrowLeft size={16} aria-hidden="true" /> Voltar ao portfólio</S.BackLink>
        <S.IntroMeta style={reveal.prefersReducedMotion ? undefined : reveal.eyebrow}>
          <span>Case</span>
          <span>{project.projectType}</span>
        </S.IntroMeta>
        <S.Title id="case-title" data-route-heading tabIndex={-1}>
          <S.TitlePole style={reveal.prefersReducedMotion ? undefined : reveal.first}>
            <S.TitlePoleText style={reveal.prefersReducedMotion ? undefined : reveal.firstText}>{project.title}</S.TitlePoleText>
          </S.TitlePole>
        </S.Title>
        <S.Lead style={reveal.prefersReducedMotion ? undefined : reveal.description}>{project.summary}</S.Lead>
        <S.Participation style={reveal.prefersReducedMotion ? undefined : reveal.description}>{project.participation}</S.Participation>
        {project.publicUrl ? (
          <S.ExternalLink
            style={reveal.prefersReducedMotion ? undefined : reveal.description}
            href={project.publicUrl}
            target="_blank"
            rel="noreferrer"
          >
            Ver projeto publicado <ExternalLink size={16} aria-hidden="true" />
          </S.ExternalLink>
        ) : null}
        <S.CoverLink
          ref={mediaRef}
          style={mediaReveal.prefersReducedMotion ? undefined : {
            ...mediaReveal.style,
          }}
          to={`/portfolio/${project.slug}`}
          aria-label={`Mídia principal de ${project.title}`}
        >
          <ProjectBrowserFrame src={cover.path} alt={cover.alt} width={cover.width} height={cover.height} listing />
        </S.CoverLink>
      </S.IntroInner>
    </S.Intro>
  );
}

function CaseChapter({ eyebrow, title, children, compactAfter = false }: { eyebrow: string; title: string; children: ReactNode; compactAfter?: boolean }) {
  const chapterRef = useRef<HTMLElement>(null);
  const reveal = useEditorialReveal(chapterRef);

  return (
    <S.Chapter $compactAfter={compactAfter} ref={chapterRef} style={reveal.prefersReducedMotion ? undefined : reveal.style}>
      <S.ChapterEyebrow>{eyebrow}</S.ChapterEyebrow>
      <S.ChapterTitle>{title}</S.ChapterTitle>
      {children}
    </S.Chapter>
  );
}

function CaseClosing({ neighbors }: { neighbors: ReturnType<typeof findPublicProjectNeighbors> }) {
  return (
    <S.Closing>
      <S.ClosingEyebrow>Tem um projeto em mente?</S.ClosingEyebrow>
      <S.ClosingTitle>Vamos conversar sobre o que sua próxima página precisa resolver.</S.ClosingTitle>
      <PrimaryCta as={Link} to="/#contato">Solicitar orçamento <ArrowRight size={18} aria-hidden="true" /></PrimaryCta>
      <S.NeighborNav aria-label="Navegação entre cases">
        <S.ReturnLink to="/portfolio">Voltar ao portfólio</S.ReturnLink>
        {neighbors.previous ? <S.NeighborLink to={`/portfolio/${neighbors.previous.slug}`}><ArrowLeft size={16} aria-hidden="true" /> {neighbors.previous.title}</S.NeighborLink> : null}
        {neighbors.next ? <S.NeighborLink to={`/portfolio/${neighbors.next.slug}`}>{neighbors.next.title} <ArrowRight size={16} aria-hidden="true" /></S.NeighborLink> : null}
      </S.NeighborNav>
    </S.Closing>
  );
}

function ListBlock({ title, items, subdued = false, bordered = true }: { title: string; items: readonly string[]; subdued?: boolean; bordered?: boolean }) {
  return (
    <S.ListBlock $subdued={subdued}>
      <S.BlockTitle $bordered={bordered}>{title}</S.BlockTitle>
      <S.ItemList>{items.map((item) => <li key={item}>{item}</li>)}</S.ItemList>
    </S.ListBlock>
  );
}
