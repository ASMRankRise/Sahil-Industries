'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

// Standardized constants for HeroMotion
const ORB_CLASS = "hero-motion__orb absolute right-[12%] top-[17%] aspect-square w-[420px] rounded-full border border-safety/50 shadow-[0_0_0_55px_rgba(246,197,21,.055),0_0_0_110px_rgba(246,197,21,.045)] max-md:right-[-50px] max-md:top-[12%] max-md:w-[230px]";
const LINE_CLASS = "hero-motion__line absolute right-0 top-[35%] h-px w-[38%] bg-gradient-to-r from-transparent via-safety to-transparent opacity-65";
const LINE_2_CLASS = "hero-motion__line absolute right-[9%] top-[49%] h-px w-[38%] bg-gradient-to-r from-transparent via-safety to-transparent opacity-65";
const LINE_3_CLASS = "hero-motion__line absolute right-[2%] top-[63%] h-px w-[38%] bg-gradient-to-r from-transparent via-safety to-transparent opacity-65";
const ORB_ANIMATION = { scale: 1, opacity: 1, duration: 1.25, ease: 'power3.out' };
const ORB_INITIAL = { scale: 0.7, opacity: 0 };
const LINE_ANIMATION = { xPercent: 125, duration: 2.8, ease: 'power1.inOut', repeat: -1, yoyo: true, stagger: 0.18 };

/** A single, isolated GSAP treatment for the homepage hero artwork. */
export function HeroMotion() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !root.current) return;
    const context = gsap.context(() => {
      gsap.fromTo('.hero-motion__orb', ORB_INITIAL, ORB_ANIMATION);
      gsap.to('.hero-motion__line', LINE_ANIMATION);
    }, root);
    return () => context.revert();
  }, []);

  return (
    <div ref={root} className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden="true">
      <span className={ORB_CLASS} />
      <i className={LINE_CLASS} />
      <i className={LINE_2_CLASS} />
      <i className={LINE_3_CLASS} />
    </div>
  );
}
