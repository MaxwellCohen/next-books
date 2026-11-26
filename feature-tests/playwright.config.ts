import { defineConfig } from '@playwright/test';

// Phase "runtime": specs run against `next start` (production build) on PORT 4101.
// Phase "build": build-time specs (bundle-analysis, multi-host-deployment) run commands, no server.
const PORT = Number(process.env.FT_PORT ?? 4101);
const phase = process.env.FT_PHASE ?? 'runtime';
const BUILD_SPECS = ['**/bundle-analysis.spec.ts', '**/multi-host-deployment.spec.ts'];

export default defineConfig({
  fullyParallel: false,
  outputDir: './test-results',
  reporter: [['list'], ['json', { outputFile: `.raw/${phase}.json` }]],
  testDir: '.',
  testIgnore: phase === 'runtime' ? BUILD_SPECS : undefined,
  testMatch: phase === 'runtime' ? '**/*.spec.ts' : BUILD_SPECS,
  timeout: phase === 'runtime' ? 60_000 : 900_000,
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    launchOptions: { executablePath: process.env.FT_CHROME ?? '/home/maxc/.local/bin/google-chrome' },
  },
  webServer:
    phase === 'runtime'
      ? {
          command: `npx next start --hostname 127.0.0.1 --port ${PORT}`,
          cwd: '..',
          env: { POSTGRES_URL: '' },
          reuseExistingServer: false,
          url: `http://127.0.0.1:${PORT}/feature-tests`,
        }
      : undefined,
  workers: 1,
});
