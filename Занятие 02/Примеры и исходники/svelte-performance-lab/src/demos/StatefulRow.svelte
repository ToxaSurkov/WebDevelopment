<script>
  let { item } = $props();
  let checked = $state(false);
</script>
<label class="rowcheck"><input type="checkbox" bind:checked /><span>{item.title}</span></label>
