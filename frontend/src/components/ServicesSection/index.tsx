import { ArrowRight } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { servicesSectionContent } from '../../content/repageContent';
import * as S from './styles';

const ease = [0.22, 1, 0.36, 1] as const;

export function ServicesSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <S.Section id="servicos" aria-labelledby="services-title" tabIndex={-1}>
      <S.Container>
        <S.Intro
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.58, ease }}
        >
          <S.Eyebrow>{servicesSectionContent.eyebrow}</S.Eyebrow>
          <S.Title id="services-title">{servicesSectionContent.title}</S.Title>
          <S.Description>{servicesSectionContent.description}</S.Description>
        </S.Intro>

        <S.ServicesList>
          {servicesSectionContent.services.map((service, index) => (
            <S.ServiceItem
              key={service.title}
              $featured={index === 0}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.52, delay: prefersReducedMotion ? 0 : 0.1 + index * 0.07, ease }}
            >
              <S.Accent aria-hidden="true" />
              <S.Number aria-hidden="true">{String(index + 1).padStart(2, '0')}</S.Number>
              <S.ServiceCopy>
                <S.ServiceTitle>{service.title}</S.ServiceTitle>
                <S.ServiceDescription>{service.description}</S.ServiceDescription>
              </S.ServiceCopy>
              <S.Arrow aria-hidden="true"><ArrowRight size={20} strokeWidth={1.7} /></S.Arrow>
            </S.ServiceItem>
          ))}
        </S.ServicesList>
      </S.Container>
    </S.Section>
  );
}
