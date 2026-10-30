"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Download,
  Phone,
  Shield,
  Award,
  Users,
} from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { HeroMotion } from "@/components/ui/HeroMotion";
import { HeroSliderBackdrop } from "@/components/ui/HeroSliderBackdrop";
import { IndustriesCarousel } from "@/components/ui/IndustriesCarousel";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { TextRevealLine } from "@/components/ui/TextReveal";
import { Parallax, ParallaxLayer } from "@/components/ui/Parallax";
import { MagneticButton, MagneticLink } from "@/components/ui/MagneticButton";
import { reasonsToChoose } from "@/data/about";
import { clientLogos, homeProducts, industries } from "@/data/home";
import { siteContact } from "@/data/site";
import { useReducedMotion } from "@/components/animations/hooks/useReducedMotion";

const asset = (path: string) => `/sahilcrane/${path}`;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-[18px] flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.15em] text-safety">
      <span className="h-0.5 w-8 bg-safety" />
      {children}
    </p>
  );
}

function Heading({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
}) {
  return (
    <div className="mb-12 max-w-[690px]">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="m-0 text-[clamp(34px,4vw,55px)] font-bold leading-[1.05] tracking-[-.052em]">
        {title}
      </h2>
      {copy && <p className="mt-4 text-base text-steel">{copy}</p>}
    </div>
  );
}

