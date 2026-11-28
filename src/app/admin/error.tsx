"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, LayoutDashboard, RotateCcw } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin route error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6 text-white">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-surface p-8 shadow-2xl">
        <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-safety/30 bg-safety/10 text-safety">
          <AlertTriangle size={24} />
        </div>

        <p className="text-[11px] font-bold uppercase tracking-[.16em] text-safety">
          Admin Console Error
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">
          Unable to load admin view
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-300">
          An unexpected error occurred in the administration panel. You can
          retry loading this view or return to the main dashboard.
        </p>

        {error.digest && (
          <p className="mt-4 inline-block rounded-md border border-white/10 bg-ink px-3 py-1 font-mono text-xs text-slate-400">
            Digest: {error.digest}
          </p>
        )}

        <div className="mt-7 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg bg-safety px-4 py-2.5 text-xs font-extrabold uppercase tracking-industrial text-ink transition hover:bg-yellow-300"
          >
            <RotateCcw size={15} />
            Retry
          </button>

          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold uppercase tracking-industrial text-white transition hover:border-safety hover:text-safety"
          >
            <LayoutDashboard size={15} />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
