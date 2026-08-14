import styled from 'styled-components';
import { colors, fonts, layout, motion as motionTokens } from '../../styles/theme';

export const PrimaryCta = styled.a`
  min-height: 3.3rem;
  padding: 0.82rem 1.2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  border: 1px solid rgba(145, 168, 255, 0.24);
  border-radius: ${layout.radii.control};
  background: linear-gradient(
    108deg,
    color-mix(in srgb, ${colors.highlight} 88%, ${colors.inkDeep}) 0%,
    color-mix(in srgb, ${colors.highlight} 90%, ${colors.inkDeep}) 38%,
    color-mix(in srgb, ${colors.neonBlue} 80%, ${colors.highlight}) 118%
  );
  background-position: left center;
  background-size: 135% 100%;
  color: ${colors.white};
  font-family: ${fonts.primary};
  font-size: 0.94rem;
  font-weight: 670;
  line-height: 1;
  text-decoration: none;
  box-shadow: inset 0 1px rgba(245, 242, 236, 0.16), inset -1px 0 rgba(145, 168, 255, 0.16);
  transition: background-position ${motionTokens.duration.fast} ${motionTokens.easing.standard}, border-color ${motionTokens.duration.fast} ${motionTokens.easing.standard}, box-shadow ${motionTokens.duration.fast} ${motionTokens.easing.standard}, filter ${motionTokens.duration.quick} ${motionTokens.easing.standard};

  svg {
    width: 0.92rem;
    height: 0.92rem;
    transition: transform ${motionTokens.duration.fast} ${motionTokens.easing.standard};
  }

  &:hover {
    background-position: right center;
    border-color: rgba(245, 242, 236, 0.28);
    box-shadow: inset 0 1px rgba(245, 242, 236, 0.22), inset -1px 0 rgba(145, 168, 255, 0.22);
  }

  &:hover svg { transform: translateX(2.5px); }

  &:active {
    filter: brightness(0.94);
    box-shadow: inset 0 2px 6px rgba(13, 21, 34, 0.24);
  }

  &:focus-visible {
    outline: 2px solid ${colors.neonBlue};
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    svg { transition: none; }
  }
`;
