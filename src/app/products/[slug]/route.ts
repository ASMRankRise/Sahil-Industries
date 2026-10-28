import { notFound } from 'next/navigation';
import { sourcePage } from '@/lib/source-page';

const productSlugs = new Set([
  'single-girder-eot-crane',
  'double-girder-eot-crane',
  'electric-wire-rope-hoist',
  'underslung-cranes',
  'goliath-semi-goliath-crane',
  'jib-crane',
  'monorail-crane',
]);

export const runtime = 'nodejs';

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!productSlugs.has(slug)) notFound();
  return sourcePage(`products/${slug}.html`);
}
