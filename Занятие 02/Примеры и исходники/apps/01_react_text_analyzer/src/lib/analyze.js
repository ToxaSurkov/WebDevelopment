// Чистая функция: не зависит от React или браузера.
export function analyzeText(input) {
  const text = String(input ?? '');
  const words = text.toLowerCase().match(/[\p{L}\p{N}]+(?:[-'][\p{L}\p{N}]+)*/gu) ?? [];
  const counts = new Map();
  for (const word of words) counts.set(word, (counts.get(word) ?? 0) + 1);
  const common = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ru'))
    .slice(0, 5)
    .map(([word, count]) => ({ word, count }));
  return {
    words: words.length,
    characters: [...text].length,
    sentences: (text.match(/[.!?]+/g) ?? []).length,
    unique: counts.size,
    common,
  };
}
