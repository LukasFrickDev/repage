import { motion } from 'framer-motion';
import styled, { css } from 'styled-components';
import { breakpoints, colors, fonts } from '../../styles/theme';

export const Experience = styled(motion.div)`
  position: relative;
  width: min(100%, 50rem);
  min-width: 0;
  margin-left: auto;
`;

export const Stage = styled.div`
  position: relative;
  min-height: clamp(32rem, 42vw, 38rem);
  overflow: hidden;

  &::before,
  &::after {
    content: '';
    position: absolute;
    z-index: 0;
    aspect-ratio: 1;
    border: 1px solid rgba(145, 168, 255, 0.11);
    border-radius: 50%;
    pointer-events: none;
  }

  &::before {
    width: 82%;
    right: -13%;
    top: -7%;
  }

  &::after {
    width: 120%;
    left: -79%;
    top: -53%;
    border-color: rgba(145, 168, 255, 0.06);
  }

  @media (max-width: ${breakpoints.laptopMax}) {
    min-height: clamp(27rem, 57vw, 33rem);
  }

  @media (max-width: ${breakpoints.tabletMax}) {
    min-height: clamp(20rem, 69vw, 28rem);
  }

  @media (max-width: ${breakpoints.compactMax}) {
    min-height: clamp(18rem, 78vw, 22rem);
    &::after { display: none; }
  }

  @media (max-height: 560px) and (min-width: ${breakpoints.tablet}) and (max-width: ${breakpoints.laptopMax}) {
    min-height: 20rem;
  }
`;

const label = css`
  display: grid;
  gap: 0.35rem;
  font-family: ${fonts.primary};

  span {
    color: ${colors.highlight};
    font-size: clamp(0.62rem, 0.8vw, 0.72rem);
    font-weight: 700;
    letter-spacing: 0.08em;
  }

  strong {
    color: ${colors.white};
    font-size: clamp(1.2rem, 2vw, 1.7rem);
    font-weight: 620;
    letter-spacing: -0.045em;
    line-height: 1;
  }
`;

export const IdeaEntrance = styled(motion.div)`
  position: absolute;
  z-index: 6;
  top: 23%;
  left: 10%;
  width: 24%;
  height: 22%;
  transform-origin: 15% 25%;

  @media (max-width: ${breakpoints.compactMax}) {
    top: 12%;
    left: 2%;
    width: 28%;
  }
`;

export const OriginPoint = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 1.05rem;
  aspect-ratio: 1;
  border: 2px solid ${colors.neonBlue};
  border-radius: 50%;
  background: ${colors.background};
  box-shadow: 0 0 0 0.5rem rgba(145, 168, 255, 0.07);
`;

export const OriginRule = styled.span`
  position: absolute;
  top: 0.48rem;
  left: 1.55rem;
  width: clamp(2rem, 5vw, 4.5rem);
  height: 1px;
  background: rgba(145, 168, 255, 0.38);
`;

export const MomentLabel = styled.div`
  ${label}
  position: absolute;
  top: 2.3rem;
  left: 0;
`;

export const StructureEntrance = styled(motion.div)`
  position: absolute;
  z-index: 5;
  top: 28%;
  left: 27%;
  width: 42%;
  height: 47%;
  transform-origin: center;

  @media (max-width: ${breakpoints.compactMax}) {
    top: 27%;
    left: 18%;
    width: 58%;
    height: 48%;
  }
`;

export const StructureFrame = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 1px solid rgba(145, 168, 255, 0.34);
  background: rgba(16, 24, 39, 0.7);
  box-shadow: 0 1.4rem 3.8rem rgba(4, 8, 17, 0.24);
`;

export const StructureLabel = styled.div`
  ${label}
  position: absolute;
  z-index: 3;
  top: 11%;
  left: 10%;
`;

export const StructurePlanePrimary = styled.span`
  position: absolute;
  left: 11%;
  bottom: 14%;
  width: 50%;
  height: 48%;
  border: 1px solid rgba(108, 99, 255, 0.68);
  background: rgba(108, 99, 255, 0.14);
`;

export const StructurePlaneSecondary = styled.span`
  position: absolute;
  right: 10%;
  bottom: 27%;
  width: 29%;
  height: 34%;
  border: 1px solid rgba(145, 168, 255, 0.3);
  background: ${colors.inkRaised};
`;

