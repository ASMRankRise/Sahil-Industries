"use client";

import { useState, useEffect } from "react";
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
import { motion, AnimatePresence } from "framer-motion";

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

const statCards = [
  {
    label: "Total Orders",
    value: "1,247",
    change: "+12%",
    trend: "up",
    progress: 78,
    icon: Package,
    color: "text-safety",
    bgColor: "bg-safety/10",
    barColor: "bg-safety",
  },
  {
    label: "Enquiries",
    value: "892",
    change: "+8%",
    trend: "up",
    progress: 64,
    icon: Mail,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    barColor: "bg-blue-400",
  },
  {
    label: "Customers",
    value: "436",
    change: "+15%",
    trend: "up",
    progress: 85,
    icon: Users,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    barColor: "bg-green-400",
  },
  {
    label: "Revenue",
    value: "₹48.5L",
    change: "+22%",
    trend: "up",
    progress: 92,
    icon: DollarSign,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    barColor: "bg-purple-400",
  },
];

const revenueDays = [
  { label: "Mon", value: 45, display: "₹22.5L" },
  { label: "Tue", value: 65, display: "₹32.5L" },
  { label: "Wed", value: 35, display: "₹17.5L" },
  { label: "Thu", value: 75, display: "₹37.5L" },
  { label: "Fri", value: 55, display: "₹27.5L" },
  { label: "Sat", value: 85, display: "₹42.5L" },
  { label: "Sun", value: 40, display: "₹20.0L" },
];

const recentOrders = [
  {
    id: "ORD-001",
    customer: "Rajesh Kumar",
    email: "rajesh@company.com",
    product: "Single Girder EOT Crane",
    amount: "₹2,45,000",
    status: "Delivered",
    date: "2024-01-15",
  },
  {
    id: "ORD-002",
    customer: "Priya Sharma",
    email: "priya@industries.in",
    product: "Double Girder EOT Crane",
    amount: "₹4,80,000",
    status: "In Progress",
    date: "2024-01-14",
  },
  {
    id: "ORD-003",
    customer: "Amit Patel",
    email: "amit@manufacturing.com",
    product: "Electric Wire Rope Hoist",
    amount: "₹85,000",
    status: "Pending",
    date: "2024-01-13",
  },
  {
    id: "ORD-004",
    customer: "Suresh Reddy",
    email: "suresh@engineering.co",
    product: "JIB Crane",
    amount: "₹1,20,000",
    status: "Delivered",
    date: "2024-01-12",
  },
  {
    id: "ORD-005",
    customer: "Neha Singh",
    email: "neha@construction.in",
    product: "Underslung Crane",
    amount: "₹3,10,000",
    status: "Shipped",
    date: "2024-01-11",
  },
];

const quickActions = [
  {
    label: "Create New Order",
    icon: Plus,
    href: "/admin/orders/new",
    color: "text-safety",
    bgColor: "bg-safety/10",
    borderColor: "hover:border-safety/40",
    description: "Start a new order process",
  },
  {
    label: "Reply to Enquiry",
    icon: MessageSquare,
    href: "/admin/enquiries",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "hover:border-blue-500/40",
    description: "Respond to pending enquiries",
  },
  {
    label: "Add Product",
    icon: Box,
    href: "/admin/products/new",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "hover:border-green-500/40",
    description: "Add new crane product",
  },
  {
    label: "Manage Customers",
    icon: UserPlus,
    href: "/admin/customers",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "hover:border-purple-500/40",
    description: "View and manage customers",
  },
  {
    label: "View Analytics",
    icon: Activity,
    href: "/admin/analytics",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "hover:border-orange-500/40",
    description: "Check performance metrics",
  },
  {
    label: "Export Reports",
    icon: Download,
    href: "/admin/reports",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "hover:border-cyan-500/40",
    description: "Download business reports",
  },
];

