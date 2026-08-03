import { motion } from 'framer-motion';
import styled, { css, keyframes } from 'styled-components';
import { colors, fonts } from '../../styles/globalStyles';

const traceFlow = keyframes`
  from { background-position: 180% 50%; }
  to { background-position: -80% 50%; }
`;

export const Section = styled.section`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: clamp(5rem, 8vw, 8.5rem) clamp(1rem, 4vw, 4.5rem);
  border-top: 1px solid rgba(145, 168, 255, 0.12);
  background:
    radial-gradient(circle at 86% 28%, rgba(108, 99, 255, 0.1), transparent 30%),
    ${colors.background};
  color: ${colors.white};
`;

export const Container = styled.div`
  position: relative;
  width: min(100%, 1440px);
  margin-inline: auto;
  display: grid;
  align-items: center;
  gap: clamp(2rem, 5vw, 6rem);

  @media (min-width: 768px) {
    grid-template-columns: minmax(0, 0.95fr) minmax(18rem, 0.75fr);
  }
`;

export const Content = styled(motion.div)`
  position: relative;
  z-index: 3;
  max-width: 45rem;

  @media (max-width: 767px) {
    &::before {
      content: '';
      position: absolute;
      z-index: -1;
      inset: -2rem -1rem;
      background: linear-gradient(90deg, rgba(16, 24, 39, 0.98), rgba(16, 24, 39, 0.88) 70%, transparent);
      pointer-events: none;
    }
  }
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
  max-width: 12ch;
  font-family: ${fonts.heading};
  font-size: clamp(2.75rem, 5vw, 5.25rem);
  font-weight: 650;
  letter-spacing: -0.065em;
  line-height: 0.96;
  text-wrap: balance;
`;

export const Description = styled.p`
  max-width: 38rem;
  margin-top: clamp(1.5rem, 2.5vw, 2.25rem);
  color: ${colors.textSecondary};
  font-family: ${fonts.primary};
  font-size: clamp(1rem, 1.1vw, 1.1rem);
  line-height: 1.65;
`;

export const Signature = styled.div`
  margin-top: clamp(2.5rem, 4vw, 4rem);
  display: flex;
  align-items: center;
  gap: 0.9rem;
`;

export const SignatureMark = styled.span`
  width: 2px;
  height: 2.8rem;
  flex: 0 0 auto;
  background: linear-gradient(${colors.highlight}, ${colors.neonBlue});
`;

export const SignatureName = styled.strong`
  display: block;
  color: ${colors.white};
  font-family: ${fonts.primary};
  font-size: clamp(0.86rem, 1vw, 0.96rem);
  font-weight: 620;
  line-height: 1.35;
`;

export const SignatureRole = styled.span`
  display: block;
  margin-top: 0.2rem;
  color: rgba(185, 192, 204, 0.68);
  font-family: ${fonts.primary};
  font-size: clamp(0.75rem, 0.85vw, 0.82rem);
  line-height: 1.35;
`;

export const Identity = styled(motion.div)`
  --pointer-x: 0px;
  --pointer-y: 0px;
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 43rem;
  justify-self: end;
  aspect-ratio: 1.08 / 1;
  overflow: hidden;
  border-left: 1px solid rgba(145, 168, 255, 0.15);
  border-right: 1px solid rgba(145, 168, 255, 0.08);
  background: linear-gradient(135deg, rgba(24, 34, 53, 0.78), rgba(16, 24, 39, 0.22));

  @media (max-width: 767px) {
    position: absolute;
    z-index: 1;
    top: -8%;
    right: -38vw;
    width: min(130vw, 34rem);
    height: 116%;
    max-width: none;
    aspect-ratio: auto;
    filter: opacity(0.38);
    border: 0;
    pointer-events: none;
  }
`;

export const TechnicalGrid = styled.div`
  position: absolute;
  inset: 0;
  background:
    linear-gradient(rgba(145, 168, 255, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(145, 168, 255, 0.08) 1px, transparent 1px);
  background-size: 12.5% 12.5%;
  mask-image: linear-gradient(90deg, transparent, #000 28%, #000);
`;

