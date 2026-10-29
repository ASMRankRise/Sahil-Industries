import { notFound } from 'next/navigation';
import LegacyContentPage from '@/components/LegacyContentPage';
import SingleGirderPage from '@/components/SingleGirderPage';
import DoubleGirderPage from '@/components/DoubleGirderPage';
import ElectricWireRopeHoistPage from '@/components/ElectricWireRopeHoistPage';
import { SourceProductPage } from '@/components/SourceProductPage';
import { remainingProducts } from '@/data/remaining-products';

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
  if (slug === 'single-girder-eot-crane') return <SingleGirderPage />;
  if (slug === 'double-girder-eot-crane') return <DoubleGirderPage />;
  if (slug === 'electric-wire-rope-hoist') return <ElectricWireRopeHoistPage />;
  if (slug in remainingProducts) return <SourceProductPage product={remainingProducts[slug as keyof typeof remainingProducts]} />;
  const title = products[slug];
  if (!title) notFound();
  return <LegacyContentPage file={`products/${slug}.html`} eyebrow="Products" title={title} />;
}
