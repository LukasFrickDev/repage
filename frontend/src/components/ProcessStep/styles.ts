import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { colors, fonts, breakpoints } from '../../styles/globalStyles';

const sweepShine = keyframes`
  0% {
    transform: translateX(-120%);
  }
  55% {
    transform: translateX(160%);
  }
  100% {
    transform: translateX(160%);
  }
`;

const nodePulse = keyframes`
  0% {
    transform: scale(0.88);
    opacity: 0.35;
  }
  50% {
    transform: scale(1.06);
    opacity: 0.8;
  }
  100% {
    transform: scale(0.88);
    opacity: 0.35;
  }
`;

const orbitSpin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const pathTravel = keyframes`
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
`;

// StepArrow removido

export const StepWrapper = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex: 1 1 260px;
  min-width: 240px;
  max-width: 320px;
  padding-top: 3.25rem;
  margin: 0 auto;
  perspective: 1400px;
  will-change: transform;
  transition: transform 0.35s ease;

  @media (min-width: ${breakpoints.tablet}) {
    padding-top: 3.5rem;
  }

  @media (min-width: ${breakpoints.desktop}) {
    margin: 0;
    max-width: 100%;
    flex: 1 1 0;
  }

  &::before {
    content: '';
    position: absolute;
    top: 3.4rem;
    bottom: -2.2rem;
    left: 50%;
    width: 2px;
    transform: translateX(-50%);
    background: linear-gradient(
      180deg,
      ${colors.highlightStrong}55 0%,
      transparent 90%
    );
    opacity: 0.35;
    filter: drop-shadow(0 0 10px transparent);
    transition:
      opacity 0.45s ease,
      filter 0.45s ease;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: 1.7rem;
    left: 50%;
    right: -2.75rem;
    height: 2px;
    background: linear-gradient(
      90deg,
      ${colors.neonBlue}40 0%,
      rgba(255, 255, 255, 0.08) 55%,
      transparent 100%
    );
    opacity: 0.25;
    transform-origin: left;
    transform: scaleX(0.85);
    filter: drop-shadow(0 0 12px transparent);
    transition:
      opacity 0.45s ease,
      transform 0.45s ease,
      filter 0.45s ease;
    pointer-events: none;
    display: none;
    background-size: 200% 100%;
    animation: ${pathTravel} 18s linear infinite;
  }

  &:hover::before {
    opacity: 0.75;
    filter: drop-shadow(0 0 14px ${colors.neonBlue}55);
  }

  &:hover::after {
    opacity: 0.9;
    transform: scaleX(1.08);
    filter: drop-shadow(0 0 26px ${colors.neonBlue}66);
  }

  &:hover > div:first-of-type {
    transform: translate(-50%, -50%) scale(1.12);
    box-shadow:
      0 0 18px -6px ${colors.neonBlue},
      0 0 32px -16px ${colors.highlightStrong};
  }

  &:hover > div:first-of-type::after {
    opacity: 0.6;
    transform: rotate(6deg) scale(1.05);
  }

  &:hover > div:first-of-type span[data-orbit] {
    opacity: 0.85;
    filter: blur(2px) drop-shadow(0 0 18px ${colors.neonBlue}55);
  }

  &:hover > div:first-of-type span[data-glow] {
    opacity: 0.9;
    transform: scale(1.12);
  }

  &:hover > div:first-of-type span[data-arrow] {
    opacity: 0.7;
    filter: drop-shadow(0 0 20px rgba(56, 189, 248, 0.55));
  }

  &:hover > div:first-of-type span[data-arrow='left'] {
    transform: translateY(-50%) scale(1.1);
  }

  &:hover > div:first-of-type span[data-arrow='right'] {
    transform: translateY(-50%) scale(1.1);
  }

  &:hover > div:first-of-type span[data-step-number] {
    text-shadow: 0 0 16px ${colors.neonBlue}aa;
    opacity: 1;
  }

  &:hover > div:nth-of-type(2) {
    transform: translateY(-14px) rotateX(6deg) rotateY(-4deg) scale(1.03);
    box-shadow: 0 32px 68px -34px ${colors.neonBlue};
    border-color: ${colors.neonBlue};
  }

  &:hover > div:nth-of-type(2)::before {
    opacity: 0.55;
  }

  &:hover > div:nth-of-type(2)::after {
    opacity: 0.85;
  }

  &:focus-within::before {
    opacity: 0.75;
    filter: drop-shadow(0 0 14px ${colors.neonBlue}55);
  }

  &:focus-within::after {
    opacity: 0.9;
    transform: scaleX(1.08);
    filter: drop-shadow(0 0 26px ${colors.neonBlue}66);
  }

  &:focus-within > div:first-of-type {
    transform: translate(-50%, -50%) scale(1.12);
    box-shadow:
      0 0 18px -6px ${colors.neonBlue},
      0 0 32px -16px ${colors.highlightStrong};
  }

  &:focus-within > div:first-of-type::after {
    opacity: 0.6;
    transform: rotate(6deg) scale(1.05);
  }

  &:focus-within > div:first-of-type span[data-orbit] {
    opacity: 0.85;
    filter: blur(2px) drop-shadow(0 0 18px ${colors.neonBlue}55);
  }

  &:focus-within > div:first-of-type span[data-glow] {
    opacity: 0.9;
    transform: scale(1.12);
  }

  &:focus-within > div:first-of-type span[data-arrow] {
    opacity: 0.7;
    filter: drop-shadow(0 0 20px rgba(56, 189, 248, 0.55));
  }

  &:focus-within > div:first-of-type span[data-arrow='left'] {
    transform: translateY(-50%) scale(1.1);
  }

  &:focus-within > div:first-of-type span[data-arrow='right'] {
    transform: translateY(-50%) scale(1.1);
  }

  &:focus-within > div:first-of-type span[data-step-number] {
    text-shadow: 0 0 16px ${colors.neonBlue}aa;
    opacity: 1;
  }

  &:focus-within > div:nth-of-type(2) {
    transform: translateY(-14px) rotateX(6deg) rotateY(-4deg) scale(1.03);
    box-shadow: 0 32px 68px -34px ${colors.neonBlue};
  }

  &:focus-within > div:nth-of-type(2)::before {
    opacity: 0.55;
  }

  &:focus-within > div:nth-of-type(2)::after {
    opacity: 0.85;
  }

  &[data-last='true']::before {
    display: none;
  }

  &[data-last='true']::after {
    display: none;
  }

  &[data-first='true']::after {
    left: 52%;
  }

  @media (min-width: ${breakpoints.tablet}) {
    &::before {
      display: none;
    }
  }

  @media (min-width: ${breakpoints.desktop}) {
    &::after {
      display: block;
    }
  }
