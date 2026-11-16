import { useEffect, useRef, useState } from 'react';

export default function Network(){
 const [mode,setMode]=useState('bad');
 const [query,setQuery]=useState('');
 const [items,setItems]=useState([]);
 const [status,setStatus]=useState('Введите запрос, затем посмотрите Network → Fetch/XHR');
 const num=useRef(0);
 useEffect(()=>{
   const endpoint=`/api/publications?q=${encodeURIComponent(query)}&delay_ms=600`;
   if(mode==='bad'){
     // Плохо: каждый ввод — новый HTTP-запрос, старые ответы могут прийти поздно.
     const n=++num.current;
     fetch(endpoint).then(r=>r.json()).then(data=>{setItems(data);setStatus(`Запрос #${n} завершён`);}).catch(e=>setStatus(String(e)));
     return undefined;
   }
   // Хорошо: небольшой debounce + отмена устаревших запросов.
   const controller=new AbortController();
   const timer=setTimeout(async()=>{
     const n=++num.current;
     try{
       const response=await fetch(endpoint,{signal:controller.signal});
       if(!response.ok) throw Error(`HTTP ${response.status}`);
       const data=await response.json();
       setItems(data);setStatus(`Запрос #${n} завершён`);
     }catch(e){if(e.name!=='AbortError')setStatus(String(e));}
   },350);
   return ()=>{clearTimeout(timer);controller.abort();};
 },[query,mode]);
 return <section><p>Вводите «визуализация» по буквам, затем сравните число запросов в DevTools → Network → Fetch/XHR. Backend создаёт задержку 600 мс.</p><div className="controls"><button className={mode==='bad'?'active':''} onClick={()=>{setMode('bad');num.current=0;setStatus('Режим: каждый символ → fetch')}}>Без оптимизации</button><button className={mode==='good'?'active':''} onClick={()=>{setMode('good');num.current=0;setStatus('Режим: debounce + AbortController')}}>Debounce + Abort</button></div><input aria-label="Поиск по API" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Напишите: визуализация"/><div className="metric">{status} · совпадений: {items.length}</div><p className="hint">Отмена fetch прекращает ожидание в клиенте, но не обязательно останавливает уже начатую работу backend. Для запросов с побочными эффектами нужен дополнительный контроль.</p></section>;
}
