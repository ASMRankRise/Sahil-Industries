import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, requireAdmin } from "@/lib/admin-auth";

function unauthorized(error: unknown) {
  return error instanceof Error && error.message === "ADMIN_UNAUTHORIZED";
}
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const result = await getAdminDb()
      .prepare(
        "SELECT id, name, email, phone, subject, message, status, created_at, updated_at FROM enquiries ORDER BY created_at DESC",
      )
      .bind()
      .all<Record<string, unknown>>();
    return NextResponse.json({ enquiries: result.results });
  } catch (error) {
    return NextResponse.json(
      {
        error: unauthorized(error)
          ? "Unauthorized"
          : "Unable to load enquiries",
      },
      { status: unauthorized(error) ? 401 : 500 },
    );
  }
}
export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin(request);
    const { id, status } = await request.json();
    if (typeof id !== "string" || typeof status !== "string")
      return NextResponse.json(
        { error: "id and status are required" },
        { status: 400 },
      );
    await getAdminDb()
      .prepare(
        "UPDATE enquiries SET status = ?, updated_at = datetime('now') WHERE id = ?",
      )
      .bind(status, id)
      .run();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: unauthorized(error)
          ? "Unauthorized"
          : "Unable to update enquiry",
      },
      { status: unauthorized(error) ? 401 : 500 },
    );
  }
}
export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin(request);
    const id = new URL(request.url).searchParams.get("id");
    if (!id)
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    await getAdminDb()
      .prepare("DELETE FROM enquiries WHERE id = ?")
      .bind(id)
      .run();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: unauthorized(error)
          ? "Unauthorized"
          : "Unable to delete enquiry",
      },
      { status: unauthorized(error) ? 401 : 500 },
    );
  }
}
