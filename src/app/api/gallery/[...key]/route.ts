import { NextRequest, NextResponse } from "next/server";
import { r2Client } from "@/lib/r2-client";


export async function GET(request: NextRequest, { params }: { params: Promise<{ key: string[] }> }) {
  const key = (await params).key.join("/");
  if (!key.startsWith("gallery/") || key.includes("..")) return new NextResponse("Not found", { status: 404 });
  try { const object = await r2Client.download(key); if (!object.Body) return new NextResponse("Not found", { status: 404 });
    return new NextResponse(await object.Body.transformToWebStream(), { headers: { "Content-Type": object.ContentType || "application/octet-stream", "Cache-Control": "public, max-age=31536000, immutable" } });
  } catch { return new NextResponse("Not found", { status: 404 }); }
}
