import styled from 'styled-components';
import { motion } from 'framer-motion';
import { colors, fonts, breakpoints } from '../../styles/globalStyles';

// ElegantShape container
interface ElegantShapeProps {
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  rotate?: number;
  width?: number;
  height?: number;
}

export const ElegantShapeContainer = styled(motion.div)<ElegantShapeProps>`
  position: absolute;
  ${(props) => props.left && `left: ${props.left};`}
  ${(props) => props.right && `right: ${props.right};`}
  ${(props) => props.top && `top: ${props.top};`}
  ${(props) => props.bottom && `bottom: ${props.bottom};`}
  width: ${(props) => props.width || 400}px;
  height: ${(props) => props.height || 100}px;
  transform: rotate(${(props) => props.rotate || 0}deg);
  pointer-events: none;
`;

export const ElegantShapeInner = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const ElegantShapeBg = styled.div<{ gradient?: string }>`
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: ${(props) =>
    props.gradient
      ? props.gradient
      : `linear-gradient(90deg, ${colors.white}14 0%, transparent 100%)`};
  backdrop-filter: blur(2px);
  border: 2px solid ${colors.white}26;
  box-shadow: 0 8px 32px 0 rgba(255, 255, 255, 0.1);
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 999px;
    background: radial-gradient(
      circle at 50% 50%,
      rgba(255, 255, 255, 0.2),
      transparent 70%
    );
  }
`;

export const HeroWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #030303;
`;

export const BgGradient = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.05) 0%,
    transparent 60%,
    rgba(244, 63, 94, 0.05) 100%
  );
  filter: blur(48px);
`;

export const ShapesWrapper = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
`;

export const ContentContainer = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: ${breakpoints.tablet}) {
    padding: 0 1.5rem;
  }
`;

export const CenteredText = styled.div`
  max-width: 48rem;
  margin: 0 auto;
  text-align: center;
`;

export const Badge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 2rem;
  @media (min-width: ${breakpoints.tablet}) {
    margin-bottom: 3rem;
  }
`;

export const BadgeText = styled.span`
  font-size: 1rem;
  color: rgba(249, 250, 251, 0.6);
  letter-spacing: 0.05em;
`;

export const Title = styled(motion.h1)`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
  line-height: 1.1;
  font-family: ${fonts.heading};
  @media (min-width: ${breakpoints.mobile}) {
    font-size: 3.75rem;
  }
  @media (min-width: ${breakpoints.tablet}) {
    font-size: 6rem;
    margin-bottom: 2rem;
  }
`;

export const TitleGradient = styled.span`
  background: linear-gradient(180deg, #fff 60%, rgba(249, 250, 251, 0.8) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`;

export const TitleGradient2 = styled.span`
  background: linear-gradient(
    90deg,
    ${colors.neonBlue} 0%,
    #86dafdff 3%,
    rgba(255, 255, 255, 0.9) 50%,
    #a985e6ff 97%,
    ${colors.highlightStrong} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`;

export const Description = styled(motion.p)`
  font-size: 1.125rem;
  color: rgba(249, 250, 251, 0.4);
  margin-bottom: 2rem;
  line-height: 1.7;
  font-weight: 300;
  letter-spacing: 0.03em;
  max-width: 36rem;
  margin-left: auto;
  margin-right: auto;
  padding: 0 1rem;
  @media (min-width: ${breakpoints.mobile}) {
    font-size: 1.25rem;
  }
  @media (min-width: ${breakpoints.tablet}) {
    font-size: 1.375rem;
  }
`;

export const ButtonsContainer = styled(motion.div)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2.5rem;
  @media (max-width: ${breakpoints.mobile}) {
    flex-direction: column;
    gap: 1rem;
  }
`;

export const OverlayGradient = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    #030303 0%,
    transparent 60%,
    rgba(3, 3, 3, 0.8) 100%
  );
  pointer-events: none;
`;

// ElegantShape pode ser estilizado conforme necessário, mas depende de props dinâmicas
