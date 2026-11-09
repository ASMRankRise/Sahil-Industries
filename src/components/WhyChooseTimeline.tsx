"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Award, CheckCircle, Cog, Headphones, Lightbulb, Shield, SlidersHorizontal, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { reasonsToChoose } from "@/data/about";

const icons = [Shield, Cog, SlidersHorizontal, Lightbulb, Headphones, Users, CheckCircle, Award];

export function WhyChooseTimeline() {
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
  const lineScale = useTransform(progress, [0.05, 0.9], [0, 1]);
  const trackX = useTransform(progress, [0.08, 0.92], ["0%", "-62.5%"]);

  return (
    <section ref={sectionRef} className="relative min-h-[300vh] bg-[#faf9f6] text-[#241116] max-md:min-h-0">
      <div className="sticky top-0 flex min-h-screen items-center overflow-hidden py-20 max-md:static max-md:min-h-0 max-md:py-16">
        <div className="mx-auto w-[min(1240px,calc(100%-64px))] max-md:w-[calc(100%-36px)]">
          <p className="mb-5 flex items-center justify-center gap-2 text-xs font-semibold tracking-[.18em] text-[#6f5b60]"><span className="text-xl">+</span> WHY CHOOSE US</p>
          <h2 className="mx-auto max-w-[850px] text-center text-[clamp(38px,5vw,68px)] font-medium leading-[1.05] tracking-[-.055em]">Reasons for choosing us.</h2>
          <p className="mx-auto mt-6 max-w-[560px] text-center text-base leading-7 text-[#766d70]">A dependable partner for every stage of your material-handling journey.</p>

          <div className="relative mt-24">
            <svg className="pointer-events-none absolute left-0 top-[-14px] hidden h-[145px] w-full overflow-visible md:block" viewBox="0 0 1200 145" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 30 C180 24 270 72 510 58 S865 8 1200 28" fill="none" stroke="#d8d5d3" strokeWidth="2" />
              <motion.path d="M0 30 C180 24 270 72 510 58 S865 8 1200 28" fill="none" stroke="#f6c515" strokeWidth="3" pathLength="1" style={{ pathLength: lineScale }} />
            </svg>
            <motion.div style={{ x: isMobile ? 0 : trackX }} className="relative flex w-[266.6667%] max-md:w-full max-md:flex-col max-md:gap-12">
              {reasonsToChoose.map(([title, description], index) => {
                const Icon = icons[index];
                const start = index * 0.1;
                const x = useTransform(progress, [start, start + 0.22], [index === 0 ? -80 : 80, 0]);
                const opacity = useTransform(progress, [start, start + 0.14], [index < 3 ? 1 : 0.35, 1]);
                return (
                  <motion.article key={title} style={{ x: isMobile ? 0 : x, opacity: isMobile ? 1 : opacity, width: "12.5%" }} className="relative min-w-0 shrink-0 overflow-visible pt-12 max-md:!w-full max-md:pt-0 max-md:pb-1">
                    <span className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full bg-[#fff36b] text-[#241116] shadow-sm max-md:-top-3 max-md:h-10 max-md:w-10"><Icon size={19} /></span>
                    <h3 className="mb-2 min-w-0 whitespace-normal break-words pl-14 text-2xl font-medium leading-tight tracking-[-.03em] max-md:text-[17px] max-md:leading-6">{title}</h3>
                    <p className="max-w-[300px] whitespace-normal break-words text-base leading-7 text-[#5f5558] max-md:text-[12px] max-md:leading-5">{description}</p>
                  </motion.article>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
