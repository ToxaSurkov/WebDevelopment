import { useMemo, useState } from 'react';

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
export default function MemoCalculation() {
  const [clicks, setClicks] = useState(0);
  const [threshold, setThreshold] = useState(600);
  const plainResult = expensiveSearch(threshold);
  const memoResult = useMemo(() => expensiveSearch(threshold), [threshold]);

  return (
    <section className="experiment">
      <h2>Повторные вычисления и useMemo</h2>
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