const statusConfig = {
  Delivered: { label: "Delivered", color: "bg-green-500/10 text-green-400 border border-green-500/20", icon: CheckCircle },
  "In Progress": { label: "In Progress", color: "bg-blue-500/10 text-blue-400 border border-blue-500/20", icon: Loader2 },
  Pending: { label: "Pending", color: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20", icon: Clock },
  Shipped: { label: "Shipped", color: "bg-purple-500/10 text-purple-400 border border-purple-500/20", icon: Truck },
  Cancelled: { label: "Cancelled", color: "bg-red-500/10 text-red-400 border border-red-500/20", icon: AlertCircle },
};

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState("/admin");
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNotifications, setShowNotifications] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

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

  const filteredOrders = recentOrders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status: string) =>
    statusConfig[status as keyof typeof statusConfig] || statusConfig.Pending;

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
              <button
                key={item.label}
                onClick={() => {
                  setActiveNav(item.href);
                  if (isMobile) setSidebarOpen(false);
                }}
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
              </button>
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
                Dashboard
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block mt-0.5">Welcome back, Admin User</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="search"
                placeholder="Search orders, customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-56 lg:w-64 pl-9 pr-4 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-safety/50 focus:bg-white/10 transition-all"
              />
            </div>

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
          {/* Welcome / Header Section */}
          <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-safety bg-clip-text text-transparent">
                Overview
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Welcome to Sahil Industries management console. Here is your operational summary today.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <button className="flex items-center gap-2 px-3.5 py-2 border border-white/10 rounded-lg text-xs font-medium hover:bg-white/5 transition-colors group">
                <Download size={14} className="group-hover:text-safety transition-colors" />
                Export Report
              </button>
              <button className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-safety to-yellow-400 text-ink rounded-lg text-xs font-semibold hover:brightness-105 transition-all shadow-sm shadow-safety/20">
                <Plus size={14} />
                New Entry
              </button>
              <button className="flex items-center gap-2 px-3.5 py-2 border border-white/10 rounded-lg text-xs font-medium hover:bg-white/5 transition-colors group">
                <RefreshCw size={14} className="group-hover:text-blue-400 transition-colors" />
                Refresh
              </button>
            </div>
          </section>

          {/* Key Metrics Cards */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Key Metrics</h3>
              <div className="flex items-center gap-1.5 text-xs text-green-400">
                <TrendingUp size={13} />
                <span>+15.3% vs last month</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    whileHover={{ y: -3 }}
                    className="bg-surface border border-white/10 rounded-2xl p-5 relative overflow-hidden group shadow-lg shadow-black/20"
                  >
                    <div className="relative flex items-start justify-between">
                      <div className="flex-1 pr-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">{card.label}</p>
                        <p className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-white">{card.value}</p>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium ${card.trend === "up" ? "text-green-400" : "text-red-400"} flex items-center gap-1`}>
                            {card.trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {card.change}
                          </span>
                          <span className="text-[11px] text-slate-500">vs last month</span>
                        </div>
                      </div>
                      <div className={`h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 ${card.bgColor} ${card.color}`}>
                        <Icon size={20} />
                      </div>
                    </div>
                    {/* Progress indicator */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${card.progress}%` }}
                        transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                        className={`h-full ${card.barColor} rounded-r-full`}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Charts Row */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Revenue Overview Chart */}
            <div className="lg:col-span-2 bg-surface border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Revenue Overview</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Weekly dispatched machinery and completed installations</p>
                </div>
                <select className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-safety/50 cursor-pointer">
                  <option className="bg-surface">Last 7 Days</option>
                  <option className="bg-surface">Last 30 Days</option>
                  <option className="bg-surface">Last 90 Days</option>
                </select>
              </div>

              {/* Chart Bars - properly aligned horizontally & vertically */}
              <div className="h-56 flex flex-col justify-end pt-6">
                <div className="flex-1 flex items-end justify-between gap-3 sm:gap-6 px-2">
                  {revenueDays.map((day, i) => (
                    <div key={day.label} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                      {/* Tooltip on hover */}
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[11px] font-semibold px-2 py-0.5 rounded bg-ink border border-white/20 text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                        {day.display}
                      </div>
                      {/* Bar Container */}
                      <div className="w-full max-w-[42px] h-full flex items-end justify-center">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${day.value}%` }}
                          transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          className="w-full rounded-t-lg bg-gradient-to-t from-safety/70 to-safety group-hover:from-safety group-hover:to-yellow-300 transition-all cursor-pointer shadow-sm shadow-safety/10"
                        />
                      </div>
                      {/* Day Label */}
                      <span className="text-xs text-slate-400 font-medium mt-2 text-center">{day.label}</span>
                    </div>
                  ))}
                </div>
                {/* Horizontal Baseline */}
                <div className="border-t border-white/10 mt-1" />
              </div>

              {/* Chart Footer Metrics */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <span>Total: <strong className="text-white font-semibold">₹48.5L</strong></span>
                <span className="text-green-400 flex items-center gap-1"><TrendingUp size={12} /> +22% vs prev week</span>
                <span>Avg: <strong className="text-white font-semibold">₹6.9L / day</strong></span>
              </div>
            </div>

            {/* Order Status Breakdown */}
            <div className="bg-surface border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white mb-1">Order Status</h3>
                <p className="text-xs text-slate-400 mb-5">Current breakdown of all pending & fulfilled contracts</p>
                <div className="space-y-4">
                  {[
                    { label: "Delivered", count: 847, color: "text-green-400", bgColor: "bg-green-500/10", barColor: "bg-green-500", icon: CheckCircle, percent: 68 },
                    { label: "In Progress", count: 234, color: "text-blue-400", bgColor: "bg-blue-500/10", barColor: "bg-blue-500", icon: Loader2, percent: 19 },
                    { label: "Pending", count: 112, color: "text-yellow-400", bgColor: "bg-yellow-500/10", barColor: "bg-yellow-500", icon: Clock, percent: 9 },
                    { label: "Shipped", count: 54, color: "text-purple-400", bgColor: "bg-purple-500/10", barColor: "bg-purple-500", icon: Truck, percent: 4 },
                  ].map((item, i) => (
                    <div key={item.label} className="group">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2.5">
                          <div className={`h-6 w-6 rounded-md flex items-center justify-center ${item.bgColor} ${item.color}`}>
                            <item.icon size={13} />
                          </div>
                          <span className="text-xs font-medium text-slate-200">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400 font-mono">{item.percent}%</span>
                          <span className="text-xs font-bold text-white min-w-[2.5rem] text-right">{item.count}</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percent}%` }}
                          transition={{ delay: i * 0.08 + 0.3, duration: 0.7 }}
                          className={`h-full rounded-full ${item.barColor}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-white/5 mt-5 flex items-center justify-between text-xs text-slate-400">
                <span>Active Pipelines</span>
                <span className="text-safety font-semibold">1,247 Total</span>
              </div>
            </div>
          </section>

          {/* Recent Orders & Quick Actions */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Recent Orders Table */}
            <div className="lg:col-span-2 bg-surface border border-white/10 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <div>
                  <h3 className="text-base font-bold text-white">Recent Orders</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Latest purchase requisitions and crane delivery statuses</p>
                </div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <div className="relative">
                    <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="h-8 pl-8 pr-6 bg-white/5 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-safety/50 cursor-pointer"
                    >
                      <option value="all" className="bg-surface">All Status</option>
                      <option value="Delivered" className="bg-surface">Delivered</option>
                      <option value="In Progress" className="bg-surface">In Progress</option>
                      <option value="Pending" className="bg-surface">Pending</option>
                      <option value="Shipped" className="bg-surface">Shipped</option>
                    </select>
                  </div>
                  <Link href="/admin/orders" className="text-xs font-semibold text-safety hover:underline flex items-center gap-0.5">
                    View all <ChevronRight size={13} />
                  </Link>
                </div>
              </div>

              {/* Table Container */}
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-left text-xs min-w-[620px]">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="px-3 py-3 font-semibold">Order ID</th>
                      <th className="px-3 py-3 font-semibold">Customer</th>
                      <th className="px-3 py-3 font-semibold hidden md:table-cell">Product</th>
                      <th className="px-3 py-3 font-semibold text-right">Amount</th>
                      <th className="px-3 py-3 font-semibold">Status</th>
                      <th className="px-3 py-3 font-semibold hidden lg:table-cell">Date</th>
                      <th className="px-3 py-3 font-semibold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredOrders.map((order, index) => {
                      const status = getStatusConfig(order.status);
                      const StatusIcon = status.icon;
                      return (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.04, duration: 0.3 }}
                          className="hover:bg-white/[0.03] transition-colors group"
                        >
                          <td className="px-3 py-3.5 font-mono text-slate-300 font-semibold">{order.id}</td>
                          <td className="px-3 py-3.5">
                            <div>
                              <p className="font-medium text-white">{order.customer}</p>
                              <p className="text-[11px] text-slate-400 truncate max-w-[150px]">{order.email}</p>
                            </div>
                          </td>
                          <td className="px-3 py-3.5 hidden md:table-cell text-slate-300 max-w-[180px] truncate">{order.product}</td>
                          <td className="px-3 py-3.5 font-semibold text-right text-safety">{order.amount}</td>
                          <td className="px-3 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${status.color}`}>
                              <StatusIcon size={11} />
                              {status.label}
                            </span>
                          </td>
                          <td className="px-3 py-3.5 hidden lg:table-cell text-slate-400">{order.date}</td>
                          <td className="px-3 py-3.5 text-center">
                            <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-colors" title="View details">
                                <Eye size={13} />
                              </button>
                              <button className="p-1.5 text-slate-400 hover:text-safety rounded hover:bg-safety/10 transition-colors" title="Edit order">
                                <Edit size={13} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredOrders.length === 0 && (
                  <div className="py-10 text-center text-slate-400">
                    <Search className="mx-auto mb-2 text-slate-500" size={28} />
                    <p className="text-xs">No orders matching criteria found.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-surface border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                  <Zap className="text-safety" size={18} />
                  Quick Actions
                </h3>
                <p className="text-xs text-slate-400 mb-4">Frequently used shortcuts and administrative commands</p>
                <div className="space-y-2">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <motion.button
                        key={action.label}
                        onClick={() => {}}
                        whileHover={{ x: 3 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.04, duration: 0.3 }}
                        className={`flex w-full items-center gap-3 px-3.5 py-2.5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 ${action.borderColor} rounded-xl text-xs font-medium transition-all duration-200 group text-left`}
                      >
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${action.bgColor} ${action.color} group-hover:scale-105 transition-transform flex-shrink-0`}>
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white group-hover:text-safety transition-colors truncate">{action.label}</p>
                          <p className="text-[10px] text-slate-400 truncate">{action.description}</p>
                        </div>
                        <ChevronRight size={14} className="text-slate-500 group-hover:text-white transition-colors flex-shrink-0" />
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Visual Reference Section */}
          <section className="bg-surface border border-white/10 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <LucideImage className="text-safety" size={18} />
                  Manufacturing Assets
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">High-resolution factory photographs and engineering documentation</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 border border-white/10 rounded-lg text-xs font-medium hover:bg-white/5 transition-colors flex items-center gap-1.5">
                  <Download size={13} />
                  Download Assets
                </button>
                <button className="px-3 py-1.5 bg-safety/10 border border-safety/30 rounded-lg text-xs font-medium text-safety hover:bg-safety/20 transition-colors flex items-center gap-1.5">
                  <Upload size={13} />
                  Upload New
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { src: "home/about-01.jpg", title: "Heavy EOT Crane Fabrication", desc: "Main manufacturing facility bay" },
                { src: "home/about-02.jpg", title: "Electric Wire Hoist Assembly", desc: "Testing and assembly line" },
              ].map((img, i) => (
                <div
                  key={img.src}
                  className="relative rounded-xl overflow-hidden border border-white/10 bg-black/20 aspect-[16/10] group"
                >
                  <img
                    src={asset(img.src)}
                    alt={img.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                    <div>
                      <p className="font-semibold text-sm text-white">{img.title}</p>
                      <p className="text-xs text-slate-300">{img.desc}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <button className="p-1.5 bg-black/50 hover:bg-black/80 text-white rounded-lg transition-colors backdrop-blur-sm" title="View Fullscreen">
                        <Eye size={13} />
                      </button>
                      <button className="p-1.5 bg-black/50 hover:bg-black/80 text-white rounded-lg transition-colors backdrop-blur-sm" title="Download">
                        <Download size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Footer System Metrics Bar */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Uptime", value: "99.9%", icon: Activity, color: "text-green-400", bg: "bg-green-500/10" },
              { label: "Response Time", value: "124ms", icon: Zap, color: "text-blue-400", bg: "bg-blue-500/10" },
              { label: "Active Users", value: "1,234", icon: Users, color: "text-purple-400", bg: "bg-purple-500/10" },
              { label: "Conversion Rate", value: "3.2%", icon: Target, color: "text-orange-400", bg: "bg-orange-500/10" },
            ].map((item) => (
              <div key={item.label} className="bg-surface border border-white/10 rounded-xl p-4 flex items-center gap-3.5 group">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${item.bg} ${item.color} flex-shrink-0 group-hover:scale-105 transition-transform`}>
                  <item.icon size={19} />
                </div>
                <div>
                  <p className="text-xl font-bold text-white tracking-tight leading-tight">{item.value}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">{item.label}</p>
                </div>
              </div>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}