import styled from 'styled-components';
import { breakpoints, colors, fonts, layout, motion, withAlpha } from '../../styles/theme';

export const Banner = styled.aside`
  position: fixed;
  z-index: 20;
  right: clamp(0.75rem, 2vw, 1rem);
  bottom: clamp(0.75rem, 2vw, 1rem);
  left: clamp(0.75rem, 2vw, 1rem);
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1.5rem;
  padding: clamp(0.8rem, 2.5vw, 1.15rem) clamp(0.85rem, 2.2vw, 1.75rem);
  border: 1px solid ${withAlpha(colors.neonBlue, 0.35)};
  border-radius: ${layout.radii.action};
  background: ${withAlpha(colors.inkDeep, 0.98)};
  box-shadow: 0 1rem 3rem ${withAlpha(colors.ink, 0.34)};
  color: ${colors.white};
  font-family: ${fonts.primary};
  pointer-events: none;
  opacity: 0;
  transform: translateY(0.5rem);
  transition: opacity ${motion.duration.medium} ${motion.easing.standard}, transform ${motion.duration.medium} ${motion.easing.standard};
  will-change: opacity, transform;

  &[data-visible='true'] {
    opacity: 1;
    transform: translateY(0);
  }

  &[data-visible='true'] > * { pointer-events: auto; }

  @media (max-width: ${breakpoints.contentMax}) {
    align-items: stretch;
    flex-direction: column;
    gap: 0.75rem;
  }

  @media (max-height: 520px) {
    max-height: calc(100svh - 1.5rem);
    overflow-y: auto;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const BannerCopy = styled.div` { max-width: 43rem; }`;
export const BannerTitle = styled.h2` { font-size: 1.05rem; font-weight: 650; }`;
export const BannerText = styled.p`
  margin-top: 0.35rem;
  color: ${withAlpha(colors.white, 0.76)};
  font-size: 0.88rem;
  line-height: 1.5;
  a { color: ${colors.white}; font-weight: 650; }
`;
export const BannerActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: end;
  gap: 0.55rem;
  @media (max-width: ${breakpoints.tabletMax}) {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    justify-content: stretch;

    & > button:first-child {
      grid-column: 1;
      grid-row: 1;
    }

    & > button:nth-child(2) {
      grid-column: 1 / -1;
      grid-row: 2;
      justify-self: center;
      min-width: 8.5rem;
    }

    & > button:last-child {
      grid-column: 2;
      grid-row: 1;
    }
  }
`;

const buttonBase = `
  min-height: 2.65rem;
  padding: 0.65rem 0.9rem;
  border: 1px solid ${withAlpha(colors.white, 0.3)};
  border-radius: ${layout.radii.control};
  font-family: ${fonts.primary};
  font-size: 0.82rem;
  font-weight: 650;
  transition: background ${motion.duration.fast} ${motion.easing.standard}, color ${motion.duration.fast} ${motion.easing.standard};
`;
export const SecondaryButton = styled.button`${buttonBase} background: transparent; color: ${colors.white}; &:hover { background: ${withAlpha(colors.white, 0.1)}; }`;
export const PrimaryButton = styled.button`${buttonBase} border-color: ${colors.violet}; background: ${colors.violet}; color: ${colors.paper}; &:hover { background: #827aff; }`;

export const DialogBackdrop = styled.div`
  position: fixed;
  z-index: 30;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: ${withAlpha(colors.ink, 0.7)};
`;
export const Dialog = styled.div`
  width: min(100%, 42rem);
  max-height: min(44rem, calc(100dvh - 2rem));
  overflow-y: auto;
  padding: clamp(1.25rem, 3vw, 2rem);
  border: 1px solid ${withAlpha(colors.ink, 0.14)};
  border-radius: ${layout.radii.action};
  background: ${colors.paper};
  color: ${colors.ink};
  box-shadow: 0 1.5rem 4rem ${withAlpha(colors.ink, 0.35)};
`;
export const DialogHeader = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 1rem;
`;
export const DialogEyebrow = styled.p` { color: ${colors.highlight}; font-size: 0.72rem; font-weight: 750; letter-spacing: 0.09em; text-transform: uppercase; }`;
export const DialogTitle = styled.h2` { margin-top: 0.35rem; font-size: clamp(1.7rem, 4vw, 2.4rem); letter-spacing: -0.045em; line-height: 1; }`;
export const CloseButton = styled.button`
  width: 2.5rem; height: 2.5rem; flex: 0 0 auto; border: 1px solid ${withAlpha(colors.ink, 0.22)}; border-radius: 50%; background: transparent; color: ${colors.ink}; font-size: 1.5rem; line-height: 1;
`;
export const DialogDescription = styled.p` { max-width: 35rem; margin-top: 1rem; color: ${colors.graphite}; line-height: 1.6; }`;
export const CategoryList = styled.div` { display: grid; gap: 0.65rem; margin-top: 1.5rem; }`;
export const Category = styled.section` { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1rem; border: 1px solid ${withAlpha(colors.ink, 0.14)}; border-radius: ${layout.radii.control}; }`;
export const CategoryText = styled.div` { max-width: 30rem; }`;
export const CategoryTitle = styled.h3` { font-size: 1rem; }`;
export const CategoryDescription = styled.p` { margin-top: 0.35rem; color: ${colors.graphite}; font-size: 0.88rem; line-height: 1.5; }`;
export const RequiredStatus = styled.span` { flex: 0 0 auto; color: ${colors.graphite}; font-size: 0.78rem; font-weight: 700; }`;
export const SwitchLabel = styled.label` { display: grid; justify-items: end; gap: 0.35rem; flex: 0 0 auto; color: ${colors.graphite}; font-size: 0.75rem; font-weight: 650; }`;
export const Switch = styled.input` accent-color: ${colors.highlight}; width: 1.25rem; height: 1.25rem; `;
export const DialogActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: end;
  gap: 0.55rem;
  margin-top: 1.5rem;

  @media (max-width: ${breakpoints.tabletMax}) {
    & > button:last-child {
      margin-left: auto;
    }
  }
`;
