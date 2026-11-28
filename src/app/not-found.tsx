import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Sahil Industries",
  description:
    "The page you are looking for could not be found. Return to Sahil Industries homepage or explore our EOT cranes and hoists.",
};

export default function NotFound() {
  return (
    <div className="relative isolate flex min-h-screen flex-col justify-between overflow-hidden bg-ink text-white">
      {/* Blueprint grid background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-safety/10 blur-3xl"
      />

      {/* Minimal brand header */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" aria-label="Sahil Industries - Home">
          <Image
            src="/media/logo/logo-footer.png"
            alt="Sahil Industries"
            width={160}
            height={63}
            priority
            className="h-auto w-36 sm:w-40"
          />
        </Link>
        <span className="border border-safety/40 bg-safety/10 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[.16em] text-safety">
          Error 404
        </span>
      </header>

      {/* Centered 404 focal point */}
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <div className="relative select-none">
          <span
            aria-hidden="true"
            className="block text-[clamp(110px,24vw,220px)] font-black leading-[0.85] tracking-[-0.06em] text-white/10"
          >
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="border-y-2 border-safety bg-ink/90 px-5 py-2 text-xs font-extrabold uppercase tracking-[.28em] text-safety sm:text-sm">
              Page Not Found
            </span>
          </div>
        </div>

        <h1 className="mt-6 text-2xl font-bold tracking-tight text-white sm:text-4xl">
          We couldn&apos;t find that page.
        </h1>

        <p className="mt-3 max-w-md text-sm leading-6 text-slate-400 sm:text-base">
          The link you followed may be broken, or the page may have been moved
          or removed.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-safety bg-safety px-6 py-3.5 text-xs font-extrabold uppercase tracking-industrial text-ink transition hover:-translate-y-0.5 hover:bg-yellow-300"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 border border-white/20 bg-surface px-6 py-3.5 text-xs font-extrabold uppercase tracking-industrial text-white transition hover:border-safety hover:text-safety"
          >
            Browse Products
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-4 py-3.5 text-xs font-bold uppercase tracking-industrial text-slate-300 transition hover:text-safety"
          >
            <Phone size={15} />
            Contact Us
          </Link>
        </div>
      </main>

      {/* Minimal footer */}
      <footer className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-white/10 px-6 py-5 text-xs text-slate-500">
        <span>Sahil Industries &middot; EOT Cranes &amp; Hoists</span>
        <div className="flex items-center gap-5">
          <Link href="/services" className="transition hover:text-safety">
            Services
          </Link>
          <Link href="/enquiry" className="transition hover:text-safety">
            Enquiry
          </Link>
          <Link href="/about" className="transition hover:text-safety">
            About
          </Link>
        </div>
      </footer>
    </div>
  );
}
