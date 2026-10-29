'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

const slides = ['/media/slider/slider-01.jpg', '/media/slider/slider-02.jpg'];

export function HeroSliderBackdrop() {
  const [active, setActive] = useState(0);
  const reducedMotion = useReducedMotion();
  useEffect(() => { if (reducedMotion) return; const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 6200); return () => window.clearInterval(timer); }, [reducedMotion]);
  return <><div className="absolute inset-0" aria-hidden="true"><AnimatePresence initial={false}>{slides.map((src, index) => index === active && <motion.div key={src} className="absolute inset-0 bg-cover bg-center opacity-50 saturate-[.72] contrast-110" style={{ backgroundImage: `url(${src})` }} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: .5, scale: 1 }} exit={{ opacity: 0 }} transition={{ opacity: { duration: reducedMotion ? 0 : .75 }, scale: { duration: reducedMotion ? 0 : 6.2, ease: 'linear' } }} />)}</AnimatePresence></div><div className="absolute bottom-[150px] right-[clamp(22px,4vw,65px)] z-10 grid gap-2.5" aria-label="Hero slides">{slides.map((_, index) => <button key={index} type="button" onClick={() => setActive(index)} className={`h-2.5 w-2.5 rounded-full border border-white/80 transition ${index === active ? 'scale-125 border-safety bg-safety' : 'bg-transparent'}`} aria-label={`Show slide ${index + 1}`} aria-current={index === active} />)}</div></>;
}
