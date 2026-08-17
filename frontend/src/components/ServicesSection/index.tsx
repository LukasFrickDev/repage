import { useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { servicesSectionContent } from '../../content/repageContent';
import { breakpoints, homepageTokens } from '../../styles/theme';
import * as S from './styles';
import { useHydrationSafeReducedMotion } from '../../hooks/useHydrationSafeReducedMotion';

const ease = [0.22, 1, 0.36, 1] as const;

type ServiceVisualKind = 'landing' | 'institutional' | 'custom';

type OfferMotionContext = {
  compact: boolean;
  kind: ServiceVisualKind;
};

function getOfferRevealX({ compact, kind }: OfferMotionContext, role: 'copy' | 'media') {
  const distance = compact
    ? homepageTokens.services.offerRevealMobileDistance
    : homepageTokens.services.offerRevealDistance;
  const copyDirection = kind === 'institutional' ? 1 : -1;

  return distance * (role === 'copy' ? copyDirection : copyDirection * -1);
}

const copySequence = {
  hidden: (context: OfferMotionContext) => ({
    opacity: 0,
    x: getOfferRevealX(context, 'copy'),
  }),
  visible: (context: OfferMotionContext) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: context.compact ? 0.46 : 0.58,
      ease,
      staggerChildren: 0.09,
    },
  }),
};

const copyItem = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.58, ease } },
};

const scopeItem = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.54, ease } },
};

const mediaFrame = {
  hidden: (context: OfferMotionContext) => ({
    opacity: 0.18,
    x: getOfferRevealX(context, 'media'),
  }),
  visible: (context: OfferMotionContext) => ({
    opacity: 1,
    x: 0,
    transition: { duration: context.compact ? 0.52 : 0.68, delay: 0.04, ease },
  }),
};

const mediaReveal = {
  hidden: {
    clipPath: `inset(0 0 ${homepageTokens.services.mediaRevealInset} 0)`,
    opacity: 0.38,
    y: homepageTokens.services.mediaRevealDistance,
  },
  visible: (compact: boolean) => ({
    clipPath: 'inset(0 0 0% 0)',
    opacity: 1,
    y: 0,
    transition: { duration: compact ? 0.64 : 0.8, delay: 0.08, ease },
  }),
};

const mediaLayer = {
  hidden: { opacity: 0.18, x: 0, y: 0 },
  visible: (compact: boolean) => ({
    opacity: 1,
    x: compact ? homepageTokens.services.mediaLayerMobileOffset : homepageTokens.services.mediaLayerOffset,
    y: compact ? homepageTokens.services.mediaLayerMobileOffset : homepageTokens.services.mediaLayerOffset,
    transition: { duration: compact ? 0.56 : 0.7, delay: 0.1, ease },
  }),
};

const mediaDepth = {
  hidden: { boxShadow: homepageTokens.services.mediaShadowInitial },
  visible: (compact: boolean) => ({
    boxShadow: homepageTokens.services.mediaShadow,
    transition: { duration: compact ? 0.62 : 0.76, delay: 0.12, ease },
  }),
};

const mediaSignature = {
  hidden: { opacity: 0, scaleX: 0.25 },
  visible: (compact: boolean) => ({
    opacity: 1,
    scaleX: 1,
    transition: { duration: compact ? 0.4 : 0.48, delay: 0.16, ease },
  }),
};

