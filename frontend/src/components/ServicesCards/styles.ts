import { motion } from 'framer-motion';
import styled from 'styled-components';
import { colors, fonts, breakpoints } from '../../styles/globalStyles';

export const CardMotion = styled(motion.div)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const SectionMotion = styled(motion.section)`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 0 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const Card = styled.div.attrs({ className: 'service-card' })`
  position: relative;
  border-radius: 14px;
  padding: 0.1px; /* para pseudo gradient border */
  background: linear-gradient(145deg, #16171c, #0e0f12 60%, #0a0b0e);
  color: ${colors.white};
  font-family: ${fonts.primary};
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  isolation: isolate;
  border: 1px solid ${colors.gridLine};
  box-shadow:
    0 0 0 1px #1f2024,
    0 4px 14px -4px #000,
    0 0 28px -12px ${colors.neonBlue}44;
  transition:
    box-shadow 0.35s ease,
    border-color 0.35s ease,
    transform 0.35s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 30% 20%, ${colors.neonBlue}15, transparent 60%),
      linear-gradient(110deg, ${colors.highlight}10, transparent 40%);
    opacity: 0.55;
    mix-blend-mode: overlay;
    pointer-events: none;
    transition: opacity 0.4s ease;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border: 1px solid ${colors.highlight}35;
    border-radius: inherit;
    pointer-events: none;
    opacity: 0.25;
    transition:
      opacity 0.4s ease,
      box-shadow 0.4s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow:
      0 0 0 1px ${colors.neonBlue}cc,
      0 8px 26px -6px ${colors.neonBlue}55,
      0 0 40px -10px ${colors.highlight}55;
    border-color: ${colors.neonBlue};
  }
  &:hover::before {
    opacity: 0.75;
  }
  &:hover::after {
    opacity: 0.6;
    box-shadow: 0 0 0 2px ${colors.neonBlue}55 inset;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 1.5rem;
  @media (max-width: ${breakpoints.mobile}) {
    padding: 1rem;
  }
`;

export const IconWrapper = styled.div`
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    ${colors.highlight}30,
    ${colors.neonBlue}30
  );
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.15rem;
  box-shadow:
    0 0 0 1px ${colors.highlight}55,
    0 0 14px -2px ${colors.neonBlue}aa;
  svg {
    width: 1.55rem;
    height: 1.55rem;
    color: ${colors.highlightStrong};
    filter: drop-shadow(0 0 6px ${colors.neonBlue}88);
  }
`;

export const CardTitle = styled.h3.attrs({ className: 'service-card-title' })`
  font-size: 1.85rem;
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.01em;
  font-family: ${fonts.heading};
  margin: 0;
  background: linear-gradient(
    90deg,
    ${colors.white} 0%,
    ${colors.highlightStrong} 100%
  );
  -webkit-background-clip: text;
  color: transparent;
`;

export const CardDescription = styled.p.attrs({
  className: 'service-card-description',
})`
  font-size: 0.95rem;
  color: ${colors.textSecondary};
  font-weight: 400;
  margin: 0;
  line-height: 1.4;
`;

export const CardContent = styled.div`
  padding: 1.5rem;
  padding-top: 0;
  @media (max-width: ${breakpoints.mobile}) {
    padding: 1rem 1rem 0 1rem;
  }
`;

export const FeaturesList = styled.ul`
  list-style: none;
  margin: 1rem 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  li {
    display: flex;
    align-items: center;
    position: relative;
    padding-left: 1.15rem;
    font-size: 0.85rem;
    font-family: ${fonts.primary};
    color: ${colors.white};
    letter-spacing: 0.02em;
    line-height: 1.3;
    animation: borderPulse 7s ease-in-out infinite;
    &:focus-visible {
      outline: none;
      box-shadow:
        0 0 0 2px ${colors.neonBlue},
        0 0 0 6px ${colors.highlight}55;
    }
  }
  li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 50%;
    background: radial-gradient(
      circle at 30% 30%,
      ${colors.highlight} 0%,
      ${colors.neonBlue} 70%
    );
    box-shadow: 0 0 6px ${colors.neonBlue};
  }
  @keyframes borderPulse {
    0% {
      box-shadow:
        0 0 0 1px #1f2024,
        0 4px 14px -4px #000,
        0 0 28px -12px ${colors.neonBlue}22;
    }
    50% {
      box-shadow:
        0 0 0 1px ${colors.neonBlue}66,
        0 4px 18px -4px ${colors.neonBlue}44,
        0 0 34px -10px ${colors.highlight}55;
    }
    100% {
      box-shadow:
        0 0 0 1px #1f2024,
        0 4px 14px -4px #000,
        0 0 28px -12px ${colors.neonBlue}22;
    }
  }
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  padding: 1.5rem;
  padding-top: 0;
  @media (max-width: ${breakpoints.mobile}) {
    padding: 1rem 1rem 0 1rem;
  }
`;
