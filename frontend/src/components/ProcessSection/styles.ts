import { motion } from 'framer-motion';
import styled from 'styled-components';
import { colors, fonts } from '../../styles/globalStyles';

export const Section = styled.section`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: clamp(5rem, 8vw, 8.5rem) clamp(1rem, 4vw, 4.5rem);
  border-top: 1px solid rgba(16, 24, 39, 0.1);
  background: ${colors.white};
  color: ${colors.background};

  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    inset: 0 0 0 auto;
    width: min(48vw, 50rem);
    background:
      linear-gradient(rgba(16, 24, 39, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(16, 24, 39, 0.04) 1px, transparent 1px),
      radial-gradient(circle at 82% 22%, rgba(108, 99, 255, 0.08), transparent 32%);
    background-size: clamp(38px, 4vw, 60px) clamp(38px, 4vw, 60px), clamp(38px, 4vw, 60px) clamp(38px, 4vw, 60px), auto;
    mask-image: linear-gradient(to right, transparent, #000 38%);
    pointer-events: none;
  }

  @media (max-width: 767px) {
    padding-block: clamp(4.25rem, 16vw, 5.5rem);

    &::before {
      width: 100%;
      opacity: 0.62;
      mask-image: linear-gradient(to bottom, #000, transparent 72%);
    }
  }
`;

export const Container = styled.div`
  position: relative;
  z-index: 1;
  width: min(100%, 1440px);
  margin-inline: auto;
`;

export const Heading = styled(motion.div)`
  display: grid;
  align-items: end;
  gap: clamp(1.5rem, 4vw, 5rem);
  margin-bottom: clamp(4rem, 7vw, 7rem);

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
  font-size: clamp(2.5rem, 4.5vw, 4.8rem);
  font-weight: 650;
  letter-spacing: -0.058em;
  line-height: 0.98;
  text-wrap: balance;
`;

export const Description = styled.p`
  max-width: 35rem;
  color: rgba(16, 24, 39, 0.7);
  font-family: ${fonts.primary};
  font-size: clamp(1rem, 1.1vw, 1.1rem);
  line-height: 1.65;
`;

export const Timeline = styled.ol`
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 0;
  padding: 0;
  list-style: none;

  @media (max-width: 767px) {
    display: block;
    padding-left: 0.25rem;

    &::before {
      content: '';
      position: absolute;
      top: 0.75rem;
      bottom: 0.75rem;
      left: 0.72rem;
      width: 1px;
      background: linear-gradient(${colors.highlight}, ${colors.neonBlue} 54%, rgba(16, 24, 39, 0.16));
    }
  }
`;

export const Step = styled(motion.li)`
  position: relative;
  min-width: 0;
  padding-right: clamp(1.5rem, 4vw, 4.5rem);

  &:last-child { padding-right: 0; }

  @media (max-width: 767px) {
    padding: 0 0 clamp(3.5rem, 14vw, 5rem) 3.25rem;

    &:last-child { padding: 0 0 0 3.25rem; }
  }
`;

export const Number = styled.span`
  display: block;
  color: rgba(16, 24, 39, 0.1);
  font-family: ${fonts.heading};
  font-size: clamp(4.5rem, 7vw, 7.5rem);
  font-weight: 650;
  letter-spacing: -0.075em;
  line-height: 0.8;

  @media (max-width: 767px) {
    font-size: clamp(3.75rem, 17vw, 5.25rem);
  }
`;

export const Marker = styled.div`
  position: relative;
  width: calc(100% + clamp(1.5rem, 4vw, 4.5rem));
  height: 1px;
  margin: clamp(1.5rem, 2.5vw, 2.25rem) 0 clamp(2rem, 3vw, 3rem);
  background: linear-gradient(90deg, ${colors.highlight}, ${colors.neonBlue});

  ${Step}:last-child & { width: 100%; }

  span {
    position: absolute;
    top: 50%;
    left: 0;
    width: 11px;
    height: 11px;
    border: 2px solid ${colors.highlight};
    border-radius: 50%;
    background: ${colors.white};
    box-shadow: 0 0 0 5px rgba(108, 99, 255, 0.08);
    transform: translateY(-50%);
  }

  @media (max-width: 767px) {
    position: absolute;
    top: 0.72rem;
    left: 0;
    width: 1.5rem;
    margin: 0;
    background: linear-gradient(90deg, ${colors.highlight}, rgba(108, 99, 255, 0.16));

    span {
      left: 0.2rem;
      width: 10px;
      height: 10px;
    }
  }
`;

export const StepContent = styled.div`
  max-width: 23rem;
`;

export const StepTitle = styled.h3`
  font-family: ${fonts.heading};
  font-size: clamp(1.35rem, 2vw, 1.8rem);
  font-weight: 650;
  letter-spacing: -0.04em;
  line-height: 1.08;
`;

export const StepDescription = styled.p`
  margin-top: 0.9rem;
  color: rgba(16, 24, 39, 0.68);
  font-family: ${fonts.primary};
  font-size: clamp(0.95rem, 1vw, 1rem);
  line-height: 1.62;
`;
