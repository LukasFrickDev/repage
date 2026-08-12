import { useReducedMotion } from 'framer-motion';
import { signatureSectionContent } from '../../content/repageContent';
import * as S from './styles';

const ease = [0.22, 1, 0.36, 1] as const;

export function SignatureSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <S.Section id="sobre" data-home-section="about" aria-labelledby="signature-title" tabIndex={-1}>
      <S.BrandStage aria-hidden="true">
        <S.BrandLetter
          initial={prefersReducedMotion ? false : { opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.68, ease }}
        >
          R
        </S.BrandLetter>
        <S.BrandName
          initial={prefersReducedMotion ? false : { clipPath: 'inset(0 100% 0 0)' }}
          whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.72, delay: 0.1, ease }}
        >
          Repage
        </S.BrandName>
      </S.BrandStage>

      <S.Container>
        <S.Content>
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
      </S.Container>
    </S.Section>
  );
}
