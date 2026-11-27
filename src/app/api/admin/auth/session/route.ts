import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const user = await verifyAdminSession(request);
  return user
    ? NextResponse.json({ authenticated: true, user })
    : NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
