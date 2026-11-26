export default function MultiHostPage() {
  return (
    <div className="px-6 py-5">
      <h1 className="text-xl font-semibold">multi-host-deployment</h1>
      <p>
        Build-time feature. The test builds for a Node host (<code>output: &apos;standalone&apos;</code>, first-party)
        and for Cloudflare Workers (<code>@opennextjs/cloudflare</code>, third-party) and asserts each output dir.
      </p>
    </div>
  );
}
