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
  min-height: calc(100svh - ${layout.headerHeight});
  display: flex;
  background: ${colors.ink};
  color: ${colors.paper};
  padding: clamp(4.5rem, 7vw, 6.5rem) ${layout.containerPaddingInline} 0;

  &::after {
    position: absolute;
    z-index: -1;
    right: 0;
    bottom: 0;
    left: 0;
    height: 2.75rem;
    content: '';
    background: linear-gradient(${colors.ink}, ${colors.inkDeep});
  }

  @media (max-width: ${breakpoints.tabletMax}) {
    min-height: calc(100svh - ${layout.headerHeight});
    padding-top: calc(${layout.headerHeight} + clamp(1.5rem, 6vw, 2.5rem));
    padding-bottom: clamp(2.5rem, 8vw, 4rem);
  }
`;

export const IntroInner = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  width: min(100%, 78rem);
  margin-inline: auto;
`;

export const IntroMain = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transform: translateY(-3%);

  @media (max-width: ${breakpoints.tabletMax}) {
    flex: 1;
    justify-content: center;
    transform: translateY(-2%);
  }
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

export const Gallery = styled.section`
  max-width: 68rem;
  margin: 0 auto clamp(5rem, 9vw, 8rem);
`;

export const GalleryEyebrow = styled.p`
  color: ${colors.highlight};
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const GalleryTitle = styled.h2`
  max-width: 17ch;
  margin-top: 0.75rem;
  font-family: ${fonts.heading};
  font-size: clamp(2rem, 3.5vw, 4rem);
  font-weight: 620;
  letter-spacing: -0.065em;
  line-height: 0.96;
`;

export const GalleryGroup = styled(motion.div)`
  margin-top: clamp(2.5rem, 5vw, 4.5rem);
`;

export const GalleryLabel = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: ${colors.highlight};
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
`;

export const GalleryGrid = styled.div<{ $variant: 'desktop' | 'mobile' }>`
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: ${({ $variant }) => ($variant === 'mobile' ? 'flex-start' : 'center')};
  gap: ${({ $variant }) => ($variant === 'mobile' ? 'clamp(1rem, 3vw, 2rem)' : 'clamp(1.5rem, 3vw, 3rem)')};
  padding-inline: ${({ $variant }) => ($variant === 'mobile' ? 'clamp(1rem, 5vw, 3rem)' : '0')};
  @media (max-width: ${breakpoints.tabletMax}) {
    gap: ${({ $variant }) => ($variant === 'mobile' ? '1rem' : '2.5rem')};
    flex-direction: column;
    align-items: center;
    padding-inline: 0;
  }
`;

export const GalleryFigure = styled.figure<{ $variant: 'desktop' | 'mobile' }>`
  min-width: 0;
  margin: 0;
  flex: ${({ $variant }) => ($variant === 'mobile' ? '0 1 clamp(7rem, 18%, 12rem)' : '0 1 calc(50% - 1.5rem)')};
  max-width: ${({ $variant }) => ($variant === 'mobile' ? '12rem' : '32rem')};
  @media (max-width: ${breakpoints.tabletMax}) {
    flex-basis: auto;
    width: ${({ $variant }) => ($variant === 'mobile' ? 'min(100%, 11rem)' : '100%')};
    max-width: ${({ $variant }) => ($variant === 'mobile' ? '12rem' : 'none')};
  }
`;

export const GalleryImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  border-radius: clamp(0.5rem, 0.8vw, 0.75rem);
  box-shadow: 0 1.5rem 3rem rgba(16, 24, 39, 0.12);
  transition: transform 240ms ease, box-shadow 240ms ease;
  figure:hover &, figure:focus-within & { transform: scale(1.008); box-shadow: 0 1.75rem 3.25rem rgba(16, 24, 39, 0.16); }
  @media (prefers-reduced-motion: reduce) { transition: none; }
`;

export const GalleryCaption = styled.figcaption`
  margin-top: 0.75rem;
  color: ${colors.graphite};
  font-size: 0.78rem;
  line-height: 1.45;
`;

export const GalleryTrigger = styled.button`
  width: 100%;
  padding: 0;
  display: block;
  border: 0;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: zoom-in;
`;

export const Viewer = styled.div`
  position: fixed;
  z-index: 100;
  inset: 0;
  padding: clamp(1rem, 3vw, 3rem);
  display: grid;
  place-items: center;
  background: rgba(13, 21, 34, 0.94);
`;

export const ViewerPanel = styled.div`
  width: min(100%, 78rem);
  max-height: 100%;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 1rem;
  color: ${colors.paper};
`;

export const ViewerToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

export const ViewerControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const ViewerButton = styled.button`
  min-width: 2.5rem;
  min-height: 2.5rem;
  padding: 0.55rem 0.75rem;
  border: 1px solid rgba(245, 242, 236, 0.24);
  border-radius: ${layout.radii.control};
  background: rgba(245, 242, 236, 0.08);
  color: ${colors.paper};
  font: inherit;
  cursor: pointer;
  &:hover:not(:disabled), &:focus-visible:not(:disabled) { background: rgba(108, 99, 255, 0.72); }
  &:disabled { cursor: not-allowed; opacity: 0.38; }
`;

export const ViewerImageWrap = styled.div`
  min-height: 0;
  display: grid;
  place-items: center;
  overflow: auto;
`;

export const ViewerImage = styled.img`
  max-width: 100%;
  max-height: min(72svh, 52rem);
  width: auto;
  height: auto;
  display: block;
  object-fit: contain;
`;

export const ViewerVideo = styled.video`
  max-width: 100%;
  max-height: min(72svh, 52rem);
  width: auto;
  height: auto;
  display: block;
  object-fit: contain;
`;

export const ViewerCaption = styled.p`
  max-width: 52rem;
  color: ${colors.textSecondary};
  font-size: 0.9rem;
  line-height: 1.5;
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
    align-items: baseline;
    gap: 0.75rem;
    width: 100%;
  }
`;

export const NeighborLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  min-width: 0;
  flex: 1 1 0;
  justify-content: center;
  max-width: 100%;
  svg { flex: 0 0 1rem; }
  color: ${colors.ink};
  font-weight: 700;
  text-decoration: none;
  &:hover, &:focus-visible { color: ${colors.highlight}; }
  &:last-child { justify-content: flex-end; }
`;

export const ReturnLink = styled(Link)`
  display: block;
  margin-top: 0;
  min-width: 0;
  flex: 1 1 0;
  max-width: 100%;
  color: ${colors.graphite};
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 0.3rem;

  @media (max-width: ${breakpoints.tabletMax}) {
    text-align: left;
  }
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
