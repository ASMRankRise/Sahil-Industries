import { ArrowDownToLine, Check, Image as ImageIcon } from 'lucide-react';
import { ProductSpecificationTable } from '@/components/ProductSpecificationTable';
import Image from 'next/image';

type Cell = { type: string; colSpan: number; rowSpan: number; value: string };
type ProductDetail = { breadcrumb: string; title: string; description: readonly string[]; gallery: readonly string[]; brochure?: string; specificationTables: readonly Cell[][][]; standardFeatures?: readonly string[]; optionalFeatures?: readonly string[]; applicationTypes?: readonly { title: string; description: string }[] };

interface ProductDetailLayoutProps {
  product: ProductDetail;
  onImageClick?: (image: string, index: number, images: readonly string[]) => void;
}

const CONTAINER = "mx-auto w-[calc(100%-36px)] md:w-[min(1240px,calc(100%-64px))]";

/** Modern card-based presentation of the extracted product data. */
export function ProductDetailLayout({ product, onImageClick }: ProductDetailLayoutProps) {
  const [heroImage, ...gallery] = product.gallery;
  const allImages = product.gallery;
  
  const handleImageClick = (image: string, index: number) => {
    onImageClick?.(image, index, allImages);
  };

  return <>
    <section className="py-16 md:py-20 lg:py-28">
      <div className={`${CONTAINER} grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,.9fr)] lg:gap-[clamp(48px,8vw,130px)]`}>
        <div>
          <p className="mb-[18px] flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.15em] text-safety"><span className="h-0.5 w-8 bg-safety" />Product overview</p>
          <h2 className="mb-6 text-[clamp(32px,4vw,58px)] font-bold leading-[1.04] tracking-[-.055em]">{product.title}</h2>
          {product.description.map((paragraph, index) => <p className="text-steel" key={`${index}-${paragraph}`}>{paragraph}</p>)}
          <div className="mt-8 flex flex-wrap items-center gap-5">
            {product.brochure && <a className="inline-flex items-center gap-2 bg-safety px-5 py-4 text-xs font-extrabold uppercase tracking-industrial text-ink" href={product.brochure} target="_blank" rel="noreferrer"><ArrowDownToLine size={17} />Download brochure</a>}
            <a className="inline-flex min-h-11 items-center text-xs font-extrabold uppercase tracking-industrial underline decoration-safety underline-offset-4" href="/enquiry">Request an enquiry</a>
          </div>
        </div>
        {heroImage?.trim() && (
          <button type="button" aria-label={`View image: ${product.title}`} className="lightbox-image relative block aspect-[4/3] w-full overflow-hidden bg-ink text-left shadow-safety focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink lg:min-h-[420px]" onClick={() => handleImageClick(heroImage, 0)}>
            <Image src={heroImage} alt={product.title} fill className="object-cover" sizes="(min-width: 768px) 45vw, 100vw" priority />
            <span className="absolute bottom-4 left-5 z-10 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-industrial text-white"><ImageIcon size={17} />View image</span>
          </button>
        )}
      </div>
    </section>
     {product.applicationTypes && <section className="bg-surface py-20 text-white"><div className="mx-auto w-[min(1240px,calc(100%-64px))] max-md:w-[calc(100%-36px)]"><p className="mb-4 text-[11px] font-extrabold uppercase tracking-[.15em] text-safety">Jib crane solutions</p><h2 className="mb-10 text-[clamp(32px,4vw,52px)] font-bold leading-tight">We provide two types of Jib Cranes</h2><div className="grid gap-5 md:grid-cols-2">{product.applicationTypes.map((item) => <article className="rounded-2xl border border-white/10 bg-ink p-7" key={item.title}><h3 className="mb-4 text-xl font-bold text-safety">{item.title}</h3><p className="text-slate-300">{item.description}</p></article>)}</div></div></section>}
    {(gallery.length > 0 || product.specificationTables.length > 0) && (
      <section className="bg-mist py-14 md:py-[72px]">
        <div className={CONTAINER}>
          {gallery.length > 0 && (
            <div className="mb-11 grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4">
              {gallery.filter((img) => Boolean(img?.trim())).map((image, index) => (
                <button type="button" aria-label={`View image ${index + 2}: ${product.title}`} className="lightbox-image relative block aspect-[4/3] overflow-hidden bg-ink text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink md:h-60 md:w-full" onClick={() => handleImageClick(image, index + 1)} key={`${index}-${image}`}>
                  <Image src={image} alt={`${product.title} ${index + 2}`} fill className="object-cover transition duration-500 hover:scale-105" sizes="(min-width: 1024px) 33vw, (min-width: 540px) 50vw, 100vw" />
                  <span className="absolute bottom-3 left-4 text-[11px] font-extrabold text-safety">0{index + 2}</span>
                </button>
              ))}
            </div>
          )}
          {product.specificationTables.map((rows, index) => (
            <article className="mt-6 min-w-0 border border-ink/15 bg-white p-[clamp(20px,4vw,42px)]" key={index}>
              <div className="mb-7 flex items-center gap-4">
                <span className="text-[13px] font-extrabold text-[#a17d00]">0{index + 1}</span>
                <div>
                  <p className="m-0 text-[10px] font-extrabold uppercase tracking-[.13em] text-[#a17d00]">Technical data</p>
                  <h3 className="m-0 text-xl font-bold">{product.title} specifications</h3>
                </div>
              </div>
              <ProductSpecificationTable rows={[...rows]} caption={`${product.breadcrumb} specification ${index + 1}`} />
            </article>
          ))}
        </div>
      </section>
    )}
    {product.standardFeatures && <FeatureCards eyebrow="Standard features" heading="Engineered into every crane." items={product.standardFeatures} />}
    {product.optionalFeatures && <FeatureCards eyebrow="Optional features" heading="Configure it for your operation." items={product.optionalFeatures} dark />}
  </>;
}

function FeatureCards({ eyebrow, heading, items, dark = false }: { eyebrow: string; heading: string; items: readonly string[]; dark?: boolean }) { return <section className={`py-28 max-md:py-20 ${dark ? 'bg-surface text-white' : 'bg-white'}`}><div className="mx-auto w-[min(1240px,calc(100%-64px))] max-md:w-[calc(100%-36px)]"><p className="mb-[18px] flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.15em] text-safety"><span className="h-0.5 w-8 bg-safety" />{eyebrow}</p><h2 className="mb-10 text-[clamp(34px,4vw,54px)] font-bold leading-[1.06] tracking-[-.05em]">{heading}</h2><div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">{items.map((item, index) => <article key={`${index}-${item}`} className={`relative min-h-[150px] rounded-xl border p-6 ${dark ? 'border-white/15 bg-ink' : 'border-ink/15 bg-white'}`}><span className="text-[10px] font-extrabold text-[#a17d00]">0{index + 1}</span><Check size={18} className="absolute right-6 top-6 text-[#a17d00]" /><p className="mt-8 text-sm font-semibold leading-6">{item}</p></article>)}</div></div></section>; }
