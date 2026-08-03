import { motion } from 'framer-motion';
import styled, { keyframes } from 'styled-components';
import { colors } from '../../styles/globalStyles';

const float = keyframes`
  0%, 100% { transform: translate3d(0, 0, 0); }
  50% { transform: translate3d(0, -3px, 0); }
`;

const borderGlow = keyframes`
  0%, 100% { opacity: 0.25; }
  50% { opacity: 0.62; }
`;

const tracePoint = keyframes`
  0%, 12% { opacity: 0; transform: translate3d(0, 0, 0); }
  20% { opacity: 1; }
  78% { opacity: 1; }
  88%, 100% { opacity: 0; transform: translate3d(var(--trace-distance), 0, 0); }
`;

const gradientBreath = keyframes`
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
`;

export const Experience = styled(motion.div)`
  position: relative;
  width: min(100%, 700px);
  min-width: 0;
  margin-inline: auto;
  padding: clamp(2rem, 5vw, 4.5rem) clamp(0.35rem, 3vw, 2rem) clamp(1.5rem, 4vw, 3rem);
  perspective: 1400px;

  @media (max-width: 767px) {
    width: 100%;
    height: clamp(230px, 72vw, 300px);
    padding: 0.65rem 0 0.35rem;
  }
`;

export const PerspectiveStage = styled(motion.div)`
  position: relative;
  width: 100%;
  aspect-ratio: 1.22 / 1;
  transform-style: preserve-3d;
  will-change: transform;

  @media (max-width: 767px) { height: 100%; aspect-ratio: auto; }
  @media (prefers-reduced-motion: reduce) { transform: none !important; }
`;

export const FloatFrame = styled.div`
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  animation: none;

  @media (min-width: 1280px) { animation: ${float} 10s ease-in-out 1s infinite; }

  @media (prefers-reduced-motion: reduce) { animation: none; }
`;

export const LayerEntrance = styled(motion.div)`
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
`;

const structuralLayer = `
  position: absolute;
  border: 1px solid rgba(145, 168, 255, 0.2);
  background: #151f31;
  overflow: hidden;
`;

export const BackLayerFar = styled.div`
  ${structuralLayer}
  inset: 3% 1% 15% 15%;
  transform: translate3d(5%, -4%, -90px) rotate(3deg);
  opacity: 0.55;

  @media (max-width: 767px) { display: none; }
`;

export const BackLayer = styled.div`
  ${structuralLayer}
  inset: 5% 5% 10% 10%;
  transform: translate3d(3%, -2%, -45px) rotate(1.5deg);
  opacity: 0.8;

  @media (max-width: 767px) { inset: 7% 2% 11% 11%; }
`;

export const StructuralLines = styled.div`
  position: absolute;
  inset: 12%;
  background:
    linear-gradient(rgba(185, 192, 204, 0.12) 1px, transparent 1px) 0 0 / 100% 19%,
    linear-gradient(90deg, rgba(145, 168, 255, 0.1) 1px, transparent 1px) 0 0 / 24% 100%;
`;

export const MainSurface = styled.div`
  position: absolute;
  inset: 8% 8% 4% 2%;
  overflow: hidden;
  border: 1px solid rgba(245, 242, 236, 0.24);
  border-radius: 12px;
  background: #182235;
  box-shadow: 0 26px 65px rgba(4, 8, 17, 0.38), 18px 22px 56px rgba(108, 99, 255, 0.1);
  transform: rotateY(-4deg) rotateX(2deg);
  transform-style: preserve-3d;

  &::after {
    content: '';
    position: absolute;
    z-index: 4;
    inset: 0;
    border: 1px solid rgba(145, 168, 255, 0.42);
    border-radius: inherit;
    opacity: 0.25;
    pointer-events: none;
    animation: ${borderGlow} 9s ease-in-out infinite;
  }

  @media (max-width: 767px) {
    inset: 5% 3% 3% 1%;
    border-radius: 10px;
    transform: rotateY(-2deg) rotateX(1deg);
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    &::after { animation: none; opacity: 0.35; }
  }
`;

export const SurfaceHeader = styled.div`
  height: 11%;
  min-height: 34px;
  padding-inline: 4%;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 5%;
  border-bottom: 1px solid rgba(185, 192, 204, 0.14);
  background: #141e30;
`;

export const ControlPoints = styled.div`
  display: flex;
  gap: 5px;
  i { width: 5px; height: 5px; border-radius: 50%; background: rgba(185, 192, 204, 0.35); }
  i:first-child { background: ${colors.highlight}; box-shadow: 0 0 10px rgba(108, 99, 255, 0.75); }
`;

