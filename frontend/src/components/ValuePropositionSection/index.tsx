import { useReducedMotion } from 'framer-motion';
import { valuePropositionContent } from '../../content/repageContent';
import * as S from './styles';

const ease = [0.22, 1, 0.36, 1] as const;

export function ValuePropositionSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <S.Section id="diferenciais" data-home-section="value" aria-labelledby="value-proposition-title">
      <S.Container>
        <S.Intro
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.58, ease }}
        >
          <S.Eyebrow>{valuePropositionContent.eyebrow}</S.Eyebrow>
          <S.Title id="value-proposition-title">{valuePropositionContent.title}</S.Title>
          <S.Description>{valuePropositionContent.description}</S.Description>
        </S.Intro>

        <S.Differentiators>
          {valuePropositionContent.differentiators.map((differentiator, index) => (
            <S.Differentiator key={differentiator}>
              <S.Number aria-hidden="true">{String(index + 1).padStart(2, '0')}</S.Number>
              <span>{differentiator}</span>
            </S.Differentiator>
          ))}
        </S.Differentiators>
      </S.Container>
    </S.Section>
  );
}
