import { useState } from 'react';
import { NavLink, Routes, Route } from 'react-router';
import CatalogPage from './pages/CatalogPage.jsx';
import StatsPage from './pages/StatsPage.jsx';
import AboutPage from './pages/AboutPage.jsx';

export default function App() {
  // State хранится в App, чтобы сохраняться при смене экранов SPA.
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('all');
  const resetFilters = () => { setQuery(''); setYear('all'); };
  return <div className="page">
    <nav className="site-nav" aria-label="Разделы сайта">
      <div className="site-nav-inner"><div className="brand">Research Atlas</div>
        <div className="nav-links">
          <NavLink to="/" end>Каталог</NavLink>
          <NavLink to="/stats">Статистика</NavLink>
          <NavLink to="/about">О проекте</NavLink>
        </div>
      </div>
    </nav>
    <header className="hero"><div className="eyebrow">REACT SPA · ОДИН HTML-ДОКУМЕНТ</div>
      <h1>Каталог исследований</h1>
      <p>Три экрана, три адреса URL, но переходы выполняет React Router — без загрузки нового HTML.</p>
      <span className="hero-tag">SPA: / · /stats · /about</span>
    </header>
    <Routes>
      <Route path="/" element={<CatalogPage query={query} year={year}
        onQueryChange={setQuery} onYearChange={setYear} onReset={resetFilters}/>} />
      <Route path="/stats" element={<StatsPage/>} />
      <Route path="/about" element={<AboutPage/>} />
    </Routes>
    <footer>Лекция 02 · React + React Router · SPA</footer>
  </div>;
}
