export default function EmptyState({ onReset }) {
  return (
    <div className="empty-result">
      <div>Ничего не найдено. Попробуйте изменить условия поиска.</div>
      <button className="reset-filters" type="button" onClick={onReset}>
        Показать все публикации
      </button>
    </div>
  );
}
