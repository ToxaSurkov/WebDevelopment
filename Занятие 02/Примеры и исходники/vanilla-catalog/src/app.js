// Каталог исследований на обычном JavaScript (без React и Svelte).
// Данные те же, что в react-catalog/src/publications.json.
const publications = window.publications;

// В отличие от React, элементы DOM находим и изменяем вручную.
const queryInput = document.getElementById('query');
const yearSelect = document.getElementById('year');
const cards = document.getElementById('cards');
const count = document.getElementById('count');
const empty = document.getElementById('empty');
const resetButton = document.getElementById('reset');
const resetEmptyButton = document.getElementById('reset-empty');

// Создаём DOM-элементы карточки вручную, не используя JSX.
function createCard(publication) {
  const card = document.createElement('article');
  card.className = 'card';

  const metadata = document.createElement('div');
  metadata.className = 'card-meta';
  const year = document.createElement('span');
  year.textContent = publication.year;
  const topic = document.createElement('span');
  topic.textContent = publication.topic;
  metadata.append(year, topic);

  const title = document.createElement('h3');
  title.textContent = publication.title;
  const description = document.createElement('p');
  description.textContent = publication.description;
  const authors = document.createElement('p');
  authors.className = 'authors';
  authors.textContent = publication.authors;

  card.append(metadata, title, description, authors);
  return card;
}

// Сравниваем запрос и год с данными публикации.
function matchesFilters(publication) {
  const query = queryInput.value.trim().toLowerCase();
  const year = yearSelect.value;
  const matchesSearch = publication.title.toLowerCase().includes(query)
    || publication.topic.toLowerCase().includes(query);
  const matchesYear = year === 'all' || String(publication.year) === year;
  return matchesSearch && matchesYear;
}

// Ключевое различие с React: сами указываем, какие DOM-элементы менять.
function renderCatalog() {
  const visible = publications.filter(matchesFilters);
  cards.replaceChildren(...visible.map(createCard));
  count.textContent = visible.length;
  empty.hidden = visible.length > 0;
  cards.hidden = visible.length === 0;
}

function resetFilters() {
  queryInput.value = '';
  yearSelect.value = 'all';
  renderCatalog();
}

// Любое изменение фильтра запускает обновление карточек, счётчика и пустой выдачи.
queryInput.addEventListener('input', renderCatalog);
yearSelect.addEventListener('change', renderCatalog);
resetButton.addEventListener('click', resetFilters);
resetEmptyButton.addEventListener('click', resetFilters);

renderCatalog(); // первый показ девяти публикаций
