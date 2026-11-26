import { expect, test } from '@playwright/test';
import { evidence, record } from './helpers';

test('image-pipeline: srcset, dimensions, lazy offscreen, modern format', async ({ page, request }) => {
  record({ claimedLabel: 'first-party', method: 'next/image (width/height, sizes, preload) + built-in /_next/image optimizer' });
  await page.goto('/feature-tests/image-pipeline');
  const hero = page.getByTestId('hero');
  const off = page.getByTestId('offscreen');
  const heroAttrs = await hero.evaluate((img: HTMLImageElement) => ({
    height: img.getAttribute('height'),
    loading: img.getAttribute('loading'),
    srcset: img.getAttribute('srcset') ?? '',
    width: img.getAttribute('width'),
  }));
  const offAttrs = await off.evaluate((img: HTMLImageElement) => ({
    complete: img.complete && img.naturalWidth > 0,
    loading: img.getAttribute('loading'),
  }));
  const widths = [...new Set([...heroAttrs.srcset.matchAll(/\s(\d+)w/g)].map(m => Number(m[1])))];
  expect(widths.length).toBeGreaterThanOrEqual(2);
  expect(heroAttrs.width).toBe('800');
  expect(heroAttrs.height).toBe('600');
  expect(offAttrs.loading).toBe('lazy');
  expect(offAttrs.complete, 'offscreen image not loaded before scroll').toBe(false);

  const firstUrl = heroAttrs.srcset.split(',')[0].trim().split(/\s+/)[0];
  const res = await request.get(firstUrl, { headers: { accept: 'image/avif,image/webp,*/*' } });
  const type = res.headers()['content-type'];
  expect(type).toMatch(/image\/(avif|webp)/);
  evidence(
    `srcset widths ${widths.join(',')}; width/height 800x600; offscreen loading=lazy and not fetched before scroll; ${firstUrl} -> ${type} (original is PNG)`,
  );
});
