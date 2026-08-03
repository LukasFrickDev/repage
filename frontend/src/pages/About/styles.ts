import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { colors, fonts, breakpoints } from '../../styles/globalStyles';

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px -14px ${colors.highlightStrong}aa;
    transform: translateZ(0);
  }
  50% {
    box-shadow: 0 0 40px -12px ${colors.highlightStrong}dd;
    transform: translateZ(6px);
  }
`;

const verticalFlow = keyframes`
  0% {
    opacity: 0.25;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    opacity: 0.25;
  }
`;

const horizontalFlow = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
`;

export const Wrapper = styled.div`
  min-height: 100vh;
  background: ${colors.background};
`;

export const Section = styled.section`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 1rem 0;
  @media (max-width: ${breakpoints.tablet}) {
    padding: 3rem 1rem;
  }
`;

export const Hero = styled(motion.div)`
  text-align: center;
  margin-bottom: 4rem;
`;

export const Title = styled.h1`
  max-width: 48rem;
  margin: 0 auto;
  font-size: 2.5rem;
  font-weight: bold;
  font-family: ${fonts.heading};
  color: ${colors.white};
  margin-bottom: 1rem;
  line-height: 1;
  @media (min-width: ${breakpoints.tablet}) {
    font-size: 3.75rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1.25rem;
  color: ${colors.textSecondary};
  max-width: 42rem;
  margin: 3rem auto 0;
  font-family: ${fonts.primary};
`;

export const GlassBox = styled(motion.div)`
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(8px);
  border-radius: 0.75rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 16px 0 rgba(109, 40, 217, 0.08);
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  @media (min-width: ${breakpoints.tablet}) {
    flex-direction: row;
    align-items: flex-start;
    gap: 3rem;
  }
`;

export const GlassAside = styled.aside`
  flex: 0 0 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  @media (max-width: ${breakpoints.tablet}) {
    flex: none;
    width: 100%;
    margin-bottom: 2rem;
  }
`;

export const GithubAvatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid ${colors.highlight};
  box-shadow: 0 0 16px 0 ${colors.highlightStrong}55;
`;

export const GithubName = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.white};
  margin: 0;
  text-align: center;
`;

export const GithubBio = styled.p`
  font-size: 1rem;
  color: ${colors.textSecondary};
  text-align: center;
  margin: 0;
`;

export const GithubStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
`;

export const GithubStat = styled.div`
  font-size: 0.95rem;
  color: ${colors.textSecondary};
  span {
    color: ${colors.highlightStrong};
    font-weight: 600;
    margin-left: 0.25em;
  }
`;

export const AboutText = styled.div`
  font-size: 1.125rem;
  color: ${colors.white}E6;
  line-height: 1.7;
  font-family: ${fonts.primary};
  span {
    color: ${colors.highlightStrong};
    font-weight: 600;
    &.primary {
      color: ${colors.highlight};
    }
  }
  em,
  i {
    color: ${colors.textSecondary};
    font-style: italic;
  }
`;

export const ProcessSection = styled.div`
  max-width: 1200px;
  margin: 0 auto 4rem auto;
`;

export const ProcessHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

export const ProcessTitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: ${colors.white};
  font-family: ${fonts.heading};
`;

export const ProcessSubtitle = styled.p`
  font-size: 1.125rem;
  color: ${colors.textSecondary};
  font-family: ${fonts.primary};
  padding-bottom: 2rem;
`;

