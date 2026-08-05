import { motion } from 'framer-motion';
import styled, { css } from 'styled-components';
import { breakpoints, colors, fonts, homepageTokens, layout } from '../../styles/theme';

export const Section = styled.section`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: ${homepageTokens.sectionPaddingBlock} ${homepageTokens.sectionPaddingInline};
  border-top: 1px solid rgba(145, 168, 255, 0.12);
  background: ${colors.background};
  color: ${colors.white};

  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    inset: 0;
    background:
      radial-gradient(circle at 88% 10%, rgba(108, 99, 255, 0.1), transparent 28%),
      linear-gradient(rgba(145, 168, 255, 0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(145, 168, 255, 0.035) 1px, transparent 1px);
    background-size: auto, ${homepageTokens.projects.backgroundGridSize} ${homepageTokens.projects.backgroundGridSize}, ${homepageTokens.projects.backgroundGridSize} ${homepageTokens.projects.backgroundGridSize};
    mask-image: linear-gradient(to bottom, #000, transparent 78%);
    pointer-events: none;
  }

  @media (max-width: ${breakpoints.tabletMax}) {
    padding-block: ${homepageTokens.mobileSectionPaddingBlock};
  }
`;

export const Container = styled.div`
  width: ${layout.containerWidth};
  margin-inline: auto;
`;

export const Heading = styled(motion.div)`
  display: grid;
  gap: ${homepageTokens.sectionGap};
  align-items: end;
  margin-bottom: ${homepageTokens.headingMarginBottom};

  @media (min-width: ${breakpoints.content}) {
    grid-template-columns: minmax(0, 1fr) minmax(20rem, 0.62fr);
  }
`;

export const HeadingCopy = styled.div`
  min-width: 0;
`;

export const Eyebrow = styled.p`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: ${homepageTokens.eyebrowMarginBottom};
  color: ${colors.neonBlue};
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
  max-width: 13ch;
  font-family: ${fonts.heading};
  font-size: ${homepageTokens.sectionTitleSize};
  font-weight: 650;
  letter-spacing: ${homepageTokens.sectionTitleTracking};
  line-height: ${homepageTokens.sectionTitleLineHeight};
  text-wrap: balance;
`;

export const Description = styled.p`
  max-width: ${homepageTokens.copyMaxWidth};
  color: ${colors.textSecondary};
  font-family: ${fonts.primary};
  font-size: ${homepageTokens.sectionCopySize};
  line-height: ${homepageTokens.sectionCopyLineHeight};
`;

export const ProjectList = styled.ol`
  display: grid;
  gap: ${homepageTokens.projects.listGap};
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const Project = styled(motion.li)`
  position: relative;
  display: grid;
  min-width: 0;
  border-top: 1px solid rgba(185, 192, 204, 0.2);

  @media (min-width: ${breakpoints.content}) {
    grid-template-columns: minmax(0, 1.38fr) minmax(16rem, 0.62fr);
    align-items: stretch;

    &:nth-child(even) {
      grid-template-columns: minmax(16rem, 0.62fr) minmax(0, 1.38fr);
    }

    &:nth-child(even) > div:first-child { order: 2; }
    &:nth-child(even) > div:last-child { order: 1; }
  }
`;

const previewAccentPosition = ($variant: number) => ['76% 24%', '24% 72%', '82% 72%', '28% 24%'][$variant] ?? '76% 24%';
const previewRotation = ($variant: number) => ['-2deg', '2deg', '-1deg', '1.5deg'][$variant] ?? '-2deg';

export const Preview = styled.div<{ $variant: number }>`
  position: relative;
  min-width: 0;
  aspect-ratio: 16 / 8.7;
  overflow: hidden;
  border-inline: 1px solid rgba(145, 168, 255, 0.16);
  border-bottom: 1px solid rgba(145, 168, 255, 0.16);
  background:
    radial-gradient(circle at ${({ $variant }) => previewAccentPosition($variant)}, rgba(108, 99, 255, 0.28), transparent 26%),
    linear-gradient(rgba(145, 168, 255, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(145, 168, 255, 0.06) 1px, transparent 1px),
    ${colors.inkRaised};
  background-size: auto, 9% 16%, 9% 16%, auto;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(112deg, transparent 42%, rgba(145, 168, 255, 0.055), transparent 68%);
    transform: translate3d(-20%, 0, 0);
    transition: transform 500ms ease;
    pointer-events: none;
  }

  @media (hover: hover) and (pointer: fine) {
    ${Project}:hover &::after { transform: translate3d(20%, 0, 0); }
  }

  @media (max-width: ${breakpoints.compactMax}) { aspect-ratio: 1.15 / 1; }

  @media (prefers-reduced-motion: reduce) {
    &::after { transition: none; }
    ${Project}:hover &::after { transform: translate3d(-20%, 0, 0); }
  }
`;

export const PreviewIndex = styled.span`
  position: absolute;
  z-index: 2;
  top: ${homepageTokens.projects.previewInset};
  left: ${homepageTokens.projects.previewInset};
  color: ${colors.neonBlue};
  font-family: ${fonts.ui};
  font-size: 0.72rem;
  font-weight: 650;
  letter-spacing: 0.1em;
