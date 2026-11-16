<script>
  import { getContext } from 'svelte';
  const snapshot = getContext('bad-search-snapshot');
</script>
<div class="metric">Потомок видит поисковую строку: «{snapshot.query || '—'}»</div>
