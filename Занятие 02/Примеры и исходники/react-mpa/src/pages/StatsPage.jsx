import publications from '../publications.json';
export default function StatsPage() {
   const years = [2024, 2025, 2026];
   return <main>
     <div className="stat-grid">
       <div className="stat-tile"><strong>{publications.length}</strong><span>Публикаций всего</span></div>
       {years.slice(1).map(year => <div key={year} className="stat-tile">
         <strong>{publications.filter(p => p.year === year).length}</strong>
         <span>Публикаций за {year} год</span>
       </div>)}
     </div>
     <p className="notice" style={{marginTop:22}}>Статистика вычисляется из того же файла <code>src/publications.json</code>.</p>
   </main>;
}
