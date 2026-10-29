import { ModernPageShell } from '@/components/ModernPageShell';
import { ProductDetailLayout } from '@/components/ProductDetailLayout';
import { singleGirderProduct } from '@/data/single-girder';

export default function SingleGirderPage() {
  return <ModernPageShell eyebrow={singleGirderProduct.breadcrumb} title={singleGirderProduct.title}><ProductDetailLayout product={singleGirderProduct} /></ModernPageShell>;
}
