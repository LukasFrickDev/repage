import styled from 'styled-components';
import { colors, fonts, breakpoints } from '../../styles/globalStyles';
import { hexToRgba } from '../../utils/colors';

export const Wrapper = styled.div`
  min-height: 100vh;
  background: ${colors.background};
  display: flex;
  flex-direction: column;
`;

export const Section = styled.section`
  width: 100%;
  max-width: 1160px;
  margin: 0 auto;
  padding: 5rem 1.5rem 3.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rem;
  @media (max-width: ${breakpoints.tablet}) {
    padding: 4rem 1rem 3rem;
    gap: 3rem;
  }
`;

export const IntroGrid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;
  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: stretch;
  }
`;

export const HeroCard = styled.article`
  position: relative;
  border-radius: 20px;
  padding: 2.75rem;
  background: linear-gradient(135deg, #14151b, #0e1015 60%, #08090c);
  border: 1px solid ${colors.gridLine};
  color: ${colors.white};
  overflow: hidden;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  box-shadow:
    0 0 0 1px #1b1c20,
    0 18px 38px -22px ${colors.neonBlue};
  @media (max-width: ${breakpoints.tablet}) {
    padding: 2.2rem;
    gap: 1.6rem;
  }
  &::before {
    content: '';
    position: absolute;
    inset: 0;

    mix-blend-mode: screen;
    pointer-events: none;
    opacity: 0.68;
  }
  &::after {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    border: 1px solid ${hexToRgba(colors.highlight, 0.15)};
    opacity: 0.45;
    pointer-events: none;
  }
`;

export const HeroAside = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  height: 100%;
`;

export const HeroAsideCard = styled.article`
  position: relative;
  border-radius: 20px;
  padding: 2.4rem;
  background: linear-gradient(150deg, #11121a, #0b0c12 70%, #08090d);
  border: 1px solid ${colors.gridLine};
  color: ${colors.white};
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  isolation: isolate;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(
        circle at 20% 15%,
        ${hexToRgba(colors.neonBlue, 0.08)},
        transparent 60%
      ),
      radial-gradient(
        circle at 85% 35%,
        ${hexToRgba(colors.highlight, 0.06)},
        transparent 65%
      );
    mix-blend-mode: screen;
    pointer-events: none;
    opacity: 0.65;
  }
  &::after {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    border: 1px solid ${hexToRgba(colors.highlight, 0.13)};
    opacity: 0.4;
    pointer-events: none;
  }
`;

export const HeroAsideBadge = styled.span`
  align-self: flex-start;
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: linear-gradient(
    120deg,
    ${hexToRgba(colors.neonBlue, 0.15)},
    transparent 70%
  );
  border: 1px solid ${hexToRgba(colors.neonBlue, 0.33)};
  color: ${colors.white};
`;

export const HeroAsideTitle = styled.h2`
  margin: 0;
  font-family: ${fonts.heading};
  font-size: 1.7rem;
  color: ${colors.white};
  letter-spacing: -0.01em;
`;

export const HeroAsideText = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: ${colors.textSecondary};
  line-height: 1.6;
  max-width: 28rem;
`;

export const HeroAsidePanel = styled.div`
  border-radius: 14px;
  padding: 1.4rem;
  border: 1px solid ${colors.gridLine};
  background: rgba(12, 13, 18, 0.85);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow:
    0 0 0 1px #1b1c21,
    0 18px 32px -28px ${colors.neonBlue};
`;

export const HeroAsideList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  li {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 0.9rem;
    color: ${colors.white};
    letter-spacing: 0.01em;
    svg {
      width: 1.05rem;
      height: 1.05rem;
      color: ${colors.neonBlue};
    }
  }
`;

export const HeroAsideNote = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: ${colors.textSecondary};
  line-height: 1.5;
`;

export const HeroAsideStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
  @media (prefers-reduced-motion: reduce) {
    &,
    * {
      transition: none !important;
      animation: none !important;
    }
  }
`;

export const HeroAsideStat = styled.div`
  border-radius: 14px;
  border: 1px solid ${colors.gridLine};
  background: rgba(10, 11, 16, 0.85);
  padding: 1rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  box-shadow:
    0 0 0 1px #1a1b20,
    0 12px 24px -18px ${colors.neonBlue};
  transform: translateY(0);
  transition:
    transform 0.4s ease,
    box-shadow 0.4s ease,
    border-color 0.4s ease;
  &:hover {
    transform: translateY(-4px);
    border-color: ${colors.neonBlue};
    box-shadow:
      0 14px 28px -18px ${colors.neonBlue},
      0 0 0 1px ${colors.neonBlue};
  }
  @media (prefers-reduced-motion: reduce) {
    transform: none;
  }
  strong {
    font-size: 1.35rem;
    font-family: ${fonts.heading};
    color: ${colors.white};
    letter-spacing: -0.01em;
  }
  span {
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${colors.textSecondary};
  }
`;

export const HeroAsideLogo = styled.div`
  margin: 1rem auto 0;
  padding: 1rem 1.5rem;
  color: ${colors.textSecondary};
  font-size: 0.85rem;
  img {
    width: 100px;
    height: 100px;
    display: block;
  }
`;

export const ChannelsSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2.2rem;
`;

export const Badge = styled.span`
  align-self: flex-start;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
  font-weight: 600;
  background: linear-gradient(
    120deg,
    ${hexToRgba(colors.highlight, 0.25)},
    ${hexToRgba(colors.neonBlue, 0.15)}
  );
  border: 1px solid ${colors.highlight};
  color: ${colors.white};
  box-shadow:
    0 0 0 1px ${hexToRgba(colors.neonBlue, 0.33)} inset,
    0 0 12px -4px ${colors.neonBlue};
`;

export const HeroTitle = styled.h1`
  margin: 0;
  font-family: ${fonts.heading};
  font-size: clamp(2.4rem, 5vw, 3.6rem);
  line-height: 1.1;
  background: linear-gradient(
    90deg,
    ${colors.white} 0%,
    ${colors.neonBlue} 60%,
    ${colors.highlight} 100%
  );
  -webkit-background-clip: text;
  color: transparent;
`;

export const HeroDescription = styled.p`
  font-size: 1.05rem;
  color: ${colors.textSecondary};
  line-height: 1.6;
  max-width: 36rem;
  margin: 0;
`;

export const HighlightList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  li {
    opacity: 0;
    transform: translateY(12px);
    animation: fadeList 0.6s ease forwards;
    animation-delay: calc(var(--item-index, 0) * 0.12s);
  }
  @keyframes fadeList {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    li {
      opacity: 1;
      transform: none;
      animation: none;
    }
  }
`;

export const HighlightItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 0.95rem;
  color: ${colors.white};
  letter-spacing: 0.01em;
`;

export const HighlightDot = styled.span`
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    ${colors.highlight} 0%,
    ${colors.neonBlue} 70%
  );
