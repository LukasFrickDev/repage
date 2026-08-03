import styled, { css } from 'styled-components';
import { colors, fonts } from '../../styles/globalStyles';

const variantStyles = {
  default: css`
    background: ${colors.highlight};
    color: ${colors.white};
    border: none;
    &:hover {
      background: ${colors.neonBlue};
    }
  `,
  secondary: css`
    background: ${colors.backgroundSecondary};
    color: ${colors.white};
    border: 1px solid ${colors.gridLine};
    &:hover {
      background: ${colors.highlight};
      color: ${colors.white};
    }
  `,
  destructive: css`
    background: #f43f5e;
    color: ${colors.white};
    border: none;
    &:hover {
      background: #be123c;
    }
  `,
  outline: css`
    background: transparent;
    color: ${colors.white};
    border: 1px solid ${colors.gridLine};
    &:hover {
      background: ${colors.gridLine};
    }
  `,
};

export const Badge = styled.div<{
  $variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}>`
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-family: ${fonts.primary};
  font-weight: 600;
  transition:
    background 0.2s,
    color 0.2s;
  cursor: default;
  ${({ $variant }) => variantStyles[$variant || 'default']}
`;
