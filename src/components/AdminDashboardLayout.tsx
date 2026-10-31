"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Package,
  Truck,
  BarChart3,
  Settings,
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
  Box,
  Activity,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  Download,
  Upload,
  Bell,
  Moon,
  Sun,
  HelpCircle,
  Zap,
  Target,
  RefreshCw,
  Image as LucideImage,
} from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

const asset = (path: string) => `/sahilcrane/${path}`;

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: Package, badge: 12 },
  { label: "Enquiries", href: "/admin/enquiries", icon: Mail, badge: 8 },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Products", href: "/admin/products", icon: Truck },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminDashboardLayoutProps {
  children: ReactNode;
  activeNav: string;
  pageTitle: string;
  pageDescription: string;
}

export function AdminDashboardLayout({ children, activeNav, pageTitle, pageDescription }: AdminDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [showNotifications, setShowNotifications] = useState(false);

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

  return (
    <div className={`min-h-screen bg-ink text-slate-100 ${theme === "light" ? "bg-slate-50 text-slate-900" : ""}`}>
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
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-safety to-yellow-400 flex items-center justify-center shadow-md shadow-safety/20 group-hover:scale-105 transition-transform">
              <Zap size={18} className="text-ink" />
            </div>
            <div>
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
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
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
                {item.badge && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center px-1.5 text-[10px] font-bold text-ink bg-safety rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 flex-shrink-0 space-y-2">
          <button
            onClick={() => {}}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-400 rounded-xl hover:bg-white/5 hover:text-white transition-colors group"
          >
            <LogOut size={17} className="group-hover:text-red-400 transition-colors" />
            <span>Sign Out</span>
          </button>
          <button
            onClick={() => {}}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-400 rounded-xl hover:bg-white/5 hover:text-white transition-colors group"
          >
            <HelpCircle size={17} className="group-hover:text-blue-400 transition-colors" />
            <span>Help & Support</span>
          </button>
          <div className="pt-3 border-t border-white/5 text-center">
            <p className="text-[11px] text-slate-500">v2.1.0 • Sahil Industries</p>
          </div>
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
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Notifications"
              >
                <Bell size={18} />
                <span className="absolute 1.5 top-1.5 right-1.5 h-2 w-2 rounded-full bg-safety ring-2 ring-ink" />
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-surface border border-white/10 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                    <h4 className="font-semibold text-sm text-white">Notifications</h4>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-white text-xs"
                    >
                      Close
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {[
                      { title: "New Order Received", desc: "ORD-006 from Rajesh Kumar", time: "2 min ago", unread: true },
                      { title: "Enquiry Response", desc: "Priya Sharma replied to your message", time: "15 min ago", unread: true },
                      { title: "Payment Received", desc: "₹2,45,000 for ORD-001", time: "1 hour ago", unread: false },
                      { title: "Low Stock Alert", desc: "Wire Rope Hoist stock below threshold", time: "3 hours ago", unread: false },
                    ].map((notif, i) => (
                      <div
                        key={i}
                        className={`px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 ${
                          notif.unread ? "bg-white/[0.03]" : ""
                        }`}
                      >
                        <p className="font-medium text-xs text-white">{notif.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{notif.desc}</p>
                        <p className="text-[10px] text-slate-500 mt-1">{notif.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-white/10 ml-1">
              <div className="relative h-8 w-8 rounded-full bg-gradient-to-br from-safety to-yellow-400 flex items-center justify-center overflow-hidden flex-shrink-0">
                <img src={asset("home/about-01.jpg")} alt="Admin" className="h-full w-full object-cover" />
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 border border-ink" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold leading-tight text-white">Admin User</p>
                <p className="text-[10px] text-slate-400 leading-tight">sahilcranes@gmail.com</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="flex-1 px-4 sm:px-6 md:px-8 py-6 space-y-6 max-w-[1600px] w-full mx-auto">
          <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-safety bg-clip-text text-transparent">
                {pageTitle}
              </h2>
              <p className="text-sm text-slate-400 mt-1">{pageDescription}</p>
            </div>
          </section>

          {children}
        </main>
      </div>
    </div>
  );
}