<script>
  let mode = $state('bad');
  let query = $state('');
  let items = $state([]);
  let status = $state('Откройте DevTools → Network → Fetch/XHR');
  let requestCount = $state(0);
  let issued = 0; // не-реактивный счетчик, чтобы effect не подписался на requestCount
  $effect(() => {
    const q = query;
    const currentMode = mode;
    const endpoint = `/api/publications?q=${encodeURIComponent(q)}&delay_ms=600`;
    if (currentMode === 'bad') {
      // Плохо: на каждую букву отправляем fetch без отмены предыдущих ответов.
      fetch(endpoint).then(r => r.json()).then(data => {
        items = data; status = `Ответ получен: ${data.length} записей`;
      }).catch(error => status = String(error));
      requestCount = ++issued;
      return;
    }
    // Хорошо: debounce + AbortController, cleanup — return из $effect.
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      requestCount = ++issued;
      try {
        const r = await fetch(endpoint,{signal:controller.signal});
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        items = await r.json(); status = `Ответ получен: ${items.length} записей`;
      } catch (error) { if (error.name !== 'AbortError') status=String(error); }
    }, 350);
    return () => { clearTimeout(timer); controller.abort(); };
  });
</script>
<section>
  <p>Наберите «визуализация» с разной скоростью и сравните число HTTP-запросов в Chrome Network.
  Здесь <code>$effect</code> уместен: HTTP-запрос — внешнее побочное действие.</p>
  <div class="controls"><button class:active={mode==='bad'} onclick={() => {mode='bad';requestCount=0}}>Каждый символ → fetch</button>
    <button class:active={mode==='good'} onclick={() => {mode='good';requestCount=0}}>Debounce + Abort</button></div>
  <input aria-label="Запрос API" bind:value={query} placeholder="Поиск по API" />
  <div class="metric">Отправлено запросов: {requestCount} · {status} · показано: {items.length}</div>
  <p class="hint">React: <code>useEffect</code> + cleanup; Svelte: <code>$effect</code> + возвращаемая функция очистки.
  AbortController не гарантирует остановку работы backend. Для этой вкладки запустите FastAPI из <code>backend/</code>.</p>
</section>
