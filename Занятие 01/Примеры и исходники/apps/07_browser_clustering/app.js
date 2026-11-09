/*
 * ИНТЕРАКТИВНОСТЬ И ГРАФИКА: ЧИСТЫЙ JAVASCRIPT В БРАУЗЕРЕ.
 *
 * Идеи для показа студентам:
 * 1. document.getElementById — находит HTML-элемент через DOM.
 * 2. addEventListener('click', ...) — реагирует на действия пользователя.
 * 3. new KMeans(...).step() — считает в JavaScript, не на сервере.
 * 4. canvas.getContext('2d') — рисует точки прямо в браузере.
 * 5. Даже при отключённом интернете все эти операции продолжают работать.
 */
(function () {
  'use strict';
  const { KMeans, DBSCAN, generateData } = window.ClusterAlgorithms;
  const $ = id => document.getElementById(id);
  const COLORS = ['#097a9b','#dd8350','#8b68bc','#64a665','#cc5381','#b28a30','#4a80cd','#94764d'];
  const UNASSIGNED = '#aabac5';
  const NOISE = '#384856';
  let points = [], algorithm = 'kmeans', session, runTimer = null, seed = 2026;
  let activeDataset = 'blobs';

  // КОГДА меняются настройки, обновляем подписи и пересоздаём модель.
  function syncOutputs() {
    $('n-points-output').textContent = $('n-points').value;
    $('noise-output').textContent = $('noise').value + '%';
    $('k-output').textContent = $('k').value;
    $('eps-output').textContent = $('eps').value;
    $('minpts-output').textContent = $('minpts').value;
  }

  function stop() {
    if (runTimer !== null) clearInterval(runTimer);
    runTimer = null;
    $('play').textContent = '▶ Запустить';
  }
  function startSession() {
    stop();
    session = algorithm === 'kmeans'
      ? new KMeans(points, Number($('k').value), seed + 17)
      : new DBSCAN(points, Number($('eps').value), Number($('minpts').value));
    $('status').textContent = algorithm === 'kmeans'
      ? 'Начальные центры выбраны. Выполните шаг, чтобы распределить точки между ними.'
      : 'Все точки не исследованы. Выполните шаг, чтобы найти плотные области.';
    $('plot-state').textContent = 'Модель подготовлена';
    $('comparison').hidden = true;
    render();
  }
  function newDataset() {
    seed += 139;
    activeDataset = $('dataset').value;
    points = generateData(activeDataset, Number($('n-points').value), Number($('noise').value), seed);
    startSession();
  }
  function selectAlgorithm(name) {
    algorithm = name;
    $('choose-kmeans').classList.toggle('active', name === 'kmeans');
    $('choose-dbscan').classList.toggle('active', name === 'dbscan');
    $('choose-kmeans').setAttribute('aria-pressed', String(name === 'kmeans'));
    $('choose-dbscan').setAttribute('aria-pressed', String(name === 'dbscan'));
    $('kmeans-params').hidden = name !== 'kmeans';
    $('dbscan-params').hidden = name !== 'dbscan';
    startSession();
  }

  // Шаг = одно небольшое действие пользователя → вычисления → перерисовка.
  function doStep() {
    if (!session || !session.step()) { stop(); return; }
    if (algorithm === 'kmeans') {
      $('status').textContent = `Итерация ${session.iteration}: распределили точки и передвинули центры. ` + (session.converged ? 'Алгоритм завершён.' : 'Можно выполнить следующий шаг.');
      $('plot-state').textContent = session.converged ? 'Готовая модель' : 'Итерация ' + session.iteration;
    } else {
      const noiseCount = session.labels.filter(v => v === -1).length;
      $('status').textContent = `Исследовано ${session.visited.filter(Boolean).length} точек. Найдено кластеров: ${session.clusterCount}; временный шум: ${noiseCount}.` + (session.finished ? ' Алгоритм завершён.' : '');
      $('plot-state').textContent = session.finished ? 'Готовая модель' : 'Шаг ' + session.stepCount;
    }
    render();
    if (session.converged || session.finished) stop();
  }
  function togglePlayback() {
    if (runTimer !== null) { stop(); return; }
    if (!session || session.converged || session.finished) startSession();
    $('play').textContent = 'Ⅱ Пауза';
    runTimer = setInterval(doStep, algorithm === 'kmeans' ? 800 : 100);
    doStep();
  }

  // Canvas имеет собственную систему пикселей: учитываем Retina/HiDPI дисплеи.
  function setupCanvas(canvas) {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(200, rect.width), h = Math.max(150, rect.height);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w, h };
  }
  // Перевод чисел 0..100 в координаты на экране.
  function scale(x, y, w, h, padding) {
    return { x: padding + (w - 2 * padding) * x / 100,
      y: h - padding - (h - 2 * padding) * y / 100 };
  }

  function draw(canvas, data, labels, centroids = [], paths = [], eps = null, seedPoint = null, compact = false) {
    const { ctx, w, h } = setupCanvas(canvas);
    const pad = compact ? 15 : 30;
    ctx.clearRect(0, 0, w, h);
    // Фоновая координатная сетка — тоже JS, а не картинка в HTML.
    ctx.strokeStyle = '#e8eff3'; ctx.lineWidth = 1;
    for (let n = 0; n <= 10; n++) {
      const x = pad + (w - 2 * pad) * n / 10;
      const y = pad + (h - 2 * pad) * n / 10;
      ctx.beginPath(); ctx.moveTo(x, pad); ctx.lineTo(x, h - pad); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(w - pad, y); ctx.stroke();
    }
    if (!compact) {
      ctx.fillStyle = '#7e8f9c'; ctx.font = '11px system-ui';
      ctx.textAlign = 'center';
      [0, 25, 50, 75, 100].forEach(n => {
        const p = scale(n, 0, w, h, pad);
        ctx.fillText(String(n), p.x, h - 10);
      });
    }
    // В DBSCAN рисуем радиус соседства вокруг последней исследованной точки.
    if (eps !== null && seedPoint !== null) {
      const c = scale(seedPoint.x, seedPoint.y, w, h, pad);
      ctx.beginPath(); ctx.ellipse(c.x, c.y, eps * (w - 2 * pad) / 100, eps * (h - 2 * pad) / 100, 0, 0, Math.PI * 2);
      ctx.strokeStyle = '#267e9288'; ctx.lineWidth = 1.8; ctx.setLineDash([5, 4]); ctx.stroke();
      ctx.setLineDash([]);
    }
    // Каждая точка — окружность, которую рисует JavaScript.
    data.forEach((p, i) => {
      const xy = scale(p.x, p.y, w, h, pad);
      const group = labels ? labels[i] : -2;
      ctx.beginPath();
      ctx.arc(xy.x, xy.y, compact ? 2.6 : 3.8, 0, Math.PI * 2);
      ctx.fillStyle = group === -2 ? UNASSIGNED : group === -1 ? NOISE : COLORS[group % COLORS.length];
      ctx.globalAlpha = group === -2 ? 0.58 : 0.88;
      ctx.fill(); ctx.globalAlpha = 1;
    });
    paths.forEach((path, j) => {
      if (path.length < 2) return;
      ctx.beginPath();
      path.forEach((p, i) => {
        const xy = scale(p.x, p.y, w, h, pad);
        if (!i) ctx.moveTo(xy.x, xy.y); else ctx.lineTo(xy.x, xy.y);
      });
      ctx.strokeStyle = COLORS[j % COLORS.length] + 'aa';ctx.lineWidth = 2.1;ctx.setLineDash([5,3]);ctx.stroke();ctx.setLineDash([]);
    });
    // Крестики соответствуют центрам K-means. DBSCAN центры не использует.
    centroids.forEach((p, j) => {
      const xy = scale(p.x, p.y, w, h, pad), c = COLORS[j % COLORS.length];
      ctx.strokeStyle = '#fff';ctx.lineWidth = compact ? 4 : 6;
      ctx.beginPath();ctx.moveTo(xy.x - 8, xy.y - 8);ctx.lineTo(xy.x + 8, xy.y + 8);ctx.moveTo(xy.x + 8, xy.y - 8);ctx.lineTo(xy.x - 8, xy.y + 8);ctx.stroke();
      ctx.strokeStyle = c;ctx.lineWidth = compact ? 2 : 3.3;ctx.stroke();
    });
  }

  function render() {
    if (!session) return;
    draw($('main-canvas'), points, session.labels,
      algorithm === 'kmeans' ? session.centroids : [],
      algorithm === 'kmeans' ? session.trajectories : [],
      algorithm === 'dbscan' ? session.eps : null,
      algorithm === 'dbscan' && session.lastSeed !== null ? points[session.lastSeed] : null);
    const labels = session.labels;
    const foundClusters = [...new Set(labels.filter(v => v >= 0))].length;
    const noise = labels.filter(v => v === -1).length;
    $('stat-points').textContent = String(points.length);
    $('stat-clusters').textContent = String(foundClusters);
    $('stat-third-label').textContent = algorithm === 'kmeans' ? 'Итерация' : 'Шагов поиска';
    $('stat-third').textContent = String(algorithm === 'kmeans' ? session.iteration : session.stepCount);
    $('stat-fourth-label').textContent = algorithm === 'kmeans' ? 'Инерция' : 'Шумовых точек';
    $('stat-fourth').textContent = algorithm === 'kmeans' ? (session.inertia === null ? '—' : Math.round(session.inertia).toLocaleString('ru')) : String(noise);
    let html = '';
    for (let i = 0; i < foundClusters; i++) html += `<span class="legend-item"><span class="legend-swatch" style="background:${COLORS[i % COLORS.length]}"></span>Кластер ${i + 1}</span>`;
    if (noise) html += `<span class="legend-item"><span class="legend-swatch" style="background:${NOISE}"></span>Шум</span>`;
    if (labels.includes(-2)) html += `<span class="legend-item"><span class="legend-swatch" style="background:${UNASSIGNED}"></span>Не обработано</span>`;
    if (algorithm === 'kmeans') html += '<span class="legend-item">✕ — центр кластера</span>';
    $('legend').innerHTML = html;
  }

  // «Сравнить» выполняет ОБА алгоритма полностью на КОПИИ тех же точек.
  // Здесь вычисления более серьёзные, но они всё равно происходят в браузере.
  function compareAlgorithms() {
    stop();
    const km = new KMeans(points, Number($('k').value), seed + 17);
    for (let i = 0; i < 90 && !km.converged; i++) km.step();
    const db = new DBSCAN(points, Number($('eps').value), Number($('minpts').value));
    for (let i = 0; i < points.length && !db.finished; i++) db.step();
    $('comparison').hidden = false;
    draw($('compare-kmeans'), points, km.labels, km.centroids, [], null, null, true);
    draw($('compare-dbscan'), points, db.labels, [], [], null, null, true);
    $('compare-kmeans-note').textContent = `K=${km.k}. ${km.iteration} итераций; разделение по расстоянию до центров.`;
    $('compare-dbscan-note').textContent = `${db.clusterCount} кластеров; ${db.labels.filter(l=>l===-1).length} шумовых точек. Плотные области.`;
    $('status').textContent = 'Оба алгоритма вычислены на одинаковых данных. Сравните формы кластеров ниже.';
  }

  function addPoint(e) {
    const canvas = $('main-canvas'), rect = canvas.getBoundingClientRect();
    const pad = 30, xx = e.clientX - rect.left, yy = e.clientY - rect.top;
    const x = (xx - pad) / (rect.width - 2 * pad) * 100;
    const y = (rect.height - pad - yy) / (rect.height - 2 * pad) * 100;
    if (x < 0 || x > 100 || y < 0 || y > 100) return;
    points.push({ x, y });
    startSession();
    $('status').textContent = 'Точка добавлена. Выполните кластеризацию заново.';
  }

  // File API даёт доступ к выбранному ПОЛЬЗОВАТЕЛЕМ файлу, не к произвольным файлам компьютера.
  // File.text() читает CSV локально. Ни fetch(), ни сервер здесь не используются.
  async function importCSV(file) {
    if (!file) return;
    const text = await file.text();
    const rows = text.trim().split(/\r?\n/), parsed = [];
    for (const row of rows) {
      const col = row.trim().split(/[;,\t]/);
      if (col.length < 2) continue;
      const x = Number(col[0].trim()), y = Number(col[1].trim());
      if (Number.isFinite(x) && Number.isFinite(y) && x >= 0 && x <= 100 && y >= 0 && y <= 100) parsed.push({ x, y });
    }
    if (parsed.length < 2) {
      $('status').textContent = 'Не получилось прочитать CSV: нужны минимум две строки с координатами x,y от 0 до 100.';
      return;
    }
    points = parsed.slice(0, 1200);
    startSession();
    $('status').textContent = `Загружено ${points.length} точек из локального CSV. Файл никуда не отправлялся.`;
    $('dataset').value = 'blobs';
  }

  // Реагируем на события DOM: ввод, нажатия кнопок, изменение размера экрана.
  $('generate').addEventListener('click', newDataset);
  $('dataset').addEventListener('change', () => {
    const preset = { blobs: { k: 3, eps: 9 }, moons: { k: 2, eps: 5.8 }, rings: { k: 2, eps: 6 }, uniform: { k: 3, eps: 6 } }[$('dataset').value];
    $('k').value = preset.k; $('eps').value = preset.eps;
    syncOutputs(); newDataset();
  });
  ['n-points','noise'].forEach(id => $(id).addEventListener('input', syncOutputs));
  ['k','eps','minpts'].forEach(id => $(id).addEventListener('input', () => { syncOutputs(); startSession(); }));
  $('choose-kmeans').addEventListener('click', () => selectAlgorithm('kmeans'));
  $('choose-dbscan').addEventListener('click', () => selectAlgorithm('dbscan'));
  $('next').addEventListener('click', doStep);
  $('play').addEventListener('click', togglePlayback);
  $('restart').addEventListener('click', startSession);
  $('compare').addEventListener('click', compareAlgorithms);
  $('main-canvas').addEventListener('click', addPoint);
  $('import').addEventListener('click', () => $('file-picker').click());
  $('file-picker').addEventListener('change', e => importCSV(e.target.files[0]));
  window.addEventListener('resize', () => {
    render();
    if (!$('comparison').hidden) compareAlgorithms();
  });

  // ПЕРВЫЙ ЗАПУСК: всё происходит внутри браузера после открытия index.html.
  syncOutputs();
  points = generateData(activeDataset, Number($('n-points').value), Number($('noise').value), seed);
  startSession();
})();
