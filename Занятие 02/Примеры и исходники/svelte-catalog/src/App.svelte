<script>
  import publications from '../../catalog-shared/data/publications.json';
  import { defaultFilters, filterPublications, getFilterOptions } from '../../catalog-shared/catalog.js';
  import PublicationCard from './components/PublicationCard.svelte';
  import SearchFilters from './components/SearchFilters.svelte';
  import Statistics from './components/Statistics.svelte';

  const { years, topics } = getFilterOptions(publications);
  const pages = [
    { id: 'catalog', title: 'Каталог' },
    { id: 'stats', title: 'Статистика' },
    { id: 'about', title: 'О проекте' },
  ];
  let page = $state('catalog');
  let query = $state(defaultFilters.query);
  let year = $state(defaultFilters.year);
  let topic = $state(defaultFilters.topic);
  let sort = $state(defaultFilters.sort);
  let visible = $derived(filterPublications(publications, { query, year, topic, sort }));

  function resetFilters() {
    ({ query, year, topic, sort } = defaultFilters);
  }
</script>

<div class="app-shell">
  <header class="topbar">
    <div class="brand">
      <span class="brand-mark" aria-hidden="true">P</span>
      <div><strong>Учебный каталог</strong><small>Svelte 5</small></div>
    </div>
    <nav aria-label="Разделы каталога">
      {#each pages as { id, title } (id)}
        <button type="button" class="nav" class:active={page === id} aria-pressed={page === id}
          onclick={() => page = id}>{title}</button>
      {/each}
    </nav>
  </header>
  <main class="main-content">
    {#if page === 'catalog'}
      <div class="heading">
        <div><h1>Публикации</h1><p>Синтетические записи для учебной демонстрации.</p></div>
        <div class="badge">{publications.length} записей</div>
      </div>
      <SearchFilters bind:query bind:year bind:topic bind:sort {years} {topics} {resetFilters} />
      <div class="results-heading">
        <h2>Результаты</h2>
        <span role="status">Найдено: <b>{visible.length}</b></span>
      </div>
      {#if visible.length > 0}
        <div class="publication-grid">
          {#each visible as item (item.id)}
            <PublicationCard {item} />
          {/each}
        </div>
      {:else}
        <div class="empty-result">
          <div>Ничего не найдено. Попробуйте изменить условия поиска.</div>
          <button class="reset-filters" type="button" onclick={resetFilters}>Показать все публикации</button>
        </div>
      {/if}
    {:else if page === 'stats'}
      <h1>Общая статистика</h1>
      <Statistics records={publications} />
    {:else}
      <h1>О проекте</h1>
      <p>Учебный каталог из 60 вымышленных публикаций. Поиск, фильтры и статистика работают в браузере.</p>
    {/if}
  </main>
  <footer>Курс по веб-разработке · Занятие 2</footer>
</div>
