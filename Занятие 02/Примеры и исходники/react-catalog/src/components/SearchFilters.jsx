export default function SearchFilters({ query, year, onQueryChange, onYearChange, onReset }) {
  return (
    <section className="toolbar" aria-label="Фильтры каталога">
      <label className="field">Поиск по названию или теме
        <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Например, визуализация" />
      </label>
      <label className="field">Год публикации
        <select value={year} onChange={(event) => onYearChange(event.target.value)}>
          <option value="all">Все годы</option><option value="2026">2026</option>
          <option value="2025">2025</option><option value="2024">2024</option>
        </select>
      </label>
      <button className="reset" type="button" onClick={onReset}>Сбросить</button>
    </section>
  );
}
