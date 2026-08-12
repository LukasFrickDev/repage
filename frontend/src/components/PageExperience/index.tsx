import { useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import * as S from './styles';

const ease = [0.22, 1, 0.36, 1] as const;
const initialPath = 'M126 184 C206 92 270 132 328 240 C370 318 398 366 446 402';
const organizedPath = 'M132 190 C210 110 272 142 328 242 C370 316 402 356 452 390';

interface PageExperienceProps {
  entranceDelay: number;
}

export function PageExperience({ entranceDelay }: PageExperienceProps) {
  const prefersReducedMotion = useReducedMotion();
  const [hasAnimated, setHasAnimated] = useState(false);
  const delay = prefersReducedMotion ? 0 : entranceDelay + 0.04;

  useEffect(() => {
    if (prefersReducedMotion) return;

    const triggerAt = 96;
    const handleScroll = () => {
      if (window.scrollY < triggerAt) return;

      setHasAnimated(true);
      window.removeEventListener('scroll', handleScroll);
    };
    const readyTimer = window.setTimeout(() => {
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }, 1500);

    return () => {
      window.clearTimeout(readyTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prefersReducedMotion]);

  return (
    <S.Experience
      aria-hidden="true"
      data-hero-stage
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.68, delay, ease }}
    >
      <S.Stage>
        <S.IdeaEntrance
          initial={false}
          animate={hasAnimated
            ? { opacity: 0.7, scale: 0.86, x: 38, y: 44 }
            : { opacity: 1, scale: 1, x: 0, y: 0 }}
          transition={{ duration: 1.08, ease }}
        >
          <S.OriginPoint />
          <S.OriginRule />
          <S.MomentLabel><span>01</span><strong>Ideia</strong></S.MomentLabel>
        </S.IdeaEntrance>

        <S.StructureEntrance
          initial={false}
          animate={hasAnimated
            ? { opacity: 1, scale: 0.97, x: 18, y: 12, rotate: -1 }
            : { opacity: 1, scale: 1, x: 0, y: 0, rotate: -5 }}
          transition={{ duration: 1.15, delay: hasAnimated ? 0.12 : 0, ease }}
        >
          <S.StructureFrame>
            <S.StructureLabel><span>02</span><strong>Estrutura</strong></S.StructureLabel>
            <S.StructurePlanePrimary />
            <S.StructurePlaneSecondary />
            <S.StructureBaseline />
          </S.StructureFrame>
        </S.StructureEntrance>

        <S.FinalEntrance
          initial={false}
          animate={hasAnimated
            ? { opacity: 1, scale: 1.04, x: -10, y: -10 }
            : { opacity: 1, scale: 1, x: 0, y: 0 }}
          transition={{ duration: 1.15, delay: hasAnimated ? 0.24 : 0, ease }}
        >
          <S.FinalBlock>
            <S.FinalGraphic>
              <img src="/brands/logo-azulgrafiteg.svg" alt="" />
            </S.FinalGraphic>
            <S.FinalCopy>
              <span>03</span>
              <strong>Experiência digital</strong>
              <p>Clara, profissional e preparada para evoluir.</p>
            </S.FinalCopy>
          </S.FinalBlock>
        </S.FinalEntrance>

        <S.ExitLine />

        <S.FlowMap viewBox="0 0 820 610" preserveAspectRatio="none">
          <S.FlowBase
            d={initialPath}
            initial={false}
            animate={{ d: hasAnimated ? organizedPath : initialPath }}
            transition={{ duration: 1.3, delay: hasAnimated ? 0.05 : 0, ease }}
          />
          <S.FlowTrace
            d={initialPath}
            initial={false}
            animate={{
              d: hasAnimated ? organizedPath : initialPath,
              opacity: hasAnimated ? 1 : 0.8,
            }}
            transition={{ duration: 1.3, delay: hasAnimated ? 0.05 : 0, ease }}
          />
        </S.FlowMap>

        <S.StructurePoint
          initial={false}
          animate={hasAnimated ? { x: 28, y: 14, scale: 0.92 } : { x: 0, y: 0, scale: 1 }}
          transition={{ duration: 1.15, delay: hasAnimated ? 0.12 : 0, ease }}
        />
        <S.StageCaption>Da intenção à experiência</S.StageCaption>
      </S.Stage>
    </S.Experience>
  );
}
