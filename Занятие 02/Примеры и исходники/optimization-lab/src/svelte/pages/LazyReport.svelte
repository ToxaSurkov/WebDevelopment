<script>
  import publications from '../../publications.js';
  let perYear = [2024,2025,2026].map(year => ({year,count:publications.filter(p => p.year===year).length}));
</script>
<section class="demo good"><h2>Статистика каталога — отдельный JS chunk</h2>
  <p>Этот Svelte-компонент загружается через <code>import()</code> только при первом открытии вкладки.</p>
  <div class="stats">{#each perYear as item (item.year)}
    <div><strong>{item.year}</strong><div class="stat-value">{item.count}</div><small>публикации</small></div>
  {/each}</div>
  <p class="hint">Network → JS: при первом открытии вкладки появляется запрос нового chunk. После повторного открытия браузер использует уже загруженный модуль.</p>
</section>
