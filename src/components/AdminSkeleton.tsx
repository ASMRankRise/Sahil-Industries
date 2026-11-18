export function AdminPageSkeleton() {
  return (
    <div className="min-h-screen bg-ink animate-pulse" aria-label="Loading admin dashboard" role="status">
      <div className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 bg-surface lg:block" />
      <main className="lg:pl-64">
        <div className="border-b border-white/10 bg-surface px-6 py-5">
          <div className="h-7 w-48 rounded-md bg-slate-700/70" />
          <div className="mt-2 h-4 w-72 rounded-md bg-slate-800" />
        </div>
        <div className="space-y-6 p-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => <div key={item} className="h-28 rounded-2xl border border-slate-800 bg-surface" />)}
          </div>
          <div className="h-80 rounded-2xl border border-slate-800 bg-surface" />
        </div>
      </main>
    </div>
  );
}

export function AdminTableSkeleton({ rows = 6, columns = 6 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-4 p-5 animate-pulse" aria-label="Loading records" role="status">
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="grid gap-4 sm:grid-cols-6">
          {Array.from({ length: columns }).map((__, column) => (
            <div key={column} className={`h-4 rounded-md bg-slate-700/60 ${column === 1 ? "sm:col-span-2" : ""}`} />
          ))}
        </div>
      ))}
    </div>
  );
}
