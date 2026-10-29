import { Mail, MapPin, Phone } from 'lucide-react';
import { ModernPageShell } from '@/components/ModernPageShell';
import { Reveal } from '@/components/ui/Reveal';
import { contactDetails } from '@/data/contact';

export default function ContactPage() {
  return <ModernPageShell eyebrow="Connect with us" title="Contact Sahil Industries"><section className="modern-section"><div className="modern-container modern-contact-grid"><Reveal><div><p className="modern-eyebrow"><span />Reach our team</p><h2 className="modern-page-title">Let&apos;s discuss your lifting requirement.</h2><div className="modern-contact-cards"><Card icon={<MapPin />} title="Sahil Industries"><p>{contactDetails.address}</p></Card><Card icon={<Phone />} title="Call Us"><p>{contactDetails.phones.map(([phone, href], index) => <span key={phone}><a href={href}>{phone}</a>{index < contactDetails.phones.length - 1 && ' · '}</span>)}</p></Card><Card icon={<Mail />} title="Email Us"><p>{contactDetails.emails.map((email, index) => <span key={email}><a href={`mailto:${email}`}>{email}</a>{index < contactDetails.emails.length - 1 && ' · '}</span>)}</p></Card></div></div></Reveal><Reveal delay={.12}><iframe className="modern-map" src={contactDetails.mapEmbed} title="Sahil Industries location" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></Reveal></div></section></ModernPageShell>;
}

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) { return <article className="modern-contact-card"><div>{icon}</div><section><h3>{title}</h3>{children}</section></article>; }
