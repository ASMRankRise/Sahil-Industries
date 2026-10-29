'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

/** A single, isolated GSAP treatment for the homepage hero artwork. */
export function HeroMotion() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !root.current) return;
    const context = gsap.context(() => {
      gsap.fromTo('.hero-motion__orb', { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.25, ease: 'power3.out' });
      gsap.to('.hero-motion__line', { xPercent: 125, duration: 2.8, ease: 'power1.inOut', repeat: -1, yoyo: true, stagger: 0.18 });
    }, root);
    return () => context.revert();
  }, []);

  return <div ref={root} className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden="true"><span className="hero-motion__orb absolute right-[12%] top-[17%] aspect-square w-[420px] rounded-full border border-safety/50 shadow-[0_0_0_55px_rgba(246,197,21,.055),0_0_0_110px_rgba(246,197,21,.045)] max-md:right-[-50px] max-md:top-[12%] max-md:w-[230px]" /><i className="hero-motion__line absolute right-0 top-[35%] h-px w-[38%] bg-gradient-to-r from-transparent via-safety to-transparent opacity-65" /><i className="hero-motion__line absolute right-[9%] top-[49%] h-px w-[38%] bg-gradient-to-r from-transparent via-safety to-transparent opacity-65" /><i className="hero-motion__line absolute right-[2%] top-[63%] h-px w-[38%] bg-gradient-to-r from-transparent via-safety to-transparent opacity-65" /></div>;
}
