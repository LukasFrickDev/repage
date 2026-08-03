import { Badge } from '../Badge';
import { Button } from '../Button';
import { ExternalLink, Github, Eye } from 'lucide-react';
import type { Project } from '../../types/project';
import * as S from './styles';

interface PortifolioCardProps {
  project: Project;
  onClick: () => void;
}

export const PortifolioCard = ({ project, onClick }: PortifolioCardProps) => {
  return (
    <S.CardMotion
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -8 }}
    >
      <S.Card onClick={onClick}>
        <S.CardImageWrapper>
          <S.CardImage src={project.thumbnail} alt={project.title} />
          <S.CardImageOverlay />
          {project.featured && (
            <S.FeaturedBadge>
              <Badge variant="default">Destaque</Badge>
            </S.FeaturedBadge>
          )}
        </S.CardImageWrapper>
        <S.CardHeader>
          <S.CardTitle>{project.title}</S.CardTitle>
          <S.CardDescription>{project.shortDescription}</S.CardDescription>
        </S.CardHeader>
        <S.CardContent>
          <S.TechList>
            {project.technologies.slice(0, 4).map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                style={{ fontSize: '0.75rem' }}
              >
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 4 && (
              <Badge variant="outline" style={{ fontSize: '0.75rem' }}>
                +{project.technologies.length - 4}
              </Badge>
            )}
          </S.TechList>
        </S.CardContent>
        <S.CardFooter>
          <Button
            variant="glow"
            size="sm"
            style={{ flex: 1 }}
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <Eye size={16} style={{ marginRight: 8 }} />
            Ver Detalhes
          </Button>
          {project.links.github && (
            <S.StyledLink
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <Github size={16} />
            </S.StyledLink>
          )}
          {project.links.live && (
            <S.StyledLink
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={16} />
            </S.StyledLink>
          )}
        </S.CardFooter>
      </S.Card>
    </S.CardMotion>
  );
};
