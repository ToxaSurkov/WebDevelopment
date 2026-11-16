<script>
  import StatePlacement from './demos/StatePlacement.svelte';
  import DerivedState from './demos/DerivedState.svelte';
  import FineGrained from './demos/FineGrained.svelte';
  import ContextDemo from './demos/ContextDemo.svelte';
  import Lists from './demos/Lists.svelte';
  import Network from './demos/Network.svelte';

  const tabs = [
    ['state','Где хранить state'], ['derived','$derived и $effect'],
    ['fine','Мелкие обновления'], ['context','Context'],
    ['lists','Key и длинные списки'], ['network','Сеть'],
    ['lazy','Ленивая статистика']
  ];
  let tab = $state('state');
  let ReportComponent = $state(null);
  let loadingReport = $state(false);
  let loadError = $state('');

  async function choose(next) {
    tab = next;
    if (next !== 'lazy' || ReportComponent || loadingReport) return;
    loadingReport = true;
    loadError = '';
    try {
      // Vite выделяет этот компонент в отдельный чанк при сборке.
      ReportComponent = (await import('./pages/LazyReport.svelte')).default;
    } catch (error) { loadError = String(error); }
    finally { loadingReport = false; }
  }
</script>

<main class="page">
  <header class="site-header">
    <div class="eyebrow">Занятие 02 · Svelte 5 Performance Lab</div>
    <h1>Как устроена реактивность и оптимизация в Svelte</h1>
    <p>Те же 60 публикаций, что в React. Открыть <a href="./">вариант на React</a>.</p>
  </header>
  <nav class="tabs" aria-label="Лабораторные демонстрации">
    {#each tabs as [id, name] (id)}
      <button class:active={tab === id} onclick={() => choose(id)}>{name}</button>
    {/each}
  </nav>
  {#if tab === 'state'}<StatePlacement />
  {:else if tab === 'derived'}<DerivedState />
  {:else if tab === 'fine'}<FineGrained />
  {:else if tab === 'context'}<ContextDemo />
  {:else if tab === 'lists'}<Lists />
  {:else if tab === 'network'}<Network />
  {:else if tab === 'lazy'}
    {#if loadingReport}<section>Загружаем отдельный модуль…</section>
    {:else if loadError}<section>Ошибка загрузки: {loadError}</section>
    {:else if ReportComponent}<ReportComponent />
    {/if}
  {/if}
  <footer>
    Исходники: <code>src/demos/</code>. В Svelte 5 нет аналога обязательного React.memo:
    компилятор отслеживает реактивные зависимости. Проверяйте измерениями, а не догадками.
    Для бандла: <code>npm run build</code> и вкладка Network → JS.
  </footer>
</main>
