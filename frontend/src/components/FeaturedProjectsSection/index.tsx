import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { ArrowRight } from 'lucide-react';
import {
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { Link } from 'react-router-dom';
import { featuredProjectsSectionContent } from '../../content/repageContent';
import { useHydrationSafeReducedMotion } from '../../hooks/useHydrationSafeReducedMotion';
import { ProjectBrowserFrame } from '../ProjectBrowserFrame';
import { ProjectCaseLink } from '../ProjectCaseLink';
import type { Project } from '../../data/projects';
import { listHomepageFeaturedProjects } from '../../data/projects/homepage';
import type { ProjectMediaAsset } from '../../data/projects/projectReadiness';
import * as S from './styles';

type StageWindow = {
  start: number;
  settle: number;
  exitStart?: number;
  end: number;
};

type ProjectStageProps = {
  project: Project;
  desktop: ProjectMediaAsset;
  mobile: ProjectMediaAsset;
  summary: string;
  progress: MotionValue<number>;
  window: StageWindow;
  isActive: boolean;
  isStatic: boolean;
  loading: 'eager' | 'lazy';
  mediaEnabled: boolean;
};

const handoffTiming = {
  overlapLead: 0.02,
  duration: 0.12,
} as const;

const echoHandoff = 0.32;
const axiumHandoff = 0.58;

const stageWindows: readonly StageWindow[] = [
  { start: 0.13, settle: 0.205, exitStart: echoHandoff, end: echoHandoff + handoffTiming.duration },
  {
    start: echoHandoff - handoffTiming.overlapLead,
    settle: echoHandoff + handoffTiming.duration,
    exitStart: axiumHandoff,
    end: axiumHandoff + handoffTiming.duration,
  },
  {
    start: axiumHandoff - handoffTiming.overlapLead,
    settle: axiumHandoff + handoffTiming.duration,
    end: 1,
  },
];

function useProjectStageMotion(progress: MotionValue<number>, window: StageWindow) {
  const hasExit = window.exitStart !== undefined;
  const input = hasExit
    ? [window.start, window.settle, window.exitStart as number, window.end]
    : [window.start, window.settle, window.end];

  return {
    opacity: useTransform(progress, input, hasExit ? [0, 1, 1, 0] : [0, 1, 1]),
    layerX: useTransform(progress, input, hasExit ? [0, 0, 0, 0] : [0, 0, 0]),
    mediaScale: useTransform(progress, input, hasExit ? [0.95, 1, 1, 0.975] : [0.95, 1, 1]),
    mediaY: useTransform(progress, input, hasExit ? [30, 0, 0, -20] : [30, 0, 0]),
    infoOpacity: useTransform(progress, input, hasExit ? [0, 1, 1, 0] : [0, 1, 1]),
    infoY: useTransform(progress, input, hasExit ? [0, 0, 0, 0] : [0, 0, 0]),
  };
}

function ProjectStage({
  project,
  desktop,
  mobile,
  summary,
  progress,
  window,
  isActive,
  isStatic,
  loading,
  mediaEnabled,
}: ProjectStageProps) {
  const [desktopLoaded, setDesktopLoaded] = useState(false);
  const [mobileLoaded, setMobileLoaded] = useState(false);
  const desktopImageRef = useRef<HTMLImageElement>(null);
  const mobileImageRef = useRef<HTMLImageElement>(null);
  const stageMotion = useProjectStageMotion(progress, window);
  const mediaReady = mediaEnabled && desktopLoaded && mobileLoaded;
  const layerStyle = isStatic
    ? { opacity: mediaReady ? 1 : 0, x: 0 }
    : { opacity: mediaReady ? stageMotion.opacity : 0, x: stageMotion.layerX };
  const infoStyle = isStatic
    ? { opacity: mediaReady ? 1 : 0, y: 0 }
    : { opacity: mediaReady ? stageMotion.infoOpacity : 0, y: stageMotion.infoY };
  const mediaStyle = isStatic ? { scale: 1, y: 0 } : { scale: stageMotion.mediaScale, y: stageMotion.mediaY };
  const canInteract = mediaReady && (isStatic || isActive);

  useEffect(() => {
    if (!mediaEnabled) return;

    const desktopImage = desktopImageRef.current;
    const mobileImage = mobileImageRef.current;

    // complete + naturalWidth === 0 is a concluded failure; onError already
    // treats that case as degraded readiness, so it must not stay invisible.
    if (desktopImage?.complete) setDesktopLoaded(true);
    if (mobileImage?.complete) setMobileLoaded(true);
  }, [mediaEnabled]);

  return (
    <S.ProjectLayer
      $active={canInteract}
      $static={isStatic}
      data-project-media-ready={mediaReady}
      style={layerStyle}
      aria-hidden={!canInteract}
    >
      <S.ProjectMedia style={mediaStyle}>
        <S.ProjectMediaLink
          to={`/portfolio/${project.slug}`}
          aria-label={`Ver case ${project.title}`}
          tabIndex={canInteract ? undefined : -1}
        >
          {mediaEnabled && (
            <ProjectBrowserFrame
              src={desktop.path}
              alt={desktop.alt}
              width={desktop.width}
              height={desktop.height}
              loading={loading}
              imageRef={desktopImageRef}
              onLoad={() => setDesktopLoaded(true)}
              onError={() => setDesktopLoaded(true)}
            />
          )}
          <S.DeviceFrame>
            <S.DeviceViewport>
              {mediaEnabled && (
                <S.MobileImage
                  src={mobile.path}
                  alt={mobile.alt}
                  width={mobile.width}
                  height={mobile.height}
                  loading={loading}
                  ref={mobileImageRef}
                  onLoad={() => setMobileLoaded(true)}
                  onError={() => setMobileLoaded(true)}
                />
              )}
            </S.DeviceViewport>
          </S.DeviceFrame>
        </S.ProjectMediaLink>
      </S.ProjectMedia>

      <S.ProjectInfo style={infoStyle}>
        <S.ProjectTitle>{project.title}</S.ProjectTitle>
        <S.ProjectSummary>{summary}</S.ProjectSummary>
        <ProjectCaseLink
          to={`/portfolio/${project.slug}`}
          ariaLabel={`Ver case ${project.title}`}
          tabIndex={canInteract ? undefined : -1}
          homepage
        />
        {!isStatic && (
          <S.ProjectAllProjectsLink
            as={Link}
            to={featuredProjectsSectionContent.allProjectsCta.href}
            tabIndex={canInteract ? undefined : -1}
          >
            {featuredProjectsSectionContent.allProjectsCta.label}
            <ArrowRight size={18} aria-hidden="true" />
          </S.ProjectAllProjectsLink>
        )}
      </S.ProjectInfo>
      {!isStatic && (
        <S.MobileAllProjectsLink
          as={Link}
          to={featuredProjectsSectionContent.allProjectsCta.href}
          tabIndex={canInteract ? undefined : -1}
        >
          {featuredProjectsSectionContent.allProjectsCta.label}
          <ArrowRight size={18} aria-hidden="true" />
        </S.MobileAllProjectsLink>
      )}
    </S.ProjectLayer>
  );
}

function getActiveProject(progress: number): number {
  if (progress < 0.12) return -1;
  if (progress < 0.37) return 0;
  if (progress < 0.63) return 1;
  return 2;
}

function usePortfolioProgress(target: RefObject<HTMLDivElement | null>) {
  const { scrollYProgress } = useScroll({
    target,
    offset: ['start start', 'end end'],
  });

  return useSpring(scrollYProgress, { stiffness: 105, damping: 26, mass: 0.42 });
}

export function FeaturedProjectsSection() {
  const prefersReducedMotion = useHydrationSafeReducedMotion();
  const [activeProject, setActiveProject] = useState(-1);
  const [enabledMediaStages, setEnabledMediaStages] = useState(() => [true, false, false]);
  const trackRef = useRef<HTMLDivElement>(null);
  const progress = usePortfolioProgress(trackRef);
  const introOpacity = useTransform(progress, [0, 0.05, 0.08, 0.14, 0.15], [1, 1, 0.96, 0.28, 0]);
  const introY = useTransform(progress, [0, 0.05, 0.08, 0.14, 0.15], [0, -2, -8, -72, -112]);
  const introScale = useTransform(progress, [0, 0.05, 0.08, 0.14, 0.15], [1, 1, 0.995, 0.98, 0.97]);
  const [echo, axium, devSchedule] = listHomepageFeaturedProjects();
  const isStatic = Boolean(prefersReducedMotion);
  const projects = [
    {
      featured: echo,
      desktop: echo.cover,
      mobile: echo.mobileProof ?? echo.cover,
    },
    {
      featured: axium,
      desktop: axium.cover,
      mobile: axium.mobileProof ?? axium.cover,
    },
    {
      featured: devSchedule,
      desktop: devSchedule.cover,
      mobile: devSchedule.mobileProof ?? devSchedule.cover,
    },
  ] as const;

  useMotionValueEvent(progress, 'change', (latest) => {
    const nextProject = getActiveProject(latest);
    setActiveProject((currentProject) => currentProject === nextProject ? currentProject : nextProject);
    setEnabledMediaStages((currentStages) => {
      const nextStages = currentStages.slice();
      let changed = false;
      stageWindows.forEach((stage, index) => {
        if (!nextStages[index] && latest >= Math.max(0, stage.start - 0.08)) {
          nextStages[index] = true;
          changed = true;
        }
      });
      return changed ? nextStages : currentStages;
    });
  });

  return (
    <S.Section id="projetos" data-home-section="projects" aria-labelledby="featured-projects-title" tabIndex={-1}>
      <S.IntroSignal aria-hidden="true" />
      <S.Container>
        <S.ProjectTrack ref={trackRef} $static={isStatic}>
          <S.StickyStage $static={isStatic} aria-label="Projetos selecionados em destaque">
            <S.StageBackdrop aria-hidden="true" />
            <S.IntroLayer
              $static={isStatic}
              style={isStatic ? { opacity: 1, y: 0, scale: 1 } : { opacity: introOpacity, y: introY, scale: introScale }}
            >
              <S.IntroContent>
                <S.Eyebrow>{featuredProjectsSectionContent.eyebrow}</S.Eyebrow>
                <S.Title id="featured-projects-title">{featuredProjectsSectionContent.title}</S.Title>
                <S.Description>{featuredProjectsSectionContent.description}</S.Description>
              </S.IntroContent>
            </S.IntroLayer>
            {projects.map(({ featured, desktop, mobile }, index) => (
              <ProjectStage
                key={featured.project.slug}
                project={featured.project}
                desktop={desktop}
                mobile={mobile}
                summary={featured.project.summary}
                progress={progress}
                window={stageWindows[index]}
                isActive={activeProject === index}
                isStatic={isStatic}
                loading={index === 0 ? 'eager' : 'lazy'}
                mediaEnabled={enabledMediaStages[index]}
              />
            ))}
            {isStatic && (
              <S.AllProjectsLink as={Link} to={featuredProjectsSectionContent.allProjectsCta.href}>
                {featuredProjectsSectionContent.allProjectsCta.label}
                <ArrowRight size={18} aria-hidden="true" />
              </S.AllProjectsLink>
            )}
          </S.StickyStage>
        </S.ProjectTrack>
      </S.Container>
    </S.Section>
  );
}
