import Link from 'next/link';

export default function RenderModesPage() {
  return (
    <div className="px-6 py-5">
      <h1 className="text-xl font-semibold">render-modes</h1>
      <ul className="list-disc pl-6">
        <li>
          <Link href="/feature-tests/render-modes/static">static (prerendered at build)</Link>
        </li>
        <li>
          <Link href="/feature-tests/render-modes/dynamic">dynamic (rendered per request)</Link>
        </li>
      </ul>
    </div>
  );
}
