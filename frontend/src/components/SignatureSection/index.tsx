import { useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { signatureSectionContent } from '../../content/repageContent';
import * as S from './styles';

const ease = [0.22, 1, 0.36, 1] as const;

export function SignatureSection() {
  const prefersReducedMotion = useReducedMotion();
  const [canUsePointer, setCanUsePointer] = useState(false);

  useEffect(() => {
    const pointerQuery = window.matchMedia('(min-width: 1100px) and (hover: hover) and (pointer: fine)');
    const updatePointerCapability = () => setCanUsePointer(pointerQuery.matches);

    updatePointerCapability();
    pointerQuery.addEventListener('change', updatePointerCapability);

    return () => pointerQuery.removeEventListener('change', updatePointerCapability);
  }, []);

  const resetLightPosition = (element: HTMLDivElement) => {
    element.style.setProperty('--pointer-x', '0px');
    element.style.setProperty('--pointer-y', '0px');
  };

  const handlePointerMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!canUsePointer || prefersReducedMotion) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;

    event.currentTarget.style.setProperty('--pointer-x', `${horizontal * 10}px`);
    event.currentTarget.style.setProperty('--pointer-y', `${vertical * 10}px`);
  };

  return (
    <S.Section id="sobre" aria-labelledby="signature-title">
      <S.Container>
        <S.Content
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease }}
        >
          <S.Eyebrow>{signatureSectionContent.eyebrow}</S.Eyebrow>
          <S.Title id="signature-title">{signatureSectionContent.title}</S.Title>
          <S.Description>{signatureSectionContent.description}</S.Description>

          <S.Signature>
            <S.SignatureMark aria-hidden="true" />
            <span>
              <S.SignatureName>{signatureSectionContent.signature}</S.SignatureName>
              <S.SignatureRole>{signatureSectionContent.signatureRole}</S.SignatureRole>
            </span>
          </S.Signature>
        </S.Content>

        <S.Identity
          aria-hidden="true"
          onMouseMove={canUsePointer && !prefersReducedMotion ? handlePointerMove : undefined}
          onMouseLeave={canUsePointer && !prefersReducedMotion
            ? (event) => resetLightPosition(event.currentTarget)
            : undefined}
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, delay: 0.12, ease }}
        >
          <S.TechnicalGrid />
          <S.Plane $position="top" />
          <S.Plane $position="bottom" />

          <S.Trace $position="first" />
          <S.Trace $position="second" />
          <S.Trace $position="third" />

          <S.SymbolField
            initial={prefersReducedMotion ? false : { opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.62, delay: 0.2, ease }}
          >
            <img src="/brands/logo-offwhiote.svg" alt="" />
          </S.SymbolField>

          <S.SignalPoint $position="one" />
          <S.SignalPoint $position="two" />
          <S.SignalPoint $position="three" />
          <S.EdgeNotation><i /><i /><i /></S.EdgeNotation>
        </S.Identity>
      </S.Container>
    </S.Section>
  );
}
