"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
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
  Mail,
  Phone,
  MapPin,
  Building2,
  Star,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";

const customers = [
  { id: "CUST-001", name: "Rajesh Kumar", email: "rajesh@company.com", phone: "+91 98765 43210", company: "Kumar Industries", city: "Mumbai", state: "Maharashtra", totalOrders: 12, totalSpent: "₹45,20,000", lastOrder: "2024-01-15", status: "Active", joined: "2022-03-15" },
  { id: "CUST-002", name: "Priya Sharma", email: "priya@industries.in", phone: "+91 98765 43211", company: "Sharma Steel Works", city: "Pune", state: "Maharashtra", totalOrders: 8, totalSpent: "₹32,50,000", lastOrder: "2024-01-14", status: "Active", joined: "2021-11-20" },
  { id: "CUST-003", name: "Amit Patel", email: "amit@manufacturing.com", phone: "+91 98765 43212", company: "Patel Manufacturing", city: "Ahmedabad", state: "Gujarat", totalOrders: 5, totalSpent: "₹18,75,000", lastOrder: "2024-01-13", status: "Active", joined: "2023-02-10" },
  { id: "CUST-004", name: "Suresh Reddy", email: "suresh@engineering.co", phone: "+91 98765 43213", company: "Reddy Engineering", city: "Hyderabad", state: "Telangana", totalOrders: 3, totalSpent: "₹9,45,000", lastOrder: "2024-01-12", status: "Inactive", joined: "2023-06-05" },
  { id: "CUST-005", name: "Neha Singh", email: "neha@construction.in", phone: "+91 98765 43214", company: "Singh Construction", city: "Delhi", state: "Delhi", totalOrders: 7, totalSpent: "₹28,90,000", lastOrder: "2024-01-11", status: "Active", joined: "2022-08-22" },
  { id: "CUST-006", name: "Vikram Singh", email: "vikram@steelworks.com", phone: "+91 98765 43215", company: "Singh Steel Works", city: "Jamshedpur", state: "Jharkhand", totalOrders: 15, totalSpent: "₹67,80,000", lastOrder: "2024-01-10", status: "Active", joined: "2021-05-18" },
  { id: "CUST-007", name: "Anita Desai", email: "anita@powergen.in", phone: "+91 98765 43216", company: "Desai Power Gen", city: "Vadodara", state: "Gujarat", totalOrders: 4, totalSpent: "₹15,60,000", lastOrder: "2024-01-09", status: "Active", joined: "2023-01-30" },
  { id: "CUST-008", name: "Rohit Gupta", email: "rohit@infrabuild.com", phone: "+91 98765 43217", company: "Gupta Infra Build", city: "Bangalore", state: "Karnataka", totalOrders: 2, totalSpent: "₹5,20,000", lastOrder: "2024-01-08", status: "New", joined: "2023-12-01" },
  { id: "CUST-009", name: "Kavya Nair", email: "kavya@shipyard.in", phone: "+91 98765 43218", company: "Nair Shipyard", city: "Kochi", state: "Kerala", totalOrders: 9, totalSpent: "₹42,30,000", lastOrder: "2024-01-07", status: "Active", joined: "2022-04-12" },
  { id: "CUST-010", name: "Manoj Kumar", email: "manoj@cementworks.com", phone: "+91 98765 43219", company: "Kumar Cement", city: "Raipur", state: "Chhattisgarh", totalOrders: 1, totalSpent: "₹3,80,000", lastOrder: "2024-01-06", status: "Inactive", joined: "2023-09-25" },
];

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({ key: "name", direction: "asc" });
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
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
    setSelectedCustomers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedCustomers.length === sortedCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(sortedCustomers.map(c => c.id));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-500/10 text-green-400 border border-green-500/20";
      case "Inactive": return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
      case "New": return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
      default: return "bg-white/10 text-white border border-white/20";
    }
  };

  return (
    <AdminDashboardLayout activeNav="/admin/customers" pageTitle="Customers" pageDescription="Manage customer profiles, orders, and relationships">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-safety bg-clip-text text-transparent">Customers</h2>
            <p className="text-slate-400 mt-1">Manage customer profiles, orders, and relationships</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-safety to-yellow-400 text-ink rounded-lg text-sm font-semibold hover:brightness-105 transition-all shadow-sm shadow-safety/20">
              <Plus size={14} />
              Add Customer
            </button>
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
                placeholder="Search customers, companies, emails..."
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
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="New">New</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[900px]">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold bg-white/[0.02]">
                  <th className="px-4 py-3.5 w-12">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.length === sortedCustomers.length && sortedCustomers.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-white/20 text-safety bg-white/5 focus:ring-safety/50 cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3.5 cursor-pointer hover:text-safety transition-colors" onClick={() => handleSort("id")}>
                    <div className="flex items-center gap-1.5">
                      Customer ID
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3.5 cursor-pointer hover:text-safety transition-colors" onClick={() => handleSort("name")}>
                    <div className="flex items-center gap-1.5">
                      Name
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3.5 cursor-pointer hover:text-safety transition-colors" onClick={() => handleSort("company")}>
                    <div className="flex items-center gap-1.5">
                      Company
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3.5 cursor-pointer hover:text-safety transition-colors hidden md:table-cell" onClick={() => handleSort("city")}>
                    <div className="flex items-center gap-1.5">
                      Location
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3.5 cursor-pointer hover:text-safety transition-colors text-right" onClick={() => handleSort("totalOrders")}>
                    <div className="flex items-center gap-1.5 justify-end">
                      Orders
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3.5 cursor-pointer hover:text-safety transition-colors text-right" onClick={() => handleSort("totalSpent")}>
                    <div className="flex items-center gap-1.5 justify-end">
                      Total Spent
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3.5 cursor-pointer hover:text-safety transition-colors" onClick={() => handleSort("status")}>
                    <div className="flex items-center gap-1.5">
                      Status
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3.5 cursor-pointer hover:text-safety transition-colors hidden lg:table-cell" onClick={() => handleSort("lastOrder")}>
                    <div className="flex items-center gap-1.5">
                      Last Order
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sortedCustomers.map((customer, index) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.3 }}
                    className="hover:bg-white/[0.03] transition-colors group"
                  >
                    <td className="px-4 py-3.5">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={() => toggleSelect(customer.id)}
                        className="w-4 h-4 rounded border-white/20 text-safety bg-white/5 focus:ring-safety/50 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-300 font-semibold">{customer.id}</td>
                    <td className="px-4 py-3.5">
                      <div>
                        <p className="font-medium text-white">{customer.name}</p>
                        <p className="text-[11px] text-slate-400 truncate max-w-[180px]">{customer.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-safety to-yellow-400 flex items-center justify-center text-ink font-bold text-sm">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-white">{customer.company}</p>
                          <p className="text-[11px] text-slate-400">{customer.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-slate-400" />
                        <span className="text-slate-300">{customer.city}, {customer.state}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right font-semibold text-safety">{customer.totalOrders}</td>
                    <td className="px-4 py-3.5 text-right font-semibold text-white">{customer.totalSpent}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${getStatusBadge(customer.status)}`}>
                        {customer.status === "Active" && <Activity size={11} className="text-green-400" />}
                        {customer.status === "Inactive" && <Users size={11} className="text-slate-400" />}
                        {customer.status === "New" && <Star size={11} className="text-blue-400" />}
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell text-slate-400">{customer.lastOrder}</td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-colors" title="View details">
                          <Eye size={13} />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-safety rounded hover:bg-safety/10 transition-colors" title="Edit customer">
                          <Edit size={13} />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-red-500/10 transition-colors" title="Delete customer">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {sortedCustomers.length === 0 && (
              <div className="py-12 text-center text-slate-400">
                <Search className="mx-auto mb-2 text-slate-500" size={28} />
                <p className="text-sm">No customers matching criteria found.</p>
              </div>
            )}
          </div>

          {/* Bulk Actions Bar */}
          <AnimatePresence>
            {selectedCustomers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="px-4 py-3 border-t border-white/10 flex items-center justify-between bg-white/[0.02]"
              >
                <span className="text-sm text-slate-300">{selectedCustomers.length} customer{selectedCustomers.length !== 1 ? "s" : ""} selected</span>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 border border-white/10 rounded-lg text-xs font-medium hover:bg-white/5 transition-colors flex items-center gap-1.5">
                    <Download size={12} />
                    Export
                  </button>
                  <button className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-1.5">
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
          <p className="text-sm text-slate-400">Showing {sortedCustomers.length} of {customers.length} customers</p>
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