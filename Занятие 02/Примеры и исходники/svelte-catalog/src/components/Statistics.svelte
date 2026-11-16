<script>
  import { countByTopic } from '../../../catalog-shared/catalog.js';
  let { records } = $props();
  let counts = $derived(countByTopic(records));
  let max = $derived(Math.max(1, ...counts.map(item => item.count)));
</script>

<section class="stats-panel">
  <h2>Статистика каталога</h2>
  <p class="muted">Эти показатели рассчитываются по всем записям.</p>
  <div class="stats-row">
    <div><span>Учебных записей</span><strong>{records.length}</strong></div>
    <div><span>Областей</span><strong>{counts.length}</strong></div>
  </div>
  <h3>Записи по областям</h3>
  {#each counts as { topic, count } (topic)}
    <div class="bar-row">
      <span>{topic}</span>
      <div class="bar-track"><div class="bar" style:width={(count / max * 100) + '%'}></div></div>
      <b>{count}</b>
    </div>
  {/each}
</section>