export const Plane = styled.div<{ $position: 'top' | 'bottom' }>`
  position: absolute;
  border: 1px solid rgba(145, 168, 255, 0.16);
  background: linear-gradient(120deg, rgba(108, 99, 255, 0.08), rgba(145, 168, 255, 0.025));

  ${({ $position }) => $position === 'top' ? css`
    top: 11%; right: 4%; width: 44%; height: 16%;
    clip-path: polygon(10% 0, 100% 0, 100% 100%, 0 100%, 0 38%);
  ` : css`
    right: 18%; bottom: 8%; width: 35%; height: 13%;
    clip-path: polygon(0 0, 88% 0, 100% 36%, 100% 100%, 0 100%);
  `}
`;

export const Trace = styled.span<{ $position: 'first' | 'second' | 'third' }>`
  position: absolute;
  z-index: 2;
  height: 1px;
  background: linear-gradient(90deg, rgba(108, 99, 255, 0.08), ${colors.neonBlue}, rgba(145, 168, 255, 0.06));
  background-size: 220% 100%;
  animation: ${traceFlow} 12s linear infinite;

  ${({ $position }) => ({
    first: css`top: 31%; left: 4%; width: 68%;`,
    second: css`top: 58%; right: 0; width: 54%; animation-delay: -4s;`,
    third: css`bottom: 19%; left: 11%; width: 47%; animation-delay: -8s;`,
  })[$position]}

  @media (prefers-reduced-motion: reduce) { animation: none; }
`;

export const SymbolField = styled(motion.div)`
  position: absolute;
  z-index: 1;
  top: 9%;
  right: -9%;
  width: 76%;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  border-left: 1px solid rgba(108, 99, 255, 0.18);
  background:
    radial-gradient(circle at 52% 48%, rgba(108, 99, 255, 0.18), transparent 54%),
    linear-gradient(90deg, rgba(145, 168, 255, 0.035), transparent);
  clip-path: polygon(8% 0, 100% 0, 100% 100%, 0 100%, 0 8%);

  img {
    width: 76%;
    height: 76%;
    opacity: 0.82;
    filter: drop-shadow(0 0 30px rgba(108, 99, 255, 0.24));
  }

  @media (max-width: 767px) {
    top: 8%;
    right: -5%;
    width: 86%;
    opacity: 0.72;
  }
`;

export const SignalPoint = styled.span<{ $position: 'one' | 'two' | 'three' }>`
  position: absolute;
  z-index: 4;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${colors.neonBlue};
  box-shadow: 0 0 0 4px rgba(145, 168, 255, 0.08), 0 0 16px rgba(145, 168, 255, 0.78);
  transition: transform 300ms ease;

  ${({ $position }) => ({
    one: css`top: 30.5%; left: 25%; transform: translate3d(var(--pointer-x), var(--pointer-y), 0);`,
    two: css`top: 57.5%; right: 19%; transform: translate3d(calc(0px - var(--pointer-x)), calc(0px - var(--pointer-y)), 0);`,
    three: css`bottom: 18.5%; left: 42%; transform: translate3d(var(--pointer-y), calc(0px - var(--pointer-x)), 0);`,
  })[$position]}

  @media (max-width: 1099px) { transition: none; }
  @media (prefers-reduced-motion: reduce) { transform: none; transition: none; }
`;

export const EdgeNotation = styled.div`
  position: absolute;
  z-index: 3;
  right: 4%;
  bottom: 4%;
  display: flex;
  gap: 5px;

  i {
    display: block;
    width: clamp(18px, 3vw, 34px);
    height: 3px;
    background: rgba(185, 192, 204, 0.18);
  }

  i:nth-child(2) { width: 9px; background: ${colors.highlight}; }
  i:nth-child(3) { width: 5px; background: ${colors.neonBlue}; }
`;
