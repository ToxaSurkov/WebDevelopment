export default function ResultCount({ count }) {
  return <p className="results" role="status">Найдено публикаций: <strong>{count}</strong></p>;
}
