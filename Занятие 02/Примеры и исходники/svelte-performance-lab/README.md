# Svelte 5 Performance Lab — оптимизация и сравнение с React

Отдельный учебный проект: **те же 9 научных публикаций**, что в `react-performance-lab`.
Демонстрации специально включают неудачные примеры — это не рекомендованный код для production.
Пример не модифицирует основной `svelte-catalog` и основную презентацию.

## Запуск

Node.js 20.19+ или 22.12+.

```bash
npm install
npm run dev
```

Откройте **http://127.0.0.1:5174**.

Для демонстрации HTTP-запросов дополнительно запустите backend в другом терминале:

```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

В `vite.config.js` настроен proxy `/api` → `http://127.0.0.1:8000`, поэтому для браузера нет cross-origin обращения, CORS не нужен. Этот backend общий по смыслу с React-лабораторией, но запускайте только один процесс на порту 8000.

Для проверки code splitting:

```bash
npm run build
npm run preview
```

## Сравнение по вкладкам

| Вкладка | Исходники | Сравнение с React |
|---|---|---|
| Где хранить state | `src/demos/StatePlacement.svelte`, `LocalSearch.svelte` | State Colocation полезен обоим; в Svelte нет общего перезапуска функции-компонента при каждом изменении |
| $derived / $effect | `DerivedState.svelte` | React вычисляет значение при рендере; для дорогой операции может использовать `useMemo`. Svelte ` $derived ` отслеживает зависимости автоматически |
| Мелкие обновления | `FineGrained.svelte` | `React.memo`/`useMemo` — не прямые аналоги Svelte; адресные обновления обычно осуществляет компилятор |
| Context | `ContextDemo.svelte`, `SnapshotReader.svelte`, `ReactiveReader.svelte` | Сохранённый снимок примитива не является реактивной ссылкой; передавайте объект `$state` в контексте |
| Key и длинные списки | `Lists.svelte`, `StatefulRow.svelte` | У Svelte keyed `{#each ... (id)}`, у React `key={id}`; виртуализация остаётся полезной обоим |
| Сеть | `Network.svelte`, `backend/main.py` | `useEffect` (React) против `$effect` (Svelte); debounce/AbortController нужны обоим |
| Ленивая статистика | `App.svelte`, `pages/LazyReport.svelte` | React.lazy + Suspense (React) против `import()` + условной отрисовки (Svelte) |

## Что показывать в DevTools

- **Performance:** время scripting/layout/paint при вводе и прокрутке. Не делайте вывод о производительности по одному запуску. Lighthouse оценивает загрузку, Core Web Vitals: LCP, CLS, INP.
- **Network → Fetch/XHR:** сравнить число запросов при вводе в поиск.
- **Network → JS** и `dist/assets`: увидеть отдельный JS chunk статистики.
- **Elements:** проверить количество `.virtual-row` в DOM (виртуализация).
- **Console:** количество выполнений дорогостоящего вычисления из `$derived`.
- **Svelte 5:** `$inspect` и `$inspect.trace()` можно использовать для диагностики зависимостей в dev; это не React DevTools Profiler. Время производственного приложения измеряйте в собранной версии.

## Важные ограничения

- Svelte 5 не освобождает от работы с сетью, объёмом DOM, тяжёлыми обработчиками и бандлом.
- `$derived` — для вычисляемых значений без побочных эффектов. `$effect` — для внешних действий: fetch, подписки, интеграции с DOM.
- `setContext/getContext` — механизм передачи данных потомкам, а не автоматический ускоритель. Реактивность зависит от того, **что именно** передали.
- Порог для виртуализации индивидуален — профилируйте. React Compiler тоже снижает потребность в ручной мемоизации на React-стороне.
- `AbortController` отменяет ожидание в браузере, но не гарантирует отмену уже начатой работы FastAPI.

## Ссылки на официальную документацию

- https://svelte.dev/docs/svelte/$state
- https://svelte.dev/docs/svelte/$derived
- https://svelte.dev/docs/svelte/$effect
- https://svelte.dev/docs/svelte/$inspect
- https://svelte.dev/docs/svelte/context
- https://svelte.dev/docs/svelte/each
- https://svelte.dev/docs/svelte/overview
