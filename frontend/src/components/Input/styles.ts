import styled from 'styled-components';
import { colors, fonts } from '../../styles/globalStyles';

export const Input = styled.input`
  display: flex;
  height: 2.5rem;
  width: 100%;
  border-radius: 8px;
  border: 1px solid ${colors.gridLine};
  background: ${colors.backgroundSecondary};
  color: ${colors.white};
  font-size: 1rem;
  font-family: ${fonts.primary};
  padding: 0.5rem 0.75rem;
  transition:
    border 0.2s,
    box-shadow 0.2s;
  outline: none;

  &::placeholder {
    color: ${colors.textSecondary};
    opacity: 1;
  }

  &:focus {
    border-color: ${colors.highlight};
    box-shadow: 0 0 0 2px ${colors.neonBlue}55;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
