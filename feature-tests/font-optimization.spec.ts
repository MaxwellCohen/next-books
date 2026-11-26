import { expect, test } from '@playwright/test';
import { evidence, record } from './helpers';

test('font-optimization: self-hosted, font-display, preloaded', async ({ page }) => {
  record({ claimedLabel: 'first-party', method: "next/font/google (Lora, display: 'swap') in the route" });
  const external: string[] = [];
  const fontReqs: string[] = [];
  page.on('request', r => {
    if (/fonts\.(googleapis|gstatic)\.com/.test(r.url())) external.push(r.url());
    if (r.resourceType() === 'font') fontReqs.push(r.url());
  });
  const res = await page.goto('/feature-tests/font-optimization');
  const html = await res!.text();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState('networkidle');

  // Preload can arrive as an HTML <link rel=preload as=font> or as an HTTP `Link` header
  // (Next emits the header for prerendered pages; same browser semantics).
  const tagPreloads = [...html.matchAll(/<link[^>]*rel="preload"[^>]*as="font"[^>]*href="([^"]+)"/g)].map(m => m[1]);
  const headerPreloads = [...(res!.headers()['link'] ?? '').matchAll(/<([^>]+)>;\s*rel=preload;\s*as="font"/g)].map(m => m[1]);
  const preloads = [...tagPreloads, ...headerPreloads];
  expect(preloads.length).toBeGreaterThan(0);
  expect(preloads.every(h => h.startsWith('/_next/static/media/'))).toBe(true);

  const faces = await page.evaluate(() => {
    const out: { family: string; display: string; src: string }[] = [];
    for (const sheet of Array.from(document.styleSheets)) {
      for (const rule of Array.from(sheet.cssRules)) {
        if (rule instanceof CSSFontFaceRule) {
          out.push({
            display: rule.style.getPropertyValue('font-display'),
            family: rule.style.getPropertyValue('font-family'),
            src: rule.style.getPropertyValue('src'),
          });
        }
      }
    }
    return out;
  });
  // next/font also emits a local() size-adjusted "Lora Fallback" face; check the real webfont faces.
  const lora = faces.filter(f => /Lora/i.test(f.family) && !/Fallback/i.test(f.family));
  expect(lora.length).toBeGreaterThan(0);
  expect(lora.every(f => f.display === 'swap')).toBe(true);
  expect(lora.every(f => f.src.includes('/_next/static/media/'))).toBe(true);
  expect(external).toEqual([]);
  expect(fontReqs.every(u => new URL(u).origin === new URL(page.url()).origin)).toBe(true);
  const family = await page.getByTestId('lora').evaluate(el => getComputedStyle(el).fontFamily);
  expect(family).toMatch(/Lora/);
  evidence(
    `font preloads: ${tagPreloads.length} <link> tags + ${headerPreloads.length} via HTTP Link header (rel=preload; as=font) to /_next/static/media; ${lora.length} Lora @font-face with font-display:swap served from /_next/static/media; 0 requests to Google Fonts; ${fontReqs.length} font requests all same-origin; size-adjusted fallback family present: ${faces.some(f => /Fallback/i.test(f.family))}`,
  );
});
