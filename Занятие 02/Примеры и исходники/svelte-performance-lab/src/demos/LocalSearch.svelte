<script>
  import publications from '../publications.json';
  let { label } = $props();
  let query = $state('');
  let visible = $derived(publications.filter(p => p.title.toLowerCase().includes(query.trim().toLowerCase())));
</script>
<div class="search-unit">
  <label>{label}
    <input bind:value={query} placeholder="Поиск: виз" />
  </label>
  <small>Найдено: {visible.length}; запрос: «{query || '—'}»</small>
</div>
