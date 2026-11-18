"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Award, CheckCircle, Cog, Headphones, Lightbulb, Shield, SlidersHorizontal, Users, LucideIcon } from "lucide-react";
import { reasonsToChoose } from "@/data/about";

gsap.registerPlugin(ScrollTrigger);

const icons: LucideIcon[] = [Shield, Cog, SlidersHorizontal, Lightbulb, Headphones, Users, CheckCircle, Award];

export function WhySahilTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      ScrollTrigger.matchMedia({
        // Desktop: Pin and scrub horizontally until all points complete
        "(min-width: 768px)": function () {
          const track = trackRef.current;
          const container = containerRef.current;
          const line = lineRef.current;
          const section = sectionRef.current;

          if (!track || !container || !line || !section) return;

          const getScrollDistance = () => Math.max(0, track.scrollWidth - container.clientWidth);

          gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
          gsap.set(track, { x: 0 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              pin: true,
              scrub: 0.8,
              start: "top top",
              end: () => `+=${getScrollDistance() + 250}`,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          });

          // Translate horizontal track leftwards by exact needed distance
          tl.to(
            track,
            {
              x: () => -getScrollDistance(),
              ease: "none",
              duration: 1,
            },
            0
          );

          // Animate line from left to right in sync with points
          tl.to(
            line,
            {
              scaleX: 1,
              ease: "none",
              duration: 1,
            },
            0
          );
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-pinned-section="true"
      className="relative min-h-screen bg-ink text-white flex flex-col justify-center overflow-hidden py-16 md:py-24 max-md:min-h-0"
    >
      <div className="mx-auto w-[min(1240px,calc(100%-64px))] max-md:w-[calc(100%-36px)]">
        <p className="mb-4 flex items-center justify-center gap-2 text-xs font-semibold tracking-[.18em] text-safety">
          <span className="h-0.5 w-8 bg-safety" />
          WHY SAHIL
          <span className="h-0.5 w-8 bg-safety" />
        </p>
        <h2 className="mx-auto max-w-[850px] text-center text-[clamp(34px,4.5vw,60px)] font-bold leading-[1.05] tracking-[-.055em]">
          Built around operational confidence.
        </h2>
        <p className="mx-auto mt-4 max-w-[560px] text-center text-sm md:text-base leading-6 md:leading-7 text-slate-300">
          Engineering, support, and expertise that keep every lift moving forward.
        </p>

        <div ref={containerRef} className="relative mt-16 md:mt-24 overflow-hidden max-md:overflow-visible">
          {/* Background line track */}
          <div className="absolute left-0 right-0 top-[24px] hidden h-px bg-white/20 md:block" />

          {/* Animated progress indicator line */}
          <div
            ref={lineRef}
            className="absolute left-0 right-0 top-[24px] hidden h-[2px] bg-safety shadow-[0_0_12px_rgba(246,197,21,0.6)] md:block"
            style={{ transformOrigin: "left center" }}
          />

          {/* Horizontal Timeline Track */}
          <div
            ref={trackRef}
            className="relative flex w-max max-md:w-full max-md:flex-col gap-8 md:gap-16 pr-12 md:pr-40"
          >
            {reasonsToChoose.map(([title, description], index) => {
              const Icon = icons[index];
              return (
                <article
                  key={title}
                  className="timeline-card relative shrink-0 w-[290px] sm:w-[330px] md:w-[360px] pt-14 max-md:w-full max-md:pt-0 max-md:pb-1"
                >
                  <span className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full bg-safety text-ink shadow-[0_0_24px_rgba(246,197,21,.35)] transition-transform duration-300 hover:scale-110 max-md:-top-3 max-md:h-10 max-md:w-10">
                    <Icon size={20} />
                  </span>
                  <h3 className="mb-2 pl-14 text-xl md:text-2xl font-bold leading-tight max-md:text-[17px] max-md:leading-6">
                    {title}
                  </h3>
                  <p className="text-sm md:text-base leading-6 md:leading-7 text-slate-300 max-md:text-[12px] max-md:leading-5">
                    {description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
