<script>
  let { publication } = $props();
</script>

<article class="card">
  <div class="card-meta"><span>{publication.year}</span><span>{publication.topic}</span></div>
  <h3>{publication.title}</h3>
  <p>{publication.description}</p>
  <p class="authors">{publication.authors}</p>
</article>
