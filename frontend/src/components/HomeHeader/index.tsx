import { ArrowRight, Menu, X } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { navigation, heroContent } from '../../content/repageContent';
import * as S from './styles';

export function HomeHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 16);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    return () => window.removeEventListener('scroll', updateHeader);
  }, []);

  return (
    <S.Header
      $scrolled={scrolled}
      $open={menuOpen}
      initial={prefersReducedMotion ? false : { opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <S.Inner>
        <S.Brand href="#top" aria-label="Repage, ir para o início">
          <img src="/brands/logo-offwhiote.svg" alt="" />
          <span>Repage</span>
        </S.Brand>

        <S.DesktopNavigation aria-label="Navegação principal">
          {navigation.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </S.DesktopNavigation>

        <S.DesktopCta href={heroContent.primaryCta.href}>
          <span>{heroContent.primaryCta.label}</span>
          <ArrowRight size={16} aria-hidden="true" />
        </S.DesktopCta>

        <S.MenuButton
          type="button"
          aria-expanded={menuOpen}
          aria-controls="homepage-navigation"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
        >
          {menuOpen ? <X aria-hidden="true" size={21} /> : <Menu aria-hidden="true" size={21} />}
        </S.MenuButton>
      </S.Inner>

      <S.MobilePanel id="homepage-navigation" $open={menuOpen} aria-hidden={!menuOpen}>
        <nav aria-label="Navegação móvel">
          {navigation.map((item) => <a key={item.href} href={item.href} onClick={closeMenu}>{item.label}</a>)}
          <S.MobileCta href={heroContent.primaryCta.href} onClick={closeMenu}>
            <span>{heroContent.primaryCta.label}</span>
            <ArrowRight size={17} aria-hidden="true" />
          </S.MobileCta>
        </nav>
      </S.MobilePanel>
    </S.Header>
  );
}
