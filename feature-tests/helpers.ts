import { test } from '@playwright/test';

export type Label = 'first-party' | 'experimental' | 'third-party' | 'manual';

/** Record result metadata on the test; run.mjs folds it into results.json. */
export function record(info: { claimedLabel: Label; method: string; suggestedLabel?: Label }) {
  const t = test.info();
  t.annotations.push({ description: info.claimedLabel, type: 'claimedLabel' });
  t.annotations.push({ description: info.method, type: 'method' });
  if (info.suggestedLabel) t.annotations.push({ description: info.suggestedLabel, type: 'suggestedLabel' });
}

export function evidence(text: string) {
  test.info().annotations.push({ description: text, type: 'evidence' });
}
