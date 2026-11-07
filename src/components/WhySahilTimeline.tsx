"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Award, CheckCircle, Cog, Headphones, Lightbulb, Shield, SlidersHorizontal, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { reasonsToChoose } from "@/data/about";

const icons = [Shield, Cog, SlidersHorizontal, Lightbulb, Headphones, Users, CheckCircle, Award];

export function WhySahilTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.35 });
  const trackX = useTransform(progress, [0.08, 0.92], ["0%", "-62.5%"]);
  const lineScale = useTransform(progress, [0.05, 0.9], [0, 1]);

  return (
    <section ref={sectionRef} className="relative min-h-[300vh] bg-ink text-white max-md:min-h-0">
      <div className="sticky top-0 flex min-h-screen items-center overflow-hidden py-20 max-md:static max-md:min-h-0 max-md:py-16">
        <div className="mx-auto w-[min(1240px,calc(100%-64px))] max-md:w-[calc(100%-36px)]">
          <p className="mb-5 flex items-center justify-center gap-2 text-xs font-semibold tracking-[.18em] text-safety"><span className="h-0.5 w-8 bg-safety" />WHY SAHIL<span className="h-0.5 w-8 bg-safety" /></p>
          <h2 className="mx-auto max-w-[850px] text-center text-[clamp(38px,5vw,68px)] font-bold leading-[1.05] tracking-[-.055em]">Built around operational confidence.</h2>
          <p className="mx-auto mt-6 max-w-[560px] text-center text-base leading-7 text-slate-300">Engineering, support, and expertise that keep every lift moving forward.</p>
          <div className="relative mt-24">
            <div className="absolute left-0 right-0 top-[24px] hidden h-px bg-white/20 md:block" />
            <motion.div style={{ scaleX: lineScale, transformOrigin: "left" }} className="absolute left-0 right-0 top-[24px] hidden h-[2px] bg-safety md:block" />
            <motion.div style={{ x: isMobile ? 0 : trackX }} className="relative flex w-[266.6667%] max-md:w-full max-md:flex-col max-md:gap-12">
              {reasonsToChoose.map(([title, description], index) => {
                const Icon = icons[index];
                const start = index * 0.1;
                const x = useTransform(progress, [start, start + 0.2], [index === 0 ? -70 : 70, 0]);
                const opacity = useTransform(progress, [start, start + 0.14], [index < 3 ? 1 : 0.35, 1]);
                return <motion.article key={title} style={{ x: isMobile ? 0 : x, opacity: isMobile ? 1 : opacity, width: "12.5%" }} className="relative shrink-0 pt-14 max-md:!w-full max-md:pt-0"><span className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full bg-safety text-ink shadow-[0_0_24px_rgba(246,197,21,.25)]"><Icon size={21} /></span><h3 className="mb-4 text-2xl font-bold">{title}</h3><p className="max-w-[300px] text-base leading-7 text-slate-300">{description}</p></motion.article>;
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
