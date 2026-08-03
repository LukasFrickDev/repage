import { useNavigate, useLocation } from 'react-router-dom';
import { Code2 } from 'lucide-react';
import * as S from './styles';
import { Button } from '../Button';

const navLinks = [
  { to: '/', label: 'Início' },
  { to: '/about', label: 'Sobre' },
  { to: '/projects', label: 'Portifólio' },
  { to: '/services', label: 'Serviços' },
  { to: '/contact', label: 'Contato' },
];

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Navegação programática para melhor experiência (evita reload, permite lógica extra)
  const handleNav = (to: string) => {
    if (location.pathname !== to) navigate(to);
  };

  return (
    <S.Nav>
      <S.Container>
        <S.Inner>
          <S.LogoLink
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/');
            }}
          >
            <S.LogoIcon>
              <Code2 size={20} color="#fff" />
            </S.LogoIcon>
            <span>Nexory</span>
          </S.LogoLink>
          <S.NavLinks>
            {navLinks.map((link) => (
              <S.NavLinkButton
                key={link.to}
                $active={location.pathname === link.to}
                onClick={() => handleNav(link.to)}
                type="button"
              >
                {link.label}
              </S.NavLinkButton>
            ))}
          </S.NavLinks>
          <Button
            variant="glow"
            size="sm"
            onClick={() => handleNav('/contact')}
          >
            Entre em Contato
          </Button>
        </S.Inner>
      </S.Container>
    </S.Nav>
  );
};
