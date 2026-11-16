import { sortOptions } from '../catalog.js';

export default function SearchFilters({
  query, year, topic, sort, setQuery, setYear, setTopic, setSort, resetFilters, years, topics,
}) {
  return (
    <section className="filters" aria-label="Фильтры каталога">
      <label className="field">
        Поиск по тексту
        <input type="search" value={query} onChange={event => setQuery(event.target.value)}
          placeholder="Например: визуализация" />
      </label>
      <label className="field">
        Год
        <select value={year} onChange={event => setYear(event.target.value)}>
          <option value="all">Все годы</option>
          {years.map(value => <option key={value} value={value}>{value}</option>)}
        </select>
      </label>
      <label className="field">
        Область
        <select value={topic} onChange={event => setTopic(event.target.value)}>
          <option value="all">Все области</option>
          {topics.map(value => <option key={value} value={value}>{value}</option>)}
        </select>
      </label>
      <label className="field">
        Сортировка
        <select value={sort} onChange={event => setSort(event.target.value)}>
          {sortOptions.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <button className="reset-filters" type="button" onClick={resetFilters}>Сбросить фильтры</button>
    </section>
  );
}
