import { useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { valuePropositionContent } from '../../content/repageContent';
import { breakpoints } from '../../styles/theme';
import * as S from './styles';

export function ValuePropositionSection() {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const compactMotion = typeof window !== 'undefined'
    && window.matchMedia(`(max-width: ${breakpoints.tabletMax})`).matches;
  const phoneMotion = typeof window !== 'undefined'
    && window.matchMedia(`(max-width: ${breakpoints.mobileMax})`).matches;
  const terminalHoldEnabled = !prefersReducedMotion && typeof window !== 'undefined'
    && !window.matchMedia(`(max-width: ${breakpoints.contentMax})`).matches;
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: introRef,
    offset: ['start 92%', 'start 18%'],
  });
  const entranceProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 32,
    mass: 0.28,
  });
  const { scrollYProgress: sectionScrollProgress } = useScroll({
    target: sectionRef,
    offset: ['start 92%', terminalHoldEnabled ? 'end 63%' : 'end 18%'],
  });
  const continuedProgress = useSpring(sectionScrollProgress, {
    stiffness: 150,
    damping: 32,
    mass: 0.28,
  });
  const titleShift = compactMotion ? 10 : 18;
  const differentialShift = compactMotion ? 12 : 18;
  const clarityEnd = compactMotion ? 0.4 : 0.46;
  const structureEnd = compactMotion ? 0.68 : 0.74;
  const eyebrowOpacity = useTransform(entranceProgress, [0.01, 0.14], [0, 1]);
  const eyebrowY = useTransform(entranceProgress, [0.01, 0.14], [8, 0]);
  const clarityClipPath = useTransform(
    entranceProgress,
    [0.08, clarityEnd],
    ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'],
  );
  const clarityX = useTransform(entranceProgress, [0.08, clarityEnd], [titleShift, 0]);
  const clarityOpacity = useTransform(
    entranceProgress,
    [0.08, 0.3, clarityEnd],
    [0, 0.78, 1],
  );
  const structureClipPath = useTransform(
    entranceProgress,
    [0.38, structureEnd],
    ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'],
  );
  const structureX = useTransform(entranceProgress, [0.38, structureEnd], [titleShift, 0]);
  const structureOpacity = useTransform(
    entranceProgress,
    [0.38, 0.59, structureEnd],
    [0, 0.78, 1],
  );
  const descriptionOpacity = useTransform(entranceProgress, [0.76, 0.94], [0, 1]);
  const descriptionY = useTransform(entranceProgress, [0.76, 0.94], [10, 0]);
  const practicalRanges = phoneMotion
    ? [[0.26, 0.34], [0.33, 0.41], [0.4, 0.48], [0.47, 0.55], [0.54, 0.62]]
    : [[0.36, 0.42], [0.41, 0.49], [0.48, 0.56], [0.55, 0.63], [0.62, 0.7]];
  const bridgeOpacity = useTransform(continuedProgress, practicalRanges[0], [0, 1]);
  const bridgeX = useTransform(continuedProgress, practicalRanges[0], [-8, 0]);
  const firstOpacity = useTransform(continuedProgress, practicalRanges[1], [0, 1]);
  const firstX = useTransform(continuedProgress, practicalRanges[1], [-differentialShift, 0]);
  const secondOpacity = useTransform(continuedProgress, practicalRanges[2], [0, 1]);
  const secondX = useTransform(continuedProgress, practicalRanges[2], [differentialShift, 0]);
  const thirdOpacity = useTransform(continuedProgress, practicalRanges[3], [0, 1]);
  const thirdX = useTransform(continuedProgress, practicalRanges[3], [-differentialShift, 0]);
  const fourthOpacity = useTransform(continuedProgress, practicalRanges[4], [0, 1]);
  const fourthX = useTransform(continuedProgress, practicalRanges[4], [differentialShift, 0]);
  const differentialStyles = [
    { opacity: firstOpacity, x: firstX },
    { opacity: secondOpacity, x: secondX },
    { opacity: thirdOpacity, x: thirdX },
    { opacity: fourthOpacity, x: fourthX },
  ];
  const structureStart = valuePropositionContent.title.indexOf('Estrutura');
  const titlePoles = [
    valuePropositionContent.title.slice(0, structureStart).trim(),
    valuePropositionContent.title.slice(structureStart).trim(),
  ];

  return (
    <S.Section
      ref={sectionRef}
      id="diferenciais"
      data-home-section="value"
      aria-labelledby="value-proposition-title"
    >
      <S.Container>
        <S.Intro ref={introRef}>
          <S.Eyebrow
            style={prefersReducedMotion ? undefined : { opacity: eyebrowOpacity, y: eyebrowY }}
          >
            {valuePropositionContent.eyebrow}
          </S.Eyebrow>
          <S.Title id="value-proposition-title">
            <S.TitlePole
              $position="clarity"
              style={prefersReducedMotion
                ? undefined
                : { clipPath: clarityClipPath, opacity: clarityOpacity }}
            >
              <S.TitlePoleText style={prefersReducedMotion ? undefined : { x: clarityX }}>
                {titlePoles[0]}
              </S.TitlePoleText>
            </S.TitlePole>{' '}
            <S.TitlePole
              $position="structure"
              style={prefersReducedMotion
                ? undefined
                : { clipPath: structureClipPath, opacity: structureOpacity }}
            >
              <S.TitlePoleText style={prefersReducedMotion ? undefined : { x: structureX }}>
                {titlePoles[1]}
              </S.TitlePoleText>
            </S.TitlePole>
          </S.Title>
          <S.Description
            style={prefersReducedMotion ? undefined : { opacity: descriptionOpacity, y: descriptionY }}
          >
            {valuePropositionContent.description}
          </S.Description>
        </S.Intro>

        <S.DifferentialsTerminalTrack>
          <S.DifferentialsTerminal>
            <S.DifferentiatorsBridge
              style={prefersReducedMotion ? undefined : { opacity: bridgeOpacity, x: bridgeX }}
            >
              {valuePropositionContent.differentiatorsBridge}
            </S.DifferentiatorsBridge>

            <S.Differentiators aria-label="Diferenciais da Repage">
              {valuePropositionContent.differentiators.map((differentiator, index) => (
                <S.Differentiator
                  key={differentiator.title}
                  style={prefersReducedMotion ? undefined : differentialStyles[index]}
                >
                  <S.DifferentiatorMarker aria-hidden="true" />
                  <S.DifferentiatorTitle>{differentiator.title}</S.DifferentiatorTitle>
                  <S.DifferentiatorDescription>{differentiator.description}</S.DifferentiatorDescription>
                </S.Differentiator>
              ))}
            </S.Differentiators>
          </S.DifferentialsTerminal>
        </S.DifferentialsTerminalTrack>
      </S.Container>
    </S.Section>
  );
}
