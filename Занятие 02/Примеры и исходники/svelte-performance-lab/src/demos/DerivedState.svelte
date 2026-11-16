<script>
  import publications from '../publications.json';
  function filterPubs(query, year) {
    const q = query.trim().toLowerCase();
    return publications.filter(p =>
      (p.title.toLowerCase().includes(q) || p.topic.toLowerCase().includes(q)) &&
      (year === 'all' || String(p.year) === year)
    );
  }
  let badQuery = $state('');
  let badYear = $state('all');
  // ПЛОХО: отдельная копия результата. При смене года забыли синхронизацию.
  let badVisible = $state(publications);
  function updateBadQuery(value) { badQuery = value; badVisible = filterPubs(badQuery, badYear); }

  let query = $state('');
  let year = $state('all');
  // ХОРОШО: производное значение. Нет отдельного источника истины.
  let visible = $derived(filterPubs(query, year));
  let count = $derived(visible.length);
</script>
<section>
  <p>Выберите 2025 год, затем напишите «виз». Слева забытая синхронизация создаёт ошибку;
  справа список и счётчик автоматически следуют за <code>query</code> и <code>year</code>.</p>
  <div class="twocol">
    <article class="demo bad">
      <h3>Неудачно: дублированное состояние</h3>
      <div class="controls"><input aria-label="Плохой поиск" value={badQuery} oninput={e => updateBadQuery(e.currentTarget.value)} placeholder="Поиск: виз" />
        <select aria-label="Плохой год" bind:value={badYear}><option value="all">Все годы</option><option>2024</option><option>2025</option><option>2026</option></select></div>
      <strong>Показано: {badVisible.length}</strong><small class="hint">Год изменился, а список нет!</small>
      <ul class="results">{#each badVisible.slice(0,3) as item (item.id)}<li>{item.title}</li>{/each}</ul>
    </article>
    <article class="demo good">
      <h3>Лучше: $derived из $state</h3>
      <div class="controls"><input aria-label="Хороший поиск" bind:value={query} placeholder="Поиск: виз" />
        <select aria-label="Хороший год" bind:value={year}><option value="all">Все годы</option><option>2024</option><option>2025</option><option>2026</option></select></div>
      <strong>Показано: {count}</strong><small class="hint">Все фильтры учтены автоматически.</small>
      <ul class="results">{#each visible.slice(0,3) as item (item.id)}<li>{item.title}</li>{/each}</ul>
    </article>
  </div>
  <p class="hint">React: просто вычислить <code>visible = publications.filter(...)</code>, при дорогой операции — рассмотреть <code>useMemo</code>.
  Svelte: <code>$derived</code> отслеживает зависимости без отдельного effect. Не используйте <code>$effect</code> для синхронизации производных данных.</p>
</section>
