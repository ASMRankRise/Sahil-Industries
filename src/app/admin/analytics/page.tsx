"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Package,
  Activity,
  Target,
  Calendar,
  Download,
  ChevronRight,
  BarChart3,
  LineChart,
  PieChart,
  RefreshCw,
} from "lucide-react";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";

const revenueData = [
  { month: "Jan", revenue: 48.5, orders: 124, customers: 45, conversion: 3.2 },
  { month: "Feb", revenue: 52.3, orders: 138, customers: 52, conversion: 3.5 },
  { month: "Mar", revenue: 45.8, orders: 112, customers: 38, conversion: 2.9 },
  { month: "Apr", revenue: 61.2, orders: 156, customers: 61, conversion: 3.8 },
  { month: "May", revenue: 55.7, orders: 142, customers: 55, conversion: 3.4 },
  { month: "Jun", revenue: 68.9, orders: 178, customers: 68, conversion: 4.1 },
];

const productPerformance = [
  { name: "Single Girder EOT Crane", revenue: 18.5, orders: 45, growth: 12 },
  { name: "Double Girder EOT Crane", revenue: 15.2, orders: 28, growth: 8 },
  { name: "Electric Wire Rope Hoist", revenue: 8.7, orders: 62, growth: 15 },
  { name: "Goliath Gantry Crane", revenue: 12.3, orders: 18, growth: 5 },
  { name: "JIB Crane", revenue: 5.8, orders: 32, growth: 18 },
  { name: "Monorail Crane", revenue: 4.2, orders: 15, growth: -3 },
  { name: "Underslung Crane", revenue: 3.5, orders: 22, growth: 9 },
];

const customerSegments = [
  { name: "Enterprise", value: 45, color: "bg-blue-500" },
  { name: "SME", value: 35, color: "bg-green-500" },
  { name: "Government", value: 12, color: "bg-purple-500" },
  { name: "Individual", value: 8, color: "bg-orange-500" },
];

