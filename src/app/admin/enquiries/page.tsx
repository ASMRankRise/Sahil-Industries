"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
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
  Reply,
  Flag,
} from "lucide-react";
import Link from "next/link";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";

const statusConfig = {
  New: { label: "New", color: "bg-blue-500/10 text-blue-400 border border-blue-500/20", icon: Mail },
  "In Progress": { label: "In Progress", color: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20", icon: Loader2 },
  Replied: { label: "Replied", color: "bg-green-500/10 text-green-400 border border-green-500/20", icon: CheckCircle },
  Closed: { label: "Closed", color: "bg-slate-500/10 text-slate-400 border border-slate-500/20", icon: AlertCircle },
};

const enquiries = [
  { id: "ENQ-001", customer: "Rajesh Kumar", email: "rajesh@company.com", phone: "+91 98765 43210", subject: "Single Girder EOT Crane Inquiry", message: "Need pricing for 10-ton capacity crane for our new facility", status: "New", date: "2024-01-15", priority: "high" },
  { id: "ENQ-002", customer: "Priya Sharma", email: "priya@industries.in", phone: "+91 98765 43211", subject: "Double Girder EOT Crane Quote", message: "Requesting quote for 20-ton double girder crane with 15m span", status: "In Progress", date: "2024-01-14", priority: "high" },
  { id: "ENQ-003", customer: "Amit Patel", email: "amit@manufacturing.com", phone: "+91 98765 43212", subject: "Electric Wire Rope Hoist", message: "Looking for 5-ton electric hoist for warehouse operations", status: "Replied", date: "2024-01-13", priority: "medium" },
  { id: "ENQ-004", customer: "Suresh Reddy", email: "suresh@engineering.co", phone: "+91 98765 43213", subject: "JIB Crane Specification", message: "Need technical specs for 3-ton articulating jib crane", status: "New", date: "2024-01-12", priority: "low" },
  { id: "ENQ-005", customer: "Neha Singh", email: "neha@construction.in", phone: "+91 98765 43214", subject: "Underslung Crane Quote", message: "Requesting quote for 2-ton underslung crane system", status: "Closed", date: "2024-01-11", priority: "medium" },
  { id: "ENQ-006", customer: "Vikram Singh", email: "vikram@steelworks.com", phone: "+91 98765 43215", subject: "Goliath Gantry Crane", message: "Need 50-ton gantry crane for shipyard project", status: "In Progress", date: "2024-01-10", priority: "high" },
  { id: "ENQ-007", customer: "Anita Desai", email: "anita@powergen.in", phone: "+91 98765 43216", subject: "Monorail Crane System", message: "Looking for monorail system for production line", status: "Replied", date: "2024-01-09", priority: "medium" },
  { id: "ENQ-008", customer: "Rohit Gupta", email: "rohit@infrabuild.com", phone: "+91 98765 43217", subject: "Custom Crane Solution", message: "Need custom crane for specialized application", status: "New", date: "2024-01-08", priority: "high" },
];

export default function EnquiriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({ key: "date", direction: "desc" });
  const [selectedEnquiries, setSelectedEnquiries] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingEnquiry, setDeletingEnquiry] = useState<string | null>(null);

  const getStatusConfig = (status: string) => statusConfig[status as keyof typeof statusConfig] || statusConfig.New;

  const filteredEnquiries = enquiries.filter((enquiry) => {
    const matchesSearch = enquiry.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || enquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedEnquiries = [...filteredEnquiries].sort((a, b) => {
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
    setSelectedEnquiries(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedEnquiries.length === sortedEnquiries.length) {
      setSelectedEnquiries([]);
    } else {
      setSelectedEnquiries(sortedEnquiries.map(e => e.id));
    }
  };

  const handleDelete = (id: string) => {
    setDeletingEnquiry(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deletingEnquiry) {
      setShowDeleteModal(false);
      setDeletingEnquiry(null);
    }
  };

  return (
    <AdminDashboardLayout activeNav="/admin/enquiries" pageTitle="Enquiries" pageDescription="Manage and respond to customer enquiries and quotation requests">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-safety bg-clip-text text-transparent">Enquiries</h2>
            <p className="text-slate-400 mt-1">Manage and respond to customer enquiries and quotation requests</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-safety to-yellow-400 text-ink rounded-lg text-sm font-semibold hover:brightness-105 transition-all shadow-sm shadow-safety/20">
              <Plus size={14} />
              New Enquiry
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
                placeholder="Search enquiries, customers, subjects..."
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
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Replied">Replied</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Enquiries Table */}
        <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[800px]">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold bg-white/[0.02]">
                  <th className="px-4 py-3.5 w-12">
                    <input
                      type="checkbox"
                      checked={selectedEnquiries.length === sortedEnquiries.length && sortedEnquiries.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-white/20 text-safety bg-white/5 focus:ring-safety/50 cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3.5 cursor-pointer hover:text-safety transition-colors" onClick={() => handleSort("id")}>
                    <div className="flex items-center gap-1.5">
                      Enquiry ID
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3.5 cursor-pointer hover:text-safety transition-colors" onClick={() => handleSort("customer")}>
                    <div className="flex items-center gap-1.5">
                      Customer
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3.5 cursor-pointer hover:text-safety transition-colors hidden md:table-cell" onClick={() => handleSort("subject")}>
                    <div className="flex items-center gap-1.5">
                      Subject
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
                {sortedEnquiries.map((enquiry, index) => {
                  const status = getStatusConfig(enquiry.status);
                  const StatusIcon = status.icon;
                  return (
                    <motion.tr
                      key={enquiry.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03, duration: 0.3 }}
                      className="hover:bg-white/[0.03] transition-colors group"
                    >
                      <td className="px-4 py-3.5">
                        <input
                          type="checkbox"
                          checked={selectedEnquiries.includes(enquiry.id)}
                          onChange={() => toggleSelect(enquiry.id)}
                          className="w-4 h-4 rounded border-white/20 text-safety bg-white/5 focus:ring-safety/50 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-300 font-semibold">{enquiry.id}</td>
                      <td className="px-4 py-3.5">
                        <div>
                          <p className="font-medium text-white">{enquiry.customer}</p>
                          <p className="text-[11px] text-slate-400 truncate max-w-[180px]">{enquiry.email}</p>
                          <p className="text-[11px] text-slate-500">{enquiry.phone}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell text-slate-300 max-w-[250px] truncate">{enquiry.subject}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${status.color}`}>
                          <StatusIcon size={11} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell text-slate-400">{enquiry.date}</td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-colors" title="View details">
                            <Eye size={13} />
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-blue-400 rounded hover:bg-blue-500/10 transition-colors" title="Reply">
                            <Reply size={13} />
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-red-500/10 transition-colors" title="Delete enquiry" onClick={() => handleDelete(enquiry.id)}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
            {sortedEnquiries.length === 0 && (
              <div className="py-12 text-center text-slate-400">
                <Search className="mx-auto mb-2 text-slate-500" size={28} />
                <p className="text-sm">No enquiries matching criteria found.</p>
              </div>
            )}
          </div>

          {/* Bulk Actions Bar */}
          <AnimatePresence>
            {selectedEnquiries.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="px-4 py-3 border-t border-white/10 flex items-center justify-between bg-white/[0.02]"
              >
                <span className="text-sm text-slate-300">{selectedEnquiries.length} enquir{selectedEnquiries.length !== 1 ? "ies" : "y"} selected</span>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 border border-white/10 rounded-lg text-xs font-medium hover:bg-white/5 transition-colors flex items-center gap-1.5">
                    <Flag size={12} />
                    Mark Read
                  </button>
                  <button className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-1.5" onClick={() => handleDelete(selectedEnquiries[0])}>
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
          <p className="text-sm text-slate-400">Showing {sortedEnquiries.length} of {enquiries.length} enquiries</p>
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