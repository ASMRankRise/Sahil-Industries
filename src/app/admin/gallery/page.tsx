"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
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
  Check,
  Minus,
  Image as LucideImageIcon,
  Replace,
  Layers,
  Tag,
  Archive,
  RefreshCw,
  GripVertical,
} from "lucide-react";
import Link from "next/link";
import { AdminDashboardLayoutWrapper } from "@/components/AdminDashboardLayout";
import { useAdminData, GalleryImage } from "@/context/AdminDataContext";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const statusConfig = {
  active: {
    label: "Active",
    color: "bg-green-500/10 text-green-400 border border-green-500/20",
    icon: CheckCircle,
  },
  draft: {
    label: "Draft",
    color: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    icon: Clock,
  },
  archived: {
    label: "Archived",
    color: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
    icon: AlertCircle,
  },
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
  const {
    galleryImages,
    addGalleryImage,
    updateGalleryImage,
    deleteGalleryImage,
    uploadImage,
  } = useAdminData();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({ key: "date", direction: "desc" });
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingImage, setDeletingImage] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<string | null>(null);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const [showReplaceImageModal, setShowReplaceImageModal] = useState<
    string | null
  >(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {},
  );
  const [dragActive, setDragActive] = useState(false);
  const [bulkEditData, setBulkEditData] = useState<Partial<GalleryImage>>({});
  const [replaceImageFile, setReplaceImageFile] = useState<File | null>(null);
  const [replaceImageProgress, setReplaceImageProgress] = useState<number>(0);

  const getStatusConfig = (status: string) =>
    statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
  const getCategoryConfig = (category: string) =>
    categoryConfig[category as keyof typeof categoryConfig] ||
    categoryConfig.other;

  const filteredImages = useMemo(() => {
    return galleryImages.filter((image) => {
      const matchesSearch =
        image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.tags?.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      const matchesStatus =
        statusFilter === "all" || image.status === statusFilter;
      const matchesCategory =
        categoryFilter === "all" || image.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [galleryImages, searchQuery, statusFilter, categoryFilter]);

  const sortedImages = useMemo(() => {
    return [...filteredImages].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [filteredImages]);

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Drag and Drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = sortedImages.findIndex((img) => img.id === active.id);
        const newIndex = sortedImages.findIndex((img) => img.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const newImages = arrayMove(sortedImages, oldIndex, newIndex);

          // Update order for all affected images
          newImages.forEach((image, index) => {
            if (image.order !== index + 1) {
              updateGalleryImage(image.id, { order: index + 1 });
            }
          });
        }
      }
    },
    [sortedImages, updateGalleryImage],
  );

  const toggleSelect = (id: string) => {
    setSelectedImages((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedImages.length === sortedImages.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(sortedImages.map((e) => e.id));
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

  const handleStatusChange = (
    id: string,
    newStatus: GalleryImage["status"],
  ) => {
    updateGalleryImage(id, { status: newStatus });
  };

  const handleFileUpload = async (files: FileList) => {
    const fileArray = Array.from(files);
    for (const file of fileArray) {
      if (!file.type.startsWith("image/")) continue;

      const id = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setUploadProgress((prev) => ({ ...prev, [id]: 0 }));

      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
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
        setUploadProgress((prev) => ({ ...prev, [id]: 100 }));

        setTimeout(() => {
          setUploadProgress((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
          });
        }, 500);
      } catch (error) {
        console.error("Upload failed:", error);
        setUploadProgress((prev) => {
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

  // Placeholder image data URI (1x1 transparent pixel with fallback styling)
  const PLACEHOLDER_IMAGE =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%231e293b'/%3E%3Ctext x='200' y='140' font-family='system-ui, sans-serif' font-size='16' fill='%2364748b' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3Ctext x='200' y='165' font-family='system-ui, sans-serif' font-size='12' fill='%23475569' text-anchor='middle' dominant-baseline='middle'%3EImage not available%3C/text%3E%3C/svg%3E";

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = PLACEHOLDER_IMAGE;
  };

  // Bulk Operations
  const handleBulkStatusChange = useCallback(
    (status: GalleryImage["status"]) => {
      selectedImages.forEach((id) => {
        updateGalleryImage(id, { status });
      });
      setSelectedImages([]);
    },
    [selectedImages, updateGalleryImage],
  );

  const handleBulkCategoryChange = useCallback(
    (category: GalleryImage["category"]) => {
      selectedImages.forEach((id) => {
        updateGalleryImage(id, { category });
      });
      setSelectedImages([]);
    },
    [selectedImages, updateGalleryImage],
  );

  const handleBulkArchive = useCallback(() => {
    selectedImages.forEach((id) => {
      updateGalleryImage(id, { status: "archived" });
    });
    setSelectedImages([]);
  }, [selectedImages, updateGalleryImage]);

  const handleBulkDelete = useCallback(() => {
    selectedImages.forEach((id) => {
      deleteGalleryImage(id);
    });
    setSelectedImages([]);
    setShowDeleteModal(false);
  }, [selectedImages, deleteGalleryImage]);

  const handleBulkTagAdd = useCallback(
    (tags: string[]) => {
      selectedImages.forEach((id) => {
        const image = galleryImages.find((img) => img.id === id);
        if (image) {
          const existingTags = image.tags || [];
          const newTags = [...new Set([...existingTags, ...tags])];
          updateGalleryImage(id, { tags: newTags });
        }
      });
      setSelectedImages([]);
    },
    [selectedImages, galleryImages, updateGalleryImage],
  );

  const handleBulkTagRemove = useCallback(
    (tags: string[]) => {
      selectedImages.forEach((id) => {
        const image = galleryImages.find((img) => img.id === id);
        if (image) {
          const newTags = (image.tags || []).filter(
            (tag) => !tags.includes(tag),
          );
          updateGalleryImage(id, { tags: newTags });
        }
      });
      setSelectedImages([]);
    },
    [selectedImages, galleryImages, updateGalleryImage],
  );

  const openBulkEditModal = useCallback(() => {
    if (selectedImages.length > 0) {
      setShowBulkEditModal(true);
    }
  }, [selectedImages.length]);

  const handleBulkEditSave = useCallback(() => {
    selectedImages.forEach((id) => {
      updateGalleryImage(id, bulkEditData);
    });
    setShowBulkEditModal(false);
    setBulkEditData({});
    setSelectedImages([]);
  }, [selectedImages, bulkEditData, updateGalleryImage]);

  const openReplaceImageModal = useCallback((imageId: string) => {
    setShowReplaceImageModal(imageId);
    setReplaceImageFile(null);
    setReplaceImageProgress(0);
  }, []);

  const handleReplaceImage = useCallback(
    async (imageId: string, file: File) => {
      setReplaceImageProgress(0);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setReplaceImageProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);

      try {
        const url = URL.createObjectURL(file);

        clearInterval(progressInterval);
        setReplaceImageProgress(100);

        updateGalleryImage(imageId, {
          url,
          thumbnailUrl: url,
          title: file.name.replace(/\.[^/.]+$/, ""),
          size: file.size,
        });

        setTimeout(() => {
          setShowReplaceImageModal(null);
          setReplaceImageFile(null);
          setReplaceImageProgress(0);
        }, 500);
      } catch (error) {
        console.error("Replace image failed:", error);
        clearInterval(progressInterval);
        setReplaceImageProgress(0);
      }
    },
    [updateGalleryImage],
  );

  const getAllTags = useCallback(() => {
    const allTags = new Set<string>();
    galleryImages.forEach((img) => {
      img.tags?.forEach((tag) => allTags.add(tag));
    });
    return Array.from(allTags).sort();
  }, [galleryImages]);

  return (
    <AdminDashboardLayoutWrapper
      activeNav="/admin/gallery"
      pageTitle="Gallery Management"
      pageDescription="Upload, organize and manage gallery images for products, projects and factory">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-safety bg-clip-text text-transparent">
              Gallery
            </h2>
            <p className="text-slate-400 mt-1">
              Upload, organize and manage gallery images
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-safety to-yellow-400 text-ink rounded-lg text-sm font-semibold hover:brightness-105 transition-all shadow-sm shadow-safety/20">
              <Upload size={14} />
              Upload Images
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors group">
              <Download
                size={14}
                className="group-hover:text-safety transition-colors"
              />
              Export
            </button>
          </div>
        </div>

        {/* Batch Operations Toolbar */}
        {selectedImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="bg-surface border border-safety/30 rounded-2xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-safety">
                  {selectedImages.length} image
                  {selectedImages.length > 1 ? "s" : ""} selected
                </span>
                <button
                  onClick={() => setSelectedImages([])}
                  className="text-sm text-slate-400 hover:text-white transition-colors">
                  Clear selection
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <select
                    defaultValue=""
                    onChange={(e) =>
                      e.target.value &&
                      handleBulkStatusChange(
                        e.target.value as GalleryImage["status"],
                      )
                    }
                    className="h-9 pl-3 pr-8 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-safety/50 appearance-none cursor-pointer">
                    <option value="" disabled>
                      Change Status
                    </option>
                    <option value="active">Set Active</option>
                    <option value="draft">Set Draft</option>
                    <option value="archived">Archive</option>
                  </select>
                  <ChevronRight
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                    size={14}
                  />
                </div>
                <div className="relative">
                  <select
                    defaultValue=""
                    onChange={(e) =>
                      e.target.value &&
                      handleBulkCategoryChange(
                        e.target.value as GalleryImage["category"],
                      )
                    }
                    className="h-9 pl-3 pr-8 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-safety/50 appearance-none cursor-pointer">
                    <option value="" disabled>
                      Change Category
                    </option>
                    <option value="products">Products</option>
                    <option value="projects">Projects</option>
                    <option value="factory">Factory</option>
                    <option value="team">Team</option>
                    <option value="events">Events</option>
                    <option value="other">Other</option>
                  </select>
                  <ChevronRight
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                    size={14}
                  />
                </div>
                <button
                  onClick={openBulkEditModal}
                  className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">
                  <Edit size={14} />
                  Bulk Edit
                </button>
                <button
                  onClick={handleBulkArchive}
                  className="flex items-center gap-2 px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-lg text-sm font-medium hover:bg-yellow-500/20 transition-colors">
                  <Archive size={14} />
                  Archive
                </button>
                <button
                  onClick={() => {
                    setDeletingImage(selectedImages[0]);
                    setShowDeleteModal(true);
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors">
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Images",
              value: galleryImages.length,
              icon: LucideImage,
              color: "text-blue-400",
              bgColor: "bg-blue-500/10",
            },
            {
              label: "Active",
              value: galleryImages.filter((i) => i.status === "active").length,
              icon: CheckCircle,
              color: "text-green-400",
              bgColor: "bg-green-500/10",
            },
            {
              label: "Draft",
              value: galleryImages.filter((i) => i.status === "draft").length,
              icon: Clock,
              color: "text-yellow-400",
              bgColor: "bg-yellow-500/10",
            },
            {
              label: "Archived",
              value: galleryImages.filter((i) => i.status === "archived")
                .length,
              icon: AlertCircle,
              color: "text-slate-400",
              bgColor: "bg-slate-500/10",
            },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-surface border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div
                  className={`h-11 w-11 rounded-xl flex items-center justify-center ${stat.bgColor} ${stat.color}`}>
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
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
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
                <Filter
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={14}
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 pl-9 pr-8 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-safety/50 appearance-none cursor-pointer">
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="relative">
                <Filter
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={14}
                />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="h-10 pl-9 pr-8 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-safety/50 appearance-none cursor-pointer">
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
            dragActive
              ? "border-safety/50 bg-safety/5"
              : "border-white/10 hover:border-white/20"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}>
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
              <div
                className={`h-16 w-16 rounded-2xl flex items-center justify-center transition-colors ${
                  dragActive
                    ? "bg-safety/20 text-safety"
                    : "bg-white/5 text-slate-400"
                }`}>
                <Upload size={32} />
              </div>
              <div>
                <p className="text-lg font-semibold text-white">
                  Drag & drop images here
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  or click to browse files
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Supports: JPG, PNG, WebP, GIF • Max 10MB per file
                </p>
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
                  className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">
                      Uploading...
                    </span>
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
              <h3 className="text-lg font-semibold text-white mb-2">
                No images found
              </h3>
              <p className="text-slate-400">
                Upload your first image to get started
              </p>
            </div>
          ) : (
            <>
              {/* Grid View */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <SortableContext
                  items={sortedImages.map((img) => img.id)}
                  strategy={verticalListSortingStrategy}>
                  <div className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {sortedImages.map((image, index) => {
                        const isSelected = selectedImages.includes(image.id);
                        return (
                          <SortableGalleryItem
                            key={image.id}
                            image={image}
                            index={index}
                            isSelected={isSelected}
                            onToggleSelect={toggleSelect}
                            onEdit={() => setShowEditModal(image.id)}
                            onReplace={() => openReplaceImageModal(image.id)}
                            onDelete={() => handleDelete(image.id)}
                            getStatusConfig={getStatusConfig}
                            getCategoryConfig={getCategoryConfig}
                          />
                        );
                      })}
                    </div>
                  </div>
                </SortableContext>
              </DndContext>
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
            onClick={() => setShowUploadModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <h3 className="text-lg font-bold text-white">Upload Images</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-5">
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    dragActive
                      ? "border-safety/50 bg-safety/5"
                      : "border-white/10"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}>
                  <input
                    type="file"
                    id="gallery-upload-modal"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) =>
                      e.target.files && handleFileUpload(e.target.files)
                    }
                  />
                  <label
                    htmlFor="gallery-upload-modal"
                    className="cursor-pointer">
                    <Upload className="mx-auto mb-3 text-slate-400" size={32} />
                    <p className="text-white mb-1">Drag & drop images here</p>
                    <p className="text-sm text-slate-400">or click to browse</p>
                    <p className="text-xs text-slate-500 mt-2">
                      JPG, PNG, WebP, GIF • Max 10MB each
                    </p>
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
                        className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-white">
                            Uploading...
                          </span>
                          <span className="text-sm text-slate-400">
                            {progress}%
                          </span>
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
                  className="px-4 py-2 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors">
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
            onClick={() => setShowEditModal(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <h3 className="text-lg font-bold text-white">Edit Image</h3>
                <button
                  onClick={() => setShowEditModal(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-5">
                <EditImageForm
                  image={galleryImages.find((i) => i.id === showEditModal)!}
                  onClose={() => setShowEditModal(null)}
                  onSave={(data) => updateGalleryImage(showEditModal!, data)}
                  suggestions={getAllTags()}
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
            onClick={() => setShowDeleteModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface border border-white/10 rounded-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}>
              <div className="p-6 text-center">
                <div className="h-14 w-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="text-red-400" size={28} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Delete Image
                </h3>
                <p className="text-slate-400 mb-6">
                  Are you sure you want to delete this image? This action cannot
                  be undone.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors">
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Edit Modal */}
      <AnimatePresence>
        {showBulkEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowBulkEditModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <h3 className="text-lg font-bold text-white">
                  Bulk Edit {selectedImages.length} Images
                </h3>
                <button
                  onClick={() => setShowBulkEditModal(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-5">
                <BulkEditForm
                  imageCount={selectedImages.length}
                  onClose={() => setShowBulkEditModal(false)}
                  onSave={handleBulkEditSave}
                  bulkEditData={bulkEditData}
                  setBulkEditData={setBulkEditData}
                  allTags={getAllTags()}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Replace Image Modal */}
      <AnimatePresence>
        {showReplaceImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowReplaceImageModal(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface border border-white/10 rounded-2xl w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <h3 className="text-lg font-bold text-white">Replace Image</h3>
                <button
                  onClick={() => setShowReplaceImageModal(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-5">
                <ReplaceImageForm
                  imageId={showReplaceImageModal}
                  image={
                    galleryImages.find((i) => i.id === showReplaceImageModal)!
                  }
                  onClose={() => setShowReplaceImageModal(null)}
                  onReplace={handleReplaceImage}
                  replaceImageFile={replaceImageFile}
                  setReplaceImageFile={setReplaceImageFile}
                  replaceImageProgress={replaceImageProgress}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminDashboardLayoutWrapper>
  );
}

// Bulk Edit Form Component
function BulkEditForm({
  imageCount,
  onClose,
  onSave,
  bulkEditData,
  setBulkEditData,
  allTags,
}: {
  imageCount: number;
  onClose: () => void;
  onSave: () => void;
  bulkEditData: Partial<GalleryImage>;
  setBulkEditData: React.Dispatch<React.SetStateAction<Partial<GalleryImage>>>;
  allTags: string[];
}) {
  const [category, setCategory] = useState<GalleryImage["category"] | "">(
    bulkEditData.category || "",
  );
  const [status, setStatus] = useState<GalleryImage["status"] | "">(
    bulkEditData.status || "",
  );
  const [tagsToAdd, setTagsToAdd] = useState("");
  const [tagsToRemove, setTagsToRemove] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState<string>(
    bulkEditData.isFeatured !== undefined
      ? String(bulkEditData.isFeatured)
      : "",
  );
  const [altText, setAltText] = useState(bulkEditData.altText || "");

  const handleCategoryChange = (value: string) => {
    setCategory(value as GalleryImage["category"]);
    setBulkEditData((prev) => ({
      ...prev,
      category: value as GalleryImage["category"],
    }));
  };

  const handleStatusChange = (value: string) => {
    setStatus(value as GalleryImage["status"]);
    setBulkEditData((prev) => ({
      ...prev,
      status: value as GalleryImage["status"],
    }));
  };

  const handleFeaturedChange = (value: string) => {
    setIsFeatured(value);
    setBulkEditData((prev) => ({ ...prev, isFeatured: value === "true" }));
  };

  const handleAltTextChange = (value: string) => {
    setAltText(value);
    setBulkEditData((prev) => ({ ...prev, altText: value }));
  };

  const handleTagsToAddChange = (value: string) => {
    setTagsToAdd(value);
  };

  const handleTagRemove = (tag: string) => {
    setTagsToRemove((prev) => [...prev, tag]);
  };

  const handleTagAdd = () => {
    const newTags = tagsToAdd
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (newTags.length > 0) {
      // This will be handled in the onSave
      setTagsToAdd("");
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
      className="space-y-5">
      <div className="mb-4 p-3 bg-safety/10 border border-safety/20 rounded-lg">
        <p className="text-sm text-safety">
          <strong>
            Editing {imageCount} image{imageCount > 1 ? "s" : ""}
          </strong>{" "}
          - Only filled fields will be updated. Leave empty to keep current
          values.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full h-10 px-4 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-safety/50 appearance-none cursor-pointer">
            <option value="">Keep current</option>
            <option value="products">Products</option>
            <option value="projects">Projects</option>
            <option value="factory">Factory</option>
            <option value="team">Team</option>
            <option value="events">Events</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full h-10 px-4 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-safety/50 appearance-none cursor-pointer">
            <option value="">Keep current</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Featured
          </label>
          <select
            value={isFeatured}
            onChange={(e) => handleFeaturedChange(e.target.value)}
            className="w-full h-10 px-4 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-safety/50 appearance-none cursor-pointer">
            <option value="">Keep current</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Alt Text (SEO)
          </label>
          <input
            type="text"
            value={altText}
            onChange={(e) => handleAltTextChange(e.target.value)}
            className="w-full h-10 px-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:border-safety/50 focus:bg-white/10 transition-all"
            placeholder="Leave empty to keep current"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Add Tags (comma separated)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagsToAdd}
              onChange={(e) => handleTagsToAddChange(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleTagAdd())
              }
              list="tag-suggestions"
              className="flex-1 h-10 px-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:border-safety/50 focus:bg-white/10 transition-all"
              placeholder="crane, installation, 2024"
            />
            <datalist id="tag-suggestions">
              {allTags.map((tag) => (
                <option key={tag} value={tag} />
              ))}
            </datalist>
            <button
              type="button"
              onClick={handleTagAdd}
              className="px-4 h-10 bg-safety/20 border border-safety/30 text-safety rounded-lg text-sm font-medium hover:bg-safety/30 transition-colors">
              Add
            </button>
          </div>
          {tagsToRemove.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {tagsToRemove.map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-red-500/20 border border-red-500/30 text-red-400 rounded text-xs flex items-center gap-1">
                  {tag}
                  <button
                    onClick={() =>
                      setTagsToRemove((prev) =>
                        prev.filter((_, idx) => idx !== i),
                      )
                    }
                    className="hover:text-red-300">
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Existing Tags Reference */}
        {allTags.length > 0 && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Existing Tags (click to add to remove list)
            </label>
            <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto p-2 bg-white/5 rounded-lg border border-white/10">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagRemove(tag)}
                  className="px-2 py-1 bg-white/5 text-slate-300 rounded text-xs hover:bg-safety/20 hover:text-safety transition-colors">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors">
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-safety to-yellow-400 text-ink rounded-lg text-sm font-semibold hover:brightness-105 transition-all shadow-sm shadow-safety/20">
          Apply to {imageCount} Image{imageCount > 1 ? "s" : ""}
        </button>
      </div>
    </form>
  );
}

// Replace Image Form Component
function ReplaceImageForm({
  imageId,
  image,
  onClose,
  onReplace,
  replaceImageFile,
  setReplaceImageFile,
  replaceImageProgress,
}: {
  imageId: string;
  image: GalleryImage;
  onClose: () => void;
  onReplace: (imageId: string, file: File) => void;
  replaceImageFile: File | null;
  setReplaceImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  replaceImageProgress: number;
}) {
  const [dragActive, setDragActive] = useState(false);

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
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setReplaceImageFile(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        setReplaceImageFile(file);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (replaceImageFile) {
      onReplace(imageId, replaceImageFile);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Current Image Preview */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Current Image
        </label>
        <div className="aspect-[4/3] rounded-lg overflow-hidden border border-white/10">
          <img
            src={image.url}
            alt={image.title}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-xs text-slate-500 mt-1">{image.title}</p>
      </div>

      {/* New Image Upload */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          New Image
        </label>
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors relative ${
            dragActive
              ? "border-safety/50 bg-safety/5"
              : "border-white/10 hover:border-white/20"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}>
          <input
            type="file"
            id="replace-image-upload"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          <label htmlFor="replace-image-upload" className="cursor-pointer">
            {replaceImageFile ? (
              <div className="flex flex-col items-center gap-3">
                <div className="h-24 w-24 rounded-lg overflow-hidden border border-white/10 relative">
                  <img
                    src={URL.createObjectURL(replaceImageFile)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  {replaceImageProgress > 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center">
                        <div className="h-2 w-48 bg-white/20 rounded-full overflow-hidden mx-auto mb-2">
                          <motion.div
                            animate={{ width: `${replaceImageProgress}%` }}
                            className="h-full bg-gradient-to-r from-safety to-yellow-400 rounded-full"
                          />
                        </div>
                        <p className="text-sm text-white">
                          {replaceImageProgress}%
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-sm text-slate-400">
                  {replaceImageFile.name} (
                  {(replaceImageFile.size / 1024).toFixed(1)} KB)
                </p>
                <button
                  type="button"
                  onClick={() => setReplaceImageFile(null)}
                  className="text-xs text-red-400 hover:text-red-300">
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Upload className="text-slate-400" size={32} />
                <p className="text-white mb-1">Drag & drop new image here</p>
                <p className="text-sm text-slate-400">or click to browse</p>
                <p className="text-xs text-slate-500 mt-2">
                  JPG, PNG, WebP, GIF • Max 10MB
                </p>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Progress Bar */}
      {replaceImageProgress > 0 && replaceImageProgress < 100 && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white">
              Replacing image...
            </span>
            <span className="text-sm text-slate-400">
              {replaceImageProgress}%
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${replaceImageProgress}%` }}
              className="h-full bg-gradient-to-r from-safety to-yellow-400 rounded-full transition-all duration-300"
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors">
          Cancel
        </button>
        <button
          type="submit"
          disabled={!replaceImageFile}
          className="px-4 py-2 bg-gradient-to-r from-safety to-yellow-400 text-ink rounded-lg text-sm font-semibold hover:brightness-105 transition-all shadow-sm shadow-safety/20 disabled:opacity-50 disabled:cursor-not-allowed">
          Replace Image
        </button>
      </div>
    </form>
  );
}

// Sortable Gallery Item Component
function SortableGalleryItem({
  image,
  index,
  isSelected,
  onToggleSelect,
  onEdit,
  onReplace,
  onDelete,
  getStatusConfig,
  getCategoryConfig,
}: {
  image: GalleryImage;
  index: number;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onEdit: () => void;
  onReplace: () => void;
  onDelete: () => void;
  getStatusConfig: (status: string) => {
    label: string;
    color: string;
    icon: any;
  };
  getCategoryConfig: (category: string) => { label: string; color: string };
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      className={`group relative bg-white/5 rounded-xl overflow-hidden transition-all ${
        isSelected
          ? "border-2 border-safety/50 ring-2 ring-safety/20"
          : "border border-white/10 hover:border-safety/30"
      } ${isDragging ? "shadow-xl shadow-safety/20 z-50" : ""}`}>
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-10 p-1 bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white rounded-lg backdrop-blur-sm transition-colors cursor-grab active:cursor-grabbing"
        aria-label="Drag to reorder"
        title="Drag to reorder">
        <GripVertical size={16} />
      </button>

      {/* Selection Checkbox */}
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect(image.id);
          }}
          className={`h-6 w-6 rounded border-2 flex items-center justify-center transition-all ${
            isSelected
              ? "bg-safety border-safety text-ink"
              : "bg-white/10 border-white/20 text-white/50 hover:border-safety/50"
          }`}
          aria-label={isSelected ? "Deselect" : "Select"}>
          {isSelected && <Check size={12} />}
        </button>
      </div>

      {/* Image */}
      <div className="aspect-[4/3] relative overflow-hidden">
        <img
          src={image.url}
          alt={image.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%231e293b'/%3E%3Ctext x='200' y='140' font-family='system-ui, sans-serif' font-size='16' fill='%2364748b' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3Ctext x='200' y='165' font-family='system-ui, sans-serif' font-size='12' fill='%23475569' text-anchor='middle' dominant-baseline='middle'%3EImage not available%3C/text%3E%3C/svg%3E";
          }}
        />

        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <span
            className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusConfig(image.status).color}`}>
            {getStatusConfig(image.status).label}
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-1 rounded-full text-[10px] font-medium ${getCategoryConfig(image.category).color}`}>
            {getCategoryConfig(image.category).label}
          </span>
        </div>

        {/* Featured Badge */}
        {image.isFeatured && (
          <div className="absolute bottom-2 left-2">
            <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
              Featured
            </span>
          </div>
        )}

        {/* Order Number */}
        <div className="absolute bottom-2 right-2">
          <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-white/10 text-white/50 border border-white/20">
            #{image.order || index + 1}
          </span>
        </div>

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={onEdit}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-colors"
            title="Edit Details">
            <Edit size={16} />
          </button>
          <button
            onClick={onReplace}
            className="p-2 bg-white/10 hover:bg-blue-500/20 hover:text-blue-400 text-white rounded-lg backdrop-blur-sm transition-colors"
            title="Replace Image">
            <Replace size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect(image.id);
            }}
            className={`p-2 rounded-lg backdrop-blur-sm transition-colors ${
              isSelected
                ? "bg-safety/20 text-safety"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
            title={isSelected ? "Deselect" : "Select"}>
            {isSelected ? <Check size={16} /> : <Plus size={16} />}
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-white/10 hover:bg-red-500/20 hover:text-red-400 text-white rounded-lg backdrop-blur-sm transition-colors"
            title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Image Info */}
      <div className="p-3 space-y-2">
        <h4 className="font-semibold text-white truncate">{image.title}</h4>
        <p className="text-xs text-slate-400 truncate">
          {image.description || "No description"}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          {image.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-white/5 text-[10px] text-slate-300 rounded">
              {tag}
            </span>
          ))}
          {image.tags && image.tags.length > 3 && (
            <span className="px-2 py-0.5 bg-white/5 text-[10px] text-slate-500 rounded">
              +{image.tags.length - 3}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <span className="text-[10px] text-slate-500">
            {new Date(image.date).toLocaleDateString()}
          </span>
          <span className="text-[10px] text-slate-500">
            {(image.size / 1024).toFixed(1)} KB
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// Tag Input Component with Autocomplete
function TagInput({
  value,
  onChange,
  suggestions = [],
  placeholder = "Add tags...",
  maxTags = 20,
}: {
  value: string;
  onChange: (value: string) => void;
  suggestions?: string[];
  placeholder?: string;
  maxTags?: number;
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Parse current tags from the comma-separated value
  const currentTags = value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const lastTag = currentTags[currentTags.length - 1] || "";
  const prefix =
    currentTags.slice(0, -1).join(", ") + (currentTags.length > 1 ? ", " : "");

  // Filter suggestions based on the last tag being typed
  const filteredSuggestions = suggestions
    .filter(
      (tag) =>
        tag.toLowerCase().includes(lastTag.toLowerCase()) &&
        !currentTags.slice(0, -1).includes(tag),
    )
    .slice(0, 10);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(true);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          Math.min(prev + 1, filteredSuggestions.length - 1),
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case "Enter":
      case "Tab":
        if (highlightedIndex >= 0) {
          e.preventDefault();
          selectSuggestion(filteredSuggestions[highlightedIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const selectSuggestion = (suggestion: string) => {
    const newTags = [...currentTags.slice(0, -1), suggestion];
    if (newTags.length < maxTags) {
      onChange(newTags.join(", ") + ", ");
    }
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    // Focus back to input
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow click selection
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleFocus = () => {
    if (filteredSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const removeTag = (index: number) => {
    const newTags = currentTags.filter((_, i) => i !== index);
    onChange(newTags.join(", ") + (newTags.length > 0 ? ", " : ""));
  };

  return (
    <div className="relative">
      {/* Selected Tags Display */}
      {currentTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {currentTags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-safety/20 border border-safety/30 text-safety rounded-full text-xs font-medium">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="p-0.5 hover:bg-safety/30 rounded-full transition-colors"
                aria-label={`Remove ${tag}`}>
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input Field */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full h-10 px-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:border-safety/50 focus:bg-white/10 transition-all"
          placeholder={placeholder}
          autoComplete="off"
        />

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-50 top-full left-0 right-0 mt-1 bg-surface border border-white/10 rounded-lg shadow-lg overflow-hidden max-h-60 overflow-y-auto">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => selectSuggestion(suggestion)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                  index === highlightedIndex
                    ? "bg-safety/20 text-safety"
                    : "text-slate-300 hover:bg-white/5"
                }`}>
                <Tag size={14} className="mr-2 inline-block" />
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Helper Text */}
      <p className="text-xs text-slate-500 mt-1">
        Press Enter or Tab to select suggestion. Comma-separated values.
      </p>
    </div>
  );
}

// Edit Image Form Component
function EditImageForm({
  image,
  onClose,
  onSave,
  suggestions = [],
}: {
  image: GalleryImage;
  onClose: () => void;
  onSave: (data: Partial<GalleryImage>) => void;
  suggestions?: string[];
}) {
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
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      altText,
      isFeatured,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-10 px-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:border-safety/50 focus:bg-white/10 transition-all"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:border-safety/50 focus:bg-white/10 transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as GalleryImage["category"])
            }
            className="w-full h-10 px-4 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-safety/50 appearance-none cursor-pointer">
            <option value="products">Products</option>
            <option value="projects">Projects</option>
            <option value="factory">Factory</option>
            <option value="team">Team</option>
            <option value="events">Events</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as GalleryImage["status"])
            }
            className="w-full h-10 px-4 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-safety/50 appearance-none cursor-pointer">
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Tags (comma separated)
          </label>
          <TagInput
            value={tags}
            onChange={setTags}
            suggestions={suggestions}
            placeholder="crane, factory, heavy machinery, installation"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Alt Text (for SEO)
          </label>
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
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Current Image
          </label>
          <div className="aspect-[4/3] max-w-xs rounded-lg overflow-hidden border border-white/10">
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors">
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-safety to-yellow-400 text-ink rounded-lg text-sm font-semibold hover:brightness-105 transition-all shadow-sm shadow-safety/20">
          Save Changes
        </button>
      </div>
    </form>
  );
}
