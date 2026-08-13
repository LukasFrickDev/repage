export const editorialMotion = {
  interaction: {
    note: 'Microinterações e transições curtas pertencem aos tokens de motion do tema.',
  },
  spring: {
    stiffness: 150,
    damping: 32,
    mass: 0.28,
  },
  entry: {
    scrollOffset: ['start 92%', 'start 18%'] as ['start 92%', 'start 18%'],
    eyebrow: [0.01, 0.14],
    firstPole: [0.08, 0.46],
    firstPoleCompact: [0.08, 0.4],
    secondPole: [0.38, 0.74],
    secondPoleCompact: [0.38, 0.68],
    titleShift: 18,
    titleShiftCompact: 10,
    support: [0.76, 0.94],
    threePole: {
      first: [0.08, 0.38],
      second: [0.32, 0.62],
      third: [0.56, 0.82],
      support: [0.84, 0.98],
    },
    route: {
      duration: 1.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
  reveal: {
    offset: ['start 92%', 'start 42%'] as ['start 92%', 'start 42%'],
    range: [0.08, 0.86],
    distance: 12,
    media: {
      range: [0.48, 0.98],
      distance: 52,
      mobileDistance: 28,
    },
  },
} as const;
