import { motion } from 'framer-motion';
import styled, { keyframes } from 'styled-components';
import { colors, fonts } from '../../styles/globalStyles';

const lightShift = keyframes`
  0%, 100% { opacity: 0.58; transform: translate3d(0, 0, 0) scale(1); }
  50% { opacity: 0.8; transform: translate3d(-1.5%, 1%, 0) scale(1.025); }
`;

export const Page = styled.main`
  min-width: 0;
  overflow-x: clip;
  background: ${colors.background};
`;

export const Hero = styled.section`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: clamp(7.25rem, 10vw, 9.5rem) clamp(1rem, 4vw, 4.5rem) clamp(3.25rem, 6vw, 6rem);
  background:
    radial-gradient(circle at 76% 30%, rgba(108, 99, 255, 0.11), transparent 32%),
    radial-gradient(circle at 92% 74%, rgba(145, 168, 255, 0.08), transparent 29%),
    ${colors.background};

  @media (max-width: 1279px) {
    height: auto;
    min-height: 0;
    padding-top: clamp(6.25rem, 9vw, 7rem);
    padding-bottom: clamp(2rem, 4vw, 3rem);
  }

  &::after {
    content: '';
    position: absolute;
    z-index: -2;
    width: clamp(22rem, 48vw, 60rem);
    aspect-ratio: 1;
    right: -12%;
    top: 4%;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(108, 99, 255, 0.12), rgba(145, 168, 255, 0.035) 42%, transparent 70%);
    filter: blur(10px);
    animation: ${lightShift} 16s ease-in-out infinite;
    pointer-events: none;
  }

  @media (max-width: 767px) {
    height: auto;
    min-height: 0;
    padding-top: 6.25rem;
    padding-bottom: 2rem;
  }
  @media (prefers-reduced-motion: reduce) { &::after { animation: none; } }
`;

export const HeroBackdrop = styled.div`
  position: absolute;
  z-index: -1;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(145, 168, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(145, 168, 255, 0.05) 1px, transparent 1px);
  background-size: clamp(32px, 4vw, 64px) clamp(32px, 4vw, 64px);
  mask-image: linear-gradient(to right, transparent 6%, rgba(0, 0, 0, 0.2) 40%, #000 100%);
  opacity: 0.72;

  @media (max-width: 767px) { opacity: 0.4; mask-image: linear-gradient(to bottom, transparent 8%, #000 58%, #000 100%); }
`;

export const HeroInner = styled.div`
  position: relative;
  z-index: 1;
  width: min(100%, 1440px);
  margin-inline: auto;
  display: block;

  @media (min-width: 1280px) {
    display: grid;
    align-items: center;
    gap: clamp(2rem, 5vw, 6rem);
    grid-template-columns: minmax(0, 0.98fr) minmax(500px, 0.82fr);
  }
`;

export const Copy = styled.div`
  position: relative;
  z-index: 2;
  min-width: 0;
  max-width: 760px;

  @media (min-width: 1024px) and (max-width: 1279px) {
    width: min(68%, 760px);
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    width: min(72%, 650px);
  }

  @media (max-width: 1279px) {
    &::before {
      content: '';
      position: absolute;
      z-index: -1;
      inset: -2rem -3rem;
      background: radial-gradient(ellipse at 32% 48%, rgba(16, 24, 39, 0.98) 0%, rgba(16, 24, 39, 0.82) 56%, transparent 78%);
      pointer-events: none;
    }
  }

  @media (max-width: 767px) {
    width: 100%;

    &::before {
      inset: -1.5rem -1rem;
      background: linear-gradient(90deg, rgba(16, 24, 39, 0.98) 0%, rgba(16, 24, 39, 0.88) 67%, rgba(16, 24, 39, 0.42) 100%);
    }
  }
`;

export const Eyebrow = styled(motion.p)`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: clamp(1.15rem, 2vw, 1.65rem);
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
    box-shadow: 0 0 10px rgba(145, 168, 255, 0.35);
  }
`;

export const Title = styled(motion.h1)`
  max-width: 11.5ch;
  color: ${colors.white};
  font-family: ${fonts.primary};
  font-size: clamp(3rem, 6vw, 6.25rem);
  font-weight: 650;
  letter-spacing: -0.067em;
  line-height: 0.94;
  text-wrap: balance;

  @media (max-width: 767px) { max-width: 11ch; letter-spacing: -0.06em; line-height: 0.96; }
`;

export const Details = styled(motion.div)`
  min-width: 0;
`;

export const Description = styled.p`
  max-width: 38rem;
  margin-top: clamp(1.4rem, 2.4vw, 2rem);
  color: ${colors.textSecondary};
  font-family: ${fonts.primary};
  font-size: clamp(1rem, 1.15vw, 1.125rem);
  line-height: 1.62;
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: clamp(1.75rem, 3vw, 2.5rem);

  @media (max-width: 767px) { display: grid; grid-template-columns: 1fr; }
`;

const ctaBase = `
  min-height: 3.25rem;
  padding: 0.78rem 1.15rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  border-radius: 12px;
  font-family: ${fonts.primary};
  font-size: 0.94rem;
  font-weight: 650;
  line-height: 1;
  text-decoration: none;
  transition: transform 180ms ease, border-color 180ms ease, background 180ms ease, box-shadow 180ms ease;

  svg { flex: 0 0 auto; transition: transform 180ms ease; }
  &:hover svg { transform: translateX(3px); }
  &:hover { transform: translateY(-1px); }
`;

export const PrimaryCta = styled.a`
  ${ctaBase}
  border: 1px solid transparent;
  background: linear-gradient(105deg, ${colors.highlight}, ${colors.neonBlue});
  color: ${colors.background};
  box-shadow: 0 12px 32px rgba(108, 99, 255, 0.2);

  &:hover { box-shadow: 0 15px 34px rgba(108, 99, 255, 0.3); }

  @media (max-width: 767px) { width: 100%; }
`;

export const SecondaryCta = styled.a`
  ${ctaBase}
  border: 1px solid rgba(245, 242, 236, 0.27);
  background: transparent;
  color: ${colors.white};

  &:hover { border-color: rgba(145, 168, 255, 0.68); background: rgba(145, 168, 255, 0.055); }

  @media (max-width: 767px) { width: 100%; }
`;

export const Visual = styled.div`
  min-width: 0;
  width: 100%;

  @media (min-width: 1280px) {
    width: clamp(420px, 43vw, 620px);
    max-width: 100%;
    justify-self: end;
  }

  @media (min-width: 1024px) and (max-width: 1279px) {
    position: absolute;
    right: 0;
    top: 50%;
    z-index: 1;
    width: clamp(380px, 48vw, 620px);
    opacity: 0.72;
    transform: translate3d(0, -50%, 0);
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    position: absolute;
    right: -8vw;
    top: 54%;
    z-index: 1;
    width: clamp(44vw, 54vw, 60vw);
    opacity: 0.52;
    transform: translate3d(0, -50%, 0) scale(0.86);
    transform-origin: right center;
  }

  @media (max-width: 767px) {
    position: absolute;
    right: -46vw;
    top: 44%;
    z-index: 1;
    width: clamp(105vw, 118vw, 130vw);
    opacity: 0.28;
    transform: translate3d(0, -50%, 0);
    pointer-events: none;
  }
`;
