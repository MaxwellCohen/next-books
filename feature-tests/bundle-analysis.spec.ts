import { execSync } from 'node:child_process';
import { existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import path from 'node:path';
import { expect, test } from '@playwright/test';
import { evidence, record } from './helpers';

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, '.next', 'diagnostics', 'analyze');

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap(f => {
    const p = path.join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

test('bundle-analysis: `next experimental-analyze --output` writes a report', async () => {
  record({ claimedLabel: 'first-party', method: 'built-in Turbopack analyzer: `next experimental-analyze --output` (16.4.0-canary.8 name)' });
  rmSync(OUT, { force: true, recursive: true });
  const t0 = Date.now();
  execSync('npx next experimental-analyze --output', { cwd: ROOT, env: { ...process.env, POSTGRES_URL: '' }, stdio: 'inherit' });
  expect(existsSync(OUT)).toBe(true);
  const files = walk(OUT);
  const reports = files.filter(f => /\.(html|json|data)$/.test(f) || /analyze/.test(f));
  expect(files.length).toBeGreaterThan(0);
  const html = files.filter(f => f.endsWith('.html'));
  const bytes = files.reduce((n, f) => n + statSync(f).size, 0);
  evidence(
    `analyzer finished in ${Math.round((Date.now() - t0) / 1000)}s; .next/diagnostics/analyze has ${files.length} files (${html.length} html, ${Math.round(bytes / 1024)} KiB), e.g. ${reports.slice(0, 3).map(f => path.relative(ROOT, f)).join(', ')}`,
  );
});
