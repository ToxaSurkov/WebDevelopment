import { createRoot } from 'react-dom/client';
import SiteLayout from './SiteLayout.jsx';
import CatalogPage from '../../catalog-shared/react/CatalogPage.jsx';
import { useCatalogFilters } from '../../catalog-shared/react/useCatalogFilters.js';
import '../../catalog-shared/styles.css';

function CatalogDocument() {
  // Каждая навигация MPA создаёт новый документ и новое состояние фильтров.
  const filters = useCatalogFilters();
  return <SiteLayout current="catalog"><CatalogPage filters={filters} /></SiteLayout>;
}

createRoot(document.getElementById('root')).render(<CatalogDocument />);
