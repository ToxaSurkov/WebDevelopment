<script>
  let { query = $bindable(''), year = $bindable('all'), onReset } = $props();
</script>

<section class="toolbar" aria-label="Фильтры каталога">
  <label class="field">Поиск по названию или теме
    <input bind:value={query} placeholder="Например, визуализация" />
  </label>
  <label class="field">Год публикации
    <select bind:value={year}>
      <option value="all">Все годы</option><option value="2026">2026</option>
      <option value="2025">2025</option><option value="2024">2024</option>
    </select>
  </label>
  <button class="reset" type="button" onclick={onReset}>Сбросить</button>
</section>
