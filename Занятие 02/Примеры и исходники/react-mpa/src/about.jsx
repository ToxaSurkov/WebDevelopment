import { createRoot } from 'react-dom/client';
import SiteLayout from './SiteLayout.jsx';
import AboutPage from '../../catalog-shared/react/AboutPage.jsx';
import '../../catalog-shared/styles.css';

createRoot(document.getElementById('root')).render(
  <SiteLayout current="about"><AboutPage /></SiteLayout>
);
