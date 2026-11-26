export default function BundleAnalysisPage() {
  return (
    <div className="px-6 py-5">
      <h1 className="text-xl font-semibold">bundle-analysis</h1>
      <p>
        Build-time feature. The test runs <code>next analyze --output</code> (Turbopack analyzer, built
        into the pinned 16.4.0-canary.8) and asserts the saved report exists.
      </p>
    </div>
  );
}
