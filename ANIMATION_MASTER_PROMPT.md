# Master Prompt: Modern Animation Implementation for Sahil Industries Website

## Project Context
- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS 3.4
- **Animation Libraries Installed**: 
  - `framer-motion@^14.7.1` (React-first declarative animations)
  - `gsap@^3.15.0` (High-performance imperative animations)
  - `swiper@^14.3.0` (Touch-enabled carousels)
- **Current Animation State**: 
  - `Reveal` component (Framer Motion) - basic fade-up entrance
  - `HeroMotion` (GSAP) - hero orb/line animation
  - `SiteHeader` mobile menu (Framer Motion AnimatePresence)
  - Legacy `wow.js`/`AOS` classes still present in legacy components

---

## 🎯 Core Principles (NON-NEGOTIABLE)

1. **ZERO UI DESIGN CHANGES** - Colors, spacing, typography, layout, component structure must remain identical
2. **Progressive Enhancement** - Animations must respect `prefers-reduced-motion`
3. **Performance First** - 60fps target, GPU-accelerated transforms only, no layout thrashing
4. **Library Separation of Concerns**:
   - **Framer Motion**: React lifecycle, layout transitions, shared layout, gesture handling, exit animations
   - **GSAP**: Complex timelines, scroll-triggered sequences, morphing, text splitting, canvas/WebGL, high-frequency updates
5. **Accessibility** - All animations must have reduced-motion fallbacks, proper ARIA, focus management

---

## 📦 Animation Strategy by Component Type

### 1. Page-Level Entrance (Framer Motion)
**Target**: All pages using `ModernPageShell` (Career, About, Contact, Services, Products, Clients)
```tsx
// Pattern: Staggered section reveals with viewport detection
<motion.section
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
>
```

### 2. Hero Sections (GSAP + Framer Motion Hybrid)
**Target**: HomePage hero, Product detail heroes, PageHero component
- **GSAP**: Background orbs, line animations, parallax layers, counter animations
- **Framer Motion**: Content reveal (headline, CTA, stats) with `staggerChildren`

### 3. Scroll-Triggered Sequences (GSAP ScrollTrigger)
**Target**: 
- About section (image parallax, counter numbers)
- Products grid (staggered card reveals)
- Why Choose / Industries / Clients sections
- Stats counters (22+ years, 100+ customers, etc.)

```tsx
// GSAP ScrollTrigger pattern
gsap.timeline({
  scrollTrigger: {
    trigger: '.section-ref',
    start: 'top 75%',
    toggleActions: 'play none none reverse'
  }
})
.to('.counter', { innerText: 100, duration: 2, snap: { innerText: 1 } })
.from('.card', { y: 40, opacity: 0, stagger: 0.08, duration: 0.5 }, '-=1.5');
```

### 4. Interactive Micro-Animations (Framer Motion)
**Target**: Buttons, form inputs, cards, navigation, dropdowns
```tsx
// Button press/tap feedback
whileTap={{ scale: 0.98 }}
whileHover={{ y: -2, boxShadow: '0 12px 24px rgba(0,0,0,0.15)' }}

// Form input focus
whileFocus={{ borderColor: '#F6C515', boxShadow: '0 0 0 3px rgba(246,197,21,0.2)' }}

// Card hover lift
whileHover={{ y: -4, transition: { duration: 0.2 } }}
```

### 5. Layout Transitions (Framer Motion `layout` prop)
**Target**: 
- Mobile menu (already implemented)
- Product filter/sort transitions
- Cart/checkout flows (future)
- Image gallery lightbox

### 6. Complex Product Page Animations (GSAP)
**Target**: Product detail pages (SingleGirder, DoubleGirder, etc.)
- Specification table row reveals
- Image gallery zoom/pan
- Tab transitions with `AnimateSharedLayout`
- 3D model viewer integration (future)

---

## 🛠 Implementation Checklist

### Phase 1: Foundation & Utilities
- [ ] Create `useReducedMotion` hook
- [ ] Create `gsapContext` wrapper for cleanup
- [ ] Create `ScrollTrigger` provider (client-side only)
- [ ] Define animation variants library (`variants.ts`)
- [ ] Add `will-change` CSS utility classes

