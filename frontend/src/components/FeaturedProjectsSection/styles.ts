import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { breakpoints, colors, fonts, homepageTokens, immersiveIntro, layout, motion as motionTokens } from '../../styles/theme';

export const Section = styled.section`
  position: relative;
  isolation: isolate;
  overflow: clip;
  padding: 0 ${homepageTokens.sectionPaddingInline} ${homepageTokens.sectionPaddingBlock};
  background: ${colors.background};
  color: ${colors.white};

  &::before {
    content: '';
    position: absolute;
    z-index: 0;
    top: 0;
    left: 50%;
    width: min(calc(100% - ${homepageTokens.sectionPaddingInline} - ${homepageTokens.sectionPaddingInline}), 72rem);
    height: 1px;
    transform: translateX(-50%);
    background: linear-gradient(90deg, transparent, rgba(145, 168, 255, 0.42), transparent);
  }

  @media (max-width: ${breakpoints.tabletMax}) {
    padding-bottom: ${homepageTokens.mobileSectionPaddingBlock};
  }
`;

export const Container = styled.div`
  position: relative;
  z-index: 1;
  width: ${layout.containerWidth};
  margin-inline: auto;
`;

export const Eyebrow = styled.p`
  margin-bottom: ${homepageTokens.eyebrowMarginBottom};
  color: ${colors.neonBlue};
  font-family: ${fonts.primary};
  font-size: ${homepageTokens.eyebrowSize};
  font-weight: 650;
  letter-spacing: ${homepageTokens.eyebrowTracking};
  text-transform: uppercase;
`;

export const Title = styled.h2`
  max-width: 17ch;
  font-family: ${fonts.heading};
  font-size: ${immersiveIntro.titleSize};
  font-weight: 620;
  letter-spacing: ${homepageTokens.sectionTitleTracking};
  line-height: ${homepageTokens.sectionTitleLineHeight};
  text-wrap: balance;
`;

export const Description = styled.p`
  max-width: ${homepageTokens.copyMaxWidth};
  margin: ${homepageTokens.sectionCopyMarginTop} auto 0;
  color: ${colors.textSecondary};
  font-family: ${fonts.primary};
  font-size: ${homepageTokens.sectionCopySize};
  line-height: ${homepageTokens.sectionCopyLineHeight};
`;

export const ProjectTrack = styled.div<{ $static: boolean }>`
  position: relative;
  height: ${({ $static }) => $static ? 'auto' : homepageTokens.projects.stageScrollLength};

  @media (max-width: ${breakpoints.tabletMax}) {
    height: ${({ $static }) => $static ? 'auto' : homepageTokens.projects.mobileStageScrollLength};
  }
`;

export const StickyStage = styled.div<{ $static: boolean }>`
  position: ${({ $static }) => $static ? 'relative' : 'sticky'};
  top: ${({ $static }) => $static ? 'auto' : layout.headerHeight};
  height: ${({ $static }) => $static ? 'auto' : `calc(100svh - ${layout.headerHeight})`};
  min-width: 0;
  display: ${({ $static }) => $static ? 'flex' : 'block'};
  flex-direction: column;
  gap: ${({ $static }) => $static ? homepageTokens.projects.listGap : '0'};
  overflow: hidden;
`;

export const IntroLayer = styled(motion.div)<{ $static: boolean }>`
  position: ${({ $static }) => $static ? 'relative' : 'absolute'};
  z-index: 3;
  inset: ${({ $static }) => $static ? 'auto' : '0'};
  min-height: ${({ $static }) => $static ? 'clamp(28rem, 56vw, 42rem)' : '100%'};
  padding: ${homepageTokens.projects.infoPadding} 0;
  display: grid;
  place-items: center;
  pointer-events: none;
`;

export const IntroContent = styled.div`
  width: min(100%, 58rem);
  text-align: center;

  ${Title} {
    margin-inline: auto;
  }
`;

export const IntroSignal = styled.span`
  position: absolute;
  z-index: 2;
  top: 0;
  left: 50%;
  width: min(calc(100vw - ${homepageTokens.sectionPaddingInline} - ${homepageTokens.sectionPaddingInline}), 72rem);
  height: 2.5rem;
  transform: translateX(-50%);
  pointer-events: none;

  &::before,
  &::after {
    content: '';
    position: absolute;
  }

  &::before {
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(145, 168, 255, 0.42), transparent);
  }

  &::after {
    top: 0;
    left: 50%;
    width: 1px;
    height: 2.5rem;
    transform: translateX(-50%);
    background: linear-gradient(${colors.neonBlue}, transparent);
  }
`;

