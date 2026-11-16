<script>
  let { onReset } = $props();
</script>

<section class="empty">
  <h2>Ничего не найдено</h2>
  <p>Попробуйте другой запрос или вернитесь ко всем публикациям.</p>
  <button type="button" onclick={onReset}>Показать все публикации</button>
</section>
