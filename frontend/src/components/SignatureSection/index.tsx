import { useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { signatureSectionContent } from '../../content/repageContent';
import * as S from './styles';

export function SignatureSection() {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 90%', 'center 50%'],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.28 });
  const eyebrowOpacity = useTransform(progress, [0, 0.12, 0.2], [0, 0.72, 1]);
  const eyebrowX = useTransform(progress, [0, 0.2], [-6, 0]);
  const titleOpacity = useTransform(progress, [0.06, 0.2, 0.36], [0, 0.84, 1]);
  const titleY = useTransform(progress, [0.06, 0.38], [8, 0]);
  const titleMaskPosition = useTransform(progress, [0.06, 0.4], ['0 100%', '0 0%']);
  const descriptionOpacity = useTransform(progress, [0.32, 0.56], [0, 1]);
  const descriptionX = useTransform(progress, [0.32, 0.56], [8, 0]);
  const logoOpacity = useTransform(progress, [0, 0.34, 0.55, 0.82], [0.08, 0.1, 0.46, 1]);
  const logoScale = useTransform(progress, [0, 0.34, 0.55, 0.82], [0.86, 0.86, 0.92, 1]);
  const logoX = useTransform(progress, [0, 0.34, 0.82], [10, 9, 0]);
  const signatureOpacity = useTransform(progress, [0.45, 0.72], [0, 1]);
  const signatureX = useTransform(progress, [0.45, 0.72], [9, 0]);
  const backPlaneY = useTransform(progress, [0, 1], [-3, 2]);
  const mainPlaneX = useTransform(progress, [0, 1], [2, -2]);
  const traceX = useTransform(progress, [0, 1], [-2, 2]);

  return (
    <S.Section
      ref={sectionRef}
      id="sobre"
      data-home-section="about"
      aria-labelledby="signature-title"
      tabIndex={-1}
    >
      <S.Composition>
        <S.Content>
          <S.Eyebrow
            style={prefersReducedMotion ? undefined : { opacity: eyebrowOpacity, x: eyebrowX }}
          >
            {signatureSectionContent.eyebrow}
          </S.Eyebrow>
          <S.Title
            id="signature-title"
            style={prefersReducedMotion ? undefined : {
              maskPosition: titleMaskPosition,
              opacity: titleOpacity,
              y: titleY,
            }}
          >
            {signatureSectionContent.title}
          </S.Title>
          <S.Description
            style={prefersReducedMotion ? undefined : {
              opacity: descriptionOpacity,
              x: descriptionX,
            }}
          >
            {signatureSectionContent.description}
          </S.Description>
        </S.Content>

        <S.BrandField aria-hidden="true">
          <S.BrandPlane
            $position="back"
            style={prefersReducedMotion ? undefined : { y: backPlaneY }}
          />
          <S.BrandPlane
            $position="main"
            style={prefersReducedMotion ? undefined : { x: mainPlaneX }}
          />
          <S.BrandTrace style={prefersReducedMotion ? undefined : { x: traceX }} />

          <S.BrandStage
            style={prefersReducedMotion ? undefined : {
              opacity: logoOpacity,
              scale: logoScale,
              x: logoX,
            }}
          >
            <S.BrandLogo src="/brands/logo-offwhiote.svg" alt="" />
          </S.BrandStage>
        </S.BrandField>

        <S.Signature
          style={prefersReducedMotion ? undefined : {
            opacity: signatureOpacity,
            x: signatureX,
          }}
        >
          <S.SignatureMark aria-hidden="true" />
          <span>
            <S.SignatureName>{signatureSectionContent.signature}</S.SignatureName>
            <S.SignatureRole>{signatureSectionContent.signatureRole}</S.SignatureRole>
          </span>
        </S.Signature>
      </S.Composition>
    </S.Section>
  );
}
