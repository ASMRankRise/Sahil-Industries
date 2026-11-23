"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { ModernPageShell } from "@/components/ModernPageShell";
import { Reveal } from "@/components/ui/Reveal";
import { contactDetails } from "@/data/contact";
import { ContactForm } from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <ModernPageShell eyebrow="Connect with us" title="Contact Sahil Industries">
      <section className="py-16 md:py-20 lg:py-28">
        <div className="mx-auto grid w-[calc(100%-36px)] grid-cols-1 items-start gap-[clamp(24px,4vw,48px)] md:w-[min(1240px,calc(100%-64px))] lg:grid-cols-2">
          {/* Left Column - Address & Contact Info */}
          <Reveal className="lg:col-start-1 lg:row-start-1">
            <div className="space-y-6">
              <div>
                <p className="mb-4 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.15em] text-safety">
                  <span className="h-0.5 w-8 bg-safety" />
                  Reach our team
                </p>
                <h2 className="mb-6 text-[clamp(34px,4vw,54px)] font-bold leading-[1.06] tracking-[-.05em]">
                  Let&apos;s discuss your lifting requirement.
                </h2>
              </div>
              <div className="border-t border-ink/15 space-y-4">
                <Card icon={<MapPin />} title="Sahil Industries">
                  <p>{contactDetails.address}</p>
                </Card>
                <Card icon={<Phone />} title="Call Us">
                  <p>
                    {contactDetails.phones.map(([phone, href], index) => (
                      <span key={phone} className="block">
                        <a href={href}>{phone}</a>
                      </span>
                    ))}
                  </p>
                </Card>
                <Card icon={<Mail />} title="Email Us">
                  <p>
                    {contactDetails.emails.map((email, index) => (
                      <span key={email} className="block">
                        <a href={`mailto:${email}`}>{email}</a>
                      </span>
                    ))}
                  </p>
                </Card>
              </div>
            </div>
          </Reveal>

          {/* Map */}
          <Reveal delay={0.08} className="lg:col-start-1 lg:row-start-2">
            <iframe
              className="aspect-video min-h-[220px] w-full rounded-xl border-0 grayscale-[.8] lg:h-[220px] lg:shadow-lg"
              src={contactDetails.mapEmbed}
              title="Sahil Industries location"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>

          {/* Right Column - Form (vertically centered) */}
          <Reveal
            delay={0.12}
            className="lg:col-start-2 lg:row-start-1 lg:row-span-2">
            <div className="self-start lg:sticky lg:top-28">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 md:p-8">
                <h3 className="text-xl font-bold mb-6">Send us a Message</h3>
                <ContactForm formType="contact" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </ModernPageShell>
  );
}

function Card({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="grid grid-cols-[48px_minmax(0,1fr)] gap-3.5 border-b border-ink/15 py-5">
      <div className="flex h-10 w-10 items-center justify-center bg-safety/15 text-[#a17d00]">
        {icon}
      </div>
      <section>
        <h3 className="mb-1.5 text-xs font-extrabold uppercase tracking-industrial text-ink">
          {title}
        </h3>
        <div className="text-sm leading-6 text-steel [overflow-wrap:anywhere] [&_a:hover]:text-[#a17d00]">
          {children}
        </div>
      </section>
    </article>
  );
}
