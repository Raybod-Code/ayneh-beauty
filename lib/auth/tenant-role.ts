import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type TenantRole = "owner" | "admin" | "secretary" | "customer";

function getTenantSlugFromHost(host: string | null) {
  if (!host) return null;
  const hostname = host.split(":")[0]?.toLowerCase() ?? null;
  if (!hostname) return null;

  // dev: royal.localhost => royal
  if (hostname.endsWith(".localhost")) return hostname.replace(".localhost", "");

  // prod: بعداً با AYNEH_ROOT_DOMAIN همینجا توسعه می‌دیم
  return null;
}

function buildLoginRedirect(nextPath: string) {
  return `/admin/login?next=${encodeURIComponent(nextPath)}`;
}

export async function getCurrentTenantAndRole() {
  const h = await headers();

  const pathname = h.get("x-invoke-path") || "/admin"; // fallback
  const tenantSlugHeader = h.get("x-ayneh-tenant");
  const host = h.get("host");

  const tenantSlug = tenantSlugHeader || getTenantSlugFromHost(host);

  // اگر tenant پیدا نشد، اصلاً پنل tenant نباید باز بشه
  if (!tenantSlug) {
    redirect("/");
  }

  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  if (!user) {
    redirect(buildLoginRedirect("/admin"));
  }

  const { data: tenantRow, error: tenantError } = await supabase
    .from("tenants")
    .select("id, slug, status")
    .eq("slug", tenantSlug)
    .single();

  if (tenantError || !tenantRow) {
    redirect("/");
  }

  if (tenantRow.status !== "active") {
    redirect("/");
  }

  const { data: membership, error: membershipError } = await supabase
    .from("tenant_memberships")
    .select("role")
    .eq("tenant_id", tenantRow.id)
    .eq("user_id", user.id)
    .single();

  if (membershipError || !membership?.role) {
    redirect(buildLoginRedirect("/admin"));
  }

  const role = membership.role as TenantRole;

  return {
    tenant: tenantRow as { id: string; slug: string; status: string },
    user,
    role,
  };
}

export async function requireTenantRole(allowed: TenantRole[]) {
  const ctx = await getCurrentTenantAndRole();

  if (!allowed.includes(ctx.role)) {
    redirect("/admin");
  }

  return ctx;
}
