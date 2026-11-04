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

// Standardized spacing constants for ModernHomePage
const asset = (path: string) => `/sahilcrane/${path}`;

const CONTAINER_MAX_WIDTH = "w-[min(1240px,calc(100%-64px))]";
const CONTAINER_MAX_WIDTH_MD = "max-md:w-[calc(100%-36px)]";
const SECTION_PY_DESKTOP = "py-28";
const SECTION_PY_MD = "max-md:py-20";
const REVEAL_GROUP_STAGGER = 0.1;
const REVEAL_GROUP_DELAY = 0.1;
const EYEBROW_MB = "mb-[18px]";
const EYEBROW_STYLE = "flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.15em] text-safety";
const EYEBROW_BAR = "h-0.5 w-8 bg-safety";
const HEADING_MB = "mb-12";
const HEADING_MAX_W = "max-w-[690px]";
const HEADING_TITLE = "m-0 text-[clamp(34px,4vw,55px)] font-bold leading-[1.05] tracking-[-.052em]";
const HEADING_COPY = "mt-4 text-base text-steel";
const HERO_MIN_H = "min-h-[710px]";
const HERO_MIN_H_MD = "max-md:min-h-[650px]";
const HERO_CONTENT_PY = "py-[114px] pb-[158px]";
const HERO_CONTENT_PY_MD = "max-md:py-[88px] max-md:pb-[180px]";
const HERO_EYEBROW_ANIM_DURATION = 0.5;
const HERO_EYEBROW_BAR_DURATION = 0.6;
const HERO_HEADLINE_DURATION = 0.8;
const HERO_LINE_DURATION = 0.7;
const HERO_LINE_DELAY = 0.12;
const HERO_UNDERLINE_DURATION = 0.6;
const HERO_UNDERLINE_DELAY = 0.8;
const HERO_DESC_DURATION = 0.6;
const HERO_DESC_DELAY = 0.2;
const HERO_CTA_GAP = "gap-4";
const HERO_CTA_MD = "max-md:grid max-md:grid-cols-1";
const STATS_GRID_COLS = "grid-cols-3";
const STATS_GAP = "gap-4";
const STATS_BORDER = "border-l border-white/20";
const STATS_MD_BOTTOM = "max-md:bottom-5";
const STATS_MD_GRID = "max-md:grid-cols-1";
const STATS_MD_GAP = "max-md:gap-3";
const STATS_CARD_PADDING = "px-7 py-5";
const STATS_CARD_PADDING_MD = "max-md:px-4 max-md:py-2";
const STATS_CARD_HOVER = "hover:border-safety/50 hover:bg-ink/90 transition-all duration-300";
const STATS_ICON_SIZE = "text-3xl";
const STATS_ICON_SIZE_MD = "max-md:text-[22px]";
const STATS_LABEL_MAX_W = "max-w-[110px]";
const STATS_LABEL_STYLE = "text-[10px] uppercase tracking-industrial text-slate-300";
const HIGHLIGHTS_PY = "py-6";
const HIGHLIGHTS_PY_MD = "max-md:py-20";
const HIGHLIGHTS_GRID = "grid grid-cols-3 gap-8 max-md:grid-cols-1 max-md:gap-6";
const HIGHLIGHTS_CARD_PADDING = "p-6 text-center";
const HIGHLIGHTS_ICON_WRAPPER = "inline-flex h-16 w-16 items-center justify-center rounded-full bg-safety/10 text-safety mb-4";
const HIGHLIGHTS_ICON_SIZE = "h-8 w-8";
const HIGHLIGHTS_TITLE = "text-xl font-bold text-ink mb-2";
const HIGHLIGHTS_COPY = "text-steel";
const ABOUT_GRID_COLS = "grid-cols-[minmax(320px,.88fr)_minmax(340px,1fr)]";
const ABOUT_GAP = "gap-[clamp(50px,9vw,150px)]";
const ABOUT_IMG_PB = "pb-[88px]";
const ABOUT_IMG_PR = "pr-[18px]";
const ABOUT_IMG_MAIN_H = "h-[410px]";
const ABOUT_IMG_MAIN_H_MD = "max-md:h-[370px]";
const ABOUT_IMG_SECONDARY_H = "h-[285px]";
const ABOUT_IMG_SECONDARY_W = "w-[52%]";
const ABOUT_ISO_BL = "absolute bottom-3 left-[-22px] z-20 border-l-4 border-safety bg-ink px-5 py-4 text-[10px] tracking-[.12em] text-white";
const ABOUT_COPY_STYLE = "text-steel";
const ABOUT_LIST_GAP = "gap-3";
const ABOUT_LIST_ITEM_GAP = "gap-2";
const ABOUT_CHECK_SIZE = 16;
const ABOUT_CHECK_COLOR = "text-[#b28a00]";
const PRODUCTS_GRID = "grid grid-cols-4 gap-px border border-ink/15 bg-ink/15 max-lg:grid-cols-2 max-md:grid-cols-1";
const PRODUCTS_CARD_MIN_H = "min-h-[300px]";
const PRODUCTS_CARD_BOTTOM = "bottom-5";
const PRODUCTS_CARD_INSET = "inset-x-5";
const PRODUCTS_NUMBER_STYLE = "text-[10px] font-extrabold text-safety";
const PRODUCTS_TITLE_STYLE = "m-0 max-w-[180px] text-lg font-bold leading-[1.15]";
const PRODUCTS_ARROW_SIZE = 19;
const WHY_CHOOSE_GRID = "grid grid-cols-3 gap-px border border-white/15 bg-white/15 max-md:grid-cols-1";
const WHY_CHOOSE_CARD_H = "h-[230px]";
const WHY_CHOOSE_CARD_PADDING = "p-7";
const WHY_CHOOSE_NUMBER_STYLE = "text-xs font-extrabold text-safety";
const WHY_CHOOSE_TITLE = "mb-2 mt-10 text-xl font-bold";
const WHY_CHOOSE_COPY = "m-0 text-sm leading-6 text-slate-300";
const INDUSTRIES_CAROUSEL_MT = "mt-8";
const CLIENTS_GRID = "grid grid-cols-6 gap-px border border-ink/15 bg-ink/15 max-lg:grid-cols-4 max-md:grid-cols-3";
const CLIENTS_CARD_H = "h-[120px]";
const CLIENTS_CARD_H_MD = "max-md:h-[92px]";
const CLIENTS_CARD_PADDING = "p-5";
const CLIENTS_CARD_PADDING_MD = "max-md:p-3";
const CLIENTS_IMG_MAX_H = "max-h-[65px]";
const CTA_SECTION_PY = "py-[70px]";
const CTA_LAYOUT = "flex items-center justify-between gap-8 max-md:flex-col max-md:items-start";
const CTA_EYEBROW_STYLE = "mb-3 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.15em] text-safety";
const CTA_EYEBROW_BAR = "h-0.5 w-8 bg-safety";
const CTA_TITLE = "max-w-2xl text-[clamp(30px,3vw,47px)] font-bold leading-[1.05] tracking-[-.05em]";
const CTA_BUTTONS_GAP = "gap-4";
const CTA_PRIMARY_PADDING = "px-5 py-5";
const CTA_GHOST_PADDING = "px-5 py-5";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className={`${EYEBROW_MB} ${EYEBROW_STYLE}`}>
      <span className={EYEBROW_BAR} />
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
    <div className={`${HEADING_MB} ${HEADING_MAX_W}`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className={HEADING_TITLE}>{title}</h2>
      {copy && <p className={HEADING_COPY}>{copy}</p>}
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
      <section className={`relative flex ${HERO_MIN_H} items-center overflow-hidden bg-ink text-white ${HERO_MIN_H_MD}`}>
        {/* Background slider with enhanced transitions */}
        <HeroSliderBackdrop />
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(246,197,21,.22)_1px,transparent_1px),linear-gradient(90deg,rgba(246,197,21,.22)_1px,transparent_1px)] [background-size:74px_74px]" />
        
        {/* Radial gradient glow for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-safety/10 via-transparent to-transparent opacity-50" aria-hidden="true" />
        
        {/* HeroMotion GSAP animations */}
        <HeroMotion />

        {/* Main content */}
        <div className={`relative z-10 mx-auto ${CONTAINER_MAX_WIDTH} ${HERO_CONTENT_PY} ${CONTAINER_MAX_WIDTH_MD} ${HERO_CONTENT_PY_MD}`}>
          <RevealGroup staggerChildren={REVEAL_GROUP_STAGGER} delayChildren={REVEAL_GROUP_DELAY}>
            {/* Eyebrow with enhanced animation */}
            <RevealItem variant="quickEnter">
              <motion.div
                className={EYEBROW_STYLE}
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: HERO_EYEBROW_ANIM_DURATION, ease: [0.22, 1, 0.36, 1] }}>
                <motion.span
                  className={EYEBROW_BAR}
                  initial={{ width: 0 }}
                  animate={{ width: '2rem' }}
                  transition={{ duration: HERO_EYEBROW_BAR_DURATION, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
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
                  transition={{ duration: HERO_HEADLINE_DURATION, ease: [0.22, 1, 0.36, 1] }}>
                  <motion.span
                    className="block"
                    initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: HERO_LINE_DURATION, ease: [0.22, 1, 0.36, 1] }}>
                    Precision lifting.
                  </motion.span>
                  <motion.span
                    className="block not-italic text-safety relative"
                    initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: HERO_LINE_DURATION, delay: HERO_LINE_DELAY, ease: [0.22, 1, 0.36, 1] }}>
                    Built for industry.
                    <motion.span
                      className="absolute -bottom-1 left-0 right-0 h-1 bg-safety/30"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: HERO_UNDERLINE_DURATION, delay: HERO_UNDERLINE_DELAY, ease: [0.22, 1, 0.36, 1] }}
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
                transition={{ duration: HERO_DESC_DURATION, delay: HERO_DESC_DELAY, ease: [0.22, 1, 0.36, 1] }}>
                Manufacturing EOT cranes and hoists for dependable, safe
                material movement across India.
              </motion.p>
            </RevealItem>

            {/* CTA Buttons with enhanced styling */}
            <RevealItem variant="quickEnter">
              <div className={`flex flex-wrap ${HERO_CTA_GAP} ${HERO_CTA_MD}`}>
                <MagneticLink
                  href="/enquiry"
                  strength={0.25}
                  area={80}
                  variant="primary"
                  className="group inline-flex items-center justify-center gap-3 border border-safety bg-safety px-6 py-1 text-xs font-extrabold uppercase tracking-industrial text-ink shadow-lg shadow-safety/25 hover:shadow-xl hover:shadow-safety/40 transition-all duration-300">
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
                  className="group inline-flex items-center justify-center gap-3 border border-white/60 bg-white/5 px-7 py-3 text-xs font-extrabold uppercase tracking-industrial text-white backdrop-blur-sm hover:bg-white/10 hover:border-white/80 transition-all duration-300">
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
        <div className={`absolute bottom-0 left-1/2 z-10 grid ${CONTAINER_MAX_WIDTH} -translate-x-1/2 ${STATS_GRID_COLS} ${STATS_GAP} ${STATS_BORDER} ${STATS_MD_BOTTOM} ${CONTAINER_MAX_WIDTH_MD} ${STATS_MD_GRID} ${STATS_MD_GAP}`}>
          <Reveal variant="itemReveal" delay={0.1}>
            <motion.div
              className={`group flex items-center gap-4 border border-white/20 border-l-0 bg-ink/80 ${STATS_CARD_PADDING} ${STATS_CARD_PADDING_MD} ${STATS_CARD_HOVER}`}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}>
              <div className="relative">
                <Counter
                  end={22}
                  suffix="+"
                  duration={2.5}
                  scrollTrigger={true}
                  className={`${STATS_ICON_SIZE} font-bold text-safety ${STATS_ICON_SIZE_MD}`}
                />
                <motion.div
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-safety"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className={`${STATS_LABEL_MAX_W} ${STATS_LABEL_STYLE} text-nowrap`}>
                Years of industry experience
              </span>
            </motion.div>
          </Reveal>
          <Reveal variant="itemReveal" delay={0.15}>
            <motion.div
              className={`group flex items-center gap-4 border border-white/20 border-l-0 bg-ink/80 ${STATS_CARD_PADDING} ${STATS_CARD_PADDING_MD} ${STATS_CARD_HOVER}`}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}>
              <div className="relative">
                <Counter
                  end={100}
                  suffix="+"
                  duration={2.5}
                  scrollTrigger={true}
                  className={`${STATS_ICON_SIZE} font-bold text-safety ${STATS_ICON_SIZE_MD}`}
                />
                <motion.div
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-safety"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className={`${STATS_LABEL_MAX_W} ${STATS_LABEL_STYLE}`}>
                Satisfied crane customers
              </span>
            </motion.div>
          </Reveal>
          <Reveal variant="itemReveal" delay={0.2}>
            <motion.div
              className={`group flex items-center gap-4 border border-white/20 border-l-0 bg-ink/80 ${STATS_CARD_PADDING} ${STATS_CARD_PADDING_MD} ${STATS_CARD_HOVER}`}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}>
              <div className="relative">
                <Counter
                suffix="+"
                  end={200}
                  duration={2.5}
                  scrollTrigger={true}
                  className={`${STATS_ICON_SIZE} font-bold text-safety ${STATS_ICON_SIZE_MD}`}
                />
                <motion.div
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-safety"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className={`${STATS_LABEL_MAX_W} ${STATS_LABEL_STYLE}`}>
                Tons lifting capacity
              </span>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* Highlights Area */}
      <section className={`${HIGHLIGHTS_PY} ${HIGHLIGHTS_PY_MD} bg-white`}>
        <div className={`mx-auto ${CONTAINER_MAX_WIDTH} ${CONTAINER_MAX_WIDTH_MD}`}>
          <RevealGroup
            staggerChildren={REVEAL_GROUP_STAGGER}
            delayChildren={REVEAL_GROUP_DELAY}
            className={HIGHLIGHTS_GRID}>
            <RevealItem variant="itemReveal">
              <div className={HIGHLIGHTS_CARD_PADDING}>
                <div className={HIGHLIGHTS_ICON_WRAPPER}>
                  <Shield className={HIGHLIGHTS_ICON_SIZE} />
                </div>
                <h3 className={HIGHLIGHTS_TITLE}>Reliability</h3>
                <p className={HIGHLIGHTS_COPY}>Transparency Service</p>
              </div>
            </RevealItem>
            <RevealItem variant="itemReveal">
              <div className={HIGHLIGHTS_CARD_PADDING}>
                <div className={HIGHLIGHTS_ICON_WRAPPER}>
                  <Award className={HIGHLIGHTS_ICON_SIZE} />
                </div>
                <h3 className={HIGHLIGHTS_TITLE}>Materials</h3>
                <p className={HIGHLIGHTS_COPY}>100% Quality Product</p>
              </div>
            </RevealItem>
            <RevealItem variant="itemReveal">
              <div className={HIGHLIGHTS_CARD_PADDING}>
                <div className={HIGHLIGHTS_ICON_WRAPPER}>
                  <Users className={HIGHLIGHTS_ICON_SIZE} />
                </div>
                <h3 className={HIGHLIGHTS_TITLE}>
                  Expert Staff
                </h3>
                <p className={HIGHLIGHTS_COPY}>Trained & Experienced</p>
              </div>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>

      {/* About Section - Side by side layout with background separation */}
      <section className={`${SECTION_PY_DESKTOP} ${SECTION_PY_MD} bg-mist`}>
        <RevealGroup
          staggerChildren={REVEAL_GROUP_STAGGER}
          delayChildren={REVEAL_GROUP_DELAY}
          className={`mx-auto grid ${CONTAINER_MAX_WIDTH} ${ABOUT_GRID_COLS} items-center ${ABOUT_GAP} ${CONTAINER_MAX_WIDTH_MD} max-md:grid-cols-1`}>
          {/* Image - Left Side */}
          <RevealItem variant="itemReveal">
            <div className={`relative ${ABOUT_IMG_PB} ${ABOUT_IMG_PR}`}>
              <div className="absolute bottom-0 right-0 h-3/4 w-3/4 border border-safety" />
              <motion.img
                className={`relative z-10 w-full object-fill grayscale-[.16] ${ABOUT_IMG_MAIN_H} ${ABOUT_IMG_MAIN_H_MD}`}
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
                className={`absolute -bottom-7 -right-7 z-20 ${ABOUT_IMG_SECONDARY_H} ${ABOUT_IMG_SECONDARY_W} border-1 object-cover shadow-xl max-md:hidden`}
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
                className={ABOUT_ISO_BL}
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
                className={ABOUT_COPY_STYLE}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}>
                For more than two decades, we have engineered material
                handling equipment to IS guidelines and supported customers
                with installation, maintenance, repair, and service for cranes
                of any make.
              </motion.p>
              <motion.ul
                className={`my-7 grid ${ABOUT_LIST_GAP} p-0 font-semibold`}
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
                                      className={`flex items-center ${ABOUT_LIST_ITEM_GAP}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}>
                                      <Check size={ABOUT_CHECK_SIZE} className={ABOUT_CHECK_COLOR} />
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
              <MagneticLink
                href="/about"
                strength={0.15}
                area={50}
                variant="ghost"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 border-b border-safety text-xs font-extrabold uppercase tracking-industrial">
                <span className="relative z-10">Discover our company</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
              </MagneticLink>
            </div>
          </RevealItem>
        </RevealGroup>
      </section>

                        <section className={`bg-white ${SECTION_PY_DESKTOP} ${SECTION_PY_MD}`}>
                          <div className={`mx-auto ${CONTAINER_MAX_WIDTH} ${CONTAINER_MAX_WIDTH_MD}`}>
                            <RevealGroup staggerChildren={REVEAL_GROUP_STAGGER} delayChildren={REVEAL_GROUP_DELAY}>
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
                                  className={PRODUCTS_GRID}>
                {homeProducts.map((product, index) => (
                  <RevealItem key={product.title} variant="itemReveal">
                    <Link
                      href={product.href ?? "/"}
                                        className={`group relative block ${PRODUCTS_CARD_MIN_H} overflow-hidden bg-ink text-white`}>
                      <motion.img
                        className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-500 group-hover:scale-110 group-hover:opacity-90"
                        src={asset(`products/${product.image}`)}
                        alt={product.title}
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      />
                                        <div className={`absolute ${PRODUCTS_CARD_INSET} ${PRODUCTS_CARD_BOTTOM} z-10 grid grid-cols-[1fr_auto] items-end gap-2`}>
                                          <span className={PRODUCTS_NUMBER_STYLE}>
                          0{index + 1}
                        </span>
                                          <h3 className={PRODUCTS_TITLE_STYLE}>
                          {product.title}
                        </h3>
                        <motion.span
                          className="col-start-2 row-span-2 row-start-1 text-safety"
                          initial={{ x: 0 }}
                          whileHover={{ x: 8 }}
                          transition={{ duration: 0.2 }}>
                                            <ArrowRight size={PRODUCTS_ARROW_SIZE} />
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
                  className="inline-flex items-center justify-center gap-2 bg-ink px-6 py-5 text-xs font-extrabold uppercase tracking-industrial text-white">
                  <span className="relative z-10">View all products</span>
                  <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform duration-300" />
                </MagneticLink>
              </div>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>

                        <section className={`bg-surface ${SECTION_PY_DESKTOP} text-white ${SECTION_PY_MD}`}>
                          <div className={`mx-auto ${CONTAINER_MAX_WIDTH} ${CONTAINER_MAX_WIDTH_MD}`}>
                            <RevealGroup staggerChildren={REVEAL_GROUP_STAGGER} delayChildren={REVEAL_GROUP_DELAY}>
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
                                  className={WHY_CHOOSE_GRID}>
                {reasonsToChoose.map(([title, copy], index) => (
                  <RevealItem key={title} variant="itemReveal">
                    <motion.article
                                        className={`${WHY_CHOOSE_CARD_H} bg-surface ${WHY_CHOOSE_CARD_PADDING}`}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}>
                                        <span className={WHY_CHOOSE_NUMBER_STYLE}>
                        0{index + 1}
                      </span>
                                        <h3 className={WHY_CHOOSE_TITLE}>{title}</h3>
                                        <p className={WHY_CHOOSE_COPY}>
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

                        <section className={`${SECTION_PY_DESKTOP} ${SECTION_PY_MD}`}>
                          <div className={`mx-auto ${CONTAINER_MAX_WIDTH} ${CONTAINER_MAX_WIDTH_MD}`}>
                            <RevealGroup staggerChildren={REVEAL_GROUP_STAGGER} delayChildren={REVEAL_GROUP_DELAY}>
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

                        <section className={`bg-mist ${SECTION_PY_DESKTOP} ${SECTION_PY_MD}`}>
                          <div className={`mx-auto ${CONTAINER_MAX_WIDTH} ${CONTAINER_MAX_WIDTH_MD}`}>
                            <RevealGroup staggerChildren={REVEAL_GROUP_STAGGER} delayChildren={REVEAL_GROUP_DELAY}>
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
                                  className={CLIENTS_GRID}>
                {clientLogos.map((logo) => (
                  <RevealItem key={logo} variant="scaleEnter">
                    <motion.div
                                        className={`flex items-center justify-center bg-white ${CLIENTS_CARD_H} ${CLIENTS_CARD_H_MD} ${CLIENTS_CARD_PADDING} ${CLIENTS_CARD_PADDING_MD}`}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}>
                      <motion.img
                                          className={`max-w-full object-contain grayscale opacity-70 transition hover:grayscale-0 hover:opacity-100 ${CLIENTS_IMG_MAX_H}`}
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

                        <section className={`bg-ink ${CTA_SECTION_PY} text-white`}>
        <RevealGroup
                            staggerChildren={REVEAL_GROUP_STAGGER}
                            delayChildren={REVEAL_GROUP_DELAY}
                            className={`mx-auto flex ${CONTAINER_MAX_WIDTH} items-center justify-between ${CTA_LAYOUT} ${CONTAINER_MAX_WIDTH_MD}`}>
          <RevealItem variant="quickEnter">
            <div>
              <motion.p
                                  className={CTA_EYEBROW_STYLE}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}>
                                  <span className={CTA_EYEBROW_BAR} />
                Let's build your lifting solution
              </motion.p>
              <motion.h2
                                  className={CTA_TITLE}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}>
                Ready to move your operation forward?
              </motion.h2>
            </div>
          </RevealItem>
          <RevealItem variant="quickEnter">
                              <div className={`flex flex-wrap items-center ${CTA_BUTTONS_GAP}`}>
              <MagneticLink
                href="/contact"
                strength={0.2}
                area={60}
                variant="primary"
                                  className={`inline-flex items-center justify-center gap-2 bg-safety ${CTA_PRIMARY_PADDING} text-xs font-extrabold uppercase tracking-industrial text-ink`}>
                <span className="relative z-10">Talk to our team</span>
                <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform duration-300" />
              </MagneticLink>
              <MagneticLink
                href={siteContact.phoneHref}
                strength={0.15}
                area={50}
                variant="ghost"
                                  className={`inline-flex items-center justify-center gap-2 ${CTA_GHOST_PADDING} text-xs font-extrabold hover:text-safety`}>
                <span className="relative z-10 flex items-center gap-2">
                  <Phone size={17} />
                  {siteContact.phone}
                </span>
              </MagneticLink>
              <MagneticLink
                href="/sahilcrane/broucher/girder-eot-crane.pdf"
                target="_blank"
                rel="noreferrer"
                strength={0.15}
                area={50}
                variant="ghost"
                                  className={`inline-flex items-center justify-center gap-2 ${CTA_GHOST_PADDING} text-xs font-extrabold text-slate-300 hover:text-safety`}>
                 <span className="relative z-10 flex items-center justify-center gap-2">
                   <Download size={16} />
                   <span>Brochure</span>
                 </span>
               </MagneticLink>
            </div>
          </RevealItem>
        </RevealGroup>
      </section>

      <SiteFooter />
    </main>
  );
}
