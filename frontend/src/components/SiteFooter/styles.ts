import styled from 'styled-components';
import { colors, fonts } from '../../styles/globalStyles';

export const Footer = styled.footer`
  padding: clamp(2.5rem, 5vw, 4.5rem) clamp(1rem, 4vw, 4.5rem);
  border-top: 1px solid rgba(185, 192, 204, 0.12);
  background: linear-gradient(180deg, #0d1522, ${colors.background});
  color: ${colors.white};
`;

export const Container = styled.div`
  width: min(100%, 1440px);
  margin-inline: auto;
  display: grid;
  gap: clamp(2rem, 4vw, 4rem);

  @media (min-width: 900px) {
    grid-template-columns: minmax(16rem, 1.1fr) minmax(20rem, 0.9fr) minmax(16rem, 0.8fr);
    align-items: end;
  }
`;

export const BrandBlock = styled.div`
  max-width: 25rem;
`;

export const Brand = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  color: ${colors.white};
  font-family: ${fonts.primary};
  font-size: 1.08rem;
  font-weight: 650;
  letter-spacing: -0.05em;

  img { width: 1.45rem; height: 1.45rem; }
`;

export const BrandDescription = styled.p`
  max-width: 24rem;
  margin-top: 1rem;
  color: rgba(185, 192, 204, 0.72);
  font-family: ${fonts.primary};
  font-size: 0.9rem;
  line-height: 1.55;
`;

export const Navigation = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem clamp(1.1rem, 2vw, 2rem);

  a {
    position: relative;
    padding-block: 0.4rem;
    color: rgba(245, 242, 236, 0.78);
    font-family: ${fonts.primary};
    font-size: 0.86rem;
    font-weight: 540;
    text-decoration: none;
    transition: color 180ms ease;
  }

  a::after {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0.15rem;
    left: 0;
    height: 1px;
    background: linear-gradient(90deg, ${colors.highlight}, ${colors.neonBlue});
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 180ms ease;
  }

  a:hover, a:focus-visible { color: ${colors.white}; }
  a:hover::after, a:focus-visible::after { transform: scaleX(1); }

  @media (prefers-reduced-motion: reduce) {
    a, a::after { transition: none; }
  }
`;

export const Meta = styled.div`
  @media (min-width: 900px) { text-align: right; }

  p {
    color: rgba(245, 242, 236, 0.76);
    font-family: ${fonts.primary};
    font-size: 0.84rem;
    line-height: 1.45;
  }

  small {
    display: block;
    margin-top: 0.6rem;
    color: rgba(185, 192, 204, 0.52);
    font-family: ${fonts.primary};
    font-size: 0.72rem;
    line-height: 1.45;
  }
`;
