import { expect, test } from '@playwright/test';
import { evidence, record } from './helpers';

const grab = (html: string, id: string) => html.match(new RegExp(`data-testid="${id}"[^>]*>([^<]+)<`))?.[1];

test("caching: 'use cache' value is reused across requests and refreshed after revalidateTag", async ({ request }) => {
  record({
    claimedLabel: 'first-party',
    method: "cacheComponents + 'use cache' + cacheLife('hours') + cacheTag; revalidateTag(tag, {expire:0}) in a route handler",
  });
  const get = async () => (await request.get('/feature-tests/caching')).text();
  const a = await get();
  const b = await get();
  const [ca, cb] = [grab(a, 'cached-stamp'), grab(b, 'cached-stamp')];
  const [ra, rb] = [grab(a, 'request-stamp'), grab(b, 'request-stamp')];
  expect(ca).toBeTruthy();
  expect(ra).toBeTruthy();
  expect(cb).toBe(ca);
  expect(rb).not.toBe(ra);

  const rev = await request.post('/feature-tests/caching/revalidate');
  expect(rev.ok()).toBe(true);
  const c = await get();
  const d = await get();
  const cc = grab(c, 'cached-stamp');
  const cd = grab(d, 'cached-stamp');
  expect(cc).not.toBe(ca);
  expect(cd).toBe(cc);
  evidence(
    `cached stamp identical over 2 requests (${ca}) while request stamp changed; after revalidateTag -> new cached stamp ${cc}, stable on the next request`,
  );
});
