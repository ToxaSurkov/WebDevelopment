import { useState } from 'react';
import Metric from './components/Metric.jsx';
import TopWords from './components/TopWords.jsx';
import { analyzeText } from './lib/analyze.js';

const EXAMPLE = 'Кот и пёс. Кот спит!';

export default function App() {
  // State: текущий текст и текст последнего подтверждённого анализа.
  const [text, setText] = useState(EXAMPLE);
  const [submittedText, setSubmittedText] = useState(EXAMPLE);
  // Производные данные: их не нужно отдельно хранить в состоянии.
  const result = analyzeText(submittedText);

  return (
    <div className="page">
      <header className="site-header">
        <div className="logo">Текстоскоп <span>React</span></div>
        <p>Тот же смысл, что у HTML/JS-анализатора первого занятия, но интерфейс собран из компонентов.</p>
      </header>
      <main className="layout">
        <section className="panel">
          <h1>Анализ текста</h1>
          {/* value и onChange создают управляемое поле ввода. */}
          <label htmlFor="text-input">Исходный текст</label>
          <textarea id="text-input" rows="11" value={text} onChange={event => setText(event.target.value)} />
          <div className="actions">
            <button type="button" onClick={() => setSubmittedText(text)}>Проанализировать</button>
            <button className="secondary" type="button" onClick={() => { setText(''); setSubmittedText(''); }}>Очистить</button>
          </div>
          <p className="hint">Здесь нет fetch(), собственного backend или API: расчёт выполняется в браузере.</p>
        </section>
        <div className="right-side">
          <section className="panel">
            <h2>Статистика</h2>
            <div className="metrics">
              <Metric title="Слов" value={result.words} />
              <Metric title="Символов" value={result.characters} />
              <Metric title="Предложений*" value={result.sentences} />
              <Metric title="Уникальных слов" value={result.unique} />
            </div>
            <p className="hint">* Учебный подсчёт по знакам . ! ? без полноценного разбора языка.</p>
          </section>
          <TopWords items={result.common} />
        </div>
      </main>
    </div>
  );
}
