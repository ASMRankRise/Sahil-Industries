"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Download, Phone } from "lucide-react";
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
import { WhySahilTimeline } from "@/components/WhySahilTimeline";
import CircularGallery from "@/components/CircularGallery";

// Standardized spacing constants for ModernHomePage
const asset = (path: string) => `/sahilcrane/${path}`;
const productGalleryItems = homeProducts.map((product) => ({
  image: asset(`products/${product.image}`),
  text: product.title,
  alt: product.title,
}));
const HERO_TYPED_LINE = "Built for industry.";
const HERO_TYPED_FIRST_LINE = "Precision lifting.";

const CONTAINER_MAX_WIDTH = "w-[min(1240px,calc(100%-64px))]";
const CONTAINER_MAX_WIDTH_MD = "max-md:w-[calc(100%-36px)]";
const SECTION_PY_DESKTOP = "py-16 md:py-20 lg:py-28";
const REVEAL_GROUP_STAGGER = 0.1;
const REVEAL_GROUP_DELAY = 0.1;
const EYEBROW_MB = "mb-[18px]";
const EYEBROW_STYLE =
  "flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.15em] text-safety";
const EYEBROW_BAR = "h-0.5 w-8 bg-safety";
const HEADING_MB = "mb-12";
const HEADING_MAX_W = "max-w-[690px]";
const HEADING_TITLE =
  "m-0 text-[clamp(34px,4vw,55px)] font-bold leading-[1.05] tracking-[-.052em]";
const HEADING_COPY = "mt-4 text-base text-steel";
const HERO_MIN_H = "min-h-[calc(100dvh-74px)] lg:min-h-[calc(100dvh-88px)]";
const HERO_MIN_H_MD = "max-md:min-h-0";
const HERO_CONTENT_PY = "py-[114px] pb-[158px]";
const HERO_CONTENT_PY_MD = "max-md:pt-16 max-md:pb-8";
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
const STATS_MD_GRID = "max-md:grid-cols-1";
const STATS_MD_GAP = "max-md:gap-3";
const STATS_CARD_PADDING = "px-7 py-5";
const STATS_CARD_PADDING_MD = "max-md:px-4 max-md:py-2";
const STATS_CARD_HOVER =
  "hover:border-safety/50 hover:bg-ink/90 transition-all duration-300";
const STATS_ICON_SIZE = "text-3xl";
const STATS_ICON_SIZE_MD = "max-md:text-[22px]";
const STATS_LABEL_MAX_W = "max-w-[110px]";
const STATS_LABEL_STYLE =
  "text-[10px] uppercase tracking-industrial text-slate-300";
const ABOUT_GRID_COLS =
  "grid-cols-1 md:grid-cols-[minmax(0,.88fr)_minmax(0,1fr)]";
const ABOUT_GAP = "gap-10 lg:gap-[clamp(50px,9vw,150px)]";
const ABOUT_IMG_PB = "pb-[88px]";
const ABOUT_IMG_PR = "pr-[18px]";
const ABOUT_IMG_MAIN_H = "h-[410px]";
const ABOUT_IMG_MAIN_H_MD = "max-md:h-[370px]";
const ABOUT_IMG_SECONDARY_H = "h-[285px]";
const ABOUT_IMG_SECONDARY_W = "w-[52%]";
const ABOUT_ISO_BL =
  "absolute bottom-3 left-[-22px] z-20 border-l-4 border-safety bg-ink px-5 py-4 text-[10px] tracking-[.12em] text-white";
const ABOUT_COPY_STYLE = "text-steel";
const ABOUT_LIST_GAP = "gap-3";
const ABOUT_LIST_ITEM_GAP = "gap-2";
const ABOUT_CHECK_SIZE = 16;
const ABOUT_CHECK_COLOR = "text-[#b28a00]";
const INDUSTRIES_CAROUSEL_MT = "mt-8";
const CLIENTS_GRID =
  "grid grid-cols-6 gap-px border border-ink/15 bg-ink/15 max-lg:grid-cols-4 max-md:grid-cols-3";