`;

export const CalloutRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

export const ResponseTime = styled.span`
  max-width: 220px;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  font-size: 0.78rem;
  color: ${colors.textSecondary};
  background: rgba(15, 17, 23, 0.6);
  border: 1px solid ${colors.gridLine};
  text-align: center;
  margin: 0 auto;
`;

export const CTAGroup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.9rem;
  align-items: center;
`;

export const SecondaryLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: ${colors.neonBlue};
  text-decoration: none;
  transition: color 0.25s ease;
  &:hover {
    color: ${colors.highlightStrong};
  }
`;

export const ChannelsHeader = styled.div`
  margin: 0 auto;
  max-width: 800px;
  opacity: 0;
  animation: fadeUp 0.8s ease forwards;
  @keyframes fadeUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const ChannelsTitle = styled.h2`
  margin: 0;
  font-family: ${fonts.heading};
  font-size: clamp(2rem, 4vw, 2.6rem);
  color: ${colors.white};
  text-align: center;
  line-height: 1.1;
  margin-bottom: 1rem;
`;

export const ChannelsSubtitle = styled.p`
  margin: 0 auto;
  font-size: 1rem;
  max-width: 620px;
  color: ${colors.textSecondary};
  line-height: 1.55;
  text-align: center;
`;

export const ChannelsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.2rem;
  @media (prefers-reduced-motion: reduce) {
    &,
    * {
      transition: none !important;
      animation: none !important;
    }
  }
`;

export const ContactCard = styled.a`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1.05rem;
  padding: 1.4rem 1.45rem;
  border-radius: 18px;
  background: linear-gradient(170deg, #13141a, #0e0f14 65%, #090a0f);
  border: 1px solid ${colors.gridLine};
  color: ${colors.white};
  text-decoration: none;
  overflow: hidden;
  isolation: isolate;
  box-shadow:
    0 0 0 1px #1c1d22,
    0 18px 26px -24px ${colors.neonBlue};
  transform: translateY(0);
  transition:
    transform 0.45s ease,
    box-shadow 0.45s ease,
    border-color 0.45s ease,
    background 0.45s ease;
  opacity: 0;
  animation: cardFade 0.8s ease forwards;
  animation-delay: var(--card-delay, 0s);
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at 25% 20%,
      ${hexToRgba(colors.neonBlue, 0.13)},
      transparent 60%
    );
    opacity: 0.55;
    mix-blend-mode: screen;
    transition: opacity 0.35s ease;
    pointer-events: none;
  }
  &:hover {
    transform: translateY(-4px);
    border-color: ${colors.neonBlue};
    box-shadow:
      0 14px 12px -20px ${colors.neonBlue},
      0 0 0 1px ${hexToRgba(colors.neonBlue, 0.53)};
  }
  &:hover::before {
    opacity: 0.85;
  }
  &:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 2px ${colors.neonBlue},
      0 0 0 6px ${hexToRgba(colors.highlight, 0.33)};
  }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    transform: none;
    opacity: 1;
    animation: none;
  }

  @keyframes cardFade {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const ContactIcon = styled.span`
  width: 3rem;
  height: 3rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 1.4rem;
    height: 1.4rem;
    color: ${colors.highlightStrong};
  }
`;

export const ContactContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const ContactLabel = styled.span`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${colors.textSecondary};
  font-weight: 600;
`;

export const ContactValue = styled.span`
  font-size: 1.05rem;
  font-weight: 600;
  color: ${colors.white};
  font-family: ${fonts.primary};
  letter-spacing: 0.01em;
`;

export const ContactHelper = styled.span`
  font-size: 0.8rem;
  color: ${colors.textSecondary};
`;

export const ContactArrow = styled.span`
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.textSecondary};
  svg {
    width: 1.1rem;
    height: 1.1rem;
  }
`;
