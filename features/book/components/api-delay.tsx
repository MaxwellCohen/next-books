'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useOptimistic, useTransition } from 'react';
import { Range } from '@/components/ui/range';
import {
  API_DELAY_VALUES,
  buildHref,
  formatApiDelay,
  getApiDelayMs,
  parseSearchParams,
} from '@/lib/url-state';

export function ApiDelay({ idPrefix }: { idPrefix: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = parseSearchParams(Object.fromEntries(searchParams));
  const committed = getApiDelayMs(current);
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useOptimistic(committed);

  function commit(next: number) {
    startTransition(() => {
      setValue(next);
      const params = { ...current, delay: next === 0 ? undefined : String(next) };
      if (!params.delay) delete params.delay;
      router.replace(buildHref(params), { scroll: false });
    });
  }

  return (
    <div data-filtering={isPending ? '' : undefined}>
      <Range
        hint={
          <>
            <span>Off</span>
            <span>3s</span>
          </>
        }
        id={`${idPrefix}-api-delay`}
        label="API delay"
        onValueChange={commit}
        readout={formatApiDelay(value)}
        value={value}
        values={API_DELAY_VALUES}
      />
    </div>
  );
}

export function ApiDelayFallback({ idPrefix }: { idPrefix: string }) {
  return (
    <Range
      hint={
        <>
          <span>Off</span>
          <span>3s</span>
        </>
      }
      id={`${idPrefix}-api-delay`}
      label="API delay"
      onValueChange={() => undefined}
      readout="Off"
      value={0}
      values={API_DELAY_VALUES}
    />
  );
}
