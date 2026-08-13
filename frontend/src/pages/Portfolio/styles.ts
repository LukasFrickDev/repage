import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { breakpoints, colors, fonts, layout } from '../../styles/theme';

export const Page = styled.section`
  overflow: clip;
  background: ${colors.paper};
  color: ${colors.ink};
`;

export const Intro = styled.header`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-height: min(32rem, 52svh);
  padding: clamp(6rem, 9vw, 8rem) ${layout.containerPaddingInline} clamp(3rem, 5vw, 4.5rem);
  display: grid;
  align-items: end;
  background: ${colors.ink};
  color: ${colors.paper};

  @media (max-width: ${breakpoints.tabletMax}) {
    min-height: 24rem;
    padding-top: 6.5rem;
  }
`;

export const IntroInner = styled.div`
  position: relative;
  z-index: 1;
  width: ${layout.containerWidth};
  margin-inline: auto;
`;

export const Eyebrow = styled(motion.p)`
  margin-bottom: 1.35rem;
  color: ${colors.neonBlue};
  font-size: clamp(0.75rem, 0.82vw, 0.84rem);
  font-weight: 650;
  letter-spacing: 0.075em;
  text-transform: uppercase;
`;

export const Title = styled.h1`
  max-width: 12ch;
  font-family: ${fonts.heading};
  font-size: clamp(3rem, 7vw, 7rem);
  font-weight: 620;
  letter-spacing: -0.07em;
  line-height: 0.91;
  text-wrap: balance;
`;

export const TitlePole = styled(motion.span)`
  display: block;
  overflow: hidden;
  padding: 0.08em 0.16em 0.13em 0.06em;
  margin: -0.08em -0.16em -0.13em -0.06em;
  will-change: clip-path, opacity;
`;

export const TitlePoleText = styled(motion.span)`
  display: block;
  will-change: transform;
`;

export const IntroDescription = styled(motion.p)`
  max-width: 40rem;
  margin-top: clamp(1.75rem, 3vw, 2.75rem);
  color: ${colors.textSecondary};
  font-size: clamp(1rem, 1.25vw, 1.18rem);
  line-height: 1.65;
`;

export const Collection = styled.section`
  width: ${layout.containerWidth};
  margin-inline: auto;
  padding: clamp(3rem, 6vw, 6rem) ${layout.containerPaddingInline} clamp(5rem, 9vw, 9rem);
`;

export const CollectionHeader = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
  color: ${colors.graphite};
  font-size: 0.75rem;
  font-weight: 650;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const CollectionKicker = styled.p``;

export const CollectionRule = styled.span`
  height: 1px;
  background: rgba(16, 24, 39, 0.2);
`;

export const CollectionCount = styled.p`
  color: ${colors.highlight};
`;

export const ProjectList = styled.ol`
  margin: clamp(3rem, 6vw, 6rem) 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  row-gap: clamp(4.5rem, 8vw, 8rem);
  list-style: none;
`;

export const ProjectItem = styled(motion.li)`
  grid-column: 2 / 12;
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(15rem, 1fr);
  grid-template-rows: auto 1fr;
  column-gap: clamp(1.5rem, 4vw, 4.5rem);
  row-gap: 0.85rem;
  align-items: center;
  padding-bottom: clamp(4rem, 7vw, 7rem);
  border-bottom: 1px solid rgba(16, 24, 39, 0.16);

  &:last-child { border-bottom: 0; }

  @media (max-width: ${breakpoints.laptopMax}) {
    grid-column: 1 / -1;
    grid-template-columns: minmax(0, 1.35fr) minmax(13rem, 1fr);
    column-gap: clamp(1rem, 3vw, 2rem);
  }

  @media (max-width: ${breakpoints.tabletMax}) {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    gap: 1.25rem;
    padding-bottom: clamp(3.5rem, 12vw, 5rem);

    & > div:first-of-type {
      grid-column: 1;
      grid-row: auto;
    }

    & > a {
      grid-column: 1;
      grid-row: auto;
    }

    & > div:last-of-type {
      grid-column: 1;
      grid-row: auto;
      width: 100%;
    }
  }
`;

export const ProjectMeta = styled.div`
  grid-column: 2;
  grid-row: 1;
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
`;

export const ProjectMediaLink = styled(Link)`
  min-width: 0;
  width: 100%;
  grid-column: 1;
  grid-row: 1 / 3;
  display: block;
  color: inherit;
  text-decoration: none;
`;

export const ProjectInfo = styled.div`
  min-width: 0;
  width: min(100%, 52rem);
  grid-column: 2;
  grid-row: 2;
  display: grid;
`;

export const ProjectIndex = styled.span`
  color: ${colors.highlight};
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
`;

export const ProjectType = styled.p`
  color: ${colors.graphite};
  font-size: clamp(0.78rem, 0.9vw, 0.9rem);
  font-weight: 650;
  letter-spacing: 0.02em;
`;

export const ProjectTitle = styled.h2`
  margin-top: clamp(0.8rem, 1.5vw, 1.25rem);
  font-family: ${fonts.heading};
  font-size: clamp(2rem, 3.3vw, 3.55rem);
  font-weight: 620;
  letter-spacing: -0.06em;
  line-height: 0.96;
  text-wrap: balance;
`;

export const ProjectSummary = styled.p`
  max-width: 29rem;
  margin-top: 1rem;
  color: ${colors.graphite};
  font-size: clamp(0.98rem, 1.1vw, 1.08rem);
  line-height: 1.6;
`;

export const ProjectDetails = styled.p`
  margin-top: 1.25rem;
  color: ${colors.graphite};
  font-size: 0.86rem;
  line-height: 1.5;
`;

export const CollectionFooter = styled.div`
  margin-top: clamp(5rem, 11vw, 11rem);
  padding-top: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  border-top: 1px solid rgba(16, 24, 39, 0.2);

  @media (max-width: ${breakpoints.tabletMax}) {
    width: 100%;
    padding-left: 0;
    align-items: stretch;
    flex-direction: column;
  }
`;

export const FooterNote = styled.p`
  color: ${colors.graphite};
  font-size: 0.95rem;
  line-height: 1.5;
`;
