"use client";

import { Mail, MapPin, Phone } from 'lucide-react';
import { ModernPageShell } from '@/components/ModernPageShell';
import { Reveal } from '@/components/ui/Reveal';
import { contactDetails } from '@/data/contact';
import { ContactForm } from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <ModernPageShell eyebrow="Connect with us" title="Contact Sahil Industries">
      <section className="py-28 max-md:py-20">
        <div className="mx-auto grid w-[min(1240px,calc(100%-64px))] grid-cols-[minmax(300px,.9fr)_minmax(320px,1fr)] items-stretch gap-[clamp(45px,7vw,100px)] max-md:w-[calc(100%-36px)] max-md:grid-cols-1">
          <Reveal>
            <div>
              <p className="mb-4 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.15em] text-safety">
                <span className="h-0.5 w-8 bg-safety" />Reach our team
              </p>
              <h2 className="mb-6 text-[clamp(34px,4vw,54px)] font-bold leading-[1.06] tracking-[-.05em]">
                Let&apos;s discuss your lifting requirement.
              </h2>
              <div className="border-t border-ink/15 mb-8">
                <Card icon={<MapPin />} title="Sahil Industries">
                  <p>{contactDetails.address}</p>
                </Card>
                <Card icon={<Phone />} title="Call Us">
                  <p>{contactDetails.phones.map(([phone, href], index) => (
                    <span key={phone}>
                      <a href={href}>{phone}</a>
                      {index < contactDetails.phones.length - 1 && ' · '}
                    </span>
                  ))}</p>
                </Card>
                <Card icon={<Mail />} title="Email Us">
                  <p>{contactDetails.emails.map((email, index) => (
                    <span key={email}>
                      <a href={`mailto:${email}`}>{email}</a>
                      {index < contactDetails.emails.length - 1 && ' · '}
                    </span>
                  ))}</p>
                </Card>
              </div>
              
              {/* Contact Form */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
                <h3 className="text-xl font-bold mb-6">Send us a Message</h3>
                <ContactForm formType="contact" />
              </div>
            </div>
          </Reveal>
          <Reveal delay={.12}>
            <iframe 
              className="min-h-[510px] w-full border-0 grayscale-[.8] max-md:min-h-[380px] rounded-xl" 
              src={contactDetails.mapEmbed} 
              title="Sahil Industries location" 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade" 
            />
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
