"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Download,
  Search,
  CheckCircle2,
  SlidersHorizontal,
  ShieldCheck,
  Cpu,
  Wrench,
  Check,
  X,
  PhoneCall,
  Sparkles,
} from "lucide-react";
import { ModernPageShell } from "@/components/ModernPageShell";
import { Reveal } from "@/components/ui/Reveal";
import { catalogProducts, type CatalogProduct } from "@/data/products";
import { siteContact } from "@/data/site";

const CATEGORIES = [
  "All Products",
  "EOT Cranes",
  "Gantry Cranes",
  "Hoists",
  "Workstation Cranes",
] as const;

type CategoryFilter = (typeof CATEGORIES)[number];

export default function ProductsCatalogPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("All Products");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return catalogProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === "All Products" ||
        product.category === selectedCategory;

      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesCategory;

      const matchesSearch =
        product.title.toLowerCase().includes(q) ||
        product.tagline.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.capacity.toLowerCase().includes(q) ||
        product.highlights.some((h) => h.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <ModernPageShell
      eyebrow="Product Portfolio"
      title="Industrial Cranes & Material Handling Solutions">
      {/* Search & Filter Header Strip */}
      <section className="sticky top-[72px] z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-shadow py-4 shadow-sm">
        <div className="mx-auto w-[calc(100%-36px)] max-w-7xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="hidden items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 sm:inline-flex mr-1">
                <SlidersHorizontal size={14} /> Filter:
              </span>
              {CATEGORIES.map((category) => {
                const count =
                  category === "All Products"
                    ? catalogProducts.length
                    : catalogProducts.filter((p) => p.category === category)
                        .length;
                const isActive = selectedCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold tracking-wide transition-all duration-200 ${
                      isActive
                        ? "bg-ink text-white shadow-md ring-2 ring-safety"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-ink"
                    }`}>
                    <span>{category}</span>
                    <span
                      className={`grid h-4 min-w-4 place-items-center rounded-full px-1 text-[10px] font-extrabold ${
                        isActive
                          ? "bg-safety text-ink"
                          : "bg-white text-slate-500"
                      }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Live Search Input */}
            <div className="relative w-full sm:w-72 lg:w-80">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search crane, capacity, standard..."
                aria-label="Search products"
                className="w-full rounded-full border border-slate-200 bg-slate-50/80 py-2 pl-9 pr-9 text-xs font-medium text-ink placeholder:text-slate-400 focus:border-safety focus:bg-white focus:outline-none focus:ring-2 focus:ring-safety/30"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-ink"
                  aria-label="Clear search query">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Listing */}
      <section className="bg-slate-50/60 py-16 md:py-20">
        <div className="mx-auto w-[calc(100%-36px)] max-w-7xl">
          {/* Header Stats & Context */}
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-safety">
                Catalog Overview
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Precision-Built Heavy Lifting Systems
              </h2>
            </div>
            <p className="text-xs font-semibold text-slate-500">
              Showing{" "}
              <span className="font-extrabold text-ink">
                {filteredProducts.length}
              </span>{" "}
              of {catalogProducts.length} equipment types
            </p>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <Search className="mx-auto mb-3 text-slate-300" size={40} />
              <h3 className="text-lg font-bold text-ink">
                No matching products found
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                We couldn&apos;t find any equipment matching &ldquo;{searchQuery}
                &rdquo;. Try searching with another term or reset filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All Products");
                  setSearchQuery("");
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-ink px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-safety hover:text-ink transition-colors">
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* Engineering Standards & Verification Strip */}
      <section className="border-y border-slate-200 bg-white py-14">
        <div className="mx-auto w-[calc(100%-36px)] max-w-7xl">
          <div className="mb-8 text-center">
            <span className="inline-block rounded-full bg-safety/15 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-ink">
              Quality Assurance
            </span>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Engineered Strictly According to Indian Standards
            </h3>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">
              Every crane and hoist designed and manufactured at our MIDC Kagal
              facility adheres to rigorous statutory testing and structural
              certifications.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StandardBadge
              code="IS 3177"
              title="EOT Cranes Standard"
              description="Comprehensive code of practice for design, structural calculation, and safety mechanisms."
            />
            <StandardBadge
              code="IS 807"
              title="Structural Design & Erection"
              description="Rigid code for structural girder design, deflection limits, and safe erection practices."
            />
            <StandardBadge
              code="IS 3938"
              title="Electric Wire Rope Hoists"
              description="Stringent specifications governing hoist motors, wire drums, rope sheaves, and brakes."
            />
            <StandardBadge
              code="100% Tested"
              title="Full Proof-Load Testing"
              description="Overload static/dynamic deflection validation and magnetic crack inspections prior to dispatch."
            />
          </div>
        </div>
      </section>

      {/* Custom Crane Engineering Consultation Callout */}
      <section className="bg-ink py-16 text-white">
        <div className="mx-auto w-[calc(100%-36px)] max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-surface via-ink to-surface p-8 sm:p-12 lg:flex lg:items-center lg:justify-between">
            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-safety/40 bg-safety/10 px-3.5 py-1 text-xs font-bold text-safety">
                <Sparkles size={14} /> Bespoke Manufacturing
              </span>
              <h3 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                Require a Custom Crane Configuration?
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Have specific bay dimensions, low headroom constraints, explosive
                environments, or heavy tonnage requirements? Our engineering
                team designs tailored material handling solutions built to your
                exact operational parameters.
              </p>
            </div>

            <div className="relative z-10 mt-8 flex flex-wrap items-center gap-4 lg:mt-0 lg:flex-col lg:items-end">
              <Link
                href="/enquiry"
                className="inline-flex items-center gap-2 rounded-xl bg-safety px-7 py-4 text-xs font-extrabold uppercase tracking-industrial text-ink shadow-lg shadow-safety/20 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-yellow-400">
                <span>Request Custom Quote</span>
                <ArrowRight size={16} />
              </Link>
              <a
                href={siteContact.phoneHref}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-4 text-xs font-bold uppercase tracking-industrial text-white hover:border-white/40 hover:bg-white/10 transition-colors">
                <PhoneCall size={15} className="text-safety" />
                <span>Talk with Engineers</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </ModernPageShell>
  );
}

