import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Project, ProjectFilter } from '../../types/project';

interface PortifolioState {
  projects: Project[];
  filteredProjects: Project[];
  selectedProject: Project | null;
  filter: ProjectFilter;
  technologies: string[];
}

const initialState: PortifolioState = {
  projects: [
    {
      id: '1',
      title: 'E-commerce Platform',
      shortDescription:
        'Plataforma completa de e-commerce com carrinho, pagamentos e admin.',
      fullDescription:
        'Sistema completo de e-commerce desenvolvido com React e Node.js, incluindo carrinho de compras, integração com gateways de pagamento, painel administrativo e sistema de gerenciamento de produtos. Implementa autenticação JWT, upload de imagens e notificações em tempo real.',
      thumbnail:
        'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop',
      ],
      technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Stripe'],
      links: {
        github: 'https://github.com/fricklabs/ecommerce',
        live: 'https://ecommerce-demo.com',
      },
      featured: true,
    },
    {
      id: '2',
      title: 'Task Management App',
      shortDescription:
        'Aplicativo de gerenciamento de tarefas com drag-and-drop.',
      fullDescription:
        'Aplicativo moderno de gestão de tarefas estilo Trello/Jira, com funcionalidade de drag-and-drop, colaboração em tempo real, notificações push e sincronização multi-dispositivo. Suporta times, projetos e sprints.',
      thumbnail:
        'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=800&fit=crop',
      ],
      technologies: ['React', 'Redux', 'Firebase', 'Material-UI'],
      links: {
        github: 'https://github.com/fricklabs/taskapp',
        demo: 'https://taskapp-demo.com',
      },
      featured: true,
    },
    {
      id: '3',
      title: 'API REST Django',
      shortDescription:
        'API REST escalável construída com Django e PostgreSQL.',
      fullDescription:
        'API RESTful robusta e escalável desenvolvida com Django REST Framework, implementando autenticação via JWT, paginação, cache com Redis, testes unitários e documentação Swagger. Inclui CI/CD com GitHub Actions.',
      thumbnail:
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=800&fit=crop',
      ],
      technologies: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Docker'],
      links: {
        github: 'https://github.com/fricklabs/django-api',
      },
      featured: false,
    },
    {
      id: '4',
      title: 'Dashboard Analytics',
      shortDescription:
        'Dashboard interativo de analytics com gráficos em tempo real.',
      fullDescription:
        'Dashboard completo de analytics e visualização de dados, com gráficos interativos usando Recharts, filtros avançados, exportação de relatórios PDF e Excel. Conecta-se a múltiplas fontes de dados via API.',
      thumbnail:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop',
      ],
      technologies: ['React', 'TypeScript', 'Recharts', 'TailwindCSS'],
      links: {
        github: 'https://github.com/fricklabs/dashboard',
        live: 'https://dashboard-demo.com',
      },
      featured: true,
    },
    {
      id: '5',
      title: 'Mobile App React Native',
      shortDescription: 'Aplicativo mobile cross-platform para iOS e Android.',
      fullDescription:
        'Aplicativo mobile desenvolvido com React Native e Expo, incluindo autenticação biométrica, notificações push, integração com câmera e geolocalização. Disponível para iOS e Android.',
      thumbnail:
        'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&h=800&fit=crop',
      ],
      technologies: ['React Native', 'Expo', 'TypeScript', 'Firebase'],
      links: {
        github: 'https://github.com/fricklabs/mobile-app',
      },
      featured: false,
    },
    {
      id: '6',
      title: 'Machine Learning API',
      shortDescription: 'API de Machine Learning para análise preditiva.',
      fullDescription:
        'API de Machine Learning desenvolvida com Python e FastAPI, utilizando scikit-learn e TensorFlow para modelos preditivos. Inclui preprocessing de dados, treinamento de modelos e endpoints para inferência.',
      thumbnail:
        'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&h=800&fit=crop',
      ],
      technologies: [
        'Python',
        'FastAPI',
        'TensorFlow',
        'scikit-learn',
        'Docker',
      ],
      links: {
        github: 'https://github.com/fricklabs/ml-api',
      },
      featured: false,
    },
  ],
  filteredProjects: [],
  selectedProject: null,
  filter: {},
  technologies: [],
};

// Calculate all unique technologies
const allTechnologies = Array.from(
  new Set(initialState.projects.flatMap((p) => p.technologies)),
).sort();

initialState.technologies = allTechnologies;
initialState.filteredProjects = initialState.projects;

const portifolioSlice = createSlice({
  name: 'portifolio',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<ProjectFilter>) => {
      state.filter = { ...state.filter, ...action.payload };

      // Apply filters
      state.filteredProjects = state.projects.filter((project) => {
        let matches = true;

        if (state.filter.technology) {
          matches =
            matches && project.technologies.includes(state.filter.technology);
        }

        if (state.filter.search) {
          const searchLower = state.filter.search.toLowerCase();
          matches =
            matches &&
            (project.title.toLowerCase().includes(searchLower) ||
              project.shortDescription.toLowerCase().includes(searchLower) ||
              project.fullDescription.toLowerCase().includes(searchLower));
        }

        return matches;
      });
    },
    clearFilter: (state) => {
      state.filter = {};
      state.filteredProjects = state.projects;
    },
    selectProject: (state, action: PayloadAction<string | null>) => {
      if (action.payload === null) {
        state.selectedProject = null;
      } else {
        state.selectedProject =
          state.projects.find((p) => p.id === action.payload) || null;
      }
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.push(action.payload);
      state.filteredProjects = state.projects;

      // Recalculate technologies
      state.technologies = Array.from(
        new Set(state.projects.flatMap((p) => p.technologies)),
      ).sort();
    },
  },
});

export const { setFilter, clearFilter, selectProject, addProject } =
  portifolioSlice.actions;
export default portifolioSlice.reducer;
