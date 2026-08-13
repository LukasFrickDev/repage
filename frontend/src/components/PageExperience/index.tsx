import { cubicBezier, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import * as S from './styles';

const ease = [0.22, 1, 0.36, 1] as const;
const scrollEase = cubicBezier(...ease);
const initialPath = 'M126 184 C206 92 270 132 328 240 C370 318 398 366 446 402';
const organizedPath = 'M132 190 C210 110 272 142 328 242 C370 316 402 356 452 390';

interface PageExperienceProps {
  entranceDelay: number;
}

export function PageExperience({ entranceDelay }: PageExperienceProps) {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const delay = prefersReducedMotion ? 0 : entranceDelay + 0.04;
  const { scrollY } = useScroll();
  const stageProgress = useTransform(scrollY, [96, 300], [0, 1], { clamp: true });
  const ideaOpacity = useTransform(stageProgress, [0, 0.78], [1, 0.7], { ease: scrollEase });
  const ideaScale = useTransform(stageProgress, [0, 0.78], [1, 0.86], { ease: scrollEase });
  const ideaX = useTransform(stageProgress, [0, 0.78], [0, 38], { ease: scrollEase });
  const ideaY = useTransform(stageProgress, [0, 0.78], [0, 44], { ease: scrollEase });
  const structureScale = useTransform(stageProgress, [0.086, 0.914], [1, 0.97], { ease: scrollEase });
  const structureX = useTransform(stageProgress, [0.086, 0.914], [0, 18], { ease: scrollEase });
  const structureY = useTransform(stageProgress, [0.086, 0.914], [0, 12], { ease: scrollEase });
  const structureRotate = useTransform(stageProgress, [0.086, 0.914], [-5, -1], { ease: scrollEase });
  const finalScale = useTransform(stageProgress, [0.173, 1], [1, 1.04], { ease: scrollEase });
  const finalX = useTransform(stageProgress, [0.173, 1], [0, -10], { ease: scrollEase });
  const finalY = useTransform(stageProgress, [0.173, 1], [0, -10], { ease: scrollEase });
  const flowPath = useTransform(stageProgress, [0.036, 0.971], [initialPath, organizedPath], { ease: scrollEase });
  const traceOpacity = useTransform(stageProgress, [0.036, 0.971], [0.8, 1], { ease: scrollEase });
  const pointX = useTransform(stageProgress, [0.086, 0.914], [0, 28], { ease: scrollEase });
  const pointY = useTransform(stageProgress, [0.086, 0.914], [0, 14], { ease: scrollEase });
  const pointScale = useTransform(stageProgress, [0.086, 0.914], [1, 0.92], { ease: scrollEase });

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
          style={prefersReducedMotion ? {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
          } : {
            opacity: ideaOpacity,
            scale: ideaScale,
            x: ideaX,
            y: ideaY,
          }}
        >
          <S.OriginPoint />
          <S.OriginRule />
          <S.MomentLabel><span>01</span><strong>Ideia</strong></S.MomentLabel>
        </S.IdeaEntrance>

        <S.StructureEntrance
          style={prefersReducedMotion ? {
            opacity: 1,
            rotate: -5,
            scale: 1,
            x: 0,
            y: 0,
          } : {
            opacity: 1,
            rotate: structureRotate,
            scale: structureScale,
            x: structureX,
            y: structureY,
          }}
        >
          <S.StructureFrame>
            <S.StructureLabel><span>02</span><strong>Estrutura</strong></S.StructureLabel>
            <S.StructurePlanePrimary />
            <S.StructurePlaneSecondary />
            <S.StructureBaseline />
          </S.StructureFrame>
        </S.StructureEntrance>

        <S.FinalEntrance
          style={prefersReducedMotion ? {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
          } : {
            opacity: 1,
            scale: finalScale,
            x: finalX,
            y: finalY,
          }}
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
            d={prefersReducedMotion ? initialPath : flowPath}
          />
          <S.FlowTrace
            d={prefersReducedMotion ? initialPath : flowPath}
            style={prefersReducedMotion ? { opacity: 0.8 } : { opacity: traceOpacity }}
          />
        </S.FlowMap>

        <S.StructurePoint
          style={prefersReducedMotion ? {
            scale: 1,
            x: 0,
            y: 0,
          } : {
            scale: pointScale,
            x: pointX,
            y: pointY,
          }}
        />
        <S.StageCaption>Da intenção à experiência</S.StageCaption>
      </S.Stage>
    </S.Experience>
  );
}
