import { motion } from 'framer-motion';
import styled from 'styled-components';
import { breakpoints, colors, fonts, homepageTokens, layout } from '../../styles/theme';
import { HomepageEditorialFrame } from '../HomepageEditorialFrame';

type AnchorAlignment = 'start' | 'center' | 'end';

export const Section = styled.section`
  position: relative;
  isolation: isolate;
  overflow: clip;
  padding: clamp(7rem, 12vw, 12rem) ${homepageTokens.sectionPaddingInline};
  background: ${colors.white};
  color: ${colors.background};

  @media (max-width: ${breakpoints.mobileMax}) {
    padding-bottom: clamp(2.5rem, 8vw, 4rem);
  }
`;

export const Container = styled.div`
  width: ${layout.containerWidth};
  margin-inline: auto;
`;

export const Heading = styled(HomepageEditorialFrame)`
  position: relative;
  margin-bottom: ${homepageTokens.process.headingMarginBottom};
`;

export const Eyebrow = styled(motion.p)`
  margin-bottom: ${homepageTokens.eyebrowMarginBottom};
  color: ${colors.highlight};
  font-family: ${fonts.primary};
  font-size: ${homepageTokens.eyebrowSize};
  font-weight: 650;
  letter-spacing: ${homepageTokens.eyebrowTracking};
  text-transform: uppercase;
`;

export const Title = styled(motion.h2)`
  max-width: 100%;
  font-family: ${fonts.heading};
  font-size: ${homepageTokens.process.introTitleSize};
  font-weight: 620;
  letter-spacing: -0.065em;
  line-height: 0.93;

  @media (max-width: ${breakpoints.contentMax}) {
    font-size: ${homepageTokens.process.introTitleMobileSize};
  }
`;

export const TitleLine = styled.span<{ $offset?: boolean }>`
  width: fit-content;
  max-width: 100%;
  margin-left: ${({ $offset }) => $offset ? homepageTokens.process.introLineOffset : '0'};
  display: block;
  overflow: hidden;

  @media (max-width: ${breakpoints.contentMax}) {
    margin-left: ${({ $offset }) => $offset ? homepageTokens.process.introMobileLineOffset : '0'};
  }
`;

export const TitleLineText = styled.span`
  display: block;
  white-space: nowrap;

  @media (max-width: ${breakpoints.contentMax}) {
    white-space: normal;
    text-wrap: balance;
  }
`;

export const Description = styled(motion.p)`
  max-width: ${homepageTokens.process.introDescriptionMaxWidth};
  margin: clamp(1.5rem, 2.4vw, 2.15rem) 0 0 ${homepageTokens.process.introDescriptionOffset};
  color: rgba(16, 24, 39, 0.68);
  font-family: ${fonts.primary};
  font-size: ${homepageTokens.sectionCopySize};
  font-weight: ${homepageTokens.process.introDescriptionWeight};
  line-height: 1.65;

  @media (max-width: ${breakpoints.contentMax}) {
    margin-left: ${homepageTokens.process.introMobileLineOffset};
  }
`;

export const ProcessJourneyTrack = styled.div`
  position: relative;

  &::after {
    content: '';
    display: block;
    height: ${homepageTokens.process.journeyTrackRunway};
    pointer-events: none;
  }

  @media (max-width: ${breakpoints.contentMax}),
    (max-height: 620px),
    (prefers-reduced-motion: reduce) {
    &::after {
      display: none;
    }
  }
`;

export const ProcessJourneyStage = styled.div`
  position: sticky;
  top: ${homepageTokens.process.journeyStageTop};
  width: min(100%, ${homepageTokens.process.journeyStageWidth});
  height: ${homepageTokens.process.journeyStageHeight};
  margin-inline: auto;

  @media (max-width: ${breakpoints.contentMax}),
    (max-height: 620px),
    (prefers-reduced-motion: reduce) {
    position: relative;
    top: auto;
  }

  @media (max-width: ${breakpoints.contentMax}) {
    width: min(100%, ${homepageTokens.process.mobileJourneyWidth});
    height: ${homepageTokens.process.mobileJourneyHeight};
  }

`;

