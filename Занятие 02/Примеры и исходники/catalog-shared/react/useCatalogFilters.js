import { useState } from 'react';
import { defaultFilters } from '../catalog.js';

export function useCatalogFilters() {
  const [query, setQuery] = useState(defaultFilters.query);
  const [year, setYear] = useState(defaultFilters.year);
  const [topic, setTopic] = useState(defaultFilters.topic);
  const [sort, setSort] = useState(defaultFilters.sort);

  function resetFilters() {
    setQuery(defaultFilters.query);
    setYear(defaultFilters.year);
    setTopic(defaultFilters.topic);
    setSort(defaultFilters.sort);
  }

  return { query, year, topic, sort, setQuery, setYear, setTopic, setSort, resetFilters };
}
