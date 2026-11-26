import Script from 'next/script';

// next/script strategies available in app/: afterInteractive and lazyOnload.
// strategy="worker" is experimental and pages/-only; it is included here to record what app/ does with it.
export default function ThirdPartyScriptsPage() {
  return (
    <div className="px-6 py-5">
      <h1 className="text-xl font-semibold">third-party-scripts</h1>
      <p>Loads stand-in third-party scripts from /feature-tests/*.js.</p>
      <Script src="/feature-tests/third-party.js" strategy="lazyOnload" />
      <Script src="/feature-tests/third-party-after.js" strategy="afterInteractive" />
      <Script src="/feature-tests/third-party-worker.js" strategy="worker" />
    </div>
  );
}