export const HeaderLine = styled.span`
  width: 28%; height: 4px; border-radius: 2px; background: rgba(185, 192, 204, 0.18);
`;

export const HeaderAction = styled.span`
  width: clamp(24px, 5vw, 48px); height: 9px; border: 1px solid rgba(145, 168, 255, 0.35); border-radius: 3px;
`;

export const SurfaceBody = styled.div`
  display: grid;
  grid-template-columns: 20% 1fr;
  height: 89%;

  @media (max-width: 767px) { grid-template-columns: 17% 1fr; }
`;

export const SideRail = styled.div`
  padding: 22% 18%;
  display: flex;
  flex-direction: column;
  gap: 8%;
  border-right: 1px solid rgba(185, 192, 204, 0.12);
  background: #151f31;
`;

export const SideMark = styled.span`
  width: 30%; aspect-ratio: 1; margin-bottom: 16%; background: ${colors.highlight}; box-shadow: 0 0 18px rgba(108, 99, 255, 0.42);
`;

export const SideLine = styled.span<{ $width: string }>`
  width: ${({ $width }) => $width}; height: 3px; background: rgba(185, 192, 204, 0.2);
`;

export const LayoutCanvas = styled.div`
  padding: 8% 7%;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 8%;
  background:
    linear-gradient(rgba(145, 168, 255, 0.055) 1px, transparent 1px) 0 0 / 100% 16%,
    linear-gradient(90deg, rgba(145, 168, 255, 0.045) 1px, transparent 1px) 0 0 / 20% 100%,
    #182235;
`;

export const LayoutHeading = styled.div`
  display: grid;
  gap: clamp(7px, 1.4vw, 13px);
`;

export const KickerLine = styled.span`
  width: 18%; height: 4px; background: ${colors.neonBlue}; box-shadow: 0 0 12px rgba(145, 168, 255, 0.4);
`;

export const TitleLines = styled.div`
  display: grid;
  gap: clamp(5px, 1vw, 9px);
  span { display: block; height: clamp(7px, 1.25vw, 13px); background: rgba(245, 242, 236, 0.74); }
  span:first-child { width: 67%; }
  span:last-child { width: 46%; }
`;

export const LayoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 6%;
`;

export const AccentBlock = styled.div`
  position: relative;
  border: 1px solid rgba(108, 99, 255, 0.42);
  background: linear-gradient(125deg, rgba(108, 99, 255, 0.25), rgba(145, 168, 255, 0.06), rgba(108, 99, 255, 0.16));
  background-size: 180% 180%;
  animation: ${gradientBreath} 14s ease-in-out infinite;
  &::before { content: ''; position: absolute; inset: 12%; border-left: 2px solid ${colors.highlight}; border-bottom: 1px solid rgba(145, 168, 255, 0.22); }
  span { position: absolute; width: 7px; height: 7px; right: 12%; top: 14%; border-radius: 50%; background: ${colors.neonBlue}; box-shadow: 0 0 12px ${colors.neonBlue}; }

  @media (prefers-reduced-motion: reduce) { animation: none; }
`;

export const ContentBlock = styled.div`
  padding: 15%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 10%;
  border: 1px solid rgba(185, 192, 204, 0.14);
  background: #141f31;
  span { display: block; height: 3px; background: rgba(185, 192, 204, 0.22); }
  span:nth-child(2) { width: 74%; }
  span:nth-child(3) { width: 48%; background: ${colors.highlight}; }
`;

export const BottomRail = styled.div`
  display: grid;
  grid-template-columns: 1fr 0.7fr 0.45fr;
  gap: 5%;
  span { height: clamp(14px, 3vw, 28px); border-top: 1px solid rgba(145, 168, 255, 0.2); background: rgba(145, 168, 255, 0.045); }
`;

export const ActivePoint = styled.span`
  --trace-distance: clamp(70px, 12vw, 150px);
  position: absolute;
  z-index: 3;
  width: clamp(84px, 15vw, 174px);
  height: 1px;
  right: 4%;
  bottom: 5.5%;
  background: linear-gradient(90deg, rgba(108, 99, 255, 0.34), rgba(145, 168, 255, 0.08));

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: -3px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${colors.neonBlue};
    box-shadow: 0 0 0 4px rgba(145, 168, 255, 0.1), 0 0 15px rgba(145, 168, 255, 0.75);
    animation: ${tracePoint} 10s linear 1.2s infinite;
  }

  @media (max-width: 767px) {
    --trace-distance: clamp(64px, 24vw, 96px);
    width: clamp(78px, 28vw, 110px);
  }

  @media (prefers-reduced-motion: reduce) {
    &::after { animation: none; opacity: 1; transform: translate3d(45%, 0, 0); }
  }
`;
