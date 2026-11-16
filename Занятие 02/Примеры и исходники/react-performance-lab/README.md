# React Performance Lab · занятие 02

**Отдельная лаборатория, не заменяющая основной `react-catalog`.** Те же девять публикаций. Все исходники открываются как отдельные файлы. В Google Drive после согласования будут храниться папки, а не ZIP.

## Запуск

Нужен Node.js 20.19+ (или 22.12+) и Python 3.10+.

Терминал A, `react-performance-lab/backend/`:

```sh
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

Терминал B, `react-performance-lab/`:

```sh
npm install
npm run dev
```

Открыть `http://127.0.0.1:5173`. Для проверки production-бандла:

```sh
npm run build
npm run preview
```

API проксируется Vite (`vite.config.js`): браузер запрашивает `/api/...` на своём origin. CORS не требуется. Backend используется только для сетевой демонстрации; остальные экраны работают без него.

## Как показывать по слайдам

| Слайд | Вкладка приложения | Что попробовать | Где код |
|---|---|---|---|
| State colocation | Где хранить state | Печатать в двух полях, смотреть число рендеров Header | `src/demos/StatePlacement.jsx` |
| Derived state | Лишний state | `виз` + `2025`, сравнить устаревающую выдачу и вычисляемую | `src/demos/DerivedState.jsx` |
| Profiling | любая вкладка | React DevTools → Profiler → Record → взаимодействие; Chrome Performance; `npm run build` | `src/App.jsx` |
| Memo / Context | memo и Context | Нажать счётчик с/без memo, затем менять user в Context | `src/demos/MemoContext.jsx` |
| Lists | Списки и key | Отметить первую строку и сменить сортировку; затем виртуализировать 2700 строк | `src/demos/Lists.jsx` |
| Network | Сеть | Напечатать «визуализация», DevTools → Network → Fetch/XHR; сравнить число запросов | `src/demos/Network.jsx` + `backend/main.py` |
| Lazy loading | Lazy: статистика | Network → JS → открыть вкладку статистики впервые; сравнить chunks в `dist/assets` | `src/App.jsx`, `src/pages/LazyReport.jsx` |

### Замечания

- Для React Profiler требуется расширение React Developer Tools. В режиме development результаты могут отличаться от production из-за дополнительных проверок React. Измерения сравнивать по нескольким повторам.
- `console.count`/счётчики рендера здесь учебные; в приложении нет `StrictMode`, чтобы не мешали дополнительные dev-вызовы, но в настоящем приложении `StrictMode` полезен.
- React Compiler не включён. В проектах с включённым Compiler ручная мемоизация обычно нужна реже.
- Виртуализация применяется только после профилирования и нужна для длинных списков. Порог в 1000 записей не универсален.
- `key={index}` допустим только в стабильных статичных списках, но опасен при сортировке/удалении.
- `AbortController` прекращает получение ответа клиентом; не гарантирует, что сервер прекратит обработку уже отправленного запроса.
- Эти примеры сделаны специально для демонстрации различий. Антипаттерны намеренно оставлены в плохих вариантах.
