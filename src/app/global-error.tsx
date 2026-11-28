"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error boundary caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-[#101820] px-6 text-white antialiased">
        <div className="w-full max-w-lg border border-white/10 bg-[#18232e] p-8 shadow-2xl sm:p-10">
          <div className="mb-5 inline-flex h-12 w-12 items-center justify-center border border-[#f6c515]/40 bg-[#f6c515]/10 text-[#f6c515]">
            <AlertTriangle size={24} />
          </div>

          <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[.18em] text-[#f6c515]">
            Critical Error
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Application failed to load
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            A critical error prevented the application layout from rendering.
            Please retry or reload the browser tab.
          </p>

          {error.digest && (
            <p className="mt-4 inline-block border border-white/10 bg-[#101820] px-3 py-1.5 font-mono text-xs text-slate-400">
              Reference ID: {error.digest}
            </p>
          )}

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 border border-[#f6c515] bg-[#f6c515] px-5 py-3 text-xs font-extrabold uppercase tracking-[.08em] text-[#101820] transition hover:bg-yellow-300"
            >
              <RotateCcw size={15} />
              Reload Application
            </button>
            <a
              href="/"
              className="inline-flex items-center border border-white/20 px-5 py-3 text-xs font-extrabold uppercase tracking-[.08em] text-white transition hover:border-[#f6c515] hover:text-[#f6c515]"
            >
              Go to Homepage
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