`;

export const StepNode = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%) scale(1);
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 50%;
  border: 1px solid ${colors.neonBlue}aa;
  background:
    linear-gradient(
      135deg,
      rgba(56, 189, 248, 0.18) 0%,
      rgba(124, 58, 237, 0.24) 100%
    ),
    rgba(13, 13, 13, 0.9);
  display: grid;
  place-items: center;
  box-shadow:
    0 0 14px -6px ${colors.neonBlue},
    0 0 22px -12px ${colors.highlightStrong};
  overflow: visible;
  transition:
    transform 0.45s ease,
    box-shadow 0.45s ease,
    border-color 0.45s ease,
    background 0.45s ease;
  z-index: 2;

  &::after {
    content: '';
    position: absolute;
    inset: -0.25rem;
    border-radius: inherit;
    border: 1px dashed ${colors.neonBlue}66;
    opacity: 0.35;
    transition:
      opacity 0.45s ease,
      transform 0.45s ease;
  }
`;

export const StepOrbit = styled.span`
  position: absolute;
  inset: -0.55rem;
  border-radius: 50%;
  border: 1px solid ${colors.neonBlue}44;
  opacity: 0.4;
  filter: blur(2px);
  animation: ${orbitSpin} 14s linear infinite;
  transform-origin: center;
  pointer-events: none;
  transition:
    opacity 0.45s ease,
    filter 0.45s ease;
  mix-blend-mode: screen;
  z-index: -2;
`;

export const StepNumber = styled.span`
  font-family: ${fonts.ui};
  font-size: 1rem;
  letter-spacing: 0.08em;
  color: ${colors.white};
  text-transform: uppercase;
  z-index: 1;
  text-shadow: 0 0 10px ${colors.neonBlue}33;
  transition:
    color 0.45s ease,
    text-shadow 0.45s ease,
    opacity 0.45s ease;
  opacity: 0.95;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  line-height: 1;
  font-variant-numeric: tabular-nums;
`;

