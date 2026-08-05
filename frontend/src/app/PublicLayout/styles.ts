import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { colors, fonts, layout } from '../../styles/theme';

export const SkipLink = styled(Link)`
  position: fixed;
  z-index: 100;
  top: 0.75rem;
  left: max(1rem, calc((100vw - 1440px) / 2));
  padding: 0.75rem 1rem;
  border-radius: ${layout.radii.control};
  background: ${colors.paper};
  color: ${colors.ink};
  font-family: ${fonts.primary};
  font-weight: 650;
  text-decoration: none;
  transform: translateY(calc(-100% - 1rem));
  transition: transform 160ms ease;

  &:focus-visible {
    transform: translateY(0);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const Main = styled.main`
  min-width: 0;
  min-height: 70vh;
  background: ${colors.background};
`;
