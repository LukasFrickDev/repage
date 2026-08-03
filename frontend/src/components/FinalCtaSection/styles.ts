import { motion } from 'framer-motion';
import styled from 'styled-components';
import { colors, fonts } from '../../styles/globalStyles';

export const Section = styled.section`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: clamp(5.5rem, 10vw, 10rem) clamp(1rem, 4vw, 4.5rem);
  border-top: 1px solid rgba(145, 168, 255, 0.12);
  background:
    linear-gradient(180deg, rgba(24, 34, 53, 0.96), ${colors.background}),
    ${colors.backgroundSecondary};
  color: ${colors.white};

  &::before {
    content: '';
    position: absolute;
    z-index: -2;
    top: 4%;
    left: 50%;
    width: min(78vw, 72rem);
    height: 92%;
    background:
      radial-gradient(ellipse at center, rgba(108, 99, 255, 0.22), rgba(145, 168, 255, 0.07) 42%, transparent 72%);
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
    background-size: clamp(40px, 4vw, 64px) clamp(40px, 4vw, 64px);
    mask-image: radial-gradient(ellipse at center, #000, transparent 72%);
    pointer-events: none;
  }
`;

export const Convergence = styled.div`
  position: absolute;
  z-index: -1;
  inset: 8% 8% 0;
  clip-path: polygon(20% 0, 80% 0, 100% 100%, 0 100%);
  border-inline: 1px solid rgba(145, 168, 255, 0.08);
  pointer-events: none;

  i {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(transparent, rgba(108, 99, 255, 0.38), transparent 88%);
    transform-origin: top;
  }

  i:first-child { left: 18%; transform: rotate(-8deg); }
  i:nth-child(2) { left: 50%; background: linear-gradient(transparent, rgba(145, 168, 255, 0.42), transparent 88%); }
  i:last-child { right: 18%; transform: rotate(8deg); }

  @media (max-width: 767px) {
    inset-inline: -20%;
    opacity: 0.65;
  }
`;

export const Content = styled(motion.div)`
  position: relative;
  z-index: 1;
  width: min(100%, 66rem);
  margin-inline: auto;
  text-align: center;
`;

export const Eyebrow = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  margin-bottom: clamp(1.25rem, 2vw, 1.75rem);
  color: ${colors.neonBlue};
  font-family: ${fonts.primary};
  font-size: clamp(0.75rem, 0.82vw, 0.84rem);
  font-weight: 650;
  letter-spacing: 0.075em;
  text-transform: uppercase;

  &::before, &::after {
    content: '';
    width: clamp(1.25rem, 3vw, 2.5rem);
    height: 1px;
    background: linear-gradient(90deg, transparent, ${colors.highlight});
  }

  &::after { background: linear-gradient(90deg, ${colors.neonBlue}, transparent); }
`;

export const Title = styled.h2`
  margin-inline: auto;
  font-family: ${fonts.heading};
  font-size: clamp(2.75rem, 5.5vw, 5.75rem);
  font-weight: 650;
  letter-spacing: -0.065em;
  line-height: 0.96;
  text-wrap: balance;
`;

export const Description = styled.p`
  max-width: 39rem;
  margin: clamp(1.5rem, 2.5vw, 2.25rem) auto 0;
  color: ${colors.textSecondary};
  font-family: ${fonts.primary};
  font-size: clamp(1rem, 1.1vw, 1.1rem);
  line-height: 1.65;
`;

export const Cta = styled.button`
  min-height: 3.5rem;
  margin-top: clamp(2rem, 4vw, 3rem);
  padding: 0.9rem 1.35rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  border: 1px solid rgba(245, 242, 236, 0.14);
  border-radius: 12px;
  background: linear-gradient(105deg, ${colors.highlight}, ${colors.neonBlue});
  box-shadow: 0 16px 42px rgba(108, 99, 255, 0.24), 0 0 0 1px rgba(145, 168, 255, 0.1);
  color: ${colors.background};
  font-family: ${fonts.primary};
  font-size: 0.96rem;
  font-weight: 650;
  line-height: 1;
  opacity: 1;
  cursor: default;

  svg { flex: 0 0 auto; }

  @media (max-width: 480px) {
    width: min(100%, 22rem);
  }
`;
