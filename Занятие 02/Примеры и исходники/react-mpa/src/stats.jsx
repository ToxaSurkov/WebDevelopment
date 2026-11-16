import React from 'react';
import { createRoot } from 'react-dom/client';
import SiteLayout from './SiteLayout.jsx';
import StatsPage from './pages/StatsPage.jsx';
import './styles.css';
createRoot(document.getElementById('root')).render(
   <React.StrictMode><SiteLayout current="/stats.html"><StatsPage/></SiteLayout></React.StrictMode>
);
