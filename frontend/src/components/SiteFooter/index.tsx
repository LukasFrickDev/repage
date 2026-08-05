import { Link } from 'react-router-dom';
import { legalNavigation, navigation, siteFooterContent } from '../../content/repageContent';
import { siteConfig } from '../../config/site';
import * as S from './styles';

export function SiteFooter() {
  return (
    <S.Footer>
      <S.Container>
        <S.BrandBlock>
          <S.Brand to="/" aria-label="Repage, ir para a página inicial">
            <img src="/brands/logo-offwhiote.svg" alt="" />
            <span>{siteConfig.brand.name}</span>
          </S.Brand>
          <S.BrandDescription>{siteFooterContent.description}</S.BrandDescription>
        </S.BrandBlock>

        <S.Navigation aria-label="Navegação do rodapé">
          {navigation.map((item) => <Link key={item.href} to={item.href}>{item.label}</Link>)}
          {legalNavigation.map((item) => <Link key={item.href} to={item.href}>{item.label}</Link>)}
        </S.Navigation>

        <S.Meta>
          <p>{siteFooterContent.signature}</p>
          <small>{siteFooterContent.copyright}</small>
        </S.Meta>
      </S.Container>
    </S.Footer>
  );
}
