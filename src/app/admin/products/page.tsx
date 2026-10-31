"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
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
  Truck,
  Package,
  Zap,
  Wrench,
  Settings,
  AlertCircle,
  X,
  Image as LucideImage,
} from "lucide-react";
import Link from "next/link";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";

const products = [
  { id: "PRD-001", name: "Single Girder EOT Crane", category: "EOT Cranes", sku: "SG-EOT-001", price: "₹2,45,000", stock: 15, minStock: 5, status: "Active", description: "Heavy-duty single girder overhead crane for industrial applications", image: "products/single-girder-eot-crane.jpg" },
  { id: "PRD-002", name: "Double Girder EOT Crane", category: "EOT Cranes", sku: "DG-EOT-002", price: "₹4,80,000", stock: 8, minStock: 3, status: "Active", description: "High-capacity double girder crane for heavy manufacturing", image: "products/double-girder-eot-crane.jpg" },
  { id: "PRD-003", name: "Electric Wire Rope Hoist", category: "Hoists", sku: "EWRH-003", price: "₹85,000", stock: 25, minStock: 10, status: "Active", description: "Precision electric hoist for material handling operations", image: "products/electric-wire-rope-hoist.jpg" },
  { id: "PRD-004", name: "Goliath Gantry Crane", category: "Gantry Cranes", sku: "GGC-004", price: "₹12,50,000", stock: 3, minStock: 2, status: "Active", description: "Outdoor gantry crane for shipyard and construction sites", image: "products/goliath-gantry-crane.jpg" },
  { id: "PRD-005", name: "JIB Crane", category: "JIB Cranes", sku: "JIB-005", price: "₹1,20,000", stock: 12, minStock: 5, status: "Active", description: "Articulating jib crane for workshop and assembly lines", image: "products/jib-crane.jpg" },
  { id: "PRD-006", name: "Monorail Crane", category: "Monorail Systems", sku: "MRC-006", price: "₹6,75,000", stock: 6, minStock: 3, status: "Active", description: "Single-track monorail system for linear material transport", image: "products/monorail-crane.jpg" },
  { id: "PRD-007", name: "Underslung Crane", category: "Underslung Cranes", sku: "USC-007", price: "₹3,10,000", stock: 9, minStock: 4, status: "Active", description: "Under-running crane system for low headroom applications", image: "products/underslung-cranes.jpg" },
  { id: "PRD-008", name: "Electric Chain Hoist", category: "Hoists", sku: "ECH-008", price: "₹45,000", stock: 30, minStock: 15, status: "Active", description: "Compact electric chain hoist for light duty applications", image: "products/electric-wire-rope-hoist.jpg" },
  { id: "PRD-009", name: "Semi-Goliath Crane", category: "Gantry Cranes", sku: "SGC-009", price: "₹8,90,000", stock: 4, minStock: 2, status: "Low Stock", description: "Semi-gantry crane for medium duty outdoor applications", image: "products/goliath-gantry-crane.jpg" },
  { id: "PRD-010", name: "Wall Mounted JIB Crane", category: "JIB Cranes", sku: "WMJ-010", price: "₹95,000", stock: 0, minStock: 3, status: "Out of Stock", description: "Wall-mounted articulating jib crane for confined spaces", image: "products/jib-crane.jpg" },
];

