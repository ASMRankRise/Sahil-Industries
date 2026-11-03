"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image as LucideImage,
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
  Upload,
  X,
  RotateCcw,
  Copy,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { AdminDashboardLayoutWrapper } from "@/components/AdminDashboardLayout";
import { useAdminData, GalleryImage } from "@/context/AdminDataContext";

const statusConfig = {
  active: { label: "Active", color: "bg-green-500/10 text-green-400 border border-green-500/20", icon: CheckCircle },
  draft: { label: "Draft", color: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20", icon: Clock },
  archived: { label: "Archived", color: "bg-slate-500/10 text-slate-400 border border-slate-500/20", icon: AlertCircle },
};

const categoryConfig = {
  products: { label: "Products", color: "text-blue-400 bg-blue-500/10" },
  projects: { label: "Projects", color: "text-green-400 bg-green-500/10" },
  factory: { label: "Factory", color: "text-purple-400 bg-purple-500/10" },
  team: { label: "Team", color: "text-orange-400 bg-orange-500/10" },
  events: { label: "Events", color: "text-pink-400 bg-pink-500/10" },
  other: { label: "Other", color: "text-slate-400 bg-slate-500/10" },
};

export default function GalleryPage() {
  const { galleryImages, addGalleryImage, updateGalleryImage, deleteGalleryImage, uploadImage } = useAdminData();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({ key: "date", direction: "desc" });
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingImage, setDeletingImage] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [dragActive, setDragActive] = useState(false);

  const getStatusConfig = (status: string) => statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
  const getCategoryConfig = (category: string) => categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.other;

  const filteredImages = useMemo(() => {
    return galleryImages.filter((image) => {
      const matchesSearch = image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === "all" || image.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || image.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [galleryImages, searchQuery, statusFilter, categoryFilter]);

  const sortedImages = useMemo(() => {
    return [...filteredImages].sort((a, b) => {
      const aVal = a[sortConfig.key as keyof typeof a];
      const bVal = b[sortConfig.key as keyof typeof b];
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredImages, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const toggleSelect = (id: string) => {
    setSelectedImages(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedImages.length === sortedImages.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(sortedImages.map(e => e.id));
    }
  };

  const handleDelete = (id: string) => {
    setDeletingImage(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deletingImage) {
      deleteGalleryImage(deletingImage);
      setShowDeleteModal(false);
      setDeletingImage(null);
    }
  };

  const handleStatusChange = (id: string, newStatus: GalleryImage["status"]) => {
    updateGalleryImage(id, { status: newStatus });
  };

  const handleFileUpload = async (files: FileList) => {
    const fileArray = Array.from(files);
    for (const file of fileArray) {
      if (!file.type.startsWith("image/")) continue;
      
      const id = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setUploadProgress(prev => ({ ...prev, [id]: 0 }));
      
      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const current = prev[id] || 0;
            if (current >= 90) {
              clearInterval(progressInterval);
              return prev;
            }
            return { ...prev, [id]: current + 10 };
          });
        }, 100);

        const result = await uploadImage(file, {
          title: file.name.replace(/\.[^/.]+$/, ""),
          category: "products",
          status: "draft",
        });

        clearInterval(progressInterval);
        setUploadProgress(prev => ({ ...prev, [id]: 100 }));
        
        setTimeout(() => {
          setUploadProgress(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
          });
        }, 500);
      } catch (error) {
        console.error("Upload failed:", error);
        setUploadProgress(prev => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "/media/placeholder-image.svg";
  };

  return (
    <AdminDashboardLayoutWrapper 
      activeNav="/admin/gallery" 
      pageTitle="Gallery Management" 
      pageDescription="Upload, organize and manage gallery images for products, projects and factory"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-safety bg-clip-text text-transparent">Gallery</h2>
            <p className="text-slate-400 mt-1">Upload, organize and manage gallery images</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-safety to-yellow-400 text-ink rounded-lg text-sm font-semibold hover:brightness-105 transition-all shadow-sm shadow-safety/20"
            >
              <Upload size={14} />
              Upload Images
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors group">
              <Download size={14} className="group-hover:text-safety transition-colors" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Images", value: galleryImages.length, icon: LucideImage, color: "text-blue-400", bgColor: "bg-blue-500/10" },
            { label: "Active", value: galleryImages.filter(i => i.status === "active").length, icon: CheckCircle, color: "text-green-400", bgColor: "bg-green-500/10" },
            { label: "Draft", value: galleryImages.filter(i => i.status === "draft").length, icon: Clock, color: "text-yellow-400", bgColor: "bg-yellow-500/10" },
            { label: "Archived", value: galleryImages.filter(i => i.status === "archived").length, icon: AlertCircle, color: "text-slate-400", bgColor: "bg-slate-500/10" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-surface border border-white/10 rounded-2xl p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${stat.bgColor} ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="bg-surface border border-white/10 rounded-2xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="search"
                placeholder="Search images, titles, tags..."
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
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="h-10 pl-9 pr-8 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-safety/50 appearance-none cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="products">Products</option>
                  <option value="projects">Projects</option>
                  <option value="factory">Factory</option>
                  <option value="team">Team</option>
                  <option value="events">Events</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Drop Zone */}
        <div
          className={`bg-surface border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
            dragActive ? "border-safety/50 bg-safety/5" : "border-white/10 hover:border-white/20"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="gallery-upload"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          />
          <label htmlFor="gallery-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-4">
              <div className={`h-16 w-16 rounded-2xl flex items-center justify-center transition-colors ${
                dragActive ? "bg-safety/20 text-safety" : "bg-white/5 text-slate-400"
              }`}>
                <Upload size={32} />
              </div>
              <div>
                <p className="text-lg font-semibold text-white">Drag & drop images here</p>
                <p className="text-sm text-slate-400 mt-1">or click to browse files</p>
                <p className="text-xs text-slate-500 mt-2">Supports: JPG, PNG, WebP, GIF • Max 10MB per file</p>
              </div>
            </div>
          </label>
          
          {/* Upload Progress */}
          {Object.keys(uploadProgress).length > 0 && (
            <div className="mt-6 space-y-3">
              {Object.entries(uploadProgress).map(([id, progress]) => (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white/5 border border-white/10 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">Uploading...</span>
                    <span className="text-sm text-slate-400">{progress}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-gradient-to-r from-safety to-yellow-400 rounded-full transition-all duration-300"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Gallery Grid */}
        <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden">
          {sortedImages.length === 0 ? (
            <div className="py-16 text-center">
              <LucideImage className="mx-auto mb-4 text-slate-500" size={48} />
              <h3 className="text-lg font-semibold text-white mb-2">No images found</h3>
              <p className="text-slate-400">Upload your first image to get started</p>
            </div>
          ) : (
            <>
              {/* Grid View */}
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {sortedImages.map((image, index) => (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.03, duration: 0.2 }}
                      className="group relative bg-white/5 border border-white/10 rounded-xl overflow-hidden transition-all hover:border-safety/30"
                    >
                      {/* Image */}
                      <div className="aspect-[4/3] relative overflow-hidden">
                        <img
                          src={image.url}
                          alt={image.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          onError={handleImageError}
                        />
                        
                        {/* Status Badge */}
                        <div className="absolute top-2 left-2">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusConfig(image.status).color}`}>
                            {getStatusConfig(image.status).label}
                          </span>
                        </div>
                        
                        {/* Category Badge */}
                        <div className="absolute top-2 right-2">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${getCategoryConfig(image.category).color}`}>
                            {getCategoryConfig(image.category).label}
                          </span>
                        </div>
                        
                        {/* Hover Actions */}
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={() => setShowEditModal(image.id)}
                            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(image.id)}
                            className="p-2 bg-white/10 hover:bg-red-500/20 hover:text-red-400 text-white rounded-lg backdrop-blur-sm transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      {/* Image Info */}
                      <div className="p-3 space-y-2">
                        <h4 className="font-semibold text-white truncate">{image.title}</h4>
                        <p className="text-xs text-slate-400 truncate">{image.description || "No description"}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {image.tags?.slice(0, 3).map((tag) => (
                            <span key={tag} className="px-2 py-0.5 bg-white/5 text-[10px] text-slate-300 rounded">{tag}</span>
                          ))}
                          {image.tags && image.tags.length > 3 && (
                            <span className="px-2 py-0.5 bg-white/5 text-[10px] text-slate-500 rounded">+{image.tags.length - 3}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          <span className="text-[10px] text-slate-500">{new Date(image.date).toLocaleDateString()}</span>
                          <span className="text-[10px] text-slate-500">{(image.size / 1024).toFixed(1)} KB</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <h3 className="text-lg font-bold text-white">Upload Images</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-5">
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    dragActive ? "border-safety/50 bg-safety/5" : "border-white/10"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="gallery-upload-modal"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  />
                  <label htmlFor="gallery-upload-modal" className="cursor-pointer">
                    <Upload className="mx-auto mb-3 text-slate-400" size={32} />
                    <p className="text-white mb-1">Drag & drop images here</p>
                    <p className="text-sm text-slate-400">or click to browse</p>
                    <p className="text-xs text-slate-500 mt-2">JPG, PNG, WebP, GIF • Max 10MB each</p>
                  </label>
                </div>
                
                {/* Upload Progress in Modal */}
                {Object.keys(uploadProgress).length > 0 && (
                  <div className="mt-4 space-y-3 max-h-64 overflow-y-auto">
                    {Object.entries(uploadProgress).map(([id, progress]) => (
                      <motion.div
                        key={id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white/5 border border-white/10 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-white">Uploading...</span>
                          <span className="text-sm text-slate-400">{progress}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-gradient-to-r from-safety to-yellow-400 rounded-full transition-all duration-300"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-end gap-3 p-5 border-t border-white/10">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowEditModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <h3 className="text-lg font-bold text-white">Edit Image</h3>
                <button
                  onClick={() => setShowEditModal(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-5">
                <EditImageForm 
                  image={galleryImages.find(i => i.id === showEditModal)!} 
                  onClose={() => setShowEditModal(null)}
                  onSave={(data) => updateGalleryImage(showEditModal!, data)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface border border-white/10 rounded-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 text-center">
                <div className="h-14 w-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="text-red-400" size={28} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Delete Image</h3>
                <p className="text-slate-400 mb-6">Are you sure you want to delete this image? This action cannot be undone.</p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminDashboardLayoutWrapper>
  );
}

// Edit Image Form Component
function EditImageForm({ image, onClose, onSave }: { image: GalleryImage; onClose: () => void; onSave: (data: Partial<GalleryImage>) => void }) {
  const [title, setTitle] = useState(image.title);
  const [description, setDescription] = useState(image.description || "");
  const [category, setCategory] = useState(image.category);
  const [status, setStatus] = useState(image.status);
  const [tags, setTags] = useState(image.tags?.join(", ") || "");
  const [altText, setAltText] = useState(image.altText || "");
  const [isFeatured, setIsFeatured] = useState(image.isFeatured || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      description,
      category,
      status,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      altText,
      isFeatured,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-10 px-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:border-safety/50 focus:bg-white/10 transition-all"
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:border-safety/50 focus:bg-white/10 transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
          <select
            value={category}
                    onChange={(e) => setCategory(e.target.value as GalleryImage["category"])}
            className="w-full h-10 px-4 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-safety/50 appearance-none cursor-pointer"
          >
            <option value="products">Products</option>
            <option value="projects">Projects</option>
            <option value="factory">Factory</option>
            <option value="team">Team</option>
            <option value="events">Events</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
          <select
            value={status}
                    onChange={(e) => setStatus(e.target.value as GalleryImage["status"])}
            className="w-full h-10 px-4 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-safety/50 appearance-none cursor-pointer"
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1">Tags (comma separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full h-10 px-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:border-safety/50 focus:bg-white/10 transition-all"
            placeholder="crane, factory, heavy machinery, installation"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1">Alt Text (for SEO)</label>
          <input
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            className="w-full h-10 px-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:border-safety/50 focus:bg-white/10 transition-all"
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-white/5 text-safety focus:ring-safety"
            />
            <span className="text-sm text-slate-300">Featured Image</span>
          </label>
        </div>

        {/* Current Image Preview */}
        <div className="md:col-span-2 pt-4 border-t border-white/10">
          <label className="block text-sm font-medium text-slate-300 mb-2">Current Image</label>
          <div className="aspect-[4/3] max-w-xs rounded-lg overflow-hidden border border-white/10">
            <img src={image.url} alt={image.title} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-safety to-yellow-400 text-ink rounded-lg text-sm font-semibold hover:brightness-105 transition-all shadow-sm shadow-safety/20"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}