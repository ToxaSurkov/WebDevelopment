import publications from '../publications.json';
import PublicationCard from '../components/PublicationCard.jsx';
import ResultCount from '../components/ResultCount.jsx';
import SearchFilters from '../components/SearchFilters.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function CatalogPage({ query, year, onQueryChange, onYearChange, onReset }) {
  const visible = publications.filter((item) =>
    (item.title.toLowerCase().includes(query.trim().toLowerCase()) ||
     item.topic.toLowerCase().includes(query.trim().toLowerCase())) &&
    (year === 'all' || String(item.year) === year)
  );
  return (
    <main>
      <p className="notice">Введите «виз», затем перейдите на «Статистика» и обратно.</p>
      <SearchFilters query={query} year={year}
        onQueryChange={onQueryChange} onYearChange={onYearChange} onReset={onReset} />
      <div className="result-line"><ResultCount count={visible.length}/><span>Фильтрация выполняется в браузере</span></div>
      {visible.length ?
        <section className="grid" aria-label="Найденные публикации">
          {visible.map((item) => <PublicationCard key={item.id} publication={item} />)}
        </section> : <EmptyState onReset={onReset} />}
    </main>
  );
}
