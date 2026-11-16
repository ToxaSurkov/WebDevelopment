<script>
  import publications from '../publications.json';
  import LocalSearch from './LocalSearch.svelte';
  // ПЛОХО: два независимых поисковых виджета используют один общий input-state.
  let globalQuery = $state('');
  let matches = $derived(publications.filter(p => p.title.toLowerCase().includes(globalQuery.trim().toLowerCase())));
</script>
<section>
  <p>Представим два независимых поисковых виджета — в каталоге и в боковой панели.
  Печатайте в любом поле. Если они должны работать независимо, им не нужен общий state.</p>
  <div class="twocol">
    <article class="demo bad">
      <h3>Неудачно: преждевременно общий state</h3>
      <div class="search-unit"><label>Каталог<input bind:value={globalQuery} placeholder="Поиск: виз" /></label><small>Найдено: {matches.length}</small></div>
      <div class="search-unit"><label>Боковая панель<input bind:value={globalQuery} placeholder="Независимый поиск" /></label><small>Запрос тоже меняется: «{globalQuery || '—'}»</small></div>
    </article>
    <article class="demo good">
      <h3>Лучше: каждому виджету свой state</h3>
      <LocalSearch label="Каталог" />
      <LocalSearch label="Боковая панель" />
    </article>
  </div>
  <p class="hint">Svelte: <code>let query = $state('')</code> можно объявлять прямо в нужном компоненте.
  React: похожая рекомендация — держать <code>useState</code> у ближайшего владельца.
  Если фильтры действительно общие — поднимайте state к общему родителю.</p>
</section>
