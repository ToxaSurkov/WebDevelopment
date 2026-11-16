import { NavLink, Routes, Route } from 'react-router';
import CatalogLayout from '../../catalog-shared/react/CatalogLayout.jsx';
import CatalogPage from '../../catalog-shared/react/CatalogPage.jsx';
import Statistics from '../../catalog-shared/react/Statistics.jsx';
import AboutPage from '../../catalog-shared/react/AboutPage.jsx';
import { useCatalogFilters } from '../../catalog-shared/react/useCatalogFilters.js';
import publications from '../../catalog-shared/data/publications.json';

export default function App() {
  // Фильтры живут выше Routes, поэтому сохраняются при смене экранов SPA.
  const filters = useCatalogFilters();
  const linkClass = ({ isActive }) => isActive ? 'nav active' : 'nav';

  const navigation = (
    <>
      <NavLink to="/" end className={linkClass}>Каталог</NavLink>
      <NavLink to="/stats" className={linkClass}>Статистика</NavLink>
      <NavLink to="/about" className={linkClass}>О проекте</NavLink>
    </>
  );

  return (
    <CatalogLayout variant="React SPA · один HTML-документ" navigation={navigation}>
      <Routes>
        <Route path="/" element={<CatalogPage filters={filters} />} />
        <Route path="/stats" element={<><h1>Общая статистика</h1><Statistics records={publications} /></>} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<h1>Раздел не найден</h1>} />
      </Routes>
    </CatalogLayout>
  );
}
