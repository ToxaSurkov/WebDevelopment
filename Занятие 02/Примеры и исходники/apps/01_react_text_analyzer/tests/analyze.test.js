import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeText } from '../src/lib/analyze.js';

test('анализирует учебный пример', () => {
 const r=analyzeText('Кот и пёс. Кот спит!');
 assert.equal(r.words,5); assert.equal(r.unique,4); assert.equal(r.common[0].word,'кот');
});
test('обрабатывает пустой текст', () => {
 const r=analyzeText(''); assert.equal(r.words,0); assert.equal(r.characters,0);
});
