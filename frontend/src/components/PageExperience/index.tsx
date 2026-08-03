import { useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import * as S from './styles';

export function PageExperience() {
  const prefersReducedMotion = useReducedMotion();
  const [canUseParallax, setCanUseParallax] = useState(false);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 120, damping: 24 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 120, damping: 24 });
  const offsetX = useSpring(useMotionValue(0), { stiffness: 120, damping: 24 });
  const offsetY = useSpring(useMotionValue(0), { stiffness: 120, damping: 24 });

  useEffect(() => {
    const pointerQuery = window.matchMedia('(min-width: 1280px) and (hover: hover) and (pointer: fine)');
    const updatePointerCapability = () => {
      setCanUseParallax(pointerQuery.matches);

      if (!pointerQuery.matches) {
        rotateX.set(0);
        rotateY.set(0);
        offsetX.set(0);
        offsetY.set(0);
      }
    };

    updatePointerCapability();
    pointerQuery.addEventListener('change', updatePointerCapability);

    return () => pointerQuery.removeEventListener('change', updatePointerCapability);
  }, [offsetX, offsetY, rotateX, rotateY]);

  useEffect(() => {
    if (!prefersReducedMotion) return;

    rotateX.set(0);
    rotateY.set(0);
    offsetX.set(0);
    offsetY.set(0);
  }, [offsetX, offsetY, prefersReducedMotion, rotateX, rotateY]);

  const resetPosition = () => {
    rotateX.set(0);
    rotateY.set(0);
    offsetX.set(0);
    offsetY.set(0);
  };

  const handlePointerMove = (event: MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !canUseParallax) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;

    rotateX.set(vertical * -8);
    rotateY.set(horizontal * 8);
    offsetX.set(horizontal * 8);
    offsetY.set(vertical * 6);
  };

  const entrance = prefersReducedMotion ? false : { opacity: 0, y: 18, scale: 0.985 };

  return (
    <S.Experience
      aria-hidden="true"
      onMouseMove={canUseParallax && !prefersReducedMotion ? handlePointerMove : undefined}
      onMouseLeave={canUseParallax && !prefersReducedMotion ? resetPosition : undefined}
      initial={entrance}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.65, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <S.PerspectiveStage style={{ rotateX, rotateY, x: offsetX, y: offsetY }}>
        <S.FloatFrame>
          <S.LayerEntrance
            initial={prefersReducedMotion ? false : { opacity: 0, x: 16, y: 12 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.55, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            <S.BackLayerFar><S.StructuralLines /></S.BackLayerFar>
          </S.LayerEntrance>

          <S.LayerEntrance
            initial={prefersReducedMotion ? false : { opacity: 0, x: 12, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <S.BackLayer><S.StructuralLines /></S.BackLayer>
          </S.LayerEntrance>

          <S.LayerEntrance
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.46, ease: [0.22, 1, 0.36, 1] }}
          >
            <S.MainSurface>
              <S.SurfaceHeader>
                <S.ControlPoints><i /><i /><i /></S.ControlPoints>
                <S.HeaderLine />
                <S.HeaderAction />
              </S.SurfaceHeader>

              <S.SurfaceBody>
                <S.SideRail>
                  <S.SideMark />
                  <S.SideLine $width="72%" />
                  <S.SideLine $width="54%" />
                  <S.SideLine $width="64%" />
                  <S.SideLine $width="46%" />
                </S.SideRail>

                <S.LayoutCanvas>
                  <S.LayoutHeading>
                    <S.KickerLine />
                    <S.TitleLines><span /><span /></S.TitleLines>
                  </S.LayoutHeading>
                  <S.LayoutGrid>
                    <S.AccentBlock><span /></S.AccentBlock>
                    <S.ContentBlock><span /><span /><span /></S.ContentBlock>
                  </S.LayoutGrid>
                  <S.BottomRail><span /><span /><span /></S.BottomRail>
                </S.LayoutCanvas>
              </S.SurfaceBody>
              <S.ActivePoint />
            </S.MainSurface>
          </S.LayerEntrance>
        </S.FloatFrame>
      </S.PerspectiveStage>
    </S.Experience>
  );
}
