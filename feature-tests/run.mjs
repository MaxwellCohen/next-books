// Build, serve (next start on 4101 via Playwright webServer), run all feature specs, write results.json.
import { execSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const env = { ...process.env, POSTGRES_URL: '' };
const FEATURES = [
  'css-inlining', 'font-optimization', 'image-pipeline', 'caching', 'route-prefetching', 'islands',
  'render-modes', 'reactivity', 'bundle-analysis', 'third-party-scripts', 'multi-host-deployment',
];

if (!process.argv.includes('--skip-build')) execSync('npx next build', { cwd: ROOT, env, stdio: 'inherit' });
// Snapshot the commit the run tested before build-phase specs rebuild .next.
const commit = execSync('git rev-parse HEAD', { cwd: ROOT }).toString().trim();

for (const phase of ['runtime', 'build']) {
  spawnSync('npx', ['playwright', 'test', '-c', 'playwright.config.ts'], {
    cwd: HERE,
    env: { ...env, FT_PHASE: phase },
    stdio: 'inherit',
  });
}

const results = {};
for (const phase of ['runtime', 'build']) {
  const file = path.join(HERE, '.raw', `${phase}.json`);
  if (!existsSync(file)) continue;
  const report = JSON.parse(readFileSync(file, 'utf8'));
  const visit = suite => {
    for (const spec of suite.specs ?? []) {
      for (const t of spec.tests) {
        const r = t.results.at(-1);
        const ann = Object.fromEntries((r?.annotations ?? t.annotations ?? []).map(a => [a.type, a.description]));
        const id = path.basename(spec.file, '.spec.ts');
        const err = r?.error?.message?.replace(/\u001b\[[0-9;]*m/g, '').split('\n').filter(Boolean).slice(0, 2).join(' ');
        results[id] = {
          claimedLabel: ann.claimedLabel,
          status: r?.status === 'passed' ? 'pass' : 'fail',
          method: ann.method,
          evidence: ann.evidence ?? (err ? `FAILED: ${err}` : r?.status),
          ...(ann.suggestedLabel ? { suggestedLabel: ann.suggestedLabel } : {}),
          test: `feature-tests/${id}.spec.ts`,
        };
      }
    }
    for (const s of suite.suites ?? []) visit(s);
  };
  for (const s of report.suites) visit(s);
}
for (const id of FEATURES) results[id] ??= { status: 'blocked', evidence: 'spec did not run', test: `feature-tests/${id}.spec.ts` };

const ordered = Object.fromEntries(FEATURES.map(id => [id, results[id]]));
const out = { framework: 'next', repo: 'next-books', commit, ranAt: new Date().toISOString(), results: ordered };
writeFileSync(path.join(HERE, 'results.json'), JSON.stringify(out, null, 2) + '\n');
console.log(Object.entries(ordered).map(([k, v]) => `${v.status.padEnd(7)} ${k}`).join('\n'));
