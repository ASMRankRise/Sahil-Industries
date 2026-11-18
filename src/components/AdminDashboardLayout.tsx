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

export function AdminDashboardLayout({ children, activeNav, pageTitle, pageDescription }: AdminDashboardLayoutProps) {
  const router = useRouter();
  const { logout, isAuthenticated, loading, theme, toggleTheme, user } = useAdminData();

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace("/admin");
  }, [loading, isAuthenticated, router]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [enquiryCount, setEnquiryCount] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetch("/api/admin/enquiries", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : { enquiries: [] })
      .then((data) => setEnquiryCount(Array.isArray(data.enquiries) ? data.enquiries.length : 0))
      .catch(() => setEnquiryCount(0));
  }, []);

  if (loading) return <AdminPageSkeleton />;
  if (!isAuthenticated) return null;

  return (
    <div
      data-admin-theme={theme}
      className={`admin-dashboard min-h-screen ${theme === "dark" ? "bg-ink text-slate-100" : "bg-slate-100 text-slate-900"}`}
    >
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
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header - exactly h-16 to match topbar */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-white/10 flex-shrink-0">
          <Link href="/" className="flex w-full translate-y-1 flex-col items-center justify-center gap-1 group">
            <div className="flex h-9 w-11 items-center justify-center rounded-lg border border-safety/50 bg-safety/10 shadow-md shadow-safety/10 transition-transform group-hover:scale-105">
              <img src="/media/logo/logo%20svg.svg" alt="Sahil Industries" className="h-7 w-9 object-contain" />
            </div>
            <div className="text-center">
              <span className="text-xs font-extrabold uppercase tracking-widest text-white">SAHIL</span>
              <span className="text-[10px] font-medium text-safety uppercase tracking-wider block">INDUSTRIES</span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close sidebar"
          >
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
                    ? "bg-safety/10 text-safety border-l-4 border-safety shadow-sm shadow-safety/10"
                    : "text-slate-300 hover:bg-white/5 hover:text-white border-l-4 border-transparent"
                }`}
              >
                <div className={`flex-shrink-0 transition-colors duration-200 ${isActive ? "text-safety" : "text-slate-400 group-hover:text-white"}`}>
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
        <div className="mt-auto flex-shrink-0 border-t border-white/10 p-4">
          <button
           onClick={async () => {
              await logout();
              // Hard navigation prevents the current protected page from
              // rendering once more while the auth context is updating.
              window.location.replace("/admin");
            }}
            className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all group hover:shadow-lg ${theme === "light" ? "border-red-300 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 hover:shadow-red-200" : "border-red-500/20 bg-red-500/5 text-red-300 hover:bg-red-500/15 hover:text-red-200 hover:shadow-red-950/30"}`}
          >
            <LogOut size={17} className="group-hover:text-red-400 transition-colors" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`min-h-screen flex flex-col transition-all duration-300 ${sidebarOpen ? "lg:pl-64" : "lg:pl-0"}`}>
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between px-4 sm:px-6 md:px-8 border-b border-white/10 bg-ink/95 backdrop-blur-md">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors focus:outline-none"
              aria-label="Toggle sidebar"
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight bg-gradient-to-r from-white to-safety bg-clip-text text-transparent leading-none">
                {pageTitle}
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block mt-0.5">{pageDescription}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                theme === "dark"
                  ? "text-amber-400 hover:text-amber-300 hover:bg-white/10"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-white/10 ml-1">
              <div className="relative h-8 w-8 rounded-full bg-gradient-to-br from-safety to-yellow-400 flex items-center justify-center overflow-hidden flex-shrink-0">
                <User size={17} className="text-ink" aria-hidden="true" />
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 border border-ink" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold leading-tight text-white">{user?.name || "Admin User"}</p>
                <p className="text-[10px] text-slate-400 leading-tight">{user?.email || "Admin account"}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className={`flex-1 px-4 sm:px-6 md:px-8 py-6 space-y-6 max-w-[1600px] w-full mx-auto ${theme === "dark" ? "bg-ink" : "bg-slate-100"}`}>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-safety bg-clip-text text-transparent">{pageTitle}</h2>
          {children}
        </main>
      </div>
    </div>
  );
}

export function AdminDashboardLayoutWrapper({ children, activeNav, pageTitle, pageDescription }: AdminDashboardLayoutProps) {
  return (
    <AdminDashboardLayout activeNav={activeNav} pageTitle={pageTitle} pageDescription={pageDescription}>
      {children}
    </AdminDashboardLayout>
  );
}
