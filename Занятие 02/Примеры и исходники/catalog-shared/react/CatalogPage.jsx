import publications from '../data/publications.json';
import { filterPublications, getFilterOptions } from '../catalog.js';
import SearchFilters from './SearchFilters.jsx';
import PublicationCard from './PublicationCard.jsx';
import ResultCount from './ResultCount.jsx';
import EmptyState from './EmptyState.jsx';

const options = getFilterOptions(publications);

export default function CatalogPage({ filters }) {
  const visible = filterPublications(publications, filters);

  return (
    <>
      <div className="heading">
        <div><h1>Публикации</h1><p>Синтетические записи для учебной демонстрации.</p></div>
        <div className="badge">{publications.length} записей</div>
      </div>
      <SearchFilters {...filters} {...options} />
      <div className="results-heading">
        <h2>Результаты</h2>
        <ResultCount count={visible.length} />
      </div>
      {visible.length > 0 ? (
        <div className="publication-grid">
          {visible.map(item => <PublicationCard key={item.id} item={item} />)}
        </div>
      ) : (
        <EmptyState onReset={filters.resetFilters} />
      )}
    </>
  );
}
