import Image from 'next/image';
import Link from 'next/link';
import { Globe2, Mail, MapPin, Phone, Share2 } from 'lucide-react';
import { primaryNavigation, siteContact } from '@/data/site';

export function SiteFooter() {
  const productItem = primaryNavigation.find((item) => item.label === 'Products');
  const links = primaryNavigation.filter((item) => item.label !== 'Home' && item.label !== 'Products');
  const heading = 'mb-5 text-base font-bold text-white';
  const link = 'block py-1.5 text-sm text-slate-300 transition hover:text-safety';
  return <footer className="bg-[#0c131a] text-slate-300"><div className="mx-auto grid w-[min(1240px,calc(100%-64px))] grid-cols-[1.15fr_.75fr_1fr_1.4fr] gap-12 py-20 max-md:grid-cols-2 max-sm:w-[calc(100%-36px)] max-sm:grid-cols-1"><div><Image src="/media/logo/logo-footer.png" alt="Sahil Industries" width={165} height={65} className="h-auto" /><h4 className="mb-3 mt-7 text-sm font-bold text-white">Working Time</h4><p className="text-sm"><b>Tuesday - Sunday :</b><br />09:00 AM - 05:30 PM</p><p className="text-sm"><b>Monday - Closed</b></p><div className="mt-5 flex gap-4 text-safety"><Globe2 size={17}/><span>G+</span><Share2 size={17}/></div></div><div><h3 className={heading}>Quick Links</h3>{links.map((item) => <Link href={item.href} key={item.href} className={link}>{item.label}</Link>)}</div><div><h3 className={heading}>Products</h3>{productItem?.children?.map((item) => <Link href={item.href} key={item.href} className={link}>{item.label}</Link>)}</div><div><h3 className={heading}>Get In Touch</h3><p className="mb-4 flex gap-3 text-sm leading-6"><MapPin className="mt-1 shrink-0 text-safety" size={17}/>{siteContact.address}</p><p className="mb-3 flex gap-3 text-sm"><Phone className="shrink-0 text-safety" size={17}/><a href={siteContact.phoneHref} className="hover:text-safety">{siteContact.phone}</a></p><p className="flex gap-3 text-sm"><Mail className="shrink-0 text-safety" size={17}/><a href={`mailto:${siteContact.email}`} className="hover:text-safety">{siteContact.email}</a></p></div></div><div className="border-t border-white/10 bg-[#080d12] py-5 text-center text-xs text-slate-500">Copyright © 2023 <b>Sahil Industries.</b> All Rights Reserved.</div></footer>;
}
