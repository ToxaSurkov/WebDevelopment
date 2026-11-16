import React from 'react';

const counts = [28, 47, 40, 68, 54, 79];
export default function LazyStatistics() {
  return <div className="lazy-panel"><h3>Статистика загружена отдельным модулем</h3>
    <p>Этот компонент был импортирован динамически, когда вы впервые открыли раздел.</p>
    <div className="bars" role="img" aria-label="Демонстрационные значения от 28 до 79">
      {counts.map((n, i)=><div className="bar-col" key={i}><div className="bar" style={{height:`${n}%`}}/><span>{n}</span></div>)}
    </div>
    <p className="muted">Откройте DevTools → Network и обновите страницу: модуль появится в запросах после первого открытия этого раздела. В production он выделяется в отдельный chunk.</p>
  </div>;
}