const topCustomers = [
  { name: "Vikram Singh", company: "Singh Steel Works", revenue: "₹67.8L", orders: 15, growth: 22 },
  { name: "Kavya Nair", company: "Nair Shipyard", revenue: "₹42.3L", orders: 9, growth: 15 },
  { name: "Rajesh Kumar", company: "Kumar Industries", revenue: "₹45.2L", orders: 12, growth: 8 },
  { name: "Priya Sharma", company: "Sharma Steel Works", revenue: "₹32.5L", orders: 8, growth: 12 },
  { name: "Neha Singh", company: "Singh Construction", revenue: "₹28.9L", orders: 7, growth: 5 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6m");
  const [selectedMetric, setSelectedMetric] = useState("revenue");

  return (
    <AdminDashboardLayout activeNav="/admin/analytics" pageTitle="Analytics" pageDescription="Business intelligence, performance metrics, and data insights">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-safety bg-clip-text text-transparent">Analytics</h2>
            <p className="text-slate-400 mt-1">Business intelligence, performance metrics, and data insights</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="h-10 pl-10 pr-8 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-safety/50 appearance-none cursor-pointer"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="3m">Last 3 Months</option>
                <option value="6m">Last 6 Months</option>
                <option value="1y">Last Year</option>
              </select>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors group">
              <Download size={14} className="group-hover:text-safety transition-colors" />
              Export Report
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors group">
              <RefreshCw size={14} className="group-hover:text-blue-400 transition-colors" />
              Refresh
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: "Total Revenue", value: "₹2.84Cr", change: "+18.5%", trend: "up", icon: DollarSign, color: "text-safety", bgColor: "bg-safety/10" },
            { label: "Total Orders", value: "1,247", change: "+12.3%", trend: "up", icon: Package, color: "text-blue-400", bgColor: "bg-blue-500/10" },
            { label: "Active Customers", value: "436", change: "+15.2%", trend: "up", icon: Users, color: "text-green-400", bgColor: "bg-green-500/10" },
            { label: "Conversion Rate", value: "3.42%", change: "+0.8%", trend: "up", icon: Target, color: "text-purple-400", bgColor: "bg-purple-500/10" },
          ].map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ y: -4 }}
              className="bg-surface border border-white/10 rounded-2xl p-6 relative overflow-hidden group shadow-lg shadow-black/20"
            >
              <div className="relative flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">{card.label}</p>
                  <p className="text-3xl font-bold tracking-tight mb-2 text-white">{card.value}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${card.trend === "up" ? "text-green-400" : "text-red-400"} flex items-center gap-1`}>
                      {card.trend === "up" ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      {card.change}
                    </span>
                    <span className="text-xs text-slate-500">vs last period</span>
                  </div>
                </div>
                <div className={`h-14 w-14 rounded-xl flex items-center justify-center flex-shrink-0 ${card.bgColor} ${card.color}`}>
                  <card.icon size={24} />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "75%" }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                  className="h-full bg-safety/50 rounded-r-full"
                />
              </div>
            </motion.div>
          ))}
        </section>

        {/* Charts Row */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Revenue Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2 bg-surface border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-white">Revenue Trend</h3>
                <p className="text-xs text-slate-400 mt-0.5">Monthly revenue performance over the last 6 months</p>
              </div>
              <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-safety/50 cursor-pointer">
                <option>Revenue</option>
                <option>Orders</option>
                <option>Customers</option>
                <option>Conversion</option>
              </select>
            </div>
            <div className="h-72 flex items-end justify-around gap-3 px-2">
              {revenueData.map((month, i) => (
                <motion.div
                  key={month.month}
                  initial={{ height: 0 }}
                  animate={{ height: `${(month.revenue / 68.9) * 100}%` }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="flex-1 flex flex-col items-center justify-end gap-2 max-w-24"
                >
                  <motion.div
                    className="w-full rounded-t-lg bg-gradient-to-t from-safety to-yellow-400 transition-all hover:from-yellow-400 hover:to-yellow-300"
                    style={{ height: `${(month.revenue / 68.9) * 100}%` }}
                    whileHover={{ scaleY: 1.05 }}
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      {month.revenue}Cr
                    </div>
                  </motion.div>
                  <span className="text-xs text-slate-400 font-medium">{month.month}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
              <span>Total: <strong className="text-white font-semibold">₹2.84Cr</strong></span>
              <span className="text-green-400 flex items-center gap-1"><TrendingUp size={12} /> +18.5%</span>
              <span>Avg: <strong className="text-white font-semibold">₹47.3L/month</strong></span>
            </div>
          </motion.div>

          {/* Order Status Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="bg-surface border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-base font-bold text-white mb-5">Order Status Distribution</h3>
            <div className="space-y-4">
              {[
                { label: "Delivered", count: 847, color: "text-green-400", bgColor: "bg-green-500/10", icon: "✓", percent: 68 },
                { label: "In Progress", count: 234, color: "text-blue-400", bgColor: "bg-blue-500/10", icon: "⟳", percent: 19 },
                { label: "Pending", count: 112, color: "text-yellow-400", bgColor: "bg-yellow-500/10", icon: "⏱", percent: 9 },
                { label: "Shipped", count: 54, color: "text-purple-400", bgColor: "bg-purple-500/10", icon: "🚚", percent: 4 },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.3 }}
                  className="group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${item.bgColor} ${item.color}`}>
                        <span className="text-xs font-bold">{item.icon}</span>
                      </div>
                      <span className="text-sm font-medium text-white">{item.label}</span>
                    </div>
                    <span className="text-sm font-bold text-white">{item.count}</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percent}%` }}
                      transition={{ delay: i * 0.08 + 0.3, duration: 0.8 }}
                      className={`h-full rounded-full ${item.color}`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Product Performance & Customer Segments */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Product Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-surface border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
              <Package className="text-safety" size={18} />
              Product Performance
            </h3>
            <div className="space-y-4">
              {productPerformance.map((product, i) => (
                <motion.div
                  key={product.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.3 }}
                  className="group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-safety/10 text-safety flex items-center justify-center flex-shrink-0">
                        <Package size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{product.name}</p>
                        <p className="text-[11px] text-slate-400">{product.orders} orders</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-right">
                      <span className="text-sm font-bold text-white">{product.revenue}Cr</span>
                      <span className={`text-xs font-medium ${product.growth >= 0 ? "text-green-400" : "text-red-400"} flex items-center gap-1`}>
                        {product.growth >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {product.growth >= 0 ? "+" : ""}{product.growth}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(product.revenue / 18.5) * 100}%` }}
                      transition={{ delay: i * 0.08 + 0.3, duration: 0.8 }}
                      className="h-full rounded-full bg-safety"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Customer Segments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="bg-surface border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
              <Users className="text-safety" size={18} />
              Customer Segments
            </h3>
            <div className="space-y-4">
              {customerSegments.map((segment, i) => (
                <motion.div
                  key={segment.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.3 }}
                  className="group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`h-7 w-7 rounded-lg ${segment.color}`}></div>
                      <span className="text-sm font-medium text-white">{segment.name}</span>
                    </div>
                    <span className="text-sm font-bold text-white">{segment.value}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${segment.value}%` }}
                      transition={{ delay: i * 0.08 + 0.3, duration: 0.8 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: segment.color.replace("bg-", "").replace("-500", "-500") }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Top Customers */}
        <section className="bg-surface border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Target className="text-safety" size={18} />
              Top Customers by Revenue
            </h3>
            <button className="text-xs font-medium text-safety hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="px-4 py-3 font-semibold">Rank</th>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Company</th>
                  <th className="px-4 py-3 font-semibold text-right">Revenue</th>
                  <th className="px-4 py-3 font-semibold text-right">Orders</th>
                  <th className="px-4 py-3 font-semibold text-right">Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {topCustomers.map((customer, index) => (
                  <tr key={customer.name} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-4 py-3 font-bold text-safety">#{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-white">{customer.name}</td>
                    <td className="px-4 py-3 text-slate-300">{customer.company}</td>
                    <td className="px-4 py-3 font-semibold text-right text-safety">{customer.revenue}</td>
                    <td className="px-4 py-3 text-right text-slate-300">{customer.orders}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-sm font-medium ${customer.growth >= 0 ? "text-green-400" : "text-red-400"} flex items-center justify-end gap-1`}>
                        {customer.growth >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {customer.growth >= 0 ? "+" : ""}{customer.growth}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
                        </div>
                      </section>
                    </div>
                  </AdminDashboardLayout>
                );
              }