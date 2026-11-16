// Чистые функции — их можно тестировать без браузера и React.
export function filterPublications(records, { query = '', year = 'all', topic = 'all', sort = 'newest' } = {}) {
  const q = query.trim().toLocaleLowerCase('ru');
  const filtered = records.filter(item =>
    (!q || `${item.title} ${item.authors} ${item.abstract}`.toLocaleLowerCase('ru').includes(q)) &&
    (year === 'all' || String(item.year) === String(year)) &&
    (topic === 'all' || item.topic === topic)
  );
  const compareTitle = (a,b) => a.title.localeCompare(b.title,'ru');
  return [...filtered].sort((a,b) => sort === 'oldest' ? a.year-b.year || compareTitle(a,b)
    : sort === 'title' ? compareTitle(a,b)
    : b.year-a.year || compareTitle(a,b));
}
export function countByTopic(records) {
  const counts = new Map();
  for(const item of records) counts.set(item.topic,(counts.get(item.topic)??0)+1);
  return [...counts].map(([topic,count])=>({topic,count})).sort((a,b)=>b.count-a.count);
}
