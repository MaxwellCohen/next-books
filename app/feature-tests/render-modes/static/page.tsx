import { cacheLife } from 'next/cache';

// Fully cached page: prerendered into the build output (cacheComponents model).
export default async function StaticModePage() {
  'use cache';
  cacheLife('max');
  return (
    <div className="px-6 py-5">
      <h1 className="text-xl font-semibold">render-modes: static</h1>
      <p data-testid="stamp">{`${new Date().toISOString()}#${Math.random().toString(36).slice(2, 8)}`}</p>
    </div>
  );
}
