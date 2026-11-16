<script>
  import { getContext } from 'svelte';
  const search = getContext('good-search-proxy');
</script>
<div class="metric">Потомок видит поисковую строку: «{search.query || '—'}»</div>
