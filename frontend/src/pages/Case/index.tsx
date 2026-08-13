import { ArrowLeft, ArrowRight, ExternalLink, Monitor, Smartphone } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useRef } from 'react';
import type { ReactNode } from 'react';
import { getCaseMetadata, routeMetadata, useRouteMetadata } from '../../app/routeMetadata';
import { PrimaryCta } from '../../components/PrimaryCta';
import { EditorialInkBackdrop } from '../../components/EditorialInkBackdrop';
import { ProjectBrowserFrame } from '../../components/ProjectBrowserFrame';
import { ProjectPhoneFrame } from '../../components/ProjectPhoneFrame';
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

  return <CaseExperience key={project.slug} project={project} neighbors={neighbors} />;
}

type CaseExperienceProps = {
  project: NonNullable<ReturnType<typeof findPublicProjectBySlug>>;
  neighbors: ReturnType<typeof findPublicProjectNeighbors>;
};

function CaseExperience({ project, neighbors }: CaseExperienceProps) {
  return (
    <S.Page>
      <CaseIntro project={project} />
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

        <CaseGallery project={project} />

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

type CaseGalleryProps = {
  project: NonNullable<ReturnType<typeof findPublicProjectBySlug>>;
};

function CaseGallery({ project }: CaseGalleryProps) {
  const readiness = findReadinessBySlug(project.slug);
  const assets = project.media.gallery.map((path) => readiness?.assets.find((asset) => asset.path === path));

  if (assets.some((asset) => !asset || asset.kind !== 'screenshot')) {
    throw new Error(`Galeria pública inválida no manifesto: ${project.slug}.`);
  }

  const galleryAssets = assets as NonNullable<typeof assets[number]>[];
  const desktopAssets = galleryAssets.filter((asset) => asset.roles.includes('desktop'));
  const mobileAssets = galleryAssets.filter((asset) => asset.roles.includes('mobile'));

  if (!desktopAssets.length && !mobileAssets.length) return null;

  return (
    <S.Gallery aria-labelledby="case-gallery-title">
      <S.GalleryEyebrow>Prova visual</S.GalleryEyebrow>
      <S.GalleryTitle id="case-gallery-title">O trabalho em uso.</S.GalleryTitle>
      {desktopAssets.length ? <GalleryGroup label="DESKTOP" assets={desktopAssets} /> : null}
      {mobileAssets.length ? <GalleryGroup label="MOBILE" assets={mobileAssets} /> : null}
    </S.Gallery>
  );
}

function GalleryGroup({ label, assets }: { label: 'DESKTOP' | 'MOBILE'; assets: readonly NonNullable<ReturnType<typeof findReadinessBySlug>>['assets'][number][] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reveal = useEditorialReveal(ref);

  return (
    <S.GalleryGroup data-gallery-group={label} ref={ref} style={reveal.prefersReducedMotion ? undefined : reveal.style}>
      <S.GalleryLabel>
        {label === 'DESKTOP' ? <Monitor size={14} strokeWidth={1.8} aria-hidden="true" /> : <Smartphone size={14} strokeWidth={1.8} aria-hidden="true" />}
        {label}
      </S.GalleryLabel>
      <S.GalleryGrid $variant={label === 'MOBILE' ? 'mobile' : 'desktop'}>
        {assets.map((asset) => (
          <S.GalleryFigure key={asset.path} $variant={label === 'MOBILE' ? 'mobile' : 'desktop'}>
            {asset.roles.includes('mobile') ? (
              <ProjectPhoneFrame src={asset.path} alt={asset.alt} width={asset.width} height={asset.height} />
            ) : (
              <ProjectBrowserFrame src={asset.path} alt={asset.alt} width={asset.width} height={asset.height} listing gallery />
            )}
            <S.GalleryCaption>{asset.description}</S.GalleryCaption>
          </S.GalleryFigure>
        ))}
      </S.GalleryGrid>
    </S.GalleryGroup>
  );
}

type CaseIntroProps = {
  project: NonNullable<ReturnType<typeof findPublicProjectBySlug>>;
};

function CaseIntro({ project }: CaseIntroProps) {
  const introRef = useRef<HTMLDivElement>(null);
  const reveal = useTitleReveal(introRef, { trigger: 'mount' });

  return (
    <S.Intro>
      <EditorialInkBackdrop compact />
      <S.IntroInner ref={introRef}>
        <S.BackLink to="/portfolio"><ArrowLeft size={16} aria-hidden="true" /> Voltar ao portfólio</S.BackLink>
        <S.IntroMain>
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
        </S.IntroMain>
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
