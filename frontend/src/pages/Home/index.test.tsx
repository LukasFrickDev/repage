import { act, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Home from '.';
import { useHydrationSafeReducedMotion } from '../../hooks/useHydrationSafeReducedMotion';

vi.mock('../../app/routeMetadata', () => ({
  routeMetadata: { home: {} },
  useRouteMetadata: vi.fn(),
}));

vi.mock('../../components/PrimaryCta', () => ({ PrimaryCta: ({ children }: { children: ReactNode }) => <a>{children}</a> }));
vi.mock('../../components/FeaturedProjectsSection', () => ({ FeaturedProjectsSection: () => null }));
vi.mock('../../components/FinalCtaSection', () => ({ FinalCtaSection: () => null }));
vi.mock('../../components/PageExperience', () => ({ PageExperience: () => null }));
vi.mock('../../components/ProcessSection', () => ({ ProcessSection: () => null }));
vi.mock('../../components/ServicesSection', () => ({ ServicesSection: () => null }));
vi.mock('../../components/SignatureSection', () => ({ SignatureSection: () => null }));
vi.mock('../../components/ValuePropositionSection', () => ({ ValuePropositionSection: () => null }));
vi.mock('../../services/analytics', () => ({ ANALYTICS_EVENT_NAMES: { quoteCtaClick: 'quote_cta_click' }, trackEvent: vi.fn() }));
vi.mock('../../hooks/useHydrationSafeReducedMotion', () => ({ useHydrationSafeReducedMotion: vi.fn() }));

const originalFonts = Object.getOwnPropertyDescriptor(document, 'fonts');
const fontFaceSet = {
  check: vi.fn(),
  load: vi.fn(),
};

function renderHome() {
  return render(<MemoryRouter><Home /></MemoryRouter>);
}

function introIdentity() {
  return screen.getByText('Repage').parentElement as HTMLDivElement;
}

function introMask() {
  return introIdentity().parentElement as HTMLDivElement;
}

describe('Home intro font readiness', () => {
  beforeEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    vi.mocked(useHydrationSafeReducedMotion).mockReturnValue(false);
    Object.defineProperty(document, 'fonts', { configurable: true, value: fontFaceSet });
  });

  afterEach(() => {
    vi.useRealTimers();
    if (originalFonts) Object.defineProperty(document, 'fonts', originalFonts);
    else Reflect.deleteProperty(document, 'fonts');
  });

  it('reveals Repage only after the requested Instrument Sans face is usable', async () => {
    fontFaceSet.load.mockResolvedValue([]);
    fontFaceSet.check.mockReturnValue(true);

    renderHome();

    const pendingMaskClass = introMask().className;
    expect(getComputedStyle(introIdentity()).visibility).toBe('hidden');
    await waitFor(() => expect(getComputedStyle(introIdentity()).visibility).toBe('visible'));
    expect(introMask().className).not.toBe(pendingMaskClass);
    expect(fontFaceSet.load).toHaveBeenCalledWith('620 1em "Instrument Sans"', 'Repage');
    expect(fontFaceSet.check).toHaveBeenCalledWith('620 1em "Instrument Sans"', 'Repage');
  });

  it('keeps Repage hidden when the deadline releases the intro', () => {
    vi.useFakeTimers();
    fontFaceSet.load.mockReturnValue(new Promise(() => undefined));

    renderHome();
    const pendingMaskClass = introMask().className;
    act(() => vi.advanceTimersByTime(1200));

    expect(getComputedStyle(introIdentity()).visibility).toBe('hidden');
    expect(introMask().className).not.toBe(pendingMaskClass);
  });

  it('keeps Repage hidden when the font load fails', async () => {
    fontFaceSet.load.mockRejectedValue(new Error('font unavailable'));

    renderHome();
    const pendingMaskClass = introMask().className;

    await waitFor(() => expect(introMask().className).not.toBe(pendingMaskClass));
    expect(getComputedStyle(introIdentity()).visibility).toBe('hidden');
  });

  it('does not render the animated intro with reduced motion', () => {
    vi.mocked(useHydrationSafeReducedMotion).mockReturnValue(true);
    fontFaceSet.load.mockResolvedValue([]);
    fontFaceSet.check.mockReturnValue(true);

    renderHome();

    expect(screen.queryByText('Repage')).not.toBeInTheDocument();
  });
});
