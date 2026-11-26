'use client';

import { useState } from 'react';

export function CounterIsland() {
  const [count, setCount] = useState(0);
  return (
    <button className="rounded border px-3 py-1" data-testid="island" onClick={() => setCount(c => c + 1)} type="button">
      Island clicks: {count}
    </button>
  );
}
