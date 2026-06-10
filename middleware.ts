import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();
  // pathname رو توی header ست می‌کنیم تا layout بتونه بخونه
  response.headers.set("x-pathname", pathname);
  return response;
}

export const config = {
  matcher: [
    /*
     * همه route‌ها به جز:
     * - _next/static
     * - _next/image
     * - favicon.ico
     * - فایل‌های public
     */
    "/((?!_next/static|_next/image|favicon.ico|icons|images|manifest.json).*)",
  ],
};
