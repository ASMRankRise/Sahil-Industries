"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Search,
  Filter,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  Download,
  Plus,
  ArrowUpDown,
  MoreHorizontal,
  CheckCircle,
  Loader2,
  Clock,
  AlertCircle,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";

const statusConfig = {
  Delivered: { label: "Delivered", color: "bg-green-500/10 text-green-400 border border-green-500/20", icon: CheckCircle },
  "In Progress": { label: "In Progress", color: "bg-blue-500/10 text-blue-400 border border-blue-500/20", icon: Loader2 },
  Pending: { label: "Pending", color: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20", icon: Clock },
  Shipped: { label: "Shipped", color: "bg-purple-500/10 text-purple-400 border border-purple-500/20", icon: Truck },
  Cancelled: { label: "Cancelled", color: "bg-red-500/10 text-red-400 border border-red-500/20", icon: AlertCircle },
};

const orders = [
  { id: "ORD-001", customer: "Rajesh Kumar", email: "rajesh@company.com", product: "Single Girder EOT Crane", amount: "₹2,45,000", status: "Delivered", date: "2024-01-15", priority: "high" },
  { id: "ORD-002", customer: "Priya Sharma", email: "priya@industries.in", product: "Double Girder EOT Crane", amount: "₹4,80,000", status: "In Progress", date: "2024-01-14", priority: "high" },
  { id: "ORD-003", customer: "Amit Patel", email: "amit@manufacturing.com", product: "Electric Wire Rope Hoist", amount: "₹85,000", status: "Pending", date: "2024-01-13", priority: "medium" },
  { id: "ORD-004", customer: "Suresh Reddy", email: "suresh@engineering.co", product: "JIB Crane", amount: "₹1,20,000", status: "Delivered", date: "2024-01-12", priority: "low" },
  { id: "ORD-005", customer: "Neha Singh", email: "neha@construction.in", product: "Underslung Crane", amount: "₹3,10,000", status: "Shipped", date: "2024-01-11", priority: "medium" },
  { id: "ORD-006", customer: "Vikram Singh", email: "vikram@steelworks.com", product: "Goliath Gantry Crane", amount: "₹12,50,000", status: "In Progress", date: "2024-01-10", priority: "high" },
  { id: "ORD-007", customer: "Anita Desai", email: "anita@powergen.in", product: "Monorail Crane", amount: "₹6,75,000", status: "Pending", date: "2024-01-09", priority: "medium" },
  { id: "ORD-008", customer: "Rohit Gupta", email: "rohit@infrabuild.com", product: "JIB Crane", amount: "₹1,85,000", status: "Delivered", date: "2024-01-08", priority: "low" },
  { id: "ORD-009", customer: "Kavya Nair", email: "kavya@shipyard.in", product: "Double Girder EOT Crane", amount: "₹8,90,000", status: "Shipped", date: "2024-01-07", priority: "high" },
  { id: "ORD-010", customer: "Manoj Kumar", email: "manoj@cementworks.com", product: "Electric Wire Rope Hoist", amount: "₹95,000", status: "Cancelled", date: "2024-01-06", priority: "low" },
];

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({ key: "date", direction: "desc" });
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingOrder, setDeletingOrder] = useState<string | null>(null);

  const getStatusConfig = (status: string) => statusConfig[status as keyof typeof statusConfig] || statusConfig.Pending;

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const aVal = a[sortConfig.key as keyof typeof a];
    const bVal = b[sortConfig.key as keyof typeof b];
    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const toggleSelect = (id: string) => {
    setSelectedOrders(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === sortedOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(sortedOrders.map(o => o.id));
    }
  };

  const handleDelete = (id: string) => {
    setDeletingOrder(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deletingOrder) {
      // In real app, call API to delete
      setShowDeleteModal(false);
      setDeletingOrder(null);
    }
  };

  return (
    <AdminDashboardLayout activeNav="/admin/orders" pageTitle="Orders" pageDescription="Manage and track all customer orders and crane deliveries">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-safety bg-clip-text text-transparent">Orders</h2>
            <p className="text-slate-400 mt-1">Manage and track all customer orders and crane deliveries</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/admin/orders/new" className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-safety to-yellow-400 text-ink rounded-lg text-sm font-semibold hover:brightness-105 transition-all shadow-sm shadow-safety/20">
              <Plus size={14} />
              New Order
            </Link>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors group">
              <Download size={14} className="group-hover:text-safety transition-colors" />
              Export
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-surface border border-white/10 rounded-2xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="search"
                placeholder="Search orders, customers, products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-safety/50 focus:bg-white/10 transition-all"
              />
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 pl-9 pr-8 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-safety/50 appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="Delivered">Delivered</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[800px]">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold bg-white/[0.02]">
                  <th className="px-4 py-3.5 w-12">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === sortedOrders.length && sortedOrders.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-white/20 text-safety bg-white/5 focus:ring-safety/50 cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3.5 cursor-pointer hover:text-safety transition-colors" onClick={() => handleSort("id")}>
                    <div className="flex items-center gap-1.5">
                      Order ID
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3.5 cursor-pointer hover:text-safety transition-colors" onClick={() => handleSort("customer")}>
                    <div className="flex items-center gap-1.5">
                      Customer
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3.5 cursor-pointer hover:text-safety transition-colors hidden md:table-cell" onClick={() => handleSort("product")}>
                    <div className="flex items-center gap-1.5">
                      Product
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3.5 cursor-pointer hover:text-safety transition-colors text-right" onClick={() => handleSort("amount")}>
                    <div className="flex items-center gap-1.5 justify-end">
                      Amount
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3.5 cursor-pointer hover:text-safety transition-colors" onClick={() => handleSort("status")}>
                    <div className="flex items-center gap-1.5">
                      Status
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3.5 cursor-pointer hover:text-safety transition-colors hidden lg:table-cell" onClick={() => handleSort("date")}>
                    <div className="flex items-center gap-1.5">
                      Date
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sortedOrders.map((order, index) => {
                  const status = getStatusConfig(order.status);
                  const StatusIcon = status.icon;
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03, duration: 0.3 }}
                      className="hover:bg-white/[0.03] transition-colors group"
                    >
                      <td className="px-4 py-3.5">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => toggleSelect(order.id)}
                          className="w-4 h-4 rounded border-white/20 text-safety bg-white/5 focus:ring-safety/50 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-300 font-semibold">{order.id}</td>
                      <td className="px-4 py-3.5">
                        <div>
                          <p className="font-medium text-white">{order.customer}</p>
                          <p className="text-[11px] text-slate-400 truncate max-w-[180px]">{order.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell text-slate-300 max-w-[200px] truncate">{order.product}</td>
                      <td className="px-4 py-3.5 font-semibold text-right text-safety">{order.amount}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${status.color}`}>
                          <StatusIcon size={11} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell text-slate-400">{order.date}</td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-colors" title="View details">
                            <Eye size={13} />
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-safety rounded hover:bg-safety/10 transition-colors" title="Edit order">
                            <Edit size={13} />
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-red-500/10 transition-colors" title="Delete order" onClick={() => handleDelete(order.id)}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
            {sortedOrders.length === 0 && (
              <div className="py-12 text-center text-slate-400">
                <Search className="mx-auto mb-2 text-slate-500" size={28} />
                <p className="text-sm">No orders matching criteria found.</p>
              </div>
            )}
          </div>

          {/* Bulk Actions Bar */}
          <AnimatePresence>
            {selectedOrders.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="px-4 py-3 border-t border-white/10 flex items-center justify-between bg-white/[0.02]"
              >
                <span className="text-sm text-slate-300">{selectedOrders.length} order{selectedOrders.length !== 1 ? "s" : ""} selected</span>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 border border-white/10 rounded-lg text-xs font-medium hover:bg-white/5 transition-colors flex items-center gap-1.5">
                    <Download size={12} />
                    Export
                  </button>
                  <button className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-1.5" onClick={() => handleDelete(selectedOrders[0])}>
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">Showing {sortedOrders.length} of {orders.length} orders</p>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-white/10 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50" disabled>
              <ChevronRight size={16} className="-rotate-180" />
            </button>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map(n => (
                <button key={n} className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${n === 1 ? "bg-safety text-ink" : "text-slate-400 hover:bg-white/5"}`}>{n}</button>
              ))}
            </div>
            <button className="p-2 border border-white/10 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}