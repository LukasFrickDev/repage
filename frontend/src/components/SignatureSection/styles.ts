import { motion } from 'framer-motion';
import styled, { css } from 'styled-components';
import { breakpoints, colors, fonts, homepageTokens } from '../../styles/theme';
import { HomepageEditorialFrame } from '../HomepageEditorialFrame';

export const Section = styled.section`
  position: relative;
  isolation: isolate;
  overflow: clip;
  padding: clamp(6rem, 8vw, 8rem) ${homepageTokens.sectionPaddingInline};
  display: grid;
  align-items: center;
  background: ${colors.backgroundSecondary};
  color: ${colors.white};
`;

export const Composition = styled(HomepageEditorialFrame)`
  position: relative;
  min-height: clamp(27rem, 34vw, 32rem);
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: ${breakpoints.contentMax}) {
    min-height: 0;
    justify-content: flex-start;
  }
`;

export const Content = styled.div`
  position: relative;
  z-index: 2;
  width: min(100%, ${homepageTokens.signature.contentMaxWidth});

  @media (min-width: ${breakpoints.content}) and (max-width: ${breakpoints.laptopMax}) {
    width: min(100%, ${homepageTokens.signature.contentNotebookMaxWidth});
  }
`;

export const Eyebrow = styled(motion.p)`
  margin-bottom: ${homepageTokens.eyebrowMarginBottom};
  color: ${colors.highlight};
  font-family: ${fonts.primary};
  font-size: ${homepageTokens.eyebrowSize};
  font-weight: 650;
  letter-spacing: ${homepageTokens.eyebrowTracking};
  text-transform: uppercase;
`;

export const Title = styled(motion.h2)`
  max-width: 100%;
  font-family: ${fonts.heading};
  font-size: ${homepageTokens.signature.titleSize};
  font-weight: 610;
  letter-spacing: -0.06em;
  line-height: 0.96;
  text-wrap: balance;
  -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 48%, transparent 54%, transparent 100%);
  mask-image: linear-gradient(to bottom, #000 0%, #000 48%, transparent 54%, transparent 100%);
  -webkit-mask-size: 100% 220%;
  mask-size: 100% 220%;
  -webkit-mask-position: 0 0;
  mask-position: 0 0;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;

  @media (max-width: ${breakpoints.contentMax}) {
    font-size: ${homepageTokens.signature.titleMobileSize};
  }
`;

export const Description = styled(motion.p)`
  max-width: ${homepageTokens.signature.copyMaxWidth};
  margin-top: clamp(1.75rem, 2.8vw, 2.5rem);
  color: rgba(245, 242, 236, 0.76);
  font-family: ${fonts.primary};
  font-size: clamp(1.02rem, 1.18vw, 1.12rem);
  font-weight: ${homepageTokens.signature.copyWeight};
  line-height: 1.68;
`;

export const BrandField = styled(motion.div)`
  position: absolute;
  z-index: 1;
  top: 50%;
  left: ${homepageTokens.signature.logoOffset};
  width: ${homepageTokens.signature.logoWidth};
  aspect-ratio: 1;
  translate: 0 -50%;
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    inset: -2% -10% -4% -1%;
    background: radial-gradient(
      ellipse at 54% 49%,
      rgba(108, 99, 255, 0.17),
      rgba(145, 168, 255, 0.065) 38%,
      transparent 73%
    );
  }

  @media (min-width: ${breakpoints.content}) and (max-width: ${breakpoints.laptopMax}) {
    left: 64%;
  }

  @media (max-width: ${breakpoints.contentMax}) {
    position: relative;
    top: auto;
    left: 14%;
    width: ${homepageTokens.signature.logoMobileWidth};
    margin-top: clamp(2.75rem, 10vw, 4rem);
    translate: none;
  }

  @media (max-width: ${breakpoints.mobileMax}) {
    left: auto;
    margin-inline: auto;
    margin-top: clamp(1.75rem, 7vw, 2.25rem);
  }
`;

export const BrandStage = styled(motion.div)`
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 50%;
  width: 52%;
  aspect-ratio: 1;
  translate: -50% -50%;
  transform-origin: center;

  @media (max-width: ${breakpoints.contentMax}) {
    width: 54%;
  }
`;

export const BrandLogo = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
`;

export const BrandPlane = styled(motion.span)<{ $position: 'back' | 'main' }>`
  position: absolute;
  z-index: 0;
  border: 1px solid rgba(145, 168, 255, 0.105);

  ${({ $position }) => ({
    back: css`
      top: 12%;
      left: 18%;
      width: 78%;
      height: 70%;
      background: linear-gradient(132deg, rgba(108, 99, 255, 0.105), rgba(145, 168, 255, 0.035));
      clip-path: polygon(11% 0, 100% 6%, 96% 87%, 87% 100%, 0 94%, 0 14%);
      rotate: -1.4deg;
    `,
    main: css`
      top: 19%;
      left: 5%;
      width: 84%;
      height: 70%;
      background: linear-gradient(122deg, rgba(145, 168, 255, 0.045), rgba(108, 99, 255, 0.085));
      clip-path: polygon(8% 3%, 100% 0, 100% 82%, 91% 100%, 0 95%, 0 18%);
      rotate: 0.8deg;
    `,
  })[$position]}

  @media (max-width: ${breakpoints.contentMax}) {
    opacity: 0.72;
  }
`;

export const BrandTrace = styled(motion.span)`
  position: absolute;
  z-index: 1;
  top: 39%;
  left: -1%;
  width: 90%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(145, 168, 255, 0.38), rgba(108, 99, 255, 0.16), transparent);
  transform-origin: center;
  rotate: -8deg;

  @media (max-width: ${breakpoints.contentMax}) {
    opacity: 0.65;
  }
`;

export const Signature = styled(motion.div)`
  position: relative;
  z-index: 2;
  width: fit-content;
  margin-top: ${homepageTokens.signature.signatureMarginTop};
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: ${breakpoints.contentMax}) {
    margin-top: clamp(1.5rem, 6vw, 2.25rem);
  }

  @media (max-width: ${breakpoints.mobileMax}) {
    margin-top: clamp(1rem, 4vw, 1.25rem);
  }
`;

export const SignatureMark = styled.span`
  width: 2px;
  height: 3.5rem;
  flex: 0 0 auto;
  background: ${colors.highlight};
`;

export const SignatureName = styled.strong`
  display: block;
  color: ${colors.white};
  font-family: ${fonts.primary};
  font-size: ${homepageTokens.signature.nameSize};
  font-weight: 600;
  line-height: 1.35;
`;

export const SignatureRole = styled.span`
  display: block;
  margin-top: 0.3rem;
  color: rgba(245, 242, 236, 0.68);
  font-family: ${fonts.primary};
  font-size: ${homepageTokens.signature.roleSize};
  font-weight: 480;
  line-height: 1.4;
`;
