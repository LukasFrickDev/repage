import { Link } from 'react-router-dom';
import { footerNavigation, legalNavigation, siteFooterContent } from '../../content/repageContent';
import { getWhatsAppUrl, siteConfig } from '../../config/site';
import { useConsent } from '../../features/consent/useConsent';
import { ANALYTICS_EVENT_NAMES, trackEvent } from '../../services/analytics';
import * as S from './styles';

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.75" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M20 11.5a8.5 8.5 0 0 1-12.6 7.4L4 20l1.1-3.2A8.5 8.5 0 1 1 20 11.5Z" />
      <path d="M8.8 8.4 10.4 11l-1.2 1.2a7.1 7.1 0 0 0 2.6 2.6l1.2-1.2 2.6 1.6" />
    </svg>
  );
}

export function SiteFooter() {
  const { openPreferences } = useConsent();

  return (
    <S.Footer data-home-section="footer">
      <S.Container>
        <S.MainBand>
          <S.BrandBlock>
            <S.Brand to="/" aria-label="Repage, ir para a página inicial">
              <img src="/brands/logo-offwhiote.svg" alt="" />
              <span>{siteConfig.brand.name}</span>
            </S.Brand>
            <S.BrandDescription>{siteFooterContent.description}</S.BrandDescription>
          </S.BrandBlock>

          <S.FooterGroup>
            <S.GroupTitle>Navegação</S.GroupTitle>
            <S.FooterLinks as="nav" aria-label="Navegação do rodapé">
              {footerNavigation.map((item) => <Link key={item.href} to={item.href}>{item.label}</Link>)}
            </S.FooterLinks>
          </S.FooterGroup>

          <S.FooterGroup>
            <S.GroupTitle>Políticas</S.GroupTitle>
            <S.FooterLinks>
              {legalNavigation.map((item) => <Link key={item.href} to={item.href}>{item.label}</Link>)}
              <S.PreferencesButton type="button" onClick={openPreferences}>Preferências de cookies</S.PreferencesButton>
            </S.FooterLinks>
          </S.FooterGroup>

          <S.FooterGroup>
            <S.GroupTitle>Contato</S.GroupTitle>
            <S.ContactLinks>
              <S.ContactEmail>
                {siteConfig.publicContacts.email}
              </S.ContactEmail>
              <S.ContactActions>
                <S.ContactAction
                  href={"mailto:" + siteConfig.publicContacts.email}
                  aria-label="Enviar e-mail para a Repage"
                >
                  <MailIcon />
                </S.ContactAction>
                <S.ContactAction
                  href={siteConfig.publicContacts.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Abrir Instagram da Repage"
                >
                  <InstagramIcon />
                </S.ContactAction>
                <S.ContactAction
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Falar com a Repage pelo WhatsApp"
                  onClick={() => trackEvent(ANALYTICS_EVENT_NAMES.whatsappClick)}
                >
                  <WhatsAppIcon />
                </S.ContactAction>
              </S.ContactActions>
            </S.ContactLinks>
          </S.FooterGroup>
        </S.MainBand>

        <S.BottomBand>
          <p>{siteFooterContent.signature}</p>
          <small>{siteFooterContent.copyright}</small>
        </S.BottomBand>
      </S.Container>
    </S.Footer>
  );
}
