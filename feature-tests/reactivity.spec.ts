import { expect, test } from '@playwright/test';
import { evidence, record } from './helpers';

test('reactivity: signal updates the text node without re-running the component', async ({ page }) => {
  record({
    claimedLabel: 'third-party',
    method: '@preact/signals-react (useSignals + useSignal, signal passed directly into JSX); useState baseline for contrast',
  });
  await page.goto('/feature-tests/reactivity');
  await page.waitForLoadState('networkidle');
  const renders = () => page.evaluate(() => ({ ...(window.__ftRenders ?? {}) }));
  const initial = await renders();
  expect(initial.signal).toBe(1);

  for (let i = 0; i < 3; i++) await page.getByTestId('signal-inc').click();
  await expect(page.getByTestId('signal-text')).toHaveText('3');
  const afterSignal = await renders();
  expect(afterSignal.signal).toBe(1);

  for (let i = 0; i < 3; i++) await page.getByTestId('state-inc').click();
  await expect(page.getByTestId('state-text')).toHaveText('3');
  const afterState = await renders();
  expect(afterState.state).toBe(initial.state! + 3);
  evidence(
    `signal text 0->3 with SignalCounter render count staying at ${afterSignal.signal}; useState baseline re-rendered ${initial.state}->${afterState.state}`,
  );
});
