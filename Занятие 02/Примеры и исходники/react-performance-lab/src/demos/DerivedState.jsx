import { useState } from 'react';
import publications from '../publications.json';

function filterPubs(query, year) {
  return publications.filter(p => (p.title.toLowerCase().includes(query.toLowerCase()) || p.topic.toLowerCase().includes(query.toLowerCase())) && (year === 'all' || String(p.year) === year));
}
function Controls({ query, setQuery, year, setYear }) {
  return <div className="controls"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Поиск: виз" aria-label="Поиск"/><select value={year} onChange={e=>setYear(e.target.value)} aria-label="Год"><option value="all">Все годы</option><option value="2024">2024</option><option value="2025">2025</option><option value="2026">2026</option></select></div>;
}
function BadDerived() {
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('all');
  // Ошибка: сохраняем в state копию данных, которые зависят от query/year.
  const [visible, setVisible] = useState(publications);
  return <><Controls query={query} setQuery={setQuery} year={year} setYear={setYear}/><strong>Показано: {visible.length}</strong><p className="hint">После ввода результат устарел: забыли синхронизировать visible.</p><button onClick={()=>setVisible(filterPubs(query, year))}>Обновить выдачу вручную</button></>;
}
function GoodDerived() {
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('all');
  const visible = filterPubs(query, year);
  const count = visible.length;
  return <><Controls query={query} setQuery={setQuery} year={year} setYear={setYear}/><strong>Показано: {count}</strong><p className="hint">Список и счётчик всегда вычисляются из текущих query и year.</p><ul className="results">{visible.slice(0, 3).map(p=><li key={p.id}>{p.title}</li>)}</ul></>;
}
export default function DerivedState(){return <section><p>Попробуйте «виз» и год 2025. В плохом варианте список устаревает; в хорошем фильтрация происходит при рендере и не требует отдельного setter.</p><div className="twocol"><article className="demo bad"><h3>Неудачно: redundant state</h3><BadDerived/></article><article className="demo good"><h3>Лучше: derived value</h3><GoodDerived/></article></div><p className="hint">Здесь все 9 публикаций уже загружены в браузер. Если фильтрацию делает backend, результаты fetch — это внешние данные, которые действительно нужно хранить.</p></section>}
