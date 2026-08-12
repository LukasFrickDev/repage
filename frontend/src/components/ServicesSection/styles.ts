import { motion } from 'framer-motion';
import styled from 'styled-components';
import { breakpoints, colors, fonts, homepageTokens, layout, motion as motionTokens } from '../../styles/theme';

type ServiceVisualKind = 'landing' | 'institutional' | 'custom';

export const Section = styled.section`
  position: relative;
  overflow: clip;
  padding: 0 ${homepageTokens.sectionPaddingInline} ${homepageTokens.sectionPaddingBlock};
  background: ${colors.white};
  color: ${colors.background};

  @media (max-width: ${breakpoints.tabletMax}) {
    padding-bottom: ${homepageTokens.mobileSectionPaddingBlock};
  }
`;

export const Container = styled.div`
  width: ${layout.containerWidth};
  margin-inline: auto;
`;

export const IntroTrack = styled.div`
  position: relative;
  z-index: 1;
  height: ${homepageTokens.services.introTrackHeight};

  @media (max-width: ${breakpoints.contentMax}) {
    height: ${homepageTokens.services.introTrackMobileHeight};
  }
`;

export const IntroStage = styled.div`
  position: sticky;
  top: ${homepageTokens.services.introStageTop};
  height: ${homepageTokens.services.introStageHeight};
  display: grid;
  place-items: center;
`;

export const IntroCore = styled.div`
  width: min(100%, ${homepageTokens.services.introContentMaxWidth});
  margin-inline: auto;
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(16rem, 0.72fr);
  align-items: center;
  column-gap: ${homepageTokens.services.introGridGap};

  @media (max-width: ${breakpoints.contentMax}) {
    grid-template-columns: 1fr;
    row-gap: clamp(1.25rem, 4vw, 2rem);
  }
`;

export const IntroPrimary = styled(motion.div)`
  will-change: transform, opacity;
`;

export const IntroSupport = styled(motion.div)`
  width: min(100%, ${homepageTokens.services.introSupportMaxWidth});
  justify-self: start;
  will-change: transform, opacity;

  @media (max-width: ${breakpoints.contentMax}) {
    justify-self: start;
  }
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
  max-width: ${homepageTokens.services.introHeadlineMaxWidth};
  font-family: ${fonts.heading};
  font-size: ${homepageTokens.services.sectionTitleSize};
  font-weight: 620;
  letter-spacing: ${homepageTokens.sectionTitleTracking};
  line-height: ${homepageTokens.sectionTitleLineHeight};
  text-wrap: balance;

  @media (max-width: ${breakpoints.contentMax}) {
    font-size: ${homepageTokens.services.sectionTitleCompactSize};
  }
`;

export const Description = styled.p`
  max-width: ${homepageTokens.services.introSupportMaxWidth};
  color: rgba(16, 24, 39, 0.84);
  font-family: ${fonts.primary};
  font-size: ${homepageTokens.services.introSupportSize};
  font-weight: 540;
  line-height: 1.52;
`;

export const Offers = styled.div`
  position: relative;
  display: grid;
  gap: ${homepageTokens.services.compositionsGap};
`;

export const ServicesContent = styled.div`
  position: relative;
  z-index: 2;
  margin-top: ${homepageTokens.services.introContentOverlap};

  @media (max-width: ${breakpoints.contentMax}) {
    margin-top: ${homepageTokens.services.introContentMobileOverlap};
  }
`;

export const Offer = styled(motion.article)<{ $kind: ServiceVisualKind }>`
  position: relative;
  padding-block: clamp(0.5rem, 1vw, 1rem);
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  align-items: center;
  column-gap: clamp(0.75rem, 1.5vw, 1.5rem);
  row-gap: ${homepageTokens.services.offerGap};

  &::before {
    content: '';
    position: absolute;
    z-index: 0;
    top: 7%;
    bottom: 7%;
    width: 28%;
    ${({ $kind }) => $kind === 'institutional' ? 'left: -7%;' : 'right: -7%;'}
    background: rgba(108, 99, 255, 0.055);
    clip-path: polygon(14% 0, 100% 0, 86% 100%, 0 100%);
    pointer-events: none;
  }

  @media (max-width: ${breakpoints.laptopMax}) {
    padding-block: clamp(0.5rem, 1.5vw, 1rem);
    grid-template-columns: 1fr;

    &::before {
      top: 34%;
      bottom: -3%;
      width: 46%;
      right: -12%;
      left: auto;
    }
  }
`;

export const OfferCopy = styled(motion.div)<{ $kind: ServiceVisualKind }>`
  position: relative;
  z-index: 2;
  max-width: ${homepageTokens.services.copyMaxWidth};

  @media (min-width: ${breakpoints.laptop}) {
    grid-column: ${({ $kind }) => $kind === 'institutional' ? '7 / -1' : '1 / 7'};
    grid-row: 1;
  }

  @media (max-width: ${breakpoints.laptopMax}) {
    grid-column: 1;
    grid-row: 1;
    width: min(100%, 44rem);
  }
`;

