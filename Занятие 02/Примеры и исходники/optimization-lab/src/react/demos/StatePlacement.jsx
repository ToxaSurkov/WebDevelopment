import { useRef, useState } from 'react';
import publications from '../../publications.js';

function BrandHeader({ label }) {
  const renders = useRef(0);
  renders.current += 1;
  return <div className="header-demo"><strong>Шапка каталога</strong><small>{label} · выполнений компонента: {renders.current}</small></div>;
}
function Search({ query, onQueryChange }) {
  const visible = publications.filter(p => p.title.toLowerCase().includes(query.toLowerCase()));
  return <div className="demo-search"><input aria-label="Поиск публикаций" value={query} onChange={e => onQueryChange(e.target.value)} placeholder="Поиск (попробуйте «виз»)"/><small>Найдено: {visible.length}</small></div>;
}
function BadApp() {
  // Неудачно: состояние только для поиска поднято выше независимой шапки.
  const [query, setQuery] = useState('');
  return <><BrandHeader label="Плохой вариант"/><Search query={query} onQueryChange={setQuery}/></>;
}
function SearchPanel() {
  // Хорошо: состояние внутри ближайшего общего родителя поиска и результата.
  const [query, setQuery] = useState('');
  return <Search query={query} onQueryChange={setQuery}/>;
}
function GoodApp() {
  return <><BrandHeader label="Хороший вариант"/><SearchPanel/></>;
}
export default function StatePlacement() {
  return <section><p>Введите одинаковый запрос в двух колонках. В левом примере перерендеривается и независимая шапка, в правом — нет. Посмотрите Profiler.</p><div className="twocol"><article className="demo bad"><h3>Неудачно: state слишком высоко</h3><BadApp/></article><article className="demo good"><h3>Лучше: state рядом с потребителями</h3><GoodApp/></article></div><p className="hint">Правило: размещайте state у ближайшего общего родителя компонентов, которым это значение действительно нужно. Не нужно искусственно опускать общий фильтр ниже списка результатов.</p></section>;
}
