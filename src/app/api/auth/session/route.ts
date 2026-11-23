import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAdminSession(request);
    // Anonymous is the normal state while the login screen is displayed.
    return user
      ? NextResponse.json({ authenticated: true, user })
      : NextResponse.json({ authenticated: false });
  } catch (error) {
    // A missing/unavailable database must not make the admin shell loop on a
    // 500 while checking an anonymous session. Keep the response compatible
    // with the client and expose the actual failure in the server logs.
    console.error("Unable to check admin session", error);
    return NextResponse.json(
      { authenticated: false, error: "Session service unavailable" },
      { status: 503 },
    );
  }
}
