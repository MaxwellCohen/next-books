import { revalidateTag } from 'next/cache';

export async function POST() {
  revalidateTag('ft-cached-stamp', { expire: 0 });
  return Response.json({ revalidated: 'ft-cached-stamp' });
}
