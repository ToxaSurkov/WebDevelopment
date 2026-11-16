import publications from '../../publications.js';
// Этот файл станет отдельным JS-чанком после сборки (React.lazy + import()).
export default function LazyReport(){
 const perYear=[2024,2025,2026].map(year=>({year,count:publications.filter(p=>p.year===year).length}));
 return <section className="demo good"><h2>Статистика каталога</h2><p>Этот экран не входит в первоначальный JS-бандл главной страницы.</p><div className="stats">{perYear.map(item=><div key={item.year}><strong>{item.year}</strong><div className="stat-value">{item.count}</div><small>публикации</small></div>)}</div><p className="hint">Откройте DevTools → Network → JS: при первом переходе загружается отдельный chunk для LazyReport.jsx.</p></section>;
}
