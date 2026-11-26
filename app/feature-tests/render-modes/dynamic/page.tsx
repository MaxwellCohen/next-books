import { connection } from 'next/server';
import { Suspense } from 'react';

// Request-time content: connection() opts this subtree out of prerendering.
async function RequestStamp() {
  await connection();
  return <p data-testid="stamp">{`${new Date().toISOString()}#${Math.random().toString(36).slice(2, 8)}`}</p>;
}

export default function DynamicModePage() {
  return (
    <div className="px-6 py-5">
      <h1 className="text-xl font-semibold">render-modes: dynamic</h1>
      <Suspense fallback={<p>loading…</p>}>
        <RequestStamp />
      </Suspense>
    </div>
  );
}
