import { animate, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import { editorialMotion } from '../../styles/editorialMotion';
import { useHydrationSafeReducedMotion } from '../../hooks/useHydrationSafeReducedMotion';

type EditorialRevealPreset = 'default' | 'media';
type EditorialRevealOptions = { trigger?: 'scroll' | 'route'; start?: boolean };

export function useEditorialReveal(targetRef: RefObject<HTMLElement | null>, preset: EditorialRevealPreset = 'default', { trigger = 'scroll', start = false }: EditorialRevealOptions = {}) {
  const prefersReducedMotion = useHydrationSafeReducedMotion();
  const [isCompact, setIsCompact] = useState(false);
  const { scrollYProgress } = useScroll({ target: targetRef, offset: editorialMotion.reveal.offset });
  const reveal = preset === 'media' ? editorialMotion.reveal.media : editorialMotion.reveal;
  const distance = preset === 'media' && isCompact && 'mobileDistance' in reveal ? reveal.mobileDistance : reveal.distance;
  const routeTarget = useMotionValue(prefersReducedMotion ? 1 : 0);
  const scrollProgress = useSpring(scrollYProgress, editorialMotion.spring);
  const routeProgress = useSpring(routeTarget, editorialMotion.spring);
  const progress = trigger === 'route' ? routeProgress : scrollProgress;

  useEffect(() => {
    if (trigger !== 'route') return undefined;
    if (prefersReducedMotion) {
      routeTarget.set(1);
      return undefined;
    }
    if (!start) {
      routeTarget.set(0);
      return undefined;
    }

    const controls = animate(routeTarget, 1, editorialMotion.entry.route);
    return () => controls.stop();
  }, [prefersReducedMotion, routeTarget, start, trigger]);

  const opacity = useTransform(progress, [...reveal.range], [0, 1]);
  const y = useTransform(progress, [...reveal.range], [distance, 0]);

  useEffect(() => {
    if (preset !== 'media') return undefined;
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const update = () => setIsCompact(mediaQuery.matches);
    update();
    mediaQuery.addEventListener?.('change', update);
    return () => mediaQuery.removeEventListener?.('change', update);
  }, [preset]);

  return {
    prefersReducedMotion,
    style: { opacity, y },
  };
}
