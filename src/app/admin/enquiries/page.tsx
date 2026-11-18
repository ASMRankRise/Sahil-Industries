"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, Download, Eye, Filter, Mail, Search, Trash2, X } from "lucide-react";
import { AdminDashboardLayoutWrapper } from "@/components/AdminDashboardLayout";
import { AdminTableSkeleton } from "@/components/AdminSkeleton";

type RecordItem = {
  id: string; name: string; email: string; phone?: string; subject?: string;
  city?: string; message: string; status: string; created_at: string;
  kind: "enquiry"; read: boolean;
};

const PAGE_SIZE = 10;
const statuses = ["all", "new", "in progress", "replied", "closed"];
const statusColors: Record<string, string> = {
  new: "#2563eb",
  "in progress": "#d97706",
  replied: "#16a34a",
  closed: "#64748b",
};

export default function EnquiriesPage() {
  const [items, setItems] = useState<RecordItem[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<RecordItem | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [statusOpen, setStatusOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const enquiries = await fetch("/api/admin/enquiries", { cache: "no-store" }).then(r => r.ok ? r.json() : Promise.reject(r));
      const read = JSON.parse(localStorage.getItem("admin_read_records") || "[]") as string[];
      setItems([
        ...(enquiries.enquiries || []).map((x: any) => ({ ...x, name: x.name, phone: x.phone, kind: "enquiry", read: read.includes(`enquiry:${x.id}`) })),
      ].map(x => ({ ...x, status: String(x.status || "new").toLowerCase() })));
    } catch { setError("Unable to load records. Please try again."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => items.filter(x =>
    (status === "all" || x.status === status) &&
    `${x.id} ${x.name} ${x.email} ${x.subject || ""} ${x.city || ""}`.toLowerCase().includes(search.toLowerCase())
  ), [items, status, search]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  useEffect(() => { setPage(1); }, [status, search]);

  const markRead = (item: RecordItem) => {
    if (item.read) return;
    const key = `${item.kind}:${item.id}`;
    const next = [...new Set([...JSON.parse(localStorage.getItem("admin_read_records") || "[]"), key])];
    localStorage.setItem("admin_read_records", JSON.stringify(next));
    setItems(xs => xs.map(x => x.kind === item.kind && x.id === item.id ? { ...x, read: true } : x));
  };
  const remove = async (item: RecordItem) => {
    if (!confirm(`Delete this ${item.kind}?`)) return;
    const response = await fetch(`/api/admin/enquiries?id=${encodeURIComponent(item.id)}`, { method: "DELETE" });
    if (response.ok) { setItems(xs => xs.filter(x => !(x.kind === item.kind && x.id === item.id))); if (selected?.id === item.id) setSelected(null); }
    else setError("Unable to delete enquiry.");
  };
  const updateStatus = async (item: RecordItem, nextStatus: string) => {
    setSavingId(item.id);
    try {
      const response = await fetch("/api/admin/enquiries", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: item.id, status: nextStatus }) });
      if (!response.ok) throw new Error();
      setItems(xs => xs.map(x => x.id === item.id ? { ...x, status: nextStatus } : x));
      setSelected(x => x?.id === item.id ? { ...x, status: nextStatus } : x);
    } catch { setError("Unable to update enquiry status."); }
    finally { setSavingId(null); }
  };
  const exportCsv = () => {
    const csv = [["Type", "ID", "Name", "Email", "Phone", "Subject/City", "Status", "Date"], ...filtered.map(x => [x.kind, x.id, x.name, x.email, x.phone || "", x.subject || x.city || "", x.status, x.created_at])]
      .map(row => row.map(v => `"${String(v).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); const a = document.createElement("a"); a.href = url; a.download = "admin-records.csv"; a.click(); URL.revokeObjectURL(url);
  };

  return <AdminDashboardLayoutWrapper activeNav="/admin/enquiries" pageTitle="Enquiries" pageDescription="Manage customer enquiries">
    <div className="space-y-6">
      <div className="flex justify-end"><button onClick={exportCsv} className="flex items-center gap-2 px-4 py-2.5 border border-white/10 rounded-lg text-sm hover:bg-white/5"><Download size={15}/> Export CSV</button></div>
       <div className="bg-surface border border-white/10 rounded-2xl p-4 flex flex-wrap gap-3"><div className="relative flex-1 min-w-[220px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, subject..." className="h-10 w-full pl-10 pr-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white"/></div><div className="relative"><button type="button" aria-haspopup="listbox" aria-expanded={statusOpen} onClick={() => setStatusOpen(open => !open)} className="flex h-10 min-w-[146px] items-center gap-2 rounded-lg border border-white/10 bg-white/5 pl-3 pr-2 text-sm text-white"><Filter className="shrink-0 text-slate-400" size={14}/><span className="flex-1 text-left">{status === "all" ? "All statuses" : status}</span><ChevronDown size={15} className={`text-slate-400 transition-transform ${statusOpen ? "rotate-180" : ""}`}/></button>{statusOpen && <div role="listbox" className="absolute right-0 top-12 z-30 min-w-full overflow-hidden rounded-lg border border-white/10 bg-slate-800 py-1 shadow-xl">{statuses.map(x => <button type="button" role="option" aria-selected={status === x} key={x} onClick={() => { setStatus(x); setStatusOpen(false); }} className={`block w-full whitespace-nowrap px-3 py-2 text-left text-sm capitalize transition-colors ${status === x ? "bg-blue-400 text-slate-900" : "text-slate-200 hover:bg-white/10"}`}>{x === "all" ? "All statuses" : x}</button>)}</div>}</div></div>
       <div className="bg-surface border border-white/10 rounded-2xl overflow-x-auto">{loading ? <AdminTableSkeleton /> : error ? <div className="p-12 text-center text-red-400">{error} <button onClick={load} className="underline ml-2">Retry</button></div> : <table className="w-full text-left text-sm min-w-[800px]"><thead><tr className="border-b border-white/10 text-slate-400 uppercase text-xs"><th className="p-4">Type</th><th className="p-4">Name</th><th className="p-4">Subject / City</th><th className="p-4">Status</th><th className="p-4">Date</th><th className="p-4">Actions</th></tr></thead><tbody className="divide-y divide-white/5">{visible.map(x => <tr key={`${x.kind}-${x.id}`} className={`${x.read ? "" : "bg-blue-500/5"} hover:bg-white/[.03]`}><td className="p-4 capitalize text-safety">{x.kind}</td><td className="p-4"><div className="font-medium text-white">{!x.read && <Mail size={13} className="inline mr-1"/>}{x.name}</div><div className="text-xs text-slate-400">{x.email}</div></td><td className="p-4 text-slate-300">{x.subject || x.city || "—"}</td><td className="p-4"><select value={x.status} disabled={savingId === x.id} onChange={e => updateStatus(x, e.target.value)} style={{ backgroundColor: statusColors[x.status] || "#475569" }} className="rounded border border-white/20 px-2 py-1 text-xs capitalize text-white"><option className="bg-white text-slate-900" value="new">new</option><option className="bg-white text-slate-900" value="in progress">in progress</option><option className="bg-white text-slate-900" value="replied">replied</option><option className="bg-white text-slate-900" value="closed">closed</option></select></td><td className="p-4 text-slate-400">{new Date(x.created_at).toLocaleDateString()}</td><td className="p-4"><button title="View details" onClick={() => { markRead(x); setSelected(x); }} className="p-2 text-slate-400 hover:text-safety"><Eye size={15}/></button><button title="Delete" onClick={() => remove(x)} className="p-2 text-slate-400 hover:text-red-400"><Trash2 size={15}/></button></td></tr>)}</tbody></table>}{!loading && !error && !visible.length && <div className="p-12 text-center text-slate-400">No records found.</div>}</div>
       {selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setSelected(null)}><div className="w-full max-w-lg rounded-2xl border border-white/10 bg-surface p-6" onClick={e => e.stopPropagation()}><div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-bold text-white">Enquiry details</h2><button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white"><X size={18}/></button></div><div className="space-y-3 text-sm"><p><b className="text-slate-400">Name:</b> <span className="text-white">{selected.name}</span></p><p><b className="text-slate-400">Email:</b> <a className="text-safety" href={`mailto:${selected.email}`}>{selected.email}</a></p><p><b className="text-slate-400">Phone:</b> <span className="text-white">{selected.phone || "—"}</span></p><p><b className="text-slate-400">Subject:</b> <span className="text-white">{selected.subject || "—"}</span></p><p className="border-t border-white/10 pt-3 text-slate-300">{selected.message}</p></div></div></div>}
      <div className="flex items-center justify-between text-sm text-slate-400"><span>Showing {filtered.length ? (page - 1) * PAGE_SIZE + 1 : 0}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</span><div className="flex gap-2"><button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-2 border border-white/10 rounded disabled:opacity-40">Previous</button><span className="px-3 py-2">{page} / {pages}</span><button disabled={page === pages} onClick={() => setPage(page + 1)} className="px-3 py-2 border border-white/10 rounded disabled:opacity-40">Next</button></div></div>
    </div>
  </AdminDashboardLayoutWrapper>;
}
