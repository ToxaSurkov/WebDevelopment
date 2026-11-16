<script>
  import publications from '../../publications.js';
  import StatefulRow from './StatefulRow.svelte';
  let tab = $state('keys');
  let descending = $state(false);
  let rows = $derived([...publications.slice(0,5)].sort((a,b) => descending ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id)));
  let virtual = $state(true);
  const lots = Array.from({length:2700},(_,i) => ({...publications[i%publications.length], id: `row-${i}`, title: `${publications[i%publications.length].title} — ${i+1}`}));
  const rowHeight = 44; const overscan = 5; const windowCount = 10;
  let scrollTop = $state(0);
  let first = $derived(Math.max(0, Math.floor(scrollTop/rowHeight)-overscan));
  let windowRows = $derived(lots.slice(first, first + windowCount + overscan*2));
</script>
<section>
  <div class="controls"><button class:active={tab==='keys'} onclick={() => tab='keys'}>Keyed each</button><button class:active={tab==='virtual'} onclick={() => tab='virtual'}>Виртуализация</button></div>
  {#if tab === 'keys'}
    <p>Отметьте первую строку и нажмите «Сменить порядок». В Svelte без ключа DOM/состояние может остаться привязанным к позиции.</p>
    <button onclick={() => descending = !descending}>Сменить порядок: {descending ? 'убывание' : 'возрастание'}</button>
    <div class="twocol"><article class="demo bad"><h3>Без ключа: #each item</h3>
        {#each rows as item}<StatefulRow {item}/>{/each}</article>
      <article class="demo good"><h3>С ключом: #each item (item.id)</h3>
        {#each rows as item (item.id)}<StatefulRow {item}/>{/each}</article></div>
  {:else}
    <p>2700 записей: сравните количество элементов в DOM. Пример виртуализации написан напрямую на Svelte, без сторонней библиотеки.</p>
    <div class="controls"><button class:active={virtual} onclick={() => virtual=true}>Только видимые</button><button class:active={!virtual} onclick={() => virtual=false}>Все 2700</button></div>
    {#if virtual}
      <div class="scroll-list" onscroll={e => scrollTop = e.currentTarget.scrollTop}>
        <div style={`height:${lots.length*rowHeight}px;position:relative`}>
          {#each windowRows as item, i (item.id)}
            <div class="virtual-row" style={`position:absolute;top:${(first+i)*rowHeight}px;left:0;right:0;height:${rowHeight}px`}>{item.title}</div>
          {/each}
        </div>
      </div>
      <div class="metric">Строк в DOM: {windowRows.length} из {lots.length}</div>
    {:else}
      <div class="scroll-list">{#each lots as item (item.id)}<div class="virtual-row">{item.title}</div>{/each}</div>
      <div class="metric">Строк в DOM: {lots.length}</div>
    {/if}
  {/if}
  <p class="hint">Keyed lists важны и в React, и в Svelte. Виртуализация — решение проблемы слишком большого DOM, а не проблемы React как такового.</p>
</section>
