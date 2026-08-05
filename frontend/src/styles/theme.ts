// Cores oficiais e superfícies recorrentes da marca.
const brand = {
  ink: '#101827',
  graphite: '#182235',
  paper: '#F5F2EC',
  violet: '#6C63FF',
  blue: '#91A8FF',
  mist: '#B9C0CC',
} as const;

export const colors = {
  ...brand,
  background: brand.ink,
  backgroundSecondary: brand.graphite,
  highlight: brand.violet,
  neonBlue: brand.blue,
  white: brand.paper,
  textSecondary: brand.mist,
  inkRaised: '#151F31',
  inkHeader: '#141E30',
  inkDeep: '#0D1522',
} as const;

// Pilha tipográfica única utilizada em toda a interface.
export const fonts = {
  primary: '"Instrument Sans", sans-serif',
  heading: '"Instrument Sans", sans-serif',
  ui: '"Instrument Sans", sans-serif',
} as const;

// Pontos de quebra compartilhados entre páginas e componentes.
export const breakpoints = {
  mobileMax: '480px',
  compactMax: '599px',
  tablet: '768px',
  tabletMax: '767px',
  content: '900px',
  contentMax: '899px',
  laptop: '1024px',
  laptopMax: '1023px',
  signaturePointerMax: '1099px',
  servicesWide: '1100px',
  desktopMax: '1279px',
  wide: '1280px',
} as const;

// Larguras, containers e raios recorrentes de layout.
export const layout = {
  containerWidth: 'min(100%, 1440px)',
  containerPaddingInline: 'clamp(1rem, 4vw, 4.5rem)',
  headerInlineWidth: 'min(calc(100% - clamp(2rem, 8vw, 9rem)), 1440px)',
  headerHeight: 'clamp(4.25rem, 5.2vw, 4.75rem)',
  headerNavigationGap: 'clamp(1.15rem, 2.3vw, 2.3rem)',
  footerPaddingBlock: 'clamp(2.5rem, 5vw, 4.5rem)',
  footerContentGap: 'clamp(2rem, 4vw, 4rem)',
  footerNavigationGap: 'clamp(1.1rem, 2vw, 2rem)',
  radii: {
    control: '10px',
    action: '12px',
  },
} as const;

