import { ArrowRight, Menu, X } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { headerNavigation, heroContent } from '../../content/repageContent';
import * as S from './styles';

export function HomeHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const closeMenu = () => setMenuOpen(false);
  const isNavigationItemActive = (href: string) => {
    const [path, hash] = href.split('#');
    const targetPath = path || '/';

    return location.pathname === targetPath
      && (hash ? location.hash === `#${hash}` : location.hash === '');
  };

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 16);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    return () => window.removeEventListener('scroll', updateHeader);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.hash, location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const desktopQuery = window.matchMedia('(min-width: 900px)');
    const closeAtDesktop = () => {
      if (desktopQuery.matches) setMenuOpen(false);
    };

    document.body.style.overflow = 'hidden';
    desktopQuery.addEventListener('change', closeAtDesktop);
    closeAtDesktop();

    return () => {
      document.body.style.overflow = previousOverflow;
      desktopQuery.removeEventListener('change', closeAtDesktop);
    };
  }, [menuOpen]);

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!menuOpen) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      setMenuOpen(false);
      menuButtonRef.current?.focus();
      return;
    }

    if (event.key !== 'Tab') return;

    const closeButton = menuButtonRef.current;
    const links = [...(mobilePanelRef.current?.querySelectorAll<HTMLElement>('a[href]') ?? [])];
    const firstLink = links[0];
    const lastLink = links.at(-1);

    if (!closeButton || !firstLink || !lastLink) return;

    if (event.shiftKey && document.activeElement === closeButton) {
      event.preventDefault();
      lastLink.focus();
    } else if (event.shiftKey && document.activeElement === firstLink) {
      event.preventDefault();
      closeButton.focus();
    } else if (!event.shiftKey && document.activeElement === closeButton) {
      event.preventDefault();
      firstLink.focus();
    } else if (!event.shiftKey && document.activeElement === lastLink) {
      event.preventDefault();
      closeButton.focus();
    }
  };

  return (
    <S.Header
      $scrolled={scrolled || location.pathname !== '/'}
      $open={menuOpen}
      initial={prefersReducedMotion ? false : { opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onKeyDown={handleMenuKeyDown}
    >
      <S.Inner>
        <S.Brand to="/" aria-label="Repage, ir para o início">
          <img src="/brands/logo-offwhiote.svg" alt="" />
          <span>Repage</span>
        </S.Brand>

        <S.DesktopNavigation aria-label="Navegação principal">
          {headerNavigation.map((item) => <Link key={item.href} to={item.href}>{item.label}</Link>)}
        </S.DesktopNavigation>

        <S.DesktopCta to={heroContent.primaryCta.href}>
          <span>{heroContent.primaryCta.label}</span>
          <ArrowRight size={16} aria-hidden="true" />
        </S.DesktopCta>

        <S.MenuButton
          type="button"
          ref={menuButtonRef}
          aria-expanded={menuOpen}
          aria-controls="homepage-navigation"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
        >
          {menuOpen ? <X aria-hidden="true" size={21} /> : <Menu aria-hidden="true" size={21} />}
        </S.MenuButton>
      </S.Inner>

      <S.MenuStatus aria-live="polite">Menu {menuOpen ? 'aberto' : 'fechado'}</S.MenuStatus>

      {menuOpen && (
        <S.MobilePanel
          id="homepage-navigation"
          ref={mobilePanelRef}
        >
          <nav aria-label="Navegação móvel">
            {headerNavigation.map((item) => {
              const active = isNavigationItemActive(item.href);

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={active ? 'is-active' : undefined}
                  aria-current={active ? 'location' : undefined}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              );
            })}
            <S.MobileCta to={heroContent.primaryCta.href} onClick={closeMenu}>
              <span>{heroContent.primaryCta.label}</span>
              <ArrowRight size={17} aria-hidden="true" />
            </S.MobileCta>
          </nav>
        </S.MobilePanel>
      )}
    </S.Header>
  );
}
