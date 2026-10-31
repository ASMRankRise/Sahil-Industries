"use client";

import { ModernPageShell } from "@/components/ModernPageShell";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { CareerForm } from "@/components/CareerForm";

export default function CareerPage() {
  return (
    <ModernPageShell
      eyebrow="Build your career"
      title="Career at Sahil Industries">
      <section className="py-28 max-md:py-20">
        <div className="mx-auto w-[min(1240px,calc(100%-64px))] max-md:w-[calc(100%-36px)] grid grid-cols-[minmax(260px,.72fr)_minmax(360px,1fr)] items-start gap-[clamp(45px,8vw,130px)] max-md:grid-cols-1">
          {/* Left Content - Staggered Reveal */}
          <RevealGroup staggerChildren={0.1} delayChildren={0.1}>
            <RevealItem variant="quickEnter">
              <p className="mb-4 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.15em] text-safety">
                <span className="h-0.5 w-8 bg-safety" />
                Join our team
              </p>
            </RevealItem>
            <RevealItem variant="quickEnter">
              <h2 className="mb-6 text-[clamp(34px,4vw,54px)] font-bold leading-[1.06] tracking-[-.05em]">
                Bring your expertise to material handling.
              </h2>
            </RevealItem>
            <RevealItem variant="quickEnter">
              <p>
                Share your details and resume with Sahil Industries. Our team
                will contact suitable candidates.
              </p>
            </RevealItem>
          </RevealGroup>

          {/* Right Form - Staggered Reveal */}
          <Reveal variant="pageEnter" delay={0.2}>
            <div className="space-y-5 border border-ink/20 bg-white p-[clamp(24px,4vw,46px)] shadow-safety">
              <RevealGroup staggerChildren={0.06} delayChildren={0.1}>
                <RevealItem variant="itemReveal">
                  <CareerForm />
                </RevealItem>
              </RevealGroup>
            </div>
          </Reveal>
        </div>
      </section>
    </ModernPageShell>
  );
}
