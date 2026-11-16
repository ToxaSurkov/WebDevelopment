import { useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import publications from '../../publications.js';

function StatefulRow({ item }){
  const [checked,setChecked]=useState(false);
  return <label className="rowcheck"><input type="checkbox" checked={checked} onChange={e=>setChecked(e.target.checked)}/><span>{item.title}</span></label>;
}
function KeysExample({ useStableId }){
  const [descending,setDescending]=useState(false);
  const selected=publications.slice(0,5).slice().sort((a,b)=>descending?b.id.localeCompare(a.id):a.id.localeCompare(b.id));
  return <><button onClick={()=>setDescending(x=>!x)}>Сменить порядок</button><p className="hint">Отметьте первую строку и измените сортировку.</p>{selected.map((p,i)=><StatefulRow key={useStableId?p.id:i} item={p}/>)}</>;
}
const lots=Array.from({length:2700},(_,i)=>({...publications[i%publications.length],id:`row-${i}`,title:`${publications[i%publications.length].title} — запись ${i+1}`}));
function VirtualList(){
 const parentRef=useRef(null);
 const v=useVirtualizer({count:lots.length,getScrollElement:()=>parentRef.current,estimateSize:()=>45,overscan:6});
 return <><p className="hint">Всего 2700 записей · в DOM только видимые строки и небольшой запас (overscan).</p><div ref={parentRef} className="scroll-list"><div style={{height:`${v.getTotalSize()}px`,width:'100%',position:'relative'}}>{v.getVirtualItems().map(row=><div className="virtual-row" key={lots[row.index].id} style={{position:'absolute',top:0,left:0,width:'100%',height:row.size,transform:`translateY(${row.start}px)`}}>{lots[row.index].title}</div>)}</div></div><p className="hint">Создано строк в DOM: {v.getVirtualItems().length}</p></>;
}
function AllRows(){return <><p className="hint">Все 2700 элементов сразу: прокрутка и инспектор DOM могут замедлиться.</p><div className="scroll-list">{lots.map(p=><div className="virtual-row" key={p.id}>{p.title}</div>)}</div></>}
export default function Lists(){const [part,setPart]=useState('keys');const [virtual,setVirtual]=useState(true);return <section><div className="controls"><button onClick={()=>setPart('keys')} className={part==='keys'?'active':''}>Стабильные key</button><button onClick={()=>setPart('virtual')} className={part==='virtual'?'active':''}>Виртуализация</button></div>{part==='keys'?<><p>Индекс в key при сортировке может привязать локальный checkbox-state к неправильной публикации.</p><div className="twocol"><article className="demo bad"><h3>Плохо: key = index</h3><KeysExample useStableId={false}/></article><article className="demo good"><h3>Хорошо: key = publication.id</h3><KeysExample useStableId/></article></div></>:<><p>Сравните количество реальных DOM-элементов. Виртуализация полезна для очень длинных списков, когда измерения показывают проблему.</p><div className="controls"><button onClick={()=>setVirtual(true)} className={virtual?'active':''}>Виртуализация</button><button onClick={()=>setVirtual(false)} className={!virtual?'active':''}>Все строки в DOM</button></div>{virtual?<VirtualList/>:<AllRows/>}</>}</section>}
