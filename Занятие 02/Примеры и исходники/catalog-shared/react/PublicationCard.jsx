import { useState } from 'react';

export default function PublicationCard({ item }) {
  // Локальное состояние только этой карточки: развёрнуто ли описание.
  const [expanded, setExpanded] = useState(false);
  return (
    <article className="publication">
      <div className="pub-top"><span className="tag">{item.topic}</span><span className="year">{item.year}</span></div>
      <h3>{item.title}</h3>
      <p className="authors">{item.authors}</p>
      {expanded && <p className="abstract">{item.abstract}</p>}
      <div className="pub-bottom"><span>{item.id}</span><button className="text-btn" type="button" aria-expanded={expanded} onClick={() => setExpanded(previous => !previous)}>{expanded ? 'Скрыть описание' : 'Подробнее'}</button></div>
    </article>
  );
}
