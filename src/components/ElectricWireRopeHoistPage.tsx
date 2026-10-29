import { ModernPageShell } from '@/components/ModernPageShell';
import { ProductDetailLayout } from '@/components/ProductDetailLayout';
import { electricWireRopeHoistProduct } from '@/data/electric-wire-rope-hoist';

export default function ElectricWireRopeHoistPage() {
  return <ModernPageShell eyebrow={electricWireRopeHoistProduct.breadcrumb} title={electricWireRopeHoistProduct.title}><ProductDetailLayout product={electricWireRopeHoistProduct} /></ModernPageShell>;
}
