import { ArrowLeft, ArrowRight, ExternalLink, Monitor, Smartphone } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { getCaseMetadata, routeMetadata, useRouteMetadata } from '../../app/routeMetadata';
import { siteConfig } from '../../config/site';
import { PrimaryCta } from '../../components/PrimaryCta';
import { EditorialInkBackdrop } from '../../components/EditorialInkBackdrop';
import { ProjectBrowserFrame } from '../../components/ProjectBrowserFrame';
import { ProjectPhoneFrame } from '../../components/ProjectPhoneFrame';
import { useEditorialReveal } from '../../components/EditorialMotion/useEditorialReveal';
import { useTitleReveal } from '../../components/TitleReveal/useTitleReveal';
import { findPublicProjectNeighbors, findPublicProjectBySlug } from '../../data/projects/publication';
import { findReadinessBySlug } from '../../data/projects/projectReadiness';
import { resolveCaseGallery } from '../../data/projects/caseGallery';
import type { ProjectMediaAsset } from '../../data/projects/projectReadiness';
import { ANALYTICS_EVENT_NAMES, trackEvent } from '../../services/analytics';
import { useConsent } from '../../features/consent/useConsent';
import * as S from './styles';

export function CasePage() {
  const { slug = '' } = useParams();
  const project = findPublicProjectBySlug(slug);
  const readiness = project ? findReadinessBySlug(project.slug) : undefined;
  const cover = project && readiness?.assets.find((asset) => asset.path === project.media.cover);
  useRouteMetadata(project
    ? getCaseMetadata(project.routeMetadata, {
      path: `/portfolio/${project.slug}`,
      ...(cover?.kind === 'screenshot' ? {
        socialImage: { url: `${siteConfig.canonicalOrigin}${cover.path}`, width: cover.width, height: cover.height, alt: cover.alt },
      } : {}),
    })
    : routeMetadata.notFound);

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
  const { preference } = useConsent();

  useEffect(() => {
    if (preference.analytics) trackEvent(ANALYTICS_EVENT_NAMES.caseView, { project_slug: project.slug });
  }, [preference.analytics, project.slug]);

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
  if (!readiness) throw new Error(`Galeria pública sem readiness: ${project.slug}.`);
  const { desktop: desktopAssets, mobile: mobileAssets } = resolveCaseGallery(project, readiness);
  const viewerAssets = [...desktopAssets, ...mobileAssets];
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  if (!desktopAssets.length && !mobileAssets.length) return null;

  return (
    <S.Gallery aria-labelledby="case-gallery-title">
      <S.GalleryEyebrow>Prova visual</S.GalleryEyebrow>
      <S.GalleryTitle id="case-gallery-title">O trabalho em uso.</S.GalleryTitle>
      {desktopAssets.length ? <GalleryGroup label="DESKTOP" assets={desktopAssets} onOpen={(asset, trigger) => { triggerRef.current = trigger; setViewerIndex(viewerAssets.findIndex((candidate) => candidate.path === asset.path)); }} /> : null}
      {mobileAssets.length ? <GalleryGroup label="MOBILE" assets={mobileAssets} onOpen={(asset, trigger) => { triggerRef.current = trigger; setViewerIndex(viewerAssets.findIndex((candidate) => candidate.path === asset.path)); }} /> : null}
      {viewerIndex !== null ? <MediaViewer assets={viewerAssets} index={viewerIndex} onClose={() => { setViewerIndex(null); requestAnimationFrame(() => triggerRef.current?.focus()); }} onChange={setViewerIndex} /> : null}
    </S.Gallery>
  );
}

