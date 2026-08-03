import { Link } from 'react-router-dom';
import { Code2, Github, Linkedin, Mail } from 'lucide-react';
import * as S from './styles';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <S.FooterWrapper>
      <S.Container>
        <S.Grid>
          <S.Section>
            <S.Brand>
              <S.LogoIcon>
                <Code2 size={20} color="#fff" />
              </S.LogoIcon>
              <S.BrandText>Nexory</S.BrandText>
            </S.Brand>
            <S.Description>
              Transformando ideias em soluções digitais.
            </S.Description>
          </S.Section>
          <S.Section>
            <S.SectionTitle>Links Rápidos</S.SectionTitle>
            <S.List>
              <S.ListItem>
                <S.StyledLink as={Link} to="/services">
                  Serviços
                </S.StyledLink>
              </S.ListItem>
              <S.ListItem>
                <S.StyledLink as={Link} to="/projects">
                  Projetos
                </S.StyledLink>
              </S.ListItem>
              <S.ListItem>
                <S.StyledLink as={Link} to="/about">
                  Sobre
                </S.StyledLink>
              </S.ListItem>
            </S.List>
          </S.Section>
          <S.Section>
            <S.SectionTitle>Mais</S.SectionTitle>
            <S.List>
              <S.ListItem>
                <S.StyledLink as={Link} to="/contact">
                  Contato
                </S.StyledLink>
              </S.ListItem>
              <S.ListItem>
                <S.StyledLink href="#">Portifólio</S.StyledLink>
              </S.ListItem>
              <S.ListItem>
                <S.StyledLink as={Link} to="/contact">
                  Politica de Privacidade
                </S.StyledLink>
              </S.ListItem>
            </S.List>
          </S.Section>
          <S.Section>
            <S.SectionTitle>Redes Sociais</S.SectionTitle>
            <S.Socials>
              <S.SocialLink
                href="https://github.com/LukasFrickDev"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={20} />
              </S.SocialLink>
              <S.SocialLink
                href="https://www.linkedin.com/in/lukas-christoph-frick-408510119/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={20} />
              </S.SocialLink>
              <S.SocialLink href="mailto:contatolukasfrick@gmail.com">
                <Mail size={20} />
              </S.SocialLink>
            </S.Socials>
          </S.Section>
        </S.Grid>
        <S.Copyright>
          <p>&copy; {currentYear} Nexory. Todos os direitos reservados.</p>
        </S.Copyright>
      </S.Container>
    </S.FooterWrapper>
  );
};