export const ServiceTitle = styled(motion.h3)`
  max-width: 12ch;
  font-family: ${fonts.heading};
  font-size: ${homepageTokens.services.serviceTitleSize};
  font-weight: 620;
  letter-spacing: -0.058em;
  line-height: 0.94;
  text-wrap: balance;

  @media (max-width: ${breakpoints.compactMax}) {
    font-size: ${homepageTokens.services.serviceTitleMobileSize};
  }
`;

export const ServiceDescription = styled(motion.p)`
  max-width: ${homepageTokens.services.copyMaxWidth};
  margin-top: clamp(1.4rem, 2.5vw, 2rem);
  color: rgba(16, 24, 39, 0.88);
  font-family: ${fonts.primary};
  font-size: clamp(1.1rem, 1.35vw, 1.3rem);
  line-height: 1.55;
`;

export const ServiceScope = styled(motion.p)`
  display: flex;
  align-items: center;
  gap: clamp(0.65rem, 1vw, 0.9rem);
  max-width: ${homepageTokens.services.copyMaxWidth};
  margin-top: clamp(1rem, 1.5vw, 1.35rem);
  color: ${colors.highlight};
  font-family: ${fonts.primary};
  font-size: ${homepageTokens.services.scopeSize};
  font-weight: 680;
  letter-spacing: 0.015em;
  line-height: 1.55;

  &::before {
    content: '';
    flex: 0 0 clamp(1.25rem, 2vw, 2rem);
    height: 1px;
    background: currentColor;
  }
`;

export const MediaFrame = styled(motion.div)<{ $kind: ServiceVisualKind }>`
  position: relative;
  z-index: 1;
  min-width: 0;
  aspect-ratio: ${homepageTokens.services.mediaAspectRatio};

  &::before {
    content: '';
    position: absolute;
    z-index: 0;
    inset: ${({ $kind }) => $kind === 'institutional'
      ? `${homepageTokens.services.mediaSupportOffset} ${homepageTokens.services.mediaSupportOffset} ${homepageTokens.services.mediaSupportOffsetNegative} ${homepageTokens.services.mediaSupportOffsetNegative}`
      : `${homepageTokens.services.mediaSupportOffset} ${homepageTokens.services.mediaSupportOffsetNegative} ${homepageTokens.services.mediaSupportOffsetNegative} ${homepageTokens.services.mediaSupportOffset}`};
    border: 1px solid rgba(108, 99, 255, 0.16);
    border-radius: ${({ $kind }) => $kind === 'institutional' ? homepageTokens.services.mediaRadiusReversed : homepageTokens.services.mediaRadius};
    background: rgba(108, 99, 255, 0.045);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    z-index: 2;
    ${({ $kind }) => $kind === 'institutional' ? 'left: 0;' : 'right: 0;'}
    bottom: ${homepageTokens.services.mediaSupportOffsetNegative};
    width: 22%;
    height: 3px;
    background: ${colors.highlight};
    pointer-events: none;
  }

  picture {
    width: 100%;
    height: 100%;
    display: block;
  }

  @media (min-width: ${breakpoints.laptop}) {
    grid-column: ${({ $kind }) => $kind === 'institutional' ? '1 / 7' : '7 / -1'};
    grid-row: 1;
    justify-self: ${({ $kind }) => $kind === 'institutional' ? 'start' : 'end'};
    width: ${homepageTokens.services.mediaScale};
  }

  @media (max-width: ${breakpoints.laptopMax}) {
    grid-column: 1;
    grid-row: 2;
    width: 100%;
  }

  @media (max-width: ${breakpoints.compactMax}) {
    aspect-ratio: ${homepageTokens.services.mediaMobileAspectRatio};
  }
`;

export const MediaSurface = styled.div<{ $kind: ServiceVisualKind }>`
  position: absolute;
  z-index: 1;
  inset: 0;
  overflow: hidden;
  border: ${homepageTokens.services.mediaBorder};
  border-radius: ${({ $kind }) => $kind === 'institutional' ? homepageTokens.services.mediaRadiusReversed : homepageTokens.services.mediaRadius};
  background: ${colors.backgroundSecondary};
  box-shadow: ${homepageTokens.services.mediaShadow};
`;

export const MediaReveal = styled(motion.div)`
  width: 100%;
  height: 100%;
  overflow: hidden;

  picture {
    width: 100%;
    height: 100%;
    display: block;
  }
`;

export const MediaImage = styled.img<{ $kind: ServiceVisualKind }>`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: ${({ $kind }) => $kind === 'institutional' ? 'center top' : $kind === 'custom' ? 'center 34%' : 'center 45%'};
  transition: transform ${motionTokens.duration.medium} ${motionTokens.easing.standard};

  ${MediaFrame}:hover & {
    transform: scale(1.012);
  }

  @media (max-width: ${breakpoints.compactMax}) {
    object-position: ${({ $kind }) => $kind === 'institutional' ? 'center top' : $kind === 'custom' ? 'center 38%' : 'center 68%'};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    ${MediaFrame}:hover & {
      transform: none;
    }
  }
`;
