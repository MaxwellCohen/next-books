import { expect, test } from '@playwright/test';
import { evidence, record } from './helpers';

test('css-inlining: route CSS is inlined as <style>, no render-blocking stylesheet link', async ({ page, request }) => {
  record({ claimedLabel: 'experimental', method: 'experimental.inlineCss: true in next.config.ts + route-scoped CSS module' });
  const html = await (await request.get('/feature-tests/css-inlining')).text();
  const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]);
  const routeStyle = styles.find(s => /ftInlineMarker/.test(s) && /rgb\(1,\s*2,\s*3\)|#010203/.test(s));
  expect(routeStyle, 'inline <style> containing the route CSS module rule').toBeTruthy();
  const stylesheetLinks = [...html.matchAll(/<link[^>]*rel="stylesheet"[^>]*>/g)].map(m => m[0]);
  expect(stylesheetLinks, 'no <link rel=stylesheet> in HTML').toEqual([]);

  const cssRequests: string[] = [];
  page.on('request', r => r.resourceType() === 'stylesheet' && cssRequests.push(r.url()));
  await page.goto('/feature-tests/css-inlining');
  const outline = await page.getByTestId('marker').evaluate(el => getComputedStyle(el).outlineColor);
  expect(outline).toBe('rgb(1, 2, 3)');
  evidence(
    `${styles.length} inline <style> blocks incl. the route module rule; 0 <link rel=stylesheet> in HTML; ${cssRequests.length} stylesheet requests on load; computed outline ${outline}`,
  );
});