function GalleryGroup({ label, assets, onOpen }: { label: 'DESKTOP' | 'MOBILE'; assets: readonly ProjectMediaAsset[]; onOpen: (asset: ProjectMediaAsset, trigger: HTMLElement) => void }) {
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
            {asset.kind === 'screenshot' ? (
              <S.GalleryTrigger type="button" aria-label={`Ampliar: ${asset.alt}`} onClick={(event) => onOpen(asset, event.currentTarget)}>
                {asset.roles.includes('mobile') ? (
                  <ProjectPhoneFrame src={asset.path} alt={asset.alt} width={asset.width} height={asset.height} />
                ) : (
                  <ProjectBrowserFrame src={asset.path} alt={asset.alt} width={asset.width} height={asset.height} listing gallery />
                )}
              </S.GalleryTrigger>
            ) : asset.roles.includes('mobile') ? (
              <ProjectPhoneFrame src={asset.path} alt={asset.alt} width={asset.width} height={asset.height} kind="video" poster={asset.posterPath} fallbackSrc={asset.fallbackPath} onExpand={(event) => onOpen(asset, event.currentTarget)} expandLabel="Abrir vídeo no viewer" />
            ) : (
              <ProjectBrowserFrame src={asset.path} alt={asset.alt} width={asset.width} height={asset.height} listing gallery kind="video" poster={asset.posterPath} fallbackSrc={asset.fallbackPath} onExpand={(event) => onOpen(asset, event.currentTarget)} expandLabel="Abrir vídeo no viewer" />
            )}
            <S.GalleryCaption>{asset.description}</S.GalleryCaption>
          </S.GalleryFigure>
        ))}
      </S.GalleryGrid>
    </S.GalleryGroup>
  );
}

function MediaViewer({ assets, index, onClose, onChange }: { assets: readonly ProjectMediaAsset[]; index: number; onClose: () => void; onChange: (index: number) => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const mediaRef = useRef<HTMLVideoElement>(null);
  const [failedVideoIndex, setFailedVideoIndex] = useState<number | null>(null);
  const pauseCurrentVideo = useCallback(() => mediaRef.current?.pause(), []);
  const changeMedia = useCallback((nextIndex: number) => { pauseCurrentVideo(); onChange(nextIndex); }, [onChange, pauseCurrentVideo]);
  const closeViewer = useCallback(() => { pauseCurrentVideo(); onClose(); }, [onClose, pauseCurrentVideo]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const activeVideo = mediaRef.current;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeViewer();
      if (event.key === 'ArrowLeft' && index > 0) changeMedia(index - 1);
      if (event.key === 'ArrowRight' && index < assets.length - 1) changeMedia(index + 1);
      if (event.key === 'Tab') {
        const focusable = [...document.querySelectorAll<HTMLButtonElement>('[role="dialog"] button:not(:disabled)')];
        const currentIndex = focusable.indexOf(document.activeElement as HTMLButtonElement);
        const nextIndex = currentIndex === -1 ? 0 : (currentIndex + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length;
        event.preventDefault();
        focusable[nextIndex]?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => { activeVideo?.pause(); document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', onKeyDown); };
  }, [index, changeMedia, closeViewer, assets.length]);

  const asset = assets[index];
  const isVideo = asset.kind === 'video';
  return (
    <S.Viewer role="dialog" aria-modal="true" aria-labelledby="case-viewer-title">
      <S.ViewerPanel>
        <S.ViewerToolbar>
          <span id="case-viewer-title">{asset.alt}</span>
          <S.ViewerControls>
            <S.ViewerButton type="button" onClick={() => changeMedia(index - 1)} disabled={index === 0} aria-label="Mídia anterior"><ArrowLeft size={18} aria-hidden="true" /></S.ViewerButton>
            <S.ViewerButton type="button" onClick={() => changeMedia(index + 1)} disabled={index === assets.length - 1} aria-label="Próxima mídia"><ArrowRight size={18} aria-hidden="true" /></S.ViewerButton>
            <S.ViewerButton ref={closeRef} type="button" onClick={closeViewer}>Fechar</S.ViewerButton>
          </S.ViewerControls>
        </S.ViewerToolbar>
        <S.ViewerImageWrap>
          {isVideo && failedVideoIndex !== index ? (
            <S.ViewerVideo ref={mediaRef} src={asset.path} poster={asset.posterPath} controls playsInline preload="none" aria-label={asset.alt} onError={() => setFailedVideoIndex(index)} />
          ) : (
            <S.ViewerImage src={isVideo ? asset.fallbackPath : asset.path} alt={asset.alt} />
          )}
        </S.ViewerImageWrap>
        <S.ViewerCaption>{asset.description} · {index + 1} de {assets.length}</S.ViewerCaption>
      </S.ViewerPanel>
    </S.Viewer>
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
              onClick={() => trackEvent(ANALYTICS_EVENT_NAMES.externalProjectClick, { project_slug: project.slug })}
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
      <PrimaryCta
        as={Link}
        to="/#contato"
        onClick={() => trackEvent(ANALYTICS_EVENT_NAMES.quoteCtaClick, { context: 'case' })}
      >Solicitar orçamento <ArrowRight size={18} aria-hidden="true" /></PrimaryCta>
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
