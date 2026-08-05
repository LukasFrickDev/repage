import { Outlet, useLocation } from 'react-router-dom';
import { HomeHeader } from '../../components/HomeHeader';
import { SiteFooter } from '../../components/SiteFooter';
import GlobalStyles from '../../styles/globalStyles';
import { NavigationManager } from '../NavigationManager';
import * as S from './styles';

export function PublicLayout() {
  const location = useLocation();

  return (
    <>
      <GlobalStyles />
      <S.SkipLink to={`${location.pathname}#main-content`}>Pular para o conteúdo principal</S.SkipLink>
      <HomeHeader />
      <S.Main id="main-content" tabIndex={-1}>
        <Outlet />
      </S.Main>
      <SiteFooter />
      <NavigationManager />
    </>
  );
}
