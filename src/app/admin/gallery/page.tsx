"use client";

import Image from "next/image";
import { useState, useEffect, useMemo, useCallback, useId } from "react";
import { useToast } from "@/context/ToastContext";
import {
  BulkActionsBar,
  ConfirmModal,
  Modal,
  TagInput,
} from "@/components/admin";
import { motion } from "framer-motion";
import {
  Image as LucideImage,
  Search,
  Filter,
  Edit,
  Trash2,
  Download,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Upload,
  Check,
  Replace,
  Archive,
  GripVertical,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { AdminDashboardLayoutWrapper } from "@/components/AdminDashboardLayout";
import { AdminGallerySkeleton } from "@/components/AdminSkeleton";
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

const FALLBACK_IMAGE_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%231e293b'/%3E%3Ctext x='200' y='140' font-family='system-ui, sans-serif' font-size='16' fill='%2364748b' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";

const statusConfig = {
  active: {
    label: "Active",
    color: "bg-green-500/15 text-green-300 border border-green-500/30",
    icon: CheckCircle,
  },
  draft: {
    label: "Draft",
    color: "bg-yellow-500/15 text-yellow-300 border border-yellow-500/30",
    icon: Clock,
  },
  archived: {
    label: "Archived",
    color: "bg-slate-500/20 text-slate-300 border border-slate-400/30",
    icon: AlertCircle,
  },
};

const categoryConfig = {
  products: { label: "Products", color: "text-blue-300 bg-blue-500/20" },
  projects: { label: "Projects", color: "text-green-300 bg-green-500/20" },
  factory: { label: "Factory", color: "text-purple-300 bg-purple-500/20" },
  team: { label: "Team", color: "text-orange-300 bg-orange-500/20" },
  events: { label: "Events", color: "text-pink-300 bg-pink-500/20" },
  other: { label: "Other", color: "text-slate-300 bg-slate-500/20" },
};

export default function GalleryPage() {
  const { toast } = useToast();
  const {
    galleryImages,
    updateGalleryImage,
    deleteGalleryImage,
    uploadImage,
    galleryLoading,
  } = useAdminData();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<
    | { type: "single"; image: GalleryImage }
    | { type: "bulk"; ids: string[] }
    | null
  >(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
  const [isBulkSaving, setIsBulkSaving] = useState(false);
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
    async (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = sortedImages.findIndex((img) => img.id === active.id);
        const newIndex = sortedImages.findIndex((img) => img.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const newImages = arrayMove(sortedImages, oldIndex, newIndex);
          const updates = newImages
            .map((image, index) => ({ image, nextOrder: index + 1 }))
            .filter(({ image, nextOrder }) => image.order !== nextOrder);

          if (updates.length === 0) return;
          try {
            await Promise.all(
              updates.map(({ image, nextOrder }) =>
                updateGalleryImage(image.id, { order: nextOrder }),
              ),
            );
          } catch {
            toast.error("Failed to save new image order.");
          }
        }
      }
    },
    [sortedImages, updateGalleryImage, toast],
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
    const image = galleryImages.find((img) => img.id === id);
    if (!image) return;
    setDeleteTarget({ type: "single", image });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      if (deleteTarget.type === "single") {
        await deleteGalleryImage(deleteTarget.image.id);
        setSelectedImages((prev) =>
          prev.filter((id) => id !== deleteTarget.image.id),
        );
        toast.success("Image deleted successfully");
      } else {
        const count = deleteTarget.ids.length;
        await Promise.all(
          deleteTarget.ids.map((id) => deleteGalleryImage(id)),
        );
        setSelectedImages([]);
        toast.success(
          `${count} image${count > 1 ? "s" : ""} deleted successfully`,
        );
      }
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete image(s). Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    const fileArray = Array.from(files).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (fileArray.length === 0) {
      toast.error("Please select valid image files.");
      return;
    }

    let uploadedCount = 0;
    for (const file of fileArray) {
      const id = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      setUploadProgress((prev) => ({ ...prev, [id]: 0 }));

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

      try {
        await uploadImage(file, {
          title: file.name.replace(/\.[^/.]+$/, ""),
          category: "products",
          status: "draft",
        });
        uploadedCount += 1;
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
        clearInterval(progressInterval);
        setUploadProgress((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
        toast.error(
          error instanceof Error
            ? `Failed to upload ${file.name}: ${error.message}`
            : `Failed to upload ${file.name}`,
        );
      }
    }

    if (uploadedCount > 0) {
      toast.success(
        `Uploaded ${uploadedCount} image${uploadedCount > 1 ? "s" : ""} successfully`,
      );
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

  const handleExportCsv = () => {
    if (sortedImages.length === 0) {
      toast.error("No images to export.");
      return;
    }
    const csv = [
      [
        "ID",
        "Title",
        "Category",
        "Status",
        "Featured",
        "Order",
        "Tags",
        "Size (bytes)",
        "URL",
        "Date",
      ],
      ...sortedImages.map((img) => [
        img.id,
        img.title,
        img.category,
        img.status,
        img.isFeatured ? "Yes" : "No",
        String(img.order || ""),
        (img.tags || []).join("; "),
        String(img.size || 0),
        img.url,
        img.date,
      ]),
    ]
      .map((row) =>
        row.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(","),
      )
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "gallery-images.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Gallery metadata exported");
  };

  // Bulk Operations
  const handleBulkStatusChange = useCallback(
    async (status: GalleryImage["status"]) => {
      const count = selectedImages.length;
      try {
        await Promise.all(
          selectedImages.map((id) => updateGalleryImage(id, { status })),
        );
        setSelectedImages([]);
        toast.success(
          `Updated ${count} image${count > 1 ? "s" : ""} to "${status}"`,
        );
      } catch {
        toast.error("Failed to update status for selected images.");
      }
    },
    [selectedImages, updateGalleryImage, toast],
  );

  const handleBulkCategoryChange = useCallback(
    async (category: GalleryImage["category"]) => {
      const count = selectedImages.length;
      try {
        await Promise.all(
          selectedImages.map((id) => updateGalleryImage(id, { category })),
        );
        setSelectedImages([]);
        toast.success(
          `Moved ${count} image${count > 1 ? "s" : ""} to "${category}"`,
        );
      } catch {
        toast.error("Failed to update category for selected images.");
      }
    },
    [selectedImages, updateGalleryImage, toast],
  );

  const handleBulkArchive = useCallback(async () => {
    const count = selectedImages.length;
    try {
      await Promise.all(
        selectedImages.map((id) =>
          updateGalleryImage(id, { status: "archived" }),
        ),
      );
      setSelectedImages([]);
      toast.success(`${count} image${count > 1 ? "s" : ""} archived`);
    } catch {
      toast.error("Failed to archive selected images.");
    }
  }, [selectedImages, updateGalleryImage, toast]);

  const handleBulkDelete = useCallback(() => {
    if (selectedImages.length === 0) return;
    setDeleteTarget({ type: "bulk", ids: [...selectedImages] });
  }, [selectedImages]);

  const openBulkEditModal = useCallback(() => {
    if (selectedImages.length > 0) {
      setBulkEditData({});
      setShowBulkEditModal(true);
    }
  }, [selectedImages.length]);

  const handleBulkEditSave = useCallback(
    async ({
      tagsToAdd,
      tagsToRemove,
    }: {
      tagsToAdd: string[];
      tagsToRemove: string[];
    }) => {
      const count = selectedImages.length;
      setIsBulkSaving(true);
      try {
        await Promise.all(
          selectedImages.map((id) => {
            const image = galleryImages.find((img) => img.id === id);
            const payload: Partial<GalleryImage> = { ...bulkEditData };
            if (image && (tagsToAdd.length > 0 || tagsToRemove.length > 0)) {
              const filtered = (image.tags || []).filter(
                (t) => !tagsToRemove.includes(t),
              );
              payload.tags = [...new Set([...filtered, ...tagsToAdd])];
            }
            if (Object.keys(payload).length === 0) return Promise.resolve();
            return updateGalleryImage(id, payload);
          }),
        );
        setShowBulkEditModal(false);
        setBulkEditData({});
        setSelectedImages([]);
        toast.success(`Updated ${count} image${count > 1 ? "s" : ""}`);
      } catch {
        toast.error("Failed to apply bulk edits. Please try again.");
      } finally {
        setIsBulkSaving(false);
      }
    },
    [selectedImages, galleryImages, bulkEditData, updateGalleryImage, toast],
  );

  const openReplaceImageModal = useCallback((imageId: string) => {
    setShowReplaceImageModal(imageId);
    setReplaceImageFile(null);
    setReplaceImageProgress(0);
  }, []);

  const handleReplaceImage = useCallback(
    async (imageId: string, file: File) => {
      const existing = galleryImages.find((img) => img.id === imageId);
      if (!existing) return;

      setReplaceImageProgress(0);
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
        await uploadImage(file, {
          title: existing.title || file.name.replace(/\.[^/.]+$/, ""),
          description: existing.description,
          category: existing.category,
          status: existing.status,
          tags: existing.tags,
          altText: existing.altText,
          isFeatured: existing.isFeatured,
          order: existing.order,
        });
        await deleteGalleryImage(imageId);

        clearInterval(progressInterval);
        setReplaceImageProgress(100);
        toast.success("Image replaced successfully");

        setTimeout(() => {
          setShowReplaceImageModal(null);
          setReplaceImageFile(null);
          setReplaceImageProgress(0);
        }, 300);
      } catch (error) {
        clearInterval(progressInterval);
        setReplaceImageProgress(0);
        toast.error(
          error instanceof Error ? error.message : "Failed to replace image.",
        );
      }
    },
    [galleryImages, uploadImage, deleteGalleryImage, toast],
  );

  const getAllTags = useCallback(() => {
    const allTags = new Set<string>();
    galleryImages.forEach((img) => {
      img.tags?.forEach((tag) => allTags.add(tag));
    });
    return Array.from(allTags).sort();
  }, [galleryImages]);

  if (galleryLoading) {
    return (
      <AdminDashboardLayoutWrapper
        activeNav="/admin/gallery"
        pageTitle="Gallery Management"
        pageDescription="Upload, organize and manage gallery images for products, projects and factory">
        <AdminGallerySkeleton />
      </AdminDashboardLayoutWrapper>
    );
  }

  const editingImage = showEditModal
    ? galleryImages.find((i) => i.id === showEditModal) || null
    : null;
  const replacingImage = showReplaceImageModal
    ? galleryImages.find((i) => i.id === showReplaceImageModal) || null
    : null;

  return (
    <AdminDashboardLayoutWrapper
      activeNav="/admin/gallery"
      pageTitle="Gallery Management"
      pageDescription="Upload, organize and manage gallery images for products, projects and factory">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-safety to-yellow-400 text-ink rounded-lg text-sm font-semibold hover:brightness-105 transition-all shadow-sm shadow-safety/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <Upload size={14} aria-hidden="true" />
            Upload Images
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-4 py-2.5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety">
            <Download
              size={14}
              className="group-hover:text-safety transition-colors"
              aria-hidden="true"
            />
            Export
          </button>
        </div>

        {/* Batch Operations Toolbar */}
        <BulkActionsBar
          count={selectedImages.length}
          label="image"
          onClear={() => setSelectedImages([])}
          showStatusFilter
          statusOptions={[
            { value: "active", label: "Set Active" },
            { value: "draft", label: "Set Draft" },
            { value: "archived", label: "Archive" },
          ]}
          onStatusChange={(val) =>
            handleBulkStatusChange(val as GalleryImage["status"])
          }
          showCategoryFilter
          categoryOptions={[
            { value: "products", label: "Products" },
            { value: "projects", label: "Projects" },
            { value: "factory", label: "Factory" },
            { value: "team", label: "Team" },
            { value: "events", label: "Events" },
            { value: "other", label: "Other" },
          ]}
          onCategoryChange={(val) =>
            handleBulkCategoryChange(val as GalleryImage["category"])
          }
          actions={[
            {
              label: "Bulk Edit",
              icon: <Edit size={14} />,
              onClick: openBulkEditModal,
              variant: "default",
            },
            {
              label: "Archive",
              icon: <Archive size={14} />,
              onClick: handleBulkArchive,
              variant: "warning",
            },
            {
              label: "Delete",
              icon: <Trash2 size={14} />,
              onClick: handleBulkDelete,
              variant: "danger",
            },
          ]}
        />

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
              color: "text-slate-300",
              bgColor: "bg-slate-500/10",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-surface border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div
                  className={`h-11 w-11 rounded-xl flex items-center justify-center ${stat.bgColor} ${stat.color}`}
                  aria-hidden="true">
                  <stat.icon size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="bg-surface border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
                aria-hidden="true"
              />
              <input
                aria-label="Search gallery images"
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
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={14}
                  aria-hidden="true"
                />
                <select
                  aria-label="Filter by status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 pl-9 pr-8 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-safety/50 appearance-none cursor-pointer">
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={14}
                  aria-hidden="true"
                />
              </div>
              <div className="relative">
                <Filter
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={14}
                  aria-hidden="true"
                />
                <select
                  aria-label="Filter by category"
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
                <ChevronDown
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={14}
                  aria-hidden="true"
                />
              </div>
              {sortedImages.length > 0 && (
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="h-10 px-3 rounded-lg border border-white/10 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety">
                  {selectedImages.length === sortedImages.length
                    ? "Deselect All"
                    : "Select All"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden">
          {sortedImages.length === 0 ? (
            <div className="py-16 px-4 text-center">
              <LucideImage
                className="mx-auto mb-4 text-slate-400"
                size={48}
                aria-hidden="true"
              />
              <h2 className="text-lg font-semibold text-white mb-2">
                No images found
              </h2>
              <p className="text-sm text-slate-400 mb-6">
                {galleryImages.length === 0
                  ? "Upload your first image to get started."
                  : "Try adjusting your search or filter criteria."}
              </p>
              {galleryImages.length === 0 && (
                <button
                  type="button"
                  onClick={() => setShowUploadModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-safety text-ink rounded-lg text-sm font-semibold hover:bg-yellow-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                  <Upload size={15} aria-hidden="true" />
                  Upload Images
                </button>
              )}
            </div>
          ) : (
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
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Images"
        size="md">
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragActive ? "border-safety/50 bg-safety/5" : "border-white/15"
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
            className="cursor-pointer block">
            <Upload
              className="mx-auto mb-3 text-slate-400"
              size={32}
              aria-hidden="true"
            />
            <p className="text-white font-medium mb-1">
              Drag & drop images here
            </p>
            <p className="text-sm text-slate-400">or click to browse</p>
            <p className="text-xs text-slate-400 mt-2">
              JPG, PNG, WebP, GIF • Max 10MB each
            </p>
          </label>
        </div>

        {Object.keys(uploadProgress).length > 0 && (
          <div className="mt-4 space-y-3 max-h-64 overflow-y-auto">
            {Object.entries(uploadProgress).map(([id, progress]) => (
              <div
                key={id}
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
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-5 mt-5 border-t border-white/10">
          <button
            type="button"
            onClick={() => setShowUploadModal(false)}
            className="px-4 py-2 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety">
            Close
          </button>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={Boolean(editingImage)}
        onClose={() => setShowEditModal(null)}
        title="Edit Image"
        size="md">
        {editingImage && (
          <EditImageForm
            image={editingImage}
            onClose={() => setShowEditModal(null)}
            onSave={async (data) => {
              await updateGalleryImage(editingImage.id, data);
              toast.success("Image updated successfully");
            }}
            onError={(msg) => toast.error(msg)}
            suggestions={getAllTags()}
          />
        )}
      </Modal>

      {/* Bulk Edit Modal */}
      <Modal
        isOpen={showBulkEditModal}
        onClose={() => !isBulkSaving && setShowBulkEditModal(false)}
        title={`Bulk Edit ${selectedImages.length} Image${selectedImages.length > 1 ? "s" : ""}`}
        size="md">
        <BulkEditForm
          imageCount={selectedImages.length}
          onClose={() => setShowBulkEditModal(false)}
          onSave={handleBulkEditSave}
          bulkEditData={bulkEditData}
          setBulkEditData={setBulkEditData}
          allTags={getAllTags()}
          isSaving={isBulkSaving}
        />
      </Modal>

      {/* Replace Image Modal */}
      <Modal
        isOpen={Boolean(replacingImage)}
        onClose={() =>
          replaceImageProgress === 0 && setShowReplaceImageModal(null)
        }
        title="Replace Image"
        size="sm">
        {replacingImage && (
          <ReplaceImageForm
            imageId={replacingImage.id}
            image={replacingImage}
            onClose={() => setShowReplaceImageModal(null)}
            onReplace={handleReplaceImage}
            replaceImageFile={replaceImageFile}
            setReplaceImageFile={setReplaceImageFile}
            replaceImageProgress={replaceImageProgress}
          />
        )}
      </Modal>

      {/* Custom Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => !isDeleting && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={
          deleteTarget?.type === "bulk"
            ? `Delete ${deleteTarget.ids.length} Images`
            : "Delete Image"
        }
        message={
          deleteTarget?.type === "bulk"
            ? `Are you sure you want to permanently delete these ${deleteTarget.ids.length} images? This action cannot be undone.`
            : `Are you sure you want to delete "${deleteTarget?.image?.title || "this image"}"? This action cannot be undone.`
        }
        confirmLabel={
          deleteTarget?.type === "bulk"
            ? `Delete ${deleteTarget.ids.length} Images`
            : "Delete Image"
        }
        cancelLabel="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
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
  isSaving,
}: {
  imageCount: number;
  onClose: () => void;
  onSave: (tagOps: { tagsToAdd: string[]; tagsToRemove: string[] }) => void;
  bulkEditData: Partial<GalleryImage>;
  setBulkEditData: React.Dispatch<React.SetStateAction<Partial<GalleryImage>>>;
  allTags: string[];
  isSaving: boolean;
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
  const categoryId = useId();
  const statusId = useId();
  const featuredId = useId();
  const altTextId = useId();
  const addTagsId = useId();

  const handleCategoryChange = (value: string) => {
    setCategory(value as GalleryImage["category"]);
    setBulkEditData((prev) => {
      const next = { ...prev };
      if (value) next.category = value as GalleryImage["category"];
      else delete next.category;
      return next;
    });
  };

  const handleStatusChange = (value: string) => {
    setStatus(value as GalleryImage["status"]);
    setBulkEditData((prev) => {
      const next = { ...prev };
      if (value) next.status = value as GalleryImage["status"];
      else delete next.status;
      return next;
    });
  };

  const handleFeaturedChange = (value: string) => {
    setIsFeatured(value);
    setBulkEditData((prev) => {
      const next = { ...prev };
      if (value) next.isFeatured = value === "true";
      else delete next.isFeatured;
      return next;
    });
  };

  const handleAltTextChange = (value: string) => {
    setAltText(value);
    setBulkEditData((prev) => {
      const next = { ...prev };
      if (value.trim()) next.altText = value;
      else delete next.altText;
      return next;
    });
  };

  const handleTagRemove = (tag: string) => {
    setTagsToRemove((prev) => (prev.includes(tag) ? prev : [...prev, tag]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAddTags = tagsToAdd
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onSave({ tagsToAdd: parsedAddTags, tagsToRemove });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="p-3 bg-safety/10 border border-safety/20 rounded-lg">
        <p className="text-sm text-safety">
          <strong>
            Editing {imageCount} image{imageCount > 1 ? "s" : ""}
          </strong>{" "}
          — Only filled fields will be updated. Leave empty to keep current
          values.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor={categoryId}
            className="block text-sm font-medium text-slate-300 mb-1">
            Category
          </label>
          <select
            id={categoryId}
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
          <label
            htmlFor={statusId}
            className="block text-sm font-medium text-slate-300 mb-1">
            Status
          </label>
          <select
            id={statusId}
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
          <label
            htmlFor={featuredId}
            className="block text-sm font-medium text-slate-300 mb-1">
            Featured
          </label>
          <select
            id={featuredId}
            value={isFeatured}
            onChange={(e) => handleFeaturedChange(e.target.value)}
            className="w-full h-10 px-4 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-safety/50 appearance-none cursor-pointer">
            <option value="">Keep current</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        <div>
          <label
            htmlFor={altTextId}
            className="block text-sm font-medium text-slate-300 mb-1">
            Alt Text (SEO)
          </label>
          <input
            id={altTextId}
            type="text"
            value={altText}
            onChange={(e) => handleAltTextChange(e.target.value)}
            className="w-full h-10 px-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:border-safety/50 focus:bg-white/10 transition-all"
            placeholder="Leave empty to keep current"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor={addTagsId}
            className="block text-sm font-medium text-slate-300 mb-1">
            Add Tags (comma separated)
          </label>
          <input
            id={addTagsId}
            type="text"
            value={tagsToAdd}
            onChange={(e) => setTagsToAdd(e.target.value)}
            list="bulk-tag-suggestions"
            className="w-full h-10 px-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:border-safety/50 focus:bg-white/10 transition-all"
            placeholder="crane, installation, 2024"
          />
          <datalist id="bulk-tag-suggestions">
            {allTags.map((tag) => (
              <option key={tag} value={tag} />
            ))}
          </datalist>
          {tagsToRemove.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tagsToRemove.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-red-500/20 border border-red-500/30 text-red-300 rounded text-xs flex items-center gap-1">
                  Remove: {tag}
                  <button
                    type="button"
                    aria-label={`Cancel removing ${tag}`}
                    onClick={() =>
                      setTagsToRemove((prev) => prev.filter((t) => t !== tag))
                    }
                    className="hover:text-red-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-300 rounded">
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
            <p className="block text-sm font-medium text-slate-300 mb-2">
              Existing Tags (click to mark for removal)
            </p>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-white/5 rounded-lg border border-white/10">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagRemove(tag)}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    tagsToRemove.includes(tag)
                      ? "bg-red-500/20 text-red-300"
                      : "bg-white/5 text-slate-300 hover:bg-safety/20 hover:text-safety"
                  }`}>
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
          disabled={isSaving}
          className="px-4 py-2 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety">
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 bg-gradient-to-r from-safety to-yellow-400 text-ink rounded-lg text-sm font-semibold hover:brightness-105 transition-all shadow-sm shadow-safety/20 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
          {isSaving
            ? "Applying..."
            : `Apply to ${imageCount} Image${imageCount > 1 ? "s" : ""}`}
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
  onReplace: (imageId: string, file: File) => Promise<void>;
  replaceImageFile: File | null;
  setReplaceImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  replaceImageProgress: number;
}) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!replaceImageFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(replaceImageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [replaceImageFile]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (replaceImageFile) {
      await onReplace(imageId, replaceImageFile);
    }
  };

  const isReplacing = replaceImageProgress > 0 && replaceImageProgress < 100;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <p className="block text-sm font-medium text-slate-300 mb-2">
          Current Image
        </p>
        <div className="aspect-[4/3] rounded-lg overflow-hidden border border-white/10 relative">
          <Image
            src={image.url || FALLBACK_IMAGE_URI}
            alt={image.title}
            fill
            unoptimized
            className="object-cover"
          />
        </div>
        <p className="text-xs text-slate-400 mt-1 truncate">{image.title}</p>
      </div>

      <div>
        <p className="block text-sm font-medium text-slate-300 mb-2">
          New Image
        </p>
        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors relative ${
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
          <label
            htmlFor="replace-image-upload"
            className="cursor-pointer block">
            {replaceImageFile && previewUrl ? (
              <div className="flex flex-col items-center gap-3">
                <div className="h-24 w-24 rounded-lg overflow-hidden border border-white/10 relative">
                  <Image
                    src={previewUrl}
                    alt="Replacement preview"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <p className="text-sm text-slate-300">
                  {replaceImageFile.name} (
                  {(replaceImageFile.size / 1024).toFixed(1)} KB)
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setReplaceImageFile(null);
                  }}
                  className="text-xs text-red-400 hover:text-red-300">
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload
                  className="text-slate-400"
                  size={28}
                  aria-hidden="true"
                />
                <p className="text-white font-medium">
                  Drag & drop new image here
                </p>
                <p className="text-sm text-slate-400">or click to browse</p>
                <p className="text-xs text-slate-400 mt-1">
                  JPG, PNG, WebP, GIF • Max 10MB
                </p>
              </div>
            )}
          </label>
        </div>
      </div>

      {isReplacing && (
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
          disabled={isReplacing}
          className="px-4 py-2 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety">
          Cancel
        </button>
        <button
          type="submit"
          disabled={!replaceImageFile || isReplacing}
          className="px-4 py-2 bg-gradient-to-r from-safety to-yellow-400 text-ink rounded-lg text-sm font-semibold hover:brightness-105 transition-all shadow-sm shadow-safety/20 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
          {isReplacing ? "Replacing..." : "Replace Image"}
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
    icon: LucideIcon;
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
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: Math.min(index * 0.02, 0.2), duration: 0.2 }}
      className={`group relative bg-white/5 rounded-xl overflow-hidden transition-all ${
        isSelected
          ? "border-2 border-safety/60 ring-2 ring-safety/20"
          : "border border-white/10 hover:border-safety/30"
      } ${isDragging ? "shadow-xl shadow-safety/20 z-50" : ""}`}>
      {/* Card Top Bar: Drag Handle + Badges + Selection */}
      <div className="flex items-center justify-between gap-2 px-2.5 py-2 border-b border-white/10 bg-black/20">
        <div className="flex items-center gap-1.5 min-w-0">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="p-1.5 bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white rounded-md transition-colors cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety"
            aria-label={`Drag to reorder ${image.title}`}
            title="Drag to reorder">
            <GripVertical size={14} aria-hidden="true" />
          </button>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusConfig(image.status).color}`}>
            {getStatusConfig(image.status).label}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getCategoryConfig(image.category).color}`}>
            {getCategoryConfig(image.category).label}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect(image.id);
            }}
            className={`h-6 w-6 rounded border-2 flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety ${
              isSelected
                ? "bg-safety border-safety text-ink"
                : "bg-white/10 border-white/25 text-white/60 hover:border-safety/60"
            }`}
            aria-label={
              isSelected
                ? `Deselect ${image.title}`
                : `Select ${image.title}`
            }>
            {isSelected && <Check size={12} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Image */}
      <div className="aspect-[4/3] relative overflow-hidden bg-black/30">
        <Image
          src={image.url || FALLBACK_IMAGE_URI}
          alt={image.altText || image.title}
          fill
          unoptimized
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE_URI;
          }}
        />

        {image.isFeatured && (
          <div className="absolute bottom-2 left-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-yellow-500/25 text-yellow-300 border border-yellow-500/40 backdrop-blur-sm">
              Featured
            </span>
          </div>
        )}

        <div className="absolute bottom-2 right-2">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-black/60 text-slate-200 border border-white/20 backdrop-blur-sm">
            #{image.order || index + 1}
          </span>
        </div>

        {/* Hover & Focus Actions */}
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={onEdit}
            aria-label={`Edit details for ${image.title}`}
            className="p-2.5 bg-black/60 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety"
            title="Edit Details">
            <Edit size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onReplace}
            aria-label={`Replace image ${image.title}`}
            className="p-2.5 bg-black/60 hover:bg-blue-500/30 hover:text-blue-300 text-white rounded-lg backdrop-blur-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety"
            title="Replace Image">
            <Replace size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect(image.id);
            }}
            aria-label={
              isSelected
                ? `Deselect ${image.title}`
                : `Select ${image.title}`
            }
            className={`p-2.5 rounded-lg backdrop-blur-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety ${
              isSelected
                ? "bg-safety/30 text-safety"
                : "bg-black/60 hover:bg-white/20 text-white"
            }`}
            title={isSelected ? "Deselect" : "Select"}>
            {isSelected ? (
              <Check size={16} aria-hidden="true" />
            ) : (
              <Plus size={16} aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete ${image.title}`}
            className="p-2.5 bg-black/60 hover:bg-red-500/30 hover:text-red-300 text-white rounded-lg backdrop-blur-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            title="Delete">
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Image Info */}
      <div className="p-3 space-y-2">
        <h3 className="font-semibold text-white truncate" title={image.title}>
          {image.title}
        </h3>
        <p className="text-xs text-slate-400 truncate">
          {image.description || "No description"}
        </p>
        {image.tags && image.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {image.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-white/5 text-[10px] text-slate-300 rounded">
                {tag}
              </span>
            ))}
            {image.tags.length > 3 && (
              <span className="px-2 py-0.5 bg-white/5 text-[10px] text-slate-400 rounded">
                +{image.tags.length - 3}
              </span>
            )}
          </div>
        )}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <span className="text-[11px] text-slate-400">
            {new Date(image.date).toLocaleDateString()}
          </span>
          <span className="text-[11px] text-slate-400">
            {(image.size / 1024).toFixed(1)} KB
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// Edit Image Form Component
function EditImageForm({
  image,
  onClose,
  onSave,
  onError,
  suggestions = [],
}: {
  image: GalleryImage;
  onClose: () => void;
  onSave: (data: Partial<GalleryImage>) => Promise<void>;
  onError: (message: string) => void;
  suggestions?: string[];
}) {
  const [title, setTitle] = useState(image.title);
  const [description, setDescription] = useState(image.description || "");
  const [category, setCategory] = useState(image.category);
  const [status, setStatus] = useState(image.status);
  const [tags, setTags] = useState(image.tags?.join(", ") || "");
  const [altText, setAltText] = useState(image.altText || "");
  const [isFeatured, setIsFeatured] = useState(image.isFeatured || false);
  const [isSaving, setIsSaving] = useState(false);

  const titleId = useId();
  const descriptionId = useId();
  const categoryId = useId();
  const statusId = useId();
  const altTextId = useId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
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
    } catch (error) {
      onError(
        error instanceof Error ? error.message : "Failed to save changes.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label
            htmlFor={titleId}
            className="block text-sm font-medium text-slate-300 mb-1">
            Title *
          </label>
          <input
            id={titleId}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-10 px-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:border-safety/50 focus:bg-white/10 transition-all"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor={descriptionId}
            className="block text-sm font-medium text-slate-300 mb-1">
            Description
          </label>
          <textarea
            id={descriptionId}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:border-safety/50 focus:bg-white/10 transition-all resize-none"
          />
        </div>

        <div>
          <label
            htmlFor={categoryId}
            className="block text-sm font-medium text-slate-300 mb-1">
            Category
          </label>
          <select
            id={categoryId}
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
          <label
            htmlFor={statusId}
            className="block text-sm font-medium text-slate-300 mb-1">
            Status
          </label>
          <select
            id={statusId}
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
          <TagInput
            label="Tags (comma separated)"
            value={tags}
            onChange={setTags}
            suggestions={suggestions}
            placeholder="crane, factory, heavy machinery, installation"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor={altTextId}
            className="block text-sm font-medium text-slate-300 mb-1">
            Alt Text (for SEO)
          </label>
          <input
            id={altTextId}
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

        <div className="md:col-span-2 pt-4 border-t border-white/10">
          <p className="block text-sm font-medium text-slate-300 mb-2">
            Current Image
          </p>
          <div className="aspect-[4/3] max-w-xs rounded-lg overflow-hidden border border-white/10 relative">
            <Image
              src={image.url || FALLBACK_IMAGE_URI}
              alt={image.title}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={onClose}
          disabled={isSaving}
          className="px-4 py-2 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety">
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 bg-gradient-to-r from-safety to-yellow-400 text-ink rounded-lg text-sm font-semibold hover:brightness-105 transition-all shadow-sm shadow-safety/20 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
