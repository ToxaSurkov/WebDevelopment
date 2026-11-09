/*
 * ЧИСТЫЙ JAVASCRIPT: ГЕНЕРАЦИЯ ДАННЫХ И АЛГОРИТМЫ КЛАСТЕРИЗАЦИИ.
 * Этот файл выполняется непосредственно браузером. Python, сервер и API не нужны.
 *
 * Точки представлены обычными JS-объектами { x: 0..100, y: 0..100 }.
 * Никакие данные в интернет не отправляются.
 */
(function () {
  'use strict';

  // Разные запуски с одинаковым seed создают одинаковые случайные точки.
  function randomGenerator(seed) {
    let state = seed >>> 0;
    return function () {
      state = (state * 1664525 + 1013904223) >>> 0;
      return state / 4294967296;
    };
  }

  // Приближённое нормальное распределение методом Бокса—Мюллера.
  // Нужны неравномерные точки, собранные вокруг центра облака.
  function gaussian(rng) {
    const u = Math.max(1e-9, rng());
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rng());
  }

  const clamp = (v, low, high) => Math.max(low, Math.min(high, v));
  const distance2 = (a, b) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;

  function generateData(pattern, count = 240, noisePercent = 4, seed = 2026) {
    const rng = randomGenerator(seed);
    const points = [];
    const n = Math.round(count * (1 - noisePercent / 100));
    for (let i = 0; i < n; i++) {
      let x, y;
      if (pattern === 'moons') {
        const t = rng() * Math.PI;
        if (i % 2 === 0) {
          x = 37 + 25 * Math.cos(t) + gaussian(rng) * 1.4;
          y = 43 + 25 * Math.sin(t) + gaussian(rng) * 1.4;
        } else {
          x = 37 + 25 * (1 - Math.cos(t)) + gaussian(rng) * 1.4;
          y = 43 + 25 * (0.10 - Math.sin(t)) + gaussian(rng) * 1.4;
        }
      } else if (pattern === 'rings') {
        // Равномерно раскладываем объекты вдоль колец. Так нет больших
        // случайных разрывов: DBSCAN сможет распознать каждое кольцо целиком.
        const ringIndex = Math.floor(i / 2);
        const ringSize = Math.ceil(n / 2);
        const angle = (ringIndex + rng() * 0.35) * 2 * Math.PI / ringSize;
        const radius = (i % 2 === 0 ? 18 : 37) + gaussian(rng) * 1.15;
        x = 50 + radius * Math.cos(angle);
        y = 50 + radius * Math.sin(angle);
      } else if (pattern === 'uniform') {
        x = 8 + 84 * rng();
        y = 8 + 84 * rng();
      } else { // blobs: три естественных компактных скопления.
        const centers = [{ x: 25, y: 27 }, { x: 76, y: 31 }, { x: 49, y: 74 }];
        const c = centers[i % 3];
        x = c.x + gaussian(rng) * 7.5;
        y = c.y + gaussian(rng) * 7.5;
      }
      points.push({ x: clamp(x, 2, 98), y: clamp(y, 2, 98) });
    }
    for (let i = n; i < count; i++) {
      points.push({ x: 4 + 92 * rng(), y: 4 + 92 * rng() });
    }
    return points;
  }

  /*
   * K-MEANS: по очереди относит точки к ближайшему центру, затем
   * перемещает каждый центр в среднее положение точек своего кластера.
   * Каждая команда .step() делает одну полную итерацию.
   */
  class KMeans {
    constructor(points, k, seed = 421) {
      this.points = points;
      this.k = Math.max(1, Math.min(k, points.length));
      this.labels = points.map(() => -2); // -2 = ещё не классифицирована
      this.centroids = [];
      this.trajectories = [];
      this.iteration = 0;
      this.converged = false;
      this.inertia = null;
      const rng = randomGenerator(seed);
      const first = points[Math.floor(rng() * points.length)];
      this.centroids.push({ ...first });
      // k-means++: следующие центры выбираем с повышенным шансом вдали от предыдущих.
      while (this.centroids.length < this.k) {
        const weights = points.map(p => Math.min(...this.centroids.map(c => distance2(p, c))));
        const total = weights.reduce((s, v) => s + v, 0);
        if (total < 1e-12) {
          this.centroids.push({ ...points[Math.floor(rng() * points.length)] });
          continue;
        }
        let target = rng() * total;
        let idx = weights.length - 1;
        for (let j = 0; j < weights.length; j++) {
          target -= weights[j];
          if (target <= 0) { idx = j; break; }
        }
        this.centroids.push({ ...points[idx] });
      }
      this.trajectories = this.centroids.map(c => [{ ...c }]);
    }

    step() {
      if (this.converged || !this.points.length) return false;
      const prevLabels = this.labels.slice();
      const sum = this.centroids.map(() => ({ x: 0, y: 0, n: 0 }));
      this.labels = this.points.map(p => {
        let best = 0;
        let smallest = Infinity;
        this.centroids.forEach((c, j) => {
          const d2 = distance2(p, c);
          if (d2 < smallest) { smallest = d2; best = j; }
        });
        sum[best].x += p.x;
        sum[best].y += p.y;
        sum[best].n++;
        return best;
      });
      let shift = 0;
      this.centroids = this.centroids.map((old, j) => {
        if (!sum[j].n) return old; // если кластер временно пуст, центр оставляем
        const next = { x: sum[j].x / sum[j].n, y: sum[j].y / sum[j].n };
        shift = Math.max(shift, Math.sqrt(distance2(next, old)));
        return next;
      });
      this.centroids.forEach((c, j) => this.trajectories[j].push({ ...c }));
      this.iteration++;
      this.inertia = this.points.reduce((acc, p, i) => acc + distance2(p, this.centroids[this.labels[i]]), 0);
      this.converged = shift < 0.08 || this.labels.every((v, i) => v === prevLabels[i]) || this.iteration >= 80;
      return true;
    }
  }

  /*
   * DBSCAN: ищет области с высокой плотностью точек.
   * eps — радиус соседства, minPts — минимальное число соседей, включая саму точку.
   * .step() исследует одну ранее не посещённую точку. Если она плотная,
   * связанная область добавляется к текущему кластеру.
   * Метки: -2 = не исследована, -1 = шум, 0+ = номер кластера.
   */
  class DBSCAN {
    constructor(points, eps = 7, minPts = 5) {
      this.points = points;
      this.eps = eps;
      this.minPts = minPts;
      this.labels = points.map(() => -2);
      this.visited = points.map(() => false);
      this.clusterCount = 0;
      this.stepCount = 0;
      this.finished = false;
      this.lastSeed = null;
      this.eps2 = eps * eps;
    }

    neighbors(index) {
      const origin = this.points[index];
      const indices = [];
      this.points.forEach((p, j) => { if (distance2(origin, p) <= this.eps2) indices.push(j); });
      return indices;
    }

    step() {
      if (this.finished) return false;
      let index = this.visited.findIndex(v => !v);
      if (index < 0) { this.finished = true; return false; }
      this.visited[index] = true;
      this.lastSeed = index;
      this.stepCount++;
      const adjacent = this.neighbors(index);
      if (adjacent.length < this.minPts) {
        this.labels[index] = -1;
      } else {
        const cluster = this.clusterCount++;
        this.labels[index] = cluster;
        const queue = adjacent.slice();
        const inQueue = new Set(queue);
        let head = 0;
        while (head < queue.length) {
          const j = queue[head++];
          if (!this.visited[j]) {
            this.visited[j] = true;
            const candidates = this.neighbors(j);
            if (candidates.length >= this.minPts) {
              for (const c of candidates) {
                if (!inQueue.has(c)) { queue.push(c); inQueue.add(c); }
              }
            }
          }
          // Точка, прежде считавшаяся шумом, может оказаться на границе кластера.
          if (this.labels[j] === -2 || this.labels[j] === -1) this.labels[j] = cluster;
        }
      }
      this.finished = this.visited.every(Boolean);
      return true;
    }
  }

  // Доступно в browser console: ClusterAlgorithms.KMeans, .DBSCAN и т.д.
  window.ClusterAlgorithms = { KMeans, DBSCAN, generateData, distance2 };
})();
