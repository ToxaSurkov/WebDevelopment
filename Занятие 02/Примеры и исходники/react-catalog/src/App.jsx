import { useState } from 'react';
import publications from './publications.json';
import PublicationCard from './components/PublicationCard.jsx';
import ResultCount from './components/ResultCount.jsx';
import SearchFilters from './components/SearchFilters.jsx';
import EmptyState from './components/EmptyState.jsx';

export default function App() {
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('all');
  const visible = publications.filter((item) =>
    (item.title.toLowerCase().includes(query.trim().toLowerCase()) ||
      item.topic.toLowerCase().includes(query.trim().toLowerCase())) &&
    (year === 'all' || String(item.year) === year)
  );
  function resetFilters() { setQuery(''); setYear('all'); }

  return (
    <div className="page">
      <header className="hero">
        <div className="eyebrow">RESEARCH ATLAS · FRONTEND LAB</div>
        <h1>Каталог исследований</h1>
        <p>Одна задача — две реализации. Версия на React: JSX, useState и компоненты.</p>
      </header>
      <main>
        <SearchFilters query={query} year={year}
          onQueryChange={setQuery} onYearChange={setYear} onReset={resetFilters} />
        <div className="result-line"><ResultCount count={visible.length} /><span>Данные находятся в браузере, backend не используется</span></div>
        {visible.length > 0 ? (
          <section className="grid" aria-label="Найденные публикации">
            {visible.map((item) => <PublicationCard key={item.id} publication={item} />)}
          </section>
        ) : (
          <EmptyState onReset={resetFilters} />
        )}
      </main>
      <footer>Учебный пример · React + Vite · Лекция 02</footer>
    </div>
  );
}
