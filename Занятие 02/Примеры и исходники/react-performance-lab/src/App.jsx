import { lazy, Profiler, Suspense, useState } from 'react';
import StatePlacement from './demos/StatePlacement.jsx';
import DerivedState from './demos/DerivedState.jsx';
import MemoContext from './demos/MemoContext.jsx';
import Lists from './demos/Lists.jsx';
import Network from './demos/Network.jsx';

// Не загружается до первой попытки открыть вкладку статистики.
const LazyReport = lazy(()=>import('./pages/LazyReport.jsx'));
const tabs=[['placement','Где хранить state'],['derived','Лишний state'],['memo','memo и Context'],['lists','Списки и key'],['network','Сеть'],['report','Lazy: статистика']];
const pages={placement:StatePlacement,derived:DerivedState,memo:MemoContext,lists:Lists,network:Network};

export default function App(){
 const [tab,setTab]=useState('placement');
 const [lastDuration,setLastDuration]=useState(null);
 const onRender=(id,phase,actualDuration)=>{
   // НЕ вызывать setState здесь: это привело бы к циклу обновлений.
   console.log(`[React Profiler] ${id} ${phase}: ${actualDuration.toFixed(1)} ms`);
 };
 const Current=pages[tab];
 return <main className="page">
   <header className="site-header"><div className="eyebrow">Занятие 02 · React Performance Lab</div><h1>Как проектировать и ускорять React</h1><p>Один каталог научных публикаций, несколько сравнений правильного и неправильного кода.</p></header>
   <nav className="tabs" aria-label="Демонстрации">{tabs.map(([id,name])=><button key={id} onClick={()=>setTab(id)} className={tab===id?'active':''}>{name}</button>)}</nav>
   <Profiler id={tab} onRender={onRender}>
     {tab==='report'?<Suspense fallback={<p className="demo">Загружаем отдельный JS-модуль…</p>}><LazyReport/></Suspense>:<Current/>}
   </Profiler>
   <footer>Смотрите исходники в <code>src/demos/</code>, вкладки React Profiler и Chrome Network/Performance. В production сравнивайте <code>npm run build</code> + <code>npm run preview</code>.</footer>
 </main>;
}
