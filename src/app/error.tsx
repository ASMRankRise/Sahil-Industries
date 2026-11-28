"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col bg-white text-ink">
      <SiteHeader />

      <main className="relative isolate flex-1 overflow-hidden bg-ink py-20 text-white sm:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-15"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="mx-auto w-[calc(100%-36px)] md:w-[min(1240px,calc(100%-64px))]">
          <div className="mx-auto max-w-2xl border border-white/10 bg-surface p-8 shadow-2xl sm:p-12">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center border border-safety/40 bg-safety/10 text-safety">
              <AlertTriangle size={28} />
            </div>

            <p className="mb-3 flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[.18em] text-safety">
              <span className="h-0.5 w-8 bg-safety" />
              System Interruption
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Something went wrong
            </h1>

            <p className="mt-4 text-sm leading-6 text-slate-300 sm:text-base">
              An unexpected error occurred while rendering this page. You can
              try reloading this section or return to the homepage.
            </p>

            {error.digest && (
              <p className="mt-4 inline-block border border-white/10 bg-ink/70 px-3 py-1.5 font-mono text-xs text-slate-400">
                Reference ID: {error.digest}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 border border-safety bg-safety px-6 py-3.5 text-xs font-extrabold uppercase tracking-industrial text-ink transition hover:-translate-y-0.5 hover:bg-yellow-300"
              >
                <RotateCcw size={15} />
                Try Again
              </button>

              <Link
                href="/"
                className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-6 py-3.5 text-xs font-extrabold uppercase tracking-industrial text-white transition hover:border-safety hover:text-safety"
              >
                <Home size={15} />
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
