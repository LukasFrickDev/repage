import styled, { css, keyframes } from 'styled-components';
import { colors, fonts } from '../../styles/globalStyles';

const pulseGradient = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const techGradient = `linear-gradient(120deg,
  ${colors.highlight} 0%,
  ${colors.neonBlue} 45%,
  #8b5cf6 85%,
  ${colors.highlightStrong} 100%
)`;

const outlineGradient = css`
  background:
    linear-gradient(${colors.background}, ${colors.background}) padding-box,
    linear-gradient(
        135deg,
        ${colors.neonBlue} 0%,
        rgba(255, 255, 255, 0.4) 45%,
        ${colors.highlightStrong} 100%
      )
      border-box;
  border: 1.5px solid transparent;
  color: ${colors.white};
`;

export const ButtonContent = styled.button<{
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glow';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 25px;
  font-family: ${fonts.primary};
  font-weight: 500;
  font-size: ${({ size }) =>
    size === 'sm' ? '0.95rem' : size === 'lg' ? '1.15rem' : '1rem'};
  cursor: pointer;
  position: relative;
  z-index: 0;
  transition:
    background 0.3s ease,
    color 0.3s ease,
    border 0.3s ease,
    box-shadow 0.3s ease,
    transform 0.25s ease;
  border: ${({ variant }) =>
    variant === 'secondary'
      ? `1px solid ${colors.highlight}`
      : '1.5px solid transparent'};
  outline: none;
  padding: ${({ size }) =>
    size === 'sm'
      ? '0.35rem 0.75rem'
      : size === 'lg'
        ? '0.75rem 2rem'
        : size === 'icon'
          ? '0.5rem'
          : '0.5rem 1.25rem'};
  min-height: ${({ size }) =>
    size === 'sm' ? '2rem' : size === 'lg' ? '3rem' : '2.5rem'};
  min-width: ${({ size }) => (size === 'icon' ? '2.5rem' : 'auto')};
  background: ${({ variant }) => {
    if (variant === 'secondary') {
      return `linear-gradient(120deg, ${colors.backgroundSecondary} 0%, ${colors.background} 100%)`;
    }
    if (variant === 'outline') {
      return 'transparent';
    }
    if (variant === 'ghost') {
      return `linear-gradient(${colors.background}99, ${colors.background}99)`;
    }
    if (variant === 'glow') {
      return techGradient;
    }
    return techGradient;
  }};
  background-size: 200% 200%;
  background-position: 0% 50%;
  color: ${colors.white};
  box-shadow: ${({ variant }) => {
    if (variant === 'glow') {
      return `0 0 18px 3px ${colors.neonBlue}77, 0 0 24px 8px ${colors.highlight}44`;
    }
    if (variant === 'secondary') {
      return `0 0 14px 2px ${colors.highlight}44`;
    }
    if (variant === 'outline') {
      return `0 0 18px -4px ${colors.neonBlue}55`;
    }
    return `0 10px 22px -12px ${colors.neonBlue}aa`;
  }};
  ${({ variant }) => (variant === 'outline' ? outlineGradient : '')}

  &::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: inherit;
    background: ${techGradient};
    opacity: ${({ variant }) =>
      variant === 'ghost' ? 0.18 : variant === 'secondary' ? 0.32 : 0.45};
    filter: blur(4px);
    z-index: -1;
    transition:
      opacity 0.35s ease,
      filter 0.35s ease;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    background: ${({ variant }) => {
      if (variant === 'secondary') {
        return `linear-gradient(135deg, ${colors.highlight} 0%, ${colors.neonBlue} 100%)`;
      }
      if (variant === 'outline') {
        return `linear-gradient(${colors.background}, ${colors.background}) padding-box,
          linear-gradient(135deg, ${colors.highlightStrong} 0%, rgba(255, 255, 255, 0.55) 55%, ${colors.neonBlue} 100%) border-box`;
      }
      if (variant === 'ghost') {
        return `linear-gradient(${colors.backgroundSecondary}, ${colors.backgroundSecondary})`;
      }
      return techGradient;
    }};
    background-position: 100% 50%;
    color: ${({ variant }) =>
      variant === 'outline'
        ? colors.neonBlue
        : variant === 'ghost'
          ? colors.highlight
          : colors.white};
    box-shadow: ${({ variant }) => {
      if (variant === 'glow') {
        return `0 0 12px 2px ${colors.neonBlue}, 0 0 18px 12px ${colors.highlight}88`;
      }
      if (variant === 'secondary') {
        return `0 0 12px 2px ${colors.neonBlue}55`;
      }
      if (variant === 'outline') {
        return `0 0 10px 2px ${colors.neonBlue}88`;
      }
      return `0 8px 15px -7px ${colors.neonBlue}bb`;
    }};
  }

  &:hover:not(:disabled)::after {
    opacity: ${({ variant }) =>
      variant === 'ghost' ? 0.35 : variant === 'secondary' ? 0.5 : 0.75};
    filter: blur(8px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${({ variant }) =>
    variant === 'glow'
      ? css`
          animation: ${pulseGradient} 5s ease infinite;
        `
      : ''}
`;
