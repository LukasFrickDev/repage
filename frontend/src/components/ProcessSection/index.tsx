import { useReducedMotion } from 'framer-motion';
import { processSectionContent } from '../../content/repageContent';
import * as S from './styles';

const ease = [0.22, 1, 0.36, 1] as const;

export function ProcessSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <S.Section id="processo" aria-labelledby="process-title">
      <S.Container>
        <S.Heading
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.58, ease }}
        >
          <S.HeadingCopy>
            <S.Eyebrow>{processSectionContent.eyebrow}</S.Eyebrow>
            <S.Title id="process-title">{processSectionContent.title}</S.Title>
          </S.HeadingCopy>
          <S.Description>{processSectionContent.description}</S.Description>
        </S.Heading>

        <S.Timeline>
          {processSectionContent.steps.map((step, index) => (
            <S.Step
              key={step.title}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.52, delay: prefersReducedMotion ? 0 : 0.08 + index * 0.09, ease }}
            >
              <S.Number aria-hidden="true">{String(index + 1).padStart(2, '0')}</S.Number>
              <S.Marker aria-hidden="true"><span /></S.Marker>
              <S.StepContent>
                <S.StepTitle>{step.title}</S.StepTitle>
                <S.StepDescription>{step.description}</S.StepDescription>
              </S.StepContent>
            </S.Step>
          ))}
        </S.Timeline>
      </S.Container>
    </S.Section>
  );
}
