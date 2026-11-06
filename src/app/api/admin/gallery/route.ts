import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, requireAdmin } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const rows = await getAdminDb()
      .prepare(
        "SELECT id, object_key, title, alt_text, status, created_at FROM gallery_images ORDER BY created_at DESC",
      )
      .bind()
      .all?.();
    return NextResponse.json({ images: rows });
  } catch (error) {
    if (error instanceof Error && error.message === "ADMIN_UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json(
      { error: "Unable to load gallery" },
      { status: 500 },
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
        "INSERT INTO gallery_images (id, object_key, title, alt_text, status) VALUES (?, ?, ?, ?, ?)",
      )
      .bind(
        id,
        body.object_key,
        body.title,
        typeof body.alt_text === "string" ? body.alt_text : "",
        typeof body.status === "string" ? body.status : "published",
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
