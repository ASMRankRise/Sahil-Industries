import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, requireAdmin } from "@/lib/admin-auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();
    const allowed = ["object_key", "title", "alt_text", "status"] as const;
    const entries = allowed.filter((key) => body[key] !== undefined);
    if (!entries.length)
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 },
      );
    const set = entries.map((key) => `${key} = ?`).join(", ");
    await getAdminDb()
      .prepare(`UPDATE gallery_images SET ${set} WHERE id = ?`)
      .bind(...entries.map((key) => String(body[key])), id)
      .run();
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "ADMIN_UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json(
      { error: "Unable to update gallery image" },
      { status: 500 },
    );
  }
}
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    await getAdminDb()
      .prepare("DELETE FROM gallery_images WHERE id = ?")
      .bind(id)
      .run();
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "ADMIN_UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json(
      { error: "Unable to delete gallery image" },
      { status: 500 },
    );
  }
}
