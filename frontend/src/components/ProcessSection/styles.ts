import { motion } from 'framer-motion';
import styled from 'styled-components';
import { breakpoints, colors, fonts, homepageTokens, layout } from '../../styles/theme';

export const Section = styled.section`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: clamp(7rem, 12vw, 12rem) ${homepageTokens.sectionPaddingInline};
  background: ${colors.white};
  color: ${colors.background};
`;

export const Container = styled.div`
  width: ${layout.containerWidth};
  margin-inline: auto;
`;

export const Heading = styled.div`
  position: relative;
  max-width: 63rem;
  margin-bottom: clamp(5rem, 9vw, 9rem);
`;

export const Eyebrow = styled.p`
  margin-bottom: ${homepageTokens.eyebrowMarginBottom};
  color: ${colors.highlight};
  font-family: ${fonts.primary};
  font-size: ${homepageTokens.eyebrowSize};
  font-weight: 650;
  letter-spacing: ${homepageTokens.eyebrowTracking};
  text-transform: uppercase;
`;

export const Title = styled.h2`
  max-width: 13ch;
  font-family: ${fonts.heading};
  font-size: clamp(3.2rem, 5.6vw, 6.2rem);
  font-weight: 620;
  letter-spacing: -0.065em;
  line-height: 0.93;
  text-wrap: balance;
`;

export const Description = styled.p`
  max-width: 34rem;
  margin: clamp(1.75rem, 3vw, 2.5rem) 0 0 auto;
  color: rgba(16, 24, 39, 0.68);
  font-family: ${fonts.primary};
  font-size: ${homepageTokens.sectionCopySize};
  line-height: 1.65;

  @media (max-width: ${breakpoints.tabletMax}) {
    margin-left: 0;
  }
`;

export const Journey = styled.div`
  position: relative;
  min-height: 38rem;
`;

export const DesktopTrajectory = styled.svg`
  position: absolute;
  z-index: 1;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;

  @media (max-width: ${breakpoints.contentMax}) {
    display: none;
  }
`;

export const MobileTrajectory = styled.svg`
  display: none;

  @media (max-width: ${breakpoints.contentMax}) {
    position: absolute;
    z-index: 1;
    top: 0;
    bottom: 0;
    left: 0;
    width: 6rem;
    height: 100%;
    display: block;
    overflow: visible;
  }
`;

export const BasePath = styled.path`
  fill: none;
  stroke: rgba(16, 24, 39, 0.13);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-dasharray: 5 8;
`;

export const ProgressPath = styled(motion.path)`
  fill: none;
  stroke: ${colors.highlight};
  stroke-width: 3;
  stroke-linecap: round;
  filter: drop-shadow(0 0 5px rgba(108, 99, 255, 0.22));
`;

export const Timeline = styled.ol`
  position: relative;
  z-index: 2;
  min-height: 38rem;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-template-rows: repeat(2, minmax(15rem, 1fr));
  gap: 3rem clamp(2rem, 6vw, 7rem);
  list-style: none;

  li:nth-child(1) { grid-area: 1 / 1; align-self: start; }
  li:nth-child(2) { grid-area: 1 / 2; align-self: center; }
  li:nth-child(3) { grid-area: 1 / 3; align-self: start; }
  li:nth-child(4) { grid-area: 2 / 3; align-self: end; }
  li:nth-child(5) { grid-area: 2 / 2; align-self: center; }
  li:nth-child(6) { grid-area: 2 / 1; align-self: end; }

  @media (max-width: ${breakpoints.contentMax}) {
    min-height: 64rem;
    display: block;

    li:nth-child(n) {
      min-height: 10.5rem;
      margin-left: 0;
      padding-left: 6.4rem;
    }

    li:nth-child(even) {
      padding-left: 8rem;
    }
  }
`;

export const Step = styled.li`
  position: relative;
  min-width: 0;
  max-width: 21rem;
  padding-top: 1.25rem;
`;

export const Marker = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 1.2rem;
  height: 1.2rem;
  display: grid;
  place-items: center;
  border: 2px solid ${colors.highlight};
  border-radius: 50%;
  background: ${colors.white};
  box-shadow: 0 0 0 0.5rem rgba(108, 99, 255, 0.08);

  i {
    width: 0.32rem;
    height: 0.32rem;
    border-radius: 50%;
    background: ${colors.highlight};
  }

  @media (max-width: ${breakpoints.contentMax}) {
    left: 2.15rem;
  }
`;

export const Number = styled.span`
  display: block;
  margin-bottom: 1rem;
  color: rgba(16, 24, 39, 0.16);
  font-family: ${fonts.heading};
  font-size: clamp(3.5rem, 6vw, 6rem);
  font-weight: 620;
  letter-spacing: -0.08em;
  line-height: 0.82;
`;

export const StepContent = styled.div`
  max-width: 20rem;
`;

export const StepTitle = styled.h3`
  font-family: ${fonts.heading};
  font-size: clamp(1.4rem, 2vw, 1.9rem);
  font-weight: 650;
  letter-spacing: -0.04em;
`;

export const StepDescription = styled.p`
  margin-top: 0.75rem;
  color: rgba(16, 24, 39, 0.68);
  font-family: ${fonts.primary};
  font-size: 0.96rem;
  line-height: 1.6;
`;
