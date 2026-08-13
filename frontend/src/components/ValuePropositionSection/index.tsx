import { useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { valuePropositionContent } from '../../content/repageContent';
import { breakpoints } from '../../styles/theme';
import { editorialMotion } from '../../styles/editorialMotion';
import { useTitleReveal } from '../TitleReveal/useTitleReveal';
import * as S from './styles';

export function ValuePropositionSection() {
  const compactMotion = typeof window !== 'undefined'
    && window.matchMedia(`(max-width: ${breakpoints.tabletMax})`).matches;
  const phoneMotion = typeof window !== 'undefined'
    && window.matchMedia(`(max-width: ${breakpoints.mobileMax})`).matches;
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const titleReveal = useTitleReveal(introRef, {
    firstRange: compactMotion ? [...editorialMotion.entry.firstPoleCompact] as [number, number] : [...editorialMotion.entry.firstPole] as [number, number],
    secondRange: compactMotion ? [...editorialMotion.entry.secondPoleCompact] as [number, number] : [...editorialMotion.entry.secondPole] as [number, number],
    shift: compactMotion ? editorialMotion.entry.titleShiftCompact : editorialMotion.entry.titleShift,
  });
  const { prefersReducedMotion } = titleReveal;
  const terminalHoldEnabled = !prefersReducedMotion && typeof window !== 'undefined'
    && !window.matchMedia(`(max-width: ${breakpoints.contentMax})`).matches;
  const { scrollYProgress: sectionScrollProgress } = useScroll({
    target: sectionRef,
    offset: ['start 92%', terminalHoldEnabled ? 'end 63%' : 'end 18%'],
  });
  const continuedProgress = useSpring(sectionScrollProgress, {
    stiffness: 150,
    damping: 32,
    mass: 0.28,
  });
  const differentialShift = compactMotion ? 12 : 18;
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
            style={prefersReducedMotion ? undefined : titleReveal.eyebrow}
          >
            {valuePropositionContent.eyebrow}
          </S.Eyebrow>
          <S.Title id="value-proposition-title">
            <S.TitlePole
              $position="clarity"
              style={prefersReducedMotion ? undefined : titleReveal.first}
            >
              <S.TitlePoleText style={prefersReducedMotion ? undefined : titleReveal.firstText}>
                {titlePoles[0]}
              </S.TitlePoleText>
            </S.TitlePole>{' '}
            <S.TitlePole
              $position="structure"
              style={prefersReducedMotion ? undefined : titleReveal.second}
            >
              <S.TitlePoleText style={prefersReducedMotion ? undefined : titleReveal.secondText}>
                {titlePoles[1]}
              </S.TitlePoleText>
            </S.TitlePole>
          </S.Title>
          <S.Description
            style={prefersReducedMotion ? undefined : titleReveal.description}
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
