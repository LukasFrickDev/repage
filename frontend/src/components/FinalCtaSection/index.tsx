import { useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { finalCtaSectionContent } from '../../content/repageContent';
import { LeadForm } from '../../features/lead-form';
import * as S from './styles';
import { ANALYTICS_EVENT_NAMES, trackEvent } from '../../services/analytics';
import { useHydrationSafeReducedMotion } from '../../hooks/useHydrationSafeReducedMotion';

export function FinalCtaSection() {
  const prefersReducedMotion = useHydrationSafeReducedMotion();
  const [formInteracted, setFormInteracted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 92%', 'center 58%'],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 125, damping: 31, mass: 0.3 });
  const eyebrowOpacity = useTransform(progress, [0.1, 0.28], [0, 1]);
  const eyebrowY = useTransform(progress, [0.1, 0.28], [6, 0]);
  const titleOpacity = useTransform(progress, [0.17, 0.42], [0, 1]);
  const titleY = useTransform(progress, [0.17, 0.44], [10, 0]);
  const titleScale = useTransform(progress, [0.17, 0.44], [0.985, 1]);
  const titleMaskPosition = useTransform(progress, [0.17, 0.46], ['0 100%', '0 0%']);
  const descriptionOpacity = useTransform(progress, [0.38, 0.62], [0, 1]);
  const descriptionY = useTransform(progress, [0.38, 0.62], [8, 0]);
  const formOpacity = useTransform(progress, [0.62, 0.8], [0, 1]);
  const formY = useTransform(progress, [0.62, 0.8], [8, 0]);

  return (
    <S.Section
      ref={sectionRef}
      id="contato"
      data-home-section="contact"
      aria-labelledby="final-cta-title"
      tabIndex={-1}
    >
      <S.Content>
        <S.Eyebrow
          style={prefersReducedMotion || formInteracted ? { opacity: 1, y: 0 } : { opacity: eyebrowOpacity, y: eyebrowY }}
        >
          {finalCtaSectionContent.eyebrow}
        </S.Eyebrow>
        <S.Title
          id="final-cta-title"
          aria-label={finalCtaSectionContent.title}
          style={prefersReducedMotion || formInteracted ? {
            maskPosition: '0 0%',
            opacity: 1,
            scale: 1,
            y: 0,
          } : {
            maskPosition: titleMaskPosition,
            opacity: titleOpacity,
            scale: titleScale,
            y: titleY,
          }}
        >
          {finalCtaSectionContent.titleLines.map((line, index) => (
            <S.TitleLine key={line}>
              {index > 0 && ' '}{line}
            </S.TitleLine>
          ))}
        </S.Title>
        <S.Description
          style={prefersReducedMotion || formInteracted ? { opacity: 1, y: 0 } : {
            opacity: descriptionOpacity,
            y: descriptionY,
          }}
        >
          {finalCtaSectionContent.description}
        </S.Description>
        <S.FormReveal
          style={prefersReducedMotion || formInteracted ? { opacity: 1, y: 0 } : { opacity: formOpacity, y: formY }}
        >
          <LeadForm onInteractionStart={() => { setFormInteracted(true); trackEvent(ANALYTICS_EVENT_NAMES.leadFormStart); }} />
        </S.FormReveal>
      </S.Content>
    </S.Section>
  );
}
