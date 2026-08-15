import styled from 'styled-components';
import { breakpoints, colors, fonts, layout } from '../../styles/theme';

export const Form = styled.form`
  width: min(100%, 58rem);
  margin: clamp(3.25rem, 6vw, 5rem) auto 0;
  padding: clamp(1.25rem, 3vw, 2.5rem);
  border: 1px solid rgba(145, 168, 255, 0.2);
  border-radius: ${layout.radii.action};
  background: rgba(13, 21, 34, 0.62);
  text-align: left;

  @media (max-width: ${breakpoints.mobileMax}) {
    margin-top: 2.5rem;
    padding: 1rem;
  }
`;

export const Heading = styled.h3`
  margin: 0 0 1.5rem;
  color: ${colors.white};
  font-family: ${fonts.heading};
  font-size: clamp(1.4rem, 2.4vw, 2rem);
  letter-spacing: -0.035em;
  line-height: 1.05;
`;

export const Fields = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;

  @media (max-width: ${breakpoints.tabletMax}) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.div<{ $wide?: boolean }>`
  min-width: 0;
  ${({ $wide }) => $wide && 'grid-column: 1 / -1;'}
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${colors.white};
  font-family: ${fonts.primary};
  font-size: 0.95rem;
  font-weight: 620;
`;

const controlStyles = `
  width: 100%;
  border: 1px solid rgba(185, 192, 204, 0.36);
  border-radius: ${layout.radii.control};
  background: rgba(245, 242, 236, 0.06);
  color: ${colors.white};
  font: 500 1rem/1.4 ${fonts.primary};
  outline: none;
  transition: border-color 160ms ease, background-color 160ms ease, box-shadow 160ms ease;

  &:focus-visible {
    border-color: ${colors.blue};
    background: rgba(245, 242, 236, 0.1);
    box-shadow: 0 0 0 3px rgba(145, 168, 255, 0.25);
  }

  &[aria-invalid='true'] {
    border-color: #ff9b9b;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const Input = styled.input`
  ${controlStyles}
  min-height: 3.1rem;
  padding: 0.75rem 0.85rem;
`;

export const Select = styled.select`
  ${controlStyles}
  min-height: 3.1rem;
  padding: 0.75rem 0.85rem;

  option {
    color: ${colors.ink};
  }
`;

export const Textarea = styled.textarea`
  ${controlStyles}
  min-height: 8.5rem;
  padding: 0.8rem 0.85rem;
  resize: vertical;
`;

export const Error = styled.p`
  margin: 0.45rem 0 0;
  color: #ffb5b5;
  font-family: ${fonts.primary};
  font-size: 0.86rem;
  line-height: 1.4;
`;

export const ErrorSummary = styled.div`
  margin-bottom: 1.25rem;
  padding: 0.85rem 1rem;
  border: 1px solid rgba(255, 181, 181, 0.45);
  border-radius: ${layout.radii.control};
  color: #ffd8d8;
  font-family: ${fonts.primary};
  font-size: 0.92rem;
  line-height: 1.45;
`;

export const CheckboxRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  margin-top: 1.5rem;
`;

export const Checkbox = styled.input`
  flex: 0 0 auto;
  width: 1.2rem;
  height: 1.2rem;
  margin: 0.15rem 0 0;
  accent-color: ${colors.highlight};
`;

export const CheckboxLabel = styled.label`
  color: rgba(245, 242, 236, 0.78);
  font-family: ${fonts.primary};
  font-size: 0.92rem;
  line-height: 1.5;

  a {
    color: ${colors.blue};
    text-decoration-thickness: 0.08em;
    text-underline-offset: 0.18em;

    &:focus-visible {
      outline: 2px solid ${colors.blue};
      outline-offset: 3px;
    }
  }
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;

  @media (max-width: ${breakpoints.mobileMax}) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const Submit = styled.button`
  min-height: 3.25rem;
  padding: 0.75rem 1.2rem;
  border: 1px solid ${colors.highlight};
  border-radius: ${layout.radii.action};
  background: ${colors.highlight};
  color: ${colors.white};
  cursor: pointer;
  font: 650 0.95rem/1 ${fonts.primary};
  transition: transform 160ms ease, background-color 160ms ease, opacity 160ms ease;

  &:hover:not(:disabled) {
    background: #7b73ff;
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 3px solid ${colors.blue};
    outline-offset: 3px;
  }

  &:disabled {
    cursor: wait;
    opacity: 0.7;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const Status = styled.p`
  margin: 0;
  color: rgba(245, 242, 236, 0.78);
  font-family: ${fonts.primary};
  font-size: 0.92rem;
  line-height: 1.45;
`;

export const Success = styled.div`
  margin-top: clamp(2.5rem, 5vw, 4rem);
  padding: clamp(1.25rem, 3vw, 2rem);
  border: 1px solid rgba(145, 168, 255, 0.35);
  border-radius: ${layout.radii.action};
  background: rgba(145, 168, 255, 0.08);
  color: ${colors.white};
  text-align: left;

  p {
    margin: 0;
    color: rgba(245, 242, 236, 0.8);
    font: 500 1rem/1.6 ${fonts.primary};
  }
`;
