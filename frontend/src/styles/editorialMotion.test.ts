import { describe, expect, it } from 'vitest';
import { editorialMotion } from './editorialMotion';

describe('editorial motion grammar', () => {
  it('keeps route entrance and scroll reveal as explicit shared presets', () => {
    expect(editorialMotion.entry.route.duration).toBeGreaterThan(1);
    expect(editorialMotion.entry.route.ease).toHaveLength(4);
    expect(editorialMotion.reveal.offset).toEqual(['start 92%', 'start 42%']);
    expect(editorialMotion.reveal.range).toEqual([0.08, 0.86]);
  });
});
