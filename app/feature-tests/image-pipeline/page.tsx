import Image from 'next/image';

// next/image + the built-in optimizer (/_next/image).
export default function ImagePipelinePage() {
  return (
    <div className="px-6 py-5">
      <h1 className="text-xl font-semibold">image-pipeline</h1>
      <Image
        alt="Above the fold"
        data-testid="hero"
        height={600}
        preload
        sizes="(max-width: 800px) 100vw, 800px"
        src="/feature-tests/sample.png"
        width={800}
      />
      <div style={{ height: '3000px' }} />
      <Image
        alt="Offscreen"
        data-testid="offscreen"
        height={600}
        sizes="(max-width: 800px) 100vw, 800px"
        src="/feature-tests/sample.png"
        width={800}
      />
    </div>
  );
}
