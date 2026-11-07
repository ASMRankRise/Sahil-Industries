'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

// Standardized constants for HeroMotion
const ORB_CLASS = "hero-motion__orb absolute right-[12%] top-[17%] aspect-square w-[420px] rounded-full border-[3px] border-safety bg-safety/[0.06] shadow-[0_0_35px_rgba(246,197,21,.45),0_0_0_42px_rgba(246,197,21,.14),0_0_0_95px_rgba(246,197,21,.08)] max-md:right-[-50px] max-md:top-[12%] max-md:w-[230px]";
const ORB_INNER_CLASS = "hero-motion__orb-inner absolute inset-[11%] rounded-full border border-safety/60 shadow-[inset_0_0_30px_rgba(246,197,21,.18)]";
const ORB_RING_CLASS = "hero-motion__orb-ring absolute rounded-full border-2 border-solid border-safety";
const ORB_CORE_CLASS = "hero-motion__orb-core absolute left-1/2 top-1/2 h-36 w-44 -translate-x-1/2 -translate-y-1/2 bg-transparent p-2 object-contain drop-shadow-[0_0_14px_rgba(246,197,21,.4)] max-md:h-28 max-md:w-36";
const LINE_CLASS = "hero-motion__line absolute right-0 top-[35%] h-px w-[38%] bg-gradient-to-r from-transparent via-safety to-transparent opacity-65";
const LINE_2_CLASS = "hero-motion__line absolute right-[9%] top-[49%] h-px w-[38%] bg-gradient-to-r from-transparent via-safety to-transparent opacity-65";
const LINE_3_CLASS = "hero-motion__line absolute right-[2%] top-[63%] h-px w-[38%] bg-gradient-to-r from-transparent via-safety to-transparent opacity-65";
const DOT_CONNECTOR_CLASS = "hero-motion__dot-connector absolute left-0 top-[47%] h-px w-[78%] bg-gradient-to-r from-safety/10 via-safety/35 to-safety opacity-60";
const ORB_ANIMATION = { scale: 1, opacity: 1, duration: 1.25, ease: 'power3.out' };
const ORB_INITIAL = { scale: 0.7, opacity: 0 };
const LINE_ANIMATION = { xPercent: 125, duration: 2.8, ease: 'power1.inOut', repeat: -1, yoyo: true, stagger: 0.18 };
const ORB_PULSE = { scale: 1.035, opacity: 0.82, duration: 3.6, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 1.3 };

/** A single, isolated GSAP treatment for the homepage hero artwork. */
export function HeroMotion() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !root.current) return;
    const context = gsap.context(() => {
      gsap.fromTo('.hero-motion__orb', ORB_INITIAL, ORB_ANIMATION);
      gsap.to('.hero-motion__orb', ORB_PULSE);
      gsap.to('.hero-motion__orb-inner', { rotate: 360, duration: 18, ease: 'none', repeat: -1 });
      gsap.to('.hero-motion__orb-ring--outer', { rotate: -360, duration: 15, ease: 'none', repeat: -1, transformOrigin: 'center center' });
      gsap.to('.hero-motion__orb-ring--inner', { rotate: 360, duration: 8, ease: 'none', repeat: -1, transformOrigin: 'center center' });
      gsap.to('.hero-motion__line', LINE_ANIMATION);
    }, root);
    return () => context.revert();
  }, []);

  return (
    <div ref={root} className="pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden="true">
      <span className={ORB_CLASS}>
        <span className={ORB_INNER_CLASS} />
        <span className={`${ORB_RING_CLASS} hero-motion__orb-ring--outer -inset-[9%] opacity-80`} />
        <span className={`${ORB_RING_CLASS} hero-motion__orb-ring--inner inset-[23%] opacity-90`} />
        <img className={ORB_CORE_CLASS} src="/media/logo/hero-center.svg?v=4" alt="Sahil Industries" />
      </span>
      <i className={LINE_CLASS} />
      <i className={LINE_2_CLASS} />
      <i className={LINE_3_CLASS} />
      <i className={DOT_CONNECTOR_CLASS} />
    </div>
  );
}
