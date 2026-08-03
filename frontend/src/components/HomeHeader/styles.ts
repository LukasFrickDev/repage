import { motion } from 'framer-motion';
import styled, { css } from 'styled-components';
import { colors, fonts } from '../../styles/globalStyles';

export const Header = styled(motion.header)<{ $scrolled: boolean; $open: boolean }>`
  position: fixed;
  inset: 0 0 auto;
  z-index: 20;
  border-bottom: 1px solid transparent;
  background: transparent;
  transition: background 220ms ease, border-color 220ms ease, box-shadow 220ms ease;

  ${({ $scrolled, $open }) => ($scrolled || $open) && css`
    border-color: rgba(245, 242, 236, 0.11);
    background: rgba(16, 24, 39, 0.9);
    box-shadow: 0 10px 32px rgba(4, 8, 17, 0.15);
    backdrop-filter: blur(12px);
  `}
`;

export const Inner = styled.div`
  width: min(calc(100% - clamp(2rem, 8vw, 9rem)), 1440px);
  height: clamp(4.25rem, 5.2vw, 4.75rem);
  margin-inline: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

export const Brand = styled.a`
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
  gap: clamp(1.15rem, 2.3vw, 2.3rem);

  a {
    position: relative;
    padding-block: 0.55rem;
    color: ${colors.textSecondary};
    font-family: ${fonts.primary};
    font-size: 0.88rem;
    font-weight: 540;
    text-decoration: none;
    transition: color 160ms ease;
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
    transition: transform 180ms ease;
  }

  a:hover, a:focus-visible { color: ${colors.white}; }
  a:hover::after, a:focus-visible::after { transform: scaleX(1); }

  @media (min-width: 900px) { display: flex; }
`;

const cta = `
  min-height: 2.65rem;
  padding: 0.65rem 0.95rem;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  border: 1px solid transparent;
  border-radius: 10px;
  background: linear-gradient(105deg, ${colors.highlight}, ${colors.neonBlue});
  color: ${colors.background};
  font-family: ${fonts.primary};
  font-size: 0.84rem;
  font-weight: 650;
  text-decoration: none;
  transition: transform 180ms ease, box-shadow 180ms ease;

  svg { transition: transform 180ms ease; }
  &:hover { transform: translateY(-1px); box-shadow: 0 10px 26px rgba(108, 99, 255, 0.24); }
  &:hover svg { transform: translateX(3px); }
`;

export const DesktopCta = styled.a`
  ${cta}
  display: none;
  @media (min-width: 900px) { display: inline-flex; }
`;

export const MenuButton = styled.button`
  display: inline-grid;
  place-items: center;
  width: 2.65rem;
  height: 2.65rem;
  padding: 0;
  border: 1px solid rgba(245, 242, 236, 0.22);
  border-radius: 10px;
  background: transparent;
  color: ${colors.white};

  @media (min-width: 900px) { display: none; }
`;

export const MobilePanel = styled.div<{ $open: boolean }>`
  display: grid;
  grid-template-rows: ${({ $open }) => ($open ? '1fr' : '0fr')};
  transition: grid-template-rows 200ms ease;

  > nav {
    width: min(calc(100% - 2rem), 640px);
    margin-inline: auto;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    overflow: hidden;
  }

  nav > a:not(:last-child) {
    padding: 0.72rem 0;
    color: ${colors.white};
    font-family: ${fonts.primary};
    font-size: 0.98rem;
    text-decoration: none;
  }

  @media (min-width: 900px) { display: none; }
`;

export const MobileCta = styled.a`
  ${cta}
  display: inline-flex;
  width: 100%;
  margin: 0.75rem 0 1.15rem;
`;
