import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import { getBookById } from '@/features/book/book-queries';
import { BackToBooksLink } from '@/features/book/components/back-to-books-link';
import { BookDetail, BookDetailSkeleton } from '@/features/book/components/book-detail';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: PageProps<'/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const book = await getBookById(id);
  return { description: book.description ?? undefined, title: book.title };
}

export default function Page({ params }: PageProps<'/[id]'>) {
  return (
    <div className="flex flex-1 flex-col px-4 py-5 sm:px-6">
      <BackToBooksLink className="mb-6" />
      <div>
        <AnimatedSuspense fallback={<BookDetailSkeleton />}>
          {params.then(({ id }) => (
            <BookDetail id={id} />
          ))}
        </AnimatedSuspense>
      </div>
    </div>
  );
}
