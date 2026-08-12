import { motion } from 'framer-motion';
import styled from 'styled-components';
import { breakpoints, colors, fonts, homepageTokens, layout } from '../../styles/theme';

export const Section = styled.section`
  position: relative;
  overflow: hidden;
  padding: clamp(7rem, 12vw, 13rem) ${homepageTokens.sectionPaddingInline};
  background:
    radial-gradient(circle at 88% 14%, rgba(108, 99, 255, 0.09), transparent 25%),
    ${colors.white};
  color: ${colors.background};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 12%;
    width: 1px;
    height: 22%;
    background: linear-gradient(rgba(108, 99, 255, 0.55), transparent);
  }
`;

export const Container = styled.div`
  width: ${layout.containerWidth};
  margin-inline: auto;
`;

export const Intro = styled(motion.div)`
  position: relative;
`;

export const Eyebrow = styled.p`
  margin-bottom: ${homepageTokens.eyebrowMarginBottom};
  color: ${colors.highlight};
  font-family: ${fonts.primary};
  font-size: ${homepageTokens.eyebrowSize};
  font-weight: 650;
  letter-spacing: ${homepageTokens.eyebrowTracking};
  text-transform: uppercase;
`;

export const Title = styled.h2`
  max-width: 18ch;
  font-family: ${fonts.heading};
  font-size: clamp(3.4rem, 6.4vw, 7.4rem);
  font-weight: 600;
  letter-spacing: -0.07em;
  line-height: 0.9;
  text-wrap: balance;
`;

export const Description = styled.p`
  max-width: 39rem;
  margin: clamp(2rem, 4vw, 3.5rem) 4% 0 auto;
  color: rgba(16, 24, 39, 0.68);
  font-family: ${fonts.primary};
  font-size: clamp(1.05rem, 1.4vw, 1.28rem);
  line-height: 1.65;

  @media (max-width: ${breakpoints.tabletMax}) {
    margin-left: 0;
  }
`;

export const Differentiators = styled.ol`
  margin: clamp(5.5rem, 10vw, 10rem) 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: clamp(2.5rem, 5vw, 5rem) clamp(1.5rem, 3vw, 3rem);
  list-style: none;

  li:nth-child(1) { grid-column: 1 / 5; }
  li:nth-child(2) { grid-column: 6 / 13; }
  li:nth-child(3) { grid-column: 2 / 8; }
  li:nth-child(4) { grid-column: 9 / 13; }

  @media (max-width: ${breakpoints.tabletMax}) {
    display: block;

    li + li { margin-top: 2.75rem; }
  }
`;

export const Differentiator = styled.li`
  position: relative;
  min-height: 9rem;
  padding-top: 1.2rem;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-content: start;
  gap: clamp(1rem, 2vw, 1.8rem);
  border-top: 1px solid rgba(16, 24, 39, 0.22);
  color: ${colors.background};
  font-family: ${fonts.primary};
  font-size: clamp(1.15rem, 2vw, 1.65rem);
  font-weight: 560;
  letter-spacing: -0.03em;
  line-height: 1.3;

  @media (max-width: ${breakpoints.tabletMax}) {
    min-height: 0;
    max-width: 40rem;
  }
`;

export const Number = styled.span`
  color: ${colors.highlight};
  font-family: ${fonts.ui};
  font-size: 0.7rem;
  font-weight: 680;
  letter-spacing: 0.1em;
`;
