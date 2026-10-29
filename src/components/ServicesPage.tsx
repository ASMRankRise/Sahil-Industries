import { Check } from 'lucide-react';
import { ModernPageShell } from '@/components/ModernPageShell';
import { Reveal } from '@/components/ui/Reveal';
import { services } from '@/data/services';

export default function ServicesPage() { return <ModernPageShell eyebrow="Our capabilities" title="Crane Spare Parts & Maintenance Services in India"><section className="modern-section"><div className="modern-container modern-service-list">{services.map((service, index) => <Reveal key={service.title} delay={index * .05}><article className="modern-service"><span>0{index + 1}</span><div><h2>{service.title}</h2>{service.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{service.bullets && <ul>{service.bullets.map((bullet) => <li key={bullet}><Check size={16} />{bullet}</li>)}</ul>}</div></article></Reveal>)}</div></section></ModernPageShell>; }
