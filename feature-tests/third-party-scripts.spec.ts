import { expect, test } from '@playwright/test';
import { evidence, record } from './helpers';

declare global {
  interface Window {
    __ftThirdParty?: { ranAt: number };
    __ftThirdPartyAfter?: { ranAt: number };
    __ftThirdPartyWorker?: { ranAt: number; inWorker: boolean };
  }
}

test('third-party-scripts: next/script lazyOnload/afterInteractive do not block render and run', async ({ page }) => {
  record({ claimedLabel: 'first-party', method: 'next/script strategy="lazyOnload" and "afterInteractive" (app/); strategy="worker" probed' });
  const workerReqs: string[] = [];
  page.on('request', r => r.url().includes('third-party-worker') && workerReqs.push(r.url()));
  const res = await page.goto('/feature-tests/third-party-scripts');
  const html = await res!.text();
  const head = html.split('</head>')[0];
  const blocking = [...head.matchAll(/<script(?![^>]*\b(?:async|defer|type="module")\b)[^>]*src="[^"]*third-party[^"]*"[^>]*>/g)];
  expect(blocking, 'no parser-blocking third-party <script src> in <head>').toEqual([]);
  const inHtml = ['third-party.js', 'third-party-after.js', 'third-party-worker.js'].map(f => `${f}:${html.includes(`src="/feature-tests/${f}"`)}`);

  await expect.poll(() => page.evaluate(() => Boolean(window.__ftThirdParty)), { timeout: 15_000 }).toBe(true);
  await expect.poll(() => page.evaluate(() => Boolean(window.__ftThirdPartyAfter)), { timeout: 15_000 }).toBe(true);
  const timing = await page.evaluate(() => ({
    after: window.__ftThirdPartyAfter!.ranAt - performance.timeOrigin,
    fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? null,
    lazy: window.__ftThirdParty!.ranAt - performance.timeOrigin,
    load: (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming).loadEventEnd,
  }));
  if (timing.fcp !== null) expect(timing.lazy).toBeGreaterThan(timing.fcp);

  await page.waitForTimeout(2000);
  const worker = await page.evaluate(() => window.__ftThirdPartyWorker ?? null);
  evidence(
    `no blocking third-party script in <head> (in HTML: ${inHtml.join(', ')}); lazyOnload ran at ${Math.round(timing.lazy)}ms, afterInteractive at ${Math.round(timing.after)}ms, FCP ${timing.fcp === null ? 'n/a' : Math.round(timing.fcp)}ms, load ${Math.round(timing.load)}ms; strategy="worker" in app/: ${workerReqs.length} request(s), global ${worker ? `set (inWorker=${worker.inWorker})` : 'never set'}`,
  );
});
