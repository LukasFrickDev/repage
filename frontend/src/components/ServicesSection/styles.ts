import { motion } from 'framer-motion';
import styled from 'styled-components';
import { breakpoints, colors, fonts, homepageTokens, layout, motion as motionTokens } from '../../styles/theme';

export const Section = styled.section`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: ${homepageTokens.sectionPaddingBlock} ${homepageTokens.sectionPaddingInline};
  background: ${colors.white};
  color: ${colors.background};

  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    inset: 0 0 auto;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${colors.highlight} 38%, ${colors.neonBlue} 72%, transparent);
    opacity: 0.75;
  }

  &::after {
    content: '';
    position: absolute;
    z-index: -2;
    top: 0;
    right: 0;
    width: min(54vw, 56rem);
    height: 100%;
    background-image:
      linear-gradient(rgba(16, 24, 39, 0.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(16, 24, 39, 0.045) 1px, transparent 1px),
      radial-gradient(circle at 76% 18%, rgba(108, 99, 255, 0.09), transparent 34%);
    background-size: ${homepageTokens.services.backgroundGridSize} ${homepageTokens.services.backgroundGridSize}, ${homepageTokens.services.backgroundGridSize} ${homepageTokens.services.backgroundGridSize}, auto;
    mask-image: linear-gradient(to right, transparent, #000 32%);
    pointer-events: none;
  }

  @media (max-width: ${breakpoints.tabletMax}) {
    padding-block: ${homepageTokens.mobileSectionPaddingBlock};

    &::after {
      width: 100%;
      opacity: 0.58;
      mask-image: linear-gradient(to bottom, #000, transparent 74%);
    }
  }
`;

export const Container = styled.div`
  position: relative;
  z-index: 1;
  width: ${layout.containerWidth};
  margin-inline: auto;
  display: grid;
  gap: ${homepageTokens.services.contentGap};

  @media (min-width: ${breakpoints.servicesWide}) {
    grid-template-columns: minmax(0, 0.78fr) minmax(34rem, 1fr);
    align-items: start;
  }
`;

export const Intro = styled(motion.div)`
  max-width: 39rem;

  @media (min-width: ${breakpoints.servicesWide}) {
    position: sticky;
    top: 7rem;
  }
`;

export const Eyebrow = styled.p`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: ${homepageTokens.eyebrowMarginBottom};
  color: ${colors.highlight};
  font-family: ${fonts.primary};
  font-size: ${homepageTokens.eyebrowSize};
  font-weight: 650;
  letter-spacing: ${homepageTokens.eyebrowTracking};
  text-transform: uppercase;

  &::before {
    content: '';
    width: 1.75rem;
    height: 1px;
    background: linear-gradient(90deg, ${colors.highlight}, ${colors.neonBlue});
  }
`;

export const Title = styled.h2`
  max-width: 12ch;
  font-family: ${fonts.heading};
  font-size: ${homepageTokens.sectionTitleSize};
  font-weight: 650;
  letter-spacing: ${homepageTokens.sectionTitleTracking};
  line-height: ${homepageTokens.sectionTitleLineHeight};
  text-wrap: balance;
`;

export const Description = styled.p`
  max-width: ${homepageTokens.copyMaxWidth};
  margin-top: ${homepageTokens.sectionCopyMarginTop};
  color: rgba(16, 24, 39, 0.7);
  font-family: ${fonts.primary};
  font-size: ${homepageTokens.sectionCopySize};
  line-height: ${homepageTokens.sectionCopyLineHeight};
`;

export const ServicesList = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
  border-bottom: 1px solid rgba(16, 24, 39, 0.16);
`;

export const ServiceItem = styled(motion.li)<{ $featured: boolean }>`
  position: relative;
  min-width: 0;
  min-height: 8.75rem;
  padding: ${homepageTokens.services.itemPadding};
  display: grid;
  grid-template-columns: 2.5rem minmax(0, 1fr) auto;
  align-items: start;
  gap: ${homepageTokens.services.itemGap};
  border-top: 1px solid rgba(16, 24, 39, 0.16);
  background: ${({ $featured }) => ($featured
    ? 'linear-gradient(100deg, rgba(108, 99, 255, 0.07), rgba(145, 168, 255, 0.035) 62%, transparent)'
    : 'transparent')};
  transition: transform ${motionTokens.duration.base} ${motionTokens.easing.standard}, background ${motionTokens.duration.base} ${motionTokens.easing.standard};

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translate3d(4px, 0, 0);
      background: linear-gradient(100deg, rgba(108, 99, 255, 0.075), rgba(145, 168, 255, 0.025) 62%, transparent);
    }

    &:hover > span:first-child { transform: scaleY(1); opacity: 1; }
    &:hover > span:last-child { transform: translate3d(3px, 0, 0); color: ${colors.highlight}; }
  }

  @media (max-width: ${breakpoints.tabletMax}) {
    min-height: 0;
    padding: 1.5rem 0.25rem;
    grid-template-columns: 2rem minmax(0, 1fr) auto;
    gap: 0.85rem;
  }

  @media (prefers-reduced-motion: reduce) { transition: none; }
`;

export const Accent = styled.span`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 2px;
  background: linear-gradient(${colors.highlight}, ${colors.neonBlue});
  opacity: 0;
  transform: scaleY(0.25);
  transform-origin: center;
  transition: transform ${motionTokens.duration.base} ${motionTokens.easing.standard}, opacity ${motionTokens.duration.base} ${motionTokens.easing.standard};
`;

export const Number = styled.span`
  padding-top: 0.18rem;
  color: ${colors.highlight};
  font-family: ${fonts.ui};
  font-size: 0.76rem;
  font-weight: 650;
  letter-spacing: 0.08em;
`;

export const ServiceCopy = styled.div`
  min-width: 0;
`;

export const ServiceTitle = styled.h3`
  font-family: ${fonts.heading};
  font-size: ${homepageTokens.services.itemTitleSize};
  font-weight: 650;
  letter-spacing: -0.035em;
  line-height: 1.1;
`;

export const ServiceDescription = styled.p`
  max-width: 38rem;
  margin-top: 0.65rem;
  color: rgba(16, 24, 39, 0.68);
  font-family: ${fonts.primary};
  font-size: ${homepageTokens.services.itemCopySize};
  line-height: 1.58;
`;

export const Arrow = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  color: rgba(16, 24, 39, 0.62);
  transition: transform ${motionTokens.duration.base} ${motionTokens.easing.standard}, color ${motionTokens.duration.base} ${motionTokens.easing.standard};

  @media (max-width: ${breakpoints.mobileMax}) {
    width: 2rem;
    height: 2rem;
  }

  @media (prefers-reduced-motion: reduce) { transition: none; }
`;
