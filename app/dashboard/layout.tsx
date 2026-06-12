import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: "پنل مدیریت | آینه",
  description: "پنل مدیریت سالن زیبایی آینه",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // ── Auth check ──────────────────────────────────────────────────────────────
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // ── Role + salon check ──────────────────────────────────────────────────────
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, salon_id")
    .eq("user_id", user.id)
    .single();

  // اگر پروفایل نداشت یا نقش نداشت → به onboarding
  if (profileError || !profile?.role) {
    redirect("/onboarding");
  }

  // فقط این نقش‌ها به پنل دسترسی دارند
  const allowedRoles = ["owner", "admin", "secretary"];
  if (!allowedRoles.includes(profile.role)) {
    redirect("/");
  }

  // ── Fetch salon name (optional, for display) ─────────────────────────────────
  let salonName = "سالن زیبایی";
  if (profile.salon_id) {
    const { data: salon } = await supabase
      .from("salons")
      .select("name")
      .eq("id", profile.salon_id)
      .single();
    if (salon?.name) salonName = salon.name;
  }

  return (
    <AdminShell
      user={user}
      role={profile.role}
      salonName={salonName}
    >
      {children}
    </AdminShell>
  );
}
