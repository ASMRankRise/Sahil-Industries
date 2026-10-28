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

  return <>
    <header className="site-header">
      <div className="head-grid">
        <Link href="/" className="logo-box"><Image src="/media/logo/logo.png" alt="Sahil Industries" width={183} height={72} priority /></Link>
        <div className="header-main">
          <div className="topline"><span>An ISO 9001:2008 Certified Company</span><div className="top-contact"><a href={`mailto:${siteContact.email}`}><Mail size={14} /> {siteContact.email}</a><Globe2 size={15} /><span className="google">G+</span><Share2 size={15} /></div></div>
          <nav className="desktop-nav" aria-label="Primary navigation">
            {primaryItems.slice(0, 2).map((item) => <Link href={item.href} key={item.href} className={item.href === '/' ? 'active' : ''}>{item.label}</Link>)}
            <div className="products-nav"><button type="button" onClick={() => setProductsOpen(!productsOpen)} aria-expanded={productsOpen}>Products <ChevronDown size={14}/></button>{productsOpen && <div className="dropdown">{productItem?.children?.map((item) => <Link href={item.href} key={item.href} onClick={() => setProductsOpen(false)}>{item.label}</Link>)}</div>}</div>
            {primaryItems.slice(2).map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
          </nav>
        </div>
        <a className="call-box" href={siteContact.phoneHref}><Phone /><span><small>Make a Call</small><b>{siteContact.phone}</b></span></a>
        <button className="mobile-toggle" aria-label="Open navigation" onClick={() => setMenuOpen(true)}><Menu /></button>
      </div>
    </header>
    <AnimatePresence>{menuOpen && <motion.aside className="mobile-menu" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: .25 }}><button onClick={() => setMenuOpen(false)} aria-label="Close navigation"><X /></button><Image src="/media/logo/logo-footer.png" alt="Sahil Industries" width={160} height={64}/>{primaryItems.map((item) => <Link href={item.href} onClick={() => setMenuOpen(false)} key={item.href}>{item.label}</Link>)}<details><summary>Products</summary>{productItem?.children?.map((item) => <Link href={item.href} onClick={() => setMenuOpen(false)} key={item.href}>{item.label}</Link>)}</details></motion.aside>}</AnimatePresence>
  </>;
}