export const DesktopTrajectory = styled.svg`
  position: absolute;
  z-index: 1;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  shape-rendering: geometricPrecision;

  @media (max-width: ${breakpoints.contentMax}) {
    display: none;
  }
`;

export const MobileTrajectory = styled.svg`
  display: none;

  @media (max-width: ${breakpoints.contentMax}) {
    position: absolute;
    z-index: 1;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
    overflow: visible;
    shape-rendering: geometricPrecision;
  }
`;

export const BasePath = styled.path`
  fill: none;
  stroke: rgba(16, 24, 39, 0.09);
  stroke-width: ${homepageTokens.process.pathBaseWidth};
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 4 9;
  vector-effect: non-scaling-stroke;
`;

export const ProgressPath = styled(motion.path)`
  fill: none;
  stroke: ${colors.highlight};
  stroke-width: ${homepageTokens.process.pathProgressWidth};
  stroke-linecap: round;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
`;

export const Timeline = styled.ol`
  position: absolute;
  z-index: 2;
  inset: 0;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const Step = styled.li<{ $align: AnchorAlignment }>`
  position: absolute;
  top: var(--desktop-anchor-y);
  left: var(--desktop-anchor-x);
  width: ${homepageTokens.process.stepWidth};

  @media (max-width: ${breakpoints.contentMax}) {
    top: var(--mobile-anchor-y);
    left: 0;
    width: 100%;
  }
`;

export const MarkerAnchor = styled.span`
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  width: ${homepageTokens.process.markerSize};
  aspect-ratio: 1;
  transform: translate(-50%, -50%);

  @media (max-width: ${breakpoints.contentMax}) {
    left: var(--mobile-anchor-x);
  }
`;

export const MarkerHalo = styled(motion.span)`
  position: absolute;
  z-index: 0;
  inset: calc(${homepageTokens.process.markerHaloSize} * -1);
  border: 1px solid rgba(108, 99, 255, 0.26);
  border-radius: 50%;
  opacity: 0.055;
  pointer-events: none;
`;

export const Marker = styled(motion.span)`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  border: ${homepageTokens.process.markerBorderWidth} solid ${colors.highlight};
  border-radius: 50%;
  background: ${colors.highlight};

  i {
    width: 30%;
    aspect-ratio: 1;
    border-radius: 50%;
    background: ${colors.white};
  }
`;

export const StepDetails = styled(motion.div)`
  --desktop-marker-content-gap: clamp(2.75rem, 4vw, 3.75rem);

  position: absolute;
  top: var(--desktop-content-offset-y);
  left: var(--desktop-marker-content-gap);
  width: 100%;
  will-change: transform, opacity;

  ${Step}[data-align='end'] & {
    left: calc(-100% - var(--desktop-marker-content-gap));
  }

  @media (max-width: ${breakpoints.contentMax}) {
    top: 0;
    left: calc(var(--mobile-content-x) + ${homepageTokens.process.markerSize} + 2rem) !important;
    width: calc(100% - var(--mobile-content-x) - ${homepageTokens.process.markerSize} - 2rem);
  }
`;

export const Number = styled(motion.span)`
  display: block;
  margin-bottom: 0.78rem;
  color: rgba(16, 24, 39, 0.135);
  font-family: ${fonts.heading};
  font-size: ${homepageTokens.process.numberSize};
  font-weight: 620;
  letter-spacing: -0.08em;
  line-height: 0.82;

  @media (max-width: ${breakpoints.contentMax}) {
    transform: translateY(-50%);
  }
`;

export const StepContent = styled.div`
  max-width: ${homepageTokens.process.stepCopyMaxWidth};
`;

export const StepTitle = styled.h3`
  font-family: ${fonts.heading};
  font-size: ${homepageTokens.process.stepTitleSize};
  font-weight: 650;
  letter-spacing: -0.04em;
  line-height: 1.08;
`;

export const StepDescription = styled.p`
  margin-top: 0.75rem;
  color: rgba(16, 24, 39, 0.7);
  font-family: ${fonts.primary};
  font-size: ${homepageTokens.process.stepCopySize};
  line-height: 1.58;
`;
