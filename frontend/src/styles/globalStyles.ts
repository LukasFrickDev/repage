import { createGlobalStyle, css } from 'styled-components';
import { siteConfig } from '../config/site';

export const colors = {
  background: siteConfig.colors.ink,
  backgroundSecondary: '#182235',
  highlight: siteConfig.colors.violet,
  highlightStrong: siteConfig.colors.violet,
  neonBlue: siteConfig.colors.blue,
  white: siteConfig.colors.paper,
  textSecondary: siteConfig.colors.mist,
  gridLine: 'rgba(185, 192, 204, 0.2)',
};

export const fonts = {
  primary: '"Instrument Sans", sans-serif',
  heading: '"Instrument Sans", sans-serif',
  ui: '"Instrument Sans", sans-serif',
};

const GlobalStyles = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html {
    background: ${colors.background};
    scroll-behavior: smooth;
    scrollbar-width: thin;
    scrollbar-color: rgba(108, 99, 255, 0.62) transparent;
  }
  *::-webkit-scrollbar { width: 10px; height: 10px; }
  *::-webkit-scrollbar-track { background: transparent; }
  *::-webkit-scrollbar-thumb {
    min-height: 2.5rem;
    border: 3px solid transparent;
    border-radius: 999px;
    background: linear-gradient(${colors.highlight}, ${colors.neonBlue}) padding-box;
  }
  *::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(${colors.neonBlue}, ${colors.highlight}) padding-box;
  }
  body {
    margin: 0; min-width: 320px; min-height: 100vh; overflow-x: clip; background: ${colors.background}; color: ${colors.white};
    font-family: ${fonts.primary}; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
  }
  body, button, input, textarea, select { font: inherit; }
  button, a { -webkit-tap-highlight-color: transparent; }
  button { cursor: pointer; }
  img { display: block; max-width: 100%; }
  h1, h2, h3, h4, p { margin: 0; }
  a { color: inherit; }
  :focus-visible { outline: 3px solid ${colors.neonBlue}; outline-offset: 4px; }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; transition-duration: 0.01ms !important; }
  }
`;

export const breakpoints = { mobile: '480px', tablet: '768px', desktop: '1200px' };
export const glow = css`box-shadow: 0 0 2px 2px ${colors.highlight}, 0 0 8px 2px ${colors.neonBlue};`;
export default GlobalStyles;
