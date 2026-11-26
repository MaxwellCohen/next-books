import Link from 'next/link';
import { FEATURE_IDS } from './features';

export const metadata = { title: 'Feature tests' };

export default function FeatureTestsIndex() {
  return (
    <div className="px-6 py-5">
      <h1 className="mb-4 text-xl font-semibold">Feature tests</h1>
      <ul className="list-disc pl-6">
        {FEATURE_IDS.map(id => (
          <li key={id}>
            <Link href={`/feature-tests/${id}` as never} prefetch={false}>
              {id}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
