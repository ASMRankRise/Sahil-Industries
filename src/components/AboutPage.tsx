import { ModernPageShell } from "@/components/ModernPageShell";
import { Reveal } from "@/components/ui/Reveal";
import { Award, Factory, Shield, Wrench, ArrowRight } from "lucide-react";
import { WhyChooseTimeline } from "@/components/WhyChooseTimeline";
import Image from "next/image";
import Link from "next/link";

const asset = (path: string) => `/sahilcrane/${path}`;

export default function AboutPage() {
  return (
    <ModernPageShell
      eyebrow="About Sahil Industries"
      title="Hoist EOT Cranes Manufacturer in India">
      {/* 1. Our Foundation Section */}
      <section className="py-24 max-md:py-16 bg-gradient-to-b from-white via-slate-50/60 to-white">
        <div className="mx-auto grid w-[min(1240px,calc(100%-64px))] grid-cols-1 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] items-center gap-12 lg:gap-16 max-md:w-[calc(100%-36px)]">
          {/* Left Column: Story & Capabilities */}
          <Reveal>
            <div>
              <p className="mb-3.5 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.18em] text-[#9b7800]">
                <span className="h-0.5 w-7 bg-safety" />
                Our Foundation
              </p>
              <h2 className="mb-5 text-[clamp(32px,3.8vw,50px)] font-bold leading-[1.08] tracking-[-.045em] text-ink">
                Engineering trust into every lift.
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-slate-700 font-medium">
                Sahil Industries manufactures purpose-built industrial cranes
                and heavy material-handling equipment from our facility in
                Kolhapur&apos;s prestigious Five Star MIDC, Kagal.
              </p>
              <p className="mt-3 text-sm sm:text-base leading-7 text-slate-600">
                Manufactured strictly in compliance with IS guidelines, our
                cranes are engineered for custom lifting capacities up to 200
                tons. We proudly serve prominent industrial clients nationally
                and globally across manufacturing, steel, automotive, and
                infrastructure sectors.
              </p>

              {/* 4 Key Pillars Grid */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm transition-all duration-300 hover:border-safety/80 hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-safety/15 text-ink">
                      <Factory size={20} className="text-[#9b7800]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        Facility
                      </p>
                      <h4 className="text-sm font-bold text-ink">
                        5-Star MIDC, Kagal
                      </h4>
                    </div>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    State-of-the-art manufacturing and load-testing unit in
                    Kolhapur.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm transition-all duration-300 hover:border-safety/80 hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-safety/15 text-ink">
                      <Shield size={20} className="text-[#9b7800]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        Capacity
                      </p>
                      <h4 className="text-sm font-bold text-ink">
                        Up to 200 Tons
                      </h4>
                    </div>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Wire rope hoists, open winches & explosion-proof custom
                    builds.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm transition-all duration-300 hover:border-safety/80 hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-safety/15 text-ink">
                      <Award size={20} className="text-[#9b7800]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        Standard
                      </p>
                      <h4 className="text-sm font-bold text-ink">
                        IS Compliant
                      </h4>
                    </div>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Strict adherence to Indian Standards and safe working load
                    certifications.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm transition-all duration-300 hover:border-safety/80 hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-safety/15 text-ink">
                      <Wrench size={20} className="text-[#9b7800]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        Lifecycle Service
                      </p>
                      <h4 className="text-sm font-bold text-ink">
                        Any Make Support
                      </h4>
                    </div>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    100+ clients supported with repair, maintenance, and
                    retrofit solutions.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg bg-ink px-6 py-3.5 text-xs font-extrabold uppercase tracking-industrial text-white shadow-md transition-all duration-300 hover:bg-safety hover:text-ink hover:shadow-lg">
                  <span>Discuss Your Requirement</span>
                  <ArrowRight size={15} />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3.5 text-xs font-bold uppercase tracking-industrial text-slate-700 transition-colors duration-200 hover:border-ink hover:text-ink">
                  View Product Range
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Right Column: Staged Facility Visual */}
          <Reveal delay={0.12}>
            <div className="relative mx-auto w-full max-w-[540px] lg:max-w-none">
              {/* Decorative background framing */}
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-safety/20 via-slate-100 to-transparent -z-10" />
              <div className="absolute -bottom-4 -right-4 h-44 w-44 rounded-2xl border-2 border-safety/30 -z-10 hidden sm:block" />

              {/* Main Image Card */}
              <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-ink shadow-2xl">
                <Image
                  src={asset("about/sahilcrane-img.jpg")}
                  alt="Sahil Industries manufacturing facility in Five Star MIDC, Kagal"
                  width={800}
                  height={600}
                  className="h-[420px] sm:h-[480px] w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent pointer-events-none" />

                {/* Top Badge: Active Facility */}
                <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-ink/90 px-3.5 py-1.5 backdrop-blur-md border border-white/10 text-white shadow-lg">
                  <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[11px] font-semibold tracking-wide">
                    Manufacturing &amp; Testing Unit
                  </span>
                </div>

                {/* Bottom Overlay Card */}
                <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/15 bg-ink/95 p-4 backdrop-blur-md text-white shadow-2xl">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-safety">
                        Kolhapur Facility
                      </p>
                      <p className="text-sm font-bold text-white mt-0.5">
                        5-Star MIDC, Kagal
                      </p>
                    </div>
                    <div className="text-right border-l border-white/15 pl-4 shrink-0">
                      <p className="text-xl font-black text-safety leading-none">
                        100+
                      </p>
                      <p className="text-[10px] text-slate-300 mt-1 uppercase font-semibold">
                        Clients Served
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. Director Section */}
      <section className="bg-ink py-28 text-slate-300 max-md:py-20">
        <div className="mx-auto grid w-[min(1240px,calc(100%-64px))] grid-cols-[330px_1fr] items-center gap-[clamp(48px,8vw,130px)] max-md:w-[calc(100%-36px)] max-md:grid-cols-1">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-2xl">
              <Image
                src={asset("about/abhijit-patil.jpg")}
                alt="Mr. Satyajeet Patil and Mr. Abhijeet Patil"
                width={660}
                height={800}
                className="h-auto w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div>
              <p className="mb-4 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.15em] text-safety">
                <span className="h-0.5 w-6 bg-safety" />
                Leadership
              </p>
              <h2 className="mb-5 text-[clamp(32px,3.5vw,46px)] font-bold text-white leading-tight tracking-[-.04em]">
                Mr. Satyajeet Patil &amp; Mr. Abhijeet Patil
              </h2>
              <p className="text-base leading-7 text-slate-300">
                Mr. Satyajeet Patil and Mr. Abhijeet Patil are enthusiastic,
                visionary entrepreneurs whose goal in business is to provide the
                highest-grade manufactured material handling solutions from
                their unit.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-400">
                Customer requirements and operational safety always come first,
                which is why Sahil Industries designs and builds equipment
                centered strictly around unique customer applications and
                dependable lifetime support.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3. Why Choose Timeline */}
      <WhyChooseTimeline />
    </ModernPageShell>
  );
}