const categories = ["All", "EOT Cranes", "Gantry Cranes", "JIB Cranes", "Hoists", "Monorail Systems", "Underslung Cranes"];

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({ key: "name", direction: "asc" });
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || product.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
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
    setSelectedProducts(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === sortedProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(sortedProducts.map(p => p.id));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-500/10 text-green-400 border border-green-500/20";
      case "Low Stock": return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
      case "Out of Stock": return "bg-red-500/10 text-red-400 border border-red-500/20";
      default: return "bg-white/10 text-white border border-white/20";
    }
  };

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0) return { label: "Out of Stock", className: "bg-red-500/10 text-red-400 border border-red-500/20" };
    if (stock <= minStock) return { label: "Low Stock", className: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" };
    return { label: "In Stock", className: "bg-green-500/10 text-green-400 border border-green-500/20" };
  };

  return (
    <AdminDashboardLayout activeNav="/admin/products" pageTitle="Products" pageDescription="Manage crane products, inventory, and catalog">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-safety bg-clip-text text-transparent">Products</h2>
            <p className="text-slate-400 mt-1">Manage crane products, inventory, and catalog</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/admin/products/new" className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-safety to-yellow-400 text-ink rounded-lg text-sm font-semibold hover:brightness-105 transition-all shadow-sm shadow-safety/20">
              <Plus size={14} />
              Add Product
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
                placeholder="Search products, SKU, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-safety/50 focus:bg-white/10 transition-all"
              />
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="h-10 pl-9 pr-8 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-safety/50 appearance-none cursor-pointer"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 pl-9 pr-8 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-safety/50 appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setViewMode("table")} className={`p-2 rounded-lg transition-colors ${viewMode === "table" ? "bg-safety/10 text-safety" : "text-slate-400 hover:bg-white/5"}`} title="Table View">
                  <Package size={16} />
                </button>
                <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-safety/10 text-safety" : "text-slate-400 hover:bg-white/5"}`} title="Grid View">
                  <LucideImage size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table View */}
        <AnimatePresence mode="wait">
          {viewMode === "table" && (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm min-w-[1000px]">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold bg-white/[0.02]">
                        <th className="px-4 py-3.5 w-12">
                          <input
                            type="checkbox"
                            checked={selectedProducts.length === sortedProducts.length && sortedProducts.length > 0}
                            onChange={toggleSelectAll}
                            className="w-4 h-4 rounded border-white/20 text-safety bg-white/5 focus:ring-safety/50 cursor-pointer"
                          />
                        </th>
                        <th className="px-4 py-3.5 cursor-pointer hover:text-safety transition-colors" onClick={() => handleSort("name")}>
                          <div className="flex items-center gap-1.5">
                            Product
                            <ArrowUpDown size={12} className="text-slate-400" />
                          </div>
                        </th>
                        <th className="px-4 py-3.5 cursor-pointer hover:text-safety transition-colors" onClick={() => handleSort("category")}>
                          <div className="flex items-center gap-1.5">
                            Category
                            <ArrowUpDown size={12} className="text-slate-400" />
                          </div>
                        </th>
                        <th className="px-4 py-3.5 cursor-pointer hover:text-safety transition-colors" onClick={() => handleSort("sku")}>
                          <div className="flex items-center gap-1.5">
                            SKU
                            <ArrowUpDown size={12} className="text-slate-400" />
                          </div>
                        </th>
                        <th className="px-4 py-3.5 cursor-pointer hover:text-safety transition-colors text-right" onClick={() => handleSort("price")}>
                          <div className="flex items-center gap-1.5 justify-end">
                            Price
                            <ArrowUpDown size={12} className="text-slate-400" />
                          </div>
                        </th>
                        <th className="px-4 py-3.5 cursor-pointer hover:text-safety transition-colors text-right" onClick={() => handleSort("stock")}>
                          <div className="flex items-center gap-1.5 justify-end">
                            Stock
                            <ArrowUpDown size={12} className="text-slate-400" />
                          </div>
                        </th>
                        <th className="px-4 py-3.5 cursor-pointer hover:text-safety transition-colors" onClick={() => handleSort("status")}>
                          <div className="flex items-center gap-1.5">
                            Status
                            <ArrowUpDown size={12} className="text-slate-400" />
                          </div>
                        </th>
                        <th className="px-4 py-3.5 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {sortedProducts.map((product, index) => (
                        <motion.tr
                          key={product.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03, duration: 0.3 }}
                          className="hover:bg-white/[0.03] transition-colors group"
                        >
                          <td className="px-4 py-3.5">
                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(product.id)}
                              onChange={() => toggleSelect(product.id)}
                              className="w-4 h-4 rounded border-white/20 text-safety bg-white/5 focus:ring-safety/50 cursor-pointer"
                            />
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-black/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                                <img src={`/sahilcrane/${product.image}`} alt={product.name} className="h-full w-full object-cover" />
                              </div>
                              <div>
                                <p className="font-medium text-white">{product.name}</p>
                                <p className="text-[11px] text-slate-400 font-mono">{product.sku}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="px-2 py-1 text-[11px] font-medium rounded-full bg-white/5 text-slate-300">{product.category}</span>
                          </td>
                          <td className="px-4 py-3.5 font-mono text-slate-300">{product.sku}</td>
                          <td className="px-4 py-3.5 text-right font-semibold text-white">{product.price}</td>
                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${getStockStatus(product.stock, product.minStock).className}`}>
                                {getStockStatus(product.stock, product.minStock).label}
                              </span>
                              <span className="text-sm font-mono text-slate-300">{product.stock}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${getStatusBadge(product.status)}`}>
                              {product.status === "Active" && <Package size={11} className="text-green-400" />}
                              {product.status === "Low Stock" && <AlertCircle size={11} className="text-yellow-400" />}
                              {product.status === "Out of Stock" && <X size={11} className="text-red-400" />}
                              {product.status}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-colors" title="View details">
                                <Eye size={13} />
                              </button>
                              <button className="p-1.5 text-slate-400 hover:text-safety rounded hover:bg-safety/10 transition-colors" title="Edit product">
                                <Edit size={13} />
                              </button>
                              <button className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-red-500/10 transition-colors" title="Delete product">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                  {sortedProducts.length === 0 && (
                    <div className="py-12 text-center text-slate-400">
                      <Search className="mx-auto mb-2 text-slate-500" size={28} />
                      <p className="text-sm">No products matching criteria found.</p>
                    </div>
                  )}
                </div>

                {/* Bulk Actions Bar */}
                <AnimatePresence>
                  {selectedProducts.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="px-4 py-3 border-t border-white/10 flex items-center justify-between bg-white/[0.02]"
                    >
                      <span className="text-sm text-slate-300">{selectedProducts.length} product{selectedProducts.length !== 1 ? "s" : ""} selected</span>
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid View */}
        <AnimatePresence mode="wait">
          {viewMode === "grid" && (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {sortedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    whileHover={{ y: -4 }}
                    className="bg-surface border border-white/10 rounded-2xl overflow-hidden group"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={`/sahilcrane/${product.image}`}
                        alt={product.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-white/10 text-white backdrop-blur-sm">{product.category}</span>
                        <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${getStatusBadge(product.status)}`}>
                          {product.status}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex gap-2">
                          <button className="p-2 bg-black/50 hover:bg-black/80 text-white rounded-lg transition-colors backdrop-blur-sm" title="View">
                            <Eye size={13} />
                          </button>
                          <button className="p-2 bg-black/50 hover:bg-black/80 text-white rounded-lg transition-colors backdrop-blur-sm" title="Edit">
                            <Edit size={13} />
                          </button>
                        </div>
                        <button className="p-2 bg-black/50 hover:bg-red-500/50 hover:text-red-400 transition-colors backdrop-blur-sm" title="Delete">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white truncate">{product.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{product.sku}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium ${getStatusBadge(product.status)}`}>
                          {product.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 line-clamp-2 mb-3">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-white">{product.price}</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium ${getStockStatus(product.stock, product.minStock).className}`}>
                            {getStockStatus(product.stock, product.minStock).label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors" title="View">
                            <Eye size={14} />
                          </button>
                          <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-safety transition-colors" title="Edit">
                            <Edit size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              {sortedProducts.length === 0 && (
                <div className="py-12 text-center text-slate-400 col-span-full">
                  <Search className="mx-auto mb-2 text-slate-500" size={28} />
                  <p className="text-sm">No products matching criteria found.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">Showing {sortedProducts.length} of {products.length} products</p>
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