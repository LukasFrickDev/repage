import { Route, Routes } from 'react-router-dom';
import { CasePage } from '../pages/Case';
import { CookiesPage } from '../pages/Cookies';
import Home from '../pages/Home';
import { NotFoundPage } from '../pages/NotFound';
import { PortfolioPage } from '../pages/Portfolio';
import { PrivacyPage } from '../pages/Privacy';
import { PublicLayout } from './PublicLayout';

export function AppRoutes() {
  return (
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
  );
}
