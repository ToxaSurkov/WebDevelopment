import { createContext, memo, useCallback, useContext, useMemo, useRef, useState } from 'react';
import publications from '../../publications.js';

function ExpensiveCard({ item, onSelect }) {
  const count = useRef(0);
  count.current += 1;
  // Искусственно замедляем рендер для учебного Profiler. Не делайте это в настоящем UI.
  let total = 0;
  for (let i=0;i<80000;i++) total += (i*7)%11;
  return <li><button onClick={()=>onSelect(item.title)}>{item.title}</button><small> рендеров: {count.current}</small><span hidden>{total}</span></li>;
}
const MemoCard = memo(ExpensiveCard);
function MemoComparison({ optimized }) {
  const [counter, setCounter] = useState(0);
  const [selected, setSelected] = useState('');
  const stableSelect = useCallback(title => setSelected(title), []);
  const Card = optimized ? MemoCard : ExpensiveCard;
  return <><button onClick={()=>setCounter(c=>c+1)}>Посторонний счётчик: {counter}</button><small>Нажмите несколько раз</small><ul className="results">{publications.slice(0,4).map(p=><Card key={p.id} item={p} onSelect={stableSelect}/>)}</ul><p className="hint">Выбрано: {selected || '—'}</p></>;
}
const AllContext = createContext(null);
const ThemeContext = createContext(null);
const UserContext = createContext(null);
const ThemeReaderBad = memo(function ThemeReaderBad(){
  const renders = useRef(0); renders.current += 1;
  const {theme} = useContext(AllContext);
  return <div className="metric">Компонент темы: {theme} · рендеров: {renders.current}</div>;
});
const ThemeReaderGood = memo(function ThemeReaderGood(){
  const renders = useRef(0); renders.current += 1;
  const theme = useContext(ThemeContext);
  return <div className="metric">Компонент темы: {theme} · рендеров: {renders.current}</div>;
});
function SingleContext(){
  const [user,setUser]=useState('Анна');
  const [theme]=useState('светлая');
  return <AllContext.Provider value={{theme,user}}><ThemeReaderBad/><button onClick={()=>setUser(u=>u==='Анна'?'Игорь':'Анна')}>Изменить пользователя: {user}</button></AllContext.Provider>;
}
function SplitContext(){
  const [user,setUser]=useState('Анна');
  const [theme]=useState('светлая');
  return <ThemeContext.Provider value={theme}><UserContext.Provider value={user}><ThemeReaderGood/><button onClick={()=>setUser(u=>u==='Анна'?'Игорь':'Анна')}>Изменить пользователя: {user}</button></UserContext.Provider></ThemeContext.Provider>;
}
function expensiveFilter(query) {
  let total = 0;
  for (let i = 0; i < 4000000; i++) total += (i * 3) % 17;
  return { total, matched: publications.filter(p => p.title.toLowerCase().includes(query.toLowerCase())) };
}
function MemoCalculationBad(){
  const [counter, setCounter] = useState(0);
  const [query, setQuery] = useState('виз');
  // Дорогое вычисление повторяется при каждом изменении счётчика.
  const result = expensiveFilter(query);
  return <><div className="controls"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Виз" aria-label="Поиск"/><button onClick={()=>setCounter(n=>n+1)}>Посторонний счётчик: {counter}</button></div><div className="metric">Найдено: {result.matched.length}</div></>;
}
function MemoCalculationGood(){
  const [counter, setCounter] = useState(0);
  const [query, setQuery] = useState('виз');
  // Вычисление повторяется только при изменении query.
  const result = useMemo(() => expensiveFilter(query), [query]);
  return <><div className="controls"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Виз" aria-label="Поиск"/><button onClick={()=>setCounter(n=>n+1)}>Посторонний счётчик: {counter}</button></div><div className="metric">Найдено: {result.matched.length}</div></>;
}
export default function MemoContext(){
  const [part,setPart]=useState('memo');
  return <section><div className="controls"><button onClick={()=>setPart('memo')} className={part==='memo'?'active':''}>React.memo</button><button onClick={()=>setPart('memoValue')} className={part==='memoValue'?'active':''}>useMemo</button><button onClick={()=>setPart('context')} className={part==='context'?'active':''}>Context API</button></div>{part==='memo'?<><p>Меняем несвязанное состояние родителя: во втором варианте memo пропускает рендер тяжёлых карточек с неизменными props. useCallback сохраняет ссылку обработчика.</p><div className="twocol"><article className="demo bad"><h3>Без memo</h3><MemoComparison optimized={false}/></article><article className="demo good"><h3>memo + стабильная функция</h3><MemoComparison optimized={true}/></article></div></>:part==='memoValue'?<><p>Сравните тяжёлый расчёт при изменении несвязанного счётчика. useMemo повторяет вычисление только при изменении query. Это искусственно дорогой пример — для небольшого каталога сначала измерьте длительность расчёта.</p><div className="twocol"><article className="demo bad"><h3>Без useMemo</h3><MemoCalculationBad/></article><article className="demo good"><h3>useMemo + [query]</h3><MemoCalculationGood/></article></div></>:<><p>Единый Context смешивает независимые значения. Изменяем пользователя и наблюдаем подписчика темы.</p><div className="twocol"><article className="demo bad"><h3>Один Context для theme + user</h3><SingleContext/></article><article className="demo good"><h3>Отдельные контексты</h3><SplitContext/></article></div><p className="hint">Разделение Context устраняет лишние обновления подписок; React.memo у ThemeReaderBad/Good отдельно защищает от рендеров из-за родителя. Это два разных механизма.</p></>}</section>
}
