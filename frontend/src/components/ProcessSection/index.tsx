import { useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { processSectionContent } from '../../content/repageContent';
import * as S from './styles';

const journeyPath = 'M72 104 C228 18 382 36 530 130 C692 232 840 198 1128 82 C1182 198 1182 326 1118 430 C890 352 706 344 548 438 C390 532 224 520 76 438';
const mobileJourneyPath = 'M30 18 C86 82 86 146 34 212 C10 276 18 338 78 402 C100 466 86 534 28 596 C6 662 20 728 78 790 C98 854 82 922 34 982';

export function ProcessSection() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 70%', 'end 72%'],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.25 });
  const pathLength = prefersReducedMotion ? 1 : progress;

  return (
    <S.Section
      ref={sectionRef}
      id="processo"
      data-home-section="process"
      aria-labelledby="process-title"
      tabIndex={-1}
    >
      <S.Container>
        <S.Heading>
          <S.Eyebrow>{processSectionContent.eyebrow}</S.Eyebrow>
          <S.Title id="process-title">{processSectionContent.title}</S.Title>
          <S.Description>{processSectionContent.description}</S.Description>
        </S.Heading>

        <S.Journey>
          <S.DesktopTrajectory viewBox="0 0 1200 560" preserveAspectRatio="none" aria-hidden="true">
            <S.BasePath d={journeyPath} />
            <S.ProgressPath d={journeyPath} style={{ pathLength }} />
          </S.DesktopTrajectory>
          <S.MobileTrajectory viewBox="0 0 120 1000" preserveAspectRatio="none" aria-hidden="true">
            <S.BasePath d={mobileJourneyPath} />
            <S.ProgressPath d={mobileJourneyPath} style={{ pathLength }} />
          </S.MobileTrajectory>

          <S.Timeline>
            {processSectionContent.steps.map((step, index) => (
              <S.Step key={step.title}>
                <S.Marker aria-hidden="true"><i /></S.Marker>
                <S.Number aria-hidden="true">{String(index + 1).padStart(2, '0')}</S.Number>
                <S.StepContent>
                  <S.StepTitle>{step.title}</S.StepTitle>
                  <S.StepDescription>{step.description}</S.StepDescription>
                </S.StepContent>
              </S.Step>
            ))}
          </S.Timeline>
        </S.Journey>
      </S.Container>
    </S.Section>
  );
}
