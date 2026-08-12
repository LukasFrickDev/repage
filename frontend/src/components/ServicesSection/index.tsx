import { useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { servicesSectionContent } from '../../content/repageContent';
import { breakpoints, homepageTokens } from '../../styles/theme';
import * as S from './styles';

const ease = [0.22, 1, 0.36, 1] as const;

type ServiceVisualKind = 'landing' | 'institutional' | 'custom';

const copySequence = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const copyItem = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.46, ease } },
};

const scopeItem = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease } },
};

const mediaItem = {
  hidden: { opacity: 0.45, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.64, delay: 0.16, ease } },
};

const mediaReveal = {
  hidden: { clipPath: 'inset(0 0 14% 0)' },
  visible: { clipPath: 'inset(0 0 0% 0)', transition: { duration: 0.72, delay: 0.2, ease } },
};

export function ServicesSection() {
  const prefersReducedMotion = Boolean(useReducedMotion());
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

              return (
                <S.Offer
                  key={service.title}
                  $kind={kind}
                  initial={prefersReducedMotion ? false : 'hidden'}
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.18 }}
                >
                  <S.OfferCopy
                    $kind={kind}
                    variants={copySequence}
                  >
                    <S.ServiceTitle variants={copyItem}>{service.title}</S.ServiceTitle>
                    <S.ServiceDescription variants={copyItem}>{service.description}</S.ServiceDescription>
                    <S.ServiceScope variants={scopeItem}>{service.scope}</S.ServiceScope>
                  </S.OfferCopy>

                  <S.MediaFrame
                    $kind={kind}
                    variants={mediaItem}
                  >
                    <S.MediaSurface $kind={kind}>
                      <S.MediaReveal variants={mediaReveal}>
                        <picture>
                          <source media={`(max-width: ${breakpoints.compactMax})`} srcSet={service.media.mobile} />
                          <S.MediaImage
                            $kind={kind}
                            src={service.media.desktop}
                            alt={service.media.alt}
                            width={service.media.width}
                            height={service.media.height}
                            loading="lazy"
                          />
                        </picture>
                      </S.MediaReveal>
                    </S.MediaSurface>
                  </S.MediaFrame>
                </S.Offer>
              );
            })}
          </S.Offers>
        </S.ServicesContent>
      </S.Container>
    </S.Section>
  );
}