const CLIENTS_CARD_H = "h-[120px]";
const CLIENTS_CARD_H_MD = "max-md:h-[92px]";
const CLIENTS_CARD_PADDING = "p-5";
const CLIENTS_CARD_PADDING_MD = "max-md:p-3";
const CLIENTS_IMG_MAX_H = "max-h-[65px]";
const CTA_SECTION_PY = "py-[70px]";
const CTA_LAYOUT =
  "flex items-center justify-between gap-8 max-md:flex-col max-md:items-start max-sm:items-center";
const CTA_EYEBROW_STYLE =
  "mb-3 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.15em] text-safety";
const CTA_EYEBROW_BAR = "h-0.5 w-8 bg-safety";
const CTA_TITLE =
  "max-w-2xl text-[clamp(30px,3vw,47px)] font-bold leading-[1.05] tracking-[-.05em]";
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
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const activeProduct = homeProducts[activeProductIndex];
  const productGalleryPinRef = useRef<HTMLDivElement>(null);
  const [typedFirstCharacters, setTypedFirstCharacters] = useState(
    prefersReduced ? HERO_TYPED_FIRST_LINE.length : 0,
  );
  const [typedHeroCharacters, setTypedHeroCharacters] = useState(
    prefersReduced ? HERO_TYPED_LINE.length : 0,
  );

  useEffect(() => {
    if (prefersReduced) {
      setTypedFirstCharacters(HERO_TYPED_FIRST_LINE.length);
      return;
    }
    setTypedFirstCharacters(0);
    let count = 0;
    const timer = window.setInterval(() => {
      count += 1;
      setTypedFirstCharacters(count);
      if (count >= HERO_TYPED_FIRST_LINE.length) window.clearInterval(timer);
    }, 65);
    return () => window.clearInterval(timer);
  }, [prefersReduced]);

  useEffect(() => {
    if (prefersReduced) {
      setTypedHeroCharacters(HERO_TYPED_LINE.length);
      return;
    }
    setTypedHeroCharacters(0);
    let typingTimer: number | undefined;
    const startTimer = window.setTimeout(
      () => {
        typingTimer = window.setInterval(() => {
          setTypedHeroCharacters((count) => {
            if (count >= HERO_TYPED_LINE.length) {
              if (typingTimer) window.clearInterval(typingTimer);
              return count;
            }
            return count + 1;
          });
        }, 65);
      },
      HERO_TYPED_FIRST_LINE.length * 65 + 280,
    );
    return () => {
      window.clearTimeout(startTimer);
      if (typingTimer) window.clearInterval(typingTimer);
    };
  }, [prefersReduced]);

  // About section image animation controls for continuous hover loop
  const aboutControls1 = useAnimation();
  const [aboutHovered1, setAboutHovered1] = useState(false);
  const aboutControls2 = useAnimation();
  const [aboutHovered2, setAboutHovered2] = useState(false);

  useEffect(() => {
    if (aboutHovered1) {
      aboutControls1.start(
        { rotate: [-2, 2, -2] },
        { repeat: Infinity, repeatType: "loop", duration: 2, ease: "linear" },
      );
    } else {
      aboutControls1.stop();
      aboutControls1.set({ rotate: 0 });
    }
  }, [aboutHovered1, aboutControls1]);

  useEffect(() => {
    if (aboutHovered2) {
      aboutControls2.start(
        { rotate: [-2, 2, -2] },
        { repeat: Infinity, repeatType: "loop", duration: 2, ease: "linear" },
      );
    } else {
      aboutControls2.stop();
      aboutControls2.set({ rotate: 0 });
    }
  }, [aboutHovered2, aboutControls2]);

  return (
    <main>
      <SiteHeader />

      {/* Hero Section */}
      <section
        className={`hero-section relative flex flex-col justify-center overflow-hidden bg-ink text-white ${HERO_MIN_H} ${HERO_MIN_H_MD}`}>
        {/* Background slider with enhanced transitions */}
        <HeroSliderBackdrop />

        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(246,197,21,.22)_1px,transparent_1px),linear-gradient(90deg,rgba(246,197,21,.22)_1px,transparent_1px)] [background-size:74px_74px]" />

        {/* Radial gradient glow for depth */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-safety/10 via-transparent to-transparent opacity-50"
          aria-hidden="true"
        />

        {/* Main content */}
        <div
          className={`relative z-10 mx-auto grid flex-1 content-center items-center md:grid-cols-[minmax(0,1fr)_minmax(0,.55fr)] md:gap-8 ${CONTAINER_MAX_WIDTH} ${CONTAINER_MAX_WIDTH_MD} ${HERO_CONTENT_PY} ${HERO_CONTENT_PY_MD}`}>
          <RevealGroup
            className="relative z-10 col-start-1 row-start-1 min-w-0"
            staggerChildren={REVEAL_GROUP_STAGGER}
            delayChildren={REVEAL_GROUP_DELAY}>
            {/* Eyebrow with enhanced animation */}
            <RevealItem variant="quickEnter">
              <motion.div
                className={EYEBROW_STYLE}
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{
                  duration: HERO_EYEBROW_ANIM_DURATION,
                  ease: [0.22, 1, 0.36, 1],
                }}>
                <motion.span
                  className={EYEBROW_BAR}
                  initial={{ width: 0 }}
                  animate={{ width: "2rem" }}
                  transition={{
                    duration: HERO_EYEBROW_BAR_DURATION,
                    delay: 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
                <span>Engineered material handling</span>
              </motion.div>
            </RevealItem>

            {/* Headline with proper h1 and enhanced Framer Motion line-by-line animation */}
            <RevealItem variant="quickEnter">
              <h1 className="relative z-10 m-0 max-w-[800px] text-[clamp(48px,6vw,88px)] font-bold leading-[1.08] tracking-[-.065em] max-md:text-[clamp(34px,10.5vw,58px)]">
                <motion.div
                  className="block overflow-visible"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: HERO_HEADLINE_DURATION,
                    ease: [0.22, 1, 0.36, 1],
                  }}>
                  <motion.span
                    className="block overflow-visible"
                    initial={{
                      opacity: 0,
                      y: 28,
                      filter: "blur(8px)",
                      clipPath: "inset(0 100% 0 0)",
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      clipPath: "inset(0 0% 0 0)",
                    }}
                    transition={{
                      duration: HERO_LINE_DURATION,
                      delay: 0.22,
                      ease: [0.22, 1, 0.36, 1],
                    }}>
                    {HERO_TYPED_FIRST_LINE.slice(0, typedFirstCharacters)}
                    {!prefersReduced &&
                      typedFirstCharacters < HERO_TYPED_FIRST_LINE.length && (
                        <motion.span
                          aria-hidden="true"
                          className="ml-1 inline-block h-[.82em] w-[3px] translate-y-[.08em] bg-white"
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                        />
                      )}
                  </motion.span>
                  <motion.span
                    className="relative block overflow-visible not-italic text-safety"
                    initial={{
                      opacity: 0,
                      y: 28,
                      filter: "blur(8px)",
                      clipPath: "inset(0 100% 0 0)",
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      clipPath: "inset(0 0% 0 0)",
                    }}
                    transition={{
                      duration: HERO_LINE_DURATION,
                      delay: HERO_LINE_DELAY,
                      ease: [0.22, 1, 0.36, 1],
                    }}>
                    {HERO_TYPED_LINE.slice(0, typedHeroCharacters)}
                    {!prefersReduced &&
                      typedHeroCharacters < HERO_TYPED_LINE.length && (
                        <motion.span
                          aria-hidden="true"
                          className="ml-1 inline-block h-[.82em] w-[3px] translate-y-[.08em] bg-safety"
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                        />
                      )}
                  </motion.span>
                </motion.div>
              </h1>
              <motion.div
                aria-hidden="true"
                className="mt-3 h-1 w-full max-w-[1024px] origin-left bg-safety/45 shadow-[0_0_12px_rgba(246,197,21,.22)]"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{
                  duration: HERO_UNDERLINE_DURATION,
                  delay: 0.9,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </RevealItem>

            {/* Description with enhanced animation */}
            <RevealItem variant="quickEnter">
              <motion.p
                className="relative z-10 mb-7 mt-9 max-w-[520px] text-[17px] leading-7 text-slate-200 max-md:mt-6 max-md:mb-5 max-md:text-[13px] max-md:leading-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: HERO_DESC_DURATION,
                  delay: 0.68,
                  ease: [0.22, 1, 0.36, 1],
                }}>
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
                  className="group relative inline-flex items-center justify-center gap-3 overflow-hidden border border-safety bg-safety px-6 py-3 text-xs font-extrabold uppercase tracking-industrial text-ink shadow-lg shadow-safety/25 transition-all duration-500 before:pointer-events-none before:absolute before:inset-0 before:z-0 before:origin-left before:scale-x-100 before:bg-transparent before:transition-transform before:duration-500 before:ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:bg-transparent hover:text-white hover:before:scale-x-0 hover:shadow-xl hover:shadow-safety/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety focus-visible:ring-offset-2 focus-visible:ring-offset-ink">
                  <span className="relative z-10 transition-colors duration-500">
                    Request a consultation
                  </span>
                  <ArrowRight
                    size={18}
                    className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </MagneticLink>
                <MagneticLink
                  href="/products"
                  strength={0.15}
                  area={60}
                  variant="secondary"
                  className="group relative inline-flex items-center justify-center gap-3 overflow-hidden border border-white/60 bg-white/5 px-7 py-3 text-xs font-extrabold uppercase tracking-industrial text-white backdrop-blur-sm transition-all duration-300 before:pointer-events-none before:absolute before:inset-0 before:z-0 before:origin-left before:scale-x-0 before:bg-safety before:transition-transform before:duration-500 before:ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:border-safety hover:before:scale-x-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety focus-visible:ring-offset-2 focus-visible:ring-offset-ink">
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-ink">
                    Explore products
                  </span>
                  <ArrowRight
                    size={18}
                    className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </MagneticLink>
              </div>
            </RevealItem>
          </RevealGroup>
          <HeroMotion />
        </div>

        <motion.div
          className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[9px] font-bold uppercase tracking-[.24em] text-white/60 md:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}>
          <span>Scroll to explore</span>
          <motion.span
            className="h-8 w-px bg-gradient-to-b from-safety to-transparent"
            animate={
              prefersReduced
                ? undefined
                : { scaleY: [0.5, 1, 0.5], opacity: [0.5, 1, 0.5] }
            }
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Enhanced Stats Bar - Animated Counters */}
        <div
          className={`absolute bottom-3 left-1/2 z-30 mb-0 grid -translate-x-1/2 ${CONTAINER_MAX_WIDTH} ${STATS_GRID_COLS} ${STATS_GAP} ${STATS_BORDER} ${CONTAINER_MAX_WIDTH_MD} ${STATS_MD_GRID} ${STATS_MD_GAP} max-md:relative max-md:bottom-auto max-md:left-auto max-md:mx-auto max-md:mt-3 max-md:mb-6 max-md:translate-x-0`}>
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
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span
                className={`${STATS_LABEL_MAX_W} ${STATS_LABEL_STYLE} text-nowrap`}>
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
                  whileHover={{ width: "100%" }}
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
                  whileHover={{ width: "100%" }}
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

      {/* About Section - Side by side layout with background separation */}
      <section className={`${SECTION_PY_DESKTOP} bg-mist`}>
        <RevealGroup
          staggerChildren={REVEAL_GROUP_STAGGER}
          delayChildren={REVEAL_GROUP_DELAY}
          className={`mx-auto grid ${CONTAINER_MAX_WIDTH} ${ABOUT_GRID_COLS} items-center ${ABOUT_GAP} ${CONTAINER_MAX_WIDTH_MD}`}>
          {/* Image - Left Side */}
          <RevealItem variant="itemReveal">
            <div className="relative min-h-[520px] overflow-hidden bg-[#f4f4f4] max-md:min-h-[430px]">
              <div className="absolute left-0 top-0 h-[62%] w-[58%] border border-safety bg-safety/10" />
              <motion.img
                className="absolute left-0 top-0 z-10 h-[62%] w-[58%] rounded-[28px_28px_28px_0] object-cover grayscale-[.16]"
                src="/media/home/about-01.jpg"
                alt="Sahil Industries crane manufacturing"
                animate={aboutControls1}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                onHoverStart={() => setAboutHovered1(true)}
                onHoverEnd={() => setAboutHovered1(false)}
                initial={{ opacity: 0, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.img
                className="absolute bottom-5 left-[27%] z-20 h-[58%] w-[58%] rounded-[0_28px_28px_28px] border border-safety object-cover shadow-xl max-md:left-[18%] max-md:w-[58%]"
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
                className="absolute right-[13%] top-3 z-30 text-center text-ink"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}>
                <b className="block text-[82px] leading-none text-safety max-md:text-[58px]">
                  22<sup className="text-[38px]">+</sup>
                </b>
                <span className="block text-[16px] font-extrabold leading-tight uppercase">
                  Years of
                  <br />
                  Experienced
                </span>
              </motion.div>
              <div className="absolute bottom-2 left-5 z-30 w-[25%] max-md:w-[30%]">
                <Image
                  src="/media/home/about-logo.png"
                  alt="Sahil Industries certified"
                  width={200}
                  height={200}
                  className="h-auto w-full"
                />
              </div>
              <div className="absolute right-[-28px] top-[34%] z-0 rotate-90 text-[86px] font-black tracking-[.18em] text-white/80 max-md:text-[55px]">
                SAHIL
              </div>
            </div>
          </RevealItem>

          {/* Text Content - Right Side */}
          <RevealItem variant="itemReveal">
            <div className="relative border-l-2 border-safety/30 pl-8 max-md:border-l-0 max-md:pl-0">
              <Heading
                eyebrow="Sahil Industries"
                title="A capable partner for every lift."
                copy="We are an ISO 9001:2008 certified manufacturer and solution partner for industrial EOT cranes and hoists."
              />
              <motion.p
                className={`${ABOUT_COPY_STYLE} max-w-[570px] text-[17px] leading-8`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}>
                For more than two decades, we have engineered material handling
                equipment to IS guidelines and supported customers with
                installation, maintenance, repair, and service for cranes of any
                make.
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
                    className={`group flex items-center ${ABOUT_LIST_ITEM_GAP} border-b border-ink/10 py-3 text-[15px] transition-colors hover:text-[#9b7800]`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-safety/15 transition-colors group-hover:bg-safety">
                      <Check
                        size={ABOUT_CHECK_SIZE}
                        className={ABOUT_CHECK_COLOR}
                      />
                    </span>
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
              <MagneticLink
                href="/about"
                strength={0.15}
                area={50}
                variant="ghost"
                className="inline-flex items-center justify-center gap-2 border border-safety px-5 py-3 text-xs font-extrabold uppercase tracking-industrial transition-colors duration-300 hover:bg-safety hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety">
                <span className="relative z-10">Discover our company</span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </MagneticLink>
            </div>
          </RevealItem>
        </RevealGroup>
      </section>

      <section
        data-pinned-section="true"
        className={`bg-white ${SECTION_PY_DESKTOP}`}>
        <div
          className={`mx-auto ${CONTAINER_MAX_WIDTH} ${CONTAINER_MAX_WIDTH_MD}`}>
          <RevealGroup
            staggerChildren={REVEAL_GROUP_STAGGER}
            delayChildren={REVEAL_GROUP_DELAY}>
            <RevealItem variant="quickEnter">
              <Heading
                eyebrow="Our product range"
                title="Material handling, made dependable."
                copy="Purpose-engineered equipment for demanding industrial environments."
              />
            </RevealItem>
          </RevealGroup>
          <div ref={productGalleryPinRef} className="relative bg-white">
            <div className="relative h-[min(380px,62svh)] overflow-hidden rounded-2xl bg-white md:h-[min(600px,72svh)]">
              <CircularGallery
                items={productGalleryItems}
                bend={3}
                borderRadius={0.05}
                textColor="#101820"
                scrollEase={0.05}
                pageScrollPinRef={productGalleryPinRef}
                intro={false}
                onActiveChange={setActiveProductIndex}
                aria-label="Product range"
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 md:mt-6">
              {activeProduct?.href && (
                <Link
                  href={activeProduct.href}
                  className="inline-flex items-center gap-2 border border-ink/15 px-6 py-5 text-xs font-extrabold uppercase tracking-industrial text-ink transition-colors hover:border-safety focus-visible:outline-safety">
                  Explore {activeProduct.title}{" "}
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
              )}
              <MagneticLink
                href="/products"
                strength={0.15}
                area={50}
                variant="secondary"
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden bg-ink px-6 py-5 text-xs font-extrabold uppercase tracking-industrial text-white before:pointer-events-none before:absolute before:inset-0 before:z-0 before:origin-left before:scale-x-0 before:bg-[rgba(246,197,21,0.9)] before:transition-transform before:duration-500 before:ease-[cubic-bezier(.22,1,.36,1)] hover:before:scale-x-100 hover:text-ink">
                <span className="relative z-10">View all products</span>
                <ArrowRight
                  size={17}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </MagneticLink>
            </div>
          </div>
        </div>
      </section>

      <WhySahilTimeline />
      <section className={SECTION_PY_DESKTOP}>
        <div
          className={`mx-auto ${CONTAINER_MAX_WIDTH} ${CONTAINER_MAX_WIDTH_MD}`}>
          <RevealGroup
            staggerChildren={REVEAL_GROUP_STAGGER}
            delayChildren={REVEAL_GROUP_DELAY}>
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

      <section className={`bg-mist ${SECTION_PY_DESKTOP}`}>
        <div
          className={`mx-auto ${CONTAINER_MAX_WIDTH} ${CONTAINER_MAX_WIDTH_MD}`}>
          <RevealGroup
            staggerChildren={REVEAL_GROUP_STAGGER}
            delayChildren={REVEAL_GROUP_DELAY}>
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
                className={`${CLIENTS_GRID} stagger-grid`}>
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
            <div className="max-sm:text-center">
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
            <div
              className={`flex flex-nowrap items-center ${CTA_BUTTONS_GAP} max-sm:mx-auto max-sm:flex-col max-sm:w-full max-sm:max-w-[280px] max-sm:min-w-0 max-sm:gap-3 [&>*]:min-w-0`}>
              <MagneticLink
                href="/contact"
                strength={0.2}
                area={60}
                variant="primary"
                className={`inline-flex items-center justify-center gap-2 bg-safety ${CTA_PRIMARY_PADDING} text-xs font-extrabold uppercase tracking-industrial text-ink max-sm:h-12 max-sm:w-full max-sm:min-w-0 max-sm:px-4 max-sm:py-2 max-sm:text-[10px] max-sm:leading-4 max-sm:whitespace-nowrap`}>
                <span className="relative z-10">Talk to our team</span>
                <ArrowRight
                  size={17}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </MagneticLink>
              <MagneticLink
                href={siteContact.phoneHref}
                strength={0.15}
                area={50}
                variant="ghost"
                className={`inline-flex h-[70px] min-w-0 items-center justify-center gap-2 whitespace-nowrap ${CTA_GHOST_PADDING} text-xs font-extrabold hover:text-safety max-sm:h-12 max-sm:w-full max-sm:px-4 max-sm:py-2 max-sm:text-[11px]`}>
                <span className="relative z-10 inline-flex items-center justify-center gap-2 whitespace-nowrap">
                  <Phone size={17} className="shrink-0" />
                  <span>{siteContact.phone}</span>
                </span>
              </MagneticLink>
              <MagneticLink
                href="/sahilcrane/broucher/girder-eot-crane.pdf"
                target="_blank"
                rel="noreferrer"
                strength={0.15}
                area={50}
                variant="ghost"
                className={`inline-flex h-[70px] min-w-0 items-center justify-center gap-2 ${CTA_GHOST_PADDING} text-xs font-extrabold text-slate-300 hover:text-safety max-sm:h-12 max-sm:w-full max-sm:px-4 max-sm:py-2 max-sm:text-[11px]`}>
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