// Escalas fluidas e espaçamentos usados na homepage.
export const homepageTokens = {
  sectionPaddingBlock: 'clamp(5rem, 8vw, 8.5rem)',
  sectionPaddingInline: layout.containerPaddingInline,
  sectionGap: 'clamp(1.5rem, 4vw, 5rem)',
  eyebrowSize: 'clamp(0.75rem, 0.82vw, 0.84rem)',
  eyebrowTracking: '0.075em',
  sectionTitleSize: 'clamp(2.15rem, 3.2vw, 3.55rem)',
  sectionTitleLineHeight: '1',
  sectionTitleTracking: '-0.045em',
  sectionCopySize: 'clamp(1rem, 1.1vw, 1.1rem)',
  sectionCopyLineHeight: '1.65',
  mobileSectionPaddingBlock: 'clamp(4.25rem, 16vw, 5.5rem)',
  headingMarginBottom: 'clamp(3.5rem, 6vw, 6.5rem)',
  copyMaxWidth: '35rem',
  eyebrowMarginBottom: 'clamp(1.25rem, 2vw, 1.75rem)',
  sectionCopyMarginTop: 'clamp(1.5rem, 2.5vw, 2.25rem)',
  hero: {
    sectionPadding: 'clamp(7.25rem, 10vw, 9.5rem) clamp(1rem, 4vw, 4.5rem) clamp(3.25rem, 6vw, 6rem)',
    compactPaddingTop: 'clamp(6.25rem, 9vw, 7rem)',
    compactPaddingBottom: 'clamp(2rem, 4vw, 3rem)',
    lightSize: 'clamp(22rem, 48vw, 60rem)',
    gridSize: 'clamp(32px, 4vw, 64px)',
    contentGap: 'clamp(2rem, 5vw, 6rem)',
    eyebrowMarginBottom: 'clamp(1.15rem, 2vw, 1.65rem)',
    titleSize: 'clamp(3rem, 6vw, 6.25rem)',
    titleLineHeight: '0.94',
    titleTracking: '-0.067em',
    copyMarginTop: 'clamp(1.4rem, 2.4vw, 2rem)',
    copySize: 'clamp(1rem, 1.15vw, 1.125rem)',
    actionsMarginTop: 'clamp(1.75rem, 3vw, 2.5rem)',
    visualWideWidth: 'clamp(420px, 43vw, 620px)',
    visualLaptopWidth: 'clamp(380px, 48vw, 620px)',
    visualTabletWidth: 'clamp(44vw, 54vw, 60vw)',
    visualMobileWidth: 'clamp(105vw, 118vw, 130vw)',
  },
  services: {
    backgroundGridSize: 'clamp(36px, 4vw, 60px)',
    contentGap: 'clamp(3rem, 6vw, 7rem)',
    itemPadding: 'clamp(1.4rem, 2.4vw, 2rem) clamp(0.75rem, 1.8vw, 1.5rem)',
    itemGap: 'clamp(1rem, 2vw, 1.8rem)',
    itemTitleSize: 'clamp(1.3rem, 1.8vw, 1.7rem)',
    itemCopySize: 'clamp(0.94rem, 1vw, 1rem)',
  },
  projects: {
    backgroundGridSize: 'clamp(40px, 4vw, 64px)',
    listGap: 'clamp(2.75rem, 6vw, 6rem)',
    previewInset: 'clamp(1rem, 2vw, 1.5rem)',
    wordSize: 'clamp(3.25rem, 7vw, 7.75rem)',
    interfaceLineHeight: 'clamp(5px, 0.7vw, 9px)',
    infoPadding: 'clamp(1.5rem, 3vw, 3rem)',
    titleSize: 'clamp(1.65rem, 2.8vw, 2.75rem)',
    categorySize: 'clamp(0.88rem, 1vw, 0.98rem)',
  },
  process: {
    backgroundGridSize: 'clamp(38px, 4vw, 60px)',
    headingMarginBottom: 'clamp(4rem, 7vw, 7rem)',
    stepPaddingInline: 'clamp(1.5rem, 4vw, 4.5rem)',
    mobileStepGap: 'clamp(3.5rem, 14vw, 5rem)',
    numberSize: 'clamp(4.5rem, 7vw, 7.5rem)',
    mobileNumberSize: 'clamp(3.75rem, 17vw, 5.25rem)',
    markerMargin: 'clamp(1.5rem, 2.5vw, 2.25rem) 0 clamp(2rem, 3vw, 3rem)',
    stepTitleSize: 'clamp(1.35rem, 2vw, 1.8rem)',
    stepCopySize: 'clamp(0.95rem, 1vw, 1rem)',
  },
  signature: {
    contentGap: 'clamp(2rem, 5vw, 6rem)',
    signatureMarginTop: 'clamp(2.5rem, 4vw, 4rem)',
    nameSize: 'clamp(0.86rem, 1vw, 0.96rem)',
    roleSize: 'clamp(0.75rem, 0.85vw, 0.82rem)',
    notationWidth: 'clamp(18px, 3vw, 34px)',
  },
  finalCta: {
    sectionPaddingBlock: 'clamp(5.5rem, 10vw, 10rem)',
    backgroundGridSize: 'clamp(40px, 4vw, 64px)',
    eyebrowLineWidth: 'clamp(1.25rem, 3vw, 2.5rem)',
    ctaMarginTop: 'clamp(2rem, 4vw, 3rem)',
  },
} as const;

// Durações e curvas compartilhadas de interação.
export const motion = {
  duration: {
    quick: '160ms',
    fast: '180ms',
    base: '200ms',
    medium: '220ms',
  },
  easing: {
    standard: 'ease',
  },
} as const;

export const withAlpha = (hex: string, alpha: number): string => {
  const normalized = hex.replace('#', '');
  const value = normalized.length === 3
    ? normalized.split('').map((character) => `${character}${character}`).join('')
    : normalized;

  return `rgba(${Number.parseInt(value.slice(0, 2), 16)}, ${Number.parseInt(value.slice(2, 4), 16)}, ${Number.parseInt(value.slice(4, 6), 16)}, ${alpha})`;
};
