import { motion } from 'framer-motion';
import styled, { css, keyframes } from 'styled-components';
import { breakpoints, colors, fonts, homepageTokens, layout, motion as motionTokens } from '../../styles/theme';

const entranceLift = keyframes`
  0%, 38% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(0, -100%, 0); }
`;

const identityLift = keyframes`
  0% { opacity: 0; transform: translate3d(0, 1.5rem, 0); }
  22%, 56% { opacity: 1; transform: translate3d(0, 0, 0); }
  100% { opacity: 0; transform: translate3d(0, -4rem, 0); }
`;

const entranceLineLift = keyframes`
  0% { opacity: 0; transform: translate3d(0, 1rem, 0) scaleX(0.35); }
  28%, 58% { opacity: 1; transform: translate3d(0, 0, 0) scaleX(1); }
  100% { opacity: 0; transform: translate3d(0, -3rem, 0) scaleX(1); }
`;

export const Page = styled.div`
  min-width: 0;
  overflow-x: clip;
  background: ${colors.background};
`;

export const Hero = styled.section`
  position: relative;
  isolation: isolate;
  min-height: min(58rem, 100svh);
  overflow: hidden;
  padding: clamp(7rem, 9vw, 8.5rem) ${homepageTokens.sectionPaddingInline} clamp(2.25rem, 3vw, 3.25rem);
  background: ${colors.background};

  @media (max-width: ${breakpoints.laptopMax}) {
    min-height: 0;
    padding-bottom: 2.5rem;
  }

  @media (max-width: ${breakpoints.tabletMax}) {
    padding-top: 6.5rem;
    padding-bottom: 2rem;
  }

  @media (max-height: 680px) and (min-width: ${breakpoints.tablet}) {
    min-height: 0;
    padding-top: 6.5rem;
    padding-bottom: 2rem;
  }

  @media (min-width: ${breakpoints.laptop}) and (max-height: ${homepageTokens.hero.lowHeightMax}) {
    min-height: 100svh;
    padding-top: ${homepageTokens.hero.lowHeightPaddingTop};
    padding-bottom: ${homepageTokens.hero.lowHeightPaddingBottom};
  }
`;

export const BrandEntrance = styled.div<{ $fontReady: boolean }>`
  position: absolute;
  z-index: 6;
  inset: 0;
  display: grid;
  place-items: center;
  overflow: hidden;
  pointer-events: none;
  background: ${colors.backgroundSecondary};
  animation: ${({ $fontReady }) => ($fontReady ? css`${entranceLift} 1.48s cubic-bezier(0.76, 0, 0.24, 1) forwards` : 'none')};
  will-change: transform;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(112deg, transparent 0 47%, rgba(145, 168, 255, 0.1) 47.1% 47.2%, transparent 47.3%),
      linear-gradient(150deg, rgba(108, 99, 255, 0.14), transparent 48%);
  }

  @media (max-width: ${breakpoints.tabletMax}) {
    position: fixed;
    width: 100%;
    height: 100svh;
    animation-duration: 1.18s;
  }
`;

export const BrandEntranceIdentity = styled.div<{ $fontReady: boolean }>`
  position: relative;
  z-index: 1;
  display: inline-flex;
  justify-self: center;
  margin-inline: auto;
  align-items: center;
  gap: clamp(0.75rem, 1.8vw, 1.35rem);
  color: ${colors.white};
  font-family: ${fonts.primary};
  font-size: clamp(3rem, 6.4vw, 6.6rem);
  font-weight: 620;
  letter-spacing: -0.07em;
  line-height: 0.9;
  visibility: ${({ $fontReady }) => ($fontReady ? 'visible' : 'hidden')};

  img {
    width: clamp(3.8rem, 7.6vw, 7.8rem);
    height: clamp(3.8rem, 7.6vw, 7.8rem);
  }

  animation: ${({ $fontReady }) => ($fontReady ? css`${identityLift} 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards` : 'none')};

  @media (max-width: ${breakpoints.tabletMax}) {
    font-size: clamp(2.8rem, 13vw, 4.8rem);
    animation-duration: 0.96s;

    img {
      width: clamp(3.5rem, 16vw, 5.7rem);
      height: clamp(3.5rem, 16vw, 5.7rem);
    }
  }
`;

export const BrandEntranceLine = styled.span<{ $fontReady: boolean }>`
  position: absolute;
  right: 0;
  bottom: clamp(3rem, 9vw, 8rem);
  width: min(58vw, 55rem);
  height: 2px;
  background: linear-gradient(90deg, transparent, ${colors.highlight}, ${colors.neonBlue});
  transform-origin: right center;
  animation: ${({ $fontReady }) => ($fontReady ? css`${entranceLineLift} 1.18s cubic-bezier(0.22, 1, 0.36, 1) forwards` : 'none')};

  @media (max-width: ${breakpoints.tabletMax}) {
    width: 72vw;
    animation-duration: 0.94s;
  }
`;

export const HeroBackdrop = styled.div`
  position: absolute;
  z-index: -1;
  inset: 0;
  overflow: hidden;
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    width: min(72vw, 70rem);
    aspect-ratio: 1;
    right: -20%;
    top: -32%;
    border: 1px solid rgba(145, 168, 255, 0.1);
    border-radius: 50%;
    box-shadow:
      0 0 0 8rem rgba(108, 99, 255, 0.015),
      0 0 0 16rem rgba(145, 168, 255, 0.012);
  }

  &::after {
    content: '';
    position: absolute;
    width: 52%;
    height: 1px;
    left: 0;
    bottom: 18%;
    background: linear-gradient(90deg, transparent, rgba(145, 168, 255, 0.22), transparent);
    transform: rotate(-12deg);
    transform-origin: left;
  }
`;