export const StepNodeGlow = styled.span`
  position: absolute;
  inset: -35%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    ${colors.neonBlue}55 0%,
    rgba(124, 58, 237, 0.4) 30%,
    transparent 68%
  );
  animation: ${nodePulse} 5.2s ease-in-out infinite;
  pointer-events: none;
  opacity: 0.48;
  transform: scale(0.96);
  transition:
    opacity 0.45s ease,
    transform 0.45s ease;
  z-index: -1;
`;

export const CardMotion = styled(motion.div)`
  position: relative;
  overflow: hidden;
  border-radius: 14px;
  border: 1px solid transparent;
  background:
    linear-gradient(
        180deg,
        ${colors.backgroundSecondary}f0 0%,
        ${colors.background}fa 100%
      )
      padding-box,
    linear-gradient(
        140deg,
        ${colors.neonBlue}66 0%,
        rgba(255, 255, 255, 0.08) 45%,
        ${colors.highlightStrong}88 100%
      )
      border-box;
  color: ${colors.white};
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 0 18px 38px -24px ${colors.neonBlue}aa;
  backdrop-filter: blur(6px);
  transform-style: preserve-3d;
  backface-visibility: hidden;
  transition:
    transform 0.35s ease,
    box-shadow 0.35s ease,
    border-color 0.35s ease,
    background 0.35s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 1px;
    border-radius: inherit;
    background:
      radial-gradient(circle at 18% 20%, ${colors.neonBlue}25, transparent 48%),
      radial-gradient(
        circle at 80% 16%,
        ${colors.highlightStrong}20,
        transparent 52%
      ),
      repeating-linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.06) 0 1px,
        transparent 1px 10px
      );
    opacity: 0.35;
    pointer-events: none;
    transition: opacity 0.35s ease;
  }

  &::after {
    content: '';
    position: absolute;
    top: -40%;
    bottom: auto;
    left: -30%;
    right: -30%;
    height: 65%;
    background: linear-gradient(
      120deg,
      transparent 0%,
      ${colors.neonBlue}33 45%,
      rgba(255, 255, 255, 0.18) 60%,
      ${colors.highlightStrong}22 75%,
      transparent 100%
    );
    filter: blur(0.5px);
    transform: translateX(-120%);
    animation: ${sweepShine} 8s ease-in-out infinite;
    pointer-events: none;
    mix-blend-mode: screen;
    opacity: 0.5;
    transition: opacity 0.45s ease;
  }

  &:focus-visible {
    outline: none;
    border-color: ${colors.neonBlue};
    box-shadow:
      0 0 0 1.5px ${colors.neonBlue}88,
      0 24px 48px -24px ${colors.neonBlue}aa;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.6rem 1.6rem 1.25rem;
  position: relative;
  z-index: 1;
  align-items: center;
  text-align: center;

  &::after {
    content: '';
    position: absolute;
    left: 1.6rem;
    right: 1.6rem;
    bottom: 0.2rem;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      ${colors.neonBlue}77,
      transparent
    );
    opacity: 0.65;
  }
`;

export const IconWrapper = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    ${colors.highlight}33 0%,
    ${colors.neonBlue}26 55%,
    ${colors.highlightStrong}38 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  position: relative;
  overflow: visible;
  box-shadow:
    inset 0 0 0 1px ${colors.highlight}55,
    0 0 16px -2px ${colors.neonBlue}aa;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(
      circle at top,
      rgba(255, 255, 255, 0.22),
      transparent 75%
    );
    opacity: 0.7;
    pointer-events: none;
  }

  svg {
    width: 1.75rem;
    height: 1.75rem;
    color: ${colors.highlight};
    filter: drop-shadow(0 0 8px ${colors.highlight}aa);
  }
`;

export const CardTitle = styled.h3`
  font-size: 1.28rem;
  font-weight: 600;
  text-align: center;
  line-height: 1.1;
  letter-spacing: -0.01em;
  font-family: ${fonts.heading};
  margin: 0;
  text-shadow: 0 0 12px ${colors.neonBlue}1f;
`;

export const CardContent = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 1.4rem 1.6rem 1.8rem;
  padding-top: 0.4rem;
  position: relative;
  z-index: 1;
  align-items: center;

  &::before {
    content: '';
    position: absolute;
    left: 1.6rem;
    right: 1.6rem;
    top: 0.1rem;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
  }
`;

export const CardDescription = styled.p`
  font-size: 1rem;
  text-align: center;

  color: ${colors.textSecondary};
  font-weight: 400;
  margin: 0;
  line-height: 1.6;
  text-shadow: 0 0 14px rgba(56, 189, 248, 0.08);
`;
