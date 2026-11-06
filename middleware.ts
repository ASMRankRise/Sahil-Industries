import { NextRequest, NextResponse } from "next/server";
export function middleware(request: NextRequest) {
  // The old PHP site is still linked by search results and bookmarks. Keep
  // those URLs on the new product pages instead of allowing the legacy host
  // fallback to serve the original PHP markup.
  const legacyProductRoutes: Record<string, string> = {
    "/single-girder-eot-crane.php": "/products/single-girder-eot-crane",
    "/double-girder-eot-crane.php": "/products/double-girder-eot-crane",
    "/electric-wire-rope-hoist.php": "/products/electric-wire-rope-hoist",
    "/underslung-cranes.php": "/products/underslung-cranes",
    "/goliath-semi-goliath-crane.php": "/products/goliath-semi-goliath-crane",
    "/jib-crane.php": "/products/jib-crane",
    "/monorail-crane.php": "/products/monorail-crane",
  };

  const productRedirect = legacyProductRoutes[request.nextUrl.pathname];
  if (productRedirect) {
    return NextResponse.redirect(new URL(productRedirect, request.url), 308);
  }

  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    !request.cookies.has("admin_session") &&
    request.nextUrl.pathname !== "/admin"
  )
    return NextResponse.redirect(new URL("/admin", request.url));
  return NextResponse.next();
}
export const config = { matcher: ["/admin/:path*", "/:path*.php"] };
