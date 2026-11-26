import { Lora } from 'next/font/google';

// next/font/google: downloaded at build, self-hosted under /_next/static/media, preloaded.
const lora = Lora({ display: 'swap', subsets: ['latin'], weight: '400' });

export default function FontOptimizationPage() {
  return (
    <div className="px-6 py-5">
      <h1 className="text-xl font-semibold">font-optimization</h1>
      <p className={lora.className} data-testid="lora">
        This paragraph uses Lora via next/font/google.
      </p>
    </div>
  );
}
