import { expect, test } from '@playwright/test';
import { evidence, record } from './helpers';

const TARGET = '/feature-tests/route-prefetching/target';

test('route-prefetching: scrolling a <Link prefetch> into view fetches the target before click', async ({ page }) => {
  record({ claimedLabel: 'first-party', method: 'next/link <Link prefetch={true}> + partialPrefetching + cacheComponents' });
  const log: { t: number; url: string; prefetch: boolean; phase: string }[] = [];
  let phase = 'load';
  page.on('request', r => {
    const u = new URL(r.url());
    if (u.pathname !== TARGET) return;
    const h = r.headers();
    log.push({ phase, prefetch: Boolean(h['next-router-prefetch']) || h['rsc'] === '1', t: Date.now(), url: u.pathname + u.search });
  });
  await page.goto('/feature-tests/route-prefetching');
  await page.waitForLoadState('networkidle');
  const beforeScroll = log.length;

  phase = 'scroll';
  await page.getByTestId('target-link').scrollIntoViewIfNeeded();
  await expect.poll(() => log.filter(l => l.phase === 'scroll').length, { timeout: 10_000 }).toBeGreaterThan(0);
  await page.waitForLoadState('networkidle');
  const scrollReqs = log.filter(l => l.phase === 'scroll');
  expect(scrollReqs.every(l => l.prefetch)).toBe(true);

  phase = 'click';
  await page.getByTestId('target-link').click();
  await expect(page.getByTestId('target-heading')).toBeVisible();
  const clickReqs = log.filter(l => l.phase === 'click');
  expect(beforeScroll).toBe(0);
  evidence(
    `0 target requests before scroll; ${scrollReqs.length} RSC prefetch request(s) after scrolling link into view (${scrollReqs.map(r => r.url).join(' | ')}); ${clickReqs.length} request(s) on click; navigation rendered target`,
  );
});