### Phase 2: Global Components
- [ ] **SiteHeader**: Enhance dropdown with spring physics, add logo morph on scroll
- [ ] **SiteFooter**: Stagger link groups on viewport enter
- [ ] **PageHero**: Parallax background, headline word-by-word reveal
- [ ] **ModernContactBand**: Pulse CTA, counter animation

### Phase 3: Page-Specific Animations

#### HomePage (`ModernHomePage.tsx`)
- [ ] Hero: GSAP timeline for orb + lines + content stagger
- [ ] About section: Image parallax (GSAP), counter numbers (GSAP)
- [ ] Products grid: Staggered card entrance (Framer Motion `staggerChildren`)
- [ ] Why Choose: Scroll-triggered icon animations (GSAP)
- [ ] Industries: Carousel already has Swiper - enhance with GSAP drag momentum
- [ ] Clients: Logo wall stagger + grayscale-to-color hover (Framer Motion)
- [ ] CTA band: Pulse animation on CTA button

#### CareerPage (`CareerPage.tsx`)
- [ ] Form field staggered entrance (Framer Motion)
- [ ] Submit button: loading state with spinner, success checkmark animation
- [ ] File upload: drag-over highlight, progress bar
- [ ] Captcha: subtle shake on error

#### Product Pages (`SingleGirderPage`, `DoubleGirderPage`, etc.)
- [ ] Hero: Specification highlights animate in
- [ ] Image gallery: Smooth zoom/pan (GSAP)
- [ ] Spec table: Row-by-row reveal on scroll
- [ ] Tab switching: `AnimateSharedLayout` for smooth content morph
- [ ] Download brochure: Button ripple effect

#### AboutPage, ServicesPage, ClientsPage, ContactPage, EnquiryPage
- [ ] Section-by-section scroll reveals
- [ ] Form interactions (Contact, Enquiry)
- [ ] Map/location animations (Contact)
- [ ] Team cards stagger (About)

### Phase 4: Advanced Polish
- [ ] Page transitions (Framer Motion `AnimatePresence` + `layout` on shared elements)
- [ ] Scroll progress indicator (GSAP)
- [ ] Magnetic buttons (GSAP)
- [ ] Text split/reveal animations (GSAP SplitText)
- [ ] Cursor follower (optional, GSAP)

---

## 📁 File Structure for Animation Code

```
src/
├── components/
│   ├── ui/
│   │   ├── Reveal.tsx              # Enhanced with variants
│   │   ├── HeroMotion.tsx          # GSAP hero animations
│   │   ├── MagneticButton.tsx      # GSAP magnetic effect
│   │   ├── ScrollProgress.tsx      # GSAP scroll indicator
│   │   ├── TextReveal.tsx          # GSAP SplitText wrapper
│   │   ├── Counter.tsx             # GSAP animated numbers
│   │   ├── Parallax.tsx            # GSAP parallax wrapper
│   │   └── StaggerGroup.tsx        # Framer Motion stagger container
│   ├── animations/
│   │   ├── variants.ts             # Shared Framer Motion variants
│   │   ├── gsapUtils.ts            # GSAP helpers, context, ScrollTrigger
│   │   ├── hooks/
│   │   │   ├── useReducedMotion.ts
│   │   │   ├── useGSAPContext.ts
│   │   │   └── useScrollTrigger.ts
│   │   └── index.ts
├── lib/
│   └── animation.ts                # Global config, easing, durations
```

---

## 🎨 Animation Variants Library (Framer Motion)

```typescript
// src/components/animations/variants.ts
export const variants = {
  // Page/Section entrance
  pageEnter: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },
  
  // Staggered children
  staggerContainer: {
    animate: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
  },
  
  // Card/item reveal
  itemReveal: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  },
  
  // Button interactions
  button: {
    whileHover: { y: -2, scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.15, ease: 'easeOut' }
  },
  
  // Form field
  field: {
    whileFocus: { 
      borderColor: '#F6C515', 
      boxShadow: '0 0 0 3px rgba(246,197,21,0.2)',
      transition: { duration: 0.2 }
    }
  },
  
  // Modal/sidebar
  slideInRight: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
    transition: { type: 'tween', duration: 0.3, ease: [0.22, 1, 0.36, 1] }
  },
  
  // Fade for AnimatePresence
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 }
  }
};
```

