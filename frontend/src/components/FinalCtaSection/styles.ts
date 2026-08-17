import { motion } from 'framer-motion';
import styled from 'styled-components';
import { breakpoints, colors, fonts, homepageTokens } from '../../styles/theme';

export const Section = styled.section`
  position: relative;
  isolation: isolate;
  min-height: 100svh;
  overflow: clip;
  padding: clamp(7rem, 10vw, 10rem) ${homepageTokens.sectionPaddingInline} clamp(9rem, 13vw, 13rem);
  display: grid;
  align-items: center;
  background: ${colors.inkDeep};
  color: ${colors.white};

  &::before {
    content: '';
    position: absolute;
    z-index: -2;
    top: 4%;
    left: 50%;
    width: min(78vw, 72rem);
    height: 92%;
    background: radial-gradient(
      ellipse at center,
      rgba(108, 99, 255, 0.22),
      rgba(145, 168, 255, 0.07) 42%,
      transparent 72%
    );
    transform: translateX(-50%);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    z-index: -1;
    inset: 0;
    background:
      linear-gradient(rgba(145, 168, 255, 0.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(145, 168, 255, 0.045) 1px, transparent 1px);
    background-size: ${homepageTokens.finalCta.backgroundGridSize} ${homepageTokens.finalCta.backgroundGridSize};
    mask-image: radial-gradient(ellipse at center, #000, transparent 72%);
    pointer-events: none;
  }

  @media (max-width: ${breakpoints.tabletMax}) {
    padding-block: clamp(6.5rem, 22vw, 9rem) clamp(7.5rem, 26vw, 10rem);
  }

  @media (max-width: ${breakpoints.mobileMax}) {
    padding-inline: max(1rem, env(safe-area-inset-left)) max(1rem, env(safe-area-inset-right));
  }
`;

export const Content = styled.div`
  position: relative;
  z-index: 1;
  width: min(100%, 72rem);
  margin-inline: auto;
  text-align: center;
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
  max-width: 19ch;
  margin-inline: auto;
  margin-bottom: -0.12em;
  padding-bottom: 0.12em;
  font-family: ${fonts.heading};
  font-size: clamp(3rem, 5.8vw, 6.15rem);
  font-weight: 640;
  letter-spacing: -0.062em;
  line-height: 0.94;
  text-wrap: balance;
  transform-origin: center bottom;
  -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 48%, transparent 55%, transparent 100%);
  mask-image: linear-gradient(to bottom, #000 0%, #000 48%, transparent 55%, transparent 100%);
  -webkit-mask-size: 100% 220%;
  mask-size: 100% 220%;
  -webkit-mask-position: 0 0;
  mask-position: 0 0;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;

  @media (max-width: ${breakpoints.tabletMax}) {
    max-width: 12ch;
    font-size: clamp(2.75rem, 13vw, 4.5rem);
    line-height: 0.96;
  }

  @media (max-width: ${breakpoints.mobileMax}) {
    max-width: none;
    font-size: clamp(2.3rem, 9.9vw, 2.67rem);
    line-height: 0.99;
  }
`;

export const TitleLine = styled.span`
  display: block;

  @media (max-width: ${breakpoints.tabletMax}) {
    display: inline;
  }

  @media (max-width: ${breakpoints.mobileMax}) {
    display: block;

    &:last-child {
      max-width: 12ch;
      margin-inline: auto;
    }
  }
`;

export const Description = styled(motion.p)`
  max-width: 45rem;
  margin: clamp(2rem, 3vw, 2.75rem) auto 0;
  color: rgba(245, 242, 236, 0.76);
  font-family: ${fonts.primary};
  font-size: clamp(1.03rem, 1.18vw, 1.14rem);
  font-weight: 510;
  line-height: 1.7;

  @media (max-width: ${breakpoints.tabletMax}) {
    max-width: 34rem;
    font-size: clamp(1rem, 4.4vw, 1.08rem);
  }

  @media (max-width: ${breakpoints.mobileMax}) {
    max-width: none;
    margin-top: clamp(1.5rem, 6vw, 1.75rem);
    font-size: clamp(0.875rem, 3.8vw, 0.95rem);
    line-height: 1.64;
  }
`;

export const FormReveal = styled(motion.div)`
  display: flow-root;
`;
