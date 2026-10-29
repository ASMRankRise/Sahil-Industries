'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Globe2, Mail, Menu, Phone, Share2, X } from 'lucide-react';
import { useState } from 'react';
import { primaryNavigation, siteContact } from '@/data/site';

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const productItem = primaryNavigation.find((item) => item.label === 'Products');
  const primaryItems = primaryNavigation.filter((item) => !item.children);
  const navClass = 'text-xs font-bold uppercase tracking-industrial text-slate-200 transition-colors hover:text-safety';

  return <>
    <header className="relative z-30 border-b border-white/10 bg-ink text-white"><div className="mx-auto grid min-h-[88px] max-w-[1440px] grid-cols-[252px_1fr_auto] max-lg:grid-cols-[220px_1fr] max-md:flex max-md:min-h-[74px] max-md:items-center max-md:justify-between max-md:px-[18px]">
      <Link href="/" className="flex items-center bg-safety px-[34px] [clip-path:polygon(0_0,100%_0,88%_100%,0_100%)] max-md:bg-transparent max-md:px-0 max-md:[clip-path:none]"><Image src="/media/logo/logo.png" alt="Sahil Industries" width={183} height={72} priority className="h-auto w-[164px] max-md:w-[148px]" /></Link>
      <div className="min-w-0 max-md:hidden"><div className="flex h-[31px] items-center justify-between border-b border-white/10 px-[34px] text-[10px] uppercase tracking-industrial text-slate-400"><span>An ISO 9001:2008 Certified Company</span><div className="flex items-center gap-3"><a href={`mailto:${siteContact.email}`} className="flex items-center gap-2 text-white"><Mail size={14} />{siteContact.email}</a><Globe2 size={15} /><span className="font-extrabold text-safety">G+</span><Share2 size={15} /></div></div><nav className="flex h-[57px] items-center justify-end gap-7 pr-[38px] max-lg:gap-4 max-lg:pr-5" aria-label="Primary navigation">{primaryItems.slice(0, 2).map((item) => <Link href={item.href} key={item.href} className={`${navClass}${item.href === '/' ? ' text-safety' : ''}`}>{item.label}</Link>)}<div className="relative"><button type="button" onClick={() => setProductsOpen(!productsOpen)} aria-expanded={productsOpen} className={`${navClass} flex items-center gap-1`}>Products <ChevronDown size={14}/></button>{productsOpen && <div className="absolute left-[-24px] top-[34px] z-40 w-[285px] border border-safety/40 bg-surface p-2.5 shadow-2xl">{productItem?.children?.map((item) => <Link href={item.href} key={item.href} onClick={() => setProductsOpen(false)} className="block px-3 py-2.5 text-xs text-white hover:bg-safety/10 hover:text-safety">{item.label}</Link>)}</div>}</div>{primaryItems.slice(2).map((item) => <Link href={item.href} key={item.href} className={navClass}>{item.label}</Link>)}</nav></div>
      <a className="flex min-w-[242px] items-center gap-3 border-l border-white/10 px-8 max-lg:hidden" href={siteContact.phoneHref}><Phone className="text-safety"/><span><small className="block text-xs">Make a Call</small><b className="block text-[15px] text-safety">{siteContact.phone}</b></span></a><button className="hidden h-[42px] border-0 bg-safety p-2.5 text-ink max-md:block" aria-label="Open navigation" onClick={() => setMenuOpen(true)}><Menu /></button>
    </div></header>
    <AnimatePresence>{menuOpen && <motion.aside className="fixed inset-y-0 right-0 z-50 flex w-[min(88vw,360px)] flex-col gap-1 bg-ink p-7 text-white shadow-2xl" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: .25 }}><button onClick={() => setMenuOpen(false)} aria-label="Close navigation" className="ml-auto text-safety"><X /></button><Image src="/media/logo/logo-footer.png" alt="Sahil Industries" width={160} height={64} className="my-3 h-auto" />{primaryItems.map((item) => <Link href={item.href} onClick={() => setMenuOpen(false)} key={item.href} className="border-b border-white/10 py-3 text-sm font-bold uppercase tracking-industrial">{item.label}</Link>)}<details className="border-b border-white/10 py-3"><summary className="cursor-pointer text-sm font-bold uppercase tracking-industrial">Products</summary><div className="mt-3 grid gap-2">{productItem?.children?.map((item) => <Link href={item.href} onClick={() => setMenuOpen(false)} key={item.href} className="text-sm text-slate-300">{item.label}</Link>)}</div></details></motion.aside>}</AnimatePresence>
  </>;
}
