// Server Component: no 'use client'. Its code must never reach the browser.
const STATIC_CODE_MARKER = 'ft-static-only-code-9c41e7';

export function StaticPanel() {
  // The marker string itself is never rendered, only its length, so it can only
  // appear on the client if this module's code is shipped.
  return (
    <section data-testid="static-panel">
      <h2 className="font-semibold">Static server component</h2>
      <p>Marker length: {STATIC_CODE_MARKER.length}</p>
    </section>
  );
}
