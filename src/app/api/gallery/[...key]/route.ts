import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

type ImageObject = { body: ReadableStream; httpMetadata?: { contentType?: string } };
type ImageBucket = { get: (key: string) => Promise<ImageObject | null> };

export async function GET(request: NextRequest, { params }: { params: Promise<{ key: string[] }> }) {
  const key = (await params).key.join("/");
  if (!key.startsWith("gallery/") || key.includes("..")) return new NextResponse("Not found", { status: 404 });
  const { env } = getCloudflareContext();
  const object = await (env as unknown as { GALLERY_IMAGES: ImageBucket }).GALLERY_IMAGES.get(key);
  if (!object) return new NextResponse("Not found", { status: 404 });
  return new NextResponse(object.body, { headers: { "Content-Type": object.httpMetadata?.contentType || "application/octet-stream", "Cache-Control": "public, max-age=31536000, immutable" } });
}
