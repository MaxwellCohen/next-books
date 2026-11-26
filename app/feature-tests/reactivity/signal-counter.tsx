'use client';
'use no memo';

import { useSignal } from '@preact/signals-react';
import { useSignals } from '@preact/signals-react/runtime';
import { useState } from 'react';

declare global {
  interface Window {
    __ftRenders?: Record<string, number>;
  }
}

function countRender(name: string) {
  if (typeof window === 'undefined') return;
  window.__ftRenders ??= {};
  window.__ftRenders[name] = (window.__ftRenders[name] ?? 0) + 1;
}

// @preact/signals-react: the signal is passed straight into JSX, so the adapter binds it
// to the DOM Text node and updates it without re-running this component.
export function SignalCounter() {
  useSignals();
  countRender('signal');
  const count = useSignal(0);
  return (
    <div>
      <button className="rounded border px-3 py-1" data-testid="signal-inc" onClick={() => count.value++} type="button">
        Increment signal
      </button>{' '}
      <span data-testid="signal-text">{count}</span>
    </div>
  );
}

// Baseline: plain React state re-runs the component on every update.
export function StateCounter() {
  countRender('state');
  const [count, setCount] = useState(0);
  return (
    <div>
      <button className="rounded border px-3 py-1" data-testid="state-inc" onClick={() => setCount(c => c + 1)} type="button">
        Increment state
      </button>{' '}
      <span data-testid="state-text">{count}</span>
    </div>
  );
}
