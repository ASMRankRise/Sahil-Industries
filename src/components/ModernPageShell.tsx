import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { PageHero } from '@/components/PageHero';
import { siteContact } from '@/data/site';

export function ModernPageShell({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return <main><SiteHeader /><PageHero eyebrow={eyebrow} title={title} />{children}<ModernContactBand /><SiteFooter /></main>;
}

export function ModernContactBand() {
  return <section className="bg-ink py-[70px] text-white"><div className="mx-auto flex w-[min(1240px,calc(100%-64px))] items-center justify-between gap-8 max-md:w-[calc(100%-36px)] max-md:flex-col max-md:items-start"><div><p className="mb-3 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.15em] text-safety"><span className="h-0.5 w-8 bg-safety" />Let&apos;s build your lifting solution</p><h2 className="max-w-2xl text-[clamp(30px,3vw,47px)] font-bold leading-[1.05] tracking-[-.05em]">Ready to move your operation forward?</h2></div><div className="flex flex-wrap items-center gap-4"><Link className="inline-flex items-center gap-2 border border-safety bg-safety px-5 py-4 text-xs font-extrabold uppercase tracking-industrial text-ink transition hover:-translate-y-0.5 hover:bg-yellow-300" href="/contact">Talk to our team <ArrowRight size={17} /></Link><a className="inline-flex items-center gap-2 text-xs font-extrabold text-white hover:text-safety" href={siteContact.phoneHref}><Phone size={17} />{siteContact.phone}</a></div></div></section>;
}
