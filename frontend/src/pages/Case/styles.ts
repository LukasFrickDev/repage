import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { breakpoints, colors, fonts, layout } from '../../styles/theme';

export const Page = styled.section`
  background: ${colors.paper};
  color: ${colors.ink};
`;

export const Intro = styled.header`
  position: relative;
  z-index: 1;
  background: ${colors.ink};
  color: ${colors.paper};
  padding: clamp(4.5rem, 7vw, 6.5rem) ${layout.containerPaddingInline} 0;

  &::after {
    position: absolute;
    z-index: -1;
    right: 0;
    bottom: -2.75rem;
    left: 0;
    height: 2.75rem;
    content: '';
    background: linear-gradient(${colors.ink}, ${colors.inkDeep});
  }
`;

export const IntroInner = styled.div`
  width: min(100%, 78rem);
  margin-inline: auto;
`;

export const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: ${colors.neonBlue};
  font-size: 0.86rem;
  font-weight: 650;
  text-decoration: none;
  &:hover, &:focus-visible { color: ${colors.paper}; }
`;

export const IntroMeta = styled(motion.div)`
  margin-top: clamp(2.5rem, 4vw, 4rem);
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.5rem;
  color: ${colors.neonBlue};
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const Title = styled.h1`
  max-width: 12ch;
  margin-top: 1rem;
  font-family: ${fonts.heading};
  font-size: clamp(2.75rem, 6vw, 6.5rem);
  font-weight: 620;
  letter-spacing: -0.075em;
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

export const Lead = styled(motion.p)`
  max-width: 45rem;
  margin-top: clamp(1.25rem, 2.5vw, 2rem);
  color: ${colors.textSecondary};
  font-size: clamp(1.05rem, 1.45vw, 1.25rem);
  line-height: 1.65;
`;

export const Participation = styled(motion.p)`
  max-width: 48rem;
  margin-top: 1.15rem;
  color: rgba(245, 242, 236, 0.7);
  font-size: 0.94rem;
  line-height: 1.6;
`;

export const ExternalLink = styled(motion.a)`
  width: fit-content;
  margin-top: 1.25rem;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: ${colors.paper};
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 0.3rem;
`;

export const CoverLink = styled(motion(Link))`
  position: relative;
  z-index: 1;
  width: min(100%, 72rem);
  margin: clamp(3rem, 5vw, 5rem) auto -2.75rem;
  display: block;
  color: inherit;
  text-decoration: none;
`;

export const Body = styled.div`
  width: min(100%, 78rem);
  margin-inline: auto;
  padding: clamp(6.5rem, 10vw, 9rem) ${layout.containerPaddingInline} clamp(4rem, 7vw, 7rem);
`;

export const Chapter = styled(motion.section)<{ $compactAfter?: boolean }>`
  max-width: 68rem;
  margin: 0 auto ${({ $compactAfter }) => ($compactAfter ? 'clamp(3rem, 5vw, 4rem)' : 'clamp(5rem, 9vw, 8rem)')};
`;

export const ChapterEyebrow = styled.p`
  color: ${colors.highlight};
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const ChapterTitle = styled.h2`
  max-width: 17ch;
  margin-top: 0.75rem;
  font-family: ${fonts.heading};
  font-size: clamp(2rem, 3.5vw, 4rem);
  font-weight: 620;
  letter-spacing: -0.065em;
  line-height: 0.96;
`;

export const FeaturedCopy = styled.p`
  max-width: 48rem;
  margin-top: clamp(1.75rem, 3vw, 3rem);
  font-size: clamp(1.2rem, 1.8vw, 1.55rem);
  line-height: 1.5;
`;

export const CopyPair = styled.div`
  margin-top: clamp(3rem, 5vw, 5rem);
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: clamp(2rem, 6vw, 6rem);
  @media (max-width: ${breakpoints.tabletMax}) { grid-template-columns: 1fr; gap: 2.5rem; }
`;

export const DeliveryColumns = styled.div`
  margin-top: clamp(3rem, 5vw, 4.5rem);
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: clamp(2rem, 6vw, 6rem);
  @media (max-width: ${breakpoints.tabletMax}) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

export const DeliveryColumn = styled.div`
  display: grid;
  gap: 2.5rem;
`;

export const CopyBlock = styled.div`
`;

export const BlockTitle = styled.h3<{ $bordered?: boolean; $strong?: boolean }>`
  padding-top: ${({ $bordered }) => ($bordered ? '1.15rem' : '0')};
  border-top: ${({ $bordered, $strong }) => ($bordered ? ($strong ? '2px solid rgba(16, 24, 39, 0.34)' : '1px solid rgba(16, 24, 39, 0.28)') : 'none')};
  color: ${colors.highlight};
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const CopyBlockText = styled.p`
  margin-top: 1.25rem;
  font-size: 1.08rem;
  line-height: 1.7;
`;

export const ListBlock = styled.div<{ $subdued: boolean }>`
  margin-top: 0;
  color: ${({ $subdued }) => ($subdued ? colors.graphite : colors.ink)};
`;

export const ItemList = styled.ul`
  max-width: 58rem;
  margin: 1.25rem 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0;
  list-style: none;
  li {
    position: relative;
    padding: 0.55rem 0 0.55rem 1rem;
    line-height: 1.45;
  }
  li::before {
    position: absolute;
    top: 1.05em;
    left: 0;
    width: 0.4rem;
    height: 0.4rem;
    content: '';
    border-radius: 50%;
    background: ${colors.highlight};
    transform: translateY(-50%);
  }
  li:nth-child(odd) { padding-right: 1.5rem; }
  li:nth-child(even) { padding-left: 2.5rem; }
  @media (max-width: ${breakpoints.tabletMax}) {
    grid-template-columns: 1fr;
    li:nth-child(n) { padding: 0.55rem 0 0.55rem 1rem; }
  }
`;

export const Closing = styled.section`
  max-width: 68rem;
  margin: 0 auto;
  padding-top: clamp(2.25rem, 4vw, 3.5rem);
`;

export const ClosingEyebrow = styled.p`
  color: ${colors.highlight};
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const ClosingTitle = styled.h2`
  max-width: 18ch;
  margin: 0.75rem 0 1.5rem;
  font-family: ${fonts.heading};
  font-size: clamp(2rem, 4vw, 4rem);
  font-weight: 620;
  letter-spacing: -0.065em;
  line-height: 0.96;
`;

export const NeighborNav = styled.nav`
  margin-top: 3.5rem;
  padding-top: 1.25rem;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  border-top: 1px solid rgba(16, 24, 39, 0.16);
  @media (max-width: ${breakpoints.tabletMax}) {
    align-items: flex-start;
    flex-direction: column;
    gap: 1.25rem;
  }
`;

export const NeighborLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: ${colors.ink};
  font-weight: 700;
  text-decoration: none;
  &:hover, &:focus-visible { color: ${colors.highlight}; }
`;

export const ReturnLink = styled(Link)`
  display: block;
  margin-top: 0;
  color: ${colors.graphite};
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 0.3rem;
`;

export const NotFoundPage = styled(Page)`
  min-height: 70vh;
  padding: clamp(7.5rem, 12vw, 10rem) ${layout.containerPaddingInline};
`;

export const NotFoundInner = styled.div`
  width: min(100%, 62rem);
  margin-inline: auto;
`;

export const Eyebrow = styled.p`
  color: ${colors.highlight};
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const TextLink = styled(Link)`
  display: inline-block;
  margin-top: 2rem;
  color: ${colors.ink};
  font-weight: 700;
`;
