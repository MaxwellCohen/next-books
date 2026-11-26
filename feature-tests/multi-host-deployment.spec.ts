import { execSync, spawn } from 'node:child_process';
import { chmodSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { expect, test } from '@playwright/test';
import { evidence, record } from './helpers';

const ROOT = path.join(__dirname, '..');
const PORT = 4102;
const env = { ...process.env, POSTGRES_URL: '' };

test('multi-host-deployment: builds for Node (standalone) and Cloudflare (OpenNext)', async ({ request }) => {
  record({
    claimedLabel: 'third-party',
    method: "Node: first-party output:'standalone'; Cloudflare Workers: @opennextjs/cloudflare build (third-party adapter)",
  });

  // 1) Self-hosted Node target (first-party).
  rmSync(path.join(ROOT, '.next-standalone'), { force: true, recursive: true });
  // A custom distDir makes Next rewrite tsconfig.json; restore it so the run leaves the tree clean.
  const tsconfig = path.join(ROOT, 'tsconfig.json');
  const tsconfigBefore = readFileSync(tsconfig, 'utf8');
  try {
    execSync('npx next build', { cwd: ROOT, env: { ...env, FT_STANDALONE: '1' }, stdio: 'inherit' });
  } finally {
    writeFileSync(tsconfig, tsconfigBefore);
  }
  const server = path.join(ROOT, '.next-standalone', 'standalone', 'server.js');
  expect(existsSync(server)).toBe(true);
  // Boot it to prove the artifact runs (standalone needs static assets copied alongside).
  execSync(
    'cp -r .next-standalone/static .next-standalone/standalone/.next-standalone/static && cp -r public .next-standalone/standalone/public',
    { cwd: ROOT, shell: '/bin/sh' },
  );
  const proc = spawn('node', [server], { env: { ...env, HOSTNAME: '127.0.0.1', PORT: String(PORT) }, stdio: 'ignore' });
  let status = 0;
  try {
    for (let i = 0; i < 60 && status !== 200; i++) {
      await new Promise(r => setTimeout(r, 500));
      status = await request.get(`http://127.0.0.1:${PORT}/feature-tests/multi-host-deployment`).then(r => r.status(), () => 0);
    }
  } finally {
    proc.kill();
  }
  expect(status).toBe(200);

  // 2) Cloudflare Workers target via OpenNext (third-party).
  rmSync(path.join(ROOT, '.open-next'), { force: true, recursive: true });
  // OpenNext shells out to the lockfile's package manager (`pnpm build`); shim it if pnpm isn't installed.
  let PATH = process.env.PATH ?? '';
  try {
    execSync('command -v pnpm', { shell: '/bin/sh', stdio: 'ignore' });
  } catch {
    const shimDir = mkdtempSync(path.join(os.tmpdir(), 'ft-pnpm-'));
    writeFileSync(path.join(shimDir, 'pnpm'), '#!/bin/sh\nexec npx -y pnpm@11.24.0 "$@"\n');
    chmodSync(path.join(shimDir, 'pnpm'), 0o755);
    PATH = `${shimDir}:${PATH}`;
  }
  execSync('npx opennextjs-cloudflare build', { cwd: ROOT, env: { ...env, CLOUDFLARE: '1', PATH }, stdio: 'inherit' });
  const worker = path.join(ROOT, '.open-next', 'worker.js');
  const assets = path.join(ROOT, '.open-next', 'assets');
  expect(existsSync(worker)).toBe(true);
  expect(existsSync(assets)).toBe(true);

  evidence(
    `node: .next-standalone/standalone/server.js built and served /feature-tests/multi-host-deployment with ${status}; cloudflare: .open-next/worker.js + .open-next/assets built by @opennextjs/cloudflare. Netlify (@netlify/plugin-nextjs) and Vercel not built locally`,
  );
});
