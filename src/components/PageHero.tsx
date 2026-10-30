"use client";

import { motion } from "framer-motion";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { TextRevealLine } from "@/components/ui/TextReveal";
import { Parallax, ParallaxLayer } from "@/components/ui/Parallax";
import { useReducedMotion } from "@/components/animations/hooks/useReducedMotion";

type PageHeroProps = { eyebrow: string; title: string; image?: string };

export function PageHero({
  eyebrow,
  title,
  image = "/sahilcrane/about/about-img.jpg",
}: PageHeroProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return (
      <section
        className="relative isolate flex min-h-[390px] items-center overflow-hidden bg-cover bg-center text-white before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-r before:from-ink/95 before:to-ink/45"
        style={{ backgroundImage: `url('${image}')` }}>
        <div className="mx-auto w-[min(1240px,calc(100%-64px))] max-sm:w-[calc(100%-36px)]">
          <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[.15em] text-safety">
            {eyebrow}
          </p>
          <h1 className="max-w-4xl text-[clamp(42px,5vw,68px)] font-bold leading-[1.04] tracking-[-.055em]">
            {title}
          </h1>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative isolate flex min-h-[390px] items-center overflow-hidden bg-cover bg-center text-white before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-r before:from-ink/95 before:to-ink/45"
      style={{ backgroundImage: `url('${image})` }}>
      {/* Parallax background layers */}
      <Parallax speed={0.3} maxOffset={50}>
        <ParallaxLayer
          speed={0.1}
          yPercent={20}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${image}')` }}
        />
      </Parallax>

      <div className="mx-auto w-[min(1240px,calc(100%-64px))] max-sm:w-[calc(100%-36px)]">
        <RevealGroup staggerChildren={0.1} delayChildren={0.1}>
          <RevealItem variant="quickEnter">
            <motion.p
              className="mb-3 text-[11px] font-extrabold uppercase tracking-[.15em] text-safety"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}>
              {eyebrow}
            </motion.p>
          </RevealItem>
          <RevealItem variant="quickEnter">
            <TextRevealLine
              split="lines"
              stagger={0.1}
              className="max-w-4xl text-[clamp(42px,5vw,68px)] font-bold leading-[1.04] tracking-[-.055em]"
              from={{ opacity: 0, y: 30 }}
              to={{ opacity: 1, y: 0 }}
              duration={0.7}>
              {title}
            </TextRevealLine>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