export function ServicesSection() {
  const prefersReducedMotion = useHydrationSafeReducedMotion();
  const compactMotion = typeof window !== 'undefined'
    && window.matchMedia(`(max-width: ${breakpoints.tabletMax})`).matches;
  const introRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: introRef,
    offset: ['start end', 'end end'],
  });
  const introProgress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.25 });
  const eyebrowOpacity = useTransform(introProgress, [0.18, 0.3], [0, 1]);
  const eyebrowY = useTransform(introProgress, [0.18, 0.3], [10, 0]);
  const headlineOpacity = useTransform(introProgress, [0.22, 0.38], [0, 1]);
  const headlineY = useTransform(introProgress, [0.22, 0.38], [18, 0]);
  const introPrimaryExitOpacity = useTransform(
    introProgress,
    [0, 0.68, 0.9, 0.98],
    [1, 1, 0.25, 0],
  );
  const introSupportOpacity = useTransform(
    introProgress,
    [0, 0.28, 0.44, 0.68, 0.9, 0.98],
    [0, 0.18, 1, 1, 0.25, 0],
  );
  const introSupportY = useTransform(introProgress, [0.28, 0.44], [16, 0]);
  const introPrimaryX = useTransform(
    introProgress,
    [0, 0.68, 0.98],
    ['0%', '0%', homepageTokens.services.introPrimaryExitX],
  );
  const introSupportX = useTransform(
    introProgress,
    [0, 0.68, 0.98],
    ['0%', '0%', homepageTokens.services.introSupportExitX],
  );
  const supportRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: supportScrollProgress } = useScroll({
    target: supportRef,
    offset: ['start 88%', 'end 70%'],
  });
  const supportProgress = useSpring(supportScrollProgress, { stiffness: 125, damping: 30, mass: 0.3 });
  const supportEyebrowOpacity = useTransform(supportProgress, [0.04, 0.14], [0, 1]);
  const supportEyebrowY = useTransform(
    supportProgress,
    [0.04, 0.14],
    [homepageTokens.services.supportRevealDistance, 0],
  );
  const supportTitleOpacity = useTransform(supportProgress, [0.12, 0.25], [0, 1]);
  const supportTitleY = useTransform(
    supportProgress,
    [0.12, 0.25],
    [homepageTokens.services.supportRevealDistance, 0],
  );
  const supportDescriptionOpacity = useTransform(supportProgress, [0.24, 0.38], [0, 1]);
  const supportDescriptionY = useTransform(
    supportProgress,
    [0.24, 0.38],
    [homepageTokens.services.supportRevealDistance, 0],
  );
  const firstContinuityOpacity = useTransform(supportProgress, [0.38, 0.5], [0, 1]);
  const firstContinuityX = useTransform(
    supportProgress,
    [0.38, 0.5],
    [homepageTokens.services.supportRevealDistance * -1, 0],
  );
  const secondContinuityOpacity = useTransform(supportProgress, [0.5, 0.62], [0, 1]);
  const secondContinuityX = useTransform(
    supportProgress,
    [0.5, 0.62],
    [homepageTokens.services.supportRevealDistance * -1, 0],
  );
  const thirdContinuityOpacity = useTransform(supportProgress, [0.62, 0.74], [0, 1]);
  const thirdContinuityX = useTransform(
    supportProgress,
    [0.62, 0.74],
    [homepageTokens.services.supportRevealDistance * -1, 0],
  );
  const supportContinuityStyles = [
    { opacity: firstContinuityOpacity, x: firstContinuityX },
    { opacity: secondContinuityOpacity, x: secondContinuityX },
    { opacity: thirdContinuityOpacity, x: thirdContinuityX },
  ];

  return (
    <S.Section id="servicos" data-home-section="services" aria-labelledby="services-title" tabIndex={-1}>
      <S.Container>
        <S.IntroTrack ref={introRef}>
          <S.IntroStage>
            <S.IntroCore>
              <S.IntroPrimary
                style={prefersReducedMotion ? undefined : {
                  x: introPrimaryX,
                  opacity: introPrimaryExitOpacity,
                }}
              >
                <S.Eyebrow
                  style={prefersReducedMotion ? undefined : { y: eyebrowY, opacity: eyebrowOpacity }}
                >
                  {servicesSectionContent.eyebrow}
                </S.Eyebrow>
                <S.Title
                  id="services-title"
                  style={prefersReducedMotion ? undefined : { y: headlineY, opacity: headlineOpacity }}
                >
                  {servicesSectionContent.title}
                </S.Title>
              </S.IntroPrimary>
              <S.IntroSupport
                style={prefersReducedMotion ? undefined : {
                  x: introSupportX,
                  y: introSupportY,
                  opacity: introSupportOpacity,
                }}
              >
                <S.Description>{servicesSectionContent.description}</S.Description>
              </S.IntroSupport>
            </S.IntroCore>
          </S.IntroStage>
        </S.IntroTrack>

        <S.ServicesContent>
          <S.Offers>
            {servicesSectionContent.services.map((service) => {
              const kind = service.visual as ServiceVisualKind;
              const motionContext = { compact: compactMotion, kind } satisfies OfferMotionContext;

              return (
                <S.Offer
                  key={service.title}
                  $kind={kind}
                  initial={prefersReducedMotion ? false : 'hidden'}
                  whileInView={prefersReducedMotion ? undefined : 'visible'}
                  viewport={{ once: false, amount: homepageTokens.services.offerRevealAmount }}
                >
                  <S.OfferCopy
                    $kind={kind}
                    custom={motionContext}
                    variants={copySequence}
                  >
                    <S.ServiceTitle variants={copyItem}>{service.title}</S.ServiceTitle>
                    <S.ServiceDescription variants={copyItem}>{service.description}</S.ServiceDescription>
                    <S.ServiceScope variants={scopeItem}>{service.scope}</S.ServiceScope>
                  </S.OfferCopy>

                  <S.ServiceMediaFrame
                    $kind={kind}
                    custom={motionContext}
                    variants={mediaFrame}
                  >
                    <S.ServiceMediaLayer
                      aria-hidden="true"
                      custom={compactMotion}
                      variants={mediaLayer}
                    />
                    <S.ServiceMediaSurface custom={compactMotion} variants={mediaDepth}>
                      <S.ServiceMediaChrome aria-hidden="true">
                        <S.ServiceMediaSignals>
                          <i />
                          <i />
                          <i />
                        </S.ServiceMediaSignals>
                      </S.ServiceMediaChrome>
                      <S.ServiceMediaViewport custom={compactMotion} variants={mediaReveal}>
                        <S.ServiceMediaImage
                          $kind={kind}
                          src={service.media.desktop}
                          alt={service.media.alt}
                          width={service.media.width}
                          height={service.media.height}
                          loading="lazy"
                        />
                      </S.ServiceMediaViewport>
                    </S.ServiceMediaSurface>
                    <S.ServiceMediaSignature
                      aria-hidden="true"
                      custom={compactMotion}
                      variants={mediaSignature}
                    />
                  </S.ServiceMediaFrame>
                </S.Offer>
              );
            })}
          </S.Offers>

          <S.SupportEpilogueTrack ref={supportRef}>
            <S.SupportEpilogue aria-labelledby="services-support-title">
              <S.SupportContent>
                <S.SupportHeading>
                  <S.SupportEyebrow
                    style={prefersReducedMotion ? undefined : {
                      opacity: supportEyebrowOpacity,
                      y: supportEyebrowY,
                    }}
                  >
                    {servicesSectionContent.support.eyebrow}
                  </S.SupportEyebrow>
                  <S.SupportTitle
                    id="services-support-title"
                    style={prefersReducedMotion ? undefined : {
                      opacity: supportTitleOpacity,
                      y: supportTitleY,
                    }}
                  >
                    {servicesSectionContent.support.title}
                  </S.SupportTitle>
                </S.SupportHeading>
                <S.SupportDescription
                  style={prefersReducedMotion ? undefined : {
                    opacity: supportDescriptionOpacity,
                    y: supportDescriptionY,
                  }}
                >
                  {servicesSectionContent.support.description}
                </S.SupportDescription>
              </S.SupportContent>

              <S.SupportContinuities
                aria-label="Possibilidades de continuidade após a publicação"
              >
                {servicesSectionContent.support.continuities.map((continuity, index) => (
                  <S.SupportContinuity
                    key={continuity.title}
                    style={prefersReducedMotion ? undefined : supportContinuityStyles[index]}
                  >
                    <S.SupportContinuityMarker aria-hidden="true" />
                    <S.SupportContinuityTitle>{continuity.title}</S.SupportContinuityTitle>
                    <S.SupportContinuityDescription>
                      {continuity.description}
                    </S.SupportContinuityDescription>
                  </S.SupportContinuity>
                ))}
              </S.SupportContinuities>
            </S.SupportEpilogue>
          </S.SupportEpilogueTrack>
        </S.ServicesContent>
      </S.Container>
    </S.Section>
  );
}
