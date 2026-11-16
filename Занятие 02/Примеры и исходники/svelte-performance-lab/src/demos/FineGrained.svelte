<script>
  import publications from '../publications.json';
  function expensiveFilter(query) {
    let checksum = 0;
    for (let i=0; i<1200000; i++) checksum = (checksum + i * 3) % 997;
    return publications.filter(p => p.title.toLowerCase().includes(query.trim().toLowerCase()));
  }
  let badCount = $state(0);
  let badRuns = $state(0);
  let badMatches = $state(expensiveFilter('виз').length);
  function badClick() { badCount += 1; badMatches = expensiveFilter('виз').length; badRuns += 1; }

  let goodCount = $state(0);
  let query = $state('виз');
  // ХОРОШО: дорогое вычисление зависит только от query, но не от goodCount.
  let goodMatches = $derived(expensiveFilter(query).length);
  // Диагностика вынесена в effect, чтобы $derived оставался чистым.
  $effect(() => {
    $inspect.trace('filtered result');
    console.log('Сводка поиска изменилась:', goodMatches);
  });
</script>
<section>
  <p>Нажимайте посторонний счётчик. Слева разработчик сам запускает дорогую работу при каждом клике,
  справа <code>$derived</code> не вычисляется заново без изменения <code>query</code>. Откройте Console (диагностика в $effect).</p>
  <div class="twocol">
    <article class="demo bad"><h3>Лишнее вычисление в обработчике</h3><button onclick={badClick}>Посторонний счётчик: {badCount}</button>
      <div class="metric">Найдено: {badMatches}; лишних пересчётов: {badRuns}</div></article>
    <article class="demo good"><h3>$derived.by отслеживает query</h3><button onclick={() => goodCount += 1}>Посторонний счётчик: {goodCount}</button>
      <input aria-label="Изменить запрос" bind:value={query} placeholder="Поиск" />
      <div class="metric">Найдено: {goodMatches}</div></article>
  </div>
  <p class="hint">В Svelte 5 нет модели «вся функция компонента выполняется при каждом setState», как в React.
  Компилятор обновляет зависимости более адресно. Но тяжёлые операции, запущенные вручную, остаются тяжёлыми.</p>
</section>
