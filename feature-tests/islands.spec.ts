import { expect, test } from '@playwright/test';
import { evidence, record } from './helpers';

const MARKER = 'ft-static-only-code-9c41e7';

test('islands: server component code stays on the server, client island hydrates', async ({ page }) => {
  record({ claimedLabel: 'first-party', method: "React Server Component (static) + one 'use client' component (island)" });
  const scripts: Promise<{ url: string; body: string }>[] = [];
  page.on('response', r => {
    if (r.request().resourceType() === 'script') scripts.push(r.text().then(body => ({ body, url: r.url() })));
  });
  const res = await page.goto('/feature-tests/islands');
  const html = await res!.text();
  await page.waitForLoadState('networkidle');
  await expect(page.getByTestId('static-panel')).toContainText('Marker length: 26');
  const island = page.getByTestId('island');
  await island.click();
  await island.click();
  await expect(island).toHaveText('Island clicks: 2');

  const bodies = await Promise.all(scripts);
  const withMarker = bodies.filter(b => b.body.includes(MARKER)).map(b => b.url);
  const withIsland = bodies.filter(b => b.body.includes('Island clicks')).map(b => b.url);
  expect(withMarker).toEqual([]);
  expect(html.includes(MARKER)).toBe(false);
  expect(withIsland.length).toBeGreaterThan(0);
  evidence(
    `island counter works after hydration (2 clicks -> 2); static-component marker found in 0/${bodies.length} JS files and not in HTML/RSC payload; island code found in ${withIsland.length} chunk(s). Note: no hydrate-on-visible/idle control — every client component hydrates eagerly`,
  );
});
