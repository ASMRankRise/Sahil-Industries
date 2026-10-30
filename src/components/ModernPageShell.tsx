'use client';

import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { PageHero } from '@/components/PageHero';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { MagneticButton, MagneticLink } from '@/components/ui/MagneticButton';
import { siteContact } from '@/data/site';
import { useReducedMotion } from '@/components/animations/hooks/useReducedMotion';

export function ModernPageShell({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  const prefersReduced = useReducedMotion();

  return (
    <main className="min-h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key="page-content"
          initial={prefersReduced ? undefined : { opacity: 0, y: 20 }}
          animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
          exit={prefersReduced ? undefined : { opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <SiteHeader />
          <PageHero eyebrow={eyebrow} title={title} />
          {children}
          <ModernContactBand />
          <SiteFooter />
        </motion.div>
      </AnimatePresence>
    </main>
  );
}

export function ModernContactBand() {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return (
      <section className="bg-ink py-[70px] text-white">
        <div className="mx-auto flex w-[min(1240px,calc(100%-64px))] items-center justify-between gap-8 max-md:w-[calc(100%-36px)] max-md:flex-col max-md:items-start">
          <div>
            <p className="mb-3 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.15em] text-safety">
              <span className="h-0.5 w-8 bg-safety" />Let&apos;s build your lifting solution
            </p>
            <h2 className="max-w-2xl text-[clamp(30px,3vw,47px)] font-bold leading-[1.05] tracking-[-.05em]">Ready to move your operation forward?</h2>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link className="inline-flex items-center gap-2 border border-safety bg-safety px-5 py-4 text-xs font-extrabold uppercase tracking-industrial text-ink transition hover:-translate-y-0.5 hover:bg-yellow-300" href="/contact">Talk to our team <ArrowRight size={17} /></Link>
            <a className="inline-flex items-center gap-2 text-xs font-extrabold text-white hover:text-safety" href={siteContact.phoneHref}><Phone size={17} />{siteContact.phone}</a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-ink py-[70px] text-white">
      <RevealGroup staggerChildren={0.1} delayChildren={0.1} className="mx-auto flex w-[min(1240px,calc(100%-64px))] items-center justify-between gap-8 max-md:w-[calc(100%-36px)] max-md:flex-col max-md:items-start">
        <RevealItem variant="quickEnter">
          <div>
            <motion.p
              className="mb-3 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.15em] text-safety"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <span className="h-0.5 w-8 bg-safety" />Let&apos;s build your lifting solution
            </motion.p>
            <motion.h2
              className="max-w-2xl text-[clamp(30px,3vw,47px)] font-bold leading-[1.05] tracking-[-.05em]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Ready to move your operation forward?
            </motion.h2>
          </div>
        </RevealItem>
        <RevealItem variant="quickEnter">
          <div className="flex flex-wrap items-center gap-4">
            <MagneticLink
              href="/contact"
              strength={0.2}
              area={60}
              variant="primary"
              className="inline-flex items-center gap-2 border border-safety bg-safety px-5 py-4 text-xs font-extrabold uppercase tracking-industrial text-ink"
            >
              Talk to our team <ArrowRight size={17} />
            </MagneticLink>
            <MagneticLink
              href={siteContact.phoneHref}
              strength={0.15}
              area={50}
              variant="ghost"
              className="inline-flex items-center gap-2 text-xs font-extrabold text-white hover:text-safety"
            >
              <Phone size={17} />{siteContact.phone}
            </MagneticLink>
          </div>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
