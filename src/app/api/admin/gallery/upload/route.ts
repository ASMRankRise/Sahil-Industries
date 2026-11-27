import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, requireAdmin } from "@/lib/admin-auth";
import {
  extensionForImage,
  MAX_IMAGE_BYTES,
  MAX_IMAGE_DIMENSION,
  readImageDimensions,
} from "@/lib/image-validation";
import { r2Client } from "@/lib/r2-client";

// Keep this route in the Worker server bundle. OpenNext requires edge-runtime
// routes to be configured as separate functions, which is not needed here.
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let objectKey: string | undefined;
  try {
    await requireAdmin(request);
    const form = await request.formData();
    const value = form.get("file");
    if (!(value instanceof File))
      return NextResponse.json(
        { error: "An image file is required" },
        { status: 400 },
      );
    if (value.size === 0 || value.size > MAX_IMAGE_BYTES)
      return NextResponse.json(
        { error: "Image must be smaller than 10MB" },
        { status: 400 },
      );
    const extension = extensionForImage(value.type, value.name);
    if (!extension)
      return NextResponse.json(
        { error: "Only matching JPG, PNG, WebP, and GIF images are allowed" },
        { status: 400 },
      );
    const bytes = new Uint8Array(await value.arrayBuffer());
    const dimensions = readImageDimensions(bytes, value.type);
    if (
      !dimensions ||
      dimensions.width < 1 ||
      dimensions.height < 1 ||
      dimensions.width > MAX_IMAGE_DIMENSION ||
      dimensions.height > MAX_IMAGE_DIMENSION
    )
      return NextResponse.json(
        { error: "Invalid or oversized image dimensions" },
        { status: 400 },
      );
    const id = crypto.randomUUID();
    objectKey = `gallery/${id}.${extension}`;
    await r2Client.upload(objectKey, bytes, value.type);
    const title = String(
      form.get("title") || value.name.replace(/\.[^.]+$/, ""),
    ).slice(0, 200);
    const altText = String(form.get("alt_text") || title).slice(0, 500);
    const status = String(form.get("status") || "published");
    await getAdminDb()
      .prepare(
        "INSERT INTO gallery_images (id, object_key, title, alt_text, status) VALUES (?, ?, ?, ?, ?)",
      )
      .bind(id, objectKey, title, altText, status)
      .run();
    return NextResponse.json(
      {
        id,
        objectKey,
        title,
        altText,
        width: dimensions.width,
        height: dimensions.height,
        url: `/api/gallery/${encodeURIComponent(objectKey)}`,
      },
      { status: 201 },
    );
  } catch (error) {
    if (objectKey) {
      try {
        await r2Client.delete(objectKey);
      } catch {}
    }
    if (error instanceof Error && error.message === "ADMIN_UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json(
      { error: "Unable to upload image" },
      { status: 500 },
    );
  }
}
