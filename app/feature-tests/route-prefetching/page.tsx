import Link from 'next/link';

// <Link prefetch={true}> + partialPrefetching (next.config.ts): prefetches when the link enters the viewport.
export default function RoutePrefetchingPage() {
  return (
    <div className="px-6 py-5">
      <h1 className="text-xl font-semibold">route-prefetching</h1>
      <p>Scroll down: the link below is prefetched once it becomes visible.</p>
      <div style={{ height: '3000px' }} />
      <Link data-testid="target-link" href="/feature-tests/route-prefetching/target" prefetch={true}>
        Go to prefetch target
      </Link>
    </div>
  );
}
