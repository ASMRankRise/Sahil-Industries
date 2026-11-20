"use client";

import { motion } from "framer-motion";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Parallax, ParallaxLayer } from "@/components/ui/Parallax";
import { useReducedMotion } from "@/components/animations/hooks/useReducedMotion";

type PageHeroProps = { eyebrow: string; title: string; image?: string };
const HERO = "relative isolate flex min-h-[250px] items-center overflow-hidden bg-cover bg-center py-12 text-white before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-r before:from-ink/65 before:via-ink/35 before:to-ink/15 md:min-h-[320px] lg:min-h-[390px]";
const CONTAINER = "mx-auto w-[calc(100%-36px)] md:w-[min(1240px,calc(100%-64px))]";
const TITLE = "max-w-4xl text-[clamp(32px,6vw,42px)] font-bold leading-[1.04] tracking-[-.055em] [overflow-wrap:anywhere] md:text-[clamp(42px,5vw,68px)]";

export function PageHero({
  eyebrow,
  title,
  image = "/sahilcrane/about/about-img.jpg",
}: PageHeroProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return (
      <section
        className={HERO}
        style={{ backgroundImage: `url('${image}')` }}>
        <div className={CONTAINER}>
          <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[.15em] text-safety">
            {eyebrow}
          </p>
          <h1 className={TITLE}>
            {title}
          </h1>
        </div>
      </section>
    );
  }

  return (
    <section
      className={HERO}
      style={{ backgroundImage: `url('${image}')` }}>
      {/* Parallax background layers */}
      <Parallax speed={0.3} maxOffset={50}>
        <ParallaxLayer
          speed={0.1}
          yPercent={20}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${image}')` }}
        />
      </Parallax>

      <div className={CONTAINER}>
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
              <motion.h1
                 className={TITLE}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}>
                {title}
              </motion.h1>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
