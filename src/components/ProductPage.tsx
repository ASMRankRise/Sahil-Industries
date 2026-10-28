import { notFound } from 'next/navigation';
import LegacyContentPage from '@/components/LegacyContentPage';

const products: Record<string, string> = {
  'single-girder-eot-crane': 'Single Girder EOT Crane',
  'double-girder-eot-crane': 'Double Girder EOT Crane',
  'electric-wire-rope-hoist': 'Electric Wire Rope Hoist',
  'underslung-cranes': 'Underslung Cranes',
  'goliath-semi-goliath-crane': 'Goliath / Semi Goliath Crane',
  'jib-crane': 'JIB Crane',
  'monorail-crane': 'Monorail Crane',
};

export default function ProductPage({ slug }: { slug: string }) {
  const title = products[slug];
  if (!title) notFound();
  return <LegacyContentPage file={`products/${slug}.html`} eyebrow="Products" title={title} />;
}
