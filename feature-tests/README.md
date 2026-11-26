# Feature tests

Validates each Framework Compare label for Next.js against a production build.

```sh
pnpm install
pnpm test:features        # next build -> runtime specs on `next start` :4101 -> build-time specs -> results.json
node feature-tests/run.mjs --skip-build   # reuse an existing .next build
```

Uses system Chrome (`/home/maxc/.local/bin/google-chrome`, override with `FT_CHROME`) and the preview
catalog (`POSTGRES_URL=''`). Pages live under `app/feature-tests/<featureId>`.

| Feature | Label | What the spec proves |
| --- | --- | --- |
| css-inlining | Experimental | `experimental.inlineCss`: route CSS-module rule is in an inline `<style>`; HTML has no `<link rel=stylesheet>`; style applies. |
| font-optimization | 1st-party | `next/font/google` (Lora): `@font-face` served from `/_next/static/media` with `font-display: swap`, no Google Fonts requests, preload present (Next sends it as an HTTP `Link: rel=preload; as=font` header). |
| image-pipeline | 1st-party | `next/image`: srcset with ≥2 widths, width/height attrs, offscreen image `loading=lazy` and not fetched, `/_next/image` returns WebP/AVIF for a PNG source. |
| caching | 1st-party | `'use cache'` + `cacheLife('hours')` + `cacheTag`: cached stamp identical across requests while a request-time stamp changes; `revalidateTag(tag, {expire: 0})` produces a fresh stamp. |
| route-prefetching | 1st-party | `<Link prefetch>` below the fold: no request before scroll, RSC prefetch request for the target after scrolling it into view, before click. |
| islands | 1st-party | Server Component marker string absent from every JS file and the HTML/RSC payload; `'use client'` counter works after hydration. |
| render-modes | 1st-party | Page-level `'use cache'` route is in `.next/server/app/...html` with a stable stamp equal to the build; `connection()` route's stamp changes per request. |
| reactivity | 3rd-party | `@preact/signals-react`: signal text updates 0→3 while the component's render count stays 1; `useState` baseline re-renders each click. |
| third-party-scripts | 1st-party | `next/script` `lazyOnload` / `afterInteractive`: no parser-blocking script in `<head>`, globals get set after FCP. Also probes `strategy="worker"` (pages/-only) in `app/` and records what happens. |
| bundle-analysis | 1st-party | `next experimental-analyze --output` writes `.next/diagnostics/analyze`. |
| multi-host-deployment | 3rd-party | `output: 'standalone'` (`FT_STANDALONE=1`, into `.next-standalone`) builds and serves on :4102; `@opennextjs/cloudflare build` emits `.open-next/worker.js` + assets. |

Specs record `claimedLabel` / `method` / `evidence` as Playwright annotations; `run.mjs` folds the JSON
reports into `feature-tests/results.json`.
