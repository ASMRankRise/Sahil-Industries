"use client";

import { Mail, MapPin, Phone } from 'lucide-react';
import { ModernPageShell } from '@/components/ModernPageShell';
import { Reveal } from '@/components/ui/Reveal';
import { siteContact } from '@/data/site';
import { ContactForm } from '@/components/ContactForm';

export default function EnquiryPage() {
  return (
    <ModernPageShell eyebrow="Get in touch" title="Send us an Enquiry">
      <section className="py-28 max-md:py-20">
        <div className="mx-auto w-[min(1240px,calc(100%-64px))] max-md:w-[calc(100%-36px)] grid grid-cols-[minmax(260px,.72fr)_minmax(360px,1fr)] items-start gap-[clamp(45px,8vw,130px)] max-md:grid-cols-1">
          <div>
            <Reveal>
              <p className="mb-4 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.15em] text-safety">
                <span className="h-0.5 w-8 bg-safety" />Contact Sahil Industries
              </p>
              <h2 className="mb-6 text-[clamp(34px,4vw,54px)] font-bold leading-[1.06] tracking-[-.05em]">
                Tell us about your lifting requirement.
              </h2>
              <p className="mb-8 text-steel">We are always happy to respond to your requests. Contact us and we&apos;ll get back to you in the shortest time possible.</p>
              <div className="border-t border-ink/15">
                <Card icon={<MapPin />} title="Address">
                  <p>{siteContact.address}</p>
                </Card>
                <Card icon={<Phone />} title="Call Us">
                  <p><a href={siteContact.phoneHref}>{siteContact.phone}</a></p>
                </Card>
                <Card icon={<Mail />} title="Email Us">
                  <p><a href={`mailto:${siteContact.email}`}>{siteContact.email}</a></p>
                </Card>
              </div>
            </Reveal>
          </div>
          <Reveal delay={.12}>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-bold mb-6">Send Enquiry</h3>
              <ContactForm formType="enquiry" />
            </div>
          </Reveal>
        </div>
      </section>
    </ModernPageShell>
  );
}

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) { 
  return (
    <article className="grid grid-cols-[48px_1fr] gap-3.5 border-b border-ink/15 py-5">
      <div className="flex h-10 w-10 items-center justify-center bg-safety/15 text-[#a17d00]">
        {icon}
      </div>
      <section>
        <h3 className="mb-1.5 text-xs font-extrabold uppercase tracking-industrial text-ink">{title}</h3>
        <div className="text-sm leading-6 text-steel [&_a:hover]:text-[#a17d00]">{children}</div>
      </section>
    </article>
  ); 
}
