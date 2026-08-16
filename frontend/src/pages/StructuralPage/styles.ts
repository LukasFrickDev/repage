import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { breakpoints, colors, fonts, layout } from '../../styles/theme';

export const Page = styled.section`
  min-height: 70vh;
  padding: clamp(7.5rem, 12vw, 10rem) ${layout.containerPaddingInline} clamp(5rem, 8vw, 8rem);
  background: ${colors.paper};
  color: ${colors.ink};
`;

export const Container = styled.div`
  width: min(100%, 70rem);
  margin-inline: auto;
`;

export const DocumentHeader = styled.header`
  max-width: 52rem;
`;

export const Eyebrow = styled.p`
  margin-bottom: 1rem;
  color: ${colors.highlight};
  font-family: ${fonts.primary};
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const Title = styled.h1`
  max-width: 16ch;
  font-family: ${fonts.heading};
  font-size: clamp(2.5rem, 7vw, 5.5rem);
  font-weight: 650;
  letter-spacing: -0.06em;
  line-height: 0.98;
  text-wrap: balance;
`;

export const Description = styled.p`
  max-width: 42rem;
  margin-top: 1.75rem;
  color: ${colors.graphite};
  font-size: clamp(1rem, 1.5vw, 1.15rem);
  line-height: 1.7;
`;

export const DocumentMeta = styled.p`
  margin-top: 1.25rem;
  color: ${colors.graphite};
  font-size: 0.9rem;
  line-height: 1.6;
`;

export const DocumentBody = styled.div`
  width: min(100%, 48rem);
  margin-top: clamp(3.5rem, 7vw, 6rem);
`;

export const DocumentSection = styled.section`
  & + & {
    margin-top: clamp(2.75rem, 6vw, 4.5rem);
  }
`;

export const SectionTitle = styled.h2`
  margin-bottom: 1rem;
  color: ${colors.ink};
  font-family: ${fonts.heading};
  font-size: clamp(1.55rem, 2.8vw, 2.25rem);
  font-weight: 650;
  letter-spacing: -0.035em;
  line-height: 1.1;
  scroll-margin-top: 6rem;
`;

export const Paragraph = styled.p`
  color: ${colors.graphite};
  font-size: 1rem;
  line-height: 1.75;

  & + & { margin-top: 1rem; }
`;

export const List = styled.ul`
  margin: 1rem 0 0;
  padding-left: 1.25rem;
  color: ${colors.graphite};
  font-size: 1rem;
  line-height: 1.75;

  li + li { margin-top: 0.55rem; }
`;

export const ActionButton = styled.button`
  min-height: 3rem;
  padding: 0.75rem 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${colors.ink};
  border-radius: ${layout.radii.action};
  background: transparent;
  color: ${colors.ink};
  font: inherit;
  font-weight: 650;
  cursor: pointer;

  &:hover { border-color: ${colors.highlight}; }

  &:focus-visible {
    outline: 2px solid ${colors.blue};
    outline-offset: 3px;
  }
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;

  @media (max-width: ${breakpoints.compactMax}) {
    display: grid;
  }
`;

export const ActionLink = styled(Link)`
  min-height: 3rem;
  padding: 0.75rem 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${colors.ink};
  border-radius: ${layout.radii.action};
  color: ${colors.ink};
  font-weight: 650;
  text-decoration: none;

  &[data-primary='true'] {
    border-color: ${colors.highlight};
    background: ${colors.highlight};
    color: ${colors.paper};
  }
`;

export const ProjectList = styled.ul`
  margin: 3rem 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  list-style: none;

  @media (max-width: ${breakpoints.tabletMax}) {
    grid-template-columns: 1fr;
  }
`;

export const ProjectLink = styled(Link)`
  min-height: 6rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.75rem;
  border: 1px solid rgba(16, 24, 39, 0.22);
  border-radius: ${layout.radii.action};
  color: ${colors.ink};
  text-decoration: none;

  strong { font-size: 1.1rem; }
  span { color: ${colors.graphite}; font-size: 0.9rem; }

  &:hover { border-color: ${colors.highlight}; }
`;

export const Meta = styled.p`
  margin-top: 1.5rem;
  color: ${colors.graphite};
  font-size: 0.9rem;
  font-weight: 650;
`;
