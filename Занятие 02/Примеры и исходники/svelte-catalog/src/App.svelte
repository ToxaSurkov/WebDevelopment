<script>
  import publications from './publications.json';
  import PublicationCard from './components/PublicationCard.svelte';
  import ResultCount from './components/ResultCount.svelte';
  import SearchFilters from './components/SearchFilters.svelte';
  import EmptyState from './components/EmptyState.svelte';

  let query = $state('');
  let year = $state('all');
  let visible = $derived(publications.filter((item) =>
    (item.title.toLowerCase().includes(query.trim().toLowerCase()) ||
      item.topic.toLowerCase().includes(query.trim().toLowerCase())) &&
    (year === 'all' || String(item.year) === year)
  ));
  function resetFilters() { query = ''; year = 'all'; }
</script>

<div class="page">
  <header class="hero">
    <div class="eyebrow">RESEARCH ATLAS · FRONTEND LAB</div>
    <h1>Каталог исследований</h1>
    <p>Одна задача — две реализации. Версия на Svelte 5: шаблоны, $state и $derived.</p>
  </header>
  <main>
    <SearchFilters bind:query bind:year onReset={resetFilters} />
    <div class="result-line"><ResultCount count={visible.length} /><span>Данные находятся в браузере, backend не используется</span></div>
    {#if visible.length > 0}
      <section class="grid" aria-label="Найденные публикации">
        {#each visible as item (item.id)}
          <PublicationCard publication={item} />
        {/each}
      </section>
    {:else}
      <EmptyState onReset={resetFilters} />
    {/if}
  </main>
  <footer>Учебный пример · Svelte 5 + Vite · Лекция 02</footer>
</div>
