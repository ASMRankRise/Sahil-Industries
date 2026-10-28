import Image from 'next/image';
import Link from 'next/link';
import { Globe2, Mail, MapPin, Phone, Share2 } from 'lucide-react';
import { primaryNavigation, siteContact } from '@/data/site';

export function SiteFooter() {
  const productItem = primaryNavigation.find((item) => item.label === 'Products');
  const links = primaryNavigation.filter((item) => item.label !== 'Home' && item.label !== 'Products');
  return <footer className="footer"><div className="footer-bg"/><div className="wrap footer-grid"><div><Image src="/media/logo/logo-footer.png" alt="Sahil Industries" width={165} height={65}/><h4>Working Time</h4><p><b>Tuesday - Sunday :</b><br/>09:00 AM - 05:30 PM</p><p><b>Monday - Closed</b></p><div className="social"><Globe2/><span>G+</span><Share2/></div></div><div><h3>Quick Links</h3>{links.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}</div><div><h3>Products</h3>{productItem?.children?.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}</div><div><h3>Get In Touch</h3><p className="address"><MapPin/>{siteContact.address}</p><p className="address"><Phone/><a href={siteContact.phoneHref}>{siteContact.phone}</a></p><p className="address"><Mail/><a href={`mailto:${siteContact.email}`}>{siteContact.email}</a></p></div></div><div className="copyright">Copyright © 2023 <b>Sahil Industries.</b> All Rights Reserved.</div></footer>;
}
