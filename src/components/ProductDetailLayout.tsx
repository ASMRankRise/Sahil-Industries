import { ArrowDownToLine, Check, Image as ImageIcon } from 'lucide-react';
import { ProductSpecificationTable } from '@/components/ProductSpecificationTable';

type Cell = { type: string; colSpan: number; rowSpan: number; value: string };
type ProductDetail = { breadcrumb: string; title: string; description: readonly string[]; gallery: readonly string[]; brochure?: string; specificationTables: readonly Cell[][][]; standardFeatures?: readonly string[]; optionalFeatures?: readonly string[] };

/** Modern card-based presentation of the extracted product data. */
export function ProductDetailLayout({ product }: { product: ProductDetail }) {
  const [heroImage, ...gallery] = product.gallery;
  return <>
    <section className="modern-section modern-product-detail"><div className="modern-container"><div className="modern-product-intro"><div className="modern-product-copy"><p className="modern-eyebrow"><span />Product overview</p><h2>{product.title}</h2>{product.description.map((paragraph, index) => <p key={`${index}-${paragraph}`}>{paragraph}</p>)}<div className="modern-product-actions">{product.brochure && <a className="modern-button" href={product.brochure} target="_blank" rel="noreferrer"><ArrowDownToLine size={17} />Download brochure</a>}<a className="modern-text-link" href="/enquiry">Request an enquiry</a></div></div>{heroImage && <a className="modern-product-hero-image lightbox-image" data-fancybox="product-gallery" href={heroImage}><img src={heroImage} alt={product.title} /><span><ImageIcon size={17} />View image</span></a>}</div></div></section>
    {(gallery.length > 0 || product.specificationTables.length > 0) && <section className="modern-product-data"><div className="modern-container">{gallery.length > 0 && <div className="modern-gallery-grid">{gallery.map((image, index) => <a className="modern-gallery-card lightbox-image" data-fancybox="product-gallery" href={image} key={`${index}-${image}`}><img src={image} alt={`${product.title} ${index + 2}`} /><span>0{index + 2}</span></a>)}</div>}{product.specificationTables.map((rows, index) => <article className="modern-spec-card" key={index}><div className="modern-spec-card__title"><span>0{index + 1}</span><div><p>Technical data</p><h3>{product.title} specifications</h3></div></div><ProductSpecificationTable rows={[...rows]} caption={`${product.breadcrumb} specification ${index + 1}`} /></article>)}</div></section>}
    {product.standardFeatures && <FeatureCards eyebrow="Standard features" heading="Engineered into every crane." items={product.standardFeatures} />}
    {product.optionalFeatures && <FeatureCards eyebrow="Optional features" heading="Configure it for your operation." items={product.optionalFeatures} dark />}
  </>;
}

function FeatureCards({ eyebrow, heading, items, dark = false }: { eyebrow: string; heading: string; items: readonly string[]; dark?: boolean }) { return <section className={`modern-section modern-feature-section${dark ? ' modern-feature-section--dark' : ''}`}><div className="modern-container"><p className="modern-eyebrow"><span />{eyebrow}</p><h2 className="modern-page-title">{heading}</h2><div className="modern-feature-grid">{items.map((item, index) => <article key={`${index}-${item}`}><span>0{index + 1}</span><Check size={18} /><p>{item}</p></article>)}</div></div></section>; }
