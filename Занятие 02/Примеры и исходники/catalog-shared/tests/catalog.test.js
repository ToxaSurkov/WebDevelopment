import test from 'node:test';
import assert from 'node:assert/strict';
import records from '../data/publications.json' with { type: 'json' };
import { filterPublications, countByTopic } from '../catalog.js';

test('60 демонстрационных записей с уникальными идентификаторами',()=>{
 assert.equal(records.length,60);assert.equal(new Set(records.map(r=>r.id)).size,60);
});
test('фильтрация по теме и году',()=>{
 const r=filterPublications(records,{topic:'NLP',year:'2025'});
 assert.ok(r.every(x=>x.topic==='NLP' && x.year===2025));
});
test('нет исходных мутаций при сортировке',()=>{
 const before=records.map(x=>x.id).join(',');filterPublications(records,{sort:'oldest'});
 assert.equal(before,records.map(x=>x.id).join(','));
});
test('агрегирование по теме покрывает все записи',()=>{
 assert.equal(countByTopic(records).reduce((a,b)=>a+b.count,0),records.length);
});
