export default function TopWords({ items }) {
  return (
    <section className="panel">
      <h2>Наиболее частые слова</h2>
      {items.length === 0 ? <p className="empty">Введите текст и нажмите «Проанализировать».</p> : (
        <ol className="top-words">{items.map(({ word, count }) => (
          <li key={word}><span>{word}</span><b>{count}</b></li>
        ))}</ol>
      )}
    </section>
  );
}
