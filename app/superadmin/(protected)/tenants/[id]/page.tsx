import { requireSuperAdmin } from "@/lib/auth/super-admin";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import TenantDetailClient from "./TenantDetailClient";

export default async function TenantDetailPage({
  params,
}: {
  params: { id: string };
}) {
  await requireSuperAdmin();
  const supabase = await createClient();

  // Fetch tenant with related data
  const { data: tenant, error } = await supabase
    .from("tenants")
    .select(`
      *,
      members:tenant_memberships(
        id,
        role,
        created_at,
        profile:profiles(
          user_id,
          full_name,
          email,
          avatar_url
        )
      )
    `)
    .eq("id", params.id)
    .single();

  if (error || !tenant) {
    notFound();
  }

  return <TenantDetailClient tenant={tenant} />;
}
