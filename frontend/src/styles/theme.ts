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

// Entrada de seções que assumem a viewport antes de revelar seu conteúdo.
export const immersiveIntro = {
  titleSize: 'clamp(2.75rem, 5vw, 4.75rem)',
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
    sectionTitleSize: 'clamp(2.9rem, 4.15vw, 4.35rem)',
    sectionTitleCompactSize: 'clamp(2.55rem, 7.5vw, 2.9rem)',
    serviceTitleSize: 'clamp(2.25rem, 3vw, 3.35rem)',
    serviceTitleMobileSize: 'clamp(2rem, 6.8vw, 2.45rem)',
    scopeSize: 'clamp(0.8rem, 0.88vw, 0.92rem)',
    introTrackHeight: '160svh',
    introTrackMobileHeight: '150svh',
    introStageHeight: `calc(100svh - ${layout.headerHeight})`,
    introStageTop: layout.headerHeight,
    introContentMaxWidth: '70rem',
    introGridGap: 'clamp(1.5rem, 3vw, 3rem)',
    introHeadlineMaxWidth: '15ch',
    introSupportMaxWidth: '28rem',
    introSupportSize: 'clamp(1.08rem, 1.35vw, 1.3rem)',
    introPrimaryExitX: '-4%',
    introSupportExitX: '5%',
    introContentOverlap: '-22svh',
    introContentMobileOverlap: '-18svh',
    compositionsGap: 'clamp(0.75rem, 1.5vw, 1.75rem)',
    offerGap: 'clamp(1rem, 2vw, 1.75rem)',
    copyMaxWidth: '39rem',
    mediaAspectRatio: '16 / 9',
    mediaMobileAspectRatio: '3 / 2',
    mediaScale: '92%',
    mediaBorder: '1px solid rgba(16, 24, 39, 0.14)',
    mediaRadius: '4px 4px 18px 4px',
    mediaRadiusReversed: '18px 4px 4px 4px',
    mediaSupportOffset: '0.55rem',
    mediaSupportOffsetNegative: '-0.55rem',
    mediaShadow: '0 0.15rem 0.45rem rgba(16, 24, 39, 0.1), 0 1.35rem 3.25rem rgba(16, 24, 39, 0.16)',
  },
  projects: {
    transitionPaddingTop: 'clamp(0.75rem, 1.5vw, 1.5rem)',
    stageScrollLength: '385svh',
    mobileStageScrollLength: '300svh',
    stageContentWidth: 'min(100%, 82rem)',
    stageMediaHeight: 'min(70vh, 47rem)',
    stageGap: 'clamp(1rem, 2vw, 2rem)',
    browser: {
      height: '92%',
      maxWidth: '94%',
      aspectRatio: '1.79',
      compactWidth: '96%',
      compactAspectRatio: '1.7',
    },
    mobileMediaWidth: 'clamp(10rem, 19vw, 16.5rem)',
    compactMobileMediaWidth: 'clamp(8.25rem, 34vw, 11.5rem)',
    deviceAspectRatio: '195 / 422',
    backgroundGridSize: 'clamp(40px, 4vw, 64px)',
    listGap: 'clamp(2.75rem, 6vw, 6rem)',
    infoPadding: 'clamp(1rem, 2vw, 2rem)',
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
