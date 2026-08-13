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

  @media (max-width: ${breakpoints.tabletMax}) {
    gap: ${homepageTokens.services.compositionsMobileGap};
  }
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
  width: ${homepageTokens.services.offerContentWidth};
  margin-inline: auto;
  padding-block: clamp(0.75rem, 1.25vw, 1.15rem);
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  align-items: center;
  column-gap: clamp(0.75rem, 1.5vw, 1.5rem);
  row-gap: ${homepageTokens.services.offerGap};

  &::before {
    content: '';
    position: absolute;
    z-index: 0;
    bottom: ${homepageTokens.services.mediaBackdropBottom};
    width: ${homepageTokens.services.mediaBackdropWidth};
    height: ${homepageTokens.services.mediaBackdropHeight};
    ${({ $kind }) => $kind === 'institutional'
      ? `left: ${homepageTokens.services.mediaBackdropProjection};`
      : `right: ${homepageTokens.services.mediaBackdropProjection};`}
    background: rgba(108, 99, 255, 0.055);
    clip-path: polygon(14% 0, 100% 0, 86% 100%, 0 100%);
    pointer-events: none;
  }

  @media (max-width: ${breakpoints.laptopMax}) {
    padding-block: clamp(0.5rem, 1.5vw, 0.9rem);
    grid-template-columns: 1fr;

    &::before {
      top: auto;
      bottom: ${homepageTokens.services.mediaBackdropMobileBottom};
      width: ${homepageTokens.services.mediaBackdropMobileWidth};
      height: ${homepageTokens.services.mediaBackdropMobileHeight};
      right: ${homepageTokens.services.mediaBackdropProjection};
      left: auto;
    }
  }
