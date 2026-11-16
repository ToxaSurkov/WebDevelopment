<script>
  let { item } = $props();
  let expanded = $state(false);
</script>

<article class="publication">
  <div class="pub-top"><span class="tag">{item.topic}</span><span class="year">{item.year}</span></div>
  <h3>{item.title}</h3>
  <p class="authors">{item.authors}</p>
  {#if expanded}<p class="abstract">{item.abstract}</p>{/if}
  <div class="pub-bottom">
    <span>{item.id}</span>
    <button class="text-btn" type="button" aria-expanded={expanded} onclick={() => expanded = !expanded}>
      {expanded ? 'Скрыть описание' : 'Подробнее'}
    </button>
  </div>
</article>
