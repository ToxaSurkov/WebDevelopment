import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import SiteLayout from './SiteLayout.jsx';
import CatalogPage from './pages/CatalogPage.jsx';
import './styles.css';

function CatalogDocument() {
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('all');
  const resetFilters = () => { setQuery(''); setYear('all'); };
  return <SiteLayout current="/">
    <CatalogPage query={query} year={year} onQueryChange={setQuery}
      onYearChange={setYear} onReset={resetFilters}/>
  </SiteLayout>;
}
createRoot(document.getElementById('root')).render(
  <React.StrictMode><CatalogDocument/></React.StrictMode>
);
