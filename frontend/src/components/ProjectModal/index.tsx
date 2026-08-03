import { AnimatePresence } from 'framer-motion';
import { X, Github, ExternalLink, Play } from 'lucide-react';
import { Badge } from '../Badge';
import { Button } from '../Button';
import type { Project } from '../../types/project';
import { useState } from 'react';
import * as S from './styles';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  if (!project) return null;
  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <S.Backdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Modal */}
          <S.ModalWrapper
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <S.Modal>
              {/* Header */}
              <S.ModalHeader>
                <div style={{ flex: 1 }}>
                  <S.ModalTitle>{project.title}</S.ModalTitle>
                  <S.TechList>
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </S.TechList>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  style={{ marginLeft: '1rem', flexShrink: 0 }}
                >
                  <X size={20} />
                </Button>
              </S.ModalHeader>
              {/* Content */}
              <S.ModalContent>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                  {/* Main Image */}
                  <S.MainImage>
                    <img
                      src={project.images[selectedImage]}
                      alt={`${project.title} - Image ${selectedImage + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </S.MainImage>
                  {/* Image Gallery */}
                  {project.images.length > 1 && (
                    <S.Gallery>
                      {project.images.map((img, idx) => (
                        <S.GalleryButton
                          key={idx}
                          $active={selectedImage === idx}
                          onClick={() => setSelectedImage(idx)}
                        >
                          <img
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </S.GalleryButton>
                      ))}
                    </S.Gallery>
                  )}
                  {/* Description */}
                  <S.DescriptionBox>
                    <S.ModalSectionTitle>Sobre o Projeto</S.ModalSectionTitle>
                    <S.ModalText>{project.fullDescription}</S.ModalText>
                    {/* Links */}
                    <S.Links>
                      {project.links.github && (
                        <S.StyledLink
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github size={16} style={{ marginRight: 8 }} />
                          Ver Código
                        </S.StyledLink>
                      )}
                      {project.links.live && (
                        <S.StyledLink
                          href={project.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink size={16} style={{ marginRight: 8 }} />
                          Ver Site
                        </S.StyledLink>
                      )}
                      {project.links.demo && (
                        <S.StyledLink
                          href={project.links.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Play size={16} style={{ marginRight: 8 }} />
                          Ver Demo
                        </S.StyledLink>
                      )}
                    </S.Links>
                  </S.DescriptionBox>
                </div>
              </S.ModalContent>
            </S.Modal>
          </S.ModalWrapper>
        </>
      )}
    </AnimatePresence>
  );
};
