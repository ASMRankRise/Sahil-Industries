import { ModernPageShell } from '@/components/ModernPageShell';
import { ProductDetailLayout } from '@/components/ProductDetailLayout';
import { doubleGirderProduct } from '@/data/double-girder';

export default function DoubleGirderPage() {
  return <ModernPageShell eyebrow={doubleGirderProduct.breadcrumb} title={doubleGirderProduct.title}><ProductDetailLayout product={doubleGirderProduct} /></ModernPageShell>;
}
