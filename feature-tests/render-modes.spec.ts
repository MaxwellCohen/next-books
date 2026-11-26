import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { expect, test } from '@playwright/test';
import { evidence, record } from './helpers';

const grab = (html: string) => html.match(/data-testid="stamp"[^>]*>([^<]+)</)?.[1];
const APP = path.join(__dirname, '..', '.next', 'server', 'app', 'feature-tests', 'render-modes');

test('render-modes: prerendered static route vs per-request dynamic route', async ({ request }) => {
  record({
    claimedLabel: 'first-party',
    method: "cacheComponents model: page-level 'use cache' + cacheLife('max') (prerendered) vs connection() in <Suspense> (request-time)",
  });
  const staticFile = path.join(APP, 'static.html');
  expect(existsSync(staticFile)).toBe(true);
  const buildStamp = grab(readFileSync(staticFile, 'utf8'));
  const s1 = grab(await (await request.get('/feature-tests/render-modes/static')).text());
  const s2 = grab(await (await request.get('/feature-tests/render-modes/static')).text());
  expect(buildStamp).toBeTruthy();
  expect(s1).toBe(buildStamp);
  expect(s2).toBe(buildStamp);

  const d1 = grab(await (await request.get('/feature-tests/render-modes/dynamic')).text());
  const d2 = grab(await (await request.get('/feature-tests/render-modes/dynamic')).text());
  expect(d1).toBeTruthy();
  expect(d2).toBeTruthy();
  expect(d1).not.toBe(d2);
  const dynamicShell = path.join(APP, 'dynamic.html');
  const shellHasStamp = existsSync(dynamicShell) && Boolean(grab(readFileSync(dynamicShell, 'utf8')));
  expect(shellHasStamp).toBe(false);
  evidence(
    `static: .next/server/app/.../static.html exists, served stamp == build stamp (${buildStamp}) on 2 requests; dynamic: stamp differs per request (${d1} vs ${d2}), prerendered shell has no stamp (PPR hole)`,
  );
});