function ProductCard({ product }: { product: CatalogProduct }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:border-safety/70 hover:shadow-xl">
      <div>
        {/* Product Image Frame */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
          <Image
            src={product.cardImage}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Badges on Top of Image */}
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="rounded-md bg-ink/90 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-safety backdrop-blur-sm border border-safety/30">
              {product.category}
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-safety px-3 py-1 text-xs font-black uppercase tracking-wider text-ink shadow-md">
              Capacity: {product.capacity}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7">
          <p className="text-[11px] font-bold uppercase tracking-wider text-safety">
            {product.tagline}
          </p>
          <h3 className="mt-1 text-xl font-bold tracking-tight text-ink sm:text-2xl group-hover:text-amber-600 transition-colors">
            {product.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            {product.description}
          </p>

          {/* Specifications Pills */}
          <div className="mt-5 grid grid-cols-2 gap-2.5 rounded-xl bg-slate-50 p-3.5 border border-slate-100">
            {product.specs.map((spec) => (
              <div key={spec.label} className="min-w-0">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {spec.label}
                </span>
                <span className="block truncate text-xs font-extrabold text-ink">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>

          {/* Highlights Bullets */}
          <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
            {product.highlights.slice(0, 3).map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2
                  size={15}
                  className="mt-0.5 shrink-0 text-amber-500"
                />
                <span className="leading-tight">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 p-5 sm:px-7">
        <Link
          href={`/products/${product.slug}`}
          className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-industrial text-ink transition-colors hover:text-safety">
          <span>View Specifications</span>
          <ArrowRight
            size={15}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>

        <div className="flex items-center gap-2">
          {product.brochure && (
            <a
              href={product.brochure}
              target="_blank"
              rel="noopener noreferrer"
              download
              title="Download Product Brochure"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition-colors hover:border-ink hover:text-ink">
              <Download size={13} />
              <span className="hidden sm:inline">Brochure</span>
            </a>
          )}
          <Link
            href={`/enquiry?product=${product.slug}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-safety hover:text-ink">
            <span>Enquire</span>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

function StandardBadge({
  code,
  title,
  description,
}: {
  code: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5 transition-colors hover:border-safety/60">
      <div className="flex items-center gap-2">
        <ShieldCheck size={20} className="text-safety" />
        <span className="rounded bg-ink px-2 py-0.5 text-xs font-black text-safety">
          {code}
        </span>
      </div>
      <h4 className="mt-3 font-bold text-ink">{title}</h4>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">
        {description}
      </p>
    </div>
  );
}
