import { motion } from 'framer-motion';
import styled from 'styled-components';
import { breakpoints, colors, fonts, homepageTokens, layout } from '../../styles/theme';

export const Section = styled.section`
  position: relative;
  overflow: clip;
  padding: ${homepageTokens.valueProposition.sectionPaddingTop} ${homepageTokens.sectionPaddingInline}
    ${homepageTokens.valueProposition.sectionPaddingBottom};
  background: ${colors.background};
  color: ${colors.white};

  &::before {
    content: '';
    position: absolute;
    top: -32%;
    right: -22%;
    width: ${homepageTokens.valueProposition.primaryPlaneSize};
    aspect-ratio: 1.25;
    border-radius: 28%;
    background: ${colors.backgroundSecondary};
    opacity: 0.42;
    transform: rotate(-10deg);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -20%;
    left: -18%;
    width: ${homepageTokens.valueProposition.secondaryPlaneSize};
    aspect-ratio: 1.35;
    border-radius: 32%;
    background: ${colors.inkDeep};
    opacity: 0.58;
    transform: rotate(12deg);
    pointer-events: none;
  }
`;

export const Container = styled.div`
  position: relative;
  z-index: 1;
  width: ${layout.containerWidth};
  margin-inline: auto;
`;

export const Intro = styled(motion.div)`
  position: relative;
  width: min(100%, ${homepageTokens.valueProposition.introMaxWidth});
  margin-inline: auto;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
`;

export const Eyebrow = styled(motion.p)`
  grid-column: 1 / -1;
  margin-bottom: ${homepageTokens.eyebrowMarginBottom};
  color: ${colors.highlight};
  font-family: ${fonts.primary};
  font-size: ${homepageTokens.eyebrowSize};
  font-weight: 650;
  letter-spacing: ${homepageTokens.eyebrowTracking};
  text-transform: uppercase;
`;

export const Title = styled.h2`
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  row-gap: ${homepageTokens.valueProposition.titleRowGap};
  font-family: ${fonts.heading};
  font-size: ${homepageTokens.valueProposition.titleSize};
  font-weight: 610;
  letter-spacing: -0.058em;
  line-height: 0.94;

  @media (max-width: ${breakpoints.tabletMax}) {
    display: block;
    font-size: clamp(2.65rem, 11.5vw, 3.35rem);
  }
`;

export const TitlePole = styled(motion.span)<{ $position: 'clarity' | 'structure' }>`
  box-sizing: content-box;
  display: block;
  grid-column: ${({ $position }) => $position === 'clarity' ? '1 / 8' : '1 / 12'};
  max-width: ${({ $position }) => $position === 'clarity' ? '10.5ch' : '12ch'};
  margin-left: ${({ $position }) => $position === 'structure'
    ? homepageTokens.valueProposition.structureOffset
    : '0'};
  padding: 0.08em 0.16em 0.13em 0.06em;
  margin-top: -0.08em;
  margin-right: -0.16em;
  margin-bottom: -0.13em;
  text-wrap: balance;
  will-change: clip-path, opacity;

  @media (max-width: ${breakpoints.tabletMax}) {
    max-width: ${({ $position }) => $position === 'clarity' ? '10.5ch' : '11.5ch'};
    margin-top: ${({ $position }) => $position === 'structure' ? '0.65rem' : '-0.08em'};
    margin-left: ${({ $position }) => $position === 'structure' ? 'clamp(0.75rem, 5vw, 1.5rem)' : '0'};
  }
`;

export const TitlePoleText = styled(motion.span)`
  display: block;
  will-change: transform;
`;

export const Description = styled(motion.p)`
  grid-column: 1 / 12;
  width: min(100%, ${homepageTokens.valueProposition.descriptionMaxWidth});
  margin-top: ${homepageTokens.valueProposition.descriptionMarginTop};
  margin-left: ${homepageTokens.valueProposition.structureOffset};
  color: rgba(245, 242, 236, 0.74);
  font-family: ${fonts.primary};
  font-size: clamp(1.04rem, 1.25vw, 1.18rem);
  font-weight: 470;
  line-height: 1.62;

  @media (max-width: ${breakpoints.tabletMax}) {
    grid-column: 1 / -1;
    width: calc(100% - clamp(0.75rem, 5vw, 1.5rem));
    max-width: 32rem;
    margin-left: clamp(0.75rem, 5vw, 1.5rem);
  }

  @media (prefers-reduced-motion: reduce) {
    transform: none !important;
  }
`;

