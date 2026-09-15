'use client';

import { BookMark } from '@/components/book-mark';
import { FastLink } from '@/components/ui/fast-link';
import { buildHref, parseSearchParams } from '@/lib/url-state';
import { useSearchParams } from 'next/navigation';

const linkClass = 'inline-flex items-center gap-2 text-base font-semibold tracking-tight';

export function HomeLink() {
  const searchParams = useSearchParams();
  const href = buildHref({ delay: parseSearchParams(Object.fromEntries(searchParams)).delay });

  return (
    <FastLink aria-label="Next Books home" className={linkClass} href={href} prefetch={true}>
      <BookMark className="text-action size-5" />
      Next Books
    </FastLink>
  );
}

export function HomeLinkFallback() {
  return (
    <FastLink aria-label="Next Books home" className={linkClass} href="/" prefetch={true}>
      <BookMark className="text-action size-5" />
      Next Books
    </FastLink>
  );
}
