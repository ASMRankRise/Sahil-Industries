import { ModernPageShell } from '@/components/ModernPageShell';
import { ProductDetailLayout } from '@/components/ProductDetailLayout';

type Cell = { type: string; colSpan: number; rowSpan: number; value: string };
type SourceProduct = { breadcrumb: string; title: string; description: readonly string[]; gallery: readonly string[]; brochure?: string; specificationTables: readonly Cell[][][]; standardFeatures?: readonly string[] };
export function SourceProductPage({ product }: { product: SourceProduct }) {
  return <ModernPageShell eyebrow={product.breadcrumb} title={product.title}><ProductDetailLayout product={product} /></ModernPageShell>;
}
