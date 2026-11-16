import { useMemo, useState } from 'react';
import publications from './data/publications.json';
import SearchFilters from './components/SearchFilters.jsx';
import PublicationCard from './components/PublicationCard.jsx';
import Statistics from './components/Statistics.jsx';
import { filterPublications } from './lib/catalog.js';

const years = [...new Set(publications.map(item => item.year))].sort((a,b) => b-a);
const topics = [...new Set(publications.map(item => item.topic))].sort((a,b) => a.localeCompare(b,'ru'));

export default function App() {
  // Несколько частей интерфейса используют общее состояние App.
  const [view, setView] = useState('catalog');
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('all');
  const [topic, setTopic] = useState('all');
  const [sort, setSort] = useState('newest');

  // Производный список: НЕ храним его как отдельное state.
  const visible = useMemo(() => filterPublications(publications, { query, year, topic, sort }), [query, year, topic, sort]);
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">P</span><div><strong>Учебный каталог</strong><small>Frontend без собственного backend</small></div></div>
        <nav aria-label="Разделы приложения"><button className={view==='catalog'?'nav active':'nav'} onClick={()=>setView('catalog')}>Каталог</button><button className={view==='stats'?'nav active':'nav'} onClick={()=>setView('stats')}>Статистика</button></nav>
      </header>
      <main className="main-content">
        <div className="heading"><div><h1>{view==='catalog'?'Публикации':'Общая статистика'}</h1><p>Синтетические демонстрационные записи. Реальными научными публикациями не являются.</p></div><div className="badge">{publications.length} записей</div></div>
        {view === 'catalog' ? <>
          <SearchFilters query={query} onQueryChange={setQuery} year={year} onYearChange={setYear} topic={topic} onTopicChange={setTopic} sort={sort} onSortChange={setSort} years={years} topics={topics}/>
          <div className="results-heading"><h2>Результаты</h2><span>Найдено: <b>{visible.length}</b></span></div>
          {visible.length ? <div className="publication-grid">{visible.map(item=><PublicationCard key={item.id} item={item}/>)}</div> : <div className="empty-result">Ничего не найдено. Попробуйте изменить условия поиска.</div>}
        </> : <Statistics records={publications}/>}
      </main>
      <footer>Учебное приложение на React • данные из src/data/publications.json • без API-запросов</footer>
    </div>
  );
}
