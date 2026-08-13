import {
  motion,
  type MotionValue,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { type CSSProperties, useRef } from 'react';
import { processSectionContent } from '../../content/repageContent';
import { breakpoints, colors, homepageTokens } from '../../styles/theme';
import * as S from './styles';

type AnchorAlignment = 'start' | 'center' | 'end';

type JourneyPoint = {
  x: number;
  y: number;
};

type JourneyAnchor = {
  desktop: JourneyPoint & { align: AnchorAlignment; contentOffsetY: number };
  mobile: JourneyPoint;
};

type JourneyGeometry = {
  anchorOffsets: number[];
  path: string;
};

type CurveHandles = {
  from: JourneyPoint;
  to: JourneyPoint;
};

type StepRange = [number, number];

const desktopViewBox = { width: 1200, height: 620 };
const mobileViewBox = { width: 100, height: 1080 };
const phoneMarkerOffset = 50;

const journeyAnchors: JourneyAnchor[] = [
  {
    desktop: { x: 570, y: 48, align: 'end', contentOffsetY: -38 },
    mobile: { x: 12, y: 54 },
  },
  {
    desktop: { x: 635, y: 146, align: 'start', contentOffsetY: -70 },
    mobile: { x: 20, y: 220 },
  },
  {
    desktop: { x: 560, y: 306, align: 'end', contentOffsetY: -88 },
    mobile: { x: 13, y: 386 },
  },
  {
    desktop: { x: 640, y: 352, align: 'start', contentOffsetY: -68 },
    mobile: { x: 22, y: 552 },
  },
  {
    desktop: { x: 565, y: 468, align: 'end', contentOffsetY: -55 },
    mobile: { x: 12, y: 718 },
  },
  {
    desktop: { x: 632, y: 605, align: 'start', contentOffsetY: -128 },
    mobile: { x: 20, y: 900 },
  },
];

const desktopCurveHandles: CurveHandles[] = [
  { from: { x: 12, y: 34 }, to: { x: -8, y: -32 } },
  { from: { x: 4, y: 40 }, to: { x: 10, y: -42 } },
  { from: { x: 12, y: 10 }, to: { x: -18, y: -9 } },
  { from: { x: -4, y: 34 }, to: { x: 12, y: -34 } },
  { from: { x: -3, y: 40 }, to: { x: -10, y: -38 } },
];

function cubicPoint(
  start: JourneyPoint,
  controlStart: JourneyPoint,
  controlEnd: JourneyPoint,
  end: JourneyPoint,
  progress: number,
) {
  const remaining = 1 - progress;

  return {
    x: remaining ** 3 * start.x
      + 3 * remaining ** 2 * progress * controlStart.x
      + 3 * remaining * progress ** 2 * controlEnd.x
      + progress ** 3 * end.x,
    y: remaining ** 3 * start.y
      + 3 * remaining ** 2 * progress * controlStart.y
      + 3 * remaining * progress ** 2 * controlEnd.y
      + progress ** 3 * end.y,
  };
}

function createJourneyGeometry(
  points: JourneyPoint[],
  curveHandles?: CurveHandles[],
): JourneyGeometry {
  const segmentLengths: number[] = [];
  let path = `M ${points[0].x} ${points[0].y}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[Math.max(0, index - 1)];
    const start = points[index];
    const end = points[index + 1];
    const next = points[Math.min(points.length - 1, index + 2)];
    const tension = 0.16;
    const segmentHandles = curveHandles?.[index];
    const controlStart = segmentHandles
      ? {
          x: start.x + segmentHandles.from.x,
          y: start.y + segmentHandles.from.y,
        }
      : {
          x: start.x + (end.x - previous.x) * tension,
          y: start.y + (end.y - previous.y) * tension,
        };
    const controlEnd = segmentHandles
      ? {
          x: end.x + segmentHandles.to.x,
          y: end.y + segmentHandles.to.y,
        }
      : {
          x: end.x - (next.x - start.x) * tension,
          y: end.y - (next.y - start.y) * tension,
        };

    path += ` C ${controlStart.x} ${controlStart.y}, ${controlEnd.x} ${controlEnd.y}, ${end.x} ${end.y}`;

    let segmentLength = 0;
    let previousSample = start;

    for (let sample = 1; sample <= 20; sample += 1) {
      const point = cubicPoint(start, controlStart, controlEnd, end, sample / 20);
      segmentLength += Math.hypot(point.x - previousSample.x, point.y - previousSample.y);
      previousSample = point;
    }

    segmentLengths.push(segmentLength);
  }

  const totalLength = segmentLengths.reduce((total, length) => total + length, 0);
  let travelled = 0;
  const anchorOffsets = [0];

  segmentLengths.forEach((length) => {
    travelled += length;
    anchorOffsets.push(travelled / totalLength);
  });

  return { anchorOffsets, path };
}

const desktopGeometry = createJourneyGeometry(
  journeyAnchors.map(({ desktop }) => desktop),
  desktopCurveHandles,
);
const mobileGeometry = createJourneyGeometry(journeyAnchors.map(({ mobile }) => mobile));
const phoneGeometry = createJourneyGeometry(
  journeyAnchors.map(({ mobile }) => ({ x: mobile.x, y: mobile.y + phoneMarkerOffset })),
);

function createStepRanges(anchorOffsets: number[]): StepRange[] {
  const progressStart = homepageTokens.process.journeyProgressStart;
  const progressEnd = homepageTokens.process.journeyProgressEnd;

  return anchorOffsets.map((offset, index) => {
    const arrival = progressStart + offset * (progressEnd - progressStart);

    return index === 0
      ? [progressStart - 0.025, progressStart + 0.035]
      : [arrival - 0.045, arrival];
  });
}

type ProcessStepProps = {
  anchor: JourneyAnchor;
  index: number;
  progress: MotionValue<number>;
  range: StepRange;
  reducedMotion: boolean;
  step: (typeof processSectionContent.steps)[number];
};

function ProcessStep({ anchor, index, progress, range, reducedMotion, step }: ProcessStepProps) {
  const opacity = useTransform(
    progress,
    range,
    [homepageTokens.process.stepInactiveOpacity, 1],
  );
  const y = useTransform(progress, range, [homepageTokens.process.stepRevealDistance, 0]);
  const markerSettledAt = Math.min(range[1] + 0.035, 1);
  const markerScale = useTransform(progress, [range[0], range[1], markerSettledAt], [0.84, 1.08, 1]);
  const markerBackground = useTransform(progress, range, [colors.white, colors.highlight]);
  const markerBorderColor = useTransform(
    progress,
    range,
    ['rgba(108, 99, 255, 0.34)', colors.highlight],
  );
  const markerCoreOpacity = useTransform(progress, range, [0.28, 1]);
  const markerHaloOpacity = useTransform(
    progress,
    [range[0], range[1], markerSettledAt],
    [0, 0.18, 0.055],
  );
  const markerHaloScale = useTransform(
    progress,
    [range[0], range[1], markerSettledAt],
    [0.72, homepageTokens.process.markerHaloCurrentScale, homepageTokens.process.markerHaloSettledScale],
  );
  const numberOpacity = useTransform(
    progress,
    [range[0], range[1], markerSettledAt],
    [0.74, 1, 0.86],
  );
  const stepStyle = {
    '--desktop-anchor-x': `${(anchor.desktop.x / desktopViewBox.width) * 100}%`,
    '--desktop-anchor-y': `${(anchor.desktop.y / desktopViewBox.height) * 100}%`,
    '--desktop-content-offset-y': `${anchor.desktop.contentOffsetY}px`,
    '--mobile-anchor-x': `${anchor.mobile.x}%`,
    '--mobile-anchor-y': `${(anchor.mobile.y / mobileViewBox.height) * 100}%`,
  } as CSSProperties;

  return (
    <S.Step $align={anchor.desktop.align} data-align={anchor.desktop.align} style={stepStyle}>
      <S.MarkerAnchor aria-hidden="true">
        <S.MarkerHalo
          style={reducedMotion ? undefined : {
            opacity: markerHaloOpacity,
            scale: markerHaloScale,
          }}
        />
        <S.Marker
          style={reducedMotion ? undefined : {
            backgroundColor: markerBackground,
            borderColor: markerBorderColor,
            scale: markerScale,
          }}
        >
          <motion.i style={reducedMotion ? undefined : { opacity: markerCoreOpacity }} />
        </S.Marker>
      </S.MarkerAnchor>
      <S.StepDetails style={reducedMotion ? undefined : { opacity, y }}>
        <S.Number
          aria-hidden="true"
          style={reducedMotion ? undefined : { opacity: numberOpacity }}
        >
          {String(index + 1).padStart(2, '0')}
        </S.Number>
        <S.StepContent>
          <S.StepTitle>{step.title}</S.StepTitle>
          <S.StepDescription>{step.description}</S.StepDescription>
        </S.StepContent>
      </S.StepDetails>
    </S.Step>
  );
}

export function ProcessSection() {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const compactJourney = typeof window !== 'undefined'
    && window.matchMedia(`(max-width: ${breakpoints.contentMax})`).matches;
  const phoneJourney = typeof window !== 'undefined'
    && window.matchMedia(`(max-width: ${breakpoints.mobileMax})`).matches;
  const introRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: introScrollProgress } = useScroll({
    target: introRef,
    offset: ['start 88%', 'end 26%'],
  });
  const introProgress = useSpring(introScrollProgress, { stiffness: 135, damping: 31, mass: 0.28 });
  const introEyebrowOpacity = useTransform(introProgress, [0.04, 0.18], [0, 1]);
  const introEyebrowY = useTransform(introProgress, [0.04, 0.18], [8, 0]);
  const introTitleClipPath = useTransform(
    introProgress,
    [0.16, 0.44],
    ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'],
  );
  const introTitleOpacity = useTransform(introProgress, [0.16, 0.3, 0.44], [0, 0.86, 1]);
  const introTitleX = useTransform(introProgress, [0.16, 0.44], [8, 0]);
  const introDescriptionOpacity = useTransform(introProgress, [0.42, 0.64], [0, 1]);
  const introDescriptionX = useTransform(introProgress, [0.42, 0.64], [6, 0]);
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 78%', 'end 22%'],
  });
  const journeyProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.28 });
  const staticProgress = useMotionValue(1);
  const activeProgress = prefersReducedMotion ? staticProgress : journeyProgress;
  const pathLength = useTransform(
    activeProgress,
    [
      homepageTokens.process.journeyProgressStart,
      homepageTokens.process.journeyProgressEnd,
      homepageTokens.process.journeyTerminalHoldEnd,
    ],
    [0, 1, 1],
  );
  const activeGeometry = phoneJourney
    ? phoneGeometry
    : compactJourney
      ? mobileGeometry
      : desktopGeometry;
  const stepRanges = createStepRanges(activeGeometry.anchorOffsets);
  const titleSecondLineStart = processSectionContent.title.indexOf('à publicação');
  const titleLines = [
    processSectionContent.title.slice(0, titleSecondLineStart).trim(),
    processSectionContent.title.slice(titleSecondLineStart).trim(),
  ];

  return (
    <S.Section
      id="processo"
      data-home-section="process"
      aria-labelledby="process-title"
      tabIndex={-1}
    >
      <S.Container>
        <S.Heading ref={introRef}>
          <S.Eyebrow
            style={prefersReducedMotion ? undefined : {
              opacity: introEyebrowOpacity,
              y: introEyebrowY,
            }}
          >
            {processSectionContent.eyebrow}
          </S.Eyebrow>
          <S.Title
            id="process-title"
            style={prefersReducedMotion ? undefined : {
              clipPath: introTitleClipPath,
              opacity: introTitleOpacity,
              x: introTitleX,
            }}
          >
            <S.TitleLine>
              <S.TitleLineText>
                {titleLines[0]}
              </S.TitleLineText>
            </S.TitleLine>
            <S.TitleLine $offset>
              <S.TitleLineText>
                {titleLines[1]}
              </S.TitleLineText>
            </S.TitleLine>
          </S.Title>
          <S.Description
            style={prefersReducedMotion ? undefined : {
              opacity: introDescriptionOpacity,
              x: introDescriptionX,
            }}
          >
            {processSectionContent.description}
          </S.Description>
        </S.Heading>

        <S.ProcessJourneyTrack ref={trackRef}>
          <S.ProcessJourneyStage>
            <S.DesktopTrajectory
              viewBox={`0 0 ${desktopViewBox.width} ${desktopViewBox.height}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <S.BasePath d={desktopGeometry.path} />
              <S.ProgressPath d={desktopGeometry.path} style={{ pathLength }} />
            </S.DesktopTrajectory>
            <S.MobileTrajectory
              viewBox={`0 0 ${mobileViewBox.width} ${mobileViewBox.height}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <S.BasePath d={phoneJourney ? phoneGeometry.path : mobileGeometry.path} />
              <S.ProgressPath
                d={phoneJourney ? phoneGeometry.path : mobileGeometry.path}
                style={{ pathLength }}
              />
            </S.MobileTrajectory>

            <S.Timeline>
              {processSectionContent.steps.map((step, index) => (
                <ProcessStep
                  key={step.title}
                  anchor={journeyAnchors[index]}
                  index={index}
                  progress={activeProgress}
                  range={stepRanges[index]}
                  reducedMotion={prefersReducedMotion}
                  step={step}
                />
              ))}
            </S.Timeline>
          </S.ProcessJourneyStage>
        </S.ProcessJourneyTrack>
      </S.Container>
    </S.Section>
  );
}
