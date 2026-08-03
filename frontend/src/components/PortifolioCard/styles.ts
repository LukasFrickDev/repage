import styled from 'styled-components';
import { motion } from 'framer-motion';
import { colors, fonts } from '../../styles/globalStyles';

export const StyledLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-family: ${fonts.primary};
  font-weight: 600;
  color: ${colors.highlight};
  background: none;
  border: none;
  text-decoration: none;
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  transition:
    background 0.2s,
    color 0.2s;
  cursor: pointer;
  &:hover {
    background: ${colors.highlight};
    color: ${colors.white};
  }
`;

export const CardMotion = styled(motion.div)`
  height: 100%;
`;

export const Card = styled.article.attrs({ className: 'portfolio-card' })`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 14px;
  padding: 0.1px; /* gradient border trick */
  background: linear-gradient(145deg, #16171c, #0e0f12 60%, #0a0b0e);
  border: 1px solid ${colors.gridLine};
  color: ${colors.white};
  font-family: ${fonts.primary};
  box-shadow:
    0 0 0 1px #1f2024,
    0 4px 14px -4px #000,
    0 0 26px -12px ${colors.neonBlue}33;
  overflow: hidden;
  isolation: isolate;
  transition:
    box-shadow 0.35s ease,
    border-color 0.35s ease,
    transform 0.35s ease;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 30% 25%, ${colors.neonBlue}18, transparent 60%),
      linear-gradient(120deg, ${colors.highlight}12, transparent 42%);
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
      0 8px 24px -6px ${colors.neonBlue}55,
      0 0 40px -10px ${colors.highlight}55;
    border-color: ${colors.neonBlue};
  }
  &:hover::before {
    opacity: 0.75;
  }
  &:hover::after {
    opacity: 0.55;
    box-shadow: 0 0 0 2px ${colors.neonBlue}55 inset;
  }

  &:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 2px ${colors.neonBlue},
      0 0 0 6px ${colors.highlight}55;
  }

  @keyframes borderPulseCard {
    0% {
      box-shadow:
        0 0 0 1px #1f2024,
        0 4px 14px -4px #000,
        0 0 26px -12px ${colors.neonBlue}22;
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
        0 0 26px -12px ${colors.neonBlue}22;
    }
  }
  animation: borderPulseCard 9s ease-in-out infinite;
`;

export const CardImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 12rem;
  overflow: hidden;
  border-radius: 12px;
  background: linear-gradient(160deg, #14151a, #101116 70%);
  isolation: isolate;
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at 65% 35%,
      ${colors.neonBlue}30,
      transparent 65%
    );
    mix-blend-mode: overlay;
    pointer-events: none;
    opacity: 0.35;
    transition: opacity 0.45s ease;
  }
  ${Card}:hover &::after {
    opacity: 0.6;
  }
`;

export const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition:
    transform 0.6s ease,
    filter 0.6s ease;
  ${Card}:hover & {
    transform: scale(1.06);
    filter: brightness(1.12) saturate(1.05);
  }
`;

export const CardImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    ${colors.background} 75%,
    transparent 100%
  );
  opacity: 0.55;
`;

export const FeaturedBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 2;
  filter: drop-shadow(0 0 6px ${colors.neonBlue}55);
`;

export const CardHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  padding: 1.35rem 1.4rem 0.9rem;
`;

export const CardTitle = styled.h3`
  font-size: 1.22rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
  margin: 0;
  font-family: ${fonts.heading};
  background: linear-gradient(
    90deg,
    ${colors.white} 0%,
    ${colors.neonBlue} 50%,
    ${colors.highlight} 100%
  );
  -webkit-background-clip: text;
  color: transparent;
`;

export const CardDescription = styled.p`
  font-size: 0.9rem;
  color: ${colors.textSecondary};
  margin: 0.45rem 0 0 0;
  line-clamp: 2;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-wrap: balance;
`;

export const CardContent = styled.div`
  flex: 1;
  padding: 0 1.4rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

export const TechList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
`;

export const CardFooter = styled.footer`
  display: flex;
  gap: 0.6rem;
  padding: 0 1.4rem 1.4rem;
  margin-top: auto;
  align-items: center;
`;