`;

export const ProjectWord = styled.span`
  position: absolute;
  z-index: 1;
  left: 4%;
  bottom: -0.08em;
  max-width: 90%;
  overflow: hidden;
  color: rgba(245, 242, 236, 0.06);
  font-family: ${fonts.heading};
  font-size: ${homepageTokens.projects.wordSize};
  font-weight: 650;
  letter-spacing: -0.07em;
  line-height: 0.8;
  white-space: nowrap;

  ${Project}:nth-child(2) & { left: 10%; }
  ${Project}:nth-child(3) & { left: 6%; }
  ${Project}:nth-child(4) & { left: 12%; }
`;

export const InterfacePlane = styled.div<{ $variant: number }>`
  position: absolute;
  z-index: 2;
  inset: 15% 9% 13% 14%;
  overflow: hidden;
  border: 1px solid rgba(245, 242, 236, 0.2);
  background: rgba(16, 24, 39, 0.94);
  box-shadow: 0 24px 60px rgba(4, 8, 17, 0.4), 12px 16px 44px rgba(108, 99, 255, 0.1);
  transform: rotate(${({ $variant }) => previewRotation($variant)});
  transition: transform 260ms ease, border-color 260ms ease;

  ${({ $variant }) => $variant % 2 === 1 && css`inset: 13% 14% 15% 9%;`}

  @media (hover: hover) and (pointer: fine) {
    ${Project}:hover & {
      transform: translate3d(0, -4px, 0) rotate(${({ $variant }) => previewRotation($variant)});
      border-color: rgba(145, 168, 255, 0.42);
    }
  }

  @media (max-width: ${breakpoints.compactMax}) { inset: 17% 7% 12% 9%; }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    ${Project}:hover & { transform: rotate(${({ $variant }) => previewRotation($variant)}); }
  }
`;

export const InterfaceHeader = styled.div`
  height: 12%;
  min-height: 24px;
  padding-inline: 4%;
  display: flex;
  align-items: center;
  gap: 5px;
  border-bottom: 1px solid rgba(185, 192, 204, 0.13);
  background: ${colors.inkHeader};

  i {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: rgba(185, 192, 204, 0.28);
  }

  i:first-child { background: ${colors.highlight}; box-shadow: 0 0 10px rgba(108, 99, 255, 0.7); }
  span { width: 22%; height: 3px; margin-left: auto; background: rgba(145, 168, 255, 0.2); }
`;

export const InterfaceBody = styled.div`
  display: grid;
  grid-template-columns: 17% 1fr;
  height: 88%;
`;

export const InterfaceRail = styled.div`
  padding: 28% 20%;
  display: flex;
  flex-direction: column;
  gap: 12%;
  border-right: 1px solid rgba(185, 192, 204, 0.11);

  i { height: 3px; background: rgba(185, 192, 204, 0.18); }
  i:nth-child(2) { width: 70%; }
  i:nth-child(3) { width: 48%; background: ${colors.highlight}; }
`;

export const InterfaceContent = styled.div`
  padding: 7%;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 13%;
  background:
    linear-gradient(rgba(145, 168, 255, 0.04) 1px, transparent 1px) 0 0 / 100% 22%,
    linear-gradient(90deg, rgba(145, 168, 255, 0.035) 1px, transparent 1px) 0 0 / 24% 100%;
`;

export const InterfaceLead = styled.div`
  display: grid;
  gap: 7px;

  i { height: ${homepageTokens.projects.interfaceLineHeight}; background: rgba(245, 242, 236, 0.68); }
  i:first-child { width: 58%; }
  i:last-child { width: 36%; background: ${colors.neonBlue}; }
`;

export const InterfaceGrid = styled.div`
  display: grid;
  grid-template-columns: 1.25fr 0.75fr;
  grid-template-rows: 1fr 0.38fr;
  gap: 6%;

  i { border: 1px solid rgba(145, 168, 255, 0.16); background: rgba(145, 168, 255, 0.045); }
  i:first-child { grid-row: span 2; background: linear-gradient(135deg, rgba(108, 99, 255, 0.2), rgba(145, 168, 255, 0.04)); }
  i:last-child { border-color: rgba(108, 99, 255, 0.25); }
`;

export const ProjectInfo = styled.div`
  padding: ${homepageTokens.projects.infoPadding};
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  border-bottom: 1px solid rgba(185, 192, 204, 0.2);
  background: rgba(20, 30, 48, 0.52);

  @media (max-width: ${breakpoints.contentMax}) { min-height: 11rem; }
  @media (max-width: ${breakpoints.compactMax}) { min-height: 9.5rem; padding-inline: 1.25rem; }
`;

export const ProjectNumber = styled.span`
  margin-bottom: auto;
  color: ${colors.highlight};
  font-family: ${fonts.ui};
  font-size: 0.76rem;
  font-weight: 650;
  letter-spacing: 0.1em;
`;

export const ProjectTitle = styled.h3`
  margin-top: 2rem;
  font-family: ${fonts.heading};
  font-size: ${homepageTokens.projects.titleSize};
  font-weight: 650;
  letter-spacing: -0.05em;
  line-height: 1;
`;

export const ProjectCategory = styled.p`
  margin-top: 0.75rem;
  color: ${colors.textSecondary};
  font-family: ${fonts.primary};
  font-size: ${homepageTokens.projects.categorySize};
  line-height: 1.45;
`;