---

## ⚡ GSAP Utilities

```typescript
// src/components/animations/gsapUtils.ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

export function useGSAPContext(selector?: string) {
  const ctxRef = useRef<gsap.Context | null>(null);
  const rootRef = useRef<HTMLElement>(null);
  
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    ctxRef.current = gsap.context(() => {}, rootRef.current);
    return () => ctxRef.current?.revert();
  }, []);
  
  return { rootRef, ctx: ctxRef.current };
}

export function createScrollTrigger(config: gsap.ScrollTriggerInstanceVars) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  return ScrollTrigger.create(config);
}

export function animateCounter(element: HTMLElement, end: number, duration = 2) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    element.textContent = end.toLocaleString();
    return;
  }
  gsap.to({ val: 0 }, {
    val: end,
    duration,
    ease: 'power2.out',
    onUpdate: function() {
      element.textContent = Math.round(this.targets()[0].val).toLocaleString();
    }
  });
}
```

---

## 🎯 Specific Implementation Examples

### Enhanced Reveal Component
```tsx
// src/components/ui/Reveal.tsx
'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { variants } from '@/components/animations/variants';

type RevealProps = HTMLMotionProps<'div'> & {
  delay?: number;
  variant?: keyof typeof variants;
};

export function Reveal({ 
  delay = 0, 
  variant = 'pageEnter', 
  children, 
  className,
  ...props 
}: RevealProps) {
  const v = variants[variant];
  return (
    <motion.div
      initial={v.initial}
      animate={v.animate}
      transition={{ ...v.transition, delay }}
      viewport={{ once: true, amount: 0.15 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
```

### StaggerGroup for Lists/Grids
```tsx
// src/components/ui/StaggerGroup.tsx
'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { variants } from '@/components/animations/variants';

export function StaggerGroup({ 
  children, 
  stagger = 0.08, 
  delayChildren = 0.1,
  ...props 
}: HTMLMotionProps<'div'> & { stagger?: number; delayChildren?: number }) {
  return (
    <motion.div
      animate={{ transition: { staggerChildren: stagger, delayChildren } }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Usage:
<StaggerGroup stagger={0.06}>
  {items.map(item => (
    <motion.div key={item.id} variants={variants.itemReveal}>
      {item.content}
    </motion.div>
  ))}
</StaggerGroup>
```

### GSAP Counter Component
```tsx
// src/components/ui/Counter.tsx
'use client';

import { useEffect, useRef } from 'react';
import { animateCounter } from '@/components/animations/gsapUtils';

interface CounterProps {
  end: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function Counter({ end, duration = 2, className, prefix = '', suffix = '' }: CounterProps) {
  const elRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    if (!elRef.current) return;
    animateCounter(elRef.current, end, duration);
  }, [end, duration]);
  
  return (
    <span ref={elRef} className={className}>
      {prefix}{0}{suffix}
    </span>
  );
}
```

---

## 🚫 What NOT to Animate (Preserve UI Design)

| Element | Reason |
|---------|--------|
| Layout dimensions (width/height/padding/margin) | Causes layout shift, breaks design |
| Font sizes, line heights, font weights | Typography must remain exact |
| Color values (except hover/focus states defined in design) | Brand consistency |
| Border radius, border widths | Design system integrity |
| Grid/flex structure | Layout stability |
| Z-index stacking order | Visual hierarchy |

### ✅ What TO Animate (GPU-Accelerated Only)
- `transform`: `translateX/Y`, `scale`, `rotate`, `skew`
- `opacity`
- `filter`: `blur`, `brightness`, `grayscale` (hover states)
- `clip-path` (for reveals)
- `background-position` (parallax)
- SVG stroke-dashoffset (line drawing)

---

## 📱 Responsive Animation Rules

```css
/* Reduce motion on mobile for performance */
@media (max-width: 768px) {
  .reduce-motion-mobile {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

/* Disable complex GSAP on low-end devices */
@media (prefers-reduced-motion: reduce), (max-width: 480px) {
  .gsap-heavy { display: none; }
  .gsap-light { opacity: 1 !important; transform: none !important; }
}
```