export const HeroInner = styled.div`
  position: relative;
  z-index: 1;
  width: ${layout.containerWidth};
  margin-inline: auto;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  align-items: center;
  min-height: clamp(33rem, 54vw, 46rem);

  @media (min-width: ${breakpoints.laptop}) and (max-height: ${homepageTokens.hero.lowHeightMax}) {
    min-height: ${homepageTokens.hero.lowHeightInnerMinHeight};
  }
`;

export const Copy = styled.div`
  position: relative;
  z-index: 3;
  grid-column: 1 / 7;
  grid-row: 1;
  min-width: 0;
  padding-block: clamp(1rem, 4vw, 3rem);

  @media (min-width: ${breakpoints.wide}) {
    grid-column: 2 / 7;
  }

  @media (max-width: ${breakpoints.laptopMax}) {
    grid-column: 1 / 10;
    grid-row: 1;
    max-width: 49rem;
  }

  @media (max-width: ${breakpoints.tabletMax}) {
    grid-column: 1 / -1;
    padding-block: 0;
  }
`;

export const Eyebrow = styled(motion.p)`
  max-width: 39rem;
  margin-bottom: ${homepageTokens.hero.eyebrowMarginBottom};
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${colors.neonBlue};
  font-family: ${fonts.primary};
  font-size: ${homepageTokens.eyebrowSize};
  font-weight: 650;
  letter-spacing: ${homepageTokens.eyebrowTracking};
  line-height: 1.45;
  text-transform: uppercase;

  &::before {
    content: '';
    width: 2.75rem;
    height: 1px;
    flex: 0 0 auto;
    background: linear-gradient(90deg, ${colors.highlight}, ${colors.neonBlue});
  }
`;

export const Title = styled(motion.h1)`
  max-width: 11ch;
  color: ${colors.white};
  font-family: ${fonts.heading};
  font-size: clamp(3.25rem, 5.2vw, 5.5rem);
  font-weight: 620;
  letter-spacing: -0.068em;
  line-height: 0.92;
  text-wrap: balance;

  @media (max-width: ${breakpoints.laptopMax}) {
    max-width: 11ch;
    font-size: clamp(3.4rem, 7vw, 5.25rem);
  }

  @media (max-width: ${breakpoints.compactMax}) {
    max-width: 10ch;
    font-size: clamp(3rem, 14vw, 4.2rem);
    line-height: 0.94;
  }
`;

export const Details = styled(motion.div)`
  max-width: 36rem;
  margin-top: clamp(1.6rem, 3vw, 2.6rem);
`;

export const Description = styled.p`
  color: ${colors.textSecondary};
  font-family: ${fonts.primary};
  font-size: ${homepageTokens.hero.copySize};
  line-height: 1.65;
`;

export const Actions = styled.div`
  margin-top: ${homepageTokens.hero.actionsMarginTop};
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;

  @media (max-width: ${breakpoints.compactMax}) {
    display: grid;
  }
`;

const ctaBase = `
  min-height: 3.3rem;
  padding: 0.82rem 1.2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  border-radius: ${layout.radii.action};
  font-family: ${fonts.primary};
  font-size: 0.94rem;
  font-weight: 650;
  line-height: 1;
  text-decoration: none;
  transition: transform ${motionTokens.duration.fast} ${motionTokens.easing.standard}, border-color ${motionTokens.duration.fast} ${motionTokens.easing.standard}, background ${motionTokens.duration.fast} ${motionTokens.easing.standard}, box-shadow ${motionTokens.duration.fast} ${motionTokens.easing.standard};

  svg { transition: transform ${motionTokens.duration.fast} ${motionTokens.easing.standard}; }
  &:hover svg { transform: translateX(3px); }
  &:hover { transform: translateY(-1px); }
`;

export const SecondaryCta = styled.a`
  ${ctaBase}
  border: 1px solid rgba(245, 242, 236, 0.28);
  color: ${colors.white};

  &:hover {
    border-color: rgba(145, 168, 255, 0.7);
    background: rgba(145, 168, 255, 0.06);
  }
`;

export const Visual = styled.div`
  position: relative;
  z-index: 2;
  grid-column: 7 / -1;
  grid-row: 1;
  min-width: 0;
  align-self: center;
  margin-right: -3vw;

  @media (min-width: ${breakpoints.wide}) {
    grid-column: 6 / -1;
  }

  @media (max-width: ${breakpoints.laptopMax}) {
    grid-column: 5 / -1;
    grid-row: 2;
    width: min(100%, 46rem);
    margin: -3rem 0 0 auto;
  }

  @media (max-width: ${breakpoints.tabletMax}) {
    grid-column: 1 / -1;
    grid-row: 2;
    width: 100%;
    margin-top: clamp(1.5rem, 7vw, 3rem);
  }

  @media (max-height: 560px) and (min-width: ${breakpoints.tablet}) and (max-width: ${breakpoints.laptopMax}) {
    margin-top: 1rem;
  }
`;
