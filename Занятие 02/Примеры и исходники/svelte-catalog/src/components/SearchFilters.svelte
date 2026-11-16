<script>
  import { sortOptions } from '../../../catalog-shared/catalog.js';
  let { query = $bindable(), year = $bindable(), topic = $bindable(), sort = $bindable(),
    years, topics, resetFilters } = $props();
</script>

<section class="filters" aria-label="Фильтры каталога">
  <label class="field">
    Поиск по тексту
    <input type="search" bind:value={query} placeholder="Например: визуализация" />
  </label>
  <label class="field">
    Год
    <select bind:value={year}>
      <option value="all">Все годы</option>
      {#each years as value (value)}<option value={String(value)}>{value}</option>{/each}
    </select>
  </label>
  <label class="field">
    Область
    <select bind:value={topic}>
      <option value="all">Все области</option>
      {#each topics as value (value)}<option {value}>{value}</option>{/each}
    </select>
  </label>
  <label class="field">
    Сортировка
    <select bind:value={sort}>
      {#each sortOptions as { value, label } (value)}<option {value}>{label}</option>{/each}
    </select>
  </label>
  <button class="reset-filters" type="button" onclick={resetFilters}>Сбросить фильтры</button>
</section>