---

## 🧪 Testing Checklist

- [ ] `prefers-reduced-motion: reduce` - all animations disabled/graceful
- [ ] Mobile performance (60fps on 5-year-old devices)
- [ ] Lighthouse Performance score > 90
- [ ] No layout shift (CLS < 0.1)
- [ ] Keyboard navigation works during animations
- [ ] Screen readers not disrupted
- [ ] Exit animations complete before unmount
- [ ] GSAP contexts properly cleaned up
- [ ] No memory leaks on page navigation

---

## 📋 Implementation Order (Recommended)

1. **Week 1**: Foundation (hooks, variants, utils, Reveal enhancement)
2. **Week 2**: Global components (Header, Footer, PageHero, ContactBand)
3. **Week 3**: HomePage (most visible, highest impact)
4. **Week 4**: Product pages (complex, high value)
5. **Week 5**: Remaining pages (Career, About, Services, Contact, Clients, Enquiry)
6. **Week 6**: Polish (page transitions, advanced GSAP, testing)

---

## 🔑 Key Files to Modify

| File | Changes |
|------|---------|
| `src/components/ui/Reveal.tsx` | Add variants, stagger support |
| `src/components/ui/HeroMotion.tsx` | Expand for all hero types |
| `src/components/SiteHeader.tsx` | Enhanced dropdown, scroll effects |
| `src/components/SiteFooter.tsx` | Stagger reveals |
| `src/components/PageHero.tsx` | Parallax, word reveal |
| `src/components/ModernPageShell.tsx` | Page transition wrapper |
| `src/components/ModernHomePage.tsx` | Section animations |
| `src/components/CareerPage.tsx` | Form animations |
| `src/components/ProductPage.tsx` / product pages | Gallery, specs, tabs |
| `src/app/layout.tsx` | Add animation provider |

---

## 💡 Pro Tips

1. **Always wrap GSAP in `gsap.context()`** for automatic cleanup
2. **Use `layout` prop on Framer Motion** for shared element transitions
3. **Batch DOM reads/writes** - GSAP does this automatically
4. **Prefer `transform` over `top/left`** for position animations
5. **Use `will-change` sparingly** - only on actively animating elements
6. **Test on real devices** - not just dev tools throttling
7. **Document animation decisions** in code comments for maintenance

---

## 🎬 Example: Complete HomePage Hero Animation

```tsx
// Enhanced HeroMotion.tsx
'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function HeroMotion() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !root.current) return;
    
    const ctx = gsap.context(() => {
      // Orb entrance
      gsap.fromTo('.hero-motion__orb', 
        { scale: 0.7, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 1.25, ease: 'power3.out' }
      );
      
      // Line animation
      gsap.to('.hero-motion__line', { 
        xPercent: 125, 
        duration: 2.8, 
        ease: 'power1.inOut', 
        repeat: -1, 
        yoyo: true, 
        stagger: 0.18 
      });
      
      // Parallax on scroll
      gsap.to('.hero-motion__orb', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });
    }, root);
    
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden="true">
      <span className="hero-motion__orb absolute right-[12%] top-[17%] aspect-square w-[420px] rounded-full border border-safety/50 shadow-[0_0_0_55px_rgba(246,197,21,.055),0_0_0_110px_rgba(246,197,21,.045)] max-md:right-[-50px] max-md:top-[12%] max-md:w-[230px]" />
      <i className="hero-motion__line absolute right-0 top-[35%] h-px w-[38%] bg-gradient-to-r from-transparent via-safety to-transparent opacity-65" />
      <i className="hero-motion__line absolute right-[9%] top-[49%] h-px w-[38%] bg-gradient-to-r from-transparent via-safety to-transparent opacity-65" />
      <i className="hero-motion__line absolute right-[2%] top-[63%] h-px w-[38%] bg-gradient-to-r from-transparent via-safety to-transparent opacity-65" />
    </div>
  );
}
```

---

This master prompt provides a complete roadmap for implementing modern, performant animations across the Sahil Industries website using GSAP and Framer Motion while maintaining the exact current UI design.