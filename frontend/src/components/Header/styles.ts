import styled, { css } from 'styled-components';
import { colors, fonts, glow } from '../../styles/globalStyles';

// Container fixo do header
export const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: rgba(24, 24, 27, 0.85);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid ${colors.gridLine};
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

export const Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
`;

export const LogoLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  font-family: ${fonts.heading};
  font-size: 1.25rem;
  font-weight: bold;
  color: ${colors.white};
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.8;
  }
`;

export const LogoIcon = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background: ${colors.highlight};
  display: flex;
  align-items: center;
  justify-content: center;
  ${glow}
`;

export const NavLinks = styled.div`
  display: none;
  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
`;

export const NavLinkButton = styled.button<{ $active?: boolean }>`
  position: relative;
  background: none;
  border: none;
  color: ${({ $active }) => ($active ? colors.highlight : colors.white)};
  font-family: ${fonts.primary};
  font-size: 1rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: color 0.2s;
  &:hover {
    color: ${colors.neonBlue};
  }
  ${({ $active }) =>
    $active &&
    css`
      &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 3px;
        background: ${colors.highlight};
        border-radius: 2px;
      }
    `}
`;

export const TalkButton = styled.button`
  margin-left: 1rem;
`;
