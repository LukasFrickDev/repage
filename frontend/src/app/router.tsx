import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import { NotFoundPage } from '../pages/NotFound';
import { PublicLayout } from './PublicLayout';

const CasePage = lazy(() => import('../pages/Case').then(({ CasePage }) => ({ default: CasePage })));
const CookiesPage = lazy(() => import('../pages/Cookies').then(({ CookiesPage }) => ({ default: CookiesPage })));
const PortfolioPage = lazy(() => import('../pages/Portfolio').then(({ PortfolioPage }) => ({ default: PortfolioPage })));
const PrivacyPage = lazy(() => import('../pages/Privacy').then(({ PrivacyPage }) => ({ default: PrivacyPage })));

export function AppRoutes() {
  return (
    <Suspense fallback={<main><h1>Carregando página…</h1></main>}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="portfolio/:slug" element={<CasePage />} />
          <Route path="privacidade" element={<PrivacyPage />} />
          <Route path="cookies" element={<CookiesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
