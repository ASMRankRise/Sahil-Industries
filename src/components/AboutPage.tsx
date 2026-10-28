import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { reasonsToChoose } from '@/data/about';

export default function AboutPage() {
  return <main>
    <SiteHeader />
    <PageHero eyebrow="About Us" title="Hoist EOT Cranes Manufacturer in India" />
    <section className="about-page-section wrap section"><div className="about-page-copy"><Reveal><p className="eyebrow"><i/>Sahil Industries</p><h2>Sahil Industries</h2><p>Sahil Industries has it&apos;s manufacturing unit in Kolhapur&apos;s prestigious industrial area, five star MIDC, Kagal.</p><p>Our pre-engineered cranes are manufactured as per the IS guidelines and taking into considerations the particular need of our client. We are proud to see our cranes being established globally and internationally, handling a wide variety of materials. Our range of industrial cranes &amp; components is available with lifting capacity of up to 200 tons and includes wire rope hoist or open winch design, as well as Explosion proof cranes, and a variety of crane components.</p><p>Similarly we have more than 100 clients to whom we have designed and provided solutions as per their unique needs, like repairing, maintenance and servicing support. We provide these solutions not only to the products we have manufactured, but any other product of any make, that our client has.</p></Reveal></div><Reveal className="about-page-visual" delay={.1}><Image src="/sahilcrane/about/sahilcrane-img.jpg" alt="Sahil Industries crane manufacturing" width={600} height={470}/><Image className="about-page-orbit" src="/sahilcrane/about/sahilcrane-img-01.jpg" alt="Sahil Industries manufacturing unit" width={210} height={210}/></Reveal></section>
    <section className="director-section"><div className="wrap director-grid"><Reveal><Image src="/sahilcrane/about/abhijit-patil.jpg" alt="Satyajeet Patil and Abhijeet Patil" width={360} height={430}/></Reveal><Reveal delay={.12}><p className="eyebrow"><i/>Satyajeet Patil and Mr Abhijeet Patil</p><h2>About Director</h2><p>Satyajeet Patil and Mr Abhijeet Patil is a young, enthusiastic and ambitious entrepreneur, whose goal in business is to provide the best manufactured goods from their unit. Customer and his needs always come first for Mr Abhijeet and that&apos;s why his designs and solutions are always customer centric.</p><p>If he is not working, which is very rare, he can be seen taking absolutely amazing photographs or reading a book.</p></Reveal></div></section>
    <section className="why section"><div className="why-bg"/><div className="wrap"><div className="title light"><p className="eyebrow"><i/>Why Choose Us<i/></p><h2>Reason For Choosing Us</h2></div><div className="why-grid">{reasonsToChoose.map(([title, description], index) => <Reveal key={title} delay={(index % 3) * .06}><article className="why-card"><ShieldCheck/><em>0{index + 1}</em><h3>{title}</h3><p>{description}</p></article></Reveal>)}</div></div></section>
    <SiteFooter />
  </main>;
}
