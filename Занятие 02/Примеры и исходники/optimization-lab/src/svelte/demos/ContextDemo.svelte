<script>
  import { setContext } from 'svelte';
  import SnapshotReader from './SnapshotReader.svelte';
  import ReactiveReader from './ReactiveReader.svelte';
  let badQuery = $state('');
  // Неудачно: значение primitive зафиксировано при инициализации компонента.
  setContext('bad-search-snapshot', { query: badQuery });
  // Хорошо: в context передаём реактивный объект; потомок читает его свойства.
  const search = $state({ query: '' });
  setContext('good-search-proxy', search);
</script>
<section>
  <p>Context — способ передать данные потомкам без цепочки props. В Svelte 5 важно передавать реактивную ссылку,
  когда потребителю нужны обновления. Пример специально демонстрирует ошибку снимка значения.</p>
  <div class="twocol">
    <article class="demo bad"><h3>Неудачно: snapshot примитива</h3>
      <input aria-label="Snapshot поиск" bind:value={badQuery} placeholder="Введите виз" /><SnapshotReader />
    </article>
    <article class="demo good"><h3>Правильно: state proxy в Context</h3>
      <input aria-label="Реактивный поиск" bind:value={search.query} placeholder="Введите виз" /><ReactiveReader />
    </article>
  </div>
  <p class="hint">React: <code>Context.Provider value</code> оповещает подписчиков при изменении значения.
  Svelte: полученный из Context объект <code>$state</code> реактивен по своим свойствам.
  Context нужен для области владения и удобства доступа, не как универсальный «ускоритель».</p>
</section>
