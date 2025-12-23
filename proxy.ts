import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

function getHostname(hostHeader: string | null) {
  if (!hostHeader) return null;
  return hostHeader.split(":")[0]?.toLowerCase() ?? null;
}

function resolveTenantSlug(hostname: string | null) {
  if (!hostname) return null;

  if (hostname.endsWith(".localhost")) return hostname.replace(".localhost", "");
  if (hostname === "localhost") return null;

  const root = process.env.AYNEH_ROOT_DOMAIN?.toLowerCase();
  if (!root) return null;

  if (hostname === root || hostname === `www.${root}`) return null;
  if (hostname.endsWith(`.${root}`)) return hostname.replace(`.${root}`, "");

  return null;
}

function shouldSkipTenant(request: NextRequest) {
  const p = request.nextUrl.pathname;

  // God Panel: کاملاً مستقل از tenant
  if (p.startsWith("/superadmin")) return true;

  // (اختیاری ولی پیشنهادی) وبهوک‌ها و endpointهای سیستمی
  if (p.startsWith("/api/webhooks")) return true;

  return false;
}

export async function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);

  const hostname = getHostname(request.headers.get("host"));
  if (hostname) requestHeaders.set("x-ayneh-host", hostname);

  if (!shouldSkipTenant(request)) {
    const tenantSlug = resolveTenantSlug(hostname);
    if (tenantSlug) requestHeaders.set("x-ayneh-tenant", tenantSlug);
  }

  const res = NextResponse.next({
    request: { headers: requestHeaders },
  });

  return await updateSession(request, res);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
