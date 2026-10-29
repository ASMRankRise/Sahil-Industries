import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { PageHero } from '@/components/PageHero';
import { siteContact } from '@/data/site';

export function ModernPageShell({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return <main className="modern-site modern-page"><SiteHeader /><PageHero eyebrow={eyebrow} title={title} />{children}<ModernContactBand /><SiteFooter /></main>;
}

export function ModernContactBand() {
  return <section className="modern-contact-band"><div className="modern-container"><div><p className="modern-eyebrow"><span />Let&apos;s build your lifting solution</p><h2>Ready to move your operation forward?</h2></div><div className="modern-actions"><Link className="modern-button" href="/contact">Talk to our team <ArrowRight size={17} /></Link><a className="modern-phone-link" href={siteContact.phoneHref}><Phone size={17} />{siteContact.phone}</a></div></div></section>;
}
