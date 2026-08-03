import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import {
  setFilter,
  clearFilter,
  selectProject,
} from '../../store/slices/portifolioSlice';
import { PortifolioCard } from '../../components/PortifolioCard';
import { ProjectModal } from '../../components/ProjectModal';

import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Search, X, Filter } from 'lucide-react';
import * as S from './styles';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

const Projects = () => {
  const dispatch = useAppDispatch();
  const { filteredProjects, selectedProject, filter, technologies } =
    useAppSelector((state) => state.portifolio);

  const [searchValue, setSearchValue] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    dispatch(setFilter({ search: value }));
  };

  const handleTechnologyFilter = (tech: string) => {
    if (filter.technology === tech) {
      dispatch(setFilter({ technology: undefined }));
    } else {
      dispatch(setFilter({ technology: tech }));
    }
  };

  const handleClearFilters = () => {
    setSearchValue('');
    dispatch(clearFilter());
  };

  const handleProjectClick = (projectId: string) => {
    dispatch(selectProject(projectId));
  };

  const handleCloseModal = () => {
    dispatch(selectProject(null));
  };

  const activeFiltersCount =
    (filter.technology ? 1 : 0) + (filter.search ? 1 : 0);

  return (
    <S.Wrapper>
      <Header />
      <S.Section>
        {/* Header */}
        <S.HeaderMotion
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <S.Title>Portifólio</S.Title>
          <S.Subtitle>
            Projetos cuidadosamente selecionados que demonstram expertise
            técnica e criatividade
          </S.Subtitle>
        </S.HeaderMotion>

        {/* Search and Filters */}
        <S.SearchMotion
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <S.SearchBar>
            <S.SearchInputWrapper>
              <S.SearchIcon>
                <Search size={18} />
              </S.SearchIcon>
              <S.StyledInput
                type="text"
                placeholder="Buscar projetos..."
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {searchValue && (
                <S.ClearButton
                  onClick={() => handleSearch('')}
                  aria-label="Limpar busca"
                >
                  <X size={18} />
                </S.ClearButton>
              )}
            </S.SearchInputWrapper>
            <S.FilterButton
              type="button"
              $active={showFilters}
              onClick={() => setShowFilters(!showFilters)}
              aria-label="Abrir filtros"
            >
              <Filter size={18} />
              Filtros
              {activeFiltersCount > 0 && (
                <Badge
                  style={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    height: 20,
                    width: 20,
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </S.FilterButton>
          </S.SearchBar>

          {/* Technology Filters */}
          {showFilters && (
            <S.FiltersMotion
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <S.FiltersHeader>
                <h3>Filtrar por Tecnologia</h3>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                  >
                    Limpar Filtros
                  </Button>
                )}
              </S.FiltersHeader>
              <S.FiltersList>
                {technologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant={filter.technology === tech ? 'default' : 'outline'}
                    onClick={() => handleTechnologyFilter(tech)}
                  >
                    {tech}
                  </Badge>
                ))}
              </S.FiltersList>
            </S.FiltersMotion>
          )}
        </S.SearchMotion>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <S.ProjectsGridMotion
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {filteredProjects.map((project, index) => (
              <S.ProjectCardMotion
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <PortifolioCard
                  project={project}
                  onClick={() => handleProjectClick(project.id)}
                />
              </S.ProjectCardMotion>
            ))}
          </S.ProjectsGridMotion>
        ) : (
          <S.EmptyMotion initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p>Nenhum projeto encontrado com os filtros aplicados.</p>
            <Button variant="outline" onClick={handleClearFilters}>
              Limpar Filtros
            </Button>
          </S.EmptyMotion>
        )}
      </S.Section>
      {/* Project Modal */}
      <ProjectModal project={selectedProject} onClose={handleCloseModal} />
      <Footer />
    </S.Wrapper>
  );
};

export default Projects;
