import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireSuperAdmin() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  if (!user) {
    // لاگین مشترک روی روت دامین
    redirect(`/admin/login?next=/superadmin/dashboard`);
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("user_id", user.id)
    .single();

  if (error || data?.role !== "super_admin") {
    redirect("/");
  }

  return { user, profile: data };
}
