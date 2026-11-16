import { useState } from 'react';

// Сопоставимый React-компонент; JSX обрабатывается сборщиком.
export default function ReactCounter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Нажато: {count}</button>;
}
