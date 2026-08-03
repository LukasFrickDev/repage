import type { LucideIcon } from 'lucide-react';
import * as S from './styles';

interface ProcessStepProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
  stepIndex: number;
  totalSteps: number;
}

export const ProcessStep = ({
  icon: Icon,
  title,
  description,
  delay = 0,
  stepIndex,
  totalSteps,
}: ProcessStepProps) => {
  const stepNumber = String(stepIndex + 1);

  return (
    <S.StepWrapper
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.45, delay: delay / 1000 }}
      viewport={{ once: true, margin: '-120px' }}
      data-first={stepIndex === 0}
      data-last={stepIndex === totalSteps - 1}
    >
      <S.StepNode>
        <S.StepNodeGlow aria-hidden="true" data-glow />
        <S.StepOrbit aria-hidden="true" data-orbit />
        <S.StepNumber data-step-number>{stepNumber}</S.StepNumber>
      </S.StepNode>
      <S.CardMotion tabIndex={0}>
        <S.CardHeader>
          <S.IconWrapper>
            <Icon />
          </S.IconWrapper>
          <S.CardTitle>{title}</S.CardTitle>
        </S.CardHeader>
        <S.CardContent>
          <S.CardDescription>{description}</S.CardDescription>
        </S.CardContent>
      </S.CardMotion>
    </S.StepWrapper>
  );
};
