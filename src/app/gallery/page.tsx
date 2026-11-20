import GalleryClient, { type GalleryImage } from "@/components/GalleryClient";
import { getD1Client } from "@/lib/d1-client";

export const dynamic = "force-dynamic";

type GalleryRow = {
  id: string;
  object_key: string;
  title: string | null;
  alt_text: string | null;
  description: string | null;
  category: string | null;
  tags: string | null;
};

function parseTags(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((tag): tag is string => typeof tag === "string") : [];
  } catch {
    return value.split(",").map((tag) => tag.trim()).filter(Boolean);
  }
}

async function getGalleryImages(): Promise<GalleryImage[]> {
  const db = getD1Client();
  const { results } = await db
    // Keep the public gallery compatible with databases that have not yet
    // received the optional gallery metadata migration (0004).
    .prepare("SELECT * FROM gallery_images WHERE status = 'active' ORDER BY created_at DESC")
    .all<GalleryRow>();

  return results.map((row) => ({
    id: row.id,
    src: `/api/gallery/${row.object_key}`,
    alt: row.alt_text || row.title || "Gallery image",
    title: row.title || "Gallery image",
    category: row.category || "other",
    description: row.description || "",
    tags: parseTags(row.tags),
  }));
}

export default async function GalleryPage() {
  const images = await getGalleryImages();
  return <GalleryClient images={images} />;
}
