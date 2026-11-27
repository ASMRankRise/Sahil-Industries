"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Image as ImageIcon, Mail, RefreshCw } from "lucide-react";
import { AdminDashboardLayoutWrapper } from "@/components/AdminDashboardLayout";
import { AdminAnalyticsSkeleton } from "@/components/AdminSkeleton";
import { MetricCard } from "@/components/admin";

type Enquiry = {
  id: string;
  name: string;
  email: string;
  status?: string;
  created_at: string;
};

export default function AnalyticsPage() {
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
        throw new Error("Unable to load analytics data");
      const enquiriesData = await enquiriesResponse.json();
      const galleryData = await galleryResponse.json();
      setEnquiries(enquiriesData.enquiries || []);
      setGalleryCount((galleryData.images || []).length);
    } catch (exception) {
      setError(
        exception instanceof Error
          ? exception.message
          : "Unable to load analytics data",
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const statuses = useMemo(
    () =>
      enquiries.reduce<Record<string, number>>((result, item) => {
        const status = String(item.status || "new").toLowerCase();
        result[status] = (result[status] || 0) + 1;
        return result;
      }, {}),
    [enquiries],
  );
  const monthly = useMemo(() => {
    const result = Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - index));
      return {
        label: date.toLocaleString("en", { month: "short" }),
        count: 0,
        key: `${date.getFullYear()}-${date.getMonth()}`,
      };
    });
    enquiries.forEach((item) => {
      const date = new Date(item.created_at);
      const match = result.find(
        (month) => month.key === `${date.getFullYear()}-${date.getMonth()}`,
      );
      if (match) match.count += 1;
    });
    return result;
  }, [enquiries]);
  const maxMonthly = Math.max(1, ...monthly.map((item) => item.count));

  return (
    <AdminDashboardLayoutWrapper
      activeNav="/admin/analytics"
      pageTitle="Analytics"
      pageDescription="Live insights from your enquiries and gallery">
      <div className="space-y-6">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/5 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety">
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} aria-hidden="true" />
            Refresh
          </button>
        </div>
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}{" "}
            <button type="button" onClick={load} className="ml-2 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety rounded">
              Retry
            </button>
          </div>
        )}
        {loading ? (
          <AdminAnalyticsSkeleton />
        ) : (
          <>
            <section className="grid gap-4 sm:grid-cols-3">
              <MetricCard
                label="Total enquiries"
                value={enquiries.length}
                icon={<Mail />}
              />
              <MetricCard
                label="Gallery images"
                value={galleryCount}
                icon={<ImageIcon />}
              />
              <MetricCard
                label="Statuses tracked"
                value={Object.keys(statuses).length}
                icon={<Mail />}
              />
            </section>
            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-surface p-6">
                <h3 className="font-bold text-white">Enquiries by month</h3>
                <p className="mb-6 text-xs text-slate-400">
                  New records received during the last six months
                </p>
                <div className="flex h-56 items-end gap-3 border-b border-white/10">
                  {monthly.map((item) => (
                    <div
                      key={item.key}
                      className="flex flex-1 flex-col items-center justify-end gap-2">
                      <span className="text-xs text-slate-400">
                        {item.count}
                      </span>
                      <div
                        className="w-full rounded-t-md bg-safety"
                        style={{
                          height: `${Math.max(4, (item.count / maxMonthly) * 100)}%`,
                        }}
                      />
                      <span className="text-xs text-slate-400">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-surface p-6">
                <h2 className="font-bold text-white">Enquiry status</h2>
                <p className="mb-6 text-xs text-slate-400">
                  Current distribution of database records
                </p>
                {Object.keys(statuses).length === 0 ? (
                  <p className="text-sm text-slate-400">
                    No enquiry data available.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(statuses).map(([status, count]) => (
                      <div key={status}>
                        <div className="mb-1 flex justify-between text-sm">
                          <span className="capitalize text-slate-300">
                            {status}
                          </span>
                          <b className="text-white">{count}</b>
                        </div>
                        <div className="h-2 rounded-full bg-white/10">
                          <div
                            className="h-2 rounded-full bg-safety"
                            style={{
                              width: `${(count / enquiries.length) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </AdminDashboardLayoutWrapper>
  );
}
