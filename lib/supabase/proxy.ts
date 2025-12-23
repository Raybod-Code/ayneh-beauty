import { type NextRequest, NextResponse } from "next/server";
import type { NextResponse as NextRes } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function updateSession(request: NextRequest, response?: NextRes) {
  let res =
    response ??
    NextResponse.next({
      request: { headers: request.headers },
    });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  const pathname = request.nextUrl.pathname;

  const isAdmin = pathname.startsWith("/admin");
  const isSuperAdmin = pathname.startsWith("/superadmin");

  const isAdminLogin = pathname === "/admin/login";
  const isSuperAdminLogin = pathname === "/superadmin/login";

  const needsAuth =
    (isAdmin && !isAdminLogin) || (isSuperAdmin && !isSuperAdminLogin);

  if (needsAuth && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    // این باگ اصلی بود - باید return value استفاده شود
    url.searchParams.set("next", pathname);

    const redirectRes = NextResponse.redirect(url);
    res.cookies.getAll().forEach((c) => redirectRes.cookies.set(c));
    return redirectRes;
  }

  return res;
}
