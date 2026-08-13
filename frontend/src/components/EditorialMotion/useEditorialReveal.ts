import { useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import type { RefObject } from 'react';
import { editorialMotion } from '../../styles/editorialMotion';

export function useEditorialReveal(targetRef: RefObject<HTMLElement | null>) {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({ target: targetRef, offset: editorialMotion.reveal.offset });
  const progress = useSpring(scrollYProgress, editorialMotion.spring);
  const opacity = useTransform(progress, [...editorialMotion.reveal.range], [0, 1]);
  const y = useTransform(progress, [...editorialMotion.reveal.range], [editorialMotion.reveal.distance, 0]);

  return {
    prefersReducedMotion,
    style: { opacity, y },
  };
}
