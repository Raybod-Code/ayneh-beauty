import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: "پنل مدیریت | آینه",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, salon_id")
    .eq("user_id", user.id)
    .single();

  if (!profile?.role) redirect("/onboarding");

  const allowedRoles = ["owner", "admin", "secretary"];
  if (!allowedRoles.includes(profile.role)) redirect("/");

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
    <AdminShell user={user} role={profile.role} salonName={salonName}>
      {children}
    </AdminShell>
  );
}
