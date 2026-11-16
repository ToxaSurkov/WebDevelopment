import { createRoot } from 'react-dom/client';
import SiteLayout from './SiteLayout.jsx';
import Statistics from '../../catalog-shared/react/Statistics.jsx';
import publications from '../../catalog-shared/data/publications.json';
import '../../catalog-shared/styles.css';

createRoot(document.getElementById('root')).render(
  <SiteLayout current="stats">
    <h1>Общая статистика</h1>
    <Statistics records={publications} />
  </SiteLayout>
);
