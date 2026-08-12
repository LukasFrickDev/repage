import { useReducedMotion } from 'framer-motion';
import { finalCtaSectionContent } from '../../content/repageContent';
import * as S from './styles';

const ease = [0.22, 1, 0.36, 1] as const;

export function FinalCtaSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <S.Section id="contato" data-home-section="contact" aria-labelledby="final-cta-title" tabIndex={-1}>
      <S.Convergence aria-hidden="true"><i /><i /><i /></S.Convergence>
      <S.Content
        initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: 0.6, ease }}
      >
        <S.Eyebrow>{finalCtaSectionContent.eyebrow}</S.Eyebrow>
        <S.Title id="final-cta-title">{finalCtaSectionContent.title}</S.Title>
        <S.Description>{finalCtaSectionContent.description}</S.Description>
      </S.Content>
    </S.Section>
  );
}
