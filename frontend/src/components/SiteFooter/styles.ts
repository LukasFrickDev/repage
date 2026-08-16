import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { breakpoints, colors, fonts, homepageTokens, motion } from '../../styles/theme';
import { HomepageEditorialFrame } from '../HomepageEditorialFrame';

export const Footer = styled.footer`
  padding: 0 ${homepageTokens.sectionPaddingInline};
  border-top: 1px solid rgba(145, 168, 255, 0.16);
  background: ${colors.background};
  color: ${colors.white};
`;

export const Container = styled(HomepageEditorialFrame)`
  padding-top: clamp(2rem, 3.4vw, 3rem);
`;

export const MainBand = styled.div`
  display: grid;
  grid-template-columns: minmax(18rem, 25rem) minmax(18rem, 21.25rem);
  align-items: start;
  justify-content: start;
  gap: clamp(5rem, 10vw, 8.5rem);

  @media (max-width: ${breakpoints.contentMax}) {
    grid-template-columns: 1fr;
    gap: clamp(1.5rem, 6vw, 2.25rem);
  }
`;

export const BrandBlock = styled.div`
  max-width: 25rem;
`;

export const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  color: ${colors.white};
  font-family: ${fonts.primary};
  font-size: 1.08rem;
  font-weight: 650;
  letter-spacing: -0.05em;
  text-decoration: none;

  img { width: 1.45rem; height: 1.45rem; }

  &:focus-visible {
    border-radius: 0.2rem;
    outline: 2px solid ${colors.neonBlue};
    outline-offset: 4px;
  }
`;

export const BrandDescription = styled.p`
  max-width: 24rem;
  margin-top: 0.8rem;
  color: rgba(185, 192, 204, 0.64);
  font-family: ${fonts.primary};
  font-size: 0.88rem;
  line-height: 1.55;
`;

export const Navigation = styled.nav`
  display: grid;
  grid-template-columns: repeat(2, minmax(8.5rem, 10rem));
  grid-template-rows: repeat(3, auto);
  justify-content: end;
  gap: 0 clamp(0.9rem, 1.5vw, 1.25rem);
  align-self: start;

  a {
    position: relative;
    width: fit-content;
    min-height: 2.45rem;
    padding-block: 0.5rem;
    display: inline-flex;
    align-items: center;
    color: rgba(245, 242, 236, 0.74);
    font-family: ${fonts.primary};
    font-size: 0.84rem;
    font-weight: 540;
    text-decoration: none;
    transition: color ${motion.duration.fast} ${motion.easing.standard};
  }

  a:nth-child(1) { grid-area: 1 / 1; }
  a:nth-child(2) { grid-area: 2 / 1; }
  a:nth-child(3) { grid-area: 1 / 2; }
  a:nth-child(4) { grid-area: 2 / 2; }
  a:nth-child(5) { grid-area: 3 / 1; }
  a:nth-child(6) { grid-area: 3 / 2; }

  button {
    grid-area: 4 / 1 / span 1 / span 2;
  }

  a:nth-child(n + 5) {
    color: rgba(185, 192, 204, 0.55);
    font-size: 0.8rem;
  }

  a::after {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0.18rem;
    left: 0;
    height: 1px;
    background: ${colors.highlight};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform ${motion.duration.fast} ${motion.easing.standard};
  }

  a:hover, a:focus-visible { color: ${colors.white}; }
  a:hover::after, a:focus-visible::after { transform: scaleX(1); }

  a:focus-visible {
    border-radius: 0.15rem;
    outline: 2px solid ${colors.neonBlue};
    outline-offset: 2px;
  }

  @media (max-width: ${breakpoints.tabletMax}) {
    grid-template-columns: repeat(2, minmax(7.5rem, 9rem));
    justify-content: start;
    gap: 0 clamp(0.75rem, 4vw, 1.25rem);

    a { min-height: 2.75rem; }
  }

  @media (prefers-reduced-motion: reduce) {
    a, a::after { transition: none; }
  }
`;

export const PreferencesButton = styled.button`
  position: relative;
  width: fit-content;
  min-height: 2.45rem;
  padding: 0.5rem 0;
  border: 0;
  background: transparent;
  color: rgba(185, 192, 204, 0.55);
  font-family: ${fonts.primary};
  font-size: 0.8rem;
  font-weight: 540;
  text-align: left;

  &::after {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0.18rem;
    left: 0;
    height: 1px;
    background: ${colors.highlight};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform ${motion.duration.fast} ${motion.easing.standard};
  }

  &:hover, &:focus-visible { color: ${colors.white}; }
  &:hover::after, &:focus-visible::after { transform: scaleX(1); }

  @media (max-width: ${breakpoints.tabletMax}) { min-height: 2.75rem; }
`;

export const BottomBand = styled.div`
  margin-top: clamp(0.85rem, 1.5vw, 1.25rem);
  padding-top: clamp(0.8rem, 1.2vw, 1rem);
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1.5rem;
  border-top: 1px solid rgba(185, 192, 204, 0.08);

  p,
  small {
    font-family: ${fonts.primary};
    line-height: 1.45;
  }

  p {
    color: rgba(245, 242, 236, 0.64);
    font-size: 0.8rem;
  }

  small {
    color: rgba(185, 192, 204, 0.46);
    font-size: 0.72rem;
    text-align: right;
  }

  @media (max-width: ${breakpoints.tabletMax}) {
    margin-top: 1.25rem;
    padding-top: 1rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.35rem;

    small { text-align: left; }
  }
`;