export const StageBackdrop = styled.span`
  position: absolute;
  z-index: 0;
  inset: 0;
  overflow: hidden;
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0.32;
    background-image:
      linear-gradient(rgba(145, 168, 255, 0.055) 1px, transparent 1px),
      linear-gradient(90deg, rgba(145, 168, 255, 0.055) 1px, transparent 1px);
    background-size: ${homepageTokens.projects.backgroundGridSize} ${homepageTokens.projects.backgroundGridSize};
    mask-image: linear-gradient(90deg, transparent, black 36%, black 76%, transparent);
  }

  &::after {
    content: '';
    position: absolute;
    right: -14%;
    top: 50%;
    width: min(48vw, 44rem);
    aspect-ratio: 1;
    border: 1px solid rgba(145, 168, 255, 0.09);
    border-radius: 50%;
    transform: translateY(-50%);
  }
`;

export const ProjectLayer = styled(motion.article)<{ $active: boolean; $static: boolean }>`
  position: ${({ $static }) => $static ? 'relative' : 'absolute'};
  z-index: ${({ $active }) => $active ? 2 : 1};
  inset: ${({ $static }) => $static ? 'auto' : '0'};
  min-height: ${({ $static }) => $static ? 'clamp(36rem, 62vw, 48rem)' : '100%'};
  padding: ${homepageTokens.projects.infoPadding} 0;
  display: grid;
  grid-template-rows: auto auto;
  align-content: center;
  gap: ${homepageTokens.projects.stageGap};
  pointer-events: ${({ $active }) => $active ? 'auto' : 'none'};

  @media (max-width: ${breakpoints.tabletMax}) {
    min-height: ${({ $static }) => $static ? 'clamp(34rem, 142vw, 45rem)' : '100%'};
    padding: clamp(0.75rem, 2.6vh, 1.5rem) 0;
    gap: ${homepageTokens.projects.stageGap};
  }
`;

export const ProjectInfo = styled(motion.div)`
  position: relative;
  z-index: 4;
  grid-row: 2;
  min-width: 0;
  width: ${homepageTokens.projects.stageContentWidth};
  margin-inline: auto;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  align-items: center;
  gap: ${homepageTokens.projects.stageGap};

  @media (max-width: ${breakpoints.tabletMax}) {
    width: 100%;
    display: block;
  }
`;

export const ProjectTitle = styled.h3`
  grid-column: 1 / 5;
  max-width: 100%;
  font-family: ${fonts.heading};
  font-size: ${homepageTokens.projects.titleSize};
  font-weight: 620;
  letter-spacing: -0.052em;
  line-height: 0.98;
  overflow-wrap: anywhere;
`;

export const ProjectSummary = styled.p`
  grid-column: 5 / 10;
  max-width: ${homepageTokens.copyMaxWidth};
  color: ${colors.textSecondary};
  font-family: ${fonts.primary};
  font-size: ${homepageTokens.sectionCopySize};
  line-height: ${homepageTokens.sectionCopyLineHeight};

  @media (max-width: ${breakpoints.tabletMax}) {
    margin-top: clamp(0.8rem, 2vh, 1.25rem);
  }

`;

export const ProjectLink = styled.a`
  grid-column: 10 / -1;
  justify-self: end;
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  color: ${colors.white};
  font-family: ${fonts.primary};
  font-size: ${homepageTokens.projects.categorySize};
  font-weight: 650;
  text-decoration: none;
  transition: color ${motionTokens.duration.fast} ${motionTokens.easing.standard};

  svg {
    transition: transform ${motionTokens.duration.fast} ${motionTokens.easing.standard};
  }

  &:hover {
    color: ${colors.neonBlue};
  }

  &:hover svg {
    transform: translateX(3px);
  }

  &:focus-visible {
    outline: 2px solid ${colors.neonBlue};
    outline-offset: 0.45rem;
  }

  @media (max-width: ${breakpoints.tabletMax}) {
    margin-top: clamp(0.8rem, 2vh, 1.25rem);
  }
`;

export const ProjectMedia = styled(motion.div)`
  position: relative;
  z-index: 2;
  grid-row: 1;
  min-width: 0;
  width: ${homepageTokens.projects.stageContentWidth};
  height: ${homepageTokens.projects.stageMediaHeight};
  margin-inline: auto;
  transform-origin: center;

  &::before {
    content: '';
    position: absolute;
    z-index: 0;
    left: 50%;
    bottom: 2%;
    width: 82%;
    height: 28%;
    background: rgba(4, 8, 17, 0.46);
    filter: blur(3rem);
    transform: translateX(-50%);
    pointer-events: none;
  }

  @media (max-width: ${breakpoints.tabletMax}) {
    width: 100%;
    height: min(38vh, 22rem);
  }
`;

export const ProjectMediaLink = styled(Link)`
  position: relative;
  width: 100%;
  height: 100%;
  display: block;
  color: inherit;
  text-decoration: none;

  &:focus-visible {
    outline: 2px solid ${colors.neonBlue};
    outline-offset: -2px;
  }
`;

