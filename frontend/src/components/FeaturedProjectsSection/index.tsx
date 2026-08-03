import { useReducedMotion } from 'framer-motion';
import { featuredProjectsSectionContent } from '../../content/repageContent';
import * as S from './styles';

const ease = [0.22, 1, 0.36, 1] as const;

export function FeaturedProjectsSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <S.Section id="projetos" aria-labelledby="featured-projects-title">
      <S.Container>
        <S.Heading
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.58, ease }}
        >
          <S.HeadingCopy>
            <S.Eyebrow>{featuredProjectsSectionContent.eyebrow}</S.Eyebrow>
            <S.Title id="featured-projects-title">{featuredProjectsSectionContent.title}</S.Title>
          </S.HeadingCopy>
          <S.Description>{featuredProjectsSectionContent.description}</S.Description>
        </S.Heading>

        <S.ProjectList>
          {featuredProjectsSectionContent.projects.map((project, index) => (
            <S.Project
              key={project.name}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: prefersReducedMotion ? 0 : index * 0.06, ease }}
            >
              <S.Preview $variant={index} aria-hidden="true">
                <S.PreviewIndex>{String(index + 1).padStart(2, '0')}</S.PreviewIndex>
                <S.ProjectWord>{project.name}</S.ProjectWord>
                <S.InterfacePlane $variant={index}>
                  <S.InterfaceHeader><i /><i /><i /><span /></S.InterfaceHeader>
                  <S.InterfaceBody>
                    <S.InterfaceRail><i /><i /><i /></S.InterfaceRail>
                    <S.InterfaceContent>
                      <S.InterfaceLead><i /><i /></S.InterfaceLead>
                      <S.InterfaceGrid><i /><i /><i /></S.InterfaceGrid>
                    </S.InterfaceContent>
                  </S.InterfaceBody>
                </S.InterfacePlane>
              </S.Preview>

              <S.ProjectInfo>
                <S.ProjectNumber aria-hidden="true">{String(index + 1).padStart(2, '0')}</S.ProjectNumber>
                <S.ProjectTitle>{project.name}</S.ProjectTitle>
                <S.ProjectCategory>{project.category}</S.ProjectCategory>
              </S.ProjectInfo>
            </S.Project>
          ))}
        </S.ProjectList>
      </S.Container>
    </S.Section>
  );
}