export default function ModernHomePage() {
  const prefersReduced = useReducedMotion();

  // About section image animation controls for continuous hover loop
  const aboutControls1 = useAnimation();
  const [aboutHovered1, setAboutHovered1] = useState(false);
  const aboutControls2 = useAnimation();
  const [aboutHovered2, setAboutHovered2] = useState(false);

  useEffect(() => {
    if (aboutHovered1) {
      aboutControls1.start({ rotate: [-2, 2, -2] }, { repeat: Infinity, repeatType: "loop", duration: 2, ease: "linear" });
    } else {
      aboutControls1.stop();
      aboutControls1.set({ rotate: 0 });
    }
  }, [aboutHovered1, aboutControls1]);

  useEffect(() => {
    if (aboutHovered2) {
      aboutControls2.start({ rotate: [-2, 2, -2] }, { repeat: Infinity, repeatType: "loop", duration: 2, ease: "linear" });
    } else {
      aboutControls2.stop();
      aboutControls2.set({ rotate: 0 });
    }
  }, [aboutHovered2, aboutControls2]);

  return (
    <main>
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative flex min-h-[710px] items-center overflow-hidden bg-ink text-white max-md:min-h-[650px]">
        {/* Background slider with enhanced transitions */}
        <HeroSliderBackdrop />
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(246,197,21,.22)_1px,transparent_1px),linear-gradient(90deg,rgba(246,197,21,.22)_1px,transparent_1px)] [background-size:74px_74px]" />
        
        {/* Radial gradient glow for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-safety/10 via-transparent to-transparent opacity-50" aria-hidden="true" />
        
        {/* HeroMotion GSAP animations */}
        <HeroMotion />

        {/* Main content */}
        <div className="relative z-10 mx-auto w-[min(1240px,calc(100%-64px))] py-[114px] pb-[158px] max-md:w-[calc(100%-36px)] max-md:py-[88px] max-md:pb-[180px]">
          <RevealGroup staggerChildren={0.1} delayChildren={0.1}>
            {/* Eyebrow with enhanced animation */}
            <RevealItem variant="quickEnter">
              <motion.div
                className="mb-[18px] flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.15em] text-safety"
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                <motion.span
                  className="h-0.5 w-8 bg-safety"
                  initial={{ width: 0 }}
                  animate={{ width: '2rem' }}
                  transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                />
                <span>Engineered material handling</span>
              </motion.div>
            </RevealItem>

            {/* Headline with proper h1 and enhanced Framer Motion line-by-line animation */}
            <RevealItem variant="quickEnter">
              <h1 className="m-0 max-w-[800px] text-[clamp(48px,6vw,88px)] font-bold leading-[.98] tracking-[-.065em]">
                <motion.div
                  className="block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
                  <motion.span
                    className="block"
                    initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
                    Precision lifting.
                  </motion.span>
                  <motion.span
                    className="block not-italic text-safety relative"
                    initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}>
                    Built for industry.
                    <motion.span
                      className="absolute -bottom-1 left-0 right-0 h-1 bg-safety/30"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </motion.span>
                </motion.div>
              </h1>
            </RevealItem>

            {/* Description with enhanced animation */}
            <RevealItem variant="quickEnter">
              <motion.p
                className="my-7 max-w-[520px] text-[17px] leading-7 text-slate-200 max-md:text-[15px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
                Manufacturing EOT cranes and hoists for dependable, safe
                material movement across India.
              </motion.p>
            </RevealItem>

            {/* CTA Buttons with enhanced styling */}
            <RevealItem variant="quickEnter">
              <div className="flex flex-wrap gap-4 max-md:grid max-md:grid-cols-1">
                <MagneticLink
                  href="/enquiry"
                  strength={0.25}
                  area={80}
                  variant="primary"
                  className="group inline-flex items-center justify-center gap-3 border border-safety bg-safety px-6 py-7.5 text-xs font-extrabold uppercase tracking-industrial text-ink shadow-lg shadow-safety/25 hover:shadow-xl hover:shadow-safety/40 transition-all duration-300">
                  <span className="relative z-10">Request a consultation</span>
                  <motion.div
                    className="absolute inset-0 bg-safety/20"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                </MagneticLink>
                <MagneticLink
                  href="/products/single-girder-eot-crane"
                  strength={0.15}
                  area={60}
                  variant="secondary"
                  className="group inline-flex items-center justify-center gap-3 border border-white/60 bg-white/5 px-7 py-4.5 text-xs font-extrabold uppercase tracking-industrial text-white backdrop-blur-sm hover:bg-white/10 hover:border-white/80 transition-all duration-300">
                  <span className="relative z-10">Explore products</span>
                  <motion.div
                    className="absolute inset-0 bg-white/10"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                </MagneticLink>
              </div>
            </RevealItem>
          </RevealGroup>
        </div>

        {/* Enhanced Stats Bar - Animated Counters */}
        <div className="absolute bottom-0 left-1/2 z-10 grid w-[min(1240px,calc(100%-64px))] -translate-x-1/2 grid-cols-3 gap-4 border-l border-white/20 max-md:bottom-5 max-md:w-[calc(100%-36px)] max-md:grid-cols-1 max-md:gap-3">
          <Reveal variant="itemReveal" delay={0.1}>
            <motion.div
              className="group flex items-center gap-4 border border-white/20 border-l-0 bg-ink/80 px-7 py-5 max-md:px-4 max-md:py-2 hover:border-safety/50 hover:bg-ink/90 transition-all duration-300"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}>
              <div className="relative">
                <Counter
                  end={22}
                  suffix="+"
                  duration={2.5}
                  className="text-3xl font-bold text-safety max-md:text-[22px]"
                />
                <motion.div
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-safety"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className="max-w-[110px] text-[10px] uppercase tracking-industrial text-slate-300 text-nowrap">
                Years of industry experience
              </span>
            </motion.div>
          </Reveal>
          <Reveal variant="itemReveal" delay={0.15}>
            <motion.div
              className="group flex items-center gap-4 border border-white/20 border-l-0 bg-ink/80 px-7 py-5 max-md:px-4 max-md:py-2 hover:border-safety/50 hover:bg-ink/90 transition-all duration-300"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}>
              <div className="relative">
                <Counter
                  end={100}
                  suffix="+"
                  duration={2.5}
                  className="text-3xl font-bold text-safety max-md:text-[22px]"
                />
                <motion.div
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-safety"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className="max-w-[110px] text-[10px] uppercase tracking-industrial text-slate-300">
                Satisfied crane customers
              </span>
            </motion.div>
          </Reveal>
          <Reveal variant="itemReveal" delay={0.2}>
            <motion.div
              className="group flex items-center gap-4 border border-white/20 border-l-0 bg-ink/80 px-7 py-5 max-md:px-4 max-md:py-2 hover:border-safety/50 hover:bg-ink/90 transition-all duration-300"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}>
              <div className="relative">
                <Counter
                suffix="+"
                  end={200}
                  duration={2.5}
                  className="text-3xl font-bold text-safety max-md:text-[22px]"
                />
                <motion.div
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-safety"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className="max-w-[110px] text-[10px] uppercase tracking-industrial text-slate-300">
                Tons lifting capacity
              </span>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* Highlights Area */}
      <section className="py-8 max-md:py-20 bg-white">
        <div className="mx-auto w-[min(1140px,calc(100%-64px))] max-md:w-[calc(100%-36px)]">
          <RevealGroup
            staggerChildren={0.1}
            delayChildren={0.1}
            className="grid grid-cols-3 gap-8 max-md:grid-cols-1 max-md:gap-6">
            <RevealItem variant="itemReveal">
              <div className="text-center p-6">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-safety/10 text-safety mb-4">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-ink mb-2">Reliability</h3>
                <p className="text-steel">Transparency Service</p>
              </div>
            </RevealItem>
            <RevealItem variant="itemReveal">
              <div className="text-center p-6">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-safety/10 text-safety mb-4">
                  <Award className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-ink mb-2">Materials</h3>
                <p className="text-steel">100% Quality Product</p>
              </div>
            </RevealItem>
            <RevealItem variant="itemReveal">
              <div className="text-center p-6">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-safety/10 text-safety mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-ink mb-2">
                  Expert Staff
                </h3>
                <p className="text-steel">Trained & Experienced</p>
              </div>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>

      {/* About Section - Side by side layout with background separation */}
      <section className="py-28 max-md:py-20 bg-mist">
        <RevealGroup
          staggerChildren={0.1}
          delayChildren={0.1}
          className="mx-auto grid w-[min(1240px,calc(100%-64px))] grid-cols-[minmax(320px,.88fr)_minmax(340px,1fr)] items-center gap-[clamp(50px,9vw,150px)] max-md:w-[calc(100%-36px)] max-md:grid-cols-1">
          {/* Image - Left Side */}
          <RevealItem variant="itemReveal">
            <div className="relative pb-[88px] pr-[18px]">
              <div className="absolute bottom-0 right-0 h-3/4 w-3/4 border border-safety" />
              <motion.img
                className="relative z-10 h-[410px] w-full object-fill grayscale-[.16] max-md:h-[370px]"
                src="/media/home/about-01.jpg"
                alt="Sahil Industries crane manufacturing"
                animate={aboutControls1}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                onHoverStart={() => setAboutHovered1(true)}
                onHoverEnd={() => setAboutHovered1(false)}
                initial={{ opacity: 0, y: 0,  }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.img
                className="absolute -bottom-7 -right-7 z-20 h-[285px] w-[52%] border-1 object-cover shadow-xl max-md:hidden"
                src="/media/home/about-02.jpg"
                alt="Sahil Industries manufacturing facility"
                animate={aboutControls2}
                whileInView={{ opacity: 1, y: 0 }}
                onHoverStart={() => setAboutHovered2(true)}
                onHoverEnd={() => setAboutHovered2(false)}
                initial={{ opacity: 0, y: 30 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.6,
                  delay: 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
              <motion.div
                className="absolute bottom-3 left-[-22px] z-20 border-l-4 border-safety bg-ink px-5 py-4 text-[10px] tracking-[.12em] text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}>
                ISO
                <br />
                <b className="text-[15px]">9001:2008</b>
              </motion.div>
            </div>
          </RevealItem>

          {/* Text Content - Right Side */}
          <RevealItem variant="itemReveal">
            <div>
              <Heading
                eyebrow="Sahil Industries"
                title="A capable partner for every lift."
                copy="We are an ISO 9001:2008 certified manufacturer and solution partner for industrial EOT cranes and hoists."
              />
              <motion.p
                className="text-steel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}>
                For more than two decades, we have engineered material
                handling equipment to IS guidelines and supported customers
                with installation, maintenance, repair, and service for cranes
                of any make.
              </motion.p>
              <motion.ul
                className="my-7 grid gap-3 p-0 font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, staggerChildren: 0.1 }}>
                {[
                  "Pre-engineered industrial cranes",
                  "Purpose-built lifting solutions",
                  "Service support across equipment makes",
                ].map((item, index) => (
                  <motion.li
                    key={item}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}>
                    <Check size={16} className="text-[#b28a00]" />
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
              <MagneticLink
                href="/about"
                strength={0.15}
                area={50}
                variant="ghost"
                className="inline-flex items-center gap-2 border-b border-safety pb-1 text-xs font-extrabold uppercase tracking-industrial">
                Discover our company <ArrowRight size={16} />
              </MagneticLink>
            </div>
          </RevealItem>
        </RevealGroup>
      </section>

      <section className="bg-white py-28 max-md:py-20">
        <div className="mx-auto w-[min(1240px,calc(100%-64px))] max-md:w-[calc(100%-36px)]">
          <RevealGroup staggerChildren={0.1} delayChildren={0.1}>
            <RevealItem variant="quickEnter">
              <Heading
                eyebrow="Our product range"
                title="Material handling, made dependable."
                copy="Purpose-engineered equipment for demanding industrial environments."
              />
            </RevealItem>
            <RevealItem variant="quickEnter">
              <RevealGroup
                staggerChildren={0.06}
                delayChildren={0.1}
                className="grid grid-cols-4 gap-px border border-ink/15 bg-ink/15 max-lg:grid-cols-2 max-md:grid-cols-1">
                {homeProducts.map((product, index) => (
                  <RevealItem key={product.title} variant="itemReveal">
                    <Link
                      href={product.href ?? "/"}
                      className="group relative block min-h-[300px] overflow-hidden bg-ink text-white">
                      <motion.img
                        className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-500 group-hover:scale-110 group-hover:opacity-90"
                        src={asset(`products/${product.image}`)}
                        alt={product.title}
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      />
                      <div className="absolute inset-x-5 bottom-5 z-10 grid grid-cols-[1fr_auto] items-end gap-2">
                        <span className="text-[10px] font-extrabold text-safety">
                          0{index + 1}
                        </span>
                        <h3 className="m-0 max-w-[180px] text-lg font-bold leading-[1.15]">
                          {product.title}
                        </h3>
                        <motion.span
                          className="col-start-2 row-span-2 row-start-1 text-safety"
                          initial={{ x: 0 }}
                          whileHover={{ x: 8 }}
                          transition={{ duration: 0.2 }}>
                          <ArrowRight size={19} />
                        </motion.span>
                      </div>
                    </Link>
                  </RevealItem>
                ))}
              </RevealGroup>
            </RevealItem>
            <RevealItem variant="quickEnter">
              <div className="mt-10 text-center">
                <MagneticLink
                  href="/products/single-girder-eot-crane"
                  strength={0.15}
                  area={50}
                  variant="secondary"
                  className="inline-flex items-center gap-2 bg-ink px-5 py-4 text-xs font-extrabold uppercase tracking-industrial text-white">
                  View all products <ArrowRight size={17} />
                </MagneticLink>
              </div>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>

      <section className="bg-surface py-28 text-white max-md:py-20">
        <div className="mx-auto w-[min(1240px,calc(100%-64px))] max-md:w-[calc(100%-36px)]">
          <RevealGroup staggerChildren={0.1} delayChildren={0.1}>
            <RevealItem variant="quickEnter">
              <Heading
                eyebrow="Why Sahil"
                title="Built around operational confidence."
              />
            </RevealItem>
            <RevealItem variant="quickEnter">
              <RevealGroup
                staggerChildren={0.08}
                delayChildren={0.1}
                className="grid grid-cols-3 gap-px border border-white/15 bg-white/15 max-md:grid-cols-1">
                {reasonsToChoose.map(([title, copy], index) => (
                  <RevealItem key={title} variant="itemReveal">
                    <motion.article
                      className="h-[230px] bg-surface p-7"
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}>
                      <span className="text-xs font-extrabold text-safety">
                        0{index + 1}
                      </span>
                      <h3 className="mb-2 mt-10 text-xl font-bold">{title}</h3>
                      <p className="m-0 text-sm leading-6 text-slate-300">
                        {copy}
                      </p>
                    </motion.article>
                  </RevealItem>
                ))}
              </RevealGroup>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>

      <section className="py-28 max-md:py-20">
        <div className="mx-auto w-[min(1240px,calc(100%-64px))] max-md:w-[calc(100%-36px)]">
          <RevealGroup staggerChildren={0.1} delayChildren={0.1}>
            <RevealItem variant="quickEnter">
              <Heading
                eyebrow="Industries we serve"
                title="Designed to perform wherever work moves."
              />
            </RevealItem>
            <RevealItem variant="quickEnter">
              <IndustriesCarousel />
            </RevealItem>
          </RevealGroup>
        </div>
      </section>

      <section className="bg-mist py-28 max-md:py-20">
        <div className="mx-auto w-[min(1240px,calc(100%-64px))] max-md:w-[calc(100%-36px)]">
          <RevealGroup staggerChildren={0.1} delayChildren={0.1}>
            <RevealItem variant="quickEnter">
              <Heading
                eyebrow="Trusted partnerships"
                title="Proud to support leading manufacturers."
              />
            </RevealItem>
            <RevealItem variant="quickEnter">
              <RevealGroup
                staggerChildren={0.04}
                delayChildren={0.1}
                className="grid grid-cols-6 gap-px border border-ink/15 bg-ink/15 max-lg:grid-cols-4 max-md:grid-cols-3">
                {clientLogos.map((logo) => (
                  <RevealItem key={logo} variant="scaleEnter">
                    <motion.div
                      className="flex h-[120px] items-center justify-center bg-white p-5 max-md:h-[92px] max-md:p-3"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}>
                      <motion.img
                        className="max-h-[65px] max-w-full object-contain grayscale opacity-70 transition hover:grayscale-0 hover:opacity-100"
                        src={asset(`customers/${logo}`)}
                        alt="Sahil Industries customer"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        whileHover={{
                          scale: 1.1,
                          filter: "grayscale(0%) opacity(1)",
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                  </RevealItem>
                ))}
              </RevealGroup>
            </RevealItem>
            <RevealItem variant="quickEnter">
              <div className="mt-10 text-center">
                <MagneticLink
                  href="/clients"
                  strength={0.15}
                  area={50}
                  variant="ghost"
                  className="inline-flex items-center gap-2 border-b border-safety pb-1 text-xs font-extrabold uppercase tracking-industrial">
                  Meet our clients <ArrowRight size={16} />
                </MagneticLink>
              </div>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>

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
                Let's build your lifting solution
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
                className="inline-flex items-center gap-2 bg-safety px-5 py-4 text-xs font-extrabold uppercase tracking-industrial text-ink">
                Talk to our team <ArrowRight size={17} />
              </MagneticLink>
              <MagneticLink
                href={siteContact.phoneHref}
                strength={0.15}
                area={50}
                variant="ghost"
                className="inline-flex items-center gap-2 text-xs font-extrabold hover:text-safety">
                <Phone size={17} />
                {siteContact.phone}
              </MagneticLink>
              <MagneticLink
                href="/sahilcrane/broucher/girder-eot-crane.pdf"
                target="_blank"
                rel="noreferrer"
                strength={0.15}
                area={50}
                variant="ghost"
                className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-300 hover:text-safety">
                <Download size={16} />
                Brochure
              </MagneticLink>
            </div>
          </RevealItem>
        </RevealGroup>
      </section>

      <SiteFooter />
    </main>
  );
}