`;

export const OfferCopy = styled(motion.div)<{ $kind: ServiceVisualKind }>`
  position: relative;
  z-index: 2;
  width: min(100%, ${homepageTokens.services.offerCopyMaxWidth});

  @media (min-width: ${breakpoints.laptop}) {
    grid-column: ${({ $kind }) => $kind === 'institutional' ? '7 / -1' : '1 / 7'};
    grid-row: 1;
    justify-self: ${({ $kind }) => $kind === 'institutional' ? 'start' : 'end'};
  }

  @media (max-width: ${breakpoints.laptopMax}) {
    grid-column: 1;
    grid-row: 1;
    width: min(100%, ${homepageTokens.services.offerCopyMaxWidth});
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
  max-width: ${homepageTokens.services.offerCopyMaxWidth};
  margin-top: ${homepageTokens.services.descriptionMarginTop};
  color: rgba(16, 24, 39, 0.88);
  font-family: ${fonts.primary};
  font-size: clamp(1.1rem, 1.35vw, 1.3rem);
  line-height: 1.55;
`;

export const ServiceScope = styled(motion.p)`
  display: flex;
  align-items: center;
  gap: clamp(0.65rem, 1vw, 0.9rem);
  max-width: ${homepageTokens.services.offerCopyMaxWidth};
  margin-top: ${homepageTokens.services.scopeMarginTop};
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

export const ServiceMediaFrame = styled(motion.div)<{ $kind: ServiceVisualKind }>`
  position: relative;
  z-index: 1;
  min-width: 0;
  aspect-ratio: ${homepageTokens.services.mediaAspectRatio};

  picture {
    width: 100%;
    height: 100%;
    display: block;
  }

  @media (min-width: ${breakpoints.laptop}) {
    grid-column: ${({ $kind }) => $kind === 'institutional' ? '1 / 7' : '7 / -1'};
    grid-row: 1;
    justify-self: ${({ $kind }) => $kind === 'institutional' ? 'end' : 'start'};
    width: ${homepageTokens.services.mediaScale};
    margin-right: ${({ $kind }) => $kind === 'institutional'
      ? homepageTokens.services.institutionalMediaInset
      : '0'};
  }

  @media (max-width: ${breakpoints.laptopMax}) {
    grid-column: 1;
    grid-row: 2;
    width: min(100%, ${homepageTokens.services.mediaStackMaxWidth});
    justify-self: ${({ $kind }) => $kind === 'institutional' ? 'start' : 'end'};
  }

  @media (max-width: ${breakpoints.compactMax}) {
    width: 100%;
    aspect-ratio: ${homepageTokens.services.mediaMobileLandscapeAspectRatio};
  }
`;

export const ServiceMediaLayer = styled(motion.span)`
  position: absolute;
  z-index: 0;
  inset: 0;
  border: ${homepageTokens.services.mediaLayerBorder};
  border-radius: ${homepageTokens.services.mediaFrameRadius};
  background: rgba(245, 242, 236, 0.92);
  box-shadow: ${homepageTokens.services.mediaLayerShadow};
  transform: translate(${homepageTokens.services.mediaLayerOffset}, ${homepageTokens.services.mediaLayerOffset});
  pointer-events: none;

  @media (max-width: ${breakpoints.compactMax}) {
    transform: translate(${homepageTokens.services.mediaLayerMobileOffset}, ${homepageTokens.services.mediaLayerMobileOffset});
  }
`;

export const ServiceMediaSurface = styled(motion.div)`
  position: absolute;
  z-index: 1;
  inset: 0;
  display: grid;
  grid-template-rows: ${homepageTokens.services.mediaChromeHeight} minmax(0, 1fr);
  overflow: hidden;
  border: ${homepageTokens.services.mediaFrameBorder};
  border-radius: ${homepageTokens.services.mediaFrameRadius};
  background: ${colors.backgroundSecondary};
  box-shadow: ${homepageTokens.services.mediaShadow};

  @media (max-width: ${breakpoints.compactMax}) {
    grid-template-rows: ${homepageTokens.services.mediaChromeMobileHeight} minmax(0, 1fr);
  }
`;

export const ServiceMediaChrome = styled.span`
  position: relative;
  z-index: 2;
  padding-inline: 0.55rem;
  display: flex;
  align-items: center;
  border-bottom: ${homepageTokens.services.mediaChromeBorder};
  background: rgba(16, 24, 39, 0.97);
`;

export const ServiceMediaSignals = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.24rem;

  i {
    width: ${homepageTokens.services.mediaControlSize};
    aspect-ratio: 1;
    border: 1px solid rgba(245, 242, 236, 0.24);
    border-radius: 50%;
    background: rgba(245, 242, 236, 0.08);
  }

  i:first-child {
    border-color: rgba(108, 99, 255, 0.72);
    background: rgba(108, 99, 255, 0.18);
  }

  @media (max-width: ${breakpoints.compactMax}) {
    gap: 0.18rem;

    i {
      width: 0.22rem;
    }
  }
`;

export const ServiceMediaViewport = styled(motion.div)`
  min-width: 0;
  min-height: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transform-origin: top center;
  will-change: clip-path, transform, opacity;

  picture {
    width: 100%;
    height: 100%;
    display: block;
  }
`;

export const ServiceMediaSignature = styled(motion.span)`
  position: absolute;
  z-index: 3;
  right: 0;
  bottom: calc(${homepageTokens.services.mediaLayerOffset} * -1);
  width: ${homepageTokens.services.mediaAccentWidth};
  height: 2px;
  background: ${colors.highlight};
  transform-origin: right center;
  pointer-events: none;

  @media (max-width: ${breakpoints.compactMax}) {
    bottom: calc(${homepageTokens.services.mediaLayerMobileOffset} * -1);
    height: 1px;
  }
`;

export const ServiceMediaImage = styled.img<{ $kind: ServiceVisualKind }>`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: ${({ $kind }) => $kind === 'institutional' ? 'center top' : $kind === 'custom' ? 'center 34%' : 'center 45%'};
  transition: transform ${motionTokens.duration.medium} ${motionTokens.easing.standard};

  ${ServiceMediaFrame}:hover & {
    transform: scale(1.012);
  }

  @media (max-width: ${breakpoints.compactMax}) {
    object-position: ${({ $kind }) => $kind === 'institutional' ? 'center top' : $kind === 'custom' ? 'center 22%' : 'center 62%'};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    ${ServiceMediaFrame}:hover & {
      transform: none;
    }
  }
`;

export const SupportEpilogueTrack = styled.div`
  position: relative;
  margin-top: ${homepageTokens.services.supportMarginTop};

  &::after {
    content: '';
    display: block;
    height: ${homepageTokens.services.supportTerminalRunway};
    pointer-events: none;
  }

  @media (max-height: 700px), (prefers-reduced-motion: reduce) {
    &::after {
      display: none;
    }
  }
`;

export const SupportEpilogue = styled(motion.div)`
  position: sticky;
  top: ${homepageTokens.services.supportTerminalTop};
  padding-top: ${homepageTokens.services.supportPaddingTop};
  border-top: 1px solid rgba(16, 24, 39, 0.14);

  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: 0;
    width: ${homepageTokens.services.supportAccentWidth};
    height: 1px;
    background: ${colors.highlight};
  }

  @media (max-height: 700px), (prefers-reduced-motion: reduce) {
    position: relative;
    top: auto;
  }
