import { Link } from 'react-router-dom';
import { footerNavigation, legalNavigation, siteFooterContent } from '../../content/repageContent';
import { siteConfig } from '../../config/site';
import * as S from './styles';

export function SiteFooter() {
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

          <S.Navigation aria-label="Navegação do rodapé">
            {footerNavigation.map((item) => <Link key={item.href} to={item.href}>{item.label}</Link>)}
            {legalNavigation.map((item) => <Link key={item.href} to={item.href}>{item.label}</Link>)}
          </S.Navigation>
        </S.MainBand>

        <S.BottomBand>
          <p>{siteFooterContent.signature}</p>
          <small>{siteFooterContent.copyright}</small>
        </S.BottomBand>
      </S.Container>
    </S.Footer>
  );
}
