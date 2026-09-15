'use client';

import Image from 'next/image';
import { useState } from 'react';
import { createPngDataUri } from 'unlazy/thumbhash';
import { Skeleton } from '@/components/ui/skeleton';
import { EMPTY_IMAGE_URL, getLargeBookImageUrl } from '@/features/book/book-constants';
import { cn } from '@/lib/utils';

type Props = {
  title: string;
  src: string | null;
  thumbhash: string | null;
  sizes: string;
  priority?: boolean;
  className?: string;
};

export function BookCover({ className, priority, sizes, src, thumbhash, title }: Props) {
  const resolved = getLargeBookImageUrl(src ?? EMPTY_IMAGE_URL);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const unavailable = failedSrc === resolved;

  return (
    <div className={cn('bg-card dark:bg-card-dark relative aspect-[2/3] w-full overflow-hidden rounded-md', className)}>
      {unavailable ? (
        <div
          aria-label={`Cover unavailable for ${title}`}
          className="text-muted absolute inset-0 flex items-center justify-center p-3 text-center text-sm"
          role="img"
        >
          Cover unavailable
        </div>
      ) : (
        <Image
          alt={title}
          blurDataURL={thumbhash ? createPngDataUri(thumbhash) : undefined}
          className="object-cover"
          fill
          onError={() => setFailedSrc(resolved)}
          placeholder={thumbhash ? 'blur' : 'empty'}
          priority={priority}
          sizes={sizes}
          src={resolved}
        />
      )}
    </div>
  );
}

export function BookCoverSkeleton({ className }: { className?: string }) {
  return <Skeleton className={cn('skeleton-subtle aspect-[2/3] w-full rounded-md', className)} />;
}
