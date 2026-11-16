# Занятие 2. Каталог и лаборатория оптимизации

Три версии одного каталога используют общий набор из 60 синтетических публикаций, поиск по названию, авторам и аннотации, фильтры по году и области, сортировку, сброс и статистику по областям.

## Как запустить

В Anaconda Prompt перейдите в папку «Примеры и исходники» и один раз установите зависимости.

    npm install

| Проект | Команда из этой папки | Адрес |
| --- | --- | --- |
| [React SPA](react-spa-routes/) | `npm run dev:spa` | [127.0.0.1:5173](http://127.0.0.1:5173/) |
| [React MPA](react-mpa/) | `npm run dev:mpa` | [127.0.0.1:5174](http://127.0.0.1:5174/) |
| [Svelte 5](svelte-catalog/) | `npm run dev:svelte` | [127.0.0.1:5175](http://127.0.0.1:5175/) |
| [Лаборатория оптимизации](optimization-lab/) | `npm run dev:lab` | [React](http://127.0.0.1:5176/) · [Svelte](http://127.0.0.1:5176/svelte.html) |

Если сравниваете проекты одновременно, запускайте их в разных окнах. Везде используется Node.js 22.12+ или более новая поддерживаемая версия. `npm run build` собирает все четыре проекта, `npm test` проверяет общую логику каталога.

## Что сравнить

- Выберите год 2025 и область NLP, затем измените сортировку. Проверьте счётчик, кнопку сброса и пустую выдачу. Во всех версиях результаты совпадают.
- В DevTools откройте **Network → Doc** и включите **Preserve log**. Перейдите из каталога в статистику и обратно. В React SPA переходы выполняет React Router, фильтры из `App` сохраняются. React MPA загружает новый HTML-документ, поэтому фильтры сбрасываются.
- В лаборатории откройте «Вычисления» в версии React и сравните счётчики расчётов при одинаковом пороге. Для вкладки «Сеть» нужен [общий FastAPI](optimization-lab/README.md#как-запустить-сетевое-демо).

## Где смотреть исходники

- [Данные](catalog-shared/data/publications.json), [фильтрация и статистика](catalog-shared/catalog.js) и [стили](catalog-shared/styles.css) общие для каталогов.
- [Вход и маршруты React SPA](react-spa-routes/src/App.jsx), [общий экран каталога](catalog-shared/react/CatalogPage.jsx) и [состояние фильтров](catalog-shared/react/useCatalogFilters.js).
- [Навигация MPA](react-mpa/src/SiteLayout.jsx) и её HTML-документы [index](react-mpa/index.html), [stats](react-mpa/stats.html) и [about](react-mpa/about.html).
- [Состояние и шаблон Svelte](svelte-catalog/src/App.svelte), [компоненты](svelte-catalog/src/components/).
- Лаборатория содержит [демо React](optimization-lab/src/react/demos/) и [демо Svelte](optimization-lab/src/svelte/demos/). Оба используют общие данные и API.
