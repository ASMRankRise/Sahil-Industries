import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, getAdminDb, tokenHash } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (token)
    await getAdminDb()
      .prepare("DELETE FROM admin_sessions WHERE token_hash = ?")
      .bind(await tokenHash(token))
      .run();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  return response;
}
