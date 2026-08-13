import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { breakpoints, colors, fonts, layout, motion as motionTokens } from '../../styles/theme';

export const Header = styled(motion.header)<{ $scrolled: boolean; $open: boolean }>`
  position: fixed;
  inset: 0 0 auto;
  z-index: 20;
  border-bottom: 1px solid transparent;
  background: transparent;
  transition: background ${motionTokens.duration.medium} ${motionTokens.easing.standard}, border-color ${motionTokens.duration.medium} ${motionTokens.easing.standard}, box-shadow ${motionTokens.duration.medium} ${motionTokens.easing.standard};

  ${({ $scrolled, $open }) => ($scrolled || $open) && css`
    border-color: rgba(245, 242, 236, 0.11);
    background: rgba(16, 24, 39, 0.9);
    box-shadow: 0 10px 32px rgba(4, 8, 17, 0.15);
    backdrop-filter: blur(12px);
  `}
`;

export const Inner = styled.div`
  width: ${layout.headerInlineWidth};
  height: ${layout.headerHeight};
  margin-inline: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

export const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  flex: 0 0 auto;
  color: ${colors.white};
  font-family: ${fonts.primary};
  font-size: 1.08rem;
  font-weight: 650;
  letter-spacing: -0.05em;
  text-decoration: none;

  img { width: 1.45rem; height: 1.45rem; }
`;

export const DesktopNavigation = styled.nav`
  display: none;
  align-items: center;
  gap: ${layout.headerNavigationGap};

  a {
    position: relative;
    padding-block: 0.55rem;
    color: ${colors.textSecondary};
    font-family: ${fonts.primary};
    font-size: 0.88rem;
    font-weight: 540;
    text-decoration: none;
    transition: color ${motionTokens.duration.quick} ${motionTokens.easing.standard};
  }

  a::after {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0.25rem;
    left: 0;
    height: 1px;
    background: linear-gradient(90deg, ${colors.highlight}, ${colors.neonBlue});
    transform: scaleX(0);
    transform-origin: left;
    transition: transform ${motionTokens.duration.fast} ${motionTokens.easing.standard};
  }

  a:hover, a:focus-visible { color: ${colors.white}; }
  a:hover::after, a:focus-visible::after { transform: scaleX(1); }

  @media (min-width: ${breakpoints.content}) { display: flex; }
`;

const cta = `
  min-height: 2.65rem;
  padding: 0.68rem 1.05rem;
  align-items: center;
  justify-content: center;
  gap: 0.62rem;
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
  font-size: 0.84rem;
  font-weight: 670;
  line-height: 1;
  text-decoration: none;
  box-shadow: inset 0 1px rgba(245, 242, 236, 0.16), inset -1px 0 rgba(145, 168, 255, 0.16);
  transition: background-position ${motionTokens.duration.fast} ${motionTokens.easing.standard}, border-color ${motionTokens.duration.fast} ${motionTokens.easing.standard}, box-shadow ${motionTokens.duration.fast} ${motionTokens.easing.standard}, filter ${motionTokens.duration.quick} ${motionTokens.easing.standard};

  svg {
    flex: 0 0 auto;
    width: 0.88rem;
    height: 0.88rem;
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
    box-shadow: inset 0 2px 5px rgba(13, 21, 34, 0.24);
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

export const DesktopCta = styled(Link)`
  ${cta}
  display: none;
  @media (min-width: ${breakpoints.content}) { display: inline-flex; }
`;

export const MenuButton = styled.button`
  display: inline-grid;
  place-items: center;
  width: 2.65rem;
  height: 2.65rem;
  padding: 0;
  border: 1px solid rgba(245, 242, 236, 0.22);
  border-radius: ${layout.radii.control};
  background: transparent;
  color: ${colors.white};

  @media (min-width: ${breakpoints.content}) { display: none; }
`;

export const MenuStatus = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export const MobilePanel = styled.div`
  display: grid;

  > nav {
    width: min(calc(100% - 2rem), 640px);
    margin-inline: auto;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }

  nav > a:not(:last-child) {
    position: relative;
    padding: 0.72rem 0;
    color: ${colors.white};
    font-family: ${fonts.primary};
    font-size: 0.98rem;
    text-decoration: none;
    transition: color ${motionTokens.duration.quick} ${motionTokens.easing.standard};
  }

  nav > a:not(:last-child)::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -0.7rem;
    width: 3px;
    height: 1.1rem;
    background: ${colors.highlight};
    opacity: 0;
    transform: translateY(-50%) scaleY(0.55);
    transform-origin: center;
    transition: opacity ${motionTokens.duration.quick} ${motionTokens.easing.standard}, transform ${motionTokens.duration.quick} ${motionTokens.easing.standard};
  }

  nav > a:not(:last-child):focus-visible,
  nav > a:not(:last-child).is-active {
    outline: none;
    color: ${colors.white};
  }

  nav > a:not(:last-child):focus-visible::before,
  nav > a:not(:last-child).is-active::before,
  nav > a:not(:last-child):active::before {
    opacity: 1;
    transform: translateY(-50%) scaleY(1);
  }

  @media (min-width: ${breakpoints.content}) { display: none; }

  @media (prefers-reduced-motion: reduce) {
    nav > a:not(:last-child),
    nav > a:not(:last-child)::before {
      transition: none;
    }
  }
`;

export const MobileCta = styled(Link)`
  ${cta}
  display: inline-flex;
  width: 100%;
  margin: 0.75rem 0 1.15rem;
`;
