import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, requireAdmin } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const result = await getAdminDb()
      .prepare(
        "SELECT *, '/api/gallery/' || object_key AS url FROM gallery_images ORDER BY COALESCE(sort_order, 999999), created_at DESC",
      )
      .bind()
      .all<{ id: string; [key: string]: unknown }>();
    return NextResponse.json({ images: result.results });
  } catch (error) {
    if (error instanceof Error && error.message === "ADMIN_UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.error("Unable to load gallery", error);
    return NextResponse.json(
      { error: "Gallery database is not configured" },
      { status: 503 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    const body = await request.json();
    if (typeof body.object_key !== "string" || typeof body.title !== "string")
      return NextResponse.json(
        { error: "object_key and title are required" },
        { status: 400 },
      );
    const id = crypto.randomUUID();
    await getAdminDb()
      .prepare(
        "INSERT INTO gallery_images (id, object_key, title, alt_text, status, description, category, tags, is_featured, sort_order, size, width, height) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      )
      .bind(
        id,
        body.object_key,
        body.title,
        typeof body.alt_text === "string" ? body.alt_text : "",
        typeof body.status === "string" ? body.status : "published",
        body.description || "", body.category || "other", JSON.stringify(body.tags || []), String(body.isFeatured ? 1 : 0),
        String(Number(body.order || 0)), String(Number(body.size || 0)), String(Number(body.width || 0)), String(Number(body.height || 0)),
      )
      .run();
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "ADMIN_UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json(
      { error: "Unable to create gallery image" },
      { status: 500 },
    );
  }
}
