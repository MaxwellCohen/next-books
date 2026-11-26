import { cacheLife, cacheTag } from 'next/cache';
import { connection } from 'next/server';
import { Suspense } from 'react';

// cacheComponents: true + 'use cache' + cacheLife('hours') + cacheTag (revalidated by ./revalidate).
async function getCachedStamp() {
  'use cache';
  cacheLife('hours');
  cacheTag('ft-cached-stamp');
  return `${new Date().toISOString()}#${Math.random().toString(36).slice(2, 8)}`;
}

async function CachedStamp() {
  const stamp = await getCachedStamp();
  return <p data-testid="cached-stamp">{stamp}</p>;
}

async function RequestStamp() {
  await connection();
  return <p data-testid="request-stamp">{`${new Date().toISOString()}#${Math.random().toString(36).slice(2, 8)}`}</p>;
}

export default function CachingPage() {
  return (
    <div className="px-6 py-5">
      <h1 className="text-xl font-semibold">caching</h1>
      <CachedStamp />
      <Suspense fallback={<p>loading request stamp…</p>}>
        <RequestStamp />
      </Suspense>
    </div>
  );
}