export const BrowserFrame = styled.span`
  position: absolute;
  z-index: 1;
  left: 50%;
  top: 50%;
  height: ${homepageTokens.projects.browser.height};
  max-width: ${homepageTokens.projects.browser.maxWidth};
  aspect-ratio: ${homepageTokens.projects.browser.aspectRatio};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: ${colors.inkDeep};
  border: 1px solid rgba(245, 242, 236, 0.18);
  border-radius: clamp(0.55rem, 0.9vw, 0.85rem);
  box-shadow: 0 2rem 5rem rgba(4, 8, 17, 0.34);
  transform: translate(-50%, -50%);
  transition: transform 360ms ease;

  ${ProjectMediaLink}:hover & {
    transform: translate(-50%, -50%) scale(1.006);
  }

  @media (max-width: ${breakpoints.tabletMax}) {
    width: ${homepageTokens.projects.browser.compactWidth};
    height: auto;
    max-width: none;
    aspect-ratio: ${homepageTokens.projects.browser.compactAspectRatio};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const BrowserBar = styled.span`
  flex: 0 0 clamp(1.85rem, 2.6vw, 2.35rem);
  padding-inline: clamp(0.55rem, 1vw, 0.85rem);
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.75rem;
  background: ${colors.inkHeader};
  border-bottom: 1px solid rgba(245, 242, 236, 0.12);

  @media (max-width: ${breakpoints.tabletMax}) {
    flex-basis: 1.5rem;
  }
`;

export const WindowControls = styled.span`
  display: flex;
  gap: 0.3rem;

  i {
    width: 0.42rem;
    aspect-ratio: 1;
    border: 1px solid rgba(245, 242, 236, 0.28);
    border-radius: 50%;
    background: rgba(245, 242, 236, 0.08);
  }

  i:first-child {
    border-color: rgba(108, 99, 255, 0.7);
  }

  @media (max-width: ${breakpoints.tabletMax}) {
    gap: 0.2rem;

    i {
      width: 0.3rem;
    }
  }
`;

export const AddressHint = styled.span`
  grid-column: 2;
  justify-self: center;
  width: min(52%, 18rem);
  height: 0.48rem;
  border: 1px solid rgba(245, 242, 236, 0.12);
  border-radius: 999px;
  background: rgba(245, 242, 236, 0.035);
`;

export const BrowserViewport = styled.span`
  min-height: 0;
  flex: 1;
  display: block;
  overflow: hidden;
`;

export const DesktopImage = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center;
`;

export const DeviceFrame = styled.span`
  position: absolute;
  z-index: 4;
  right: 1%;
  bottom: 0;
  width: ${homepageTokens.projects.mobileMediaWidth};
  aspect-ratio: ${homepageTokens.projects.deviceAspectRatio};
  max-height: 92%;
  padding: clamp(0.25rem, 0.5vw, 0.42rem);
  display: block;
  background: ${colors.inkDeep};
  border: 1px solid rgba(245, 242, 236, 0.3);
  border-radius: clamp(1.1rem, 2vw, 1.65rem);
  box-shadow: -1.5rem 1.75rem 4rem rgba(4, 8, 17, 0.48);
  transition: transform 320ms ease;

  &::before {
    content: '';
    position: absolute;
    z-index: 2;
    top: clamp(0.42rem, 0.8vw, 0.65rem);
    left: 50%;
    width: 18%;
    height: 0.22rem;
    border-radius: 999px;
    background: rgba(245, 242, 236, 0.2);
    transform: translateX(-50%);
    pointer-events: none;
  }

  ${ProjectMediaLink}:hover & {
    transform: translateY(-0.45rem);
  }

  @media (max-width: ${breakpoints.tabletMax}) {
    width: ${homepageTokens.projects.compactMobileMediaWidth};
    max-height: 88%;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const DeviceViewport = styled.span`
  width: 100%;
  height: 100%;
  display: block;
  overflow: hidden;
  border-radius: clamp(0.85rem, 1.7vw, 1.3rem);
  background: ${colors.background};
`;

export const MobileImage = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: top;
`;

export const AllProjectsLink = styled.a`
  grid-column: 1 / -1;
  justify-self: center;
  align-self: center;
  width: fit-content;
  margin: ${homepageTokens.projects.stageGap} auto 0;
  padding-bottom: 0.55rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  border-bottom: 1px solid rgba(145, 168, 255, 0.4);
  color: ${colors.white};
  font-family: ${fonts.primary};
  font-weight: 650;
  text-decoration: none;

  &:focus-visible {
    outline: 2px solid ${colors.neonBlue};
    outline-offset: 0.45rem;
  }

`;

export const ProjectAllProjectsLink = styled(AllProjectsLink)`
  @media (max-width: ${breakpoints.mobileMax}) {
    display: none;
  }
`;

export const MobileAllProjectsLink = styled(AllProjectsLink)`
  display: none;

  @media (max-width: ${breakpoints.mobileMax}) {
    position: absolute;
    z-index: 5;
    left: 50%;
    bottom: calc(clamp(1.25rem, 4vh, 2.25rem) + env(safe-area-inset-bottom, 0px));
    margin: 0;
    display: flex;
    transform: translateX(-50%);
  }
`;
