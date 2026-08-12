import { motion } from 'framer-motion';
import styled from 'styled-components';
import { breakpoints, colors, fonts, homepageTokens, layout } from '../../styles/theme';

export const Section = styled.section`
  position: relative;
  isolation: isolate;
  min-height: clamp(40rem, 64vw, 54rem);
  overflow: hidden;
  padding: clamp(7rem, 12vw, 12rem) ${homepageTokens.sectionPaddingInline};
  display: grid;
  align-items: center;
  background:
    linear-gradient(112deg, rgba(16, 24, 39, 0.98), rgba(24, 34, 53, 0.93)),
    ${colors.backgroundSecondary};
  color: ${colors.white};

  &::before {
    content: '';
    position: absolute;
    left: 0;
    bottom: 12%;
    width: 42%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(145, 168, 255, 0.38));
  }

  @media (max-width: ${breakpoints.tabletMax}) {
    min-height: 42rem;
    align-items: end;
  }
`;

export const Container = styled.div`
  position: relative;
  z-index: 3;
  width: ${layout.containerWidth};
  margin-inline: auto;
`;

export const Content = styled.div`
  width: min(100%, 49rem);
`;

export const Eyebrow = styled.p`
  margin-bottom: ${homepageTokens.eyebrowMarginBottom};
  color: ${colors.neonBlue};
  font-family: ${fonts.primary};
  font-size: ${homepageTokens.eyebrowSize};
  font-weight: 650;
  letter-spacing: ${homepageTokens.eyebrowTracking};
  text-transform: uppercase;
`;

export const Title = styled.h2`
  max-width: 13ch;
  font-family: ${fonts.heading};
  font-size: clamp(3.2rem, 5.7vw, 6.4rem);
  font-weight: 610;
  letter-spacing: -0.068em;
  line-height: 0.92;
  text-wrap: balance;
`;

export const Description = styled.p`
  max-width: 39rem;
  margin: clamp(2rem, 4vw, 3.2rem) 0 0 clamp(0rem, 5vw, 6rem);
  color: ${colors.textSecondary};
  font-family: ${fonts.primary};
  font-size: clamp(1rem, 1.25vw, 1.14rem);
  line-height: 1.68;

  @media (max-width: ${breakpoints.tabletMax}) {
    margin-left: 0;
  }
`;

export const Signature = styled.div`
  margin: clamp(2.5rem, 5vw, 4.5rem) 0 0 clamp(0rem, 5vw, 6rem);
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: ${breakpoints.tabletMax}) {
    margin-left: 0;
  }
`;

export const SignatureMark = styled.span`
  width: 2px;
  height: 3.2rem;
  flex: 0 0 auto;
  background: linear-gradient(${colors.highlight}, ${colors.neonBlue});
`;

export const SignatureName = styled.strong`
  display: block;
  color: ${colors.white};
  font-family: ${fonts.primary};
  font-size: 0.94rem;
  font-weight: 620;
  line-height: 1.35;
`;

export const SignatureRole = styled.span`
  display: block;
  margin-top: 0.25rem;
  color: rgba(185, 192, 204, 0.68);
  font-family: ${fonts.primary};
  font-size: 0.8rem;
  line-height: 1.35;
`;

export const BrandStage = styled.div`
  position: absolute;
  z-index: 1;
  top: 50%;
  right: clamp(-4rem, -3vw, -1rem);
  width: min(52vw, 46rem);
  height: min(52vw, 46rem);
  display: grid;
  place-items: center;
  transform: translateY(-50%);

  &::before {
    content: '';
    position: absolute;
    inset: 12%;
    border: 1px solid rgba(145, 168, 255, 0.16);
    border-radius: 50%;
  }

  @media (max-width: ${breakpoints.laptopMax}) {
    right: -18%;
    opacity: 0.62;
  }

  @media (max-width: ${breakpoints.tabletMax}) {
    top: 10%;
    right: -22%;
    width: min(100vw, 31rem);
    height: min(100vw, 31rem);
    transform: none;
    opacity: 0.35;
  }
`;

export const BrandLetter = styled(motion.span)`
  position: absolute;
  color: rgba(145, 168, 255, 0.1);
  font-family: ${fonts.heading};
  font-size: clamp(18rem, 35vw, 34rem);
  font-weight: 620;
  letter-spacing: -0.12em;
  line-height: 0.8;
`;

export const BrandName = styled(motion.span)`
  position: absolute;
  right: 9%;
  bottom: 17%;
  color: ${colors.white};
  font-family: ${fonts.heading};
  font-size: clamp(2.1rem, 4.5vw, 4.8rem);
  font-weight: 620;
  letter-spacing: -0.06em;
`;