export const DifferentiatorsBridge = styled(motion.p)`
  width: min(100%, ${homepageTokens.valueProposition.differentiatorsMaxWidth});
  margin: ${homepageTokens.valueProposition.differentiatorsBridgeMarginTop} auto 0;
  color: ${colors.highlight};
  font-family: ${fonts.primary};
  font-size: ${homepageTokens.eyebrowSize};
  font-weight: 650;
  letter-spacing: ${homepageTokens.eyebrowTracking};
  line-height: 1.4;
  text-transform: uppercase;
`;

export const DifferentialsTerminalTrack = styled.div`
  position: relative;

  &::after {
    content: '';
    display: block;
    height: ${homepageTokens.valueProposition.differentiatorsTerminalRunway};
    pointer-events: none;
  }

  @media (max-width: ${breakpoints.contentMax}), (prefers-reduced-motion: reduce) {
    &::after {
      display: none;
    }
  }
`;

export const DifferentialsTerminal = styled.div`
  position: sticky;
  top: ${homepageTokens.valueProposition.differentiatorsTerminalTop};
  display: flow-root;

  @media (max-width: ${breakpoints.contentMax}), (prefers-reduced-motion: reduce) {
    position: relative;
    top: auto;
  }
`;

export const Differentiators = styled(motion.ul)`
  width: min(100%, ${homepageTokens.valueProposition.differentiatorsMaxWidth});
  margin: ${homepageTokens.valueProposition.differentiatorsMarginTop} auto 0;
  padding: 0;
  display: grid;
  grid-template-columns: minmax(0, 0.96fr) minmax(0, 1.04fr);
  row-gap: ${homepageTokens.valueProposition.differentiatorsRowGap};
  column-gap: ${homepageTokens.valueProposition.differentiatorsColumnGap};
  list-style: none;

  li:nth-child(odd) { grid-column: 1; }
  li:nth-child(even) { grid-column: 2; }

  @media (max-width: ${breakpoints.contentMax}) {
    width: min(100%, 46rem);
    grid-template-columns: repeat(2, minmax(0, 1fr));
    row-gap: clamp(2.1rem, 4.5vw, 2.6rem);
    column-gap: clamp(1.5rem, 4vw, 2.5rem);

    li:nth-child(n) {
      width: 100%;
      margin: 0;
    }

    li:nth-child(odd) { grid-column: 1; }
    li:nth-child(even) { grid-column: 2; }
  }

  @media (max-width: ${breakpoints.tabletMax}) {
    width: min(100%, ${homepageTokens.valueProposition.differentiatorsMobileMaxWidth});
    grid-template-columns: 1fr;
    row-gap: ${homepageTokens.valueProposition.differentiatorsMobileGap};

    li:nth-child(n) {
      grid-column: 1;
    }
  }

  @media (min-width: ${breakpoints.laptop}) and (max-height: 760px) {
    row-gap: 2rem;
  }
`;

export const Differentiator = styled(motion.li)`
  position: relative;
  min-width: 0;
  padding-left: clamp(1.35rem, 1.8vw, 1.6rem);
  color: ${colors.white};
  font-family: ${fonts.primary};
  will-change: transform, opacity;
`;

export const DifferentiatorMarker = styled.span`
  position: absolute;
  top: 0.16rem;
  left: 0;
  width: ${homepageTokens.valueProposition.differentiatorMarkerSize};
  aspect-ratio: 1;
  background: ${colors.highlight};
  clip-path: polygon(0 0, 100% 0, 100% 38%, 64% 38%, 64% 100%, 0 100%);
  transform: rotate(-4deg);

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 36%;
    height: 38%;
    background: rgba(245, 242, 236, 0.36);
  }
`;

export const DifferentiatorTitle = styled.h3`
  font-family: ${fonts.heading};
  font-size: ${homepageTokens.valueProposition.differentiatorTitleSize};
  font-weight: 620;
  letter-spacing: -0.038em;
  line-height: 1.12;
`;

export const DifferentiatorDescription = styled.p`
  max-width: ${homepageTokens.valueProposition.differentiatorCopyMaxWidth};
  margin-top: 0.72rem;
  color: rgba(245, 242, 236, 0.78);
  font-family: ${fonts.primary};
  font-size: ${homepageTokens.valueProposition.differentiatorCopySize};
  font-weight: 450;
  line-height: 1.58;
`;
