"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Image, Mail, RefreshCw } from "lucide-react";
import { AdminDashboardLayoutWrapper } from "@/components/AdminDashboardLayout";

type Enquiry = {
  id: string;
  name: string;
  email: string;
  subject?: string;
  status?: string;
  created_at: string;
};

export default function AdminDashboard() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [galleryCount, setGalleryCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [enquiriesResponse, galleryResponse] = await Promise.all([
        fetch("/api/admin/enquiries", { cache: "no-store" }),
        fetch("/api/admin/gallery", { cache: "no-store" }),
      ]);
      if (!enquiriesResponse.ok || !galleryResponse.ok)
        throw new Error("Unable to load dashboard data");
      const enquiriesData = await enquiriesResponse.json();
      const galleryData = await galleryResponse.json();
      setEnquiries(enquiriesData.enquiries || []);
      setGalleryCount((galleryData.images || []).length);
    } catch (exception) {
      setError(
        exception instanceof Error
          ? exception.message
          : "Unable to load dashboard data",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);
  const newEnquiries = enquiries.filter(
    (item) => String(item.status || "new").toLowerCase() === "new",
  ).length;

  return (
    <AdminDashboardLayoutWrapper
      activeNav="/admin"
      pageTitle="Dashboard"
      pageDescription="Live overview from your admin data">
      <div className="space-y-6">
        <div className="flex justify-end">
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/5">
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}{" "}
            <button onClick={load} className="ml-2 underline">
              Retry
            </button>
          </div>
        )}
        <section className="grid gap-4 sm:grid-cols-3">
          <Metric
            label="Total enquiries"
            value={loading ? "—" : enquiries.length}
            icon={<Mail />}
          />
          <Metric
            label="New enquiries"
            value={loading ? "—" : newEnquiries}
            icon={<Mail />}
          />
          <Metric
            label="Gallery images"
            value={loading ? "—" : galleryCount}
            icon={<Image />}
          />
        </section>
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-surface">
          <div className="flex items-center justify-between border-b border-white/10 p-5">
            <div>
              <h2 className="font-bold text-white">Recent enquiries</h2>
              <p className="text-xs text-slate-400">
                Latest records from your database
              </p>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-sm text-safety hover:underline">
              View all
            </Link>
          </div>
          {loading ? (
            <div className="space-y-4 p-5">
              <div className="h-5 animate-pulse rounded bg-slate-700/60" />
              <div className="h-5 animate-pulse rounded bg-slate-700/60" />
              <div className="h-5 animate-pulse rounded bg-slate-700/60" />
            </div>
          ) : enquiries.length === 0 ? (
            <p className="p-8 text-center text-slate-400">
              No enquiries found.
            </p>
          ) : (
            <div className="divide-y divide-white/5">
              {enquiries.slice(0, 8).map((item) => (
                <div
                  className="flex flex-wrap items-center justify-between gap-3 p-5"
                  key={item.id}>
                  <div>
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="text-sm text-slate-400">
                      {item.email}
                      {item.subject ? ` • ${item.subject}` : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs capitalize text-slate-300">
                      {item.status || "new"}
                    </span>
                    <p className="mt-1 text-xs text-slate-500">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </AdminDashboardLayoutWrapper>
  );
}

function Metric({
  label,
  value,
  icon,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <span className="text-safety">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}
