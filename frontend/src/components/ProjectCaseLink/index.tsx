import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { breakpoints, colors, fonts, motion as motionTokens, homepageTokens } from '../../styles/theme';

type ProjectCaseLinkProps = {
  to: string;
  ariaLabel: string;
  tabIndex?: number;
  homepage?: boolean;
};

const StyledLink = styled(Link)<{ $homepage: boolean }>`
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  color: ${({ $homepage }) => ($homepage ? colors.white : colors.ink)};
  font-family: ${({ $homepage }) => ($homepage ? fonts.primary : 'inherit')};
  font-size: ${({ $homepage }) => ($homepage ? homepageTokens.projects.categorySize : '0.92rem')};
  font-weight: ${({ $homepage }) => ($homepage ? 650 : 700)};
  text-decoration: ${({ $homepage }) => ($homepage ? 'none' : 'none')};
  ${({ $homepage }) => ($homepage ? 'grid-column: 10 / -1; justify-self: end;' : 'margin-top: 1.45rem; padding-bottom: 0.3rem; border-bottom: 1px solid currentColor;')}
  transition: color ${motionTokens.duration.fast} ${motionTokens.easing.standard}, border-color ${motionTokens.duration.fast} ${motionTokens.easing.standard};

  &:hover { color: ${({ $homepage }) => ($homepage ? colors.neonBlue : colors.highlight)}; }

  svg { transition: transform ${motionTokens.duration.fast} ${motionTokens.easing.standard}; }
  &:hover svg { transform: translateX(3px); }

  &:focus-visible {
    outline: 2px solid ${({ $homepage }) => ($homepage ? colors.neonBlue : colors.highlight)};
    outline-offset: 0.45rem;
  }

  @media (max-width: ${breakpoints.tabletMax}) {
    ${({ $homepage }) => ($homepage ? 'grid-column: 2; grid-row: 1; margin-top: 0.2rem; white-space: nowrap;' : '')}
  }
`;

export function ProjectCaseLink({ to, ariaLabel, tabIndex, homepage = false }: ProjectCaseLinkProps) {
  return (
    <StyledLink to={to} aria-label={ariaLabel} tabIndex={tabIndex} $homepage={homepage}>
      Ver case <ArrowRight size={18} aria-hidden="true" />
    </StyledLink>
  );
}
