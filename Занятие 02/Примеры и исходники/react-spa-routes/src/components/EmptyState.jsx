export default function EmptyState({ onReset }) {
  return (
    <section className="empty">
      <h2>Ничего не найдено</h2>
      <p>Попробуйте другой запрос или вернитесь ко всем публикациям.</p>
      <button type="button" onClick={onReset}>Показать все публикации</button>
    </section>
  );
}
