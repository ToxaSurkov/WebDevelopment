# Лекция 02 — исходники и примеры

Примеры расположены в обычных папках (без ZIP). В основе проектов — один учебный каталог из 9 научных публикаций.

| Папка | Для чего | Запуск |
|---|---|---|
| `vanilla-catalog/` | Обычный JavaScript: фильтрация и ручные изменения DOM | Открыть `index.html` |
| `react-catalog/` | Компоненты React, props, `useState` и фильтры | `npm install`, `npm run dev` |
| `react-spa-routes/` | React SPA: `/`, `/stats`, `/about`, React Router | `npm install`, `npm run dev` |
| `react-mpa/` | React MPA: три HTML-документа и независимые React-точки входа | `npm install`, `npm run dev` |
| `svelte-catalog/` | Тот же каталог на Svelte 5 (`$state`, `$derived`) | `npm install`, `npm run dev` |
| `react-performance-lab/` | Ошибочное/правильное размещение state, производные данные, Profiler, memo, Context, списки, сеть, lazy loading | См. `README.md` внутри проекта |
| `svelte-performance-lab/` | Аналогичная лаборатория Svelte 5; сравнение реактивной модели и общих приёмов оптимизации | См. `README.md` внутри проекта |

**Основные ссылки на код (относительные пути):**

- `vanilla-catalog/src/app.js` — ручное обновление каталога.
- `react-catalog/src/App.jsx` и `react-catalog/src/components/` — компоненты, props, state.
- `svelte-catalog/src/App.svelte` и `svelte-catalog/src/components/` — сравнение с React.
- `react-spa-routes/src/App.jsx` и `react-mpa/src/SiteLayout.jsx` — SPA и MPA.
- `react-performance-lab/src/demos/StatePlacement.jsx`, `DerivedState.jsx`, `MemoContext.jsx`, `Lists.jsx`, `Network.jsx` — оптимизация React.
- `svelte-performance-lab/src/demos/StatePlacement.svelte`, `DerivedState.svelte`, `FineGrained.svelte`, `ContextDemo.svelte`, `Lists.svelte`, `Network.svelte` — Svelte 5.

**Примечания к лекции:**

- Пример `useLocalStorage` на слайде 19 — иллюстрация применения хука из библиотеки `usehooks-ts`. Исходный `react-catalog` пока не использует этот хук.
- Для SPA/MPA сравнивайте переходы в DevTools → Network с фильтром Doc. Для React и Svelte оптимизации измеряйте время выполнения, число DOM-узлов и сетевые запросы. Не делайте вывод о выигрыше из одного запуска dev-сервера.
- В лабораториях React и Svelte используется учебный FastAPI backend для сетевых сценариев; конфигурацию запуска смотрите в `README.md` каждого проекта.

Для большинства Vite-проектов потребуется Node.js, npm и доступ к npm registry при первой установке. При запуске нескольких проектов одновременно используйте разные локальные порты.
