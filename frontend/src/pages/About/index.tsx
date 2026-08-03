import { useEffect, useState } from 'react';
import { ProcessStep } from '../../components/ProcessStep';
import { Button } from '../../components/Button';
import GithubLangChart from '../../components/GithubLangChart';
import {
  FileText,
  Code2,
  Rocket,
  Wrench,
  ArrowRight,
  Github,
} from 'lucide-react';
import type { IconType } from 'react-icons';
import {
  FaPython,
  FaDatabase,
  FaReact,
  FaJsSquare,
  FaGitAlt,
  FaHtml5,
  FaCss3Alt,
} from 'react-icons/fa';
import { SiTypescript } from 'react-icons/si';
import {
  SiDjango,
  SiRedux,
  SiCypress,
  SiEslint,
  SiPrettier,
  SiVite,
} from 'react-icons/si';
import { Link } from 'react-router-dom';
import * as S from './styles';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

type StackItem = {
  name: string;
  description: string;
  Icon: IconType;
  accent: string;
};

type StackCategory = {
  title: string;
  items: StackItem[];
};

const About = () => {
  const processSteps = [
    {
      icon: FileText,
      title: 'Briefing',
      description:
        'Reunião inicial para entender sua visão, objetivos e necessidades do projeto.',
    },
    {
      icon: Code2,
      title: 'Desenvolvimento',
      description:
        'Codificação com as melhores práticas, código limpo e arquitetura escalável.',
    },
    {
      icon: Rocket,
      title: 'Deploy',
      description:
        'Publicação otimizada em servidores seguros e rápidos para produção.',
    },
    {
      icon: Wrench,
      title: 'Suporte',
      description:
        'Manutenção contínua, atualizações e suporte técnico quando necessário.',
    },
  ];

  // Estado para dados do GitHub
  const [github, setGithub] = useState({
    avatar_url: '',
    name: '',
    login: '',
    bio: '',
    public_repos: 0,
    repos: 0,
    followers: 0,
    location: '',
  });

  useEffect(() => {
    fetch('https://api.github.com/users/LukasFrickDev')
      .then((res) => res.json())
      .then((data) => setGithub(data));
  }, []);

  const stacksByCategory: StackCategory[] = [
    {
      title: 'Back-end',
      items: [
        {
          name: 'Python',
          description: 'Desenvolvimento de APIs e lógica de negócio.',
          Icon: FaPython,
          accent: '#FDE68A',
        },
        {
          name: 'Django',
          description: 'Framework robusto para aplicações web escaláveis.',
          Icon: SiDjango,
          accent: '#4ADE80',
        },
        {
          name: 'SQL (PostgreSQL / MySQL)',
          description: 'Gerenciamento de banco de dados relacional.',
          Icon: FaDatabase,
          accent: '#34D399',
        },
      ],
    },
    {
      title: 'Front-end',
      items: [
        {
          name: 'JavaScript (ES6+)',
          description: 'Interatividade e lógica no navegador.',
          Icon: FaJsSquare,
          accent: '#F7DF1E', // cor oficial JS
        },
        {
          name: 'TypeScript',
          description: 'JavaScript tipado para projetos robustos.',
          Icon: SiTypescript,
          accent: '#3178C6', // cor oficial TS
        },
        {
          name: 'React',
          description: 'Interfaces dinâmicas e responsivas.',
          Icon: FaReact,
          accent: '#61DAFB', // cor oficial React
        },
        {
          name: 'Redux',
          description: 'Gerenciamento de estado em aplicações complexas.',
          Icon: SiRedux,
          accent: '#764ABC', // cor oficial Redux
        },
        {
          name: 'Vite',
          description: 'Bundler moderno para desenvolvimento ágil.',
          Icon: SiVite,
          accent: '#646CFF', // cor oficial Vite
        },
        {
          name: 'HTML5',
          description: 'Estruturação semântica de páginas web.',
          Icon: FaHtml5,
          accent: '#E34F26', // cor oficial HTML5
        },
        {
          name: 'CSS3',
          description: 'Estilização responsiva e consistente.',
          Icon: FaCss3Alt,
          accent: '#1572B6', // cor oficial CSS3
        },
      ],
    },
    {
      title: 'Qualidade & Ferramentas',
      items: [
        {
          name: 'Git & GitHub',
          description: 'Versionamento e colaboração contínua.',
          Icon: FaGitAlt,
          accent: '#F97316',
        },
        {
          name: 'ESLint',
          description: 'Padronização e limpeza do código.',
          Icon: SiEslint,
          accent: '#818CF8',
        },
        {
          name: 'Prettier',
          description: 'Formatação automática e consistente.',
          Icon: SiPrettier,
          accent: '#FBBF24',
        },
        {
          name: 'Cypress',
          description: 'Testes end-to-end para aplicações web.',
          Icon: SiCypress,
          accent: '#34D399',
        },
      ],
    },
  ];

  return (
    <S.Wrapper>
      <Header />
      <S.Section>
        <S.Hero
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <S.Title>Transformando Ideias em Projetos</S.Title>
          <S.Subtitle>
            Desenvolvedor fullstack, especializado em transformar conceitos em
            projetos digitais funcionais, escaláveis e com qualidade
          </S.Subtitle>
        </S.Hero>
        {/* Apresentação Pessoal */}
        <S.GlassBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <S.GlassAside>
            <S.GithubAvatar
              src={github.avatar_url || 'https://github.com/LukasFrickDev.png'}
              alt="Avatar GitHub"
            />
            <S.GithubName>
              {github.name || github.login || 'LukasFrickDev'}
            </S.GithubName>
            <S.GithubBio>
              {github.bio ||
                'Desenvolvedor fullstack apaixonado por tecnologia, código limpo e soluções criativas.'}
            </S.GithubBio>
            <S.GithubStats>
              <S.GithubStat>
                Repositórios públicos:<span> {github.public_repos}</span>
              </S.GithubStat>
            </S.GithubStats>
            <a
              href={`https://github.com/${github.login || 'LukasFrickDev'}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginTop: 16,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                textDecoration: 'none',
              }}
            >
              <Button
                variant="outline"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Github size={18} />
                Ver Perfil no GitHub
              </Button>
            </a>
          </S.GlassAside>
          <S.AboutText>
            <p>
              Olá! Sou desenvolvedor <span className="primary">fullstack</span>{' '}
              com foco em criar experiências digitais de alta qualidade.
              Especializado em
              <span> sites institucionais</span>,<span> landing pages</span>,
              <span> painéis administrativos</span>,<span> e-commerce</span> e
              <span> integrações</span> complexas.
            </p>
            <p>
              Trabalho com <span className="primary">autonomia total</span>,
              entregando projetos que equilibram <span>performance</span>,
              <span> qualidade de código</span> e <span>boas práticas</span> de
              desenvolvimento. Meu objetivo é transformar suas ideias em
              soluções digitais poderosas e escaláveis.
            </p>
            <p>
              Sou entusiasta de novas tecnologias, open source e aprendizado
              contínuo. Busco sempre evoluir, estudando tendências, contribuindo
              com a comunidade e explorando novas stacks para entregar projetos
              cada vez mais inovadores e eficientes.
            </p>
            <p>
              <em>
                Cada projeto é desenvolvido com atenção aos detalhes,
                arquitetura sólida e foco na experiência do usuário final.
              </em>
            </p>
          </S.AboutText>
        </S.GlassBox>
        {/* Processo de Trabalho */}
        <S.ProcessSection>
          <S.ProcessHeader>
            <S.ProcessTitle>Método de Desenvolvimento</S.ProcessTitle>
            <S.ProcessSubtitle>
              Do planejamento ao suporte, cada etapa é cuidadosamente executada
            </S.ProcessSubtitle>
          </S.ProcessHeader>
          <S.ProcessGridMotion
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {processSteps.map((step, index) => (
              <ProcessStep
                key={step.title}
                icon={step.icon}
                title={step.title}
                description={step.description}
                delay={index * 110}
                stepIndex={index}
                totalSteps={processSteps.length}
              />
            ))}
          </S.ProcessGridMotion>
        </S.ProcessSection>
        {/* Stacks e Tecnologias */}
        <S.StacksSection>
          <S.StacksHeader>
            <S.StacksTitle>Stacks & Tecnologias</S.StacksTitle>
            <S.StacksSubtitle>
              Ferramentas e linguagens que domino para criar soluções robustas
            </S.StacksSubtitle>
          </S.StacksHeader>
          {stacksByCategory.map((category) => (
            <S.BadgesBox key={category.title}>
              <S.BadgesTitle>{category.title}</S.BadgesTitle>
              <S.BadgesGrid>
                {category.items.map(
                  ({ name, description, Icon, accent }, index) => (
                    <S.StackBadge
                      key={name}
                      accent={accent}
                      initial={{ opacity: 0, y: 24, scale: 0.95 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      whileHover={{ translateY: -10, rotateX: 8, rotateY: -6 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      viewport={{ once: true, margin: '-80px' }}
                    >
                      <S.StackIcon accent={accent}>
                        <Icon size={24} />
                      </S.StackIcon>
                      <S.StackContent>
                        <S.StackName>{name}</S.StackName>
                        <S.StackDescription>{description}</S.StackDescription>
                      </S.StackContent>
                    </S.StackBadge>
                  ),
                )}
              </S.BadgesGrid>
            </S.BadgesBox>
          ))}
        </S.StacksSection>
        <S.StatsBox>
          <S.StatsTitle>GitHub em Números</S.StatsTitle>
          {/* Gráfico customizado com título em português */}
          <GithubLangChart username="LukasFrickDev" />
        </S.StatsBox>
        <S.CTASection>
          <S.CTAGlass>
            <S.CTAText>
              <S.CTATitle>Pronto para começar?</S.CTATitle>
              <S.CTASubtitle>
                Explore meus projetos ou entre em contato para discutir sua
                ideia
              </S.CTASubtitle>
            </S.CTAText>
            <S.CTAButtons>
              <Link to="/projects">
                <Button size="lg">
                  Ver Projetos
                  <ArrowRight
                    style={{
                      marginLeft: 8,
                      width: 18,
                      height: 18,
                      transition: 'transform 0.2s',
                    }}
                  />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline">
                  Fale Comigo
                </Button>
              </Link>
            </S.CTAButtons>
          </S.CTAGlass>
        </S.CTASection>
      </S.Section>
      <Footer />
    </S.Wrapper>
  );
};

export default About;
