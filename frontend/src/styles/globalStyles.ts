import { createGlobalStyle } from 'styled-components';
import { colors, fonts, withAlpha } from './theme';

const GlobalStyles = createGlobalStyle`
  * { box-sizing: border-box; }
  html {
    background: ${colors.background};
    scroll-behavior: smooth;
    scrollbar-width: thin;
    scrollbar-color: ${withAlpha(colors.violet, 0.62)} transparent;
  }
  body {
    margin: 0; min-width: 320px; min-height: 100vh; overflow-x: clip; background: ${colors.background}; color: ${colors.white};
    font-family: ${fonts.primary};
  }
  body, button, input, textarea, select { font: inherit; }
  button { cursor: pointer; }
  img { display: block; max-width: 100%; }
  h1, h2, h3, h4, p { margin: 0; }
  a { color: inherit; }
  ::selection { background: ${withAlpha(colors.violet, 0.32)}; color: ${colors.paper}; }
  :focus-visible { outline: 3px solid ${colors.neonBlue}; outline-offset: 4px; }
  @media (prefers-reduced-motion: reduce) {
    * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; transition-duration: 0.01ms !important; }
  }
`;

export default GlobalStyles;
