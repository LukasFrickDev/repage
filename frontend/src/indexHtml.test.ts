import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import globalStylesSource from './styles/globalStyles.ts?raw';

const indexHtml = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');

describe('font loading policy', () => {
  it('preloads the same local font used by the @font-face', () => {
    const fontUrl = '/fonts/instrument-sans/InstrumentSans-Variable.woff2';

    expect(indexHtml).toContain(`<link rel="preload" href="${fontUrl}" as="font" type="font/woff2" crossorigin />`);
    expect(globalStylesSource).toContain(`url('${fontUrl}') format('woff2')`);
    expect(indexHtml).not.toContain('fonts.googleapis.com');
    expect(indexHtml).not.toContain('fonts.gstatic.com');
  });

  it('does not request Google Fonts remotely', () => {
    expect(indexHtml).not.toContain('fonts.googleapis.com');
    expect(indexHtml).not.toContain('fonts.gstatic.com');
  });
});
