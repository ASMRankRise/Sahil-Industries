import { NextRequest, NextResponse } from "next/server";
export function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    !request.cookies.has("admin_session") &&
    request.nextUrl.pathname !== "/admin"
  )
    return NextResponse.redirect(new URL("/admin", request.url));
  return NextResponse.next();
}
export const config = { matcher: ["/admin/:path*"] };