export const ProcessGridMotion = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: stretch;
  padding: 0.25rem 0;

  &::before {
    content: '';
    position: absolute;
    top: 3.2rem;
    bottom: 0.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    background: linear-gradient(
      180deg,
      ${colors.highlightStrong}55 0%,
      transparent 90%
    );
    pointer-events: none;
    animation: ${verticalFlow} 6s ease-in-out infinite;
    @media (min-width: ${breakpoints.tablet}) {
      display: none;
    }
  }

  &::after {
    content: '';
    position: absolute;
    top: 3rem;
    left: 5%;
    right: 5%;
    height: 2px;
    background: repeating-linear-gradient(
      90deg,
      ${colors.neonBlue}40 0 18px,
      transparent 18px 34px
    );
    border-radius: 999px;
    pointer-events: none;
    opacity: 0.55;
    filter: drop-shadow(0 0 12px ${colors.neonBlue}33);
    display: none;
    background-size: 220% 100%;
    animation: ${horizontalFlow} 18s linear infinite;
    @media (min-width: ${breakpoints.desktop}) {
      display: block;
    }
  }

  @media (min-width: ${breakpoints.tablet}) {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;
  }

  @media (min-width: ${breakpoints.desktop}) {
    flex-wrap: nowrap;
    justify-content: space-between;
    gap: 2.5rem;
    padding: 0.5rem 1rem;
  }
`;

export const StacksSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const StacksHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

export const StacksTitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: ${colors.white};
  font-family: ${fonts.heading};
`;

export const StacksSubtitle = styled.p`
  font-size: 1.125rem;
  color: ${colors.textSecondary};
  font-family: ${fonts.primary};
`;

export const BadgesBox = styled.div`
  background: rgba(255, 255, 255, 0.04);
  border-radius: 0.75rem;
  padding: 2rem;
  margin-bottom: 2rem;
`;

export const BadgesTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: ${colors.white};
  text-align: center;
`;

export const BadgesGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
`;

export const StackBadge = styled(motion.div)<{ accent: string }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  background: #18181b;
  border: 1px solid ${({ accent }) => `${accent}55`};
  max-width: 320px;
  width: 100%;
  box-shadow: 0 6px 18px -10px ${({ accent }) => `${accent}aa`};
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(4px);
  animation: ${pulseGlow} 6s ease-in-out infinite;
  &:hover {
    transform: translateY(-6px) scale(1.01) rotateX(6deg) rotateY(-4deg);
    border-color: ${({ accent }) => accent};
    box-shadow: 0 18px 28px -14px ${({ accent }) => `${accent}dd`};
  }
  &::after {
    content: '';
    position: absolute;
    inset: 2px;
    border-radius: inherit;
    background: radial-gradient(
      circle at top right,
      ${({ accent }) => `${accent}33`},
      transparent 55%
    );
    opacity: 0.6;
    pointer-events: none;
  }
`;

export const StackIcon = styled.span<{ accent: string }>`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.75rem;
  background: ${({ accent }) => `${accent}26`};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ accent }) => accent};
  box-shadow: inset 0 0 0 1px ${({ accent }) => `${accent}66`};
`;

export const StackContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const StackName = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.white};
  font-family: ${fonts.primary};
`;

export const StackDescription = styled.span`
  font-size: 0.9rem;
  color: ${colors.textSecondary};
  line-height: 1.4;
`;

export const StatsBox = styled.div`
  background: rgba(255, 255, 255, 0.04);
  border-radius: 0.75rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 12px 32px -18px ${colors.highlightStrong}aa;
`;

export const StatsTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: ${colors.white};
  text-align: center;
`;

export const StatsImage = styled(motion.img)`
  display: block;
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 12px 24px -16px ${colors.highlightStrong}dd;
  background: rgba(13, 13, 13, 0.85);
`;

export const CTASection = styled.div`
  max-width: 800px;
  margin: 0 auto 4rem auto;
`;

export const CTAGlass = styled.div`
  background: transparent;
  border-radius: 0.75rem;
  padding: 2rem 2rem 3rem 2rem;
`;

export const CTAText = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

export const CTATitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: ${colors.white};
  font-family: ${fonts.heading};
`;

export const CTASubtitle = styled.p`
  font-size: 1.125rem;
  color: ${colors.textSecondary};
  font-family: ${fonts.primary};
`;

export const CTAButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  @media (min-width: ${breakpoints.mobile}) {
    flex-direction: row;
    gap: 2rem;
  }
`;
