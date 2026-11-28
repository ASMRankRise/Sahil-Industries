"use client";

import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { MagneticButton, MagneticLink } from "@/components/ui/MagneticButton";
import { siteContact } from "@/data/site";
import { useReducedMotion } from "@/components/animations/hooks/useReducedMotion";

export function ModernPageShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  const prefersReduced = useReducedMotion();

  return (
    <main className="min-h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key="page-content"
          initial={prefersReduced ? undefined : { opacity: 0, y: 20 }}
          animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
          exit={prefersReduced ? undefined : { opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
          <SiteHeader />
          <PremiumPageHero eyebrow={eyebrow} title={title} />
          {children}
          <ModernContactBand />
          <SiteFooter />
        </motion.div>
      </AnimatePresence>
    </main>
  );
}

function PremiumPageHero({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  const prefersReduced = useReducedMotion();

  return (
    <section
      className="hero-section relative isolate flex h-[390px] items-center overflow-hidden bg-cover bg-center py-10 text-white max-md:h-[430px] max-md:py-8"
      style={{ backgroundImage: "url('/sahilcrane/about/about-img.jpg')" }}
      suppressHydrationWarning>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,12,20,.94)_0%,rgba(5,12,20,.72)_42%,rgba(5,12,20,.25)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-ink/40 to-transparent" />

      <div className="mx-auto w-[calc(100%-36px)] md:w-[min(1240px,calc(100%-64px))]">
        <div className="mb-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-white/55">
          <Link href="/" className="transition-colors hover:text-safety">
            Home
          </Link>
          <span>/</span>
          <span className="text-white/80">{eyebrow}</span>
        </div>
        <motion.div
          initial={prefersReduced ? undefined : { opacity: 0, y: 24 }}
          animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <p className="mb-3 flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[.17em] text-safety">
            <span className="h-0.5 w-8 bg-safety" />
            {eyebrow}
          </p>
          <h1 className="max-w-4xl text-[clamp(38px,5vw,64px)] font-bold leading-[.95] tracking-[-.06em] [overflow-wrap:anywhere]">
            {title}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/70">
            Engineered lifting solutions built for safety, reliability, and
            performance.
          </p>
          <div className="mt-5 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-safety bg-safety px-5 py-4 text-xs font-extrabold uppercase tracking-industrial text-ink transition hover:-translate-y-1 hover:bg-yellow-300">
              Explore our solutions <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </div>
      <div className="absolute bottom-5 right-8 hidden items-center gap-3 text-[10px] font-bold uppercase tracking-[.18em] text-white/50 md:flex">
        <span className="h-px w-10 bg-safety" /> Scroll to explore
      </div>
    </section>
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
              <span className="h-0.5 w-8 bg-safety" />
              Let&apos;s build your lifting solution
            </p>
            <h2 className="max-w-2xl text-[clamp(30px,3vw,47px)] font-bold leading-[1.05] tracking-[-.05em]">
              Ready to move your operation forward?
            </h2>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap border border-safety bg-safety px-5 py-4 text-xs font-extrabold uppercase tracking-industrial text-ink transition hover:-translate-y-0.5 hover:bg-yellow-300"
              href="/contact">
              <span>Talk to our team</span>
              <ArrowRight size={17} className="shrink-0" />
            </Link>
            <a
              className="inline-flex items-center justify-center gap-4 whitespace-nowrap text-xs font-extrabold text-white hover:text-safety"
              href={siteContact.phoneHref}>
              <Phone size={17} className="shrink-0" />
              <span>{siteContact.phone}</span>
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-ink py-[70px] text-white">
      <RevealGroup
        staggerChildren={0.1}
        delayChildren={0.1}
        className="mx-auto flex w-[min(1240px,calc(100%-64px))] items-center justify-between gap-8 max-md:w-[calc(100%-36px)] max-md:flex-col max-md:items-start">
        <RevealItem variant="quickEnter">
          <div>
            <motion.p
              className="mb-3 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.15em] text-safety"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}>
              <span className="h-0.5 w-8 bg-safety" />
              Let&apos;s build your lifting solution
            </motion.p>
            <motion.h2
              className="max-w-2xl text-[clamp(30px,3vw,47px)] font-bold leading-[1.05] tracking-[-.05em]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}>
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
              className="inline-flex items-center gap-2 border border-safety bg-safety px-5 py-4 text-xs font-extrabold uppercase tracking-industrial text-ink">
              Talk to our team <ArrowRight size={17} />
            </MagneticLink>
            <MagneticLink
              href={siteContact.phoneHref}
              strength={0.15}
              area={50}
              variant="ghost"
              className="inline-flex items-center gap-4 text-xs font-extrabold text-white hover:text-safety">
              <Phone size={17} />
              {siteContact.phone}
            </MagneticLink>
          </div>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
