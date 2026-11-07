import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
export async function GET(request: NextRequest) {
  const user = await verifyAdminSession(request);
  // Anonymous is the normal state while the login screen is displayed.
  return user
    ? NextResponse.json({ authenticated: true, user })
    : NextResponse.json({ authenticated: false });
}