`;

export const SupportContent = styled(motion.div)`
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(18rem, 1fr);
  align-items: center;
  width: min(100%, ${homepageTokens.services.supportContentMaxWidth});
  margin-inline: auto;
  column-gap: ${homepageTokens.services.supportGridGap};

  @media (max-width: ${breakpoints.contentMax}) {
    grid-template-columns: 1fr;
    align-items: start;
    row-gap: clamp(1.25rem, 4vw, 1.75rem);
  }
`;

export const SupportHeading = styled.div`
  min-width: 0;
`;

export const SupportEyebrow = styled(motion.p)`
  margin-bottom: clamp(1rem, 1.5vw, 1.35rem);
  color: ${colors.highlight};
  font-family: ${fonts.primary};
  font-size: ${homepageTokens.eyebrowSize};
  font-weight: 680;
  letter-spacing: ${homepageTokens.eyebrowTracking};
  line-height: 1.4;
  text-transform: uppercase;
`;

export const SupportTitle = styled(motion.h3)`
  max-width: ${homepageTokens.services.supportTitleMaxWidth};
  font-family: ${fonts.heading};
  font-size: ${homepageTokens.services.supportTitleSize};
  font-weight: 620;
  letter-spacing: -0.055em;
  line-height: 0.96;
  text-wrap: balance;

  @media (max-width: ${breakpoints.contentMax}) {
    max-width: 12ch;
  }
`;

export const SupportDescription = styled(motion.p)`
  width: min(100%, ${homepageTokens.services.supportCopyMaxWidth});
  color: rgba(16, 24, 39, 0.9);
  font-family: ${fonts.primary};
  font-size: clamp(1.05rem, 1.22vw, 1.18rem);
  font-weight: ${homepageTokens.services.supportCopyWeight};
  line-height: 1.56;
`;

export const SupportContinuities = styled(motion.ol)`
  --continuity-gap: ${homepageTokens.services.supportContinuitiesGap};

  position: relative;
  width: min(100%, ${homepageTokens.services.supportContinuitiesMaxWidth});
  margin: ${homepageTokens.services.supportContinuitiesMarginTop} auto 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--continuity-gap);
  list-style: none;

  @media (max-width: ${breakpoints.tabletMax}) {
    --continuity-gap: clamp(1.5rem, 7vw, 2rem);

    width: min(100%, 32rem);
    grid-template-columns: 1fr;
  }
`;

export const SupportContinuity = styled(motion.li)`
  position: relative;
  padding-top: 1.75rem;
  text-align: center;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    z-index: 0;
    top: calc(${homepageTokens.services.supportContinuityMarkerSize} / 2);
    left: 50%;
    width: calc(100% + var(--continuity-gap));
    height: 1px;
    background: linear-gradient(90deg, rgba(108, 99, 255, 0.58), rgba(16, 24, 39, 0.14));
  }

  @media (max-width: ${breakpoints.tabletMax}) {
    padding: 0 0 0 2.1rem;
    text-align: left;

    &:not(:last-child)::after {
      top: calc(${homepageTokens.services.supportContinuityMarkerSize} / 2);
      left: calc(${homepageTokens.services.supportContinuityMarkerSize} / 2);
      width: 1px;
      height: calc(100% + var(--continuity-gap));
      background: linear-gradient(180deg, rgba(108, 99, 255, 0.58), rgba(16, 24, 39, 0.14));
    }
  }
`;

export const SupportContinuityMarker = styled.span`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 50%;
  width: ${homepageTokens.services.supportContinuityMarkerSize};
  aspect-ratio: 1;
  border: 2px solid ${colors.white};
  border-radius: 50%;
  background: ${colors.highlight};
  box-shadow: 0 0 0 1px rgba(108, 99, 255, 0.42);
  transform: translateX(-50%);

  @media (max-width: ${breakpoints.tabletMax}) {
    left: 0;
    transform: none;
  }
`;

export const SupportContinuityTitle = styled.h4`
  color: ${colors.highlight};
  font-family: ${fonts.heading};
  font-size: clamp(1.15rem, 1.45vw, 1.35rem);
  font-weight: 650;
  letter-spacing: -0.025em;
  line-height: 1.12;
`;

export const SupportContinuityDescription = styled.p`
  max-width: 17rem;
  margin: 0.75rem auto 0;
  color: rgba(16, 24, 39, 0.76);
  font-family: ${fonts.primary};
  font-size: clamp(0.98rem, 1.1vw, 1.05rem);
  line-height: 1.52;

  @media (max-width: ${breakpoints.tabletMax}) {
    margin-left: 0;
  }
`;
