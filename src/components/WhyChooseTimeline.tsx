"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Award,
  CheckCircle,
  Cog,
  Headphones,
  Lightbulb,
  Shield,
  SlidersHorizontal,
  Users,
  LucideIcon,
} from "lucide-react";
import { reasonsToChoose } from "@/data/about";

gsap.registerPlugin(ScrollTrigger);

const icons: LucideIcon[] = [
  Shield,
  Cog,
  SlidersHorizontal,
  Lightbulb,
  Headphones,
  Users,
  CheckCircle,
  Award,
];

export function WhyChooseTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);

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

          if (!track || !container || !section) return;

          const getScrollDistance = () =>
            Math.max(0, track.scrollWidth - container.clientWidth);

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
            0,
          );

          // Animate SVG path stroke if present
          if (line) {
            const length = line.getTotalLength ? line.getTotalLength() : 1200;
            gsap.set(line, {
              strokeDasharray: length,
              strokeDashoffset: length,
            });
            tl.to(
              line,
              {
                strokeDashoffset: 0,
                ease: "none",
                duration: 1,
              },
              0,
            );
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-pinned-section="true"
      className="relative min-h-screen bg-[#faf9f6] text-[#241116] flex flex-col justify-center overflow-hidden py-16 md:py-24 max-md:min-h-0">
      <div className="mx-auto w-[min(1240px,calc(100%-64px))] max-md:w-[calc(100%-36px)]">
        <p className="mb-4 flex items-center justify-center gap-2 text-xs font-semibold tracking-[.18em] text-[#6f5b60]">
          <span className="text-xl">+</span> WHY CHOOSE US
        </p>
        <h2 className="mx-auto max-w-[850px] text-center text-[clamp(34px,4.5vw,60px)] font-medium leading-[1.05] tracking-[-.055em]">
          Reasons for choosing us.
        </h2>
        <p className="mx-auto mt-4 max-w-[560px] text-center text-sm md:text-base leading-6 md:leading-7 text-[#766d70]">
          A dependable partner for every stage of your material-handling
          journey.
        </p>

        <div
          ref={containerRef}
          className="relative mt-16 md:mt-24 overflow-hidden max-md:overflow-visible">
          <svg
            className="pointer-events-none absolute left-0 top-[-14px] hidden h-[145px] w-full overflow-visible md:block"
            viewBox="0 0 1200 145"
            preserveAspectRatio="none"
            aria-hidden="true">
            <path
              d="M0 30 C180 24 270 72 510 58 S865 8 1200 28"
              fill="none"
              stroke="#d8d5d3"
              strokeWidth="2"
            />
            <path
              ref={lineRef}
              d="M0 30 C180 24 270 72 510 58 S865 8 1200 28"
              fill="none"
              stroke="#f6c515"
              strokeWidth="3"
            />
          </svg>

          <div
            ref={trackRef}
            className="relative flex w-max max-md:w-full max-md:flex-col gap-8 md:gap-16 pr-12 md:pr-40">
            {reasonsToChoose.map(([title, description], index) => {
              const Icon = icons[index];
              return (
                <article
                  key={title}
                  className="timeline-card relative shrink-0 w-[290px] sm:w-[330px] md:w-[360px] pt-12 max-md:w-full max-md:pt-0 max-md:pb-1">
                  <span className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full bg-[#fff36b] text-[#241116] shadow-sm transition-transform duration-300 hover:scale-110 max-md:-top-3 max-md:h-10 max-md:w-10">
                    <Icon size={19} />
                  </span>
                  <h3 className="mb-2 pl-14 text-xl md:text-2xl font-medium leading-tight tracking-[-.03em] max-md:text-[17px] max-md:leading-6">
                    {title}
                  </h3>
                  <p className="text-sm md:text-base leading-6 md:leading-7 text-[#5f5558] max-md:text-[12px] max-md:leading-5">
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