export const StructureBaseline = styled.span`
  position: absolute;
  left: 12%;
  bottom: 9%;
  width: 62%;
  height: 2px;
  background: linear-gradient(90deg, ${colors.highlight}, ${colors.neonBlue});
`;

export const FinalEntrance = styled(motion.div)`
  position: absolute;
  z-index: 5;
  right: 9%;
  bottom: 12%;
  width: 44%;
  height: 32%;
  transform-origin: center;

  @media (max-width: ${breakpoints.compactMax}) {
    right: 0;
    bottom: 5%;
    width: 66%;
    height: 39%;
  }
`;

export const FinalBlock = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: clamp(1rem, 2.2vw, 1.75rem);
  display: grid;
  grid-template-columns: minmax(3.5rem, 0.3fr) minmax(0, 1fr);
  align-items: center;
  gap: clamp(1rem, 2vw, 1.5rem);
  overflow: hidden;
  border-left: 3px solid ${colors.highlight};
  background: ${colors.white};
  color: ${colors.background};
  box-shadow: 0 1.7rem 4rem rgba(4, 8, 17, 0.35);

  @media (max-width: ${breakpoints.compactMax}) {
    padding: 0.9rem;
    grid-template-columns: 2.8rem minmax(0, 1fr);
    gap: 0.8rem;
  }
`;

export const FinalGraphic = styled.div`
  position: relative;
  align-self: center;
  min-width: 0;

  img {
    display: block;
    width: clamp(2.8rem, 5vw, 4.3rem);
    height: clamp(2.8rem, 5vw, 4.3rem);
    margin-inline: auto;
  }
`;

export const FinalCopy = styled.div`
  position: relative;
  z-index: 2;
  display: grid;
  align-content: center;
  gap: 0.36rem;
  font-family: ${fonts.primary};
  transform: translateY(-0.15rem);

  span {
    color: ${colors.highlight};
    font-size: clamp(0.62rem, 0.8vw, 0.72rem);
    font-weight: 700;
    letter-spacing: 0.08em;
  }

  strong {
    max-width: 18rem;
    color: ${colors.background};
    font-size: clamp(1rem, 1.45vw, 1.25rem);
    font-weight: 620;
    letter-spacing: -0.035em;
    line-height: 1.08;
  }

  p {
    max-width: 17rem;
    color: ${colors.background};
    font-size: clamp(0.76rem, 0.95vw, 0.9rem);
    font-weight: 540;
    letter-spacing: -0.018em;
    line-height: 1.28;
  }

  @media (max-width: ${breakpoints.compactMax}) {
    gap: 0.35rem;

    strong {
      font-size: clamp(0.78rem, 3.5vw, 0.95rem);
      line-height: 1.14;
    }

    p {
      font-size: clamp(0.65rem, 2.7vw, 0.78rem);
      line-height: 1.2;
    }
  }
`;

export const ExitLine = styled.span`
  position: absolute;
  z-index: 3;
  top: 52%;
  right: 7%;
  width: 17%;
  height: 2px;
  background: ${colors.neonBlue};
  transform: rotate(-43deg);
  transform-origin: right center;
`;

export const FlowMap = styled.svg`
  position: absolute;
  z-index: 4;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
`;

export const FlowBase = styled(motion.path)`
  fill: none;
  stroke: rgba(145, 168, 255, 0.17);
  stroke-width: 1.5;
`;

export const FlowTrace = styled(motion.path)`
  fill: none;
  stroke: ${colors.neonBlue};
  stroke-width: 2.25;
  stroke-linecap: round;
`;

const point = css`
  position: absolute;
  z-index: 8;
  width: 0.72rem;
  aspect-ratio: 1;
  border: 2px solid ${colors.neonBlue};
  border-radius: 50%;
  background: ${colors.background};
`;

export const StructurePoint = styled(motion.span)`
  ${point}
  top: 48%;
  left: 42%;
`;

export const StageCaption = styled.span`
  position: absolute;
  z-index: 1;
  left: 3%;
  bottom: 7%;
  color: rgba(145, 168, 255, 0.65);
  font-family: ${fonts.primary};
  font-size: clamp(0.56rem, 0.7vw, 0.64rem);
  font-weight: 650;
  letter-spacing: 0.12em;
  text-transform: uppercase;

  @media (max-width: ${breakpoints.compactMax}) {
    display: none;
  }
`;
