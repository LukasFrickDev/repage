import { motion } from 'framer-motion';
import styled from 'styled-components';
import { colors, fonts } from '../../styles/globalStyles';

export const Section = styled.section`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: clamp(5rem, 8vw, 8.5rem) clamp(1rem, 4vw, 4.5rem);
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
    background-size: clamp(36px, 4vw, 60px) clamp(36px, 4vw, 60px), clamp(36px, 4vw, 60px) clamp(36px, 4vw, 60px), auto;
    mask-image: linear-gradient(to right, transparent, #000 32%);
    pointer-events: none;
  }

  @media (max-width: 767px) {
    padding-block: clamp(4.25rem, 16vw, 5.5rem);

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
  width: min(100%, 1440px);
  margin-inline: auto;
  display: grid;
  gap: clamp(3rem, 6vw, 7rem);

  @media (min-width: 1100px) {
    grid-template-columns: minmax(0, 0.78fr) minmax(34rem, 1fr);
    align-items: start;
  }
`;

export const Intro = styled(motion.div)`
  max-width: 39rem;

  @media (min-width: 1100px) {
    position: sticky;
    top: 7rem;
  }
`;

export const Eyebrow = styled.p`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: clamp(1.25rem, 2vw, 1.75rem);
  color: ${colors.highlight};
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
  max-width: 12ch;
  font-family: ${fonts.heading};
  font-size: clamp(2.5rem, 4.4vw, 4.75rem);
  font-weight: 650;
  letter-spacing: -0.058em;
  line-height: 0.98;
  text-wrap: balance;
`;

export const Description = styled.p`
  max-width: 35rem;
  margin-top: clamp(1.5rem, 2.5vw, 2.25rem);
  color: rgba(16, 24, 39, 0.7);
  font-family: ${fonts.primary};
  font-size: clamp(1rem, 1.1vw, 1.1rem);
  line-height: 1.65;
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
  padding: clamp(1.4rem, 2.4vw, 2rem) clamp(0.75rem, 1.8vw, 1.5rem);
  display: grid;
  grid-template-columns: 2.5rem minmax(0, 1fr) auto;
  align-items: start;
  gap: clamp(1rem, 2vw, 1.8rem);
  border-top: 1px solid rgba(16, 24, 39, 0.16);
  background: ${({ $featured }) => ($featured
    ? 'linear-gradient(100deg, rgba(108, 99, 255, 0.07), rgba(145, 168, 255, 0.035) 62%, transparent)'
    : 'transparent')};
  transition: transform 200ms ease, background 200ms ease;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translate3d(4px, 0, 0);
      background: linear-gradient(100deg, rgba(108, 99, 255, 0.075), rgba(145, 168, 255, 0.025) 62%, transparent);
    }

    &:hover > span:first-child { transform: scaleY(1); opacity: 1; }
    &:hover > span:last-child { transform: translate3d(3px, 0, 0); color: ${colors.highlight}; }
  }

  @media (max-width: 767px) {
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
  transition: transform 200ms ease, opacity 200ms ease;
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
  font-size: clamp(1.3rem, 1.8vw, 1.7rem);
  font-weight: 650;
  letter-spacing: -0.035em;
  line-height: 1.1;
`;

export const ServiceDescription = styled.p`
  max-width: 38rem;
  margin-top: 0.65rem;
  color: rgba(16, 24, 39, 0.68);
  font-family: ${fonts.primary};
  font-size: clamp(0.94rem, 1vw, 1rem);
  line-height: 1.58;
`;

export const Arrow = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  color: rgba(16, 24, 39, 0.62);
  transition: transform 200ms ease, color 200ms ease;

  @media (max-width: 480px) {
    width: 2rem;
    height: 2rem;
  }

  @media (prefers-reduced-motion: reduce) { transition: none; }
`;
