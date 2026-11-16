import React, { lazy, memo, Profiler, Suspense, useMemo, useRef, useState } from 'react';

// ВАЖНО: модуль НЕ импортирован в основном бандле; загрузится при открытии вкладки.
const LazyStatistics = lazy(() => import('./components/LazyStatistics.jsx'));

function Card({label}) {
  const times = useRef(0);
  times.current += 1;
  console.log(`[Card ${label}] render #${times.current}`);
  return <div className="metric"><span>{label}</span><strong>Рендеров: {times.current}</strong><small>Props не меняются при нажатии «+1»</small></div>;
}
const MemoCard = memo(Card);

function RenderExperiment() {
  const [count, setCount] = useState(0);
  const [mode, setMode] = useState('plain');
  return <section className="experiment"><h2>1. Лишние рендеры компонентов</h2>
    <p>Каждое изменение <code>count</code> обновляет родителя. Сравните дочернюю карточку без <code>memo</code> и с ним.</p>
    <div className="control"><button onClick={()=>setCount(v=>v+1)}>Увеличить счётчик: {count}</button><label>Карточка: <select value={mode} onChange={e=>setMode(e.target.value)}><option value="plain">обычная</option><option value="memo">React.memo</option></select></label></div>
    <Profiler id="render-card" onRender={(id,phase,duration)=>console.log(`[Profiler ${id}] ${phase}: ${duration.toFixed(2)} ms`)}>
      {mode==='plain'?<Card key="plain" label="Не мемоизирована" />:<MemoCard key="memo" label="Мемоизирована"/>}
    </Profiler>
    <p className="muted">При переключении режима карточка создаётся заново; сравнивайте счётчик рендеров после нескольких нажатий в одном режиме. Обратите внимание: рендер ≠ обновление DOM.</p>
  </section>;
}

// Намеренно увеличенный объём работы только для демонстрации, не модель оптимального алгоритма.
const NUMBERS = Array.from({ length: 180000 }, (_, index) => index % 999);
function expensiveSearch(threshold) {
  const started = performance.now();
  let matched = 0;
  let checksum = 0;
  for (const number of NUMBERS) {
    if (number >= threshold) matched++;
    // Искусственная нагрузка, чтобы измерение было заметно даже на быстром ПК.
    checksum += Math.sqrt(number + 1);
  }
  return { matched, checksum: Math.round(checksum), calculationTime: performance.now() - started };
}
function CalculationResult({ title, result }) {
  // Каждый новый расчёт возвращает новый объект. useMemo возвращает прежний объект из кэша.
  const [observed, setObserved] = useState({ result, calculations: 1 });
  if (observed.result !== result) {
    setObserved({ result, calculations: observed.calculations + 1 });
  }

  return (
    <section className="metric">
      <h3>{title}</h3>
      <strong>Расчётов: {observed.calculations}</strong>
      <span>Совпадений: {result.matched.toLocaleString('ru-RU')}</span>
      <small>Длительность последнего расчёта: {result.calculationTime.toFixed(2)} мс</small>
    </section>
  );
}
function CalculationExperiment() {
  const [clicks, setClicks] = useState(0);
  const [threshold, setThreshold] = useState(600);
  const plainResult = expensiveSearch(threshold);
  const memoResult = useMemo(() => expensiveSearch(threshold), [threshold]);

  return (
    <section className="experiment">
      <h2>2. Повторные вычисления и useMemo</h2>
      <p>
        Перебираем 180 000 сгенерированных чисел. <strong>Порог</strong> — минимальное значение, которое засчитывается.
        Совпадение — это число, для которого верно <code>число &gt;= порог</code>.
        Например, при пороге 600 из чисел 250, 600 и 750 подходят два.
      </p>
      <div className="control">
        <button type="button" onClick={() => setClicks(value => value + 1)}>
          Обновить экран · нажатий: {clicks}
        </button>
        <label>
          Порог
          <input type="range" min="100" max="900" step="100" value={threshold}
            onChange={event => setThreshold(Number(event.target.value))} />
          <b aria-hidden="true">{threshold}</b>
        </label>
      </div>
      <div className="calculation-results" aria-live="polite">
        <CalculationResult title="Обычный расчёт" result={plainResult} />
        <CalculationResult title="Расчёт с useMemo" result={memoResult} />
      </div>
      <ol className="calculation-steps">
        <li>Нажмите кнопку несколько раз. Она увеличивает число нажатий и вызывает рендер. «Расчётов» растёт слева, а справа React берёт результат из кэша.</li>
        <li>Измените порог. Обе колонки пересчитают число совпадений и прибавят по одному расчёту.</li>
      </ol>
      <p className="muted">Время относится к последнему выполненному расчёту. Даже если миллисекунды почти совпадают, по счётчику видно, сколько раз выполнялся перебор.</p>
    </section>
  );
}
function LazyExperiment() {
  const [open,setOpen]=useState(false);
  return <section className="experiment"><h2>3. Отложенная загрузка с React.lazy</h2><p>Код графиков не нужен пользователю при открытии каталога. Загрузим модуль только когда он запросит статистику.</p>
    <div className="control"><button onClick={()=>setOpen(v=>!v)}>{open?'Скрыть статистику':'Открыть статистику'}</button><span>Проверка: DevTools → Network</span></div>
    {open?<Suspense fallback={<p role="status">Загружаем код статистики…</p>}><LazyStatistics/></Suspense>:<div className="placeholder">Раздел пока закрыт. Прежде чем нажать, откройте Network и очистите список запросов.</div>}
  </section>;
}

export default function App(){const [tab,setTab]=useState('render');return <div className="shell">
  <header className="top"><span className="mark">⚡</span><div><strong>React · лаборатория оптимизации</strong><small>Три независимые демонстрации · без backend</small></div></header>
  <main><p className="eyebrow">Занятие 2</p><h1>Не ускоряйте вслепую</h1><p className="lead">Сначала наблюдаем проблему, затем меняем только нужный механизм. Используйте React DevTools Profiler и Console.</p>
    <div className="tabs" role="group" aria-label="Выберите демонстрацию">
      {[['render','Рендеры'],['calc','Вычисления'],['lazy','Загрузка кода']].map(([id,label])=><button key={id} aria-pressed={tab===id} onClick={()=>setTab(id)}>{label}</button>)}
    </div>
    {tab==='render'?<RenderExperiment/>:tab==='calc'?<CalculationExperiment/>:<LazyExperiment/>}
    <aside><strong>Ключевой принцип:</strong> лишний рендер ≠ всегда проблема. <code>React.memo</code> и <code>useMemo</code> полезны только при подходящих условиях; React Compiler может автоматически оптимизировать часть случаев, если отдельно подключён к сборке.</aside>
  </main>
  <footer>Источники: react.dev/learn/you-might-not-need-an-effect · react.dev/learn/react-compiler/introduction · react.dev/reference/react/lazy</footer>
</div>}
