import React from 'react';
import { createRoot } from 'react-dom/client';
import SiteLayout from './SiteLayout.jsx';
import AboutPage from './pages/AboutPage.jsx';
import './styles.css';
createRoot(document.getElementById('root')).render(
   <React.StrictMode><SiteLayout current="/about.html"><AboutPage/></SiteLayout></React.StrictMode>
);
