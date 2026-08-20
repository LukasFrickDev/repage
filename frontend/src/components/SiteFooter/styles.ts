import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { breakpoints, colors, fonts, homepageTokens, motion, withAlpha } from '../../styles/theme';
import { HomepageEditorialFrame } from '../HomepageEditorialFrame';

export const Footer = styled.footer`
  padding: 0 ${homepageTokens.sectionPaddingInline};
  border-top: 1px solid rgba(145, 168, 255, 0.16);
  background: ${colors.background};
  color: ${colors.white};
`;

export const Container = styled(HomepageEditorialFrame)`
  padding-top: clamp(2rem, 3.4vw, 3rem);
  padding-bottom: clamp(1.25rem, 2vw, 1.75rem);
`;

export const MainBand = styled.div`
  display: grid;
  grid-template-columns: minmax(13rem, 1.25fr) minmax(8rem, 0.8fr) minmax(8rem, 0.8fr) minmax(12rem, 1fr);
  align-items: start;
  justify-content: space-between;
  gap: clamp(2rem, 4vw, 4.5rem);

  @media (max-width: ${breakpoints.contentMax}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2.5rem 2rem;
  }

  @media (max-width: ${breakpoints.tabletMax}) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

export const FooterGroup = styled.div`
  min-width: 0;
`;

export const GroupTitle = styled.h2`
  margin: 0 0 0.75rem;
  color: rgba(185, 192, 204, 0.52);
  font-family: ${fonts.primary};
  font-size: 0.7rem;
  font-weight: 620;
  letter-spacing: 0.08em;
  line-height: 1.3;
  text-transform: uppercase;
`;

export const ContactLinks = styled.address`
  min-width: 0;
  font-style: normal;
`;

export const ContactEmail = styled.p`
  display: inline-block;
  max-width: 100%;
  margin: 0;
  color: ${colors.white};
  font-family: ${fonts.primary};
  font-size: 0.82rem;
  font-weight: 540;
  overflow-wrap: anywhere;
`;

export const ContactActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-top: 0.75rem;
`;

export const ContactAction = styled.a`
  width: 2.75rem;
  height: 2.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${withAlpha(colors.textSecondary, 0.12)};
  border-radius: 50%;
  background: transparent;
  color: ${withAlpha(colors.textSecondary, 0.9)};

  svg {
    width: 1.15rem;
    height: 1.15rem;
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.45;
  }

  &:hover, &:focus-visible {
    color: ${colors.highlight};
    border-color: ${withAlpha(colors.highlight, 0.5)};
  }

  &:focus-visible {
    outline: 2px solid ${colors.highlight};
    outline-offset: 3px;
  }
`;

export const BrandBlock = styled.div`
  max-width: 16rem;
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
  max-width: 16rem;
  margin-top: 0.8rem;
  color: rgba(185, 192, 204, 0.64);
  font-family: ${fonts.primary};
  font-size: 0.88rem;
  line-height: 1.55;
`;

export const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.15rem;

  a {
    position: relative;
    width: fit-content;
    min-height: 2.45rem;
    padding-block: 0.45rem;
    display: inline-flex;
    align-items: center;
    color: rgba(245, 242, 236, 0.74);
    font-family: ${fonts.primary};
    font-size: 0.84rem;
    font-weight: 540;
    text-decoration: none;
    transition: color ${motion.duration.fast} ${motion.easing.standard};
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
    a { min-height: 2.75rem; }
  }

  @media (prefers-reduced-motion: reduce) {
    a::after { transition: none; }
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
