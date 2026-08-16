import { describe, expect, it } from 'vitest';
import globalStylesSource from './globalStyles.ts?raw';

describe('global typography', () => {
  it('serves the approved Instrument Sans variable font locally', () => {
    expect(globalStylesSource).toContain("font-family: 'Instrument Sans';");
    expect(globalStylesSource).toContain("url('/fonts/instrument-sans/InstrumentSans-Variable.woff2') format('woff2')");
    expect(globalStylesSource).toContain('font-weight: 400 700;');
    expect(globalStylesSource).toContain('font-display: swap;');
  });

  it('keeps the primary family on body while controls inherit it', () => {
    expect(globalStylesSource).toContain('font-family: ${fonts.primary};');
    expect(globalStylesSource).toMatch(/button,\s*input,\s*textarea,\s*select\s*\{ font: inherit; \}/);
    expect(globalStylesSource).not.toMatch(/body,\s*button,\s*input,\s*textarea,\s*select\s*\{ font: inherit; \}/);
  });
});
