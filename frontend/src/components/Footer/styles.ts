import styled from 'styled-components';
import { colors, fonts, glow } from '../../styles/globalStyles';

export const FooterWrapper = styled.footer`
  border-top: 1px solid ${colors.gridLine};
  background: rgba(24, 24, 27, 0.5);
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1rem 0.5rem;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const LogoIcon = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background: ${colors.highlight};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
  ${glow}
`;

export const BrandText = styled.span`
  font-size: 1.25rem;
  font-family: ${fonts.heading};
  font-weight: bold;
  color: ${colors.white};
`;

export const Description = styled.p`
  font-size: 0.875rem;
  color: ${colors.textSecondary};
  margin-top: 1.5rem;
`;

export const Section = styled.div``;

export const SectionTitle = styled.h3`
  font-family: ${fonts.heading};
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${colors.white};
  font-size: 1rem;
`;

export const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const ListItem = styled.li`
  margin-bottom: 0.5rem;
`;

export const StyledLink = styled.a`
  font-size: 0.875rem;
  color: ${colors.textSecondary};
  text-decoration: none;
  transition: color 0.2s;
  &:hover {
    color: ${colors.highlight};
  }
`;

export const Socials = styled.div`
  display: flex;
  gap: 1rem;
`;

export const SocialLink = styled.a`
  color: ${colors.textSecondary};
  transition: color 0.2s;
  &:hover {
    color: ${colors.highlight};
  }
`;

export const Copyright = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${colors.gridLine};
  text-align: center;
  font-size: 0.875rem;
  color: ${colors.textSecondary};
`;
