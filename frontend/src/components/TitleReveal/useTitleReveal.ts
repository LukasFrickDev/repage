import { animate, useReducedMotion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import type { RefObject } from 'react';
import { editorialMotion } from '../../styles/editorialMotion';

type TitleRevealOptions = {
  offset?: ['start 92%', 'start 18%'];
  trigger?: 'scroll' | 'mount';
  firstRange?: [number, number];
  secondRange?: [number, number];
  thirdRange?: [number, number];
  supportRange?: [number, number];
  shift?: number;
};

export function useTitleReveal(
  targetRef: RefObject<HTMLElement | null>,
  { offset = editorialMotion.entry.scrollOffset, trigger = 'scroll', firstRange = [...editorialMotion.entry.firstPole] as [number, number], secondRange = [...editorialMotion.entry.secondPole] as [number, number], thirdRange = [...editorialMotion.entry.threePole.third] as [number, number], supportRange = [...editorialMotion.entry.support] as [number, number], shift = editorialMotion.entry.titleShift }: TitleRevealOptions = {},
) {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({ target: targetRef, offset });
  const mountTarget = useMotionValue(prefersReducedMotion ? 1 : 0);
  const mountProgress = useSpring(mountTarget, editorialMotion.spring);
  const scrollProgress = useSpring(scrollYProgress, editorialMotion.spring);

  useEffect(() => {
    if (trigger !== 'mount' || prefersReducedMotion) {
      if (trigger === 'mount' && prefersReducedMotion) mountTarget.set(1);
      return undefined;
    }

    mountTarget.set(0);
    const controls = animate(mountTarget, 1, editorialMotion.entry.route);
    return () => controls.stop();
  }, [mountTarget, prefersReducedMotion, trigger]);

  const progress = trigger === 'mount' ? mountProgress : scrollProgress;
  const firstClipPath = useTransform(progress, firstRange, ['inset(0 100% 0 0)', 'inset(0 0% 0 0)']);
  const firstX = useTransform(progress, firstRange, [shift, 0]);
  const firstOpacity = useTransform(progress, [firstRange[0], firstRange[0] + 0.22, firstRange[1]], [0, 0.78, 1]);
  const secondClipPath = useTransform(progress, secondRange, ['inset(0 100% 0 0)', 'inset(0 0% 0 0)']);
  const secondX = useTransform(progress, secondRange, [shift, 0]);
  const secondOpacity = useTransform(progress, [secondRange[0], secondRange[0] + 0.21, secondRange[1]], [0, 0.78, 1]);
  const thirdClipPath = useTransform(progress, thirdRange, ['inset(0 100% 0 0)', 'inset(0 0% 0 0)']);
  const thirdX = useTransform(progress, thirdRange, [shift, 0]);
  const thirdOpacity = useTransform(progress, [thirdRange[0], thirdRange[0] + 0.19, thirdRange[1]], [0, 0.78, 1]);
  const eyebrowOpacity = useTransform(progress, [...editorialMotion.entry.eyebrow], [0, 1]);
  const eyebrowY = useTransform(progress, [...editorialMotion.entry.eyebrow], [8, 0]);
  const descriptionOpacity = useTransform(progress, [...supportRange], [0, 1]);
  const descriptionY = useTransform(progress, [...supportRange], [10, 0]);

  return {
    prefersReducedMotion,
    eyebrow: { opacity: eyebrowOpacity, y: eyebrowY },
    first: { clipPath: firstClipPath, opacity: firstOpacity },
    firstText: { x: firstX },
    second: { clipPath: secondClipPath, opacity: secondOpacity },
    secondText: { x: secondX },
    third: { clipPath: thirdClipPath, opacity: thirdOpacity },
    thirdText: { x: thirdX },
    description: { opacity: descriptionOpacity, y: descriptionY },
  };
}
