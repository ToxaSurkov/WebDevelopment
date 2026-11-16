import { countByTopic } from '../lib/catalog.js';
export default function Statistics({ records }) {
  const counts=countByTopic(records);
  const max=Math.max(1,...counts.map(item=>item.count));
  return <section className="stats-panel">
    <h2>Статистика каталога</h2>
    <p className="muted">Эти показатели рассчитываются из тех же данных, что и список карточек. Сервер не нужен.</p>
    <div className="stats-row"><div><span>Учебных записей</span><strong>{records.length}</strong></div><div><span>Областей</span><strong>{counts.length}</strong></div></div>
    <h3>Записи по областям</h3>
    {counts.map(({topic,count})=><div key={topic} className="bar-row"><span>{topic}</span><div className="bar-track"><div className="bar" style={{width:`${count/max*100}%`}}/></div><b>{count}</b></div>)}
  </section>;
}
