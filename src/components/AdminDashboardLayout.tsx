"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  LogOut,
  Mail,
  ChevronRight,
  Plus,
  X,
  Menu,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  DollarSign,
  UserPlus,
  MessageSquare,
  Activity,
  Eye,
  Edit,
  User,
  Trash2,
  Filter,
  Search,
  Download,
  Upload,
  Moon,
  Sun,
  HelpCircle,
  Zap,
  Target,
  RefreshCw,
  Image as LucideImage,
  Image,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminPageSkeleton } from "@/components/AdminSkeleton";
import { ReactNode } from "react";
import { AdminDataProvider, useAdminData } from "@/context/AdminDataContext";

const asset = (path: string) => `/sahilcrane/${path}`;

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Enquiries", href: "/admin/enquiries", icon: Mail },
  { label: "Gallery", href: "/admin/gallery", icon: Image },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

interface AdminDashboardLayoutProps {
  children: ReactNode;
  activeNav: string;
  pageTitle: string;
  pageDescription: string;
}

export function AdminDashboardLayout({
  children,
  activeNav,
  pageTitle,
  pageDescription,
}: AdminDashboardLayoutProps) {
  const router = useRouter();
  const { logout, isAuthenticated, loading, theme, toggleTheme, user } =
    useAdminData();

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace("/admin");
  }, [loading, isAuthenticated, router]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [enquiryCount, setEnquiryCount] = useState(0);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const syncSidebar = () => {
      setIsMobile(!desktop.matches);
      setSidebarOpen(desktop.matches);
    };
    syncSidebar();
    desktop.addEventListener("change", syncSidebar);
    return () => desktop.removeEventListener("change", syncSidebar);
  }, []);

  useEffect(() => {
    fetch("/api/admin/enquiries", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : { enquiries: [] }))
      .then((data) =>
        setEnquiryCount(
          Array.isArray(data.enquiries) ? data.enquiries.length : 0,
        ),
      )
      .catch(() => setEnquiryCount(0));
  }, []);

  if (loading) return <AdminPageSkeleton />;
  if (!isAuthenticated) return null;

  return (
    <div
      data-admin-theme={theme}
      className={`admin-dashboard min-h-screen ${theme === "dark" ? "bg-ink text-slate-100" : "bg-slate-100 text-slate-900"}`}>
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        id="admin-sidebar"
        inert={!sidebarOpen}
        className={`fixed inset-y-0 left-0 z-50 flex w-64 max-w-[85vw] flex-col border-r shadow-2xl transition-transform duration-300 ease-in-out lg:shadow-none ${theme === "light" ? "border-amber-200 bg-[#fff8d6]" : "border-white/10 bg-surface"} ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        {/* Sidebar Header - exactly h-16 to match topbar */}
        <div
          className={`flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 sm:px-6 ${theme === "light" ? "border-amber-200" : "border-white/10"}`}>
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-9 w-11 shrink-0 items-center justify-center rounded-lg border border-safety/50 bg-safety/10 shadow-md shadow-safety/10 transition-transform group-hover:scale-105">
              <img
                src={
                  theme === "dark"
                    ? "/media/logo/logo%20svg1.svg"
                    : "/media/logo/logo%20svg.svg"
                }
                alt=""
                className="h-7 w-9 object-contain"
              />
            </div>
            <div className="flex flex-col text-left leading-tight">
              <span
                className={`text-xs font-extrabold uppercase tracking-widest ${theme === "light" ? "text-slate-900" : "text-white"}`}>
                SAHIL
              </span>
              <span
                className={`text-[10px] font-medium uppercase tracking-wider block ${theme === "light" ? "text-amber-700" : "text-safety"}`}>
                INDUSTRIES
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className={`grid size-11 shrink-0 place-items-center rounded-lg transition-colors lg:hidden ${theme === "light" ? "text-slate-600 hover:bg-amber-100 hover:text-slate-900" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
            aria-label="Close sidebar">
            <X size={18} />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeNav === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex w-full items-center gap-3 px-3.5 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative group text-left ${
                  isActive
                    ? theme === "light"
                      ? "bg-amber-200/70 text-amber-950 border-l-4 border-amber-600 shadow-sm shadow-amber-200"
                      : "bg-safety/10 text-safety border-l-4 border-safety shadow-sm shadow-safety/10"
                    : theme === "light"
                      ? "text-slate-700 hover:bg-amber-100 hover:text-slate-950 border-l-4 border-transparent"
                      : "text-slate-300 hover:bg-white/5 hover:text-white border-l-4 border-transparent"
                }`}>
                <div
                  className={`flex-shrink-0 transition-colors duration-200 ${isActive ? (theme === "light" ? "text-amber-700" : "text-safety") : theme === "light" ? "text-slate-500 group-hover:text-amber-800" : "text-slate-400 group-hover:text-white"}`}>
                  <Icon size={19} />
                </div>
                <span className="flex-1 truncate">{item.label}</span>
                {item.label === "Enquiries" && enquiryCount > 0 && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center px-1.5 text-[10px] font-bold text-ink bg-safety rounded-full">
                    {enquiryCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div
          className={`mt-auto flex-shrink-0 border-t p-4 ${theme === "light" ? "border-amber-200" : "border-white/10"}`}>
          <button
            onClick={async () => {
              await logout();
              // Hard navigation prevents the current protected page from
              // rendering once more while the auth context is updating.
              window.location.replace("/admin");
            }}
            className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all group hover:shadow-lg ${theme === "light" ? "border-red-300 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 hover:shadow-red-200" : "border-red-500/20 bg-red-500/5 text-red-300 hover:bg-red-500/15 hover:text-red-200 hover:shadow-red-950/30"}`}>
            <LogOut
              size={17}
              className="group-hover:text-red-400 transition-colors"
            />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={`min-h-screen flex flex-col transition-all duration-300 ${sidebarOpen ? "lg:pl-64" : "lg:pl-0"}`}>
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between gap-2 px-2 sm:px-6 md:px-8 border-b border-white/10 bg-ink/95 backdrop-blur-md">
          <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="grid size-11 shrink-0 place-items-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Toggle sidebar"
              aria-controls="admin-sidebar"
              aria-expanded={sidebarOpen}
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}>
              <Menu size={20} />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="whitespace-nowrap truncate text-[11px] font-bold tracking-tight bg-gradient-to-r from-white to-safety bg-clip-text text-transparent leading-none sm:text-base md:text-lg">
                {pageTitle}
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block mt-0.5">
                {pageDescription}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`grid size-11 place-items-center rounded-lg transition-colors ${
                theme === "dark"
                  ? "text-amber-400 hover:text-amber-300 hover:bg-white/10"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              title={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }>
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-white/10 ml-1">
              <div className="relative h-8 w-8 rounded-full bg-gradient-to-br from-safety to-yellow-400 flex items-center justify-center overflow-hidden flex-shrink-0">
                <User size={17} className="text-ink" aria-hidden="true" />
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 border border-ink" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold leading-tight text-white">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-[10px] text-slate-400 leading-tight">
                  {user?.email || "Admin account"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main
          className={`mx-auto w-full min-w-0 max-w-[1600px] flex-1 space-y-6 px-4 py-6 sm:px-6 md:px-8 ${theme === "dark" ? "bg-ink" : "bg-slate-100"}`}>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-safety bg-clip-text text-transparent">
            {pageTitle}
          </h2>
          {children}
        </main>
      </div>
    </div>
  );
}

export function AdminDashboardLayoutWrapper({
  children,
  activeNav,
  pageTitle,
  pageDescription,
}: AdminDashboardLayoutProps) {
  return (
    <AdminDashboardLayout
      activeNav={activeNav}
      pageTitle={pageTitle}
      pageDescription={pageDescription}>
      {children}
    </AdminDashboardLayout>
  );
}
