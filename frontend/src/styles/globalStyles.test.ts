import { describe, expect, it } from 'vitest';
import globalStylesSource from './globalStyles.ts?raw';

describe('global typography', () => {
  it('keeps the primary family on body while controls inherit it', () => {
    expect(globalStylesSource).toContain('font-family: ${fonts.primary};');
    expect(globalStylesSource).toMatch(/button,\s*input,\s*textarea,\s*select\s*\{ font: inherit; \}/);
    expect(globalStylesSource).not.toMatch(/body,\s*button,\s*input,\s*textarea,\s*select\s*\{ font: inherit; \}/);
  });
});
