// Компонент: одни и те же правила разметки для нескольких показателей.
export default function Metric({ title, value }) {
  return <div className="metric"><span>{title}</span><strong>{value}</strong></div>;
}
