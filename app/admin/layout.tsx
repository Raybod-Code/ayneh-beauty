import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: "پنل مدیریت | آینه",
};

/**
 * Roles allowed to access the admin panel.
 * Matches the user_role enum in the database:
 * customer | staff | owner | superadmin
 */
const ADMIN_ALLOWED_ROLES = ["owner", "superadmin"] as const;
type AdminRole = (typeof ADMIN_ALLOWED_ROLES)[number];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 1. Verify the authenticated session
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // 2. Resolve the app-level user record via auth_id
  const { data: appUser, error: userError } = await supabase
    .from("users")
    .select("id, role, full_name")
    .eq("auth_id", user.id)
    .single();

  if (userError || !appUser) {
    // User authenticated but has no app record → send to onboarding
    redirect("/platform/signup");
  }

  // 3. Check role permission
  if (!ADMIN_ALLOWED_ROLES.includes(appUser.role as AdminRole)) {
    redirect("/");
  }

  // 4. Fetch the tenant (salon) this user owns/manages
  const { data: membership } = await supabase
    .from("tenant_members")
    .select("tenant_id, role, tenants(id, slug, display_name)")
    .eq("user_id", appUser.id)
    .in("role", ADMIN_ALLOWED_ROLES)
    .order("joined_at", { ascending: true })
    .limit(1)
    .single();

  // Derive a display name from the tenant's multilingual JSONB field
  const tenantDisplayName =
    (membership?.tenants as { display_name?: { fa?: string; en?: string } } | null)
      ?.display_name?.fa ??
    (membership?.tenants as { display_name?: { fa?: string; en?: string } } | null)
      ?.display_name?.en ??
    "سالن زیبایی";

  return (
    <AdminShell
      user={user}
      role={appUser.role}
      salonName={tenantDisplayName}
    >
      {children}
    </AdminShell>
  );
}
