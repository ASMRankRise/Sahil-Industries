import Link from 'next/link';
import { ArrowRight, Check, Download, Phone } from 'lucide-react';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { HeroMotion } from '@/components/ui/HeroMotion';
import { HeroSliderBackdrop } from '@/components/ui/HeroSliderBackdrop';
import { Reveal } from '@/components/ui/Reveal';
import { reasonsToChoose } from '@/data/about';
import { clientLogos, homeProducts, industries } from '@/data/home';
import { siteContact } from '@/data/site';

const asset = (path: string) => `/sahilcrane/${path}`;

function Eyebrow({ children }: { children: React.ReactNode }) { return <p className="modern-eyebrow"><span />{children}</p>; }
function Heading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) { return <div className="modern-heading"><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2>{copy && <p>{copy}</p>}</div>; }

export default function ModernHomePage() {
  return <main className="modern-site">
    <SiteHeader />
    <section className="modern-hero">
      <HeroSliderBackdrop />
      <div className="modern-hero__grid" />
      <HeroMotion />
      <div className="modern-container modern-hero__content">
        <Reveal><Eyebrow>Engineered material handling</Eyebrow><h1>Precision lifting.<br /><em>Built for industry.</em></h1><p>Manufacturing EOT cranes and hoists for dependable, safe material movement across India.</p><div className="modern-actions"><Link className="modern-button" href="/enquiry">Request a consultation <ArrowRight size={17} /></Link><Link className="modern-button modern-button--ghost" href="/products/single-girder-eot-crane">Explore products</Link></div></Reveal>
      </div>
      <div className="modern-hero__metrics modern-container"><div><b>22<sup>+</sup></b><span>Years of industry experience</span></div><div><b>100<sup>+</sup></b><span>Satisfied crane customers</span></div><div><b>200</b><span>Tons lifting capacity</span></div></div>
    </section>

    <section className="modern-section modern-intro">
      <div className="modern-container modern-intro__grid"><Reveal><div className="modern-image-stack"><img src={asset('home/about-01.jpg')} alt="Sahil Industries crane manufacturing" /><div className="modern-image-stack__stamp">ISO<br /><b>9001:2008</b></div></div></Reveal><Reveal delay={0.12}><div><Heading eyebrow="Sahil Industries" title="A capable partner for every lift." copy="We are an ISO 9001:2008 certified manufacturer and solution partner for industrial EOT cranes and hoists." /><p>For more than two decades, we have engineered material handling equipment to IS guidelines and supported customers with installation, maintenance, repair, and service for cranes of any make.</p><ul className="modern-checklist"><li><Check size={16} /> Pre-engineered industrial cranes</li><li><Check size={16} /> Purpose-built lifting solutions</li><li><Check size={16} /> Service support across equipment makes</li></ul><Link href="/about" className="modern-text-link">Discover our company <ArrowRight size={16} /></Link></div></Reveal></div>
    </section>

    <section className="modern-section modern-products"><div className="modern-container"><Heading eyebrow="Our product range" title="Material handling, made dependable." copy="Purpose-engineered equipment for demanding industrial environments." /><div className="modern-product-grid">{homeProducts.map((product, index) => <Reveal key={product.title} delay={(index % 4) * 0.06}><Link href={product.href ?? '/'} className="modern-product-card"><img src={asset(`products/${product.image}`)} alt={product.title} /><div><span>0{index + 1}</span><h3>{product.title}</h3><ArrowRight size={19} /></div></Link></Reveal>)}</div><div className="modern-center"><Link href="/products/single-girder-eot-crane" className="modern-button modern-button--dark">View all products <ArrowRight size={17} /></Link></div></div></section>

    <section className="modern-section modern-capabilities"><div className="modern-container"><Heading eyebrow="Why Sahil" title="Built around operational confidence." /><div className="modern-capability-grid">{reasonsToChoose.map(([title, copy], index) => <Reveal key={title} delay={index * 0.05}><article className="modern-capability"><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article></Reveal>)}</div></div></section>

    <section className="modern-section modern-industries"><div className="modern-container"><Heading eyebrow="Industries we serve" title="Designed to perform wherever work moves." /><div className="modern-industry-grid">{industries.map((industry) => <article key={industry.title} className="modern-industry-card"><img src={asset(`industries-we-serve/${industry.image}`)} alt="" /><span>{industry.title}</span></article>)}</div></div></section>

    <section className="modern-section modern-clients"><div className="modern-container"><Heading eyebrow="Trusted partnerships" title="Proud to support leading manufacturers." /><div className="modern-client-grid">{clientLogos.map((logo) => <div key={logo}><img src={asset(`customers/${logo}`)} alt="Sahil Industries customer" /></div>)}</div><div className="modern-center"><Link href="/clients" className="modern-text-link">Meet our clients <ArrowRight size={16} /></Link></div></div></section>

    <section className="modern-contact-band"><div className="modern-container"><div><Eyebrow>Let’s build your lifting solution</Eyebrow><h2>Ready to move your operation forward?</h2></div><div className="modern-actions"><Link className="modern-button" href="/contact">Talk to our team <ArrowRight size={17} /></Link><a className="modern-phone-link" href={siteContact.phoneHref}><Phone size={17} />{siteContact.phone}</a><a className="modern-download" href="/sahilcrane/broucher/girder-eot-crane.pdf" target="_blank" rel="noreferrer"><Download size={16} />Brochure</a></div></div></section>
    <SiteFooter />
  </main>;
}
