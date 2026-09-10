'use client';

import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/ui/error-state';

export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <ErrorState body="We couldn't load this book's details. Please try again." title="Can't load book">
      <Button className="mt-1" onClick={retry} size="sm" variant="secondary">
        Try again
      </Button>
    </ErrorState>
  );
}
