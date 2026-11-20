"use client";

import { Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { ModernPageShell } from '@/components/ModernPageShell';
import { services } from '@/data/services';

export default function ServicesPage() {
  const [openService, setOpenService] = useState<number | null>(null);

  return <ModernPageShell eyebrow="Our capabilities" title="Crane Spare Parts & Maintenance Services in India">
    <section className="py-20 max-md:py-14">
      <div className="mx-auto w-[min(1100px,calc(100%-64px))] max-md:w-[calc(100%-36px)]">
        <p className="mb-10 max-w-2xl text-steel">Explore our complete range of crane spare parts, maintenance, and support services. Select a service to learn more.</p>
        <div className="grid items-start gap-4 md:grid-cols-2">
          {services.map((service, index) => <div key={service.title} className="group h-fit self-start rounded-2xl border border-ink/15 bg-white p-6 shadow-sm transition hover:border-safety/60">
            <button type="button" onClick={() => setOpenService(openService === index ? null : index)} className="flex w-full items-center gap-4 text-left">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-safety/15 text-sm font-extrabold text-[#a17d00]">{String(index + 1).padStart(2, '0')}</span>
              <h2 className="flex-1 text-xl font-bold tracking-[-.03em]">{service.title}</h2>
              <ChevronDown size={20} className={`shrink-0 text-steel transition-transform ${openService === index ? 'rotate-180' : ''}`} />
            </button>
            {openService === index && <div className="ml-14 pt-5 text-steel">
              {service.paragraphs.map((paragraph, paragraphIndex) => <p className="mb-3" key={`${paragraphIndex}-${paragraph}`}>{paragraph}</p>)}
              {service.bullets && <ul className="grid gap-3 text-sm font-semibold sm:grid-cols-2">{service.bullets.map((bullet, bulletIndex) => <li className="flex gap-2" key={`${bulletIndex}-${bullet}`}><Check size={16} className="mt-1 shrink-0 text-[#a17d00]" />{bullet}</li>)}</ul>}
            </div>}
          </div>)}
        </div>
      </div>
    </section>
  </ModernPageShell>;
}
