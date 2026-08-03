import { motion } from 'framer-motion';
import styled, { css } from 'styled-components';
import { colors, fonts } from '../../styles/globalStyles';

export const Section = styled.section`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: clamp(5rem, 8vw, 8.5rem) clamp(1rem, 4vw, 4.5rem);
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
    background-size: auto, clamp(40px, 4vw, 64px) clamp(40px, 4vw, 64px), clamp(40px, 4vw, 64px) clamp(40px, 4vw, 64px);
    mask-image: linear-gradient(to bottom, #000, transparent 78%);
    pointer-events: none;
  }

  @media (max-width: 767px) {
    padding-block: clamp(4.25rem, 16vw, 5.5rem);
  }
`;

export const Container = styled.div`
  width: min(100%, 1440px);
  margin-inline: auto;
`;

export const Heading = styled(motion.div)`
  display: grid;
  gap: clamp(1.5rem, 4vw, 5rem);
  align-items: end;
  margin-bottom: clamp(3.5rem, 6vw, 6.5rem);

  @media (min-width: 900px) {
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
  margin-bottom: clamp(1.25rem, 2vw, 1.75rem);
  color: ${colors.neonBlue};
  font-family: ${fonts.primary};
  font-size: clamp(0.75rem, 0.82vw, 0.84rem);
  font-weight: 650;
  letter-spacing: 0.075em;
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
  font-size: clamp(2.5rem, 4.5vw, 4.8rem);
  font-weight: 650;
  letter-spacing: -0.058em;
  line-height: 0.98;
  text-wrap: balance;
`;

export const Description = styled.p`
  max-width: 35rem;
  color: ${colors.textSecondary};
  font-family: ${fonts.primary};
  font-size: clamp(1rem, 1.1vw, 1.1rem);
  line-height: 1.65;
`;

export const ProjectList = styled.ol`
  display: grid;
  gap: clamp(2.75rem, 6vw, 6rem);
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const Project = styled(motion.li)`
  position: relative;
  display: grid;
  min-width: 0;
  border-top: 1px solid rgba(185, 192, 204, 0.2);

  @media (min-width: 900px) {
    grid-template-columns: minmax(0, 1.38fr) minmax(16rem, 0.62fr);
    align-items: stretch;

    &:nth-child(even) {
      grid-template-columns: minmax(16rem, 0.62fr) minmax(0, 1.38fr);
    }

    &:nth-child(even) > div:first-child { order: 2; }
    &:nth-child(even) > div:last-child { order: 1; }
  }
`;

const previewVariant = ($variant: number) => {
  const variants = [
    css`--accent-position: 76% 24%; --plane-rotate: -2deg; --word-x: 4%;`,
    css`--accent-position: 24% 72%; --plane-rotate: 2deg; --word-x: 10%;`,
    css`--accent-position: 82% 72%; --plane-rotate: -1deg; --word-x: 6%;`,
    css`--accent-position: 28% 24%; --plane-rotate: 1.5deg; --word-x: 12%;`,
  ];

  return variants[$variant] ?? variants[0];
};

export const Preview = styled.div<{ $variant: number }>`
  ${({ $variant }) => previewVariant($variant)}
  position: relative;
  min-width: 0;
  aspect-ratio: 16 / 8.7;
  overflow: hidden;
  border-inline: 1px solid rgba(145, 168, 255, 0.16);
  border-bottom: 1px solid rgba(145, 168, 255, 0.16);
  background:
    radial-gradient(circle at var(--accent-position), rgba(108, 99, 255, 0.28), transparent 26%),
    linear-gradient(rgba(145, 168, 255, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(145, 168, 255, 0.06) 1px, transparent 1px),
    #151f31;
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
    ${Project}:hover & > div:last-child { transform: translate3d(0, -4px, 0) rotate(var(--plane-rotate)); border-color: rgba(145, 168, 255, 0.42); }
  }

  @media (max-width: 599px) { aspect-ratio: 1.15 / 1; }

  @media (prefers-reduced-motion: reduce) {
    &::after { transition: none; }
    ${Project}:hover &::after { transform: translate3d(-20%, 0, 0); }
    ${Project}:hover & > div:last-child { transform: rotate(var(--plane-rotate)); }
  }
`;

export const PreviewIndex = styled.span`
  position: absolute;
  z-index: 2;
  top: clamp(1rem, 2vw, 1.5rem);
  left: clamp(1rem, 2vw, 1.5rem);
  color: ${colors.neonBlue};
  font-family: ${fonts.ui};
  font-size: 0.72rem;
  font-weight: 650;
  letter-spacing: 0.1em;
`;

export const ProjectWord = styled.span`
  position: absolute;
  z-index: 1;
  left: var(--word-x);
  bottom: -0.08em;
  max-width: 90%;
  overflow: hidden;
  color: rgba(245, 242, 236, 0.06);
  font-family: ${fonts.heading};
  font-size: clamp(3.25rem, 7vw, 7.75rem);
  font-weight: 650;
  letter-spacing: -0.07em;
  line-height: 0.8;
  white-space: nowrap;
`;

export const InterfacePlane = styled.div<{ $variant: number }>`
  position: absolute;
  z-index: 2;
  inset: 15% 9% 13% 14%;
  overflow: hidden;
  border: 1px solid rgba(245, 242, 236, 0.2);
  background: rgba(16, 24, 39, 0.94);
  box-shadow: 0 24px 60px rgba(4, 8, 17, 0.4), 12px 16px 44px rgba(108, 99, 255, 0.1);
  transform: rotate(var(--plane-rotate));
  transition: transform 260ms ease, border-color 260ms ease;

  ${({ $variant }) => $variant % 2 === 1 && css`inset: 13% 14% 15% 9%;`}

  @media (max-width: 599px) { inset: 17% 7% 12% 9%; }
  @media (prefers-reduced-motion: reduce) { transition: none; }
`;

export const InterfaceHeader = styled.div`
  height: 12%;
  min-height: 24px;
  padding-inline: 4%;
  display: flex;
  align-items: center;
  gap: 5px;
  border-bottom: 1px solid rgba(185, 192, 204, 0.13);
  background: #141e30;

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

  i { height: clamp(5px, 0.7vw, 9px); background: rgba(245, 242, 236, 0.68); }
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
  padding: clamp(1.5rem, 3vw, 3rem);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  border-bottom: 1px solid rgba(185, 192, 204, 0.2);
  background: rgba(20, 30, 48, 0.52);

  @media (max-width: 899px) { min-height: 11rem; }
  @media (max-width: 599px) { min-height: 9.5rem; padding-inline: 1.25rem; }
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
  font-size: clamp(1.65rem, 2.8vw, 2.75rem);
  font-weight: 650;
  letter-spacing: -0.05em;
  line-height: 1;
`;

export const ProjectCategory = styled.p`
  margin-top: 0.75rem;
  color: ${colors.textSecondary};
  font-family: ${fonts.primary};
  font-size: clamp(0.88rem, 1vw, 0.98rem);
  line-height: 1.45;
`;
