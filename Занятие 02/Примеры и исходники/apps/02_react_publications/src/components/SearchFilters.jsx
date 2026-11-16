export default function SearchFilters({ query, onQueryChange, year, onYearChange, topic, onTopicChange, sort, onSortChange, years, topics }) {
  return (
    <section className="filters" aria-label="Фильтры каталога">
      <label className="field wide">Поиск по тексту
        <input value={query} onChange={event => onQueryChange(event.target.value)} placeholder="Например: визуализация" />
      </label>
      <label className="field">Год
        <select value={year} onChange={event => onYearChange(event.target.value)}>
          <option value="all">Все годы</option>{years.map(y=><option key={y} value={y}>{y}</option>)}
        </select>
      </label>
      <label className="field">Область
        <select value={topic} onChange={event => onTopicChange(event.target.value)}>
          <option value="all">Все области</option>{topics.map(t=><option key={t} value={t}>{t}</option>)}
        </select>
      </label>
      <label className="field">Сортировка
        <select value={sort} onChange={event => onSortChange(event.target.value)}>
          <option value="newest">Сначала новые</option><option value="oldest">Сначала старые</option><option value="title">По названию</option>
        </select>
      </label>
      {/* Во время практики студенты добавят сюда кнопку «Сбросить фильтры». */}
    </section>
  );
}
