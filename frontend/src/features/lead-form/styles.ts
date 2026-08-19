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
  transition: border-color 160ms ease, background-color 160ms ease;

  &&:focus {
    outline: none;
    border-color: ${colors.blue} !important;
    background: rgba(245, 242, 236, 0.1) !important;
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

export const Combobox = styled.div`
  position: relative;
`;

export const ComboboxButton = styled.button`
  ${controlStyles}
  position: relative;
  min-height: 3.1rem;
  padding: 0.75rem 2.75rem 0.75rem 0.85rem;
  text-align: left;
  cursor: pointer;

  &::after {
    position: absolute;
    top: 50%;
    right: 1rem;
    width: 0.55rem;
    height: 0.55rem;
    border-right: 2px solid currentColor;
    border-bottom: 2px solid currentColor;
    content: '';
    transform: translateY(-65%) rotate(45deg);
  }

  &[aria-expanded='true']::after {
    transform: translateY(-25%) rotate(225deg);
  }
`;

export const ComboboxList = styled.div`
  position: absolute;
  z-index: 10;
  top: calc(100% + 0.35rem);
  right: 0;
  left: 0;
  max-height: min(16rem, 35vh);
  overflow-y: auto;
  padding: 0.35rem;
  border: 1px solid rgba(145, 168, 255, 0.55);
  border-radius: ${layout.radii.control};
  background: #172136;
  box-shadow: 0 0.8rem 1.75rem rgba(3, 8, 19, 0.35);
`;

export const ComboboxOption = styled.div`
  padding: 0.75rem 0.7rem;
  border-radius: calc(${layout.radii.control} - 0.15rem);
  color: ${colors.white};
  cursor: pointer;
  font: 500 1rem/1.4 ${fonts.primary};

  &:hover,
  &:focus-visible,
  &[data-highlighted='true'],
  &[aria-selected='true'] {
    outline: none;
    background: rgba(145, 168, 255, 0.18);
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

export const Honeypot = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export const DirectContact = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.4rem;
  margin-top: 1.25rem;
  color: rgba(245, 242, 236, 0.68);
  font-family: ${fonts.primary};
  font-size: 0.92rem;
  line-height: 1.45;
  text-align: center;

  @media (max-width: ${breakpoints.mobileMax}) {
    align-items: center;
    flex-direction: column;
    gap: 0.15rem;
  }
`;

export const WhatsAppLink = styled.a`
  color: ${colors.blue};
  font-weight: 650;
  text-decoration-thickness: 0.08em;
  text-underline-offset: 0.18em;

  &:focus-visible {
    outline: 2px solid ${colors.blue};
    outline-offset: 3px;
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

export const Status = styled.p<{ $success?: boolean }>`
  flex: 1 1 18rem;
  min-width: 0;
  margin: 0;
  color: ${colors.white};
  font-family: ${fonts.primary};
  font-size: 0.92rem;
  line-height: 1.45;
  overflow-wrap: anywhere;

  strong {
    font-weight: 700;
  }

  @media (max-width: ${breakpoints.mobileMax}) {
    flex: 0 1 auto;
    width: 100%;
  }
`;
